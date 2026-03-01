'use client'

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { useRef, useCallback } from "react"
import { useRouter } from "next/navigation"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
}

export function BookHero({ bookCoverImage }: BookHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const router = useRouter()

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

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const img = imgRef.current
    const canvas = canvasRef.current
    if (!img || !canvas) {
      router.push('/more')
      return
    }
    const rect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / rect.width
    const scaleY = img.naturalHeight / rect.height
    const x = Math.floor((e.clientX - rect.left) * scaleX)
    const y = Math.floor((e.clientY - rect.top) * scaleY)
    try {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const pixel = ctx.getImageData(x, y, 1, 1).data
      const [r, g, b] = pixel
      if (r + g + b < 300) {
        router.push('/more')
      }
    } catch {
      router.push('/more')
    }
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center">
      {bookCoverImage ? (
        <div onClick={handleClick} className="cursor-pointer">
          <canvas ref={canvasRef} className="hidden" />
          <img
            ref={imgRef}
            src={urlFor(bookCoverImage).width(2000).url()}
            alt="Book cover"
            className="max-h-[85vh] w-auto"
            crossOrigin="anonymous"
            onLoad={handleLoad}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-neutral-100 min-h-screen w-full">
          <span className="text-neutral-400">Book cover image</span>
        </div>
      )}
    </div>
  )
}
