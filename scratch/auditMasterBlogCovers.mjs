import fs from "fs";
import path from "path";

const blogsDir = path.resolve("src/lib/blogs");
const files = [
  "articleResponsiveTypographyGuide.ts",
  "articleApcaAccessibilityGuide.ts",
  "articleCognitiveCopywritingGuide.ts",
  "articleVisualHierarchyGuide.ts",
  "articles01to10.ts",
  "articles11to20.ts",
  "articles21to30.ts",
  "articles31to39.ts",
];

const allArticles = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(blogsDir, file), "utf8");
  // Match each BlogPost object
  const regex = /title:\s*["']([^"']+)["'][\s\S]*?slug:\s*\{\s*_type:\s*["']slug["'],\s*current:\s*["']([^"']+)["']\s*\}[\s\S]*?url:\s*["'](https:\/\/[^"']+)["']/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    allArticles.push({
      title: match[1],
      slug: match[2],
      url: match[3],
      file,
    });
  }
}

console.log(`Parsed ${allArticles.length} articles with cover images.`);

const urlMap = new Map();
allArticles.forEach((a) => {
  if (!urlMap.has(a.url)) urlMap.set(a.url, []);
  urlMap.get(a.url).push(a);
});

console.log("\n=== COVER URL DUPLICATION AUDIT ===");
let dupes = 0;
urlMap.forEach((list, url) => {
  if (list.length > 1) {
    dupes++;
    console.log(`\n🔴 URL used by ${list.length} articles:`);
    console.log(`URL: ${url}`);
    list.forEach((item) => console.log(`  - [${item.slug}] "${item.title}" (${item.file})`));
  } else {
    console.log(`🟢 Unique [${list[0].slug}]: "${list[0].title.slice(0, 50)}..."`);
  }
});

console.log(`\nTotal duplicate URL groups: ${dupes}`);
