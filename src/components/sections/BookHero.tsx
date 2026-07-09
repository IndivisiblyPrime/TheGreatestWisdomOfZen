'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  backgroundImage?: SanityImageSource
  transitionVideoUrl?: string
}

export function BookHero({ backgroundImage, transitionVideoUrl }: BookHeroProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [showPrompt, setShowPrompt] = useState(false)

  // Show "Click to continue" after 7 seconds of no interaction
  useEffect(() => {
    if (!transitionVideoUrl) return
    timerRef.current = setTimeout(() => setShowPrompt(true), 7000)
    return () => clearTimeout(timerRef.current)
  }, [transitionVideoUrl])

  const navigateToAcquire = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/acquire'))
    } else {
      router.push('/acquire')
    }
  }, [router])

  const handleClick = useCallback(() => {
    clearTimeout(timerRef.current)
    setShowPrompt(false)
    if (transitionVideoUrl && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.playbackRate = 1.5
        videoRef.current.play()
      }
    } else {
      navigateToAcquire()
    }
  }, [transitionVideoUrl, navigateToAcquire])

  return (
    <div
      className="relative h-screen overflow-hidden"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Background image — fallback while video loads, or when no video */}
      <div className="absolute inset-0 z-0">
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

      {/* Video — always rendered when available, paused on first frame until clicked.
          #t=0.001 forces iOS Safari to seek + paint the first frame on load (mobile fix). */}
      {transitionVideoUrl && (
        <video
          ref={videoRef}
          src={`${transitionVideoUrl}#t=0.001`}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-10"
          onLoadedMetadata={() => {
            // Belt-and-braces: explicitly seek so the first frame renders on mobile
            if (videoRef.current && videoRef.current.currentTime === 0) {
              videoRef.current.currentTime = 0.001
            }
          }}
          onEnded={navigateToAcquire}
        />
      )}

      {/* "Click to continue" prompt — appears after 7s, smoothly fades in/out until clicked */}
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
