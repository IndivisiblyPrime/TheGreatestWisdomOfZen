"use client"

import { urlFor } from "@/sanity/lib/image"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { ShootingStars } from "@/components/ui/shooting-stars"
import { StarsBackground } from "@/components/ui/stars-background"

interface BookSectionProps {
  title: string
  description?: string
  bookImage?: SanityImageSource
  buttonText?: string
  buttonUrl?: string
}

export function BookSection({ title, description, bookImage, buttonText, buttonUrl }: BookSectionProps) {
  const displayButtonText = buttonText || "Buy / View More Details"

  return (
    <section
      id="book"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-900 px-4 py-20"
    >
      <ShootingStars className="absolute inset-0 z-0" />
      <StarsBackground className="absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Title above everything */}
        <h2 className="mb-12 text-5xl font-bold tracking-tight text-white md:text-6xl">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-neutral-300 md:text-xl">
            {description}
          </p>
        )}

        {/* Book Image - preserves aspect ratio */}
        <div className="mb-12 flex justify-center">
          {bookImage ? (
            <img
              src={urlFor(bookImage).width(800).url()}
              alt={title}
              className="h-auto max-h-[600px] w-auto max-w-full rounded-lg shadow-2xl"
            />
          ) : (
            <div className="flex h-96 w-64 items-center justify-center rounded-lg bg-neutral-800">
              <span className="text-neutral-500">Book cover</span>
            </div>
          )}
        </div>

        {/* Button below image */}
        {buttonUrl ? (
          <a
            href={buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-md bg-white px-8 py-2 font-light text-[#696969] shadow-[0_4px_14px_0_rgb(0,0,0,10%)] transition duration-200 hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]"
          >
            {displayButtonText}
          </a>
        ) : (
          <button
            className="rounded-md bg-white px-8 py-2 font-light text-[#696969] shadow-[0_4px_14px_0_rgb(0,0,0,10%)] transition duration-200 hover:shadow-[0_6px_20px_rgba(93,93,93,23%)]"
          >
            {displayButtonText}
          </button>
        )}
      </div>
    </section>
  )
}
