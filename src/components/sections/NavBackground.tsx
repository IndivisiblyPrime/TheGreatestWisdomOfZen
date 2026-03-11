'use client'

import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { urlFor } from "@/sanity/lib/image"
import { ReactNode } from "react"

interface NavBackgroundProps {
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
  children: ReactNode
}

// Shared layout for /read-online and /contact: background + fixed brush stroke nav, no animation.
export function NavBackground({ backgroundImage, brushStrokeImage, children }: NavBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background — immediately visible */}
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

      {/* Content — padded below the 80px nav bar */}
      <div className="relative z-10 min-h-screen" style={{ paddingTop: '80px' }}>
        {children}
      </div>

      {/* Brush stroke nav bar — fixed 80px, no animation */}
      <div
        className="absolute top-0 left-0 w-full z-20"
        style={{
          height: '80px',
          backgroundImage: brushStrokeImage ? `url(${urlFor(brushStrokeImage).width(1800).url()})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center gap-8">
          <a href="/" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Back</a>
          <a href="/more" className="text-white text-sm font-medium hover:opacity-70 transition-opacity" onClick={() => sessionStorage.setItem('more-skip-anim', '1')}>More</a>
          <a href="/read-online" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Read Online</a>
          <a href="/contact" className="text-white text-sm font-medium hover:opacity-70 transition-opacity">Contact</a>
        </div>
      </div>

    </div>
  )
}
