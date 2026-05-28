# 🧠 Academic Research Agent

An AI-powered multi-agent system that automates academic research proposal generation. Built with **LangGraph**, **Gemini 2.5 Flash**, and **React + Vite**.

[![Deploy Frontend](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Deploy Backend](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)

---

## ✨ Features

- 🤖 **9 Specialized AI Agents** — each handles a distinct part of the research workflow
- ⚡ **Full Pipeline Mode** — run all agents in sequence and get a complete grant proposal
- 📋 **Copy & Download** — export any output as a Markdown file
- 🔍 **RAG-powered Methodology** — retrieves relevant methodology templates via FAISS vector search
- 🌙 **Premium Dark UI** — built with React, Tailwind CSS, and Framer Motion

---

## 🤖 Agents

| Agent | Role |
|-------|------|
| 📌 **Planning Agent** | Defines problem statement, objectives & research questions |
| 🔍 **Literature Retrieval** | Finds 5 relevant recent research papers |
| 📖 **Literature Analysis** | Extracts trends, methods & limitations from papers |
| 🔬 **Research Gap** | Identifies unexplored areas in the field |
| ✨ **Novelty Evaluator** | Assesses and scores the innovation of the idea |
| 🏆 **Funding Alignment** | Matches proposal with suitable funding agencies |
| 💡 **Methodology Design** | Designs data sources, model architecture & evaluation plan (RAG) |
| 💰 **Budget & Timeline** | Generates cost estimates (₹) and project timeline |
| 📝 **Proposal Writer** | Writes the complete grant proposal document |

---

## 🏗️ Architecture

```
User (Browser)
      │
      ▼
 Vercel  ─── React + Vite Frontend
      │
      │  POST /run-agent   (single agent)
      │  POST /run-full    (full pipeline)
      ▼
 Render  ─── Flask REST API
      │
      ├──► Gemini 2.5 Flash  (via LangChain)
      ├──► LangGraph Pipeline (agent orchestration)
      └──► FAISS + sentence-transformers (RAG for methodology)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) (free)

### 1. Clone the repo
```bash
git clone https://github.com/JKBYTEcrafter/Academic-Research-Agent.git
cd Academic-Research-Agent
```

### 2. Backend Setup
```bash
cd "Agentic AI"

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variables
copy .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Run the server
python app.py
# Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Set environment variable
copy .env.example .env.local
# Edit .env.local → VITE_API_URL=http://localhost:5000

# Start dev server
npm run dev
# Runs on http://localhost:5173
```

---

## 📁 Project Structure

```
Academic-Research-Agent/
│
├── Agentic AI/                  # Flask Backend
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── planner.py           # Planning agent
│   │   ├── literature_retrieval.py
│   │   ├── literature_analysis.py
│   │   ├── research_gap.py
│   │   ├── novelty.py
│   │   ├── funding_alignment.py
│   │   ├── methodology.py       # RAG-powered agent
│   │   ├── budget.py
│   │   └── writer.py
│   ├── app.py                   # Flask API endpoints
│   ├── graph.py                 # LangGraph pipeline definitions
│   ├── template_texts.json      # Methodology RAG templates
│   ├── requirements.txt
│   └── .env.example
│
├── Frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx              # Main application
│   │   ├── App.css
│   │   └── index.css
│   ├── vercel.json
│   └── .env.example
│
├── render.yaml                  # Render deployment config
└── README.md
```

---

## 🌐 Deployment

### Backend → [Render](https://render.com)

| Setting | Value |
|---------|-------|
| Root Directory | `Agentic AI` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `gunicorn app:app --bind 0.0.0.0:$PORT` |

**Environment Variable required:**
```
GOOGLE_API_KEY = your_gemini_api_key
```

### Frontend → [Vercel](https://vercel.com)

| Setting | Value |
|---------|-------|
| Root Directory | `Frontend` |
| Framework | `Vite` |

**Environment Variable required:**
```
VITE_API_URL = https://your-render-app.onrender.com
```

---

## 🔌 API Endpoints

### `POST /run-agent`
Run a single agent.

```json
// Request
{ "topic": "Deep learning for cancer detection", "agent": "planning" }

// Response
{ "output": "..." }
```

**Agent IDs:** `planning` · `retrieval` · `analysis` · `gap` · `novelty` · `funding` · `methodology` · `budget` · `writer`

---

### `POST /run-full`
Run the complete pipeline (all 9 agents).

```json
// Request
{ "topic": "Deep learning for cancer detection" }

// Response
{
  "planning": "...",
  "retrieval": "...",
  "analysis": "...",
  "gap": "...",
  "novelty": "...",
  "funding": "...",
  "methodology": "...",
  "budget": "...",
  "writer": "..."
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **LLM** | Google Gemini 2.5 Flash |
| **Agent Orchestration** | LangGraph |
| **RAG** | FAISS + sentence-transformers (`all-MiniLM-L6-v2`) |
| **Backend** | Flask + Flask-CORS |
| **Frontend** | React 19 + Vite + Tailwind CSS |
| **Animations** | Framer Motion |
| **Markdown** | react-markdown + remark-gfm |

---

## 📄 License

MIT License — feel free to use, modify and distribute.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/JKBYTEcrafter">JKBYTEcrafter</a> & <a href="https://github.com/id1509">id1509</a>
</div>
