import json
import urllib.request
import urllib.error
from config import LM_STUDIO_BASE_URL, EMBEDDING_MODEL, EXPECTED_DIMENSION

class LMStudioEmbedder:
    def __init__(self, base_url=LM_STUDIO_BASE_URL, model=EMBEDDING_MODEL):
        self.endpoint = f"{base_url.rstrip('/')}/embeddings"
        self.model = model
        self.detected_dimension = None

    def get_embedding(self, text):
        embeddings = self.get_embeddings([text])
        return embeddings[0] if embeddings else []

    def get_embeddings(self, texts, batch_size=32):
        if not texts:
            return []

        all_embeddings = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]
            payload = {
                "model": self.model,
                "input": batch
            }
            data_bytes = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(
                self.endpoint,
                data=data_bytes,
                headers={"Content-Type": "application/json"}
            )
            
            try:
                with urllib.request.urlopen(req) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    batch_embeds = [item["embedding"] for item in res_data.get("data", [])]
                    
                    if batch_embeds and self.detected_dimension is None:
                        self.detected_dimension = len(batch_embeds[0])
                        print(f"[LMStudioEmbedder] Auto-detected embedding dimension: {self.detected_dimension}")
                        
                    all_embeddings.extend(batch_embeds)
            except urllib.error.URLError as e:
                raise RuntimeError(
                    f"Failed to connect to LM Studio embedding endpoint at {self.endpoint}. "
                    f"Please ensure LM Studio server is running on port 1234 and model '{self.model}' is loaded. Error: {e}"
                )
        return all_embeddings

if __name__ == "__main__":
    embedder = LMStudioEmbedder()
    vec = embedder.get_embedding("Testing local LM Studio embedding engine.")
    print(f"Embedding success! Dimension: {len(vec)}")
