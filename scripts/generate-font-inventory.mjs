import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function generateFontInventory() {
  console.log('Generating comprehensive Font SEO Inventory...');

  const catalogPath = path.join(projectRoot, 'src', 'lib', 'googleFontsCatalog.json');
  const catalogRaw = await fs.promises.readFile(catalogPath, 'utf8');
  const catalog = JSON.parse(catalogRaw);

  const sitemapPath = path.join(projectRoot, 'dist', 'sitemap.xml');
  let sitemapContent = '';
  if (fs.existsSync(sitemapPath)) {
    sitemapContent = await fs.promises.readFile(sitemapPath, 'utf8');
  }

  // Identify Tier 1 indexed set (top 250 + GSC performers)
  const sorted = [...catalog].sort((a, b) =>
    (b.trendingScore || 0) - (a.trendingScore || 0) ||
    (b.stylesCount || 0) - (a.stylesCount || 0)
  );

  const TOP_TIER_COUNT = 250;
  const tier1Set = new Set(sorted.slice(0, TOP_TIER_COUNT).map((f) => f.id));

  const GSC_OPPORTUNITY_SLUGS = [
    "general-sans", "syne", "plus-jakarta-sans", "plus-jakarta-display",
    "montenegrin-gothic-one", "federo", "faustina", "karantina",
    "open-sans", "luckiest-guy", "pacifico", "playfair-display",
    "cormorant-garamond", "league-spartan", "inter", "roboto", "outfit"
  ];

  for (const f of catalog) {
    const s = f.family.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (GSC_OPPORTUNITY_SLUGS.includes(s) || GSC_OPPORTUNITY_SLUGS.includes(f.id)) {
      tier1Set.add(f.id);
    }
  }

  const inventory = [];
  const unsupportedClaimFlags = [];

  for (const font of catalog) {
    const slug = font.family
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const isTier1 = tier1Set.has(font.id);
    const enUrl = `https://blog.rvan.me/fonts/${slug}`;
    const azUrl = `https://blog.rvan.me/az/fonts/${slug}`;

    const stylesCount = font.stylesCount || 1;
    const isVariable = Boolean(font.isVariable);
    const license = font.license || "SIL Open Font License";

    // EN Metadata
    const enTitle = `${font.family} Font Family: Specimen, CSS & Free Download — Rvan.me`;
    const enMetaDescription = `Download ${font.family} font family for free (${license}). Features ${stylesCount} style${stylesCount > 1 ? "s" : ""}${isVariable ? ", variable axes" : ""}, live specimen tester, Fontsource/Google Fonts CSS code snippets, and fluid clamp() scale calculator.`;

    // AZ Metadata
    const azTitle = `${font.family} Şrift Ailəsi: Nümunə, CSS və Pulsuz Yüklə — Rvan.me`;
    const azMetaDescription = `${font.family} şrift ailəsini pulsuz yükləyin (${license === "SIL Open Font License" ? "SIL Açıq Şrift Lisenziyası" : license}). ${stylesCount} şrift çəkisi${isVariable ? ", variativ oxlar" : ""}, canlı nümayiş redaktoru, CSS kodları və elastik clamp() kalkulyatoru ilə.`;

    // Check for any unsupported claims (e.g. fake ratings, star reviews, hallucinated download counts)
    const suspiciousKeywords = ["5-star", "rated 5", "1,000,000 downloads", "best font in the world", "guaranteed #1"];
    for (const kw of suspiciousKeywords) {
      if (enMetaDescription.toLowerCase().includes(kw) || enTitle.toLowerCase().includes(kw)) {
        unsupportedClaimFlags.push({ font: font.family, keyword: kw });
      }
    }

    const enInSitemap = sitemapContent.includes(`<loc>${enUrl}</loc>`);
    const azInSitemap = sitemapContent.includes(`<loc>${azUrl}</loc>`);

    inventory.push({
      id: font.id,
      family: font.family,
      category: font.category || "Sans Serif",
      designer: font.designer || "Open Source Foundry",
      license: license,
      stylesCount: stylesCount,
      isVariable: isVariable,
      trendingScore: font.trendingScore || 0,
      en: {
        url: enUrl,
        path: `/fonts/${slug}`,
        title: enTitle,
        meta_description: enMetaDescription,
        canonical: enUrl,
        hreflang: {
          en: enUrl,
          az: azUrl,
          xDefault: enUrl
        },
        indexability: isTier1 ? "index, follow" : "noindex, follow",
        sitemap_inclusion: enInSitemap,
        links_to_typography_topic: true,
        links_to_typography_scale_tool: true,
        links_to_relevant_articles: true,
      },
      az: {
        url: azUrl,
        path: `/az/fonts/${slug}`,
        title: azTitle,
        meta_description: azMetaDescription,
        canonical: azUrl,
        hreflang: {
          en: enUrl,
          az: azUrl,
          xDefault: enUrl
        },
        indexability: isTier1 ? "index, follow" : "noindex, follow",
        sitemap_inclusion: azInSitemap,
        links_to_typography_topic: true,
        links_to_typography_scale_tool: true,
        links_to_relevant_articles: true,
      }
    });
  }

  const manifest = {
    generated_at: new Date().toISOString(),
    baseline_gsc: {
      period: "Last 3 Months (Pre-optimization baseline)",
      impressions: 9220,
      clicks: 15,
      ctr_percentage: 0.2,
      average_position: 59.0
    },
    total_font_families: catalog.length,
    tier1_indexed_families: inventory.filter(f => f.en.indexability === "index, follow").length,
    tier2_noindexed_families: inventory.filter(f => f.en.indexability === "noindex, follow").length,
    unsupported_claim_count: unsupportedClaimFlags.length,
    unsupported_claim_flags: unsupportedClaimFlags,
    inventory: inventory
  };

  const outputPath = path.join(projectRoot, 'AI', 'FONT_SEO_INVENTORY.json');
  await fs.promises.writeFile(outputPath, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`✅ Generated FONT_SEO_INVENTORY.json with ${inventory.length} font families.`);
  console.log(`   - Tier 1 Indexed: ${manifest.tier1_indexed_families}`);
  console.log(`   - Tier 2 Noindexed: ${manifest.tier2_noindexed_families}`);
  console.log(`   - Unsupported claims detected: ${manifest.unsupported_claim_count}`);
}

generateFontInventory().catch(console.error);
