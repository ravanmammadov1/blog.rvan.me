import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

# LM Studio Local Infrastructure
LM_STUDIO_BASE_URL = "http://127.0.0.1:1234/v1"
EMBEDDING_MODEL = "text-embedding-qwen3-embedding-0.6b"
EXPECTED_DIMENSION = 1024

# ChromaDB & Persistence Storage
DATA_DIR = os.path.join(BASE_DIR, "data")
CHROMA_DB_DIR = os.path.join(DATA_DIR, "chroma")
SYNC_MANIFEST_PATH = os.path.join(DATA_DIR, "sync_manifest.json")
COLLECTION_NAME = "replicate_portfolio_knowledge_base"

# Ensure data directories exist
os.makedirs(CHROMA_DB_DIR, exist_ok=True)
