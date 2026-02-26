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

  const btnClass =
    "border border-black bg-white px-8 py-3 text-sm text-black transition-colors hover:bg-black hover:text-white"

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

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-8">
        {buyButtonUrl ? (
          <a href={buyButtonUrl} target="_blank" rel="noopener noreferrer" className={btnClass}>
            {buyText}
          </a>
        ) : (
          <span className={btnClass}>{buyText}</span>
        )}
        <a href="/more" className={btnClass}>{moreText}</a>
        <a href="/read-online" className={btnClass}>{readOnlineText}</a>
      </div>
    </div>
  )
}
