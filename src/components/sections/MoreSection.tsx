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

  // Before mount: hidden. After mount: let animation fill-mode:both handle initial state.
  function anim(keyframe: string, duration: string, delay: string): React.CSSProperties {
    if (!started) return { opacity: 0 }
    return { animation: `${keyframe} ${duration} ease-out ${delay} both` }
  }

  const wipeBg       = anim('wipeFromLeft', '2500ms', '0ms')
  const coverAnim    = anim('fadeIn',       '1200ms', '2000ms')
  const titleAnim    = anim('slideInLeft',  '1200ms', '3000ms')
  const hrAnim       = anim('fadeIn',       '1000ms', '3800ms')
  const descAnim     = anim('slideInLeft',  '1200ms', '4500ms')
  const buyAnim      = anim('fadeIn',       '1000ms', '5500ms')
  const brushWipeAnim = anim('wipeFromLeft','2000ms', '6500ms')
  const navAnim      = anim('fadeIn',       '1200ms', '8000ms')

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — absolute fill, wipe in from left */}
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

      {/* Content — no top padding so vertical center matches homepage exactly */}
      <div className="relative z-10 flex items-center min-h-screen px-16">
        {/* Book cover — same w-40, same pl-16 as homepage */}
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
            <p className="text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap" style={descAnim}>
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

      {/* Brush stroke nav — absolute top, wipes in after content */}
      <div className="absolute top-0 left-0 w-full z-20" style={brushWipeAnim}>
        {brushStrokeImage && (
          <img
            src={urlFor(brushStrokeImage).width(1800).url()}
            alt=""
            className="w-full object-contain"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-6" style={navAnim}>
          <a href="/" className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors">
            Back
          </a>
          <a href="/read-online" className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors">
            Read Online
          </a>
          <a href="/contact" className="bg-white/80 border border-black/20 px-4 py-1.5 text-sm hover:bg-white transition-colors">
            Contact
          </a>
        </div>
      </div>

    </div>
  )
}
