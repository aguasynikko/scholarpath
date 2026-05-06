# ScholarPath

RAG-powered scholarship & financial aid navigator for Mapúa University. Python FastAPI backend + React frontend, grounded on the official scholarship handbook PDF.

## Prerequisites
- Python 3.11+
- Node.js 18+
- A free [Groq API key](https://console.groq.com/keys) (uses `llama-3.3-70b-versatile` by default)

## Setup

### 1. Place the handbook
Copy `scholarshiphandbook.pdf` into [backend/data/](backend/data/).

### 2. Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# edit .env and set GROQ_API_KEY

# build the vector index (one-time, ~1-2 min on first run for embedding model download)
python -m app.ingest.build_index

# run API
uvicorn app.main:app --reload --port 8000
```
API docs: http://localhost:8000/docs

### 3. Frontend
```powershell
cd frontend
npm install
npm run dev
```
App: http://localhost:5173

## How it works
1. `app.ingest.build_index` reads the handbook PDF, chunks per page, embeds via `sentence-transformers/all-MiniLM-L6-v2`, persists to ChromaDB.
2. On each chat request, `app/rag/retriever.py` pulls top-k chunks; `app/rag/chain.py` sends them as grounded context to Llama 3.3 70B (hosted by Groq) with strict no-hallucination rules.
3. Response includes inline page citations and a collapsible source list in the UI.

## Re-ingesting after handbook updates
```powershell
python -m app.ingest.build_index --reset
```

## Project layout
See [CLAUDE.md](CLAUDE.md) for architecture, conventions, and safety rules.
