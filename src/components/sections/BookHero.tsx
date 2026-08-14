'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useState, useEffect, useCallback } from "react"
import { preload } from "react-dom"
import { useRouter } from "next/navigation"

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
  // Whether each <video> has buffered its full duration. Gates both playback and the
  // "Click to continue" prompt — see handleClick and the prompt-timer effect below.
  const [videoReady, setVideoReady] = useState({ desktop: false, mobile: false })

  const mobileVideoUrl = transitionVideoMobileUrl || transitionVideoUrl
  const mobileImage = backgroundImageMobile || backgroundImage
  // mobileVideoUrl always falls back to transitionVideoUrl, so whenever a video is
  // configured at all, both <video> elements are mounted and both must become ready.
  const videosReady = videoReady.desktop && videoReady.mobile

  // Poll buffered/readyState directly rather than relying on the 'canplaythrough' event:
  // verified in testing that a video can sit at readyState 4 with `buffered` covering its
  // entire duration (i.e. fully downloaded) while 'canplaythrough' never fires — a known
  // unreliability with that event. Gating exclusively on it would permanently block clicking
  // in that case. Polling buffered/readyState directly converges regardless of which events
  // the browser does or doesn't fire.
  useEffect(() => {
    if (!transitionVideoUrl) return
    const isFullyBuffered = (v: HTMLVideoElement | null) => {
      if (!v || !v.duration || Number.isNaN(v.duration)) return false
      return v.readyState >= 4 || (v.buffered.length > 0 && v.buffered.end(v.buffered.length - 1) >= v.duration - 0.25)
    }
    const check = () => {
      setVideoReady((r) => {
        const desktop = r.desktop || isFullyBuffered(desktopVideoRef.current)
        const mobile = r.mobile || isFullyBuffered(mobileVideoRef.current)
        return desktop === r.desktop && mobile === r.mobile ? r : { desktop, mobile }
      })
    }
    check()
    const interval = setInterval(check, 300)
    return () => clearInterval(interval)
  }, [transitionVideoUrl])

  // Show "Click to continue" once the video is fully buffered, then after 5s of no
  // interaction. Waiting for readiness first means the prompt never invites a click that
  // would do nothing (or worse, start playback that immediately stalls mid-buffer).
  useEffect(() => {
    if (!transitionVideoUrl || !videosReady) return
    timerRef.current = setTimeout(() => setShowPrompt(true), 5000)
    return () => clearTimeout(timerRef.current)
  }, [transitionVideoUrl, videosReady])

  // Preload /acquire's route + background/brush images as soon as the homepage mounts, so
  // the video → /acquire handoff never has to wait on a fetch. Without this, the background
  // image on /acquire is a cold fetch the moment the video ends (it's deliberately NOT
  // rendered on the homepage when a video is playing — see the "no-flash" note below — so
  // the browser has never requested it), and the route itself was never prefetched either,
  // since the click handler is a plain onClick rather than a <Link> that Next auto-prefetches.
  // Either gap paints as the page's white background for a beat, i.e. exactly the flash this
  // fixes. Uses react-dom's `preload()` resource hint rather than `new Image()` — a bare
  // `new Image()` with no retained reference can be garbage-collected mid-download, which
  // silently cancels the fetch in some browsers; `preload()` inserts a real <link> the
  // browser (and React) owns for the page's lifetime, so it can't be GC'd out from under us.
  // Runs unconditionally (even without a video) since a cached/preloaded resource is a no-op.
  useEffect(() => {
    router.prefetch('/acquire')
    if (backgroundImage) preload(urlFor(backgroundImage).width(1800).url(), { as: 'image' })
    if (backgroundImageMobile) preload(urlFor(backgroundImageMobile).width(1200).url(), { as: 'image' })
    if (brushStrokeImage) preload(urlFor(brushStrokeImage).width(1800).url(), { as: 'image' })
  }, [router, backgroundImage, backgroundImageMobile, brushStrokeImage])

  const navigateToAcquire = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/acquire'))
    } else {
      router.push('/acquire')
    }
  }, [router])

  // Matches the `md:` breakpoint (768px) used below, so JS and CSS agree on
  // which of the two video elements is currently the visible one.
  const getActiveVideoRef = useCallback(() => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
    return isDesktop ? desktopVideoRef : mobileVideoRef
  }, [])

  const handleClick = useCallback(() => {
    // Ignore clicks until the video is fully buffered — starting playback on a half-buffered
    // video causes it to freeze mid-scene waiting on more data, which reads as broken.
    // Once ready, clicking is a no-op if already playing/played.
    if (transitionVideoUrl && !videosReady) return
    clearTimeout(timerRef.current)
    setShowPrompt(false)
    if (transitionVideoUrl) {
      const video = getActiveVideoRef().current
      if (video && video.paused) {
        video.playbackRate = 2
        video.play()
      }
    } else {
      navigateToAcquire()
    }
  }, [transitionVideoUrl, videosReady, getActiveVideoRef, navigateToAcquire])

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
