# CMS setup (Sanity Studio)

This repo contains a separate Sanity Studio in `cms/` and the Next.js app at the repo root.

## Environment variables

### App (Next.js, repo root)

Set these in `.env.local` (and in the **App** Vercel project):

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)

### CMS (Sanity Studio, `cms/`)

Set these in `.env.local` inside `cms/` (and in the **CMS** Vercel project):

- `SANITY_PROJECT_ID`
- `SANITY_STUDIO_DATASET` (usually `production`)

## Local development

### App

From repo root:

```bash
pnpm dev
```

### CMS (Sanity Studio)

From `cms/`:

```bash
pnpm dev
```

## Vercel deployment (separate deployments)

### App deployment

- **Root Directory**: repo root
- **Build Command**: `pnpm build`
- **Output**: Next.js default
- **Env**: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

### CMS deployment

- **Root Directory**: `cms`
- **Build Command**: `pnpm build` (runs `sanity build`)
- **Output Directory**: `dist`
- **Env**: `SANITY_PROJECT_ID`, `SANITY_STUDIO_DATASET`

## Content checklist in Studio

Create:

- **1×** `landingPage` document (Hero + Nutrition/Allergies/Delivery/Returns)
- **N×** `testimonial` documents
- **N×** `product` documents (with multiple images)
- **N×** `faqItem` documents
- **N×** `whoIsItForItem` documents (set `order` for sorting)
