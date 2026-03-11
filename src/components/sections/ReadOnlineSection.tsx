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
  readOnlineTitle?: string
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ReadOnlineSection({ pdfUrl, readOnlineTitle, backgroundImage, brushStrokeImage }: ReadOnlineSectionProps) {
  return (
    <NavBackground backgroundImage={backgroundImage} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16">
        {readOnlineTitle && (
          <h1 className="text-2xl font-bold mb-8 text-center">{readOnlineTitle}</h1>
        )}
        {pdfUrl ? (
          <PdfReader pdfUrl={pdfUrl} />
        ) : (
          <p className="text-sm text-neutral-400">PDF coming soon</p>
        )}
      </section>
    </NavBackground>
  )
}
