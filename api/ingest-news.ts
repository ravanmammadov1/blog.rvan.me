import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";
import crypto from "crypto";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const feeds = [
  { category: "Design", url: "https://uxdesign.cc/feed", sourceName: "UX Collective" },
  { category: "AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/", sourceName: "TechCrunch AI" },
  { category: "Development", url: "https://dev.to/feed", sourceName: "Dev.to" },
  { category: "Marketing", url: "https://blog.hubspot.com/marketing/rss.xml", sourceName: "HubSpot Marketing" },
  { category: "Motion Design", url: "https://motionographer.com/feed/", sourceName: "Motionographer" }
];

function extractCdataOrText(xmlStr: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([^<]*?))</${tag}>`, "i");
  const match = xmlStr.match(regex);
  if (match) {
    return (match[1] || match[2] || "").trim();
  }
  return "";
}

function extractImageUrl(itemXml: string): string | null {
  const mediaMatch = itemXml.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];

  const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["']/i);
  if (enclosureMatch) return enclosureMatch[1];

  const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];

  return null;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("SANITY_API_WRITE_TOKEN is not configured.");
    return res.status(500).json({ error: "SANITY_API_WRITE_TOKEN is missing" });
  }

  const results: Array<{ feed: string; count: number; imported: number; errors: number }> = [];

  try {
    for (const feed of feeds) {
      console.log(`Ingesting feed: ${feed.sourceName}`);
      let feedItemCount = 0;
      let importedCount = 0;
      let errorCount = 0;

      try {
        const response = await fetch(feed.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch feed: ${response.statusText}`);
        }
        const text = await response.text();

        const items: string[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
        let match;
        while ((match = itemRegex.exec(text)) !== null) {
          items.push(match[1]);
        }

        feedItemCount = items.length;

        // Process up to 10 articles per feed to avoid serverless function timeouts
        const itemsToProcess = items.slice(0, 10);

        for (const itemXml of itemsToProcess) {
          try {
            const title = extractCdataOrText(itemXml, "title");
            const link = extractCdataOrText(itemXml, "link");
            let pubDateStr = extractCdataOrText(itemXml, "pubDate") || extractCdataOrText(itemXml, "dc:date");
            const rawDescription = extractCdataOrText(itemXml, "description") || extractCdataOrText(itemXml, "content:encoded");

            if (!title || !link) continue;

            const publishedAt = pubDateStr ? new Date(pubDateStr).toISOString() : new Date().toISOString();
            const excerpt = cleanHtml(rawDescription).substring(0, 215) + "...";
            const docId = "news-" + crypto.createHash("sha256").update(link).digest("hex");

            // Check if document already exists to avoid redundant coverImage uploads
            const exists = await client.fetch<boolean>(
              `defined(*[_type == "news" && _id == $id][0]._id)`,
              { id: docId }
            );

            if (exists) {
              console.log(`Article already exists: ${title}`);
              continue;
            }

            const doc: any = {
              _type: "news",
              _id: docId,
              title: title.substring(0, 150),
              slug: {
                _type: "slug",
                current: slugify(title).substring(0, 96),
              },
              excerpt,
              category: feed.category,
              publishedAt,
              sourceUrl: link,
              sourceName: feed.sourceName,
              body: [
                {
                  _key: `block-${crypto.randomBytes(4).toString("hex")}`,
                  _type: "block",
                  style: "normal",
                  markDefs: [
                    {
                      _key: "link-ref",
                      _type: "link",
                      href: link,
                    },
                  ],
                  children: [
                    {
                      _type: "span",
                      text: cleanHtml(rawDescription).substring(0, 500) + "...\n\n",
                      marks: [],
                    },
                    {
                      _type: "span",
                      text: `Read the full article on ${feed.sourceName} →`,
                      marks: ["link-ref"],
                    },
                  ],
                },
              ],
            };

            const imageUrl = extractImageUrl(itemXml);
            if (imageUrl) {
              try {
                console.log(`Downloading image: ${imageUrl}`);
                const imgRes = await fetch(imageUrl);
                if (imgRes.ok) {
                  const arrayBuffer = await imgRes.arrayBuffer();
                  const buffer = Buffer.from(arrayBuffer);
                  const filename = crypto.createHash("md5").update(imageUrl).digest("hex") + ".jpg";
                  
                  const asset = await client.assets.upload("image", buffer, {
                    filename,
                    contentType: imgRes.headers.get("content-type") || "image/jpeg",
                  });

                  doc.coverImage = {
                    _type: "image",
                    asset: {
                      _type: "reference",
                      _ref: asset._id,
                    },
                    alt: title,
                  };
                }
              } catch (imageErr) {
                console.error(`Failed to upload image for ${title}:`, imageErr);
              }
            }

            await client.createOrReplace(doc);
            console.log(`Imported article: ${title}`);
            importedCount++;
          } catch (itemErr) {
            console.error("Error processing item:", itemErr);
            errorCount++;
          }
        }
      } catch (feedErr: any) {
        console.error(`Error processing feed ${feed.sourceName}:`, feedErr);
        errorCount += feedItemCount || 1;
      }

      results.push({
        feed: feed.sourceName,
        count: feedItemCount,
        imported: importedCount,
        errors: errorCount
      });
    }

    return res.status(200).json({ success: true, results });
  } catch (globalErr: any) {
    console.error("Global Ingestion Error:", globalErr);
    return res.status(500).json({ error: globalErr.message || "Unknown error occurred" });
  }
}
