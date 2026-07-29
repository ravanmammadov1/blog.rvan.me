import fs from "fs";
import { execSync } from "child_process";

// Behance user name
const USERNAME = "mammadovravan";
const RSS_FEED_URL = `https://www.behance.net/feeds/user?username=${USERNAME}`;

async function syncBehance() {
  console.log(`Starting Behance synchronization for user "${USERNAME}"...`);

  try {
    // 1. Fetch RSS feed with a User-Agent to avoid Cloudflare 403s
    const res = await fetch(RSS_FEED_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Behance RSS feed: HTTP ${res.status}`);
    }

    const xml = await res.text();
    console.log("Successfully fetched Behance RSS feed.");

    // 2. Parse RSS Items using basic Regex to avoid heavy XML dependencies
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    const projects = [];
    let index = 0;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];

      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i) || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled Project";

      // Extract link
      const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i) || itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1].trim() : "";

      // Extract pubDate
      const pubDateMatch = itemXml.match(/<pubDate><!\[CDATA\[([\s\S]*?)\]\]><\/pubDate>/i) || itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString();

      // Extract description to get the cover image src
      const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
      const description = descMatch ? descMatch[1] : "";

      // Regex for image source in the description
      const imgMatch = description.match(/src=['"]([^'"]+)['"]/i);
      let coverUrl = imgMatch ? imgMatch[1] : "";

      if (link) {
        // Extract project ID and Slug from the URL:
        // E.g., https://www.behance.net/gallery/244287661/Xor-Valentines-Luxury-Edition
        const urlParts = link.split("/gallery/");
        if (urlParts.length > 1) {
          const galleryPart = urlParts[1]; // "244287661/Xor-Valentines-Luxury-Edition"
          const slashIdx = galleryPart.indexOf("/");
          const id = slashIdx !== -1 ? galleryPart.substring(0, slashIdx) : galleryPart;
          const slugPart = slashIdx !== -1 ? galleryPart.substring(slashIdx + 1) : galleryPart;
          const slug = slugPart.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

          // Generate a clean description
          let summary = `${title} — Curated portfolio showcase from Behance.`;
          if (title.toLowerCase().includes("xor")) {
            summary = "Bespoke luxury handset visualization showcase, craft motion, and brand visual effects.";
          } else if (title.toLowerCase().includes("wuling")) {
            summary = "Urban electric vehicle campaign visual suite featuring kinetic design hooks and localization media.";
          }

          projects.push({
            _type: "projects",
            _id: `behance-${id}`,
            title: title,
            slug: { _type: "slug", current: slug },
            description: summary,
            type: "Behance Case Study",
            tags: ["Motion Design", "3D Visualization", "Creative Art"],
            behanceCoverUrl: coverUrl,
            liveUrl: link,
            year: new Date(pubDate).getFullYear().toString() || "2026",
            accent: "#e8fd52",
            order: index + 1
          });
          index++;
        }
      }
    }

    console.log(`Parsed ${projects.length} Behance projects.`);

    if (projects.length === 0) {
      console.warn("No projects found in RSS feed. Aborting sync.");
      return;
    }

    // 3. Write NDJSON file for import
    const ndjsonPath = "C:/Project/ravanimate/behance_projects.ndjson";
    const ndjsonContent = projects.map((p) => JSON.stringify(p)).join("\n");
    fs.writeFileSync(ndjsonPath, ndjsonContent, "utf8");
    console.log(`Generated ${ndjsonPath} successfully.`);

    // 4. Import to Sanity using CLI (shares developer's local credentials)
    console.log("Importing Behance projects into Sanity 'production' dataset...");
    const importCommand = "npx sanity datasets import behance_projects.ndjson production --replace";
    const importOutput = execSync(importCommand, { 
      cwd: "C:/Project/ravanimate",
      encoding: "utf8" 
    });
    console.log("Sanity Import Response:\n", importOutput);

    // Clean up temporary NDJSON file
    fs.unlinkSync(ndjsonPath);
    console.log("Behance synchronization completed successfully!");
  } catch (error) {
    console.error("CRITICAL SYNC FAILURE:", error.message);
    process.exit(1);
  }
}

syncBehance();
