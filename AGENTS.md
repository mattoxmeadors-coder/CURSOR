# AGENTS.md

## Cursor Cloud specific instructions

This is a **Next.js 16 (App Router)** application — an AI Family Visit Copilot (见家长 AI Copilot). It is a single-service web app with no external dependencies (no database, no third-party APIs).

### Running the app

- `npm run dev` starts the Next.js dev server on `http://localhost:3000`.
- The app has a single API route at `POST /api/copilot` that accepts structured JSON input and returns a deterministic copilot response (no LLM calls; uses rule-based engine in `lib/engine.ts`).

### Available npm scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint (flat config, `eslint.config.mjs`) |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`) |

### Key caveats

- The project uses `package-lock.json` — always use **npm** (not pnpm/yarn).
- No automated test suite exists yet (no test framework configured).
- The copilot engine (`lib/engine.ts`) is purely rule-based; there are no API keys or secrets needed.
