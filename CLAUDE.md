# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-viewport-height hero with a small (~160px), left-aligned book cover image (pixel-detection click navigates to `/more` only when clicking dark/black brush strokes). The `/more` page is a full layered layout with a background image wipe, sequenced content animations, and a brush stroke nav bar. Read Online and Contact are their own dedicated pages.

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
│   ├── more/
│   │   └── page.tsx                   # /more route — fetches settings, renders MoreSection
│   ├── read-online/
│   │   └── page.tsx                   # /read-online route — fetches settings, renders ReadOnlineSection
│   ├── contact/
│   │   └── page.tsx                   # /contact route — renders ContactSection
│   ├── api/
│   │   ├── contact/route.ts           # POST — contact form → Resend email
│   │   ├── subscribe/route.ts         # POST — email subscribe → Resend notification
│   │   └── revalidate/route.ts        # POST — Sanity webhook → revalidates /, /more, /read-online, /contact
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio (singleton structure)
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: left-aligned ~160px hero, pixel-sampled cursor, view-transition → /more
│       ├── NavBackground.tsx          # Shared layout: background image + fixed 80px brush stroke nav (no animation)
│       ├── MoreSection.tsx            # /more: layered animations (first visit only via sessionStorage), Enzo always visible
│       ├── ReadOnlineSection.tsx      # /read-online: NavBackground wrapper + PdfReader
│       ├── ContactSection.tsx         # /contact: NavBackground wrapper + SubscribeForm + ContactForm
│       └── PdfReader.tsx              # Client component: react-pdf page-by-page reader with prev/next nav
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
        └── <div onClick> wrapping hidden <canvas> + <img> book cover
              — h-screen flex items-center justify-start pl-16
              — image: w-40 h-auto (~160px), left-aligned, cursor-pointer
              — style: viewTransitionName: 'book-cover'
              — canvas pixel check: R+G+B < 300 → document.startViewTransition → router.push('/more')
              — clicking empty/beige areas does nothing

/more (accessible by clicking black strokes on the Enzo image)
  └── MoreSection ('use client')
        ├── sessionStorage key 'more-visited': animation runs ONCE (first arrival from homepage)
        │     on revisit, everything is immediately visible — no animation replays
        ├── Enzo (book cover): ALWAYS immediately visible, no animation
        ├── Background image: wipes in from left on first visit
        ├── Content (title + hr + description + buy button): slideInLeft/fadeIn sequence
        └── Brush stroke nav (fixed 80px, absolute top): wipes in last on first visit
              Back → / | More → /more | Read Online → /read-online | Contact → /contact

/read-online and /contact share NavBackground ('use server'-compatible component):
  ├── Background image: same as /more, immediately visible (no animation)
  ├── Brush stroke nav: same image, fixed 80px at top, immediately visible
  │     Back → / | More → /more | Read Online → /read-online | Contact → /contact
  ├── /read-online content: PdfReader (dynamically loaded, ssr: false)
  └── /contact content: SubscribeForm + ContactForm (no bg cards, no border on inputs)
```

## Animation Sequence on /more (first visit only)

Controlled by `sessionStorage.getItem('more-visited')`. Set on first visit; cleared when browser session ends.

| Element | Keyframe | Duration | Delay | Notes |
|---------|----------|----------|-------|-------|
| Book cover (Enzo) | — | — | — | Always immediately visible |
| Background image | `wipeFromLeft` | 2500ms | 0ms | |
| Title (h1) | `slideInLeft` | 1200ms | 3000ms | |
| HR divider | `fadeIn` | 1000ms | 3800ms | |
| Description | `slideInLeft` | 1200ms | 4500ms | |
| Buy button | `fadeIn` | 1000ms | 5500ms | |
| Brush stroke nav | `wipeFromLeft` | 2000ms | 6500ms | |
| Nav buttons | `fadeIn` | 1200ms | 8000ms | |

## Sanity Schema (`homepageSettings.ts`)

Five groups:

| Group       | Fields |
|-------------|--------|
| Site        | `siteTitle` (string), `siteFavicon` (image) |
| Hero        | `bookCoverImage` (image, required) |
| Buttons     | `buyButtonText` (default "Buy"), `buyButtonUrl` (url), `moreButtonText` (default "More"), `readOnlineButtonText` (default "Read Online") |
| More        | `exploreHeading` (default "Explore"), `bookDescription` (text, rows 6), `backgroundImage` (image, hotspot), `brushStrokeImage` (image) |
| Read Online | `readOnlineTitle` (default "Read Online"), `readOnlinePdf` (file, accept: pdf) |

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
- Sanity webhook (ID: `ibtJnljD4nkDRklM`) fires on any document create/update/delete → POSTs to `https://thegreatestwisdomofzen.com/api/revalidate?secret=...` → instantly revalidates `/`, `/more`, `/read-online`, `/contact`
- Publishing in Studio → live site updates immediately (no Vercel redeploy needed)
- Code changes require `git push origin main` → Vercel auto-deploys

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **Buttons** (PDF nav, buy links): `border border-black px-6 py-2 text-sm`, inverts on hover
- **Nav bar** (all inner pages): fixed `height: 80px` brush stroke image strip at absolute top, white text links (`text-white text-sm font-medium hover:opacity-70`); links: Back / More / Read Online / Contact
- **Nav bar height**: always exactly 80px regardless of viewport — uses `style={{ height: '80px' }}` (not Tailwind class) and image uses inline `objectFit: 'cover'` to prevent height scaling
- **Contact/Subscribe forms**: no background cards, no border on inputs (`border-0`), section headings use `text-xs uppercase tracking-wide text-neutral-500`
- **PDF reader**: `react-pdf` v10 (`PdfReader.tsx`, `'use client'`), worker loaded from unpkg CDN matching installed pdfjs-dist version
- **Pixel detection**: BookHero draws image to hidden canvas on load; click samples canvas pixel; navigates only if R+G+B < 300
- **View transitions**: `viewTransitionName: 'book-cover'` on img in BookHero and MoreSection; `document.startViewTransition` wraps navigation when supported

## GROQ Queries

Homepage (`page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, bookCoverImage,
  buyButtonText, buyButtonUrl, moreButtonText, readOnlineButtonText
}
```

More page (`more/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  bookCoverImage, backgroundImage, brushStrokeImage,
  buyButtonText, buyButtonUrl,
  bookDescription
}
```

Read Online page (`read-online/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon,
  readOnlineTitle,
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
- **Upload book PDF**: Studio → Homepage Settings → Read Online tab → Book PDF → Publish
- **Upload background/brush stroke images**: Studio → Homepage Settings → More tab → Background Image / Brush Stroke → Publish
- **Modify schema**: Edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`
- **Deploy code changes**: `git push origin main` → Vercel auto-deploys
- **Add a new page**: Create `src/app/<name>/page.tsx`, add a component in `sections/`, add fields to schema, add `revalidatePath('/<name>')` to `revalidate/route.ts`

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
