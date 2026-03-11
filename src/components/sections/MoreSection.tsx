'use client'

import { useState, useEffect } from "react"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"

interface MoreSectionProps {
  bookDescription?: string
  bookCoverImage?: SanityImageSource
  bookPageImage?: SanityImageSource
  buyButtonUrl?: string
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function MoreSection({
  bookDescription,
  bookCoverImage,
  bookPageImage,
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

  // Animation sequence:
  // 0ms    — Enso: always immediately visible (view transition from homepage)
  // 0ms    — Book page image: fades in (if provided)
  // 600ms  — Background: wipes in from left
  // 3600ms — Title
  // 4400ms — HR
  // 5100ms — Description
  // 6100ms — Buy button
  // 7100ms — Brush stroke nav
  // 8600ms — Nav buttons
  const bookPageAnim  = anim('fadeIn',       '500ms',  '0ms')
  const wipeBg        = anim('wipeFromLeft', '2500ms', '600ms')
  const titleAnim     = anim('slideInLeft',  '1200ms', '3600ms')
  const hrAnim        = anim('fadeIn',       '1000ms', '4400ms')
  const descAnim      = anim('slideInLeft',  '1200ms', '5100ms')
  const buyAnim       = anim('fadeIn',       '1000ms', '6100ms')
  const brushWipeAnim = anim('wipeFromLeft', '2000ms', '7100ms')
  const navAnim       = anim('fadeIn',       '1200ms', '8600ms')

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

      {/* Content — vertically centered, matches homepage Enso position */}
      <div className="relative z-10 flex items-center min-h-screen px-16">

        {/* Enso + optional book page image group */}
        {bookCoverImage && (
          bookPageImage ? (
            // Book page image behind Enso — both in a single relative container so they move together
            <div className="relative flex-shrink-0">
              {/* Book image — defines the container size, animates in first */}
              <img
                src={urlFor(bookPageImage).width(500).url()}
                alt="Book"
                className="block w-52 h-auto"
                style={bookPageAnim}
              />
              {/* Enso — overlaid centered on book, always immediately visible */}
              <img
                src={urlFor(bookCoverImage).width(400).url()}
                alt="Book cover"
                className="absolute inset-0 w-full h-full object-contain"
                style={{ viewTransitionName: 'book-cover' }}
              />
            </div>
          ) : (
            // No book page image — Enso only (current behaviour)
            <img
              src={urlFor(bookCoverImage).width(400).url()}
              alt="Book cover"
              className="w-40 h-auto flex-shrink-0"
              style={{ viewTransitionName: 'book-cover' }}
            />
          )
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
          overflow: 'hidden',
          backgroundImage: brushStrokeImage ? `url(${urlFor(brushStrokeImage).width(1800).url()})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-8" style={navAnim}>
          <a href="/" className="text-white text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap">Back</a>
          <a href="/more" className="text-white text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap" onClick={() => sessionStorage.setItem('more-skip-anim', '1')}>More</a>
          <a href="/read-online" className="text-white text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap">Read Online</a>
          <a href="/contact" className="text-white text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap">Contact</a>
        </div>
      </div>

    </div>
  )
}
