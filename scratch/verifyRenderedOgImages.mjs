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

console.log("=== VERIFYING RENDERED OG:IMAGE TAGS IN DIST/BLOG ===");

for (const slug of checkSlugs) {
  const filePath = path.join("dist", "blog", slug, "index.html");
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf8");
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);
    const twImageMatch = html.match(/<meta\s+name=["']twitter:image["']\s+content=["'](.*?)["']/i);
    console.log(`\n[SLUG]: /blog/${slug}`);
    console.log(`  OG:IMAGE:      ${ogImageMatch ? ogImageMatch[1] : "NOT FOUND"}`);
    console.log(`  TWITTER:IMAGE: ${twImageMatch ? twImageMatch[1] : "NOT FOUND"}`);
  } else {
    console.error(`\n[ERROR]: File not found: ${filePath}`);
  }
}
