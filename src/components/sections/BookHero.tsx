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

  const navigateToMore = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/more'))
    } else {
      router.push('/more')
    }
  }, [router])

  const handleClick = useCallback(() => {
    clearTimeout(timerRef.current)
    setShowPrompt(false)
    if (transitionVideoUrl && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      }
    } else {
      navigateToMore()
    }
  }, [transitionVideoUrl, navigateToMore])

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

      {/* Video — always rendered when available, paused on first frame until clicked */}
      {transitionVideoUrl && (
        <video
          ref={videoRef}
          src={transitionVideoUrl}
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-10"
          onEnded={navigateToMore}
        />
      )}

      {/* "Click to continue" prompt — appears after 7s, blinks until clicked */}
      {showPrompt && transitionVideoUrl && (
        <div
          className="absolute top-[12%] left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap"
          style={{ animation: 'blink 1.2s linear infinite' }}
        >
          <span
            className="text-white font-bold text-2xl border-2 border-black px-5 py-2 inline-block"
            style={{
              textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
            }}
          >
            Click to continue
          </span>
        </div>
      )}
    </div>
  )
}
