import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"

interface BookHeroProps {
  bookCoverImage?: SanityImageSource
  buyButtonText?: string
  buyButtonUrl?: string
  moreButtonText?: string
  readOnlineButtonText?: string
}

function FancyButton({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      className="btn-fancy"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span className="top-key" />
      <span className="text">{label}</span>
      <span className="bottom-key-1" />
      <span className="bottom-key-2" />
    </a>
  )
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

      {/* Fancy buttons — auto-width, centered, floating above bottom of image */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-8">
        {buyButtonUrl ? (
          <FancyButton href={buyButtonUrl} label={buyText} external />
        ) : (
          <FancyButton href="#" label={buyText} />
        )}
        <FancyButton href="/more" label={moreText} />
        <FancyButton href="/read-online" label={readOnlineText} />
      </div>
    </div>
  )
}
