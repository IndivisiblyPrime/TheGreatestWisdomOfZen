'use client'

import { useState, useEffect } from "react"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"

interface MoreSectionProps {
  bookDescription?: string
  buyButtonUrl?: string
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function MoreSection({
  bookDescription,
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

  const titleAnim     = anim('slideInLeft',  '1200ms', '300ms')
  const hrAnim        = anim('fadeIn',       '1000ms', '1100ms')
  const descAnim      = anim('slideInLeft',  '1200ms', '1800ms')
  const buyAnim       = anim('fadeIn',       '1000ms', '2800ms')
  const brushWipeAnim = anim('wipeFromLeft', '2000ms', '3800ms')
  const navAnim       = anim('fadeIn',       '1200ms', '5300ms')

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — always immediately visible */}
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

      {/* Content — centered */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-8">

        {/* Title + Description + Buy */}
        <div className="max-w-lg w-full text-center">
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
          <p className="mt-3 text-sm italic text-neutral-700" style={buyAnim}>
            Published by Neti Neti LLC
          </p>
        </div>
      </div>

      {/* Brush stroke nav bar — fixed 80px, wipes in on first visit */}
      <div
        className="absolute top-0 left-0 w-full z-20"
        style={{ ...brushWipeAnim, height: '80px', overflow: 'hidden' }}
      >
        {brushStrokeImage && (
          <img
            src={urlFor(brushStrokeImage).width(1800).url()}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '80px', objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
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
