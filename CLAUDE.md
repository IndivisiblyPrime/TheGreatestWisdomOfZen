# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-viewport-height hero shows the background image (same image as /acquire); cursor is always pointer; clicking plays a fullscreen transition video (if set in Sanity, at 2x speed) then navigates to `/acquire` seamlessly, or navigates directly if no video is configured. The `/acquire` page loads with the background immediately visible; the brush-stroke nav bar and the description card perform one synchronized left-to-right wipe (identical timing, finishing together), after which the nav links fade in. `/acquire`, `/reviews` and `/contact` all share the **"Ink & paper"** treatment — warm paper cards tinted to sit *in* the background photograph rather than on top of it, warm ink type, Fraunces display + EB Garamond body (see the Design System section below). Contact is its own dedicated page. `/reviews` is a joke reviews page (the book is blank — that's the gag): hardcoded 4.5/5 rating with seven reviews, six 5-star jokes and one 1-star ("There is nothing here! It is empty!") with an in-character author reply.

The background image (used on the homepage, `/acquire`, `/contact`, and `/reviews`) and the homepage transition video each have an optional mobile-specific variant (see "Mobile assets" below) that swaps in below the `md:` breakpoint (768px) via pure CSS — so it reacts live if the browser window is resized, and stays consistent across page navigations at the same width (not just on initial page load).

`/read-online` is currently **disabled** — the route, component, and PDF reader code are all still in the repo (in case it's needed again), but the page returns a 404 and there is no nav link to it. See "Disabled: /read-online" below.

## Commands

- `npm run dev` — Dev server at http://localhost:3000
- `npm run build` — Production build (verify before deploying)
- `npm run lint` — ESLint
- `npx sanity@latest schema deploy` — Push schema changes to Sanity project `00tez3yv`
- `npx vercel --prod` — Manual production deploy (usually not needed — git push triggers auto-deploy)
- Sanity Studio embedded at `/studio`

## Stack

- **Next.js** (App Router, TypeScript, React 19)
- **Tailwind CSS v4**
- **Sanity v4** headless CMS (embedded studio, project ID: `00tez3yv`, dataset: `production`)
- **Resend** for email (contact form + subscribe)
- **Vercel** for hosting (linked project: `indivisiblyprimes-projects/the-greatest-wisdom-of-zen`)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                       # Homepage — fetches settings, renders BookHero
│   ├── layout.tsx                     # Root layout (Geist font only)
│   ├── globals.css                    # Global styles + wipeFromLeft/fadeIn/slideInLeft keyframes
│   ├── acquire/
│   │   └── page.tsx                   # /acquire route — fetches settings, renders AcquireSection
│   ├── more/
│   │   └── page.tsx                   # /more — redirects permanently to /acquire (old links/bookmarks)
│   ├── read-online/
│   │   └── page.tsx                   # DISABLED — calls notFound() before rendering; ReadOnlineSection/PdfReader kept in place
│   ├── contact/
│   │   └── page.tsx                   # /contact route — renders ContactSection
│   ├── reviews/
│   │   └── page.tsx                   # /reviews route — renders ReviewsSection (joke reviews, hardcoded)
│   ├── api/
│   │   ├── contact/route.ts           # POST — contact form → Resend email
│   │   ├── subscribe/route.ts         # POST — email subscribe → Resend notification
│   │   └── revalidate/route.ts        # POST — Sanity webhook → revalidates /, /acquire, /more, /contact, /reviews
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio (singleton structure)
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: full-screen background image, pointer cursor everywhere, click → video (2x playback) → /acquire
│       ├── NavBackground.tsx          # Shared layout: mobile-aware background image (desktop/mobile CSS-swap, same pattern as BookHero/AcquireSection) + fixed 80px brush stroke nav, current-page link underlined — used by /contact and /reviews
│       ├── AcquireSection.tsx         # /acquire: layered animations (first visit only via sessionStorage), Acquire button always visible; own copy of the brush-stroke nav (current-page link underlined)
│       ├── ReadOnlineSection.tsx      # DISABLED (route returns 404) — kept in place, not currently linked or reachable
│       ├── ContactSection.tsx         # /contact: NavBackground wrapper + SubscribeForm + ContactForm
│       ├── ReviewsSection.tsx         # /reviews: NavBackground wrapper + hardcoded joke reviews in a 2-col card grid (SVG stars, Fraunces serif accents)
│       └── PdfReader.tsx              # DISABLED (only used by ReadOnlineSection) — react-pdf page-by-page reader
├── sanity/
│   ├── env.ts
│   ├── structure.ts                   # Singleton structure: Homepage Settings opens directly
│   ├── lib/
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── live.ts
│   └── schemaTypes/
│       ├── index.ts                   # Exports: homepageSettings only
│       ├── homepageSettings.ts        # TGWOZ schema (5 groups)
│       └── heroSection.ts             # Legacy — unused, can be removed later
└── lib/
    ├── fonts.ts                       # Shared next/font instances — Fraunces (VARIABLE, opsz axis) + EB Garamond
    ├── theme.ts                       # "Ink & paper" design tokens as literal Tailwind class strings
    ├── types.ts                       # SiteSettings interface
    └── utils.ts                       # cn() utility
```

## Design System: "Ink & paper"

`/acquire`, `/reviews` and `/contact` share one surface treatment, defined in `src/lib/theme.ts`.
The pages sit on a warm sand photograph; a white card floats on top of that and the seam shows,
so every card is tinted to paper instead and settles into the image. Text is warm ink, never pure black.

| Token | Value | Used for |
|-------|-------|----------|
| `inkCard` | `rounded-sm border-[#3c301e]/20 bg-[#faf5ec]/85 backdrop-blur-sm shadow-[0_1px_30px_...]` | Every card on every page |
| `inkRule` | `border-[#3c301e]/30` | Hairline dividers inside cards |
| `inkHeading` | `text-[#221d16]` | Headings |
| `inkBody` | `text-[#3a332a]` | Running copy |
| `inkMuted` | `text-[#8b8172]` | Colophons, attributions |
| `inkLabel` | `text-[11px] uppercase tracking-[0.14em] text-[#8b8172]` | Field labels, review bylines |
| `inkEyebrow` | `text-[11px] uppercase tracking-[0.16em] text-[#5c5346]` | Card-level headings (darker than `inkLabel` so a card title doesn't read as another field label) |
| `inkButton` | solid `#1f1a13` on `#f7f2e9`, uppercase `tracking-[0.13em]`, square; inverts to outline on hover | All CTAs |
| `inkInput` | `border-b border-[#3c301e]/25`, no other border; focus darkens the underline | All form inputs |
| `inkNavLink` | `text-white text-[11px] uppercase tracking-[0.18em]` | Brush-stroke nav links |
| `inkSuccess` / `inkError` | `#4a6b4f` / `#8f3a2a` | Form status messages — warmed toward the palette but still unmistakably success/failure |

**These are complete literal class strings on purpose.** Tailwind scans source files for class-name
candidates, so composing them by interpolating colour constants would leave the utilities ungenerated.
Add to the strings; don't build them from parts.

### Fonts (`src/lib/fonts.ts`)

- **Fraunces** — display: headings, the `/reviews` rating, decorative quote marks, colophons. Echoes the serif on the book cover.
- **EB Garamond** — body: all running copy. Reads like the interior of a printed book, which is the joke.

**Fraunces is loaded as the _variable_ font (`axes: ["opsz"]`, no `weight`) and this matters.**
Pinning `weight` makes next/font ship static instances with the optical size baked in at its *text*
default, which renders noticeably wider and chunkier — enough that "The Greatest Wisdom of Zen" stopped
fitting on one line on `/acquire` at 34px. Display-set headings therefore apply
`style={{ fontVariationSettings: DISPLAY_OPSZ }}` (`'opsz' 100`) to get the narrower, higher-contrast
display cut. There is no Tailwind utility for `font-variation-settings`, so it has to be an inline style.
The `/reviews` "4.5" pins it too — otherwise its letterforms visibly change shape across the
`text-7xl` → `md:text-8xl` breakpoint, since the axis defaults to tracking font-size.

Form **inputs deliberately stay sans** (the inherited Geist) rather than Garamond: emails, phone numbers
and typed data read better in a sans, and it draws a clean line between "text you read" and "text you enter".

## Page Layout

```
/ (Homepage)
  └── BookHero ('use client')
        — fixed inset-0 overflow-hidden overscroll-none (not relative h-screen — see "Mobile scroll-lock gotcha" below); shows backgroundImage on desktop (same image as /acquire)
        — cursor is always pointer — whole screen is clickable
        — click → if transitionVideoUrl: fixed inset-0 z-50 video overlay, playbackRate set to 2x → onEnded navigates to /acquire
        — click → if no video: document.startViewTransition → router.push('/acquire')
        — seamless transition: background image on homepage matches /acquire on desktop, so video → /acquire is smooth
        — video src has `#t=0.001` + onLoadedMetadata seek to force first-frame render on iOS/mobile
        — "Click to continue" prompt: appears after 5s, black text (no box), bottom-centered, smooth pulseFade in/out
        — Mobile assets: both desktop and mobile `<img>`/`<video>` elements are always mounted; Tailwind `hidden md:block` / `md:hidden` classes pick which is shown, so it updates instantly on resize. Both videos are downloaded up front (accepted bandwidth tradeoff — avoids a JS-driven single-mount that wouldn't react to a mid-session resize). Click handler picks the active `<video>` ref via `window.matchMedia('(min-width: 768px)')` at click time, matching the CSS breakpoint. The homepage's mobile image is `backgroundImageMobile || backgroundImage`, same as every other page — there is deliberately no homepage-only "starting image" field; the opening experience is always the transition video, not a distinct static image.

/acquire (accessible by clicking on the homepage hero, or after video ends)
  └── AcquireSection ('use client')
        ├── Background image: ALWAYS immediately visible (no animation); fixed inset-0 (not absolute — see "Mobile scroll-lock gotcha" below); same desktop/mobile CSS-swap pattern as BookHero
        ├── sessionStorage key 'acquire-skip-anim': if set, everything shows immediately (no animation)
        ├── Styling: "Ink & paper" (see Design System above). Card is `inkCard` + `p-6 md:p-9`; title is Fraunces 34px at `DISPLAY_OPSZ`; description is EB Garamond 19px/1.62; Acquire is `inkButton`.
        ├── Width is PINNED at `max-w-lg` and must stay there — the card sits in the gap between the book and the branch in the background photo, so it may grow taller but never wider. The description was sized up to 19px for readability on that basis.
        ├── The content wrapper's `py-24 md:py-12` is load-bearing, not decorative: on a short phone (375×667) the card is taller than the viewport, and without it the flex centering pulls the card's top edge under the 80px nav and hides the title.
        ├── Content (title + hr + description + Acquire button): left-aligned text inside a centered max-w-lg block; title, description and Acquire button all share ONE identical reveal — `slideInLeft` 660ms at 1250ms (from the shared `TEXT_DURATION`/`TEXT_DELAY` constants) — so they slide in together as a single motion. The hr divider is the lone exception: `fadeIn` 500ms at 1700ms
        └── Brush stroke nav (fixed 80px, absolute top): shares the content card's exact wipe — wipeFromLeft 2040ms at 1250ms — so the two sweep in lockstep and finish together at 3290ms; nav buttons fadeIn at 3290ms, right after
              Back → / | Acquire → /acquire | Reviews → /reviews | Contact → /contact

/more — redirects (permanent) to /acquire; kept for old links/bookmarks

/reviews uses NavBackground (same shell as /contact). Styled "Ink & paper" (see Design System above): every card is `inkCard`, review text is EB Garamond 17px/1.55, bylines are `inkLabel`, stars are `fill-[#1f1a13]` on `fill-[#d8cfbe]`, the quote glyph is `text-[#3c301e]/15`. **All widths are unchanged from the pre-ink version and must stay that way** — `max-w-2xl`, `md:w-[90%] md:mx-auto`, `grid gap-y-4 gap-x-3 md:grid-cols-2`, `p-5`. Only the paired cards' min-height moved (200px → 212px), because Garamond at 17px makes the tallest card (Lao Tzu, measured at 1440px viewport) 212px; sizing the floor to the measured tallest is the existing convention, so re-measure at 1440px if the review copy changes.
  └── ReviewsSection: centered max-w-2xl column (deliberately narrower than the old max-w-3xl — on a laptop-width viewport, max-w-3xl left barely any margin before the background photo's book cover/rocks started showing at the edges; max-w-2xl gives real breathing room while still fitting 2 cards per row above the md: breakpoint). Header card (rounded-lg, border-black/10, bg-white/70 backdrop-blur, px-8 py-8) holds a large "4.5" in Fraunces (serif — echoes the book cover's own lettering) with an SVG star row beneath, no spelled-out "out of 5"/review count (deliberately terse). Below that, seven hardcoded joke reviews render as cards in a plain `grid gap-y-4 gap-x-3 md:grid-cols-2` (single column on mobile, using the default `gap-y-4` for vertical spacing there too) — same rounded/soft-border/glass treatment as the header card and as /acquire's content card, each with a decorative oversized Fraunces closing-quote mark inset fully inside the card (top-2 right-4 — do not use a negative top offset here, see note below). Above `md:`, the header card and the reviews grid both get `md:w-[90%] md:mx-auto` — applied at the row/header level, not per-card — so every row's left/right edges line up: the two 5-star cards that pair up two-per-row (`md:min-h-[200px]`, no per-card width/centering of their own) fill their grid columns edge-to-edge with only the grid's own `gap-x-3` between them, and the one-star/reply card (`md:col-span-2`) spans the same already-narrowed grid width. (Previously each paired card was individually narrowed via `md:w-[85%] md:mx-auto`, which put much more empty space between the two cards on a row than intended and left the header/one-star cards wider than the paired row's combined width, misaligning edges — fixed by narrowing once at the row level instead of per-card.) The shared 200px min-height on the paired cards keeps all six level despite differing review lengths, sized to fit the tallest (Lao Tzu, at 1440px width) rather than an arbitrary round number. This intentionally reintroduces a fixed-height floor in a narrower scope than an earlier version that forced every row (this one included) to a 240px minimum and was removed because it left a lot of dead space below short reviews' text — the current min-height only applies to the paired cards, not the full-width row, so that dead-space problem doesn't return. Card padding is `p-5` (was `p-6`). Six 5-star reviews + one 1-star ("There is nothing here! It is empty!", 3rd, `md:col-span-2` so its indented reply has room) with reply "Ah, you are getting it." signed "— Author of The Greatest Wisdom of Zen". Order (top to bottom): Lao Tzu, Margaret (Book Club President), the 1-star/reply, A Devoted Student, The Dalai Lama, An Enlightened Customer, A Former Seeker. Cards fade/slide in with a short staggered entrance on mount (`fadeSlideUp` keyframe in globals.css). Stars are inline SVGs (see `STAR_PATH`/`StarIcon` in ReviewsSection.tsx) with precise percentage clip-path fill, not the "★" text glyph — crisper at large sizes and consistent across browsers. No Sanity content beyond background/brush images.

  **Quote-mark clipping gotcha:** the decorative quote glyph must sit fully inside the card's box (positive `top`/inset), not straddle the edge with a negative offset. A text span's line-box is taller than the glyph's visible ink, and the ink sits near the top of that box — a negative `top` (meant to let the glyph "bleed" off the corner) pulls most of the box above the card's `overflow-hidden` clip line while the ink (concentrated near the top of the box) gets disproportionately clipped, reading as "sitting outside the card" rather than a clean bleed. Verified by comparing `getBoundingClientRect()` of the card vs. the glyph span directly, not by eyeballing a screenshot.

/read-online — DISABLED. Route calls notFound() immediately; no nav link points to it anywhere. Component code (ReadOnlineSection, PdfReader) and Sanity fields (readOnlinePdf, readOnlineTitle) are untouched in case it needs to come back — see "Re-enabling /read-online" below.

/contact uses NavBackground ('use server'-compatible component):
  ├── Background image: fixed inset-0 z-0 (fixed, not absolute); same desktop/mobile CSS-swap as BookHero/AcquireSection via backgroundImage/backgroundImageMobile
  ├── Brush stroke nav: same image, fixed 80px at top, immediately visible
  │     Back → / | Acquire → /acquire | Reviews → /reviews | Contact → /contact
  └── Content: SubscribeForm + ContactForm — "Ink & paper" (see Design System above): `inkCard` + `p-6`, `inkEyebrow` card headings, `inkLabel` field labels, `inkInput` (border-b only), `inkButton` submits, `inkSuccess`/`inkError` status lines. Intro line is EB Garamond 18px; inputs stay sans on purpose.
```

### Re-enabling /read-online

1. In `src/app/read-online/page.tsx`, remove the `notFound()` call (and the `next/navigation` import) at the top of `ReadOnlinePage`.
2. In `src/components/sections/NavBackground.tsx` and `src/components/sections/AcquireSection.tsx`, add back a `<a href="/read-online">Read Online</a>` nav link.
3. Add `revalidatePath('/read-online')` back to `src/app/api/revalidate/route.ts` if desired.

## Animation Sequence on /acquire (first visit only)

Controlled by `sessionStorage.getItem('acquire-skip-anim')` (set when navigating internally via the "Acquire" nav link, so revisits skip the animation). Cleared when browser session ends.

Two sets of elements each share **one identical animation**, both driven by shared constants in `AcquireSection.tsx` so paired elements can't drift apart:

- **The wipe pair** (`WIPE_DURATION`/`WIPE_DELAY`): the brush stroke nav and the text backdrop card perform the same left-to-right `wipeFromLeft` in lockstep, landing together at 3290ms.
- **The text reveal group** (`TEXT_DURATION`/`TEXT_DELAY`): the title, description and Acquire button all use the same `slideInLeft` 660ms at 1250ms, so they slide in together as a single motion (per request — the description / Acquire match the title exactly).

| Element | Keyframe | Duration | Delay | Notes |
|---------|----------|----------|-------|-------|
| Background image | — | — | — | Always immediately visible, no animation |
| Text backdrop card | `wipeFromLeft` | 2040ms | 1250ms | Warm paper card (`inkCard`, same treatment as Contact/Reviews cards) wraps the whole title/description/button block. Its `clip-path` gates everything inside, so this wipe — not the text's own `slideInLeft` — is what actually finishes revealing the content at 3290ms |
| Brush stroke nav | `wipeFromLeft` | 2040ms | 1250ms | **Identical to the card wipe by design** (was 1080ms/2000ms, and 1080ms/0ms before that) |
| Title (h1) | `slideInLeft` | 660ms | 1250ms | Text reveal group |
| Description | `slideInLeft` | 660ms | 1250ms | Text reveal group — matches the title exactly (was 660ms/2000ms) |
| Acquire button | `slideInLeft` | 660ms | 1250ms | Text reveal group — matches the title exactly (was `fadeIn` 590ms/2000ms) |
| HR divider | `fadeIn` | 500ms | 1700ms | Deliberately NOT in the text reveal group — the lone element on its own timing |
| Nav buttons | `fadeIn` | 660ms | 3290ms | Fires exactly when both wipes complete |

The text reveal group's own `slideInLeft` finishes at 1910ms, but every element stays gated by the card's `clip-path` wipe until it completes at 3290ms, so what you actually see is the shared left-to-right reveal. The wipe pair was verified in-browser by pausing both via `document.getAnimations()` and scrubbing to identical `currentTime` values — the computed `clip-path` matched at every sampled point (e.g. 46.853% at 2000ms). The text reveal group was verified via `getComputedStyle().animation` — all four elements returned the identical `0.66s ease-out 1.25s both slideInLeft`. Note that "same timing" for the wipe pair means same proportional progress, not same pixels/second: the brush stroke spans the full viewport while the card is `max-w-lg`, so matching px/sec would make the card finish far earlier and break the shared landing.

## Sanity Schema (`homepageSettings.ts`)

Five groups:

| Group       | Fields |
|-------------|--------|
| Site        | `siteTitle` (string), `siteFavicon` (image) |
| Hero        | `transitionVideo` (file, accept: video/*), `transitionVideoMobile` (file, accept: video/*, optional — falls back to `transitionVideo` under 768px) |
| Buttons     | `buyButtonText` (default "Buy", legacy/unused — button text is hardcoded "Acquire" in `AcquireSection.tsx`), `buyButtonUrl` (url), `moreButtonText` (default "More", legacy/unused), `readOnlineButtonText` (default "Read Online", legacy/unused — /read-online disabled) |
| More        | `exploreHeading` (default "Explore", legacy/unused), `bookDescription` (text, rows 6), `backgroundImage` (image, hotspot — also used on homepage), `backgroundImageMobile` (image, hotspot, optional — falls back to `backgroundImage` under 768px; used on the homepage, /acquire, /contact, and /reviews), `brushStrokeImage` (image). Group internally still named `more`; feeds the `/acquire` page. |
| Read Online | `readOnlineTitle` (default "Read Online", legacy/unused), `readOnlinePdf` (file, accept: pdf) — fields kept for when /read-online is re-enabled |

**Singleton setup:** `structure.ts` configures `homepageSettings` as a singleton with fixed `documentId: "homepageSettings"` — clicking it in Studio opens the form directly, no list view.

## TypeScript Types (`types.ts`)

```typescript
export interface SiteSettings {
  siteTitle?: string
  siteFavicon?: SanityImageSource
  buyButtonText?: string
  buyButtonUrl?: string
  moreButtonText?: string
  readOnlineButtonText?: string
  exploreHeading?: string
  bookDescription?: string
  readOnlineTitle?: string
  readOnlinePdf?: {
    asset?: { url: string }
  }
  transitionVideo?: {
    asset?: { url: string }
  }
  transitionVideoMobile?: {
    asset?: { url: string }
  }
  backgroundImage?: SanityImageSource
  backgroundImageMobile?: SanityImageSource
  brushStrokeImage?: SanityImageSource
}
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=00tez3yv
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=<set in Vercel>
CONTACT_EMAIL=jtharvey6@gmail.com
CONTACT_FROM_EMAIL=<verified sender, optional — defaults to onboarding@resend.dev>
REVALIDATE_SECRET=52b29192da9d64f108e2de838cae6abfe8bec11c
```

All vars except `CONTACT_FROM_EMAIL` are already configured in Vercel production. Set in `.env.local` for local dev.

## ISR / Revalidation

- Pages use `export const revalidate = 60` — auto-refresh every 60 seconds as a fallback
- Sanity webhook (ID: `ibtJnljD4nkDRklM`) fires on any document create/update/delete → POSTs to `https://thegreatestwisdomofzen.com/api/revalidate?secret=...` → instantly revalidates `/`, `/acquire`, `/more`, `/contact`, `/reviews`
- Publishing in Studio → live site updates immediately (no Vercel redeploy needed)
- Code changes require `git push origin main` → Vercel auto-deploys

## Design System — mechanics & layout

(For colour/type tokens see **Design System: "Ink & paper"** further up.)

- **Theme**: "Ink & paper" — warm paper cards on the sand photograph, warm ink type, Fraunces + EB Garamond. See the **Design System: "Ink & paper"** section above for the full token table; this section covers the mechanics that aren't tokens. (Superseded the earlier minimal black & white / Geist-everywhere look, which had a white card visibly seaming against the warm background photo.)
- **Buttons**: all CTAs use `inkButton` — solid ink, uppercase tracked, square corners, inverts to outline on hover. The PDF nav buttons on the disabled `/read-online` still use the old `border border-black px-6 py-2 text-sm` style.
- **Nav bar** (all inner pages): fixed `height: 80px` brush stroke image strip at absolute top; links use `inkNavLink`; links: Back / Acquire / Reviews / Contact (Read Online link removed while disabled). The current page's link gets `underline underline-offset-4` (via `usePathname()` compared against each link's `href`) — implemented independently in both `NavBackground.tsx` and `AcquireSection.tsx` since the latter doesn't reuse the former, so **nav changes must be made in both files** (they now share the `inkNavLink` token, but each builds its own `linkClass()`).
- **Nav bar height**: always exactly 80px regardless of viewport — uses `style={{ height: '80px' }}` (not Tailwind class) and image uses inline `objectFit: 'cover'` to prevent height scaling
- **Contact/Subscribe forms**: each sits in an `inkCard` (previously `bg-white/70`, and `bg-white/20` before that, which read as too see-through against the busy background photo). Inputs have no border of their own beyond `border-b`. The subscribe form is `flex-col` (email input full-width, button full-width below it) under `sm:` and `flex-row` (side by side) at `sm:` and up — stacking it was a deliberate mobile fix, not a bug.
- **PDF reader**: `react-pdf` v10 (`PdfReader.tsx`, `'use client'`), worker loaded from unpkg CDN matching installed pdfjs-dist version; ResizeObserver measures container width and passes it to `Page` `width` prop so PDF fills container with no white space to the right
- **Nav bar image**: brush stroke is an `<img>` with `height: 80px; width: 100%; objectFit: cover` (not CSS background-image) so height is truly fixed at 80px regardless of viewport width — shows the source art's full width as-is (frayed left edge and all; a deliberate look, not a bug)
- **View transitions**: `document.startViewTransition` wraps the homepage → /acquire navigation when supported by the browser
- **Mobile scroll-lock gotcha**: full-bleed background images use `position: fixed`, not `absolute`/`relative` + `h-screen`. Two separate failure modes this avoids: (1) `BookHero`'s root is `fixed inset-0` rather than `relative h-screen` — mobile Safari's `100vh` can exceed the actual visible viewport once the address bar is accounted for, which let the whole hero rubber-band-scroll by a few pixels; `fixed inset-0` always matches the true visual viewport and removes the hero from normal document flow entirely, so there's nothing left for the page to scroll. (2) `AcquireSection`'s background layers are `fixed inset-0` rather than `absolute inset-0` — `absolute` sizes itself against the `min-h-screen` content container, so on mobile, where wrapped text pushes that container taller than one screen, the background image stretched to match and `object-cover` re-cropped it, making it look like scrolling "revealed more of the image." `NavBackground` (`/contact`, `/reviews`) already used `fixed` correctly; `AcquireSection` and `BookHero` didn't and were the source of the bug.
- **Mobile breakpoint consistency across pages**: `/`, `/acquire`, `/contact`, and `/reviews` all use the identical `hidden md:block` / `md:hidden` dual-image CSS-swap, keyed off the same `backgroundImage`/`backgroundImageMobile` pair. The breakpoint is evaluated purely by the browser's CSS media query against current viewport width — never by JS or a server-side check — so a desktop browser resized narrow shows the mobile image identically everywhere, and navigating between pages at that width never flips back to the desktop image. `NavBackground` (`/contact`, `/reviews`) originally had no mobile variant at all and always rendered the desktop `backgroundImage` regardless of viewport — that inconsistency (mobile image on `/`/`/acquire`, desktop image on `/contact`/`/reviews`, at the same width) is what got fixed. There is deliberately no homepage-only mobile image field (a `startingImageMobile` field existed briefly and was removed) — the homepage's "opening" is always the transition video, so its pre-click still image doesn't need to differ from the rest of the site's.

## GROQ Queries

Homepage (`page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  backgroundImage, backgroundImageMobile,
  transitionVideo { asset-> { url } },
  transitionVideoMobile { asset-> { url } }
}
```

Acquire page (`acquire/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  backgroundImage, backgroundImageMobile, brushStrokeImage,
  buyButtonText, buyButtonUrl,
  bookDescription
}
```

Read Online page (`read-online/page.tsx`) — DISABLED; `notFound()` is called before this query ever runs. Left in place for when re-enabled:
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  readOnlinePdf { asset-> { url } },
  backgroundImage, brushStrokeImage
}
```

Contact page (`contact/page.tsx`) and Reviews page (`reviews/page.tsx`, identical query shape):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  backgroundImage, backgroundImageMobile,
  brushStrokeImage
}
```

## Common Tasks

- **Edit content**: `/studio` → Homepage Settings (opens directly — singleton)
- **Upload book PDF**: Studio → Homepage Settings → Read Online tab → Book PDF → Publish (unused while /read-online is disabled)
- **Upload background/brush stroke images**: Studio → Homepage Settings → More tab → Background Image / Brush Stroke → Publish
- **Upload mobile background image**: Studio → Homepage Settings → More tab → Background Image (Mobile) → Publish (optional; used on the homepage, /acquire, /contact, and /reviews under 768px wide)
- **Upload transition video**: Studio → Homepage Settings → Hero tab → Transition Video → Publish (video plays fullscreen at 2x speed when clicking the Enzo image, then navigates to /acquire)
- **Upload mobile transition video**: Studio → Homepage Settings → Hero tab → Transition Video (Mobile) → Publish (optional; used under 768px wide)
- **Modify schema**: Edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`
- **Deploy code changes**: `git push origin main` → Vercel auto-deploys
- **Add a new page**: Create `src/app/<name>/page.tsx`, add a component in `sections/`, add fields to schema, add `revalidatePath('/<name>')` to `revalidate/route.ts`

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
