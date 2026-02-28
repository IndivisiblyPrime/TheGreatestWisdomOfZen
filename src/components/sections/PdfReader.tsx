'use client'

import { useState, useCallback } from 'react'
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

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setCurrentPage(1)
  }, [])

  const btnClass =
    'border border-black bg-white px-8 py-3 text-sm text-black transition-colors hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black'

  return (
    <div className="max-w-2xl mx-auto">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex items-center justify-center border border-black/10 bg-neutral-50" style={{ height: '85vh' }}>
            <p className="text-neutral-400 text-sm">Loading…</p>
          </div>
        }
        error={
          <div className="flex items-center justify-center border border-black/10 bg-neutral-50" style={{ height: '85vh' }}>
            <p className="text-neutral-400 text-sm">Failed to load PDF.</p>
          </div>
        }
      >
        <Page
          pageNumber={currentPage}
          width={undefined}
          className="border border-black/10"
        />
      </Document>

      {numPages > 0 && (
        <div className="flex items-center justify-center gap-6 mt-6">
          <button
            className={btnClass}
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage <= 1}
          >
            ← Prev
          </button>
          <span className="text-sm tabular-nums">
            {currentPage} / {numPages}
          </span>
          <button
            className={btnClass}
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= numPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
