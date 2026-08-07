import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: true,
});

const DOMAIN = "https://www.rvan.me";

type SitemapPage = {
  url: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  priority: string;
};

const STATIC_PAGES: SitemapPage[] = [
  { url: `${DOMAIN}/`, changefreq: "weekly", priority: "1.0" },
  { url: `${DOMAIN}/work`, changefreq: "monthly", priority: "0.9" },
  { url: `${DOMAIN}/contact`, changefreq: "monthly", priority: "0.8" },
  { url: `${DOMAIN}/blog`, changefreq: "weekly", priority: "0.8" },
  { url: `${DOMAIN}/news`, changefreq: "weekly", priority: "0.6" },
  { url: `${DOMAIN}/tools`, changefreq: "monthly", priority: "0.5" },
  { url: `${DOMAIN}/ravan-mammadov`, changefreq: "monthly", priority: "0.9" },
  { url: `${DOMAIN}/resources`, changefreq: "weekly", priority: "0.6" },
  { url: `${DOMAIN}/privacy-policy`, changefreq: "yearly", priority: "0.2" },
  { url: `${DOMAIN}/cookie-policy`, changefreq: "yearly", priority: "0.2" },
  { url: `${DOMAIN}/terms`, changefreq: "yearly", priority: "0.2" },
];

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().split("T")[0];
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => {
    const entities: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function renderXml(pages: SitemapPage[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(page.url)}</loc>${page.lastmod ? `
    <lastmod>${page.lastmod}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const [blogs, news, projects, resources] = await Promise.all([
      client.fetch<Array<{ slug: string; updatedAt?: string; publishDate?: string }>>(`
        *[
          _type == "blog" &&
          (status == "published" || !defined(status)) &&
          defined(slug.current) &&
          defined(publishDate) &&
          publishDate <= now()
        ]{
          "slug": slug.current,
          "updatedAt": _updatedAt,
          publishDate
        }
      `),
      client.fetch<Array<{ slug: string; updatedAt?: string; publishedAt?: string }>>(`
        *[
          _type == "news" &&
          (status == "published" || !defined(status)) &&
          defined(slug.current) &&
          defined(publishedAt) &&
          publishedAt <= now()
        ]{
          "slug": slug.current,
          "updatedAt": _updatedAt,
          publishedAt
        }
      `),
      client.fetch<Array<{ slug: string; updatedAt?: string }>>(`
        *[
          _type == "projects" &&
          (status == "published" || !defined(status)) &&
          defined(slug.current)
        ]{
          "slug": slug.current,
          "updatedAt": _updatedAt
        }
      `),
      client.fetch<Array<{ slug: string; updatedAt?: string }>>(`
        *[
          _type == "resource" &&
          status == "published" &&
          defined(slug.current)
        ]{
          "slug": slug.current,
          "updatedAt": _updatedAt
        }
      `),
    ]);

    const dynamicPages: SitemapPage[] = [
      ...blogs.map((post) => ({
        url: `${DOMAIN}/blog/${encodeURIComponent(post.slug)}`,
        lastmod: formatDate(post.updatedAt || post.publishDate),
        changefreq: "weekly" as const,
        priority: "0.7",
      })),
      ...news.map((article) => ({
        url: `${DOMAIN}/news/${encodeURIComponent(article.slug)}`,
        lastmod: formatDate(article.updatedAt || article.publishedAt),
        changefreq: "weekly" as const,
        priority: "0.6",
      })),
      ...projects.map((project) => ({
        url: `${DOMAIN}/work/${encodeURIComponent(project.slug)}`,
        lastmod: formatDate(project.updatedAt),
        changefreq: "monthly" as const,
        priority: "0.8",
      })),
      ...resources.map((resource) => ({
        url: `${DOMAIN}/resources/${encodeURIComponent(resource.slug)}`,
        lastmod: formatDate(resource.updatedAt),
        changefreq: "weekly" as const,
        priority: "0.5",
      })),
    ];

    const pages = Array.from(
      new Map([...STATIC_PAGES, ...dynamicPages].map((page) => [page.url, page])).values()
    );

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(renderXml(pages));
  } catch (error) {
    // Keep discovery alive during a temporary CMS outage. The last successful
    // dynamic sitemap is not available in a new serverless instance, so return
    // a valid core sitemap rather than a 500 response.
    console.error("Dynamic sitemap generation error:", error);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.status(200).send(renderXml(STATIC_PAGES));
  }
}
