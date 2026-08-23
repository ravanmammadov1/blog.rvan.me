import sys
import os
import json
import urllib.request
import urllib.error

# Ensure UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding="utf-8")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import chromadb
from config import CHROMA_DB_DIR, COLLECTION_NAME, LM_STUDIO_BASE_URL

LLM_MODEL = "qwen/qwen2.5-coder-14b"
CHAT_ENDPOINT = f"{LM_STUDIO_BASE_URL.rstrip('/')}/chat/completions"

def retrieve_full_article_by_slug(article_slug_query):
    """
    Directly retrieves ALL chunks belonging to a specific article by its slug/doc_id,
    and reconstructs the complete, ordered article content.
    """
    client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
    collection = client.get_collection(COLLECTION_NAME)

    clean_slug = article_slug_query.strip().lower().replace(" ", "-")
    target_doc_id = f"article:{clean_slug}" if not clean_slug.startswith("article:") else clean_slug

    # 1. Query ChromaDB specifically for all chunks of this article
    results = collection.get(
        where={"doc_id": target_doc_id},
        include=["documents", "metadatas"]
    )

    # 2. Fallback matching if exact doc_id has minor variation
    if not results or not results.get("ids"):
        all_articles = collection.get(
            where={"doc_type": "article"},
            include=["documents", "metadatas"]
        )

        matched_ids = []
        matched_docs = []
        matched_metas = []

        for idx, meta in enumerate(all_articles.get("metadatas", [])):
            slug = str(meta.get("slug", "")).lower()
            doc_id = str(meta.get("doc_id", "")).lower()
            if clean_slug in slug or clean_slug in doc_id:
                matched_ids.append(all_articles["ids"][idx])
                matched_docs.append(all_articles["documents"][idx])
                matched_metas.append(meta)

        results = {
            "ids": matched_ids,
            "documents": matched_docs,
            "metadatas": matched_metas
        }

    ids = results.get("ids", [])
    docs = results.get("documents", [])
    metas = results.get("metadatas", [])

    if not ids:
        return [], "", "", ""

    # Sort chunks deterministically by chunk_index / chunk_id suffix
    def get_chunk_order(cid):
        if ":chunk_" in cid:
            try:
                return int(cid.split(":chunk_")[-1])
            except ValueError:
                return 0
        return 0

    sorted_chunks = sorted(zip(ids, docs, metas), key=lambda x: get_chunk_order(x[0]))
    
    # Extract article metadata from first chunk
    article_title = sorted_chunks[0][2].get("title", clean_slug)
    if " - " in article_title:
        article_title = article_title.split(" - ")[0]

    article_slug = sorted_chunks[0][2].get("slug", clean_slug)

    # Reconstruct full ordered article text
    reconstructed_blocks = []
    for cid, cdoc, cmeta in sorted_chunks:
        heading = cmeta.get("heading", "Overview")
        reconstructed_blocks.append(cdoc)

    full_article_context = "\n\n".join(reconstructed_blocks)

    return sorted_chunks, article_title, article_slug, full_article_context

def analyze_article_with_qwen(article_title, article_slug, article_context):
    """
    Sends the complete reconstructed article context to Qwen2.5-Coder-14B via LM Studio
    and prompts for visual generation analysis in structured JSON.
    """
    system_prompt = (
        "You are an expert AI design director and visual strategist analyzing website articles for visual generation opportunities.\n"
        "Analyze the complete provided article context and return ONLY a valid JSON object matching the exact schema below.\n\n"
        "STRICT JSON SCHEMA:\n"
        "{\n"
        '  "article_title": "string",\n'
        '  "article_slug": "string",\n'
        '  "article_summary": "string",\n'
        '  "cover": {\n'
        '    "needed": boolean,\n'
        '    "concept": "string",\n'
        '    "flux_prompt": "string"\n'
        "  },\n"
        '  "inline_visuals": [\n'
        "    {\n"
        '      "location": "string (e.g. after section/heading name)",\n'
        '      "purpose": "string",\n'
        '      "visual_type": "diagram | illustration | infographic | image",\n'
        '      "flux_prompt": "string"\n'
        "    }\n"
        "  ]\n"
        "}\n\n"
        "CRITICAL RULES:\n"
        "1. Do NOT invent sections or facts that are not present in the article context.\n"
        "2. The cover visual concept must accurately represent the article's core topic.\n"
        "3. Inline visuals should ONLY be suggested when they genuinely improve human understanding (diagrams, infographics, structural comparisons).\n"
        "4. Do NOT suggest redundant or purely decorative images.\n"
        "5. Flux prompts must be detailed, vivid, highly evocative, technical, and written in English.\n"
        "6. Output ONLY raw JSON code block without conversational intro/outro text."
    )

    user_prompt = (
        f"COMPLETE RECONSTRUCTED ARTICLE CONTEXT:\n"
        f"Article Title: {article_title}\n"
        f"Article Slug: {article_slug}\n\n"
        f"--------------------------------------------------\n"
        f"{article_context}\n"
        f"--------------------------------------------------\n\n"
        "Produce the visual strategy analysis JSON now."
    )

    payload = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2
    }

    data_bytes = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        CHAT_ENDPOINT,
        data=data_bytes,
        headers={"Content-Type": "application/json"}
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            raw_reply = res_data["choices"][0]["message"]["content"]
            
            cleaned_reply = raw_reply.strip()
            if cleaned_reply.startswith("```json"):
                cleaned_reply = cleaned_reply[7:]
            if cleaned_reply.startswith("```"):
                cleaned_reply = cleaned_reply[3:]
            if cleaned_reply.endswith("```"):
                cleaned_reply = cleaned_reply[:-3]
            cleaned_reply = cleaned_reply.strip()

            parsed_json = json.loads(cleaned_reply)
            return parsed_json, None
    except urllib.error.URLError as e:
        return None, f"Failed to connect to LM Studio LLM endpoint at {CHAT_ENDPOINT}: {e}"
    except json.JSONDecodeError as e:
        return None, f"Failed to parse JSON response from Qwen LLM. Error: {e}. Raw reply: {raw_reply[:300]}"
    except Exception as e:
        return None, f"Unexpected error during LLM generation: {e}"

def main():
    target_slug = sys.argv[1] if len(sys.argv) > 1 else "visual-hierarchy-masterclass"
    
    print("=" * 75)
    print("REPLICATE PORTFOLIO - FULL ARTICLE RECONSTRUCTION & QWEN2.5-CODER-14B RAG TEST")
    print("=" * 75)
    print(f"Target Article Slug Query: \"{target_slug}\"")

    # Step 1-4: Retrieve all chunks for this specific article and reconstruct full text
    chunks, article_title, article_slug, full_article_context = retrieve_full_article_by_slug(target_slug)

    total_chunks = len(chunks)
    print(f"\nTotal Chunks Stored for Article: {total_chunks}")
    print(f"Article Title: {article_title}")
    print(f"Article Slug: {article_slug}")

    if total_chunks == 0:
        print("\nError: No chunks found in ChromaDB for slug query!")
        print("=" * 75)
        return

    # Print chunk details
    print("\n--------------------------------------------------")
    print("CHUNK BREAKDOWN & ORDERING:")
    print("--------------------------------------------------")
    for idx, (cid, cdoc, cmeta) in enumerate(chunks):
        heading = cmeta.get("heading", "Overview")
        char_count = len(cdoc)
        approx_tokens = round(char_count / 4)
        print(f"Chunk #{idx} | ID: {cid} | Heading: '{heading}' | Length: {char_count} chars (~{approx_tokens} tokens)")

    total_chars = len(full_article_context)
    total_tokens = round(total_chars / 4)
    print(f"\nTotal Reconstructed Context Size: {total_chars} chars (~{total_tokens} tokens)")
    print("--------------------------------------------------")

    # Step 6-8: Send complete reconstructed context to Qwen2.5-Coder-14B
    print("\nSending FULL reconstructed article context to Qwen2.5-Coder-14B...")
    analysis_json, error = analyze_article_with_qwen(article_title, article_slug, full_article_context)

    print("\n--------------------------------------------------")
    print("GENERATED JSON ANALYSIS:")
    print("--------------------------------------------------")
    if analysis_json:
        print(json.dumps(analysis_json, indent=2, ensure_ascii=False))

    print(f"\nErrors: {error if error else 'None'}")
    print("=" * 75)

if __name__ == "__main__":
    main()
