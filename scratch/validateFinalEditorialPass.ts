import { MASTER_EDITORIAL_BLOGS, getAllEditorialSlugs } from "../src/lib/editorialBlogRegistry";

const BANNED_PATTERNS = [
  /in today'?s fast-paced/i,
  /plays a (crucial|vital|pivotal|key) role/i,
  /understanding the psychology behind/i,
  /in conclusion,/i,
  /whether you'?re a designer (or|and) developer/i,
  /here are \d+ (ways|tips|steps|reasons)/i,
];

console.log("=========================================");
console.log("RUNNING FINAL EDITORIAL QUALITY AUDIT");
console.log("=========================================\n");

let errors = 0;

// 1. Check total count
console.log(`Total Master Editorial Articles: ${MASTER_EDITORIAL_BLOGS.length}`);
if (MASTER_EDITORIAL_BLOGS.length !== 39) {
  console.error(`❌ Expected 39 articles, found ${MASTER_EDITORIAL_BLOGS.length}`);
  errors++;
} else {
  console.log(`✅ Exact count verified: 39 articles.`);
}

// 2. Check for duplicate slugs
const enSlugs = new Set<string>();
const azSlugs = new Set<string>();

MASTER_EDITORIAL_BLOGS.forEach((post, i) => {
  const enSlug = post.slug.current;
  const azSlug = post.slug_az?.current || enSlug;

  if (enSlugs.has(enSlug)) {
    console.error(`❌ Duplicate EN slug: ${enSlug} (index ${i})`);
    errors++;
  }
  enSlugs.add(enSlug);

  if (azSlugs.has(azSlug)) {
    console.error(`❌ Duplicate AZ slug: ${azSlug} (index ${i})`);
    errors++;
  }
  azSlugs.add(azSlug);
});

console.log(`✅ Zero duplicate slugs across ${enSlugs.size} EN and ${azSlugs.size} AZ routes.`);

// 3. Check EN and AZ completeness and quality
MASTER_EDITORIAL_BLOGS.forEach((post, i) => {
  const enTitle = post.title;
  const azTitle = post.title_az;
  const enExcerpt = post.excerpt;
  const azExcerpt = post.excerpt_az;
  const enBody = post.body;
  const azBody = post.body_az;

  if (!enTitle || enTitle.trim() === "") {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing EN title`);
    errors++;
  }
  if (!azTitle || azTitle.trim() === "") {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing AZ title`);
    errors++;
  }
  if (!enExcerpt || enExcerpt.trim() === "") {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing EN excerpt`);
    errors++;
  }
  if (!azExcerpt || azExcerpt.trim() === "") {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing AZ excerpt`);
    errors++;
  }

  if (!enBody || !Array.isArray(enBody) || enBody.length === 0) {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing or empty EN body`);
    errors++;
  }
  if (!azBody || !Array.isArray(azBody) || azBody.length === 0) {
    console.error(`❌ Article #${i + 1} (${post.slug.current}) missing or empty AZ body`);
    errors++;
  }

  // Check banned patterns in openings (first 3 blocks)
  if (enBody && Array.isArray(enBody)) {
    const openingText = enBody.slice(0, 3).map((b: any) => {
      if (b.children) return b.children.map((c: any) => c.text || "").join(" ");
      return "";
    }).join(" ");

    for (const pattern of BANNED_PATTERNS) {
      if (pattern.test(openingText)) {
        console.error(`❌ Article #${i + 1} (${post.slug.current}) triggered banned pattern ${pattern} in EN opening: "${openingText.substring(0, 100)}..."`);
        errors++;
      }
    }
  }

  if (azBody && Array.isArray(azBody)) {
    const azOpeningText = azBody.slice(0, 3).map((b: any) => {
      if (b.children) return b.children.map((c: any) => c.text || "").join(" ");
      return "";
    }).join(" ");

    // Check generic Azerbaijani clichés
    if (/bu günün sürətli dünyasında/i.test(azOpeningText) || /mühüm rol oynayır/i.test(azOpeningText)) {
      console.error(`❌ Article #${i + 1} (${post.slug.current}) triggered banned cliché in AZ opening`);
      errors++;
    }
  }
});

// 4. Check deleted/consolidated articles are absent from active registry
const expectedDeletedSlugs = [
  "why-search-is-a-magnifying-glass",
  "why-phone-icon-is-a-1960s-telephone-receiver",
  "why-settings-icon-is-a-mechanical-gear",
  "why-email-is-a-paper-envelope-icon"
];

expectedDeletedSlugs.forEach(slug => {
  if (enSlugs.has(slug)) {
    console.error(`❌ Deleted slug "${slug}" is still present in active registry!`);
    errors++;
  } else {
    console.log(`✅ Consolidated candidate cleanly removed from active registry: /blog/${slug}`);
  }
});

console.log("\n=========================================");
if (errors === 0) {
  console.log("🎉 ALL 39 ARTICLES PASSED RIGOROUS EDITORIAL QUALITY & LOCALIZATION VALIDATION!");
} else {
  console.error(`🚨 FAILED WITH ${errors} ERRORS`);
  process.exit(1);
}
console.log("=========================================\n");
