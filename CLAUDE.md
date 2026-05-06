# ScholarPath

## Project Overview
ScholarPath is a RAG-powered scholarship & financial aid navigator for Mapúa University students, indexing the official scholarship handbook (institutional, donor, and government grants) to answer eligibility questions in plain language. Pilot users are Mapúa undergraduates/graduates, the Office of Student Affairs (OSA), and partner donors.

## Tech Stack
- **Frontend:** React 18 + Vite, TypeScript, TailwindCSS, React Router, TanStack Query (server state), Axios.
- **Backend:** Node.js 18+, Express, TypeScript, Zod (request validation).
- **RAG pipeline:** `pdf-parse` for handbook extraction, in-memory BM25 search via `wink-bm25-text-search` (no embeddings, no vector DB), **Llama 3.3 70B via Groq API** for generation. Chunks persisted to a single `data/chunks.json` file (~5 MB).
- **Auth/storage (planned):** Mapúa student-ID gated; SQLite for dev, Postgres for prod.

## Architecture
```
scholarpath/
├── frontend/                  React + Vite app
│   ├── src/
│   │   ├── components/        Reusable UI (Chat, ScholarshipCard, ProfileForm)
│   │   ├── pages/             Route-level views (Dashboard, Chat, Profile, Admin)
│   │   ├── hooks/             Custom hooks (useChat, useEligibility)
│   │   ├── api/               Axios client + typed endpoint wrappers
│   │   ├── types/             Shared TS types mirroring backend Zod schemas
│   │   └── lib/               Utilities, formatters
│   └── public/
├── backend/                   Node.js + Express service
│   ├── src/
│   │   ├── main.ts            Express entrypoint
│   │   ├── config.ts          Env-driven config
│   │   ├── types.ts           Zod schemas + shared types
│   │   ├── routes/            Route handlers (chat.ts)
│   │   ├── rag/               retriever (BM25), chain (Groq prompt + answer)
│   │   └── ingest/            PDF loader + chunker (buildIndex.ts)
│   └── data/                  scholarshiphandbook.pdf (source of truth) + chunks.json (gitignored)
└── docs/
```

## Coding Conventions
- **Frontend:** Function components only. PascalCase files for components (`ScholarshipCard.tsx`), camelCase for hooks (`useChat.ts`). Co-locate component-specific styles. Server state via TanStack Query — never store API data in `useState`. Local UI state in `useState`/`useReducer`. No global Redux unless justified.
- **Backend:** camelCase files (`buildIndex.ts`), PascalCase Zod schemas. One router per resource. Business logic in `rag/` and `ingest/` — keep routes thin. `tsc --noEmit` clean; `strict: true` in tsconfig.
- **RAG:** Always cite source chunks (page + section) in chat responses. Never let the LLM answer without retrieval grounding for eligibility questions — refuse rather than hallucinate.
- **API contract:** OpenAPI schema is the source of truth. Frontend `types/` regenerated from it; do not hand-edit.
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`).

## Common Commands
```bash
# Frontend
cd frontend
npm install
npm run dev          # Vite dev server (http://localhost:5173)
npm run build
npm run lint         # ESLint + Prettier check
npm run test         # Vitest

# Backend
cd backend
npm install
npm run dev          # Express on http://localhost:8000 (hot reload via tsx)
npm run typecheck    # tsc --noEmit

# Ingest handbook into BM25 index (one-time / on handbook updates)
npm run ingest       # writes data/chunks.json
```

## Safety Rules
- **Never modify** `backend/data/scholarshiphandbook.pdf` — it is the canonical knowledge source. Replace only via a versioned re-ingest, never edit in place.
- **Never commit** `.env`, `.env.local`, `backend/data/chunks.json`, or any local secrets. Use `.env.example` for shared config templates.
- **Never bypass retrieval** in the RAG chain to answer eligibility questions directly from LLM parametric knowledge — Mapúa policies change and ungrounded answers are a compliance risk.
- **Never store** student PII (GWA, income bracket, student ID) in logs or vector metadata. Note: profile data (GWA, income, program) IS sent to Groq's API on each chat call — pilot users must be informed in the UI consent flow before this ships beyond dev.
- **Never auto-edit** generated `frontend/src/types/api.ts` (regenerate from OpenAPI instead).
- **Never delete** `data/chunks.json` without confirmation — it's the indexed handbook output. Regenerating only takes seconds (`npm run ingest`), but only when the handbook PDF is text-extractable.
