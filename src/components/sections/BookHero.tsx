'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useCallback, useState } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
  transitionVideoUrl?: string
}

export function BookHero({ bookCoverImage, transitionVideoUrl }: BookHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const router = useRouter()
  const [cursor, setCursor] = useState<'default' | 'pointer'>('default')
  const [showVideo, setShowVideo] = useState(false)

  const handleLoad = useCallback(() => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(img, 0, 0)
  }, [])

  const samplePixel = useCallback((e: React.MouseEvent<HTMLDivElement>): boolean => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) return true
    const rect = img.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) * img.naturalWidth / rect.width)
    const y = Math.floor((e.clientY - rect.top) * img.naturalHeight / rect.height)
    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) return true
      const pixel = ctx.getImageData(x, y, 1, 1).data
      return pixel[0] + pixel[1] + pixel[2] < 300
    } catch {
      return true
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setCursor(samplePixel(e) ? 'pointer' : 'default')
  }, [samplePixel])

  const handleMouseLeave = useCallback(() => {
    setCursor('default')
  }, [])

  const navigateToMore = useCallback(() => {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => router.push('/more'))
    } else {
      router.push('/more')
    }
  }, [router])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!samplePixel(e)) return
    if (transitionVideoUrl) {
      setShowVideo(true)
    } else {
      navigateToMore()
    }
  }, [samplePixel, transitionVideoUrl, navigateToMore])

  return (
    <div className="h-screen flex items-center justify-center">
      {bookCoverImage ? (
        <div
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ cursor }}
        >
          <canvas ref={canvasRef} className="hidden" />
          <img
            ref={imgRef}
            src={urlFor(bookCoverImage).width(400).url()}
            alt="Book cover"
            className="w-40 h-auto"
            style={{ viewTransitionName: 'book-cover' }}
            crossOrigin="anonymous"
            onLoad={handleLoad}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-neutral-100 min-h-screen w-full">
          <span className="text-neutral-400">Book cover image</span>
        </div>
      )}

      {showVideo && transitionVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black">
          <video
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
