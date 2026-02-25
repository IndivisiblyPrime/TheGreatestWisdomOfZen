interface ReadOnlineSectionProps {
  title?: string
  pdfUrl?: string
}

export function ReadOnlineSection({ title, pdfUrl }: ReadOnlineSectionProps) {
  return (
    <>
      {/* Minimal top nav */}
      <nav className="flex justify-start px-8 py-4 md:px-16">
        <a href="/" className="text-sm text-black hover:opacity-60 transition-opacity">
          Home
        </a>
      </nav>

      <section className="w-full bg-white px-8 pb-16 md:px-16">
        <h2 className="mb-8 text-[80px] font-bold leading-none tracking-tight md:text-[120px]">
          {title || "Read Online"}
        </h2>

        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            className="w-full border border-black/10"
            style={{ height: "85vh" }}
            title={title || "Book PDF"}
          />
        ) : (
          <div className="flex items-center justify-center border border-black/10 bg-neutral-50" style={{ height: "85vh" }}>
            <p className="text-neutral-400 text-sm">PDF coming soon</p>
          </div>
        )}
      </section>
    </>
  )
}
