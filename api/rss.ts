import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

const DOMAIN = "https://www.rvan.me";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const blogs = await client.fetch<
      Array<{
        title: string;
        slug: { current: string };
        excerpt?: string;
        publishDate?: string;
        _updatedAt?: string;
        category?: string;
      }>
    >(`
      *[_type == "blog" && defined(slug.current)] | order(publishDate desc){
        title,
        "slug": slug,
        excerpt,
        publishDate,
        _updatedAt,
        category
      }
    `);

    const itemsXml = (blogs || [])
      .map((post) => {
        const url = `${DOMAIN}/blog/${post.slug.current}`;
        const date = post.publishDate || post._updatedAt || new Date().toISOString();
        const pubDate = new Date(date).toUTCString();
        const description = post.excerpt ? escapeXml(post.excerpt) : "";
        const title = escapeXml(post.title);
        const category = post.category ? `<category>${escapeXml(post.category)}</category>` : "";

        return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${description}</description>
      ${category}
    </item>`;
      })
      .join("\n");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ravan Mammadov — Motion Design &amp; Creative Insights</title>
    <link>${DOMAIN}/blog</link>
    <description>Articles, industry breakdowns, and technical guides on 3D motion design, brand identity systems, and performance creative by Ravan Mammadov.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(rssXml);
  } catch (error: any) {
    console.error("RSS generation error:", error);
    return res.status(500).send("Error generating RSS feed");
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
