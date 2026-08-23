import os
import json
import chromadb
from config import CHROMA_DB_DIR, COLLECTION_NAME, SYNC_MANIFEST_PATH
from embedder import LMStudioEmbedder
from extractor import extract_all_website_content
from chunker import chunk_all_documents

class RAGIndexer:
    def __init__(self, chroma_dir=CHROMA_DB_DIR, collection_name=COLLECTION_NAME):
        self.chroma_dir = chroma_dir
        self.collection_name = collection_name
        self.client = chromadb.PersistentClient(path=self.chroma_dir)
        self.collection = self.client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"}
        )
        self.embedder = LMStudioEmbedder()
        self.manifest = self._load_manifest()

    def _load_manifest(self):
        if os.path.exists(SYNC_MANIFEST_PATH):
            try:
                with open(SYNC_MANIFEST_PATH, encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _save_manifest(self):
        with open(SYNC_MANIFEST_PATH, "w", encoding="utf-8") as f:
            json.dump(self.manifest, f, indent=2)

    def sync(self):
        """
        Incremental synchronization logic:
        1. Extract & chunk repository documents.
        2. Detect NEW, MODIFIED, UNCHANGED, and DELETED chunks.
        3. Only embed NEW and MODIFIED chunks.
        4. Remove DELETED & MODIFIED old vectors from ChromaDB.
        """
        print("[RAGIndexer] Starting content extraction...")
        docs = extract_all_website_content()
        chunks = chunk_all_documents(docs)
        
        current_chunk_map = {c.chunk_id: c for c in chunks}
        current_ids = set(current_chunk_map.keys())
        manifest_ids = set(self.manifest.keys())

        # Categorize
        new_ids = []
        modified_ids = []
        unchanged_ids = []
        deleted_ids = list(manifest_ids - current_ids)

        for chunk_id, chunk in current_chunk_map.items():
            if chunk_id not in self.manifest:
                new_ids.append(chunk_id)
            else:
                old_hash = self.manifest[chunk_id].get("hash")
                new_hash = chunk.metadata.get("hash")
                if old_hash != new_hash:
                    modified_ids.append(chunk_id)
                else:
                    unchanged_ids.append(chunk_id)

        print(f"[RAGIndexer] Sync Analysis:")
        print(f"  - Total Current Chunks: {len(chunks)}")
        print(f"  - New: {len(new_ids)}")
        print(f"  - Modified: {len(modified_ids)}")
        print(f"  - Unchanged: {len(unchanged_ids)}")
        print(f"  - Deleted: {len(deleted_ids)}")

        # 1. Process Deleted
        if deleted_ids:
            print(f"[RAGIndexer] Removing {len(deleted_ids)} deleted chunks from ChromaDB...")
            self.collection.delete(ids=deleted_ids)
            for d_id in deleted_ids:
                del self.manifest[d_id]

        # 2. Process Modified (Remove old vectors)
        if modified_ids:
            print(f"[RAGIndexer] Removing {len(modified_ids)} outdated modified chunks from ChromaDB...")
            self.collection.delete(ids=modified_ids)

        # 3. Embed & Insert New + Modified
        to_process_ids = new_ids + modified_ids
        if to_process_ids:
            print(f"[RAGIndexer] Embedding and indexing {len(to_process_ids)} chunks via LM Studio...")
            to_process_chunks = [current_chunk_map[cid] for cid in to_process_ids]
            
            # Batch embedding
            texts = [c.content for c in to_process_chunks]
            embeddings = self.embedder.get_embeddings(texts)

            # Format for ChromaDB
            ids = [c.chunk_id for c in to_process_chunks]
            metadatas = []
            documents = []

            for c in to_process_chunks:
                documents.append(c.content)
                meta = {
                    "doc_id": c.doc_id,
                    "doc_type": c.doc_type,
                    "title": c.title,
                    "source_file": c.source_file,
                    "heading": str(c.metadata.get("heading", "")),
                    "category": str(c.metadata.get("category", "")),
                    "tags": ",".join(c.metadata.get("tags", [])),
                    "language": str(c.metadata.get("language", "en")),
                    "hash": str(c.metadata.get("hash", ""))
                }
                metadatas.append(meta)

            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                metadatas=metadatas,
                documents=documents
            )

            # Update manifest
            for c in to_process_chunks:
                self.manifest[c.chunk_id] = {
                    "doc_id": c.doc_id,
                    "doc_type": c.doc_type,
                    "title": c.title,
                    "source_file": c.source_file,
                    "hash": c.metadata.get("hash")
                }

        self._save_manifest()
        print("[RAGIndexer] Sync completed successfully!")
        return {
            "total": len(chunks),
            "new": len(new_ids),
            "modified": len(modified_ids),
            "unchanged": len(unchanged_ids),
            "deleted": len(deleted_ids)
        }

if __name__ == "__main__":
    indexer = RAGIndexer()
    indexer.sync()
