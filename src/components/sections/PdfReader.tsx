'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfReaderProps {
  pdfUrl: string
}

export function PdfReader({ pdfUrl }: PdfReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageHeight, setPageHeight] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Height-based sizing: subtract nav (80px), vertical padding (96px), buttons + gap (~80px)
    const update = () => setPageHeight(Math.min(Math.max(300, window.innerHeight - 256), 600))
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setCurrentPage(1)
  }, [])

  const changePage = useCallback((delta: number) => {
    const scrollY = window.scrollY
    setCurrentPage(p => p + delta)
    // Restore scroll position after react-pdf re-renders the new page
    setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' }), 50)
  }, [])

  const btnClass =
    'border border-black bg-white px-8 py-3 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black'

  return (
    <div className="mx-auto flex flex-col items-center" ref={containerRef}>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center border border-black/10 bg-neutral-50" style={{ height: pageHeight || '85vh' }}>
            <p className="text-neutral-400 text-sm">Loading…</p>
          </div>
        }
        error={
          <div className="flex items-center justify-center border border-black/10 bg-neutral-50" style={{ height: pageHeight || '85vh' }}>
            <p className="text-neutral-400 text-sm">Failed to load PDF.</p>
          </div>
        }
      >
        <Page
          pageNumber={currentPage}
          height={pageHeight || undefined}
          className="border border-black/10"
        />
      </Document>

      {numPages > 0 && (
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            type="button"
            className={btnClass}
            onClick={() => changePage(-1)}
            disabled={currentPage <= 1}
          >
            ← Prev
          </button>
          <span className="text-sm tabular-nums">
            {currentPage} / {numPages}
          </span>
          <button
            type="button"
            className={btnClass}
            onClick={() => changePage(1)}
            disabled={currentPage >= numPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
