import fs from 'fs';

console.log('=== VALIDATING PHASE 5.1 PILLAR GUIDE ===\n');

let allPassed = true;

const checkFile = (relPath, lang, expectedTitle, expectedCanonical) => {
  if (!fs.existsSync(relPath)) {
    console.error(`❌ Pre-rendered file missing: ${relPath}`);
    allPassed = false;
    return;
  }
  const html = fs.readFileSync(relPath, 'utf8');

  // Verify indexable
  if (html.includes('content="noindex')) {
    console.error(`❌ Unexpected noindex in ${relPath}`);
    allPassed = false;
  } else {
    console.log(`✅ ${lang} File is indexable: ${relPath}`);
  }

  // Verify Title
  if (html.includes(expectedTitle)) {
    console.log(`✅ ${lang} Title verified: "${expectedTitle}"`);
  } else {
    console.error(`❌ ${lang} Title missing in ${relPath}`);
    allPassed = false;
  }

  // Verify Canonical
  if (html.includes(expectedCanonical)) {
    console.log(`✅ ${lang} Canonical tag verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ ${lang} Canonical tag mismatch in ${relPath}`);
    allPassed = false;
  }

  // Verify Hreflang
  if (html.includes('hreflang="en"') && html.includes('hreflang="az"')) {
    console.log(`✅ ${lang} Reciprocal hreflang tags present`);
  } else {
    console.error(`❌ ${lang} Hreflang tags missing in ${relPath}`);
    allPassed = false;
  }

  // Verify JSON-LD BlogPosting schema
  if (html.includes('"@type":"BlogPosting"') || html.includes('"@type": "BlogPosting"')) {
    console.log(`✅ ${lang} BlogPosting JSON-LD schema validated`);
  } else {
    console.error(`❌ ${lang} JSON-LD BlogPosting schema missing in ${relPath}`);
    allPassed = false;
  }
};

console.log('--- 1. PRE-RENDERED STATIC HTML VERIFICATION ---');
checkFile(
  'dist/blog/guide-responsive-fluid-typography-css-clamp/index.html',
  'EN',
  'Complete Guide to Responsive Fluid Typography with CSS clamp()',
  'https://www.rvan.me/blog/guide-responsive-fluid-typography-css-clamp'
);

checkFile(
  'dist/az/blog/guide-responsive-fluid-typography-css-clamp/index.html',
  'AZ (canonical)',
  'CSS clamp() ilə Responsiv Elastik Tipoqrafiyanın Tam Bələdçisi',
  'https://www.rvan.me/az/blog/guide-responsive-fluid-typography-css-clamp'
);

// 2. Check Sitemap
console.log('\n--- 2. AUTHORITATIVE SITEMAP VERIFICATION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const enUrl = 'https://www.rvan.me/blog/guide-responsive-fluid-typography-css-clamp';
const azUrl = 'https://www.rvan.me/az/blog/guide-responsive-fluid-typography-css-clamp';

if (sitemap.includes(enUrl)) {
  console.log(`✅ EN Guide in sitemap: ${enUrl}`);
} else {
  console.error(`❌ EN Guide missing from sitemap: ${enUrl}`);
  allPassed = false;
}

if (sitemap.includes(azUrl)) {
  console.log(`✅ AZ Guide in sitemap: ${azUrl}`);
} else {
  console.error(`❌ AZ Guide missing from sitemap: ${azUrl}`);
  allPassed = false;
}

console.log('\n========================================');
console.log(allPassed ? '🎉 PILLAR GUIDE VALIDATION PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================');
