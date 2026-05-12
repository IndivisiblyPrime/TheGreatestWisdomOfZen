'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  backgroundImage?: SanityImageSource
  transitionVideoUrl?: string
}

export function BookHero({ backgroundImage, transitionVideoUrl }: BookHeroProps) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)

  const navigateToMore = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/more'))
    } else {
      router.push('/more')
    }
  }, [router])

  const handleClick = useCallback(() => {
    if (transitionVideoUrl && videoRef.current) {
      // Only start playing if not already playing
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
    </div>
  )
}
