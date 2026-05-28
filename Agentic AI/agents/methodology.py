import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
import json
import numpy as np

load_dotenv()

# -----------------------------
# LLM
# -----------------------------

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.4
)

# -----------------------------
# File paths (relative to this file)
# -----------------------------

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.dirname(BASE_DIR)           # Agentic AI/
TEXT_FILE  = os.path.join(ROOT_DIR, "template_texts.json")
INDEX_FILE = os.path.join(ROOT_DIR, "methodology_index.faiss")

# -----------------------------
# Lazy globals (loaded on first use)
# -----------------------------

_embedding_model = None
_index           = None
_template_texts  = None


def _load_resources():
    """Load heavy models only when first needed (saves memory at startup)."""
    global _embedding_model, _index, _template_texts

    if _embedding_model is not None:
        return  # already loaded

    from sentence_transformers import SentenceTransformer
    import faiss

    _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

    if os.path.exists(INDEX_FILE):
        _index, _template_texts = _load_vector_db(faiss)
    else:
        _index, _template_texts = _build_vector_db(faiss)


# -----------------------------
# Build FAISS index from local JSON
# -----------------------------

def _build_vector_db(faiss):

    with open(TEXT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    if isinstance(raw, list) and len(raw) > 0 and isinstance(raw[0], dict):
        template_texts = [t["text"] for t in raw]
    else:
        template_texts = raw

    embeddings = _embedding_model.encode(template_texts)
    dimension  = embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings))

    faiss.write_index(index, INDEX_FILE)

    return index, template_texts


# -----------------------------
# Load cached FAISS index
# -----------------------------

def _load_vector_db(faiss):

    index = faiss.read_index(INDEX_FILE)

    with open(TEXT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    if isinstance(raw, list) and len(raw) > 0 and isinstance(raw[0], dict):
        template_texts = [t["text"] for t in raw]
    else:
        template_texts = raw

    return index, template_texts


# -----------------------------
# Retrieval function
# -----------------------------

def retrieve_templates(query, k=5):

    _load_resources()

    query_embedding = _embedding_model.encode([query])

    distances, indices = _index.search(
        np.array(query_embedding),
        k
    )

    retrieved = [_template_texts[i] for i in indices[0]]

    return "\n\n".join(retrieved)


# -----------------------------
# Methodology Agent
# -----------------------------

def run(state):

    topic = state["topic"]

    # Retrieve relevant methodology templates via RAG
    context = retrieve_templates(topic)

    prompt = f"""
You are an expert research scientist.

Use the following methodology templates as guidance:

{context}

Now design a research methodology for the topic:

{topic}

Include:
- Data sources
- Model architecture
- Experimental setup
- Evaluation metrics
"""

    response = llm.invoke(prompt)

    state["agent_outputs"]["methodology"] = response.content

    return state