import fs from "fs";
import path from "path";

const blogsDir = path.resolve("src/lib/blogs");

const patches = [
  {
    file: "articleApcaAccessibilityGuide.ts",
    slug: "apca-vs-wcag-contrast-accessibility-guide",
    url: "/covers/apca-contrast-science-cover.webp",
    alt: "APCA perceptual contrast algorithm and human visual cone luminance diagram",
  },
  {
    file: "articleCognitiveCopywritingGuide.ts",
    slug: "guide-cognitive-conversion-copywriting",
    url: "/covers/cognitive-conversion-copywriting-cover.webp",
    alt: "Cognitive decision pathways and verbal clarity in user interface architecture",
  },
  {
    file: "articleVisualHierarchyGuide.ts",
    slug: "visual-hierarchy-framework-web-interfaces",
    url: "/covers/visual-hierarchy-3-second-framework-cover.webp",
    alt: "The 3-second visual scan path and eye tracking attention heatmap across digital layout",
  },
  {
    file: "articles31to39.ts",
    slug: "why-we-group-things-together-gestalt-proximity",
    url: "/covers/gestalt-proximity-ui-architecture-cover.webp",
    alt: "Gestalt law of proximity Swiss design principles and UI grouping method",
  },
  {
    file: "articles21to30.ts",
    slug: "why-modern-websites-all-look-the-same",
    url: "/covers/why-modern-websites-all-look-the-same-cover.webp",
    alt: "Infinite perspective grid of identical wireframe websites illustrating design homogenization",
  },
  {
    file: "articles21to30.ts",
    slug: "why-rounded-shapes-feel-friendlier-corner-radius-psychology",
    url: "/covers/corner-radius-shape-psychology-cover.webp",
    alt: "Sharp geometric block contrasted with organic smooth rounded pebble in museum lighting",
  },
  {
    file: "articles21to30.ts",
    slug: "why-ai-images-look-expensive-but-feel-wrong",
    url: "/covers/ai-images-uncanny-valley-cover.webp",
    alt: "Split study comparing synthetic artificial surface with authentic organic human texture",
  },
  {
    file: "articles11to20.ts",
    slug: "why-the-number-3-appears-everywhere-in-design",
    url: "/covers/why-the-number-3-appears-everywhere-cover.webp",
    alt: "Rule of thirds and triad visual structure in minimalist design architecture",
  },
  {
    file: "articles11to20.ts",
    slug: "why-only-3-left-makes-you-panic-buy-scarcity",
    url: "/covers/scarcity-urgency-panic-buy-cover.webp",
    alt: "Minimalist glowing countdown indicator 03 in architectural gallery setting",
  },
  {
    file: "articles01to10.ts",
    slug: "why-eyes-look-at-certain-things-first",
    url: "/covers/why-eyes-look-first-visual-salience-cover.webp",
    alt: "Visual salience and Von Restorff isolation effect in editorial design composition",
  },
  {
    file: "articles01to10.ts",
    slug: "why-some-fonts-feel-expensive-gotham-typography",
    url: "/covers/why-some-fonts-feel-expensive-cover.webp",
    alt: "Typographic personality transition comparing geometric sans and luxury serif letterforms",
  },
  {
    file: "articles31to39.ts",
    slug: "why-luxury-brands-use-so-much-empty-space",
    url: "/covers/luxury-brands-empty-space-cover.webp",
    alt: "Luxury brand spatial restraint and negative space museum exhibition composition",
  },
];

for (const patch of patches) {
  const filePath = path.join(blogsDir, patch.file);
  let code = fs.readFileSync(filePath, "utf8");

  // Find the block containing the slug
  const slugIndex = code.indexOf(patch.slug);
  if (slugIndex === -1) {
    console.warn(`Slug not found: ${patch.slug} in ${patch.file}`);
    continue;
  }

  // Find coverImage block near the slug
  const beforeSlug = code.lastIndexOf("coverImage:", slugIndex);
  const afterSlug = code.indexOf("coverImage:", slugIndex);
  
  // Decide which coverImage block belongs to this article
  let coverIndex = afterSlug !== -1 && (afterSlug - slugIndex < 1000) ? afterSlug : beforeSlug;

  if (coverIndex !== -1) {
    // Find url: "..." within the coverImage block
    const urlMatch = code.slice(coverIndex, coverIndex + 400).match(/url:\s*["']([^"']+)["']/);
    if (urlMatch) {
      const oldUrl = urlMatch[1];
      const targetChunk = code.slice(coverIndex, coverIndex + 400);
      const replacedChunk = targetChunk.replace(oldUrl, patch.url);
      code = code.slice(0, coverIndex) + replacedChunk + code.slice(coverIndex + 400);
      fs.writeFileSync(filePath, code, "utf8");
      console.log(`✅ Patched [${patch.slug}] -> ${patch.url}`);
    }
  }
}

console.log("\nAll editorial blog cover image paths successfully updated!");
