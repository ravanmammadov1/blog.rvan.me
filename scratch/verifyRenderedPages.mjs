import fs from "fs";
import path from "path";

const checkSlugs = [
  "why-eyes-look-at-certain-things-first",
  "why-some-fonts-feel-expensive-gotham-typography",
  "why-notification-icon-is-a-bell",
  "fomo-loss-aversion-scarcity-psychology",
  "what-is-visual-metaphor-advertising",
  "why-999-feels-cheaper-than-1000-pricing-psychology",
  "why-negative-space-makes-designs-feel-expensive",
  "why-error-is-red-success-green-links-blue",
  "why-hamburger-menu-has-three-lines",
  "why-save-icon-is-still-a-floppy-disk",
];

console.log("=== VERIFYING RENDERED HTML FILES IN DIST/BLOG ===");

for (const slug of checkSlugs) {
  const filePath = path.join("dist", "blog", slug, "index.html");
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf8");
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<h2[^>]*>(.*?)<\/h2>/i);
    const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    console.log(`\n[SLUG]: /blog/${slug}`);
    console.log(`  TITLE TAG:   ${titleMatch ? titleMatch[1] : "NOT FOUND"}`);
    console.log(`  HEADING:     ${h1Match ? h1Match[1] : "NOT FOUND"}`);
    console.log(`  DESCRIPTION: ${metaDescMatch ? metaDescMatch[1].slice(0, 80) + "..." : "NOT FOUND"}`);
  } else {
    console.error(`\n[ERROR]: File not found: ${filePath}`);
  }
}

console.log("\n=== CHECKING FOR OLD GENERIC TITLES IN DIST/ ===");
const oldTitles = [
  "Visual Hierarchy Masterclass",
  "The AIDA Framework",
  "What is the FOMO",
  "Customer Lifetime Value",
  "Data-Driven Marketing Analytics",
  "SEO Fundamentals for Creatives"
];

function searchDir(dir) {
  let matches = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      matches = matches.concat(searchDir(full));
    } else if (f.endsWith(".html")) {
      const content = fs.readFileSync(full, "utf8");
      for (const old of oldTitles) {
        if (content.includes(old)) {
          matches.push({ file: full, match: old });
        }
      }
    }
  }
  return matches;
}

const oldMatches = searchDir(path.join("dist", "blog"));
console.log(`Found ${oldMatches.length} references to old titles in dist/blog.`);
if (oldMatches.length > 0) {
  oldMatches.slice(0, 5).forEach(m => console.log(`  Found "${m.match}" in ${m.file}`));
} else {
  console.log("✓ ALL OLD TITLES HAVE BEEN COMPLETELY REMOVED FROM DIST/BLOG!");
}
