# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-viewport-height hero shows the background image (same image as /acquire); cursor is always pointer; clicking plays a fullscreen transition video (if set in Sanity, at 2x speed) then navigates to `/acquire` seamlessly, or navigates directly if no video is configured. The `/acquire` page loads with the background immediately visible; the brush-stroke nav bar and the description card perform one synchronized left-to-right wipe (identical timing, finishing together), after which the nav links fade in. Contact is its own dedicated page. `/reviews` is a joke reviews page (the book is blank — that's the gag): hardcoded 4.5/5 rating with seven reviews, six 5-star jokes and one 1-star ("There is nothing here! It is empty!") with an in-character author reply.

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
    ├── types.ts                       # SiteSettings interface
    └── utils.ts                       # cn() utility
```

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
        ├── Content (title + hr + description + Acquire button + publisher line): left-aligned text inside a centered max-w-lg block; title at 1250ms, hr at 1700ms, description at 2000ms, button + publisher line at 2000ms (same time as the description)
        └── Brush stroke nav (fixed 80px, absolute top): shares the content card's exact wipe — wipeFromLeft 2040ms at 1250ms — so the two sweep in lockstep and finish together at 3290ms; nav buttons fadeIn at 3290ms, right after
              Back → / | Acquire → /acquire | Reviews → /reviews | Contact → /contact

/more — redirects (permanent) to /acquire; kept for old links/bookmarks

/reviews uses NavBackground (same shell as /contact):
  └── ReviewsSection: centered max-w-2xl column (deliberately narrower than the old max-w-3xl — on a laptop-width viewport, max-w-3xl left barely any margin before the background photo's book cover/rocks started showing at the edges; max-w-2xl gives real breathing room while still fitting 2 cards per row above the md: breakpoint). Header card (rounded-lg, border-black/10, bg-white/70 backdrop-blur, px-8 py-8) holds a large "4.5" in Fraunces (serif — echoes the book cover's own lettering) with an SVG star row beneath, no spelled-out "out of 5"/review count (deliberately terse). Below that, seven hardcoded joke reviews render as cards in a plain `grid gap-y-4 gap-x-3 md:grid-cols-2` (single column on mobile, using the default `gap-y-4` for vertical spacing there too) — same rounded/soft-border/glass treatment as the header card and as /acquire's content card, each with a decorative oversized Fraunces closing-quote mark inset fully inside the card (top-2 right-4 — do not use a negative top offset here, see note below). Above `md:`, the header card and the reviews grid both get `md:w-[90%] md:mx-auto` — applied at the row/header level, not per-card — so every row's left/right edges line up: the two 5-star cards that pair up two-per-row (`md:min-h-[200px]`, no per-card width/centering of their own) fill their grid columns edge-to-edge with only the grid's own `gap-x-3` between them, and the one-star/reply card (`md:col-span-2`) spans the same already-narrowed grid width. (Previously each paired card was individually narrowed via `md:w-[85%] md:mx-auto`, which put much more empty space between the two cards on a row than intended and left the header/one-star cards wider than the paired row's combined width, misaligning edges — fixed by narrowing once at the row level instead of per-card.) The shared 200px min-height on the paired cards keeps all six level despite differing review lengths, sized to fit the tallest (Lao Tzu, at 1440px width) rather than an arbitrary round number. This intentionally reintroduces a fixed-height floor in a narrower scope than an earlier version that forced every row (this one included) to a 240px minimum and was removed because it left a lot of dead space below short reviews' text — the current min-height only applies to the paired cards, not the full-width row, so that dead-space problem doesn't return. Card padding is `p-5` (was `p-6`). Six 5-star reviews + one 1-star ("There is nothing here! It is empty!", 3rd, `md:col-span-2` so its indented reply has room) with reply "Ah, you are getting it." signed "— Author of The Greatest Wisdom of Zen". Order (top to bottom): Lao Tzu, Margaret (Book Club President), the 1-star/reply, A Devoted Student, The Dalai Lama, An Enlightened Customer, A Former Seeker. Cards fade/slide in with a short staggered entrance on mount (`fadeSlideUp` keyframe in globals.css). Stars are inline SVGs (see `STAR_PATH`/`StarIcon` in ReviewsSection.tsx) with precise percentage clip-path fill, not the "★" text glyph — crisper at large sizes and consistent across browsers. No Sanity content beyond background/brush images.

  **Quote-mark clipping gotcha:** the decorative quote glyph must sit fully inside the card's box (positive `top`/inset), not straddle the edge with a negative offset. A text span's line-box is taller than the glyph's visible ink, and the ink sits near the top of that box — a negative `top` (meant to let the glyph "bleed" off the corner) pulls most of the box above the card's `overflow-hidden` clip line while the ink (concentrated near the top of the box) gets disproportionately clipped, reading as "sitting outside the card" rather than a clean bleed. Verified by comparing `getBoundingClientRect()` of the card vs. the glyph span directly, not by eyeballing a screenshot.

/read-online — DISABLED. Route calls notFound() immediately; no nav link points to it anywhere. Component code (ReadOnlineSection, PdfReader) and Sanity fields (readOnlinePdf, readOnlineTitle) are untouched in case it needs to come back — see "Re-enabling /read-online" below.

/contact uses NavBackground ('use server'-compatible component):
  ├── Background image: fixed inset-0 z-0 (fixed, not absolute); same desktop/mobile CSS-swap as BookHero/AcquireSection via backgroundImage/backgroundImageMobile
  ├── Brush stroke nav: same image, fixed 80px at top, immediately visible
  │     Back → / | Acquire → /acquire | Reviews → /reviews | Contact → /contact
  └── Content: SubscribeForm + ContactForm (bg-white/70 cards, no border on inputs beyond border-b)
```

### Re-enabling /read-online

1. In `src/app/read-online/page.tsx`, remove the `notFound()` call (and the `next/navigation` import) at the top of `ReadOnlinePage`.
2. In `src/components/sections/NavBackground.tsx` and `src/components/sections/AcquireSection.tsx`, add back a `<a href="/read-online">Read Online</a>` nav link.
3. Add `revalidatePath('/read-online')` back to `src/app/api/revalidate/route.ts` if desired.

## Animation Sequence on /acquire (first visit only)

Controlled by `sessionStorage.getItem('acquire-skip-anim')` (set when navigating internally via the "Acquire" nav link, so revisits skip the animation). Cleared when browser session ends.

The brush stroke nav and the text backdrop card perform **one identical wipe** — same keyframe, duration, delay and easing, declared from the shared `WIPE_DURATION`/`WIPE_DELAY` constants in `AcquireSection.tsx`. Keep them referencing those constants: the whole point is that the two sweep left-to-right in lockstep and land together at 3290ms, so hardcoding either one invites drift.

| Element | Keyframe | Duration | Delay | Notes |
|---------|----------|----------|-------|-------|
| Background image | — | — | — | Always immediately visible, no animation |
| Text backdrop card | `wipeFromLeft` | 2040ms | 1250ms | Clear/blurred card (`bg-white/70 backdrop-blur-sm`, same opacity as Contact/Reviews cards) wraps the whole title/description/button block. Its `clip-path` gates everything inside, so this wipe — not the description's own `slideInLeft` — is what actually finishes revealing the description |
| Brush stroke nav | `wipeFromLeft` | 2040ms | 1250ms | **Identical to the card wipe by design** (was 1080ms/2000ms, and 1080ms/0ms before that) |
| Title (h1) | `slideInLeft` | 660ms | 1250ms | |
| HR divider | `fadeIn` | 500ms | 1700ms | |
| Description | `slideInLeft` | 660ms | 2000ms | Nominally ends at 2660ms, but stays gated by the card wipe until 3290ms |
| Acquire button + publisher line | `fadeIn` | 590ms | 2000ms | Starts together with the description, not after it |
| Nav buttons | `fadeIn` | 660ms | 3290ms | Fires exactly when both wipes complete |

Both wipes were verified in-browser by pausing them via `document.getAnimations()` and scrubbing both to identical `currentTime` values — the computed `clip-path` matched at every sampled point (e.g. 46.853% at 2000ms). Note that "same timing" means same proportional progress, not same pixels/second: the brush stroke spans the full viewport while the card is `max-w-lg`, so matching px/sec would make the card finish far earlier and break the shared landing.

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

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **Buttons** (PDF nav, buy links): `border border-black px-6 py-2 text-sm`, inverts on hover
- **Acquire button** (`/acquire`): starts `bg-white text-black`, inverts to `bg-black text-white` on hover
- **Nav bar** (all inner pages): fixed `height: 80px` brush stroke image strip at absolute top, white text links (`text-white text-sm font-medium hover:opacity-70`); links: Back / Acquire / Reviews / Contact (Read Online link removed while disabled). The current page's link gets `underline underline-offset-4` (via `usePathname()` compared against each link's `href`) — implemented independently in both `NavBackground.tsx` and `AcquireSection.tsx` since the latter doesn't reuse the former.
- **Nav bar height**: always exactly 80px regardless of viewport — uses `style={{ height: '80px' }}` (not Tailwind class) and image uses inline `objectFit: 'cover'` to prevent height scaling
- **Contact/Subscribe forms**: each sits in a `rounded border border-gray-300/40 bg-white/70 backdrop-blur-sm` card (opacity matched to the reviews cards — was `bg-white/20` and read as too see-through against the busy background photo). Inputs have no border of their own beyond `border-b`, section headings use `text-xs uppercase tracking-wide text-neutral-500`. The subscribe form is `flex-col` (email input full-width, button full-width below it) under `sm:` and `flex-row` (side by side) at `sm:` and up — stacking it was a deliberate mobile fix, not a bug.
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
