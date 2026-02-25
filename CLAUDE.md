# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Project Overview

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity CMS site for the book. No navbar, no footer. Just a full-width scrollable book cover image with two CTA buttons, plus a hidden `/more` page.

## Commands

- `npm run dev` — Dev server at http://localhost:3000
- `npm run build` — Production build (verify before deploying)
- `npm run lint` — ESLint
- `npx sanity@latest schema deploy` — Push schema changes to Sanity project `00tez3yv`
- Sanity Studio embedded at `/studio`

## Stack

- **Next.js** (App Router, TypeScript, React 19)
- **Tailwind CSS v4**
- **Sanity v4** headless CMS (embedded studio, project ID: `00tez3yv`, dataset: `production`)
- **Resend** for email (contact form + subscribe)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                       # Homepage — fetches settings, renders BookHero
│   ├── layout.tsx                     # Root layout (Geist font only)
│   ├── globals.css                    # Global styles (no animations)
│   ├── more/
│   │   └── page.tsx                   # /more route — fetches settings, renders MoreSection
│   ├── api/
│   │   ├── contact/route.ts           # POST — contact form → Resend email
│   │   ├── subscribe/route.ts         # POST — email subscribe → Resend notification
│   │   └── revalidate/route.ts        # ISR revalidation webhook
│   └── studio/[[...tool]]/page.tsx    # Sanity Studio
├── components/
│   └── sections/
│       ├── BookHero.tsx               # Homepage: book cover image + Buy/More buttons
│       └── MoreSection.tsx            # /more page: heading + Description + Contact accordions
├── sanity/
│   ├── env.ts
│   ├── lib/
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── live.ts
│   └── schemaTypes/
│       ├── index.ts                   # Exports: homepageSettings only
│       ├── homepageSettings.ts        # Minimal TGWOZ schema (4 groups)
│       └── heroSection.ts             # Legacy — not used, can be removed later
└── lib/
    ├── types.ts                       # SiteSettings interface only
    └── utils.ts                       # cn() utility
```

## Page Layout

```
/ (Homepage)
  └── BookHero
        ├── <img> book cover (full width, natural height, scrollable)
        └── [Buy] [More] buttons (2-col grid, large outlined boxes)

/more (hidden — no link back except browser back)
  └── MoreSection
        ├── Large "Explore" heading (80–120px)
        ├── HR divider
        ├── Description accordion (bookDescription text)
        └── Contact accordion
              ├── ContactForm (name/email/phone/subject/message → /api/contact)
              ├── HR divider
              └── Subscribe form (email only → /api/subscribe)
```

## Sanity Schema (`homepageSettings.ts`)

Four groups:

| Group   | Fields |
|---------|--------|
| Site    | `siteTitle` (string), `siteFavicon` (image) |
| Hero    | `bookCoverImage` (image, required) |
| Buttons | `buyButtonText` (string, default "Buy"), `buyButtonUrl` (url), `moreButtonText` (string, default "More") |
| More    | `exploreHeading` (string, default "Explore"), `bookDescription` (text, rows 6) |

## TypeScript Types (`types.ts`)

Single interface:

```typescript
export interface SiteSettings {
  siteTitle?: string
  siteFavicon?: SanityImageSource
  bookCoverImage?: SanityImageSource
  buyButtonText?: string
  buyButtonUrl?: string
  moreButtonText?: string
  exploreHeading?: string
  bookDescription?: string
}
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=00tez3yv
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=<from resend.com>
CONTACT_EMAIL=<where notifications go>
CONTACT_FROM_EMAIL=<verified sender, optional — defaults to onboarding@resend.dev>
```

Set in `.env.local` for local dev and in Vercel project settings for production.

## Design System

- **Theme**: Minimal black & white — white background, black text/borders
- **No navbar, no footer** on any page
- **Book cover**: `<img className="block w-full h-auto">` — full width, natural scrollable height
- **Buttons**: `border border-black py-10 text-xl text-center`, inverts on hover
- **Accordion**: CSS border triangle rotates 90° when open; `max-h-0 opacity-0` → `max-h-[500vh] opacity-100`
- **More page heading**: `text-[80px] font-bold leading-none` (120px on md+)

## GROQ Queries

Homepage (`page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, bookCoverImage,
  buyButtonText, buyButtonUrl, moreButtonText
}
```

More page (`more/page.tsx`):
```groq
*[_type == "homepageSettings"][0]{
  siteTitle, siteFavicon, exploreHeading, bookDescription
}
```

## Common Tasks

- **Edit content**: `/studio` → Homepage Settings
- **Modify schema**: Edit `homepageSettings.ts`, then `npx sanity@latest schema deploy`
- **Deploy**: Push to `main` → Vercel auto-deploys

## Git

- Main branch: `main`
- Remote: GitHub (the-greatest-wisdom-of-zen repo)
- Push to `main` triggers Vercel deployment
