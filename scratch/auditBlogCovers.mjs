import { ALL_EDITORIAL_BLOGS } from "../src/lib/editorialBlogRegistry.js";

const coversMap = new Map();
const list = [];

ALL_EDITORIAL_BLOGS.forEach((b, idx) => {
  const url = b.coverImage?.url || b.coverImage?.asset?._ref || "FALLBACK";
  const entry = {
    idx: idx + 1,
    id: b._id,
    slug: b.slug?.current || b.slug,
    title: b.title,
    category: b.category,
    url,
    alt: b.coverImage?.alt || "",
  };
  list.push(entry);

  if (!coversMap.has(url)) {
    coversMap.set(url, []);
  }
  coversMap.get(url).push(entry.slug);
});

console.log(`Total Master Articles: ${list.length}`);
console.log(`Total Unique Cover URLs: ${coversMap.size}\n`);

console.log("=== DUPLICATE COVER IMAGE GROUPS ===");
for (const [url, slugs] of coversMap.entries()) {
  if (slugs.length > 1) {
    console.log(`\nURL: ${url} (Used ${slugs.length} times):`);
    slugs.forEach((s) => console.log(` - ${s}`));
  }
}

console.log("\n=== ALL 39 ARTICLES & CURRENT COVERS ===");
list.forEach((item) => {
  console.log(`[${item.idx}] ${item.slug} (${item.category})\n    Title: ${item.title}\n    Cover: ${item.url}\n`);
});
