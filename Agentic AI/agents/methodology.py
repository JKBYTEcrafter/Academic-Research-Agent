import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from sentence_transformers import SentenceTransformer
import boto3
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
# AWS Credentials
# -----------------------------

aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
region = os.getenv("AWS_REGION")

s3 = boto3.client(
    "s3",
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=region
)

# -----------------------------
# Files for stored vector DB
# -----------------------------

INDEX_FILE = "methodology_index.faiss"
TEXT_FILE = "template_texts.json"


# -----------------------------
# Build FAISS index (only once)
# -----------------------------

def build_vector_db():

    response = s3.get_object(
        Bucket="methodology-templates",
        Key="Rag_templates.json"
    )

    data = response["Body"].read().decode("utf-8")

    templates = json.loads(data)

    template_texts = [t["text"] for t in templates]

    template_embeddings = embedding_model.encode(template_texts)

    dimension = template_embeddings.shape[1]

    index = faiss.IndexFlatL2(dimension)

    index.add(np.array(template_embeddings))

    # Save index
    faiss.write_index(index, INDEX_FILE)

    # Save texts
    with open(TEXT_FILE, "w") as f:
        json.dump(template_texts, f)

    return index, template_texts


# -----------------------------
# Load FAISS index
# -----------------------------

def load_vector_db():

    index = faiss.read_index(INDEX_FILE)

    with open(TEXT_FILE) as f:
        template_texts = json.load(f)

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

    retrieved = []

    for i in indices[0]:
        retrieved.append(template_texts[i])

    return "\n\n".join(retrieved)


# -----------------------------
# Methodology Agent
# -----------------------------

def run(state):

    topic = state["topic"]

    # Retrieve methodology templates
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