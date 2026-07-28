'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"
import { fraunces, garamond } from "@/lib/fonts"
import { inkCard, inkRule, inkHeading, inkBody, inkMuted, inkButton, inkNavLink, DISPLAY_OPSZ } from "@/lib/theme"

interface AcquireSectionProps {
  bookDescription?: string
  buyButtonUrl?: string
  backgroundImage?: SanityImageSource
  backgroundImageMobile?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function AcquireSection({
  bookDescription,
  buyButtonUrl,
  backgroundImage,
  backgroundImageMobile,
  brushStrokeImage,
}: AcquireSectionProps) {
  const mobileImage = backgroundImageMobile || backgroundImage
  const pathname = usePathname()
  const linkClass = (href: string) =>
    `${inkNavLink} ${pathname === href ? 'underline underline-offset-4' : ''}`
  // 'hidden'   — before client mount (SSR), everything opacity:0
  // 'animating' — first visit, run the full sequence
  // 'visible'  — revisit, show everything immediately
  const [phase, setPhase] = useState<'hidden' | 'animating' | 'visible'>('hidden')

  // Must read sessionStorage post-mount (server has no access to it), so this
  // client-only phase transition is an intentional exception to the set-state-in-effect rule.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const skip = sessionStorage.getItem('acquire-skip-anim')
    if (skip) {
      sessionStorage.removeItem('acquire-skip-anim')
      setPhase('visible')
    } else {
      setPhase('animating')
    }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  function anim(keyframe: string, duration: string, delay: string): React.CSSProperties {
    if (phase === 'visible') return {}
    if (phase === 'hidden') return { opacity: 0 }
    return { animation: `${keyframe} ${duration} ease-out ${delay} both` }
  }

  // The brush stroke nav and the content card share one identical left-to-right wipe —
  // same keyframe, duration, delay and easing — so they sweep in lockstep and land
  // together at 3290ms. The card's clip-path gates the text inside it, so that shared
  // finish is also when the description finishes revealing. Nav links follow right after.
  const WIPE_DURATION = '2040ms'
  const WIPE_DELAY    = '1250ms'
  const backdropWipeAnim = anim('wipeFromLeft', WIPE_DURATION, WIPE_DELAY)
  const brushWipeAnim    = anim('wipeFromLeft', WIPE_DURATION, WIPE_DELAY)
  // Title, description, Acquire button and publisher line share ONE identical reveal —
  // same keyframe, duration and delay — so they all slide in together as a single motion,
  // matching the title exactly (per request). Keep them on these shared constants so they
  // can't drift apart. (buyAnim drives both the Acquire button and the publisher line.)
  const TEXT_DURATION = '660ms'
  const TEXT_DELAY    = '1250ms'
  const titleAnim       = anim('slideInLeft', TEXT_DURATION, TEXT_DELAY)
  const descAnim        = anim('slideInLeft', TEXT_DURATION, TEXT_DELAY)
  const buyAnim         = anim('slideInLeft', TEXT_DURATION, TEXT_DELAY)
  const hrAnim          = anim('fadeIn',      '500ms',  '1700ms')
  const navAnim         = anim('fadeIn',      '660ms',  '3290ms')

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — fixed to viewport (not absolute) so it can't stretch/re-crop if content
          overflows min-h-screen; desktop/mobile variants swap via CSS so they stay in sync with a
          resized browser. */}
      <div className="fixed inset-0 z-0 hidden md:block">
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
      <div className="fixed inset-0 z-0 md:hidden">
        {mobileImage ? (
          <img
            src={urlFor(mobileImage).width(1200).url()}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100" />
        )}
      </div>

      {/* Content — centered. The vertical padding is load-bearing on short phones: the card
          is taller than the viewport there, and without it the flex centering pulls the card's
          top edge under the 80px brush-stroke nav and hides the title. */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 md:px-8 py-24 md:py-12">

        {/* Title + Description + Acquire — block stays centered, text aligns left.
            Width is deliberately pinned at max-w-lg: the card sits in the gap between the
            book and the branch in the background photo, so it can grow taller but not wider. */}
        <div
          className={`max-w-lg w-full text-left ${inkCard} p-6 md:p-9`}
          style={{ ...backdropWipeAnim, overflow: 'hidden' }}
        >
          <h1
            className={`${fraunces.className} text-[34px] font-medium leading-[1.18] ${inkHeading}`}
            style={{ ...titleAnim, fontVariationSettings: DISPLAY_OPSZ }}
          >
            The Greatest Wisdom of Zen
          </h1>
          <hr className={`${inkRule} my-5`} style={hrAnim} />
          {bookDescription && (
            <p className={`${garamond.className} text-[19px] leading-[1.62] ${inkBody} whitespace-pre-wrap`} style={descAnim}>
              {bookDescription}
            </p>
          )}
          <a
            href={buyButtonUrl}
            className={`mt-7 ${inkButton} px-[26px] py-3 text-[12.5px]`}
            style={buyAnim}
          >
            Acquire
          </a>
          <p className={`${fraunces.className} mt-[18px] text-[13px] italic ${inkMuted}`} style={buyAnim}>
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
          <Link href="/" className={linkClass('/')}>Back</Link>
          <a href="/acquire" className={linkClass('/acquire')} onClick={() => sessionStorage.setItem('acquire-skip-anim', '1')}>Acquire</a>
          <a href="/reviews" className={linkClass('/reviews')}>Reviews</a>
          <a href="/contact" className={linkClass('/contact')}>Contact</a>
        </div>
      </div>

    </div>
  )
}
