import sys
import os
import json
import chromadb

# Add rag directory to python path for clean import resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.stdout.reconfigure(encoding='utf-8')

from config import CHROMA_DB_DIR, COLLECTION_NAME
from embedder import LMStudioEmbedder

class RAGRetriever:
    def __init__(self, chroma_dir=CHROMA_DB_DIR, collection_name=COLLECTION_NAME):
        self.chroma_dir = chroma_dir
        self.collection_name = collection_name
        self.client = chromadb.PersistentClient(path=self.chroma_dir)
        self.collection = self.client.get_collection(name=self.collection_name)
        self.embedder = LMStudioEmbedder()

    def search(self, query_text, top_k=5, doc_type_filter=None):
        """
        Executes semantic search over local repository Knowledge Base.
        """
        query_vector = self.embedder.get_embedding(query_text)
        if not query_vector:
            return []

        where_clause = None
        if doc_type_filter:
            where_clause = {"doc_type": doc_type_filter}

        results = self.collection.query(
            query_embeddings=[query_vector],
            n_results=top_k,
            where=where_clause,
            include=["documents", "metadatas", "distances"]
        )

        formatted_results = []
        if results and results.get("ids") and results["ids"][0]:
            ids = results["ids"][0]
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            distances = results["distances"][0]

            for i in range(len(ids)):
                sim_score = round(1.0 - distances[i], 4)
                formatted_results.append({
                    "id": ids[i],
                    "score": sim_score,
                    "title": metas[i].get("title"),
                    "type": metas[i].get("doc_type"),
                    "source_file": metas[i].get("source_file"),
                    "category": metas[i].get("category"),
                    "heading": metas[i].get("heading"),
                    "content": docs[i],
                    "metadata": metas[i]
                })

        return formatted_results

def print_search_results(query, results):
    print(f"\n==================================================")
    print(f"SEMANTIC QUERY: \"{query}\"")
    print(f"==================================================")
    if not results:
        print("No matching documents found.")
        return

    for idx, item in enumerate(results, 1):
        print(f"\n--- Result #{idx} (Score: {item['score']}) ---")
        print(f"Title: {item['title']}")
        print(f"Type: {item['type']} | Category: {item['category']}")
        print(f"Source File: {item['source_file']}")
        print(f"Content Snippet:\n{item['content'][:300]}...")

if __name__ == "__main__":
    retriever = RAGRetriever()
    query = sys.argv[1] if len(sys.argv) > 1 else "typography and fonts"
    res = retriever.search(query, top_k=3)
    print_search_results(query, res)
