# CLAUDE.md

**The Greatest Wisdom of Zen** — a minimal Next.js + Sanity site for the book. The homepage is a full-screen hero; clicking it plays a transition video and lands on `/acquire`. `/acquire`, `/reviews` and `/contact` share the **"Ink & paper"** treatment — warm paper cards that sit *in* the background photograph rather than on top of it. `/reviews` is a joke reviews page (the book is blank — that's the gag). `/read-online` is currently disabled (404s; the code is kept).

## Architecture

**[`docs/architecture.md`](docs/architecture.md) is the technical record** — structure, design tokens, page-by-page behaviour, schema, GROQ, and the reasoning behind the non-obvious decisions. Read the relevant section before changing anything beyond copy, and **update it in the same commit when you change what it describes.** Nearly every gotcha in it was paid for once already.

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

## Layout

```
src/app/         routes (/, /acquire, /contact, /reviews, /more, /studio) + api/
src/components/  sections/ — one component per page; ViewportSync.tsx
src/sanity/      client, image/live helpers, singleton structure, schemaTypes/
src/lib/         fonts.ts, theme.ts (design tokens), types.ts, utils.ts
```

## Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID=00tez3yv
NEXT_PUBLIC_SANITY_DATASET=production
RESEND_API_KEY=<set in Vercel>
CONTACT_EMAIL=jtharvey6@gmail.com
CONTACT_FROM_EMAIL=<verified sender, optional — defaults to onboarding@resend.dev>
REVALIDATE_SECRET=<set in Vercel>
```

All vars except `CONTACT_FROM_EMAIL` are already configured in Vercel production. Set in `.env.local` for local dev.

## Git

- Main branch: `main`
- Remote: `https://github.com/IndivisiblyPrime/TheGreatestWisdomOfZen.git`
- Push to `main` triggers Vercel deployment automatically
