/**
 * "Ink & paper" — the shared surface treatment for /acquire, /reviews and /contact.
 *
 * The pages sit on a warm sand photograph. A white card floats on top of that and
 * you can see the seam, so every card is tinted to paper instead: it settles into
 * the image rather than sitting over it. Text is warm ink, never pure black.
 *
 * These are complete literal class strings on purpose — Tailwind scans source files
 * for class candidates, so building them by interpolating colour constants would
 * leave the utilities ungenerated. Add to the strings; don't compose them from parts.
 */

// ─── Surfaces ──────────────────────────────────────────────────────────────────

/** Every card on every page. Pair with your own padding (`p-5`, `p-6`, `p-9`…). */
export const inkCard =
  "rounded-sm border border-[#3c301e]/20 bg-[#faf5ec]/85 backdrop-blur-sm shadow-[0_1px_30px_rgba(60,48,30,0.10)]"

/** Hairline divider inside a card. */
export const inkRule = "border-[#3c301e]/30"

// ─── Type ──────────────────────────────────────────────────────────────────────
// Use with fraunces.className (display) or garamond.className (body) from lib/fonts.

/** Headings. Warm ink, not pure black. */
export const inkHeading = "text-[#221d16]"

/**
 * Optical size for display-set Fraunces. The axis runs 9–144; the high end is the
 * narrower, higher-contrast display cut that echoes the book cover's lettering.
 * Apply as an inline style — `font-variation-settings` has no Tailwind utility:
 *   style={{ fontVariationSettings: DISPLAY_OPSZ }}
 */
export const DISPLAY_OPSZ = "'opsz' 100"

/** Running copy. */
export const inkBody = "text-[#3a332a]"

/** Attributions, colophons, helper text — recedes without vanishing. */
export const inkMuted = "text-[#8b8172]"

/** Small tracked labels: form field labels, review bylines. */
export const inkLabel = "text-[11px] uppercase tracking-[0.14em] text-[#8b8172]"

/**
 * Card-level heading, one step darker than inkLabel so a card's title doesn't read
 * as just another field label sitting above the form.
 */
export const inkEyebrow = "text-[11px] uppercase tracking-[0.16em] text-[#5c5346]"

// ─── Controls ──────────────────────────────────────────────────────────────────

/** Solid ink call to action; inverts to outline on hover. Pair with your own padding. */
export const inkButton =
  "inline-block rounded-none border border-[#1f1a13] bg-[#1f1a13] text-[#f7f2e9] uppercase tracking-[0.13em] transition-colors hover:bg-transparent hover:text-[#1f1a13] disabled:opacity-50"

/** Underline-only text input sitting directly on the paper. */
export const inkInput =
  "w-full border-b border-[#3c301e]/25 bg-transparent px-0 py-2 text-[#221d16] placeholder-[#a99e8c] focus:border-[#1f1a13] focus:outline-none transition-colors"

// ─── Nav ───────────────────────────────────────────────────────────────────────
// The brush-stroke bar is near-black, so nav type stays white — tracked uppercase
// to match the small caps used throughout the cards. Duplicated in AcquireSection
// and NavBackground, which build their nav independently; keep both on this string.
export const inkNavLink =
  "text-white text-[11px] uppercase tracking-[0.18em] hover:opacity-70 transition-opacity whitespace-nowrap"

// ─── Status ────────────────────────────────────────────────────────────────────
// Warmed toward the ink palette but still unmistakably success / failure.
export const inkSuccess = "text-[#4a6b4f]"
export const inkError = "text-[#8f3a2a]"
