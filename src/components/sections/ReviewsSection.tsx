'use client'

import { useEffect, useState } from "react"
import { Fraunces } from "next/font/google"
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import { NavBackground } from "./NavBackground"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
})

// ─── Stars ─────────────────────────────────────────────────────────────────────
// SVG stars (crisper at large display sizes than a font glyph) with precise
// percentage fill, so any rating — not just whole/half — renders correctly.

const STAR_PATH = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"

function StarIcon({ fillPercent }: { fillPercent: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[1em] shrink-0 align-middle">
      <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full fill-neutral-300">
        <path d={STAR_PATH} />
      </svg>
      <svg
        viewBox="0 0 24 24"
        className="absolute inset-0 h-full w-full fill-black"
        style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
      >
        <path d={STAR_PATH} />
      </svg>
    </span>
  )
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${className ?? ''}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} fillPercent={Math.max(0, Math.min(100, (rating - (i - 1)) * 100))} />
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
    text: "My book club has been discussing it in silence for three years now. We are so close.",
    author: "Margaret, Book Club President",
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
    text: "The most important thing to come along since the Big Bang.",
    author: "The Dalai Lama (could not be reached for confirmation)",
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
  backgroundImageMobile?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}

export function ReviewsSection({ backgroundImage, backgroundImageMobile, brushStrokeImage }: ReviewsSectionProps) {
  // Cards settle in with a quiet stagger on mount. Starts hidden so the
  // pre-mount SSR/client-first-paint markup always matches (avoids a
  // hydration mismatch), then reveals once mounted.
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  function revealAnim(delayMs: number): React.CSSProperties {
    if (!ready) return { opacity: 0 }
    return { animation: `fadeSlideUp 560ms ease-out ${delayMs}ms both` }
  }

  return (
    <NavBackground backgroundImage={backgroundImage} backgroundImageMobile={backgroundImageMobile} brushStrokeImage={brushStrokeImage}>
      <section className="w-full px-8 py-12 md:px-16 flex flex-col items-center">
        <div className="max-w-2xl w-full">

          {/* Overall rating */}
          <div
            className="mb-6 flex flex-col items-center text-center rounded-lg border border-black/10 bg-white/70 backdrop-blur-sm px-8 py-8"
            style={revealAnim(0)}
          >
            <p className={`${fraunces.className} font-semibold text-7xl md:text-8xl leading-none`}>
              4.5
            </p>
            <Stars rating={4.5} className="mt-5 text-2xl md:text-3xl" />
          </div>

          {/* Individual reviews */}
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-lg border border-black/10 bg-white/70 backdrop-blur-sm p-5 ${review.reply ? 'md:col-span-2' : ''}`}
                style={revealAnim(90 + i * 70)}
              >
                <span
                  aria-hidden="true"
                  className={`${fraunces.className} pointer-events-none select-none absolute top-2 right-4 italic text-5xl leading-none text-black/10`}
                >
                  &rdquo;
                </span>

                <Stars rating={review.rating} className="text-base" />
                <p className="mt-3 text-sm leading-relaxed text-neutral-800 max-w-md">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="mt-3 text-xs uppercase tracking-wide text-neutral-500">
                  — {review.author}
                </p>

                {review.reply && (
                  <div className="mt-4 ml-5 border-l border-black/15 pl-4">
                    <p className="text-sm leading-relaxed text-neutral-800">
                      &ldquo;{review.reply.text}&rdquo;
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-wide text-neutral-500">
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
