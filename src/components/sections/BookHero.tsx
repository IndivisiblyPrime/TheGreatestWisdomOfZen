import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
  buyButtonText?: string
  buyButtonUrl?: string
  moreButtonText?: string
  readOnlineButtonText?: string
}

export function BookHero({
  bookCoverImage,
  buyButtonText,
  buyButtonUrl,
  moreButtonText,
  readOnlineButtonText,
}: BookHeroProps) {
  const buyText = buyButtonText || "Buy"
  const moreText = moreButtonText || "More"
  const readOnlineText = readOnlineButtonText || "Read Online"

  const buttonClass =
    "bg-white border border-black py-2 px-4 text-sm text-center transition-colors hover:bg-black hover:text-white"

  return (
    <div className="relative">
      {bookCoverImage ? (
        <img
          src={urlFor(bookCoverImage).width(2000).url()}
          alt="Book cover"
          className="block w-full h-auto"
        />
      ) : (
        <div className="flex items-center justify-center bg-neutral-100 min-h-screen">
          <span className="text-neutral-400">Book cover image</span>
        </div>
      )}

      {/* Buttons inset and floating near the bottom of the image */}
      <div className="absolute bottom-6 left-8 right-8 grid grid-cols-3 gap-4 md:left-16 md:right-16">
        {buyButtonUrl ? (
          <a
            href={buyButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
          >
            {buyText}
          </a>
        ) : (
          <span className={buttonClass}>{buyText}</span>
        )}
        <a href="/more" className={buttonClass}>
          {moreText}
        </a>
        <a href="/read-online" className={buttonClass}>
          {readOnlineText}
        </a>
      </div>
    </div>
  )
}
