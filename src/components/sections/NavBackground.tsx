'use client'

import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

interface NavBackgroundProps {
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
  children: ReactNode
}

// Shared layout for /read-online and /contact: background + fixed brush stroke nav, no animation.
export function NavBackground({ backgroundImage, brushStrokeImage, children }: NavBackgroundProps) {
  const pathname = usePathname()
  const linkClass = (href: string) =>
    `text-white text-sm font-medium hover:opacity-70 transition-opacity whitespace-nowrap ${pathname === href ? 'underline underline-offset-4' : ''}`

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — fixed to viewport so tall content (e.g. PDF) doesn't scale it */}
      <div className="fixed inset-0 z-0">
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

      {/* Content — padded below the 80px nav bar */}
      <div className="relative z-10 min-h-screen" style={{ paddingTop: '80px' }}>
        {children}
      </div>

      {/* Brush stroke nav bar — fixed 80px, no animation */}
      <div
        className="absolute top-0 left-0 w-full z-20"
        style={{ height: '80px', overflow: 'hidden' }}
      >
        {brushStrokeImage && (
          <img
            src={urlFor(brushStrokeImage).width(1800).url()}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '80px', objectFit: 'cover', objectPosition: 'center' }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <a href="/" className={linkClass('/')}>Back</a>
          <a href="/acquire" className={linkClass('/acquire')} onClick={() => sessionStorage.setItem('acquire-skip-anim', '1')}>Acquire</a>
          <a href="/reviews" className={linkClass('/reviews')}>Reviews</a>
          <a href="/contact" className={linkClass('/contact')}>Contact</a>
        </div>
      </div>

    </div>
  )
}
