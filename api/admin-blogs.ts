import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function parseMarkdownToBlocks(markdown: string) {
  if (!markdown || typeof markdown !== "string") return [];
  const lines = markdown.split(/\r?\n/);
  const blocks: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) continue;

    if (trimmed.startsWith("### ")) {
      blocks.push({
        _key: `h3-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "h3",
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed.replace(/^###\s+/, "") }],
        markDefs: [],
      });
    } else if (trimmed.startsWith("## ")) {
      blocks.push({
        _key: `h2-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "h2",
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed.replace(/^##\s+/, "") }],
        markDefs: [],
      });
    } else if (trimmed.startsWith("# ")) {
      blocks.push({
        _key: `h1-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "h1",
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed.replace(/^#\s+/, "") }],
        markDefs: [],
      });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({
        _key: `quote-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "blockquote",
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed.replace(/^>\s+/, "") }],
        markDefs: [],
      });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({
        _key: `li-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed.replace(/^[-*]\s+/, "") }],
        markDefs: [],
      });
    } else {
      blocks.push({
        _key: `p-${i}-${Math.random().toString(36).substring(7)}`,
        _type: "block",
        style: "normal",
        children: [{ _key: `span-${i}`, _type: "span", text: trimmed }],
        markDefs: [],
      });
    }
  }

  return blocks;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow OPTIONS preflight for CORS
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const writeToken = process.env.SANITY_API_WRITE_TOKEN;

  if (!writeToken) {
    console.warn("[AdminBlogs] SANITY_API_WRITE_TOKEN environment variable is missing on server.");
  }

  const sanityClient = createClient({
    projectId: process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "0lqwkcmg",
    dataset: process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || "production",
    token: writeToken,
    apiVersion: "2025-01-01",
    useCdn: false,
  });

  // GET: Fetch all blog articles with full fields
  if (req.method === "GET") {
    try {
      const blogs = await sanityClient.fetch(`
        *[_type == "blog"] | order(publishDate desc, _createdAt desc){
          _id,
          title,
          title_az,
          slug,
          slug_az,
          excerpt,
          excerpt_az,
          category,
          category_az,
          tags,
          readTime,
          publishDate,
          featured,
          status,
          authorName,
          authorRole,
          authorBio,
          coverImage{
            asset->{
              _id,
              url
            }
          }
        }
      `);
      return res.status(200).json({ blogs: blogs || [] });
    } catch (err: any) {
      console.error("[AdminBlogs] Fetch error:", err);
      return res.status(500).json({ error: err?.message || "Failed to fetch blogs." });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const {
    action,
    blogId,
    title,
    title_az,
    slug: customSlug,
    slug_az: customSlugAz,
    category,
    tags,
    excerpt,
    excerpt_az,
    content,
    content_az,
    coverImageBase64,
    coverImageName,
    existingCoverAssetRef,
    authorName,
    authorRole,
    authorBio,
    readTime,
    featured,
    publishDate,
  } = req.body || {};

  try {
    if (action === "create" || action === "update") {
      const trimmedTitle = typeof title === "string" ? title.trim() : "";
      if (!trimmedTitle || trimmedTitle.length < 3) {
        return res.status(400).json({ error: "Please provide an article title (at least 3 characters)." });
      }

      const generatedSlug = customSlug ? slugify(customSlug) : slugify(trimmedTitle);
      const generatedSlugAz = customSlugAz ? slugify(customSlugAz) : title_az ? slugify(title_az) : generatedSlug;
      const targetDocId = blogId || `blog-${generatedSlug}`;

      // Handle Cover Image Upload
      let coverAssetId: string | null = existingCoverAssetRef || null;
      if (coverImageBase64 && typeof coverImageBase64 === "string" && coverImageBase64.includes("base64,")) {
        const cleanBase64 = coverImageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(cleanBase64, "base64");
        const uploadResult = await sanityClient.assets.upload("image", imageBuffer, {
          filename: coverImageName || `${generatedSlug}-cover.jpg`,
        });
        coverAssetId = uploadResult._id;
      }

      const enBlocks = parseMarkdownToBlocks(content || excerpt || trimmedTitle);
      const azBlocks = content_az ? parseMarkdownToBlocks(content_az) : enBlocks;

      const wordsCount = (content || "").split(/\s+/).filter(Boolean).length;
      const calculatedReadTime = readTime || `${Math.max(1, Math.ceil(wordsCount / 200))} min read`;

      const tagsArray = Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

      const docPayload: any = {
        _id: targetDocId,
        _type: "blog",
        title: trimmedTitle,
        title_az: (typeof title_az === "string" && title_az.trim()) || trimmedTitle,
        slug: { _type: "slug", current: generatedSlug },
        slug_az: { _type: "slug", current: generatedSlugAz },
        category: category || "Design",
        tags: tagsArray,
        excerpt: (typeof excerpt === "string" && excerpt.trim()) || "",
        excerpt_az: (typeof excerpt_az === "string" && excerpt_az.trim()) || excerpt || "",
        body: enBlocks,
        body_az: azBlocks,
        publishDate: publishDate || new Date().toISOString(),
        readTime: calculatedReadTime,
        status: "published",
        featured: Boolean(featured),
        authorName: authorName || "Ravan Mammadov",
        authorRole: authorRole || "Founder & Creative Director",
        authorSlug: "ravan-mammadov",
        authorBio: authorBio || "Visual systems, brand architecture, and behavioral design strategy.",
      };

      if (coverAssetId) {
        docPayload.coverImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: coverAssetId,
          },
        };
      }

      const publishedDoc = await sanityClient.createOrReplace(docPayload);

      return res.status(200).json({
        success: true,
        message: `Article "${trimmedTitle}" published live to Sanity CMS!`,
        blogId: publishedDoc._id,
        slug: generatedSlug,
      });

    } else if (action === "delete") {
      if (!blogId) {
        return res.status(400).json({ error: "Missing blogId for deletion." });
      }
      await sanityClient.delete(blogId);
      return res.status(200).json({ success: true, message: `Article deleted successfully.` });

    } else {
      return res.status(400).json({ error: "Invalid action type." });
    }
  } catch (err: any) {
    console.error("[AdminBlogs] Operation error:", err);
    return res.status(500).json({
      error: `Failed to process blog publication: ${err.message || "Unknown error"}`,
    });
  }
}
