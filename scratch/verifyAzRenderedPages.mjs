import fs from "fs";
import path from "path";

const checkAzSlugs = [
  "gozler-niye-ilk-baxir",
  "bahali-ve-ucuz-sriftler",
  "bildiris-ikonu-niye-zengdir",
  "fomo-itirmek-qorxusu-psixologiyasi",
  "vizual-metafora-ve-reklamlar",
  "sol-reqem-effekti-qiymet-psixologiyasi",
  "menfi-bosluq-ve-bahali-dizayn",
  "xeta-qirmizi-ugur-yasil-link-goy",
  "hamburger-menyu-niye-uc-xetdir",
  "yadda-saxla-ikonu-niye-diskisdir",
];

console.log("=== VERIFYING AZERBAIJANI RENDERED HTML FILES IN DIST/AZ/BLOG ===");

for (const slug of checkAzSlugs) {
  const filePath = path.join("dist", "az", "blog", slug, "index.html");
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf8");
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    console.log(`\n[AZ SLUG]: /az/blog/${slug}`);
    console.log(`  TITLE TAG:   ${titleMatch ? titleMatch[1] : "NOT FOUND"}`);
    console.log(`  DESCRIPTION: ${metaDescMatch ? metaDescMatch[1].slice(0, 80) + "..." : "NOT FOUND"}`);
  } else {
    console.error(`\n[ERROR]: File not found: ${filePath}`);
  }
}
