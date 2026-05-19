'use client'

import dynamic from "next/dynamic"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { NavBackground } from "./NavBackground"

const PdfReader = dynamic(
  () => import('./PdfReader').then(mod => ({ default: mod.PdfReader })),
  { ssr: false }
)

interface ReadOnlineSectionProps {
  pdfUrl?: string
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ReadOnlineSection({ pdfUrl, backgroundImage, brushStrokeImage }: ReadOnlineSectionProps) {
  return (
    <NavBackground backgroundImage={backgroundImage} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16">
        {pdfUrl ? (
          <PdfReader pdfUrl={pdfUrl} />
        ) : (
          <p className="text-sm text-neutral-400">PDF coming soon</p>
        )}
        <p className="mt-8 text-sm text-center text-neutral-600 italic">
          Note: This is a blank book. That&apos;s the joke. May its humor and simplicity bring clarity or at least a good laugh
        </p>
        <p className="mt-3 text-sm text-center text-neutral-600 italic">
          Published by Neti Neti LLC
        </p>
      </section>
    </NavBackground>
  )
}
