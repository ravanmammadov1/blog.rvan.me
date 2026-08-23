import sys
from indexer import RAGIndexer

def main():
    print("=" * 60)
    print("REPLICATE PORTFOLIO - LOCAL RAG INCREMENTAL INDEXER")
    print("=" * 60)
    indexer = RAGIndexer()
    res = indexer.sync()
    print("\nSummary:")
    print(f"  - Total Documents/Chunks: {res['total']}")
    print(f"  - New Embeddings Added: {res['new']}")
    print(f"  - Modified Re-embedded: {res['modified']}")
    print(f"  - Unchanged (Skipped): {res['unchanged']}")
    print(f"  - Deleted Removed: {res['deleted']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
