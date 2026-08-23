import { createClient } from "@sanity/client";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

const query = `*[_type == "blog"] {
  _id,
  title,
  "slug": slug.current,
  "coverAssetRef": coverImage.asset._ref,
  "coverAlt": coverImage.alt,
  "coverUrl": coverImage.asset->url
}`;

console.log("=== VERIFYING LIVE SANITY 39 BLOG COVER ASSETS ===");
const blogs = await client.fetch(query);
console.log(`Total blogs fetched from Sanity: ${blogs.length}`);

let verifiedCount = 0;
let errors = 0;

for (let i = 0; i < blogs.length; i++) {
  const b = blogs[i];
  const hasRef = b.coverAssetRef && b.coverAssetRef.startsWith("image-");
  const hasAlt = b.coverAlt && b.coverAlt.length > 5;
  const hasUrl = b.coverUrl && b.coverUrl.startsWith("https://cdn.sanity.io/");

  if (hasRef && hasAlt && hasUrl) {
    console.log(`[${i + 1}/39] ✓ ${b._id}`);
    console.log(`       Title: "${b.title}"`);
    console.log(`       Asset Ref: ${b.coverAssetRef}`);
    console.log(`       CDN URL:   ${b.coverUrl}`);
    console.log(`       Alt:       "${b.coverAlt}"`);
    verifiedCount++;
  } else {
    console.error(`[${i + 1}/39] ✗ FAILED on ${b._id}: Ref=${b.coverAssetRef}, Alt=${b.coverAlt}, URL=${b.coverUrl}`);
    errors++;
  }
}

console.log("\n=========================================");
console.log(`RESULTS: ${verifiedCount} of 39 blogs verified with real, live Sanity image assets!`);
console.log(`Errors: ${errors}`);
console.log("=========================================\n");
