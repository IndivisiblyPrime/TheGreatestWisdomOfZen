# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Indivisibly Prime** - Jack Harvey's personal website built with Next.js + Sanity CMS.

## Commands

- `npm run dev` - Dev server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - ESLint
- Sanity Studio is embedded at `/studio`

## Stack

- **Next.js 16** (App Router, TypeScript, React 19)
- **Tailwind CSS v4** + **shadcn/ui** components
- **Sanity v4** headless CMS (embedded studio)
- **Aceternity UI** effects (encrypted-text — shooting-stars/stars-background are installed but no longer used in the main page)
- **Lucide React** icons
- **Radix UI** (via shadcn accordion)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage - server component with ISR (60s)
│   ├── layout.tsx                  # Root layout (Geist font)
│   ├── globals.css                 # Global styles + animations (marquee, title-draw, line-draw)
│   └── studio/[[...tool]]/page.tsx # Sanity Studio mount
├── components/
│   ├── Navbar.tsx                  # Fixed navbar: transparent at top, white/blur when scrolled
│   ├── sections/
│   │   ├── HeroSection.tsx         # Full-screen hero with video/image background
│   │   ├── ExploreSection.tsx      # Main content area — 3-panel accordion (Book, NFTs, About Me)
│   │   ├── Footer.tsx              # Minimal B&W scrolling marquee
│   │   ├── BookSection.tsx         # (legacy — unused, keep in place)
│   │   ├── NFTSection.tsx          # (legacy — unused, keep in place)
│   │   ├── CTASection.tsx          # (legacy — unused, keep in place)
│   │   └── AboutSection.tsx        # (legacy — unused, keep in place)
│   └── ui/                         # shadcn + Aceternity components
│       ├── accordion.tsx           # Radix accordion (used inside ExploreSection About panel)
│       ├── button.tsx
│       ├── encrypted-text.tsx      # Character reveal animation (used in NFT panel)
│       ├── shooting-stars.tsx      # (installed, not currently used)
│       └── stars-background.tsx    # (installed, not currently used)
├── sanity/
│   ├── env.ts                      # Environment variables
│   ├── lib/
│   │   ├── client.ts               # Sanity client
│   │   ├── image.ts                # Image URL builder (urlFor)
│   │   └── live.ts                 # Live preview
│   └── schemaTypes/
│       ├── index.ts                # Schema exports
│       ├── homepageSettings.ts     # Main document schema (all sections)
│       └── heroSection.ts          # Legacy hero schema
└── lib/
    ├── types.ts                    # All TypeScript interfaces
    └── utils.ts                    # cn() utility from shadcn
```

## Page Layout (current)

```
Navbar (fixed, transparent → white on scroll)
  └── HeroSection        (full-screen video/image)
  └── ExploreSection     (white bg, accordion — the main content area)
        ├── Book panel   (two-col: animated title + description + button | tall book cover image)
        ├── NFTs panel   (3-col portrait/landscape/portrait grid + CTA + encrypted text)
        └── About Me panel (LinkedIn/Instagram icons + Radix accordion with bio/experience/contact)
  └── Footer             (minimal B&W marquee, id="coming-soon")
```

Old section order (pre-revamp): Hero → BookSection → NFTSection → CTASection → AboutSection → Footer.
The four old sections are replaced by `ExploreSection`. Do not delete the old files — they may be referenced elsewhere or revived later.

## ExploreSection Architecture

**File**: `src/components/sections/ExploreSection.tsx`

- Top-level state: `open: Set<string>` (allows multiple panels open simultaneously), `bookAnimKey: number` (increments on each book panel open to retrigger title animation)
- Three panels defined as `PANELS = [{id, title}]`
- Panel expand/collapse uses `max-h-0` → `max-h-[500vh]` + `opacity` CSS transition

### Book Panel
- Two-column grid (`grid-cols-[1fr_1fr]`)
- Title uses `clip-path` draw animation (`animate-title-draw`) + underline draw (`animate-line-draw`) — triggered via `useEffect` + forced reflow when `isOpen` changes
- Book cover image: `h-[85vh] object-cover`

### NFT Panel
- `grid-cols-1` on mobile (stacked), `grid-cols-[1fr_1.5fr_1fr]` on `sm:` desktop with `items-end` (bottom-aligned)
- Images use natural aspect ratios (`w-auto h-auto max-h-[50vh] object-contain`) — no cropping, no fixed row height
- `nftGallery[0]` | `landscapeGallery[0]` | `nftGallery[1]`
- CTA button (outlined) + `<EncryptedText triggerOnHover>` below
- Fields come from CTA group in schema (`ctaButtonText`, `ctaButtonUrl`, `encryptedText`)

### About Panel
- LinkedIn + Instagram icon buttons (44px black squares) sourced from `socialLinks[]` (falls back to `instagramUrl` field)
- Radix accordion restyled minimal (no dark bg, no numbered circles)
- Supports four accordion item types:
  - `text` — plain text (whitespace-pre-wrap)
  - `experience` — job cards with logo/title/company/dateRange/description + vertical timeline line connecting entries
  - `logoFreeform` — same card structure as experience but **no** vertical connecting line; logo is optional
  - `contact` — inline form POSTing to `/api/contact`

## Design System

- **Theme**: Minimal black & white — white backgrounds, black text/borders, no dark sections
- **Typography**: Geist Sans; "Explore" heading 80–120px; section titles 3xl–4xl italic
- **Animations**: `title-draw` (clip-path reveal LTR), `line-draw` (scaleX underline), `marquee` (25s infinite)
- **Buttons**: Outlined `border border-black px-6 py-2`, invert on hover (`hover:bg-black hover:text-white`)
- **Navbar**: Black text at all times; `bg-white/95 backdrop-blur-sm shadow-sm` when scrolled past 50px
- **Responsive**: Mobile-first, grids collapse to single column at `md:` breakpoint

## Sanity Schema (homepageSettings)

The schema is organized into groups:

| Group | Fields |
|-------|--------|
| Site | `siteTitle`, `siteFavicon` |
| Navigation | `navItems[]` (label + target section ID) |
| Hero | `heroImage`, `heroVideo` (file), `heroVideoUrl` (external) |
| Book | `bookTitle`, `bookDescription`, `bookImage`, `bookButtonText`, `bookButtonUrl` |
| NFT Gallery | `nftSectionTitle`, `nftSectionSubtitle`, `nftGallery[]` (portrait images), `landscapeGallery[]` (landscape images) |
| CTA | `ctaButtonText`, `ctaButtonUrl`, `encryptedText` |
| About | `aboutAccordion[]` (itemType: text/experience/logoFreeform/contact), `socialLinks[]` (platform + url), `instagramUrl` (fallback URL field) |
| Footer | `footerMarqueeItems[]` (text, optional icon) |

### NFT grid image slots
- `nftGallery[0]` → left portrait column
- `landscapeGallery[0]` → centre landscape column
- `nftGallery[1]` → right portrait column

## TypeScript Types (src/lib/types.ts)

Key interfaces: `HomepageSettings`, `NFTItem`, `AccordionItem`, `ExperienceEntry`, `LogoFreeformEntry`, `SocialLink`, `MarqueeItem`, `NavItem`

`ExperienceEntry.description` — freeform text (replaces the old `bullets: string[]` array)
`LogoFreeformEntry` — logo/title/subtitle/dateRange/description; rendered without timeline line

`HomepageSettings.instagramUrl` — optional standalone Instagram URL (fallback if not in `socialLinks[]`)

## CSS Animations (globals.css)

| Class | Keyframes | Use |
|-------|-----------|-----|
| `animate-ticker` | translateX(0→-50%) 30s | Footer scrolling text (RAF-driven, delta clamped to 50ms, while-loop reset) |
| `animate-title-draw` | clip-path inset reveal 1.4s | Book panel title |
| `animate-line-draw` | scaleX(0→1) 1.4s | Book panel underline |

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=<project-id>
NEXT_PUBLIC_SANITY_DATASET=<dataset-name>
```

## Common Tasks

- **Edit content**: Go to `/studio` → Homepage Settings. All text, images, links are CMS-driven.
- **Add a new explore panel**: Add a new entry to `PANELS` in `ExploreSection.tsx`, add a new render block in the panel body, and add corresponding fields to `homepageSettings.ts` schema + `types.ts`.
- **Modify Sanity schema**: Edit `src/sanity/schemaTypes/homepageSettings.ts`, then deploy with `npx sanity@latest schema deploy`
- **Add UI component**: `npx shadcn@latest add <component>` or install from Aceternity
- **Deploy**: Push to main branch (auto-deploys via Vercel)
- **Re-enable dark sections**: The legacy section files (BookSection, NFTSection, CTASection, AboutSection) are untouched. To restore them, re-import and add to page.tsx.

## Git Workflow

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/indivisibly-prime.git`
- Push to main triggers Vercel deployment

## Final Task
- Always update this file "Claude.md" with any edits
