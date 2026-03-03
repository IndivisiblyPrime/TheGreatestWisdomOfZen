'use client'

import dynamic from "next/dynamic"

const PdfReader = dynamic(
  () => import('./PdfReader').then(mod => ({ default: mod.PdfReader })),
  { ssr: false }
)

interface ReadOnlineSectionProps {
  pdfUrl?: string
  readOnlineTitle?: string
}

export function ReadOnlineSection({ pdfUrl, readOnlineTitle }: ReadOnlineSectionProps) {
  return (
    <>
      <nav className="flex items-center gap-6 px-8 py-4 md:px-16">
        <a href="/" className="text-sm text-black hover:opacity-60 transition-opacity">Back</a>
        <a href="/more" className="text-sm text-black hover:opacity-60 transition-opacity">More</a>
        <a href="/read-online" className="text-sm text-black hover:opacity-60 transition-opacity">Read Online</a>
        <a href="/contact" className="text-sm text-black hover:opacity-60 transition-opacity">Contact</a>
      </nav>

      <section className="w-full px-8 pb-16 md:px-16">
        {readOnlineTitle && (
          <h1 className="text-2xl font-bold mb-8">{readOnlineTitle}</h1>
        )}
        {pdfUrl ? (
          <PdfReader pdfUrl={pdfUrl} />
        ) : (
          <p className="text-sm text-neutral-400">PDF coming soon</p>
        )}
      </section>
    </>
  )
}
