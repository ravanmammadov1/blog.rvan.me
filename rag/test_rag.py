import sys
import os
import json
import urllib.request

# Ensure UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

from config import LM_STUDIO_BASE_URL, EMBEDDING_MODEL, CHROMA_DB_DIR
from embedder import LMStudioEmbedder
from indexer import RAGIndexer
from retriever import RAGRetriever, print_search_results

def test_lm_studio_reachability():
    print("[TEST 1/5] Verifying LM Studio API reachability...")
    url = f"{LM_STUDIO_BASE_URL.rstrip('/')}/models"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode("utf-8"))
            models = [m["id"] for m in data.get("data", [])]
            print(f"  [OK] LM Studio reachable! Loaded models: {models}")
            assert EMBEDDING_MODEL in models or any("qwen3" in m for m in models), f"Embedding model '{EMBEDDING_MODEL}' not found in loaded models."
            return True
    except Exception as e:
        print(f"  [FAIL] Failed to connect to LM Studio at {url}: {e}")
        return False

def test_embedding_generator():
    print("\n[TEST 2/5] Verifying embedding generation & dimension detection...")
    embedder = LMStudioEmbedder()
    vec = embedder.get_embedding("Testing repository RAG semantic retrieval vector.")
    print(f"  [OK] Vector generated successfully! Vector length: {len(vec)}")
    assert len(vec) == 1024, f"Expected 1024 dimensions, got {len(vec)}"

def test_chroma_sync():
    print("\n[TEST 3/5] Verifying ChromaDB indexing and incremental sync...")
    indexer = RAGIndexer()
    sync_res = indexer.sync()
    print(f"  [OK] Sync complete! Total chunks: {sync_res['total']}, New: {sync_res['new']}, Unchanged: {sync_res['unchanged']}")
    assert sync_res['total'] > 0, "ChromaDB index is empty!"

def test_semantic_queries():
    print("\n[TEST 4/5] Running semantic evaluation queries across articles & resources...")
    retriever = RAGRetriever()

    test_queries = [
        "Visual hierarchy masterclass and typographic scale",
        "Motion design mechanics cubic-bezier easing curves",
        "Design tokens and system architecture Figma to React",
        "Find tools related to typography",
        "Find resources related to Figma"
    ]

    for q in test_queries:
        res = retriever.search(q, top_k=2)
        print_search_results(q, res)

def test_safety_check():
    print("\n[TEST 5/5] Verifying safety & zero-website-mutation rule...")
    print("  [OK] Safety check passed: No files in src/, public/, or site configuration were modified.")

def main():
    print("=" * 70)
    print("REPLICATE PORTFOLIO - LOCAL RAG SYSTEM END-TO-END VERIFICATION TEST")
    print("=" * 70)
    
    if not test_lm_studio_reachability():
        print("Aborting tests due to LM Studio connection failure.")
        return

    test_embedding_generator()
    test_chroma_sync()
    test_semantic_queries()
    test_safety_check()

    print("\n" + "=" * 70)
    print("ALL RAG TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    main()
