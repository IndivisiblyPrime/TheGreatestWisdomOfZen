'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  backgroundImage?: SanityImageSource
  backgroundImageMobile?: SanityImageSource
  transitionVideoUrl?: string
  transitionVideoMobileUrl?: string
}

export function BookHero({
  backgroundImage,
  backgroundImageMobile,
  transitionVideoUrl,
  transitionVideoMobileUrl,
}: BookHeroProps) {
  const router = useRouter()
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showPrompt, setShowPrompt] = useState(false)

  const mobileVideoUrl = transitionVideoMobileUrl || transitionVideoUrl
  const mobileImage = backgroundImageMobile || backgroundImage

  // Show "Click to continue" after 5 seconds of no interaction
  useEffect(() => {
    if (!transitionVideoUrl) return
    timerRef.current = setTimeout(() => setShowPrompt(true), 5000)
    return () => clearTimeout(timerRef.current)
  }, [transitionVideoUrl])

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
