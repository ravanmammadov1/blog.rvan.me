import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Single Authoritative Sitemap Gateway
 * Directly serves or redirects to the authoritative pre-rendered dist/sitemap.xml
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const sitemapPath = path.resolve(process.cwd(), "dist", "sitemap.xml");
    const xml = await fs.readFile(sitemapPath, "utf8");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  } catch {
    // If not found in memory/runtime, redirect to static /sitemap.xml
    res.setHeader("Location", "/sitemap.xml");
    return res.status(301).end();
  }
}
