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
  // 'hidden'   — before client mount (SSR), everything opacity:0
  // 'animating' — first visit, run the full sequence
  // 'visible'  — revisit, show everything immediately
  const [phase, setPhase] = useState<'hidden' | 'animating' | 'visible'>('hidden')

  useEffect(() => {
    const skip = sessionStorage.getItem('more-skip-anim')
    if (skip) {
      sessionStorage.removeItem('more-skip-anim')
      setPhase('visible')
    } else {
      setPhase('animating')
    }
  }, [])

  function anim(keyframe: string, duration: string, delay: string): React.CSSProperties {
    if (phase === 'visible') return {}
    if (phase === 'hidden') return { opacity: 0 }
    return { animation: `${keyframe} ${duration} ease-out ${delay} both` }
  }

  const wipeBg        = anim('wipeFromLeft', '2500ms', '0ms')
  const titleAnim     = anim('slideInLeft',  '1200ms', '3000ms')
  const hrAnim        = anim('fadeIn',       '1000ms', '3800ms')
  const descAnim      = anim('slideInLeft',  '1200ms', '4500ms')
  const buyAnim       = anim('fadeIn',       '1000ms', '5500ms')
  const brushWipeAnim = anim('wipeFromLeft', '2000ms', '6500ms')
  const navAnim       = anim('fadeIn',       '1200ms', '8000ms')

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — wipes in on first visit, immediate on revisit */}
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

      {/* Content — vertically centered, matches homepage Enzo position */}
      <div className="relative z-10 flex items-center min-h-screen px-16">

        {/* Book cover — always immediately visible (view transition carries it from homepage) */}
        {bookCoverImage && (
          <img
            src={urlFor(bookCoverImage).width(400).url()}
            alt="Book cover"
            className="w-40 h-auto flex-shrink-0"
            style={{ viewTransitionName: 'book-cover' }}
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
          <a
            href={buyButtonUrl}
            className="mt-6 inline-block border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition-colors"
            style={buyAnim}
          >
            Buy
          </a>
        </div>
      </div>

      {/* Brush stroke nav bar — fixed 80px, wipes in on first visit */}
      <div
        className="absolute top-0 left-0 w-full z-20"
        style={{
          ...brushWipeAnim,
          height: '80px',
          backgroundImage: brushStrokeImage ? `url(${urlFor(brushStrokeImage).width(1800).url()})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-8" style={navAnim}>
          <a href="/" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Back</a>
          <a href="/more" className="text-white text-sm font-medium hover:opacity-70 transition-opacity" onClick={() => sessionStorage.setItem('more-skip-anim', '1')}>More</a>
          <a href="/read-online" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Read Online</a>
          <a href="/contact" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Contact</a>
        </div>
      </div>

    </div>
  )
}
