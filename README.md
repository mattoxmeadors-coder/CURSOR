# 见家长 AI Copilot

AI-first family interaction copilot for high-stakes relationship moments such as:

- preparing for the first family visit
- aligning with a partner before sensitive conversations
- generating a same-day battle plan
- extending into content, follow-up, and social automation

## What is included

- **Three top-level entry points**
  - Start preparing this visit
  - Align with your partner
  - Generate my battle plan
- **Structured domain engine**
  - family style profiles
  - risk dimensions
  - behavior tendencies
  - scenario recommendations
- **Copilot API**
  - accepts structured inputs
  - returns diagnosis, battle plan, knowledge recommendations, partner alignment tasks, and social content seeds
- **Next.js web app**
  - single-page product shell
  - interactive form
  - generated result view

## Tech stack

- Next.js (App Router)
- TypeScript
- React
- CSS via global stylesheet

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Key files

- `app/page.tsx` - product homepage
- `components/copilot-form.tsx` - interactive user flow
- `app/api/copilot/route.ts` - API endpoint
- `lib/types.ts` - domain types
- `lib/content.ts` - structured product content
- `lib/engine.ts` - diagnosis and battle plan generation
- `lib/defaults.ts` - default seed data

## Product philosophy

This project intentionally keeps the **front-end simple** while building a **top-tier capability base** underneath:

- do not compress capability
- compress surface complexity
- route users by scenario
- generate action, not generic inspiration
