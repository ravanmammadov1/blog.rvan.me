import fs from "fs";
import path from "path";
import sharp from "sharp";

const brainDir = "C:\\Users\\mamma\\.gemini\\antigravity\\brain\\c0d99b28-05d4-4769-8cee-403e21857220";
const targetDir = path.resolve("public/covers");

const imageMappings = [
  {
    src: "apca_contrast_science_1787057837368.jpg",
    dest: "apca-contrast-science-cover.webp",
    alt: "APCA perceptual contrast algorithm and human visual cone luminance diagram",
    slug: "apca-vs-wcag-contrast-accessibility-guide",
  },
  {
    src: "cognitive_copywriting_1787057851856.jpg",
    dest: "cognitive-conversion-copywriting-cover.webp",
    alt: "Cognitive decision pathways and verbal clarity in user interface architecture",
    slug: "guide-cognitive-conversion-copywriting",
  },
  {
    src: "visual_hierarchy_framework_1787057867338.jpg",
    dest: "visual-hierarchy-3-second-framework-cover.webp",
    alt: "The 3-second visual scan path and eye tracking attention heatmap across digital layout",
    slug: "visual-hierarchy-framework-web-interfaces",
  },
  {
    src: "gestalt_proximity_wide_1787057900971.jpg",
    dest: "gestalt-proximity-ui-architecture-cover.webp",
    alt: "Gestalt law of proximity Swiss design principles and UI grouping method",
    slug: "why-we-group-things-together-gestalt-proximity",
  },
  {
    src: "web_homogenization_1787057915810.jpg",
    dest: "why-modern-websites-all-look-the-same-cover.webp",
    alt: "Infinite perspective grid of identical wireframe websites illustrating design homogenization",
    slug: "why-modern-websites-all-look-the-same",
  },
  {
    src: "corner_radius_psychology_1787057940864.jpg",
    dest: "corner-radius-shape-psychology-cover.webp",
    alt: "Sharp geometric block contrasted with organic smooth rounded pebble in museum lighting",
    slug: "why-rounded-shapes-feel-friendlier-corner-radius-psychology",
  },
  {
    src: "scarcity_panic_buy_1787057958551.jpg",
    dest: "scarcity-urgency-panic-buy-cover.webp",
    alt: "Minimalist glowing countdown indicator 03 in architectural gallery setting",
    slug: "why-only-3-left-makes-you-panic-buy-scarcity",
  },
  {
    src: "ai_uncanny_valley_1787057980571.jpg",
    dest: "ai-images-uncanny-valley-cover.webp",
    alt: "Split study comparing synthetic artificial surface with authentic organic human texture",
    slug: "why-ai-images-look-expensive-but-feel-wrong",
  },
  {
    src: "von_restorff_visual_salience_1787048256065.jpg",
    dest: "why-eyes-look-first-visual-salience-cover.webp",
    alt: "Visual salience and Von Restorff isolation effect in editorial design composition",
    slug: "why-eyes-look-at-certain-things-first",
  },
  {
    src: "luxury_spatial_restraint_1787047919315.jpg",
    dest: "luxury-brands-empty-space-cover.webp",
    alt: "Luxury brand spatial restraint and negative space museum exhibition composition",
    slug: "why-luxury-brands-use-so-much-empty-space",
  },
  {
    src: "minimalist_industrial_precision_1787047240997.jpg",
    dest: "why-the-number-3-appears-everywhere-cover.webp",
    alt: "Rule of thirds and triad visual structure in minimalist design architecture",
    slug: "why-the-number-3-appears-everywhere-in-design",
  },
  {
    src: "typographic_personality_transition_1787047220332.jpg",
    dest: "why-some-fonts-feel-expensive-cover.webp",
    alt: "Typographic personality transition comparing geometric sans and luxury serif letterforms",
    slug: "why-some-fonts-feel-expensive-gotham-typography",
  },
];

async function processImages() {
  console.log("Processing and optimizing bespoke editorial covers...");

  for (const item of imageMappings) {
    const srcPath = path.join(brainDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }

    const destWebp = path.join(targetDir, item.dest);
    const destJpg = path.join(targetDir, item.dest.replace(".webp", ".jpg"));

    // Generate optimized WebP
    await sharp(srcPath)
      .resize(1600, 900, { fit: "cover" })
      .webp({ quality: 88, effort: 6 })
      .toFile(destWebp);

    // Generate fallback JPG
    await sharp(srcPath)
      .resize(1600, 900, { fit: "cover" })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(destJpg);

    const stats = fs.statSync(destWebp);
    console.log(`✅ [${item.slug}] -> /covers/${item.dest} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  console.log("\nAll bespoke editorial artwork successfully processed and optimized into /public/covers/!");
}

processImages().catch(console.error);
