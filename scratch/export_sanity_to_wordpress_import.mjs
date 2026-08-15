import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const sanityClient = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  useCdn: false,
  apiVersion: "2025-01-01",
});

async function exportContent() {
  console.log("🚀 Starting Sanity -> WordPress Migration Data Export...");

  try {
    // 1. Fetch Blog Posts
    const blogs = await sanityClient.fetch(`
      *[_type == "blog"]{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        tags,
        featured,
        publishDate,
        readTime,
        body
      }
    `);
    console.log(`[Blog Export] Found ${blogs.length} blog posts in Sanity.`);

    // 2. Fetch Projects
    const projects = await sanityClient.fetch(`
      *[_type == "projects"]{
        _id,
        title,
        "slug": slug.current,
        client,
        description,
        type,
        tags,
        body,
        liveUrl,
        year,
        accent,
        order
      }
    `);
    console.log(`[Project Export] Found ${projects.length} portfolio projects in Sanity.`);

    const exportData = {
      exportedAt: new Date().toISOString(),
      blogs,
      projects,
    };

    const outputPath = path.join(process.cwd(), "sanity_to_wp_export.json");
    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), "utf-8");

    console.log(`✅ Data export complete! Saved to ${outputPath}`);
  } catch (error) {
    console.error("❌ Export failed:", error);
  }
}

exportContent();
