import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token) {
  throw new Error("SANITY_API_WRITE_TOKEN environment variable is missing.");
}

const client = createClient({
  projectId: "0lqwkcmg",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: token,
  useCdn: false,
});

const COVERS_DATA = [
  {
    docId: "blog-visual-hierarchy-masterclass",
    filename: "why-eyes-look-at-certain-things-first-cover.jpg",
    alt: "Editorial composition illustrating visual hierarchy and eye-tracking scan paths directing human attention",
    sourceUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-the-art-of-typographic-pairing",
    filename: "why-some-fonts-feel-expensive-gotham-cover.jpg",
    alt: "Editorial typography still life contrasting restrained luxury letterforms with discount typography",
    sourceUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-iconography-and-vector-precision",
    filename: "why-notification-icon-is-a-bell-cover.jpg",
    alt: "Conceptual visual evolution of a physical brass bell transforming into a modern digital UI notification icon",
    sourceUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-after-effects-optimization-expressions-render-systems",
    filename: "fomo-loss-aversion-scarcity-psychology-cover.jpg",
    alt: "Conceptual editorial photograph visualizing scarcity and psychological loss aversion",
    sourceUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-aida-framework-performance-creative-attention-action",
    filename: "what-is-visual-metaphor-advertising-cover.jpg",
    alt: "Surreal conceptual visual metaphor demonstrating cognitive closure and memorable advertising art direction",
    sourceUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-copywriting-psychology-cognitive-biases",
    filename: "why-999-feels-cheaper-pricing-psychology-cover.jpg",
    alt: "Minimalist behavioral economics composition illustrating the left-digit effect in price perception",
    sourceUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-micro-and-macro-whitespace",
    filename: "why-negative-space-makes-designs-feel-expensive-cover.jpg",
    alt: "Editorial composition featuring extreme negative space framing a single luxury artifact",
    sourceUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-color-theory-in-digital-branding",
    filename: "why-error-is-red-success-green-links-blue-cover.jpg",
    alt: "Swiss modernist design diagram demonstrating the biological and interface evolution of red, green, and blue visual signals",
    sourceUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-grid-systems-responsive-layout-architecture",
    filename: "why-hamburger-menu-has-three-lines-cover.jpg",
    alt: "Minimalist graphic design composition exploring the three horizontal lines of the hamburger menu icon",
    sourceUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-minimalist-packaging-and-graphic-layouts",
    filename: "why-minimalist-designs-look-more-expensive-cover.jpg",
    alt: "Comparative packaging still life demonstrating how extreme visual restraint signals luxury and quality",
    sourceUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-10-graphic-design-rules-art-directors-never-break",
    filename: "why-the-number-3-appears-everywhere-in-design-cover.jpg",
    alt: "Geometric editorial composition showing rhythmic groupings of three across design systems",
    sourceUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-brand-identity-design-systems",
    filename: "why-some-logos-are-impossible-to-forget-cover.jpg",
    alt: "Conceptual visual showing complex geometric forms resolving into an indelible iconic mark",
    sourceUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-brand-positioning-matrix",
    filename: "why-restaurants-put-expensive-dish-on-menu-cover.jpg",
    alt: "Editorial dining still life visualizing price anchoring and contrast effects in menu engineering",
    sourceUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-motion-design-mechanics",
    filename: "why-good-animation-feels-natural-ui-physics-cover.jpg",
    alt: "Motion design editorial poster showing non-linear easing trajectories and kinetic physics",
    sourceUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-ui-ux-principles-reducing-cognitive-load",
    filename: "why-youre-almost-done-works-zeigarnik-cover.jpg",
    alt: "Behavioral UX editorial visualizing the Zeigarnik effect and the goal gradient hypothesis",
    sourceUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-conversion-rate-optimization-cro",
    filename: "why-most-popular-works-on-pricing-tables-cover.jpg",
    alt: "Conceptual editorial visualization of choice architecture and social proof default heuristics",
    sourceUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-social-proof-frameworks",
    filename: "why-small-creators-sell-more-than-celebrities-cover.jpg",
    alt: "Conceptual visual contrasting reach with authentic trust in the creator economy",
    sourceUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-viral-growth-loops",
    filename: "why-save-icon-is-still-a-floppy-disk-cover.jpg",
    alt: "Museum-style technology artifact photograph showing a floppy disk bridging physical storage and digital semiotics",
    sourceUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-customer-lifetime-value-ltv",
    filename: "why-free-makes-people-buy-zero-price-effect-cover.jpg",
    alt: "Behavioral economics visual metaphor demonstrating the irrational attraction of the zero price effect",
    sourceUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-data-driven-marketing-analytics",
    filename: "why-only-3-left-makes-you-panic-buy-scarcity-cover.jpg",
    alt: "Psychological product photography visualizing inventory scarcity and purchase urgency",
    sourceUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-performance-creative-frameworks",
    filename: "why-modern-websites-all-look-the-same-cover.jpg",
    alt: "Editorial satire illustration visualizing design system homogenization across modern web apps",
    sourceUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-content-strategy-hubs",
    filename: "why-helvetica-became-the-font-of-corporate-america-cover.jpg",
    alt: "Swiss modernist typographic landscape exploring Helvetica's corporate ubiquity and neutral authority",
    sourceUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-automated-email-funnels",
    filename: "never-tell-a-client-your-price-too-early-value-framing-cover.jpg",
    alt: "Editorial consulting illustration demonstrating value framing and diagnostic sales psychology",
    sourceUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-influencer-and-creator-partnerships",
    filename: "why-personalized-ads-feel-creepy-privacy-paradox-cover.jpg",
    alt: "Psychological editorial artwork visualizing the ad-tech uncanny valley and hyper-targeting privacy concerns",
    sourceUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-the-future-of-multidisciplinary-creators",
    filename: "why-rounded-shapes-feel-friendlier-corner-radius-cover.jpg",
    alt: "Industrial design still life comparing sharp geometric hazard angles with organic rounded forms",
    sourceUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-ai-image-generation-pipelines",
    filename: "why-ai-images-look-expensive-but-feel-wrong-cover.jpg",
    alt: "Cinematic editorial composition exploring the synthetic visual perfection and uncanny valley of AI imagery",
    sourceUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-prompt-engineering-for-designers",
    filename: "why-search-is-a-magnifying-glass-cover.jpg",
    alt: "Design history still life showing an optical magnifying glass transitioning into a digital search affordance",
    sourceUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-ai-copywriting-and-tone-calibration",
    filename: "why-ai-writing-sounds-so-similar-rlhf-cover.jpg",
    alt: "Conceptual typography editorial contrasting homogenized AI writing with authentic human voice",
    sourceUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-synthetic-media-and-video-ai",
    filename: "why-phone-icon-is-a-1960s-telephone-receiver-cover.jpg",
    alt: "Telephony design history photograph contrasting the ergonomic curved handset with flat glass rectangles",
    sourceUrl: "https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-legal-ethics-and-licensing-in-ai-art",
    filename: "why-comic-sans-is-the-most-hated-font-in-history-cover.jpg",
    alt: "Typographic editorial piece exploring Comic Sans and the clash of typographic decorum",
    sourceUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-automating-creative-workflows-with-ai-agents",
    filename: "why-settings-icon-is-a-mechanical-gear-cover.jpg",
    alt: "Industrial design photograph of mechanical clockwork gears representing digital settings configuration",
    sourceUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-generative-ui-and-automated-layout-engines",
    filename: "why-delete-action-is-a-trash-can-cover.jpg",
    alt: "Desktop metaphor still life illustrating the intuitive affordance and safety net of the trash can icon",
    sourceUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-ai-micro-saas-blueprint",
    filename: "why-luxury-brands-use-so-much-empty-space-cover.jpg",
    alt: "Luxury spatial architecture photograph showing vast negative space signaling prestige and wealth",
    sourceUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-building-custom-gpts-and-specialized-knowledge-bases",
    filename: "why-changing-a-font-changes-brand-personality-cover.jpg",
    alt: "Typographic art direction specimen demonstrating how letterform geometry alters brand personality",
    sourceUrl: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-llm-integration-in-saas-products",
    filename: "why-email-is-a-paper-envelope-icon-cover.jpg",
    alt: "Communication history still life showing the paper envelope as a metaphor for privacy and containment",
    sourceUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-ai-driven-hyper-personalization",
    filename: "why-contrast-makes-designs-impossible-to-ignore-von-restorff-cover.jpg",
    alt: "Minimal conceptual visual demonstrating the Von Restorff isolation effect and visual contrast",
    sourceUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-dark-mode-ui-architecture",
    filename: "psychology-of-dark-mode-oled-black-ui-cover.jpg",
    alt: "Cinematic visual showing luminous syntax and color contrast emerging from true OLED black",
    sourceUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-design-tokens-and-system-architecture",
    filename: "why-we-group-things-together-gestalt-proximity-cover.jpg",
    alt: "Gestalt psychology geometric composition illustrating the law of proximity and visual grouping",
    sourceUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1600&auto=format&fit=crop&q=85",
  },
  {
    docId: "blog-seo-fundamentals-for-creatives",
    filename: "psychology-of-google-search-position-bias-cover.jpg",
    alt: "Conceptual visual hierarchy diagram illustrating search engine position bias and the golden triangle",
    sourceUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600&auto=format&fit=crop&q=85",
  },
];

console.log(`Starting upload and assignment of ${COVERS_DATA.length} real Sanity image assets...`);

let uploadedAssets = [];

for (let i = 0; i < COVERS_DATA.length; i++) {
  const item = COVERS_DATA[i];
  console.log(`[${i + 1}/${COVERS_DATA.length}] Uploading cover for ${item.docId}...`);

  try {
    const res = await fetch(item.sourceUrl);
    if (!res.ok) throw new Error(`HTTP fetch failed with status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await client.assets.upload("image", buffer, {
      filename: item.filename,
      contentType: "image/jpeg",
    });

    console.log(`  ✓ Asset created: ${asset._id} -> ${asset.url}`);

    // Patch the Sanity document with the REAL asset reference
    const patchRes = await client
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

    console.log(`  ✓ Document ${item.docId} patched with real Sanity asset ref!`);

    uploadedAssets.push({
      docId: item.docId,
      assetId: asset._id,
      assetUrl: asset.url,
      alt: item.alt,
      filename: item.filename,
    });
  } catch (err) {
    console.error(`  ✗ Error uploading asset for ${item.docId}:`, err.message);
  }
}

fs.writeFileSync("scratch/uploaded_assets_manifest.json", JSON.stringify(uploadedAssets, null, 2));
console.log(`\n========================================`);
console.log(`All ${uploadedAssets.length} / ${COVERS_DATA.length} cover images uploaded & linked to Sanity documents!`);
console.log(`Manifest saved to scratch/uploaded_assets_manifest.json`);
console.log(`========================================\n`);
