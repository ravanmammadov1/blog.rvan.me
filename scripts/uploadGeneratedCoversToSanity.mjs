import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

const GENERATED_COVERS = [
  {
    docId: "blog-visual-hierarchy-masterclass",
    localPath: "public/covers/generated/blog_cover_visual_hierarchy_1787124683435.jpg",
    alt: "Abstract editorial illustration of human eye anatomy with neural pathways and visual cortex processing",
  },
  {
    docId: "blog-the-art-of-typographic-pairing",
    localPath: "public/covers/generated/blog_cover_luxury_fonts_1787124699376.jpg",
    alt: "Elegant typographic composition showing the contrast between luxury and cheap typography",
  },
  {
    docId: "blog-iconography-and-vector-precision",
    localPath: "public/covers/generated/blog_cover_notification_bell_1787124709777.jpg",
    alt: "A single brass bell floating in dramatic spotlight with acoustic sound waves",
  },
  {
    docId: "blog-after-effects-optimization-expressions-render-systems",
    localPath: "public/covers/generated/blog_cover_fomo_scarcity_1787124721585.jpg",
    alt: "A single empty chair in a vast sold-out theater with dramatic spotlight",
  },
  {
    docId: "blog-aida-framework-performance-creative-attention-action",
    localPath: "public/covers/generated/blog_cover_visual_metaphor_1787124730886.jpg",
    alt: "Surrealist editorial photo of a sliced ketchup bottle revealing fresh tomato cross-sections",
  },
  {
    docId: "blog-copywriting-psychology-cognitive-biases",
    localPath: "public/covers/generated/blog_cover_charm_pricing_1787124762129.jpg",
    alt: "Dramatic close-up of a price tag showing 9.99 in elegant gold foil numbers on matte black cardboard",
  },
  {
    docId: "blog-micro-and-macro-whitespace",
    localPath: "public/covers/generated/blog_cover_negative_space_1787124772953.jpg",
    alt: "Minimalist editorial composition with a single small luxury perfume bottle placed in a vast white marble surface",
  },
  {
    docId: "blog-color-theory-in-digital-branding",
    localPath: "public/covers/generated/blog_cover_error_red_green_1787124781247.jpg",
    alt: "Abstract split composition: left half is deep vivid red, right half is rich emerald green",
  },
  {
    docId: "blog-grid-systems-responsive-layout-architecture",
    localPath: "public/covers/generated/blog_cover_hamburger_menu_1787124790989.jpg",
    alt: "Three perfectly parallel horizontal white lines floating in a vast dark space with neon glow",
  },
  {
    docId: "blog-minimalist-packaging-and-graphic-layouts",
    localPath: "public/covers/generated/blog_cover_minimalist_expensive_1787124800336.jpg",
    alt: "Side by side comparison of a sleek minimalist premium hairdryer vs cheap cluttered hairdryer",
  },
  {
    docId: "blog-10-graphic-design-rules-art-directors-never-break",
    localPath: "public/covers/generated/blog_cover_rule_of_three_1787124961817.jpg",
    alt: "Abstract minimalist composition with three geometric objects in perfect triangular balance",
  },
  {
    docId: "blog-brand-identity-design-systems",
    localPath: "public/covers/generated/blog_cover_unforgettable_logos_1787124971609.jpg",
    alt: "Abstract human brain silhouette composed of intertwining geometric shapes and curves",
  },
  {
    docId: "blog-brand-positioning-matrix",
    localPath: "public/covers/generated/blog_cover_restaurant_anchor_1787124984891.jpg",
    alt: "Overhead flat lay of an elegant restaurant menu with magnifying glass over the most expensive dish",
  },
];

async function run() {
  console.log("Uploading " + GENERATED_COVERS.length + " generated covers to Sanity CDN...");

  for (let i = 0; i < GENERATED_COVERS.length; i++) {
    const item = GENERATED_COVERS[i];
    console.log(`[${i + 1}/${GENERATED_COVERS.length}] Processing ${item.docId}...`);

    try {
      const fileBuffer = fs.readFileSync(item.localPath);
      const filename = path.basename(item.localPath);

      const asset = await client.assets.upload("image", fileBuffer, {
        filename: filename,
        contentType: "image/jpeg",
      });

      console.log(`  ✓ Asset uploaded: ${asset._id} -> ${asset.url}`);

      await client
        .patch(item.docId)
        .set({
          coverImage: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
            alt: item.alt,
          },
          _updatedAt: new Date().toISOString(),
        })
        .commit();

      console.log(`  ✓ Document ${item.docId} updated in Sanity!`);
    } catch (err) {
      console.error(`  ✗ Error on ${item.docId}:`, err.message);
    }
  }

  console.log("\nAll 13 generated covers uploaded and synced to Sanity successfully!");
}

run().catch(console.error);
