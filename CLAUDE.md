# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-viewport-height hero with a centered book cover image (clickable, links to `/more`), plus a `/more` page and a `/read-online` page.

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
│   ├── layout.tsx                     # Root layout (Geist font only, no Dancing Script)
│   ├── globals.css                    # Global styles (no custom animations)
│   ├── more/
│   │   └── page.tsx                   # /more route — fetches settings, renders MoreSection
│   ├── read-online/
│   │   └── page.tsx                   # /read-online route — fetches settings, renders ReadOnlineSection
│   ├── api/
│   │   ├── contact/route.ts           # POST — contact form → Resend email
│   │   ├── subscribe/route.ts         # POST — email subscribe → Resend notification
│   │   └── revalidate/route.ts        # POST — Sanity webhook → revalidates /, /more, /read-online
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio (singleton structure)
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: full-viewport hero, centered cover image linked to /more
│       ├── MoreSection.tsx            # /more: nav + heading + 2 accordions
│       ├── ReadOnlineSection.tsx      # /read-online: nav + heading + PdfReader
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
    ├── types.ts                       # SiteSettings interface only
    └── utils.ts                       # cn() utility
```

## Page Layout

```
/ (Homepage)
  └── BookHero
        └── <a href="/more"> wrapping <img> book cover
              — h-screen flex items-center justify-center
              — image: max-h-[85vh] w-auto, centered
              — clicking anywhere on the image navigates to /more

/more (accessible by clicking the cover image)
  └── nav top-left: Home · More · Read Online (text-sm, gap-6, hover:opacity-60)
  └── MoreSection
        ├── Large heading (exploreHeading, 80–120px)
        ├── HR divider
        ├── Description accordion → bookDescription text (whitespace-pre-wrap)
        └── Contact accordion
              ├── bg-[#faf8f5] card: Subscribe form (email only → /api/subscribe)
              ├── bg-[#faf8f5] card: "Or contact directly" + ContactForm (→ /api/contact)

/read-online (accessible via nav)
  └── nav top-left: Home · More · Read Online (same style as /more)
  └── ReadOnlineSection
        ├── Large heading (readOnlineTitle, 80–120px)
        └── PdfReader (react-pdf, page-by-page)
              — max-w-2xl mx-auto centered
              — prev/next buttons + page counter (1 / N)
              — buttons: same border/hover style as design system
```

## Sanity Schema (`homepageSettings.ts`)

Five groups:

| Group       | Fields |
|-------------|--------|
| Site        | `siteTitle` (string), `siteFavicon` (image) |
| Hero        | `bookCoverImage` (image, required) |
| Buttons     | `buyButtonText` (default "Buy"), `buyButtonUrl` (url), `moreButtonText` (default "More"), `readOnlineButtonText` (default "Read Online") |
| More        | `exploreHeading` (default "Explore"), `bookDescription` (text, rows 6) |
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
- Sanity webhook (ID: `ibtJnljD4nkDRklM`) fires on any document create/update/delete → POSTs to `https://thegreatestwisdomofzen.com/api/revalidate?secret=...` → instantly revalidates `/`, `/more`, and `/read-online`
- Publishing in Studio → live site updates immediately (no Vercel redeploy needed)
- Code changes require `git push origin main` → Vercel auto-deploys

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **Buttons** (PDF nav, formerly homepage): `border border-black bg-white px-8 py-3 text-sm`, inverts black on hover, `disabled:opacity-30`
- **Accordion**: CSS `border` triangle arrow rotates 90° when open; `max-h-0 opacity-0` → `max-h-[500vh] opacity-100` transition (duration-500)
- **Contact panel**: subscribe form and contact form are separate `bg-[#faf8f5] px-6 py-6` cards (warm off-white), spaced with `space-y-4`
- **Page headings**: `text-[80px] font-bold leading-none tracking-tight` (md: `text-[120px]`)
- **Nav links** on `/more` and `/read-online`: `flex items-center gap-6 px-8 py-4`, links are `text-sm text-black hover:opacity-60 transition-opacity`
- **PDF reader**: `react-pdf` v10 (`PdfReader.tsx`, `'use client'`), worker loaded from unpkg CDN matching installed pdfjs-dist version

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
  siteTitle, siteFavicon, exploreHeading, bookDescription
}
```

Read Online page (`read-online/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, readOnlineTitle,
  readOnlinePdf { asset-> { url } }
}
```

## Common Tasks

- **Edit content**: `/studio` → Homepage Settings (opens directly — singleton)
- **Upload book PDF**: Studio → Homepage Settings → Read Online tab → Book PDF → Publish
- **Modify schema**: Edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`
- **Deploy code changes**: `git push origin main` → Vercel auto-deploys
- **Add a new page**: Create `src/app/<name>/page.tsx`, add a component in `sections/`, add fields to schema, add `revalidatePath('/<name>')` to `revalidate/route.ts`

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
