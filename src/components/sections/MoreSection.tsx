'use client'

import { useState, useEffect } from "react"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"

interface MoreSectionProps {
  bookDescription?: string
  bookCoverImage?: SanityImageSource
  buyButtonUrl?: string
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function MoreSection({
  bookDescription,
  bookCoverImage,
  buyButtonUrl,
  backgroundImage,
  brushStrokeImage,
}: MoreSectionProps) {
  const [started, setStarted] = useState(false)
  useEffect(() => { setStarted(true) }, [])

  function anim(keyframe: string, duration: string, delay: string): React.CSSProperties {
    return started
      ? { animation: `${keyframe} ${duration} ease-out ${delay} both`, opacity: 0 }
      : { opacity: 0 }
  }

  const wipeBg = anim('wipeFromLeft', '900ms', '0ms')
  const coverAnim = anim('fadeIn', '400ms', '700ms')
  const titleAnim = anim('slideInLeft', '400ms', '1100ms')
  const hrAnim = anim('fadeIn', '300ms', '1300ms')
  const descAnim = anim('slideInLeft', '350ms', '1400ms')
  const buyAnim = anim('fadeIn', '300ms', '1700ms')
  const brushWipeAnim = anim('wipeFromLeft', '700ms', '2000ms')
  const navAnim = anim('fadeIn', '400ms', '2600ms')

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background — absolute fill, wipe animation */}
      <div className="absolute inset-0 z-0" style={wipeBg}>
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

      {/* Content — sits above background */}
      <div className="relative z-10 flex items-center min-h-screen px-16 pt-20">
        {/* Book cover */}
        {bookCoverImage && (
          <img
            src={urlFor(bookCoverImage).width(400).url()}
            alt="Book cover"
            className="w-40 h-auto flex-shrink-0"
            style={{ viewTransitionName: 'book-cover', ...coverAnim }}
          />
        )}

        {/* Title + Description + Buy */}
        <div className="ml-12 max-w-lg">
          <h1 className="text-3xl font-bold" style={titleAnim}>
            The Greatest Wisdom of Zen
          </h1>
          <hr className="border-black my-4" style={hrAnim} />
          {bookDescription && (
            <p className="text-sm leading-relaxed text-neutral-800" style={descAnim}>
              {bookDescription}
            </p>
          )}
          {buyButtonUrl && (
            <a
              href={buyButtonUrl}
              className="mt-6 inline-block border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors"
              style={buyAnim}
            >
              Buy
            </a>
          )}
        </div>
      </div>

      {/* Brush stroke nav — absolute top, wipe animation */}
      <div className="absolute top-0 left-0 w-full z-20" style={brushWipeAnim}>
        {brushStrokeImage && (
          <img
            src={urlFor(brushStrokeImage).width(1800).url()}
            alt=""
            className="w-full object-contain"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-6" style={navAnim}>
          <a
            href="/"
            className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors"
          >
            Back
          </a>
          <a
            href="/read-online"
            className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors"
          >
            Read Online
          </a>
          <a
            href="/contact"
            className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  )
}
