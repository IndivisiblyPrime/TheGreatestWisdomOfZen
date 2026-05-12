'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  backgroundImage?: SanityImageSource
  transitionVideoUrl?: string
}

export function BookHero({ backgroundImage, transitionVideoUrl }: BookHeroProps) {
  const router = useRouter()
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const navigateToMore = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/more'))
    } else {
      router.push('/more')
    }
  }, [router])

  const handleClick = useCallback(() => {
    if (transitionVideoUrl) {
      setShowVideo(true)
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
      {/* Background image — always visible, seamless with /more */}
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

      {/* Fullscreen video overlay — shown on click */}
      {showVideo && transitionVideoUrl && (
        <div className="fixed inset-0 z-50">
          <video
            ref={videoRef}
            key={transitionVideoUrl}
            src={transitionVideoUrl}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            onEnded={navigateToMore}
          />
        </div>
      )}
    </div>
  )
}
