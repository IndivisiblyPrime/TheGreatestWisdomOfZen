import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
}

export function BookHero({ bookCoverImage }: BookHeroProps) {
  return (
    <div className="h-screen flex items-center justify-center">
      {bookCoverImage ? (
        <a href="/more" className="cursor-pointer">
          <img
            src={urlFor(bookCoverImage).width(2000).url()}
            alt="Book cover"
            className="max-h-[85vh] w-auto"
          />
        </a>
      ) : (
        <div className="flex items-center justify-center bg-neutral-100 min-h-screen w-full">
          <span className="text-neutral-400">Book cover image</span>
        </div>
      )}
    </div>
  )
}
