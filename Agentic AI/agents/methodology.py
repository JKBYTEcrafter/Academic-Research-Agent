import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import SentenceTransformer
import json
import faiss
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
# Embedding Model
# -----------------------------

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# File paths (relative to this file)
# -----------------------------

BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR    = os.path.dirname(BASE_DIR)           # Agentic AI/
TEXT_FILE   = os.path.join(ROOT_DIR, "template_texts.json")
INDEX_FILE  = os.path.join(ROOT_DIR, "methodology_index.faiss")


# -----------------------------
# Build FAISS index from local JSON (only once)
# -----------------------------

def build_vector_db():

    with open(TEXT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    # Support both {"text": "..."} objects and plain strings
    if isinstance(raw, list) and len(raw) > 0 and isinstance(raw[0], dict):
        template_texts = [t["text"] for t in raw]
    else:
        template_texts = raw

    template_embeddings = embedding_model.encode(template_texts)

    dimension = template_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(template_embeddings))

    # Cache for next startup
    faiss.write_index(index, INDEX_FILE)

    return index, template_texts


# -----------------------------
# Load cached FAISS index
# -----------------------------

def load_vector_db():

    index = faiss.read_index(INDEX_FILE)

    with open(TEXT_FILE, "r", encoding="utf-8") as f:
        raw = json.load(f)

    if isinstance(raw, list) and len(raw) > 0 and isinstance(raw[0], dict):
        template_texts = [t["text"] for t in raw]
    else:
        template_texts = raw

    return index, template_texts


# -----------------------------
# Initialize Vector DB
# -----------------------------

if os.path.exists(INDEX_FILE):
    index, template_texts = load_vector_db()
else:
    index, template_texts = build_vector_db()


# -----------------------------
# Retrieval function
# -----------------------------

def retrieve_templates(query, k=5):

    query_embedding = embedding_model.encode([query])

    distances, indices = index.search(
        np.array(query_embedding),
        k
    )

    retrieved = [template_texts[i] for i in indices[0]]

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