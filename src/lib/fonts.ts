import { Fraunces, EB_Garamond } from "next/font/google"

// Shared across /acquire, /reviews and /contact so every page gets the same
// font instances (one download, one fallback-metric set) instead of each
// section re-declaring its own. See lib/theme.ts for the surface treatment
// these pair with.

// Display: headings, the /reviews rating, decorative quote marks, colophons.
// Echoes the serif on the book cover itself.
//
// Loaded as the *variable* font (no `weight`) specifically to keep the `opsz`
// axis live. Pinning weights makes next/font ship static instances with the
// optical size baked in at its text default, which renders noticeably wider and
// chunkier — enough that "The Greatest Wisdom of Zen" no longer fits one line on
// /acquire. Headings set `font-variation-settings: 'opsz'` to get the narrower,
// higher-contrast display cut. See DISPLAY_OPSZ in lib/theme.ts.
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
})

// Body: running copy. Reads like the interior of a printed book — which is
// the joke, given the book is blank.
export const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
})
