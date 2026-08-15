'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useState, useEffect, useCallback } from "react"
import { preload } from "react-dom"
import { useRouter } from "next/navigation"

// A video is "ready" only once its whole duration is buffered, so playback can't stall
// mid-scene. Deliberately derived from buffered/readyState rather than the
// 'canplaythrough' event: a video can sit at readyState 4 with buffered covering its
// entire duration while that event never fires at all (verified under throttling), and
// gating on it alone would leave the page permanently unclickable in that case.
function isFullyBuffered(v: HTMLVideoElement | null): boolean {
  if (!v || !v.duration || Number.isNaN(v.duration)) return false
  if (v.readyState >= 4) return true
  return v.buffered.length > 0 && v.buffered.end(v.buffered.length - 1) >= v.duration - 0.25
}

interface BookHeroProps {
  backgroundImage?: SanityImageSource
  backgroundImageMobile?: SanityImageSource
  brushStrokeImage?: SanityImageSource
  transitionVideoUrl?: string
  transitionVideoMobileUrl?: string
}

export function BookHero({
  backgroundImage,
  backgroundImageMobile,
  brushStrokeImage,
  transitionVideoUrl,
  transitionVideoMobileUrl,
}: BookHeroProps) {
  const router = useRouter()
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showPrompt, setShowPrompt] = useState(false)
  // Whether the on-screen <video> has buffered its full duration. This drives the "Click
  // to continue" prompt only — being up to one poll interval stale is harmless there.
  // handleClick deliberately does NOT use it; see the note there.
  const [activeVideoReady, setActiveVideoReady] = useState(false)
  // Set the instant the video ends, to paint /acquire's background over it before we
  // navigate — see navigateToAcquire below.
  const [showEndFrame, setShowEndFrame] = useState(false)
  // Holds the pre-decoded destination images so they can't be garbage-collected before use.
  const decodedRef = useRef<HTMLImageElement[]>([])

  const mobileVideoUrl = transitionVideoMobileUrl || transitionVideoUrl
  const mobileImage = backgroundImageMobile || backgroundImage

  // Track whether the on-screen video has finished buffering. Polled rather than driven by
  // 'canplaythrough' — see isFullyBuffered above for why that event can't be trusted here.
  // Re-reads the active ref each tick, so a mid-session resize across the breakpoint starts
  // reflecting whichever video is now on screen.
  useEffect(() => {
    if (!transitionVideoUrl) return
    const check = () => {
      const isDesktop = window.matchMedia('(min-width: 768px)').matches
      const active = isDesktop ? desktopVideoRef.current : mobileVideoRef.current
      setActiveVideoReady(isFullyBuffered(active))
    }
    check()
    const interval = setInterval(check, 300)
    return () => clearInterval(interval)
  }, [transitionVideoUrl])

  // Show "Click to continue" once the video is fully buffered, then after 5s of no
  // interaction. Waiting for readiness first means the prompt never invites a click that
  // would do nothing (or worse, start playback that immediately stalls mid-buffer).
  useEffect(() => {
    if (!transitionVideoUrl || !activeVideoReady) return
    timerRef.current = setTimeout(() => setShowPrompt(true), 5000)
    return () => clearTimeout(timerRef.current)
  }, [transitionVideoUrl, activeVideoReady])

  // Warm everything /acquire needs while the homepage is still on screen, so the handoff
  // never waits on the network. Without this the route was never prefetched (the click
  // handler is a plain onClick, not a <Link> that Next auto-prefetches) and /acquire's
  // background photo had never even been requested, because it is deliberately not rendered
  // on the homepage while a video is configured (see the layering note further down).
  // Runs unconditionally — a cached resource makes this a no-op.
  //
  // `preload()` rather than a bare `new Image()` for the fetch: an image object with no
  // retained reference can be garbage-collected mid-download, which silently cancels it in
  // some browsers, whereas preload() inserts a real <link> the browser owns for the page's
  // lifetime. The retained-and-decoded images below are a separate concern — see there.
  useEffect(() => {
    router.prefetch('/acquire')
    const urls = [
      backgroundImage ? urlFor(backgroundImage).width(1800).url() : null,
      backgroundImageMobile ? urlFor(backgroundImageMobile).width(1200).url() : null,
      brushStrokeImage ? urlFor(brushStrokeImage).width(1800).url() : null,
    ].filter((u): u is string => u !== null)

    urls.forEach((url) => preload(url, { as: 'image' }))

    // Fetching the bytes is only half the job: decoding them to a bitmap is a separate,
    // asynchronous step, and an <img> whose bitmap isn't ready yet paints nothing at all.
    // That is the gap that survives a plain preload — so decode each image up front, while
    // the video is still playing, and hold the elements in a ref so nothing is collected
    // early. By the time the video ends, the destination bitmaps are ready to paint on the
    // very next frame.
    decodedRef.current = urls.map((url) => {
      const img = new window.Image()
      img.src = url
      img.decode?.().catch(() => {})
      return img
    })
  }, [router, backgroundImage, backgroundImageMobile, brushStrokeImage])

  // Hard cut to /acquire — deliberately NOT wrapped in document.startViewTransition.
  //
  // The whole design is that the video's last frame IS /acquire's background image (verified:
  // the video and image aspect ratios match to within 0.15%, so `object-cover` crops them
  // identically), which makes an instant cut invisible. A cross-fade between two identical
  // frames can therefore never look better than a cut — but it can look worse: the UA's
  // default root transition fades the outgoing and incoming snapshots simultaneously, and
  // unless the engine composites them with `mix-blend-mode: plus-lighter` inside an isolated
  // group, the two partial opacities let the page canvas show through mid-fade. That canvas
  // was pure white against a warm sand photo — the reported flash. Chrome does apply
  // plus-lighter (confirmed via getComputedStyle on ::view-transition-old/new(root)), which
  // is exactly why this reproduced on Safari but never in Chrome-based testing.
  //
  // It was also mis-wired: App Router's router.push() returns undefined rather than a promise,
  // so startViewTransition captured its "new" snapshot before React had rendered /acquire at
  // all — animating old→old while the real swap happened afterwards, unprotected.
  //
  // Before navigating, paint /acquire's background image over the ended video and let it land
  // (two rAFs = one guaranteed painted frame). Since it's the same image, this is visually a
  // no-op, but it guarantees the destination bitmap is decoded and on screen before the route
  // swap, so /acquire's own <img> can't be caught mid-decode. The failure mode is benign: if
  // the overlay hasn't painted yet, the video's identical last frame is still underneath it.
  //
  // The timeout is not belt-and-braces: rAF callbacks are throttled or suspended entirely in
  // a backgrounded tab, so hanging the navigation off rAF alone risks stranding someone on
  // the homepage forever if they switch away while the video finishes. Whichever path fires
  // first wins; `navigated` keeps it to exactly one push.
  const navigateToAcquire = useCallback(() => {
    setShowEndFrame(true)
    let navigated = false
    const go = () => {
      if (navigated) return
      navigated = true
      router.push('/acquire')
    }
    requestAnimationFrame(() => requestAnimationFrame(go))
    setTimeout(go, 150)
  }, [router])

  // Matches the `md:` breakpoint (768px) used below, so JS and CSS agree on
  // which of the two video elements is currently the visible one.
  const getActiveVideoRef = useCallback(() => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
    return isDesktop ? desktopVideoRef : mobileVideoRef
  }, [])

  const handleClick = useCallback(() => {
    if (!transitionVideoUrl) {
      navigateToAcquire()
      return
    }
    // Read buffering straight off the element rather than from `videoReady` state. That
    // state is refreshed on a 300ms interval, so a click landing in the window after the
    // video finished buffering but before the next poll would be silently dropped — the
    // user clicks, nothing happens. Checking the element is always current.
    //
    // Only the video actually on screen is checked: the off-breakpoint one is never seen,
    // so waiting on it would block, say, a desktop visitor on the mobile video's download.
    //
    // play() stays inside this gesture-initiated call. Deferring it to fire later, once
    // buffering completes, would drop it out of the user-gesture context and risk being
    // blocked by autoplay policy on iOS — so an early click is ignored rather than queued.
    const video = getActiveVideoRef().current
    if (!isFullyBuffered(video)) return
    clearTimeout(timerRef.current)
    setShowPrompt(false)
    if (video && video.paused) {
      video.playbackRate = 2
      video.play()
    }
  }, [transitionVideoUrl, getActiveVideoRef, navigateToAcquire])

  return (
    <div
      className="fixed inset-0 overflow-hidden overscroll-none"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Black backdrop — sits behind everything so there's never a gap for the background
          photo to flash through while a video's first frame is still decoding. Only ever
          visible for the imperceptible instant before the video paints. */}
      <div className="absolute inset-0 z-0 bg-black" />

      {/* Background image — ONLY the true fallback when no video is configured for this
          breakpoint. Deliberately never rendered underneath a video: video elements paint
          nothing until their first frame decodes, and this image loads/paints instantly, so
          rendering it unconditionally caused a brief flash of the photo before the video
          appeared. Desktop/mobile variants swap via CSS, so they stay in sync with a resized
          browser. */}
      {!transitionVideoUrl && (
        <div className="absolute inset-0 z-0 hidden md:block">
          {backgroundImage ? (
            <img
              src={urlFor(backgroundImage).width(1800).url()}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100" />
          )}
        </div>
      )}
      {!mobileVideoUrl && (
        <div className="absolute inset-0 z-0 md:hidden">
          {mobileImage ? (
            <img
              src={urlFor(mobileImage).width(1200).url()}
              alt=""
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100" />
          )}
        </div>
      )}

      {/* Video — always rendered when available, paused on first frame until clicked.
          #t=0.001 forces iOS Safari to seek + paint the first frame on load (mobile fix).
          Both desktop and mobile videos are mounted and preloaded; CSS picks which is
          shown so a mid-session resize never shows the wrong one. */}
      {transitionVideoUrl && (
        <video
          ref={desktopVideoRef}
          src={`${transitionVideoUrl}#t=0.001`}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-10 hidden md:block"
          onLoadedMetadata={() => {
            if (desktopVideoRef.current && desktopVideoRef.current.currentTime === 0) {
              desktopVideoRef.current.currentTime = 0.001
            }
          }}
          onEnded={navigateToAcquire}
        />
      )}
      {mobileVideoUrl && (
        <video
          ref={mobileVideoRef}
          src={`${mobileVideoUrl}#t=0.001`}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-10 md:hidden"
          onLoadedMetadata={() => {
            if (mobileVideoRef.current && mobileVideoRef.current.currentTime === 0) {
              mobileVideoRef.current.currentTime = 0.001
            }
          }}
          onEnded={navigateToAcquire}
        />
      )}

      {/* Destination still — /acquire's exact background image, laid over the ended video for
          the frame or two before the route swap. Same URLs, widths and object-fit as
          AcquireSection renders, and the same desktop/mobile CSS swap as the videos above, so
          it lands pixel-identical to both the video's last frame and the page we're heading to.
          Only mounted once the video has ended (never during playback), so it does not
          reintroduce the "photo visible before the video paints" problem described above. */}
      {showEndFrame && transitionVideoUrl && (
        <>
          <div className="absolute inset-0 z-20 hidden md:block">
            {backgroundImage && (
              <img
                src={urlFor(backgroundImage).width(1800).url()}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>
          <div className="absolute inset-0 z-20 md:hidden">
            {mobileImage && (
              <img
                src={urlFor(mobileImage).width(1200).url()}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            )}
          </div>
        </>
      )}

      {/* "Click to continue" prompt — appears after 5s, smoothly fades in/out until clicked */}
      {showPrompt && transitionVideoUrl && (
        <div
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap"
          style={{ animation: 'pulseFade 3.5s ease-in-out infinite' }}
        >
          <span className="text-black font-bold text-2xl">
            Click to continue
          </span>
        </div>
      )}
    </div>
  )
}
