import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function main() {
  const query = `*[_type == "post"]{ _id, title, "slug": slug.current, "coverUrl": mainImage.asset->url, "assetId": mainImage.asset._ref, publishedAt } | order(publishedAt desc)`;
  const posts = await client.fetch(query);
  console.log(`Total posts: ${posts.length}`);

  const urlMap = new Map();
  posts.forEach((p) => {
    const key = p.coverUrl || "NO_COVER";
    if (!urlMap.has(key)) urlMap.set(key, []);
    urlMap.get(key).push(p);
  });

  console.log("\n=== COVER IMAGE DUPLICATION AUDIT ===");
  let duplicateCount = 0;
  urlMap.forEach((list, url) => {
    if (list.length > 1) {
      duplicateCount++;
      console.log(`\n🔴 Cover used by ${list.length} articles:`);
      console.log(`URL: ${url}`);
      list.forEach((item) => console.log(`  - [${item.slug}] ${item.title}`));
    }
  });

  console.log(`\nTotal unique covers with duplicates: ${duplicateCount}`);
}

main().catch(console.error);
