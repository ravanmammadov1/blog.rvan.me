import re

class DocumentChunk:
    def __init__(self, chunk_id, doc_id, doc_type, title, source_file, content, metadata=None):
        self.chunk_id = chunk_id
        self.doc_id = doc_id
        self.doc_type = doc_type
        self.title = title
        self.source_file = source_file
        self.content = content
        self.metadata = metadata or {}

def chunk_document(doc):
    """
    Chunks normalized documents:
    - Documentation and Blog Articles are split by H1/H2/H3 headings.
    - If no headings exist or content is very short (< 300 chars), returns 1 chunk.
    - Small structured records (tools, resources, fonts, projects) remain 1 chunk per document.
    """
    if doc.type not in ["documentation", "article"]:
        return [
            DocumentChunk(
                chunk_id=f"{doc.id}:chunk_0",
                doc_id=doc.id,
                doc_type=doc.type,
                title=doc.title,
                source_file=doc.source_file,
                content=doc.content,
                metadata={
                    "doc_id": doc.id,
                    "slug": doc.slug,
                    "category": doc.category,
                    "tags": doc.tags,
                    "language": doc.language,
                    "hash": doc.hash,
                    "heading": "Overview",
                    "chunk_index": 0,
                    **doc.metadata
                }
            )
        ]

    # Check if headings exist in content
    sections = re.split(r'\n(?=#{1,3}\s+)', doc.content)
    
    # If no heading splits found or only 1 section
    if len(sections) <= 1:
        return [
            DocumentChunk(
                chunk_id=f"{doc.id}:chunk_0",
                doc_id=doc.id,
                doc_type=doc.type,
                title=doc.title,
                source_file=doc.source_file,
                content=doc.content,
                metadata={
                    "doc_id": doc.id,
                    "slug": doc.slug,
                    "category": doc.category,
                    "tags": doc.tags,
                    "language": doc.language,
                    "hash": doc.hash,
                    "heading": "Overview",
                    "chunk_index": 0,
                    **doc.metadata
                }
            )
        ]

    # Heading-based chunking for articles & markdown docs
    chunks = []
    for idx, sec in enumerate(sections):
        sec_text = sec.strip()
        if not sec_text:
            continue
        
        # Extract heading title if present
        heading_match = re.match(r'^#{1,3}\s+(.+)$', sec_text.splitlines()[0])
        heading = heading_match.group(1).strip() if heading_match else (f"Section {idx+1}" if idx > 0 else "Overview")
        
        chunk_title = f"{doc.title} - {heading}" if heading != "Overview" else doc.title
        chunks.append(
            DocumentChunk(
                chunk_id=f"{doc.id}:chunk_{idx}",
                doc_id=doc.id,
                doc_type=doc.type,
                title=chunk_title,
                source_file=doc.source_file,
                content=sec_text,
                metadata={
                    "doc_id": doc.id,
                    "slug": doc.slug,
                    "category": doc.category,
                    "tags": doc.tags,
                    "language": doc.language,
                    "hash": doc.hash,
                    "heading": heading,
                    "chunk_index": idx,
                    **doc.metadata
                }
            )
        )
    return chunks

def chunk_all_documents(docs):
    all_chunks = []
    for d in docs:
        all_chunks.extend(chunk_document(d))
    return all_chunks
