import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
  buyButtonText?: string
  buyButtonUrl?: string
  moreButtonText?: string
}

export function BookHero({
  bookCoverImage,
  buyButtonText,
  buyButtonUrl,
  moreButtonText,
}: BookHeroProps) {
  const buyText = buyButtonText || "Buy"
  const moreText = moreButtonText || "More"

  return (
    <div>
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

      <div className="grid grid-cols-2 gap-4 px-8 py-10 md:px-16">
        {buyButtonUrl ? (
          <a
            href={buyButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-black py-10 text-xl text-center transition-colors hover:bg-black hover:text-white"
          >
            {buyText}
          </a>
        ) : (
          <span className="border border-black py-10 text-xl text-center">
            {buyText}
          </span>
        )}
        <a
          href="/more"
          className="border border-black py-10 text-xl text-center transition-colors hover:bg-black hover:text-white"
        >
          {moreText}
        </a>
      </div>
    </div>
  )
}
