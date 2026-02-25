# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer on the homepage. Full-width scrollable book cover image with three overlaid CTA buttons, plus a `/more` page and a `/read-online` page.

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
│   │   └── revalidate/route.ts        # POST — Sanity webhook → revalidates / and /more
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio (singleton structure)
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: book cover image + 3 overlaid buttons
│       ├── MoreSection.tsx            # /more: Home nav + heading + 2 accordions
│       └── ReadOnlineSection.tsx      # /read-online: Home nav + heading + PDF iframe
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
        ├── <img> book cover — full width, natural height, scrollable
        └── [Buy] [More] [Read Online] — 3-col grid, overlaid at bottom of image (small, py-3 text-sm)

/more (accessible via More button only — no navbar link from homepage)
  └── nav: "Home" link top-right (small, subtle)
  └── MoreSection
        ├── Large heading (exploreHeading, 80–120px)
        ├── HR divider
        ├── Description accordion → bookDescription text
        └── Contact accordion
              ├── Subscribe form (email only → /api/subscribe)
              ├── HR + "Or contact directly" label
              └── ContactForm (name/email/phone/subject/message → /api/contact)

/read-online (accessible via Read Online button only)
  └── nav: "Home" link top-left (small, subtle)
  └── ReadOnlineSection
        ├── Large heading (readOnlineTitle, 80–120px)
        └── PDF iframe (85vh, full width) — URL from readOnlinePdf asset
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
RESEND_API_KEY=<from resend.com>
CONTACT_EMAIL=jtharvey6@gmail.com
CONTACT_FROM_EMAIL=<verified sender, optional — defaults to onboarding@resend.dev>
REVALIDATE_SECRET=52b29192da9d64f108e2de838cae6abfe8bec11c
```

Set in `.env.local` for local dev and in Vercel project settings for production (all 4 non-Sanity vars are already set in Vercel).

## ISR / Revalidation

- Pages use `export const revalidate = 60` — auto-refresh every 60 seconds
- Sanity webhook (ID: `ibtJnljD4nkDRklM`) fires on any document create/update/delete → POSTs to `https://thegreatestwisdomofzen.com/api/revalidate?secret=...` → instantly revalidates `/` and `/more`
- Publishing in Studio → live site updates immediately (no Vercel redeploy needed)

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **Homepage buttons**: `bg-white border border-black py-3 text-sm`, absolute positioned over bottom of book cover image, 3-col grid, inverts on hover
- **Accordion**: CSS border triangle rotates 90° when open; `max-h-0 opacity-0` → `max-h-[500vh] opacity-100` transition
- **Page headings** (`/more`, `/read-online`): `text-[80px] font-bold leading-none` (120px on md+)
- **Subtle nav links** (`/more`, `/read-online`): `text-sm text-black hover:opacity-60 transition-opacity`

## GROQ Queries

Homepage:
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, bookCoverImage,
  buyButtonText, buyButtonUrl, moreButtonText, readOnlineButtonText
}
```

More page:
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, exploreHeading, bookDescription
}
```

Read Online page:
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
- **Add a new page**: Create `src/app/<name>/page.tsx`, add a component in `sections/`, add relevant fields to schema, update `revalidate/route.ts` to revalidate the new path

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
