import os
import json
import re
import hashlib
from config import REPO_DIR

class NormalizedDocument:
    def __init__(self, doc_id, doc_type, title, slug, category, tags, language, source_file, content, metadata=None):
        self.id = doc_id
        self.type = doc_type
        self.title = title
        self.slug = slug or ""
        self.category = category or "general"
        self.tags = tags or []
        self.language = language or "en"
        self.source_file = source_file
        self.content = content
        self.metadata = metadata or {}
        self.hash = self.compute_hash()

    def compute_hash(self):
        payload = f"{self.id}|{self.type}|{self.title}|{self.content}|{','.join(sorted(self.tags))}|{self.category}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "title": self.title,
            "slug": self.slug,
            "category": self.category,
            "tags": json.dumps(self.tags),
            "language": self.language,
            "source_file": self.source_file,
            "content": self.content,
            "hash": self.hash,
            "metadata": json.dumps(self.metadata),
        }

def portable_text_to_markdown(body_blocks):
    if not isinstance(body_blocks, list):
        return str(body_blocks) if body_blocks else ""
    
    text_parts = []
    for block in body_blocks:
        if not isinstance(block, dict):
            continue
        b_type = block.get("_type")
        style = block.get("style", "normal")
        children = block.get("children", [])
        
        block_text = "".join([child.get("text", "") for child in children if isinstance(child, dict)])
        if not block_text.strip():
            continue

        if style in ["h1", "h2", "h3", "h4"]:
            prefix = "#" * int(style[1]) if style[1].isdigit() else "##"
            text_parts.append(f"\n{prefix} {block_text}\n")
        else:
            text_parts.append(block_text)
            
    return "\n\n".join(text_parts)

def extract_blog_articles():
    export_path = os.path.join(REPO_DIR, "sanity_to_wp_export.json")
    if not os.path.exists(export_path):
        return []
    with open(export_path, encoding="utf-8") as f:
        data = json.load(f)

    blogs = data.get("blogs", []) if isinstance(data, dict) else []
    documents = []

    for b in blogs:
        title = b.get("title", "Untitled Article")
        slug_raw = b.get("slug")
        slug = slug_raw.get("current") if isinstance(slug_raw, dict) else (slug_raw or title.lower().replace(" ", "-"))
        category = b.get("category", "General")
        tags = b.get("tags", [])
        if not isinstance(tags, list):
            tags = [str(tags)]
        excerpt = b.get("excerpt", "")
        publish_date = b.get("publishDate", "")
        read_time = b.get("readTime", "")
        cover_image = b.get("coverImage")
        
        body_text = portable_text_to_markdown(b.get("body", []))
        
        content = (
            f"Article Title: {title}\n"
            f"Category: {category}\n"
            f"Tags: {', '.join(tags)}\n"
            f"Publish Date: {publish_date}\n"
            f"Read Time: {read_time}\n"
            f"Excerpt: {excerpt}\n\n"
            f"Article Content:\n{body_text}"
        )

        doc = NormalizedDocument(
            doc_id=f"article:{slug}",
            doc_type="article",
            title=title,
            slug=slug,
            category=category,
            tags=tags,
            language="en",
            source_file="sanity_to_wp_export.json",
            content=content,
            metadata={
                "publishDate": publish_date,
                "readTime": read_time,
                "coverImage": str(cover_image) if cover_image else "",
                "url_path": f"/blog/{slug}"
            }
        )
        documents.append(doc)
    return documents

def extract_interactive_tools():
    tools_path = os.path.join(REPO_DIR, "src", "app", "lib", "toolsRegistry.ts")
    if not os.path.exists(tools_path):
        return []
    with open(tools_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    pattern = re.compile(
        r'id:\s*["\']([^"\']+)["\'],\s*name:\s*["\']([^"\']+)["\'],\s*category:\s*["\']([^"\']+)["\'],\s*description:\s*["\']([^"\']+)["\'],\s*icon:\s*["\']([^"\']+)["\'],\s*path:\s*["\']([^"\']+)["\'],\s*seoTitle:\s*["\']([^"\']+)["\'],\s*seoDescription:\s*["\']([^"\']+)["\'],\s*tags:\s*\[(.*?)\]',
        re.DOTALL
    )
    for m in pattern.finditer(txt):
        tool_id, name, category, desc, icon, path, seo_title, seo_desc, tags_raw = m.groups()
        tags = [t.strip().replace('"', '').replace("'", "") for t in tags_raw.split(",") if t.strip()]
        content = f"Interactive Developer Tool: {name}\nCategory: {category}\nDescription: {desc}\nSEO Title: {seo_title}\nSEO Description: {seo_desc}\nURL Path: {path}\nTags: {', '.join(tags)}"
        doc = NormalizedDocument(
            doc_id=f"tool:{tool_id}",
            doc_type="interactive_tool",
            title=name,
            slug=tool_id,
            category=category,
            tags=tags,
            language="en",
            source_file="src/app/lib/toolsRegistry.ts",
            content=content,
            metadata={"icon": icon, "url_path": path, "seo_title": seo_title}
        )
        documents.append(doc)
    return documents

def extract_portfolio_projects():
    projects_path = os.path.join(REPO_DIR, "src", "lib", "portfolioFallback.ts")
    if not os.path.exists(projects_path):
        return []
    with open(projects_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    blocks = re.findall(
        r'title:\s*["\']([^"\']+)["\'],\s*slug:\s*["\']([^"\']+)["\'],\s*type:\s*["\']([^"\']+)["\'],\s*description:\s*["\']([^"\']+)["\']',
        txt
    )
    for title, slug, proj_type, desc in blocks:
        content = f"Portfolio Project: {title}\nType: {proj_type}\nDescription: {desc}"
        doc = NormalizedDocument(
            doc_id=f"project:{slug}",
            doc_type="portfolio_project",
            title=title,
            slug=slug,
            category=proj_type,
            tags=[t.strip() for t in proj_type.split("•") if t.strip()],
            language="en",
            source_file="src/lib/portfolioFallback.ts",
            content=content,
            metadata={"slug": slug}
        )
        documents.append(doc)
    return documents

def extract_curated_resources():
    resource_path = os.path.join(REPO_DIR, "src", "lib", "resourceEngine.ts")
    if not os.path.exists(resource_path):
        return []
    with open(resource_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    item_ids = re.findall(r'id:\s*["\']([^"\']+)["\']', txt)
    for res_id in item_ids:
        pos = txt.find(f'id: "{res_id}"')
        if pos == -1: pos = txt.find(f"id: '{res_id}'")
        if pos == -1: continue
        snippet = txt[pos:pos+700]

        t_match = re.search(r'title:\s*["\']([^"\']+)["\']', snippet)
        s_match = re.search(r'slug:\s*["\']([^"\']+)["\']', snippet)
        c_match = re.search(r'category:\s*["\']([^"\']+)["\']', snippet)
        d_match = re.search(r'description:\s*["\']([^"\']+)["\']', snippet)
        tg_match = re.search(r'tags:\s*\[(.*?)\]', snippet, re.DOTALL)

        title = t_match.group(1) if t_match else res_id
        slug = s_match.group(1) if s_match else res_id
        category = c_match.group(1) if c_match else "resource"
        desc = d_match.group(1) if d_match else ""
        tags = [t.strip().replace('"', '').replace("'", "") for t in tg_match.group(1).split(",") if t.strip()] if tg_match else []

        content = f"Curated Resource: {title}\nCategory: {category}\nDescription: {desc}\nTags: {', '.join(tags)}"
        doc = NormalizedDocument(
            doc_id=f"resource:{res_id}",
            doc_type="curated_resource",
            title=title,
            slug=slug,
            category=category,
            tags=tags,
            language="en",
            source_file="src/lib/resourceEngine.ts",
            content=content,
            metadata={"resource_id": res_id}
        )
        documents.append(doc)
    return documents

def extract_google_fonts():
    gfont_path = os.path.join(REPO_DIR, "src", "lib", "googleFontsCatalog.json")
    if not os.path.exists(gfont_path):
        return []
    with open(gfont_path, encoding="utf-8") as f:
        data = json.load(f)

    items = data.get("items", []) if isinstance(data, dict) else data
    documents = []
    
    for item in items:
        font_id = item.get("id") or item.get("name", "").lower().replace(" ", "-")
        name = item.get("name", "")
        family = item.get("family", "")
        category = item.get("category", "sans-serif")
        designer = item.get("designer", "Unknown")
        foundry = item.get("foundry", "Google Fonts")
        desc = item.get("description", "")
        use_cases = item.get("useCases", [])
        license_type = item.get("license", "OFL")

        content = f"Font Name: {name}\nFamily: {family}\nCategory: {category}\nDesigner: {designer} ({foundry})\nDescription: {desc}\nUse Cases: {', '.join(use_cases)}\nLicense: {license_type}"

        doc = NormalizedDocument(
            doc_id=f"font:{font_id}",
            doc_type="google_font",
            title=f"Google Font: {name}",
            slug=font_id,
            category=category,
            tags=use_cases + [category, foundry],
            language="en",
            source_file="src/lib/googleFontsCatalog.json",
            content=content,
            metadata={"designer": designer, "foundry": foundry, "license": license_type}
        )
        documents.append(doc)
    return documents

def extract_illustrations():
    ill_path = os.path.join(REPO_DIR, "src", "lib", "illustrationEngine.ts")
    if not os.path.exists(ill_path):
        return []
    with open(ill_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    item_ids = re.findall(r'id:\s*["\']([^"\']+)["\']', txt)
    for ill_id in item_ids:
        pos = txt.find(f'id: "{ill_id}"')
        if pos == -1: pos = txt.find(f"id: '{ill_id}'")
        if pos == -1: continue
        snippet = txt[pos:pos+700]

        t_match = re.search(r'title:\s*["\']([^"\']+)["\']', snippet)
        s_match = re.search(r'slug:\s*["\']([^"\']+)["\']', snippet)
        c_match = re.search(r'category:\s*["\']([^"\']+)["\']', snippet)
        d_match = re.search(r'description:\s*["\']([^"\']+)["\']', snippet)
        tg_match = re.search(r'tags:\s*\[(.*?)\]', snippet, re.DOTALL)

        title = t_match.group(1) if t_match else ill_id
        slug = s_match.group(1) if s_match else ill_id
        category = c_match.group(1) if c_match else "illustration"
        desc = d_match.group(1) if d_match else ""
        tags = [t.strip().replace('"', '').replace("'", "") for t in tg_match.group(1).split(",") if t.strip()] if tg_match else []

        content = f"Vector Illustration: {title}\nCategory: {category}\nDescription: {desc}\nTags: {', '.join(tags)}"
        doc = NormalizedDocument(
            doc_id=f"illustration:{ill_id}",
            doc_type="vector_illustration",
            title=title,
            slug=slug,
            category=category,
            tags=tags,
            language="en",
            source_file="src/lib/illustrationEngine.ts",
            content=content,
            metadata={"illustration_id": ill_id}
        )
        documents.append(doc)
    return documents

def extract_seed_comments():
    seed_path = os.path.join(REPO_DIR, "src", "lib", "seedCommentsRegistry.ts")
    if not os.path.exists(seed_path):
        return []
    with open(seed_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    item_ids = re.findall(r'id:\s*["\']([^"\']+)["\']', txt)
    for c_id in item_ids:
        pos = txt.find(f'id: "{c_id}"')
        if pos == -1: pos = txt.find(f"id: '{c_id}'")
        if pos == -1: continue
        snippet = txt[pos:pos+600]

        a_match = re.search(r'authorName:\s*["\']([^"\']+)["\']', snippet)
        r_match = re.search(r'authorRole:\s*["\']([^"\']+)["\']', snippet)
        t_match = re.search(r'commentText:\s*["\']([^"\']+)["\']', snippet)

        author = a_match.group(1) if a_match else "Anonymous"
        role = r_match.group(1) if r_match else "Reader"
        text = t_match.group(1) if t_match else ""

        content = f"Blog Discussion Comment by {author} ({role}):\n\"{text}\""
        doc = NormalizedDocument(
            doc_id=f"comment:{c_id}",
            doc_type="seed_comment",
            title=f"Comment by {author} on Blog Post",
            slug=c_id,
            category="discussion",
            tags=["comment", "community", role],
            language="en",
            source_file="src/lib/seedCommentsRegistry.ts",
            content=content,
            metadata={"author": author, "role": role}
        )
        documents.append(doc)
    return documents

def extract_i18n_translations():
    tr_path = os.path.join(REPO_DIR, "src", "lib", "i18n", "translations.ts")
    if not os.path.exists(tr_path):
        return []
    with open(tr_path, encoding="utf-8") as f:
        txt = f.read()

    documents = []
    pattern = re.compile(r'([a-zA-Z0-9_]+):\s*["\']([^"\']+)["\']')
    matches = pattern.findall(txt)
    
    content_chunks = []
    for key, val in matches:
        if len(val) > 10:
            content_chunks.append(f"{key}: {val}")

    if content_chunks:
        full_text = "\n".join(content_chunks[:100])
        doc = NormalizedDocument(
            doc_id="i18n:bilingual_ui_copy",
            doc_type="translation_copy",
            title="Website Bilingual UI Copy (EN & AZ)",
            slug="i18n-translations",
            category="i18n",
            tags=["i18n", "english", "azerbaijani", "ui-copy"],
            language="en/az",
            source_file="src/lib/i18n/translations.ts",
            content=f"Website Copy & Key Section Descriptions (Bilingual EN/AZ):\n{full_text}",
            metadata={"total_keys": len(matches)}
        )
        documents.append(doc)
    return documents

def extract_markdown_docs():
    documents = []
    target_md_files = [
        "README.md",
        "ATTRIBUTIONS.md",
        "guidelines/DESIGN_RULES.md",
        "packages/hero-particles/README.md"
    ]

    for rel_path in target_md_files:
        full_path = os.path.join(REPO_DIR, rel_path.replace("/", os.sep))
        if os.path.exists(full_path):
            with open(full_path, encoding="utf-8") as f:
                content = f.read()
            doc_id = f"doc:{os.path.basename(rel_path).lower().replace('.', '_')}"
            title = f"Documentation: {os.path.basename(rel_path)}"
            doc = NormalizedDocument(
                doc_id=doc_id,
                doc_type="documentation",
                title=title,
                slug=os.path.basename(rel_path),
                category="docs",
                tags=["documentation", "architecture", "rules"],
                language="en",
                source_file=rel_path,
                content=content,
                metadata={"filepath": rel_path}
            )
            documents.append(doc)
    return documents

def extract_all_website_content():
    all_docs = []
    all_docs.extend(extract_blog_articles())
    all_docs.extend(extract_interactive_tools())
    all_docs.extend(extract_portfolio_projects())
    all_docs.extend(extract_curated_resources())
    all_docs.extend(extract_google_fonts())
    all_docs.extend(extract_illustrations())
    all_docs.extend(extract_seed_comments())
    all_docs.extend(extract_i18n_translations())
    all_docs.extend(extract_markdown_docs())
    return all_docs

if __name__ == "__main__":
    docs = extract_all_website_content()
    print(f"Total Normalized Documents Extracted: {len(docs)}")
    by_type = {}
    for d in docs:
        by_type[d.type] = by_type.get(d.type, 0) + 1
    print("Documents by Content Type:", json.dumps(by_type, indent=2))
