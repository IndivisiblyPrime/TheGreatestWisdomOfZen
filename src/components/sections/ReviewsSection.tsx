'use client'

import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { NavBackground } from "./NavBackground"

// ─── Stars ─────────────────────────────────────────────────────────────────────

function Star({ fill }: { fill: 'full' | 'half' | 'empty' }) {
  if (fill === 'half') {
    return (
      <span className="relative inline-block">
        <span className="text-neutral-300">★</span>
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: '50%' }}>
          <span className="text-black">★</span>
        </span>
      </span>
    )
  }
  return <span className={fill === 'full' ? 'text-black' : 'text-neutral-300'}>★</span>
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={className} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} fill={rating >= i ? 'full' : rating >= i - 0.5 ? 'half' : 'empty'} />
      ))}
    </span>
  )
}

// ─── Reviews data ──────────────────────────────────────────────────────────────

const reviews: {
  rating: number
  text: string
  author: string
  reply?: { text: string }
}[] = [
  {
    rating: 5,
    text: "This changed my life. It is impossible to speak about the profoundness in this book. Literally impossible to speak about it.",
    author: "Lao Tzu, allegedly",
  },
  {
    rating: 5,
    text: "The most important thing to come along since the Big Bang.",
    author: "The Dalai Lama (could not be reached for confirmation)",
  },
  {
    rating: 1,
    text: "There is nothing in this thing! It is empty!",
    author: "Verified Purchaser",
    reply: { text: "Ah, you are getting it." },
  },
  {
    rating: 5,
    text: "I read it cover to cover in one sitting. Nothing could have prepared me for what was inside.",
    author: "A Devoted Student",
  },
  {
    rating: 5,
    text: "My book club has been discussing it in silence for three years now. We are so close.",
    author: "Margaret, Book Club President",
  },
  {
    rating: 5,
    text: "This book said nothing. I heard everything.",
    author: "An Enlightened Customer",
  },
  {
    rating: 5,
    text: "Worth every penny. I especially liked the part where my expectations died.",
    author: "A Former Seeker",
  },
]

// ─── Reviews Section ───────────────────────────────────────────────────────────

interface ReviewsSectionProps {
  backgroundImage?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ReviewsSection({ backgroundImage, brushStrokeImage }: ReviewsSectionProps) {
  return (
    <NavBackground backgroundImage={backgroundImage} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16 flex flex-col items-center">
        <div className="max-w-lg w-full">

          {/* Overall rating — big text + stars on the left, ensō on the right */}
          <div className="mb-10">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-4xl md:text-5xl font-bold whitespace-nowrap">4.5 out of 5</p>
                <Stars rating={4.5} className="mt-3 block text-6xl md:text-7xl tracking-widest" />
              </div>
              <img
                src="/enso.png"
                alt="ensō"
                className="w-24 md:w-32 h-auto shrink-0"
              />
            </div>
            <hr className="border-black mt-6" />
          </div>

          {/* Individual reviews */}
          <div className="space-y-6">
            {reviews.map((review, i) => (
              <div key={i} className="border border-black bg-white/70 backdrop-blur-sm p-6">
                <Stars rating={review.rating} className="text-lg tracking-widest" />
                <p className="mt-3 text-sm leading-relaxed text-neutral-800">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-3 text-sm italic text-neutral-600">— {review.author}</p>

                {review.reply && (
                  <div className="mt-4 ml-6 border-l border-black pl-4">
                    <p className="text-sm leading-relaxed text-neutral-800">
                      &ldquo;{review.reply.text}&rdquo;
                    </p>
                    <p className="mt-2 text-sm italic text-neutral-600">
                      — Author of The Greatest Wisdom of Zen
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>
    </NavBackground>
  )
}
