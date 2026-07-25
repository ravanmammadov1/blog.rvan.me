import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false, // Ensure fresh dynamic data
});

const DOMAIN = "https://www.rvan.me";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Static core indexable pages
    const staticPages = [
      { url: `${DOMAIN}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
      { url: `${DOMAIN}/work`, lastmod: today, changefreq: "weekly", priority: "0.9" },
      { url: `${DOMAIN}/expertise`, lastmod: today, changefreq: "weekly", priority: "0.9" },
      { url: `${DOMAIN}/contact`, lastmod: today, changefreq: "monthly", priority: "0.8" },
      { url: `${DOMAIN}/blog`, lastmod: today, changefreq: "daily", priority: "0.9" },
      { url: `${DOMAIN}/news`, lastmod: today, changefreq: "weekly", priority: "0.8" },
      { url: `${DOMAIN}/tools`, lastmod: today, changefreq: "monthly", priority: "0.8" },
      { url: `${DOMAIN}/ravan-mammadov`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    ];

    // Fetch dynamic content from Sanity CMS
    const [blogs, news, projects] = await Promise.all([
      client.fetch<Array<{ slug: string; updatedAt?: string; publishDate?: string }>>(`
        *[_type == "blog" && defined(slug.current)]{
          "slug": slug.current,
          "_updatedAt": _updatedAt,
          "publishDate": publishDate
        }
      `),
      client.fetch<Array<{ slug: string; updatedAt?: string; publishedAt?: string }>>(`
        *[_type == "news" && defined(slug.current)]{
          "slug": slug.current,
          "_updatedAt": _updatedAt,
          "publishedAt": publishedAt
        }
      `),
      client.fetch<Array<{ slug: string; updatedAt?: string }>>(`
        *[_type == "projects" && defined(slug.current)]{
          "slug": slug.current,
          "_updatedAt": _updatedAt
        }
      `),
    ]);

    const dynamicPages: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];

    // Blog post URLs
    if (Array.isArray(blogs)) {
      blogs.forEach((post) => {
        if (post.slug) {
          const dateStr = post.updatedAt || post.publishDate || today;
          const formattedDate = dateStr ? new Date(dateStr).toISOString().split("T")[0] : today;
          dynamicPages.push({
            url: `${DOMAIN}/blog/${post.slug}`,
            lastmod: formattedDate,
            changefreq: "weekly",
            priority: "0.8",
          });
        }
      });
    }

    // News article URLs
    if (Array.isArray(news)) {
      news.forEach((article) => {
        if (article.slug) {
          const dateStr = article.updatedAt || article.publishedAt || today;
          const formattedDate = dateStr ? new Date(dateStr).toISOString().split("T")[0] : today;
          dynamicPages.push({
            url: `${DOMAIN}/news/${article.slug}`,
            lastmod: formattedDate,
            changefreq: "weekly",
            priority: "0.7",
          });
        }
      });
    }

    // Project detail URLs
    if (Array.isArray(projects)) {
      projects.forEach((proj) => {
        if (proj.slug) {
          const dateStr = proj.updatedAt || today;
          const formattedDate = dateStr ? new Date(dateStr).toISOString().split("T")[0] : today;
          dynamicPages.push({
            url: `${DOMAIN}/work/${proj.slug}`,
            lastmod: formattedDate,
            changefreq: "monthly",
            priority: "0.8",
          });
        }
      });
    }

    const allPages = [...staticPages, ...dynamicPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  } catch (error: any) {
    console.error("Dynamic sitemap generation error:", error);
    return res.status(500).send("Error generating dynamic sitemap");
  }
}
