# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-viewport-height hero shows the background image (same image as /acquire); cursor is always pointer; clicking plays a fullscreen transition video (if set in Sanity) then navigates to `/acquire` seamlessly, or navigates directly if no video is configured. The `/acquire` page loads with the background immediately visible; text and nav bar animate in sequentially. Contact is its own dedicated page.

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
│   ├── api/
│   │   ├── contact/route.ts           # POST — contact form → Resend email
│   │   ├── subscribe/route.ts         # POST — email subscribe → Resend notification
│   │   └── revalidate/route.ts        # POST — Sanity webhook → revalidates /, /acquire, /more, /contact
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio (singleton structure)
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: full-screen background image, pointer cursor everywhere, click → video (1.5x playback) → /acquire
│       ├── NavBackground.tsx          # Shared layout: background image + fixed 80px brush stroke nav (no animation) — used by /contact only
│       ├── AcquireSection.tsx         # /acquire: layered animations (first visit only via sessionStorage), Acquire button always visible
│       ├── ReadOnlineSection.tsx      # DISABLED (route returns 404) — kept in place, not currently linked or reachable
│       ├── ContactSection.tsx         # /contact: NavBackground wrapper + SubscribeForm + ContactForm
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
        — relative h-screen overflow-hidden; shows backgroundImage (same image as /acquire)
        — cursor is always pointer — whole screen is clickable
        — click → if transitionVideoUrl: fixed inset-0 z-50 video overlay, playbackRate set to 1.5x → onEnded navigates to /acquire
        — click → if no video: document.startViewTransition → router.push('/acquire')
        — seamless transition: background image on homepage matches /acquire, so video → /acquire is smooth
        — video src has `#t=0.001` + onLoadedMetadata seek to force first-frame render on iOS/mobile
        — "Click to continue" prompt: appears after 7s, black text (no box), bottom-centered, smooth pulseFade in/out

/acquire (accessible by clicking on the homepage hero, or after video ends)
  └── AcquireSection ('use client')
        ├── Background image: ALWAYS immediately visible (no animation)
        ├── sessionStorage key 'acquire-skip-anim': if set, everything shows immediately (no animation)
        ├── Content (title + hr + description + Acquire button + publisher line): left-aligned text inside a centered max-w-lg block; slideInLeft/fadeIn starting at 200ms, description/button/publisher line animate in together at 1200ms
        └── Brush stroke nav (fixed 80px, absolute top): wipeFromLeft at 2000ms, buttons fadeIn at 3300ms
              Back → / | More → /acquire | Contact → /contact

/more — redirects (permanent) to /acquire; kept for old links/bookmarks

/read-online — DISABLED. Route calls notFound() immediately; no nav link points to it anywhere. Component code (ReadOnlineSection, PdfReader) and Sanity fields (readOnlinePdf, readOnlineTitle) are untouched in case it needs to come back — see "Re-enabling /read-online" below.

/contact uses NavBackground ('use server'-compatible component):
  ├── Background image: fixed inset-0 z-0 (fixed, not absolute)
  ├── Brush stroke nav: same image, fixed 80px at top, immediately visible
  │     Back → / | More → /acquire | Contact → /contact
  └── Content: SubscribeForm + ContactForm (no bg cards, no border on inputs)
```

### Re-enabling /read-online

1. In `src/app/read-online/page.tsx`, remove the `notFound()` call (and the `next/navigation` import) at the top of `ReadOnlinePage`.
2. In `src/components/sections/NavBackground.tsx` and `src/components/sections/AcquireSection.tsx`, add back a `<a href="/read-online">Read Online</a>` nav link.
3. Add `revalidatePath('/read-online')` back to `src/app/api/revalidate/route.ts` if desired.

## Animation Sequence on /acquire (first visit only)

Controlled by `sessionStorage.getItem('acquire-skip-anim')` (set when navigating internally via the "More" nav link, so revisits skip the animation). Cleared when browser session ends.

| Element | Keyframe | Duration | Delay | Notes |
|---------|----------|----------|-------|-------|
| Background image | — | — | — | Always immediately visible, no animation |
| Title (h1) | `slideInLeft` | 800ms | 200ms | |
| HR divider | `fadeIn` | 600ms | 700ms | |
| Description | `slideInLeft` | 800ms | 1200ms | |
| Acquire button + publisher line | `fadeIn` | 700ms | 1200ms | Starts alongside the description, not after it |
| Brush stroke nav | `wipeFromLeft` | 1300ms | 2000ms | |
| Nav buttons | `fadeIn` | 800ms | 3300ms | |

## Sanity Schema (`homepageSettings.ts`)

Five groups:

| Group       | Fields |
|-------------|--------|
| Site        | `siteTitle` (string), `siteFavicon` (image) |
| Hero        | `bookCoverImage` (image, legacy/unused), `transitionVideo` (file, accept: video/*) |
| Buttons     | `buyButtonText` (default "Buy", legacy/unused — button text is hardcoded "Acquire" in `AcquireSection.tsx`), `buyButtonUrl` (url), `moreButtonText` (default "More", legacy/unused), `readOnlineButtonText` (default "Read Online", legacy/unused — /read-online disabled) |
| More        | `exploreHeading` (default "Explore", legacy/unused), `bookDescription` (text, rows 6), `backgroundImage` (image, hotspot — also used on homepage), `brushStrokeImage` (image). Group internally still named `more`; feeds the `/acquire` page. |
| Read Online | `readOnlineTitle` (default "Read Online", legacy/unused), `readOnlinePdf` (file, accept: pdf) — fields kept for when /read-online is re-enabled |

**Singleton setup:** `structure.ts` configures `homepageSettings` as a singleton with fixed `documentId: "homepageSettings"` — clicking it in Studio opens the form directly, no list view.

## TypeScript Types (`types.ts`)

```typescript
export interface SiteSettings {
  siteTitle?: string
  siteFavicon?: SanityImageSource
  bookCoverImage?: SanityImageSource
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
  backgroundImage?: SanityImageSource
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
- Sanity webhook (ID: `ibtJnljD4nkDRklM`) fires on any document create/update/delete → POSTs to `https://thegreatestwisdomofzen.com/api/revalidate?secret=...` → instantly revalidates `/`, `/acquire`, `/more`, `/contact`
- Publishing in Studio → live site updates immediately (no Vercel redeploy needed)
- Code changes require `git push origin main` → Vercel auto-deploys

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **Buttons** (PDF nav, buy links): `border border-black px-6 py-2 text-sm`, inverts on hover
- **Acquire button** (`/acquire`): starts `bg-white text-black`, inverts to `bg-black text-white` on hover
- **Nav bar** (all inner pages): fixed `height: 80px` brush stroke image strip at absolute top, white text links (`text-white text-sm font-medium hover:opacity-70`); links: Back / More / Contact (Read Online link removed while disabled)
- **Nav bar height**: always exactly 80px regardless of viewport — uses `style={{ height: '80px' }}` (not Tailwind class) and image uses inline `objectFit: 'cover'` to prevent height scaling
- **Contact/Subscribe forms**: no background cards, no border on inputs (`border-0`), section headings use `text-xs uppercase tracking-wide text-neutral-500`
- **PDF reader**: `react-pdf` v10 (`PdfReader.tsx`, `'use client'`), worker loaded from unpkg CDN matching installed pdfjs-dist version; ResizeObserver measures container width and passes it to `Page` `width` prop so PDF fills container with no white space to the right
- **Nav bar image**: brush stroke is an `<img>` with `height: 80px; width: 100%; objectFit: cover` (not CSS background-image) so height is truly fixed at 80px regardless of viewport width
- **Pixel detection**: BookHero draws image to hidden canvas on load; click samples canvas pixel; navigates only if R+G+B < 300
- **View transitions**: `document.startViewTransition` wraps the homepage → /acquire navigation when supported by the browser

## GROQ Queries

Homepage (`page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, bookCoverImage,
  transitionVideo { asset-> { url } }
}
```

Acquire page (`acquire/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  backgroundImage, brushStrokeImage,
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

Contact page (`contact/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  backgroundImage, brushStrokeImage
}
```

## Common Tasks

- **Edit content**: `/studio` → Homepage Settings (opens directly — singleton)
- **Upload book PDF**: Studio → Homepage Settings → Read Online tab → Book PDF → Publish (unused while /read-online is disabled)
- **Upload background/brush stroke images**: Studio → Homepage Settings → More tab → Background Image / Brush Stroke → Publish
- **Upload transition video**: Studio → Homepage Settings → Hero tab → Transition Video → Publish (video plays fullscreen at 1.5x speed when clicking the Enzo image, then navigates to /acquire)
- **Modify schema**: Edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`
- **Deploy code changes**: `git push origin main` → Vercel auto-deploys
- **Add a new page**: Create `src/app/<name>/page.tsx`, add a component in `sections/`, add fields to schema, add `revalidatePath('/<name>')` to `revalidate/route.ts`

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
