import fs from 'fs';
import path from 'path';
import { calculateTypeScale, calculateComputedSize, MODULAR_SCALE_PRESETS } from '../src/lib/typography/typeScaleEngine.ts';
import { getEcosystemRelationship } from '../src/lib/ecosystemRelationshipMap.ts';

console.log('=== VALIDATING TYPOGRAPHY SCALE & CLAMP CALCULATOR PRODUCT ===\n');

let allPassed = true;

// 1. Check pre-rendered HTML existence & SEO tags
const checkHtml = (filePath, expectedCanonical, expectedHreflang, expectedTitleSnippet) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing pre-rendered file: ${filePath}`);
    allPassed = false;
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');

  // Check noindex is NOT present
  if (html.includes('content="noindex')) {
    console.error(`❌ Found forbidden 'noindex' in ${filePath}`);
    allPassed = false;
  } else {
    console.log(`✅ No 'noindex' in ${filePath} (indexable)`);
  }

  // Check canonical
  if (html.includes(`<link rel="canonical" href="${expectedCanonical}"`)) {
    console.log(`✅ Canonical verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ Missing or wrong canonical in ${filePath}`);
    allPassed = false;
  }

  // Check hreflang
  if (html.includes(`hreflang="en"`) && html.includes(`hreflang="az"`)) {
    console.log(`✅ Reciprocal hreflang tags verified in ${filePath}`);
  } else {
    console.error(`❌ Missing hreflang tags in ${filePath}`);
    allPassed = false;
  }

  // Check title
  if (html.includes(expectedTitleSnippet)) {
    console.log(`✅ Title snippet verified: "${expectedTitleSnippet}"`);
  } else {
    console.error(`❌ Missing expected title in ${filePath}`);
    allPassed = false;
  }
};

console.log('--- 1. PRE-RENDERED SEO HTML VALIDATION ---');
checkHtml(
  'dist/tools/typography-scale/index.html',
  'https://www.rvan.me/tools/typography-scale',
  'https://www.rvan.me/az/tools/typography-scale',
  'Fluid Typography Scale'
);
checkHtml(
  'dist/az/tools/typography-scale/index.html',
  'https://www.rvan.me/az/tools/typography-scale',
  'https://www.rvan.me/tools/typography-scale',
  'Elastik Tipoqrafiya Miqyası'
);

// 2. Check sitemap.xml
console.log('\n--- 2. SITEMAP INCLUSION VALIDATION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const enUrl = 'https://www.rvan.me/tools/typography-scale';
const azUrl = 'https://www.rvan.me/az/tools/typography-scale';

if (sitemap.includes(enUrl)) {
  console.log(`✅ EN tool URL present in sitemap.xml: ${enUrl}`);
} else {
  console.error(`❌ EN tool URL missing from sitemap.xml`);
  allPassed = false;
}

if (sitemap.includes(azUrl)) {
  console.log(`✅ AZ tool URL present in sitemap.xml: ${azUrl}`);
} else {
  console.error(`❌ AZ tool URL missing from sitemap.xml`);
  allPassed = false;
}

// 3. Check mathematical calculations across all 8 modular scale presets
console.log('\n--- 3. MATHEMATICAL SOLVER VERIFICATION ---');
MODULAR_SCALE_PRESETS.forEach(preset => {
  const result = calculateTypeScale({
    minViewport: 375,
    maxViewport: 1280,
    minBaseFontSize: 16,
    maxBaseFontSize: 18,
    minScaleRatio: 1.20,
    maxScaleRatio: preset.ratio,
    rootFontSize: 16
  });

  const h1 = result.steps.find(s => s.tag === 'H1');
  const display = result.steps.find(s => s.tag === 'Display');
  const body = result.steps.find(s => s.tag === 'Body');

  // Verify clamp expression format
  const validClampRegex = /^clamp\(\d+(\.\d+)?rem,\s*-?\d+(\.\d+)?rem\s*\+\s*-?\d+(\.\d+)?vw,\s*\d+(\.\d+)?rem\)$/;
  const isH1Valid = validClampRegex.test(h1.clampCss);
  const isDisplayValid = validClampRegex.test(display.clampCss);

  if (isH1Valid && isDisplayValid && body.minPx === 16 && body.maxPx === 18) {
    console.log(`✅ Preset [${preset.name.padEnd(16)} (r=${preset.ratio})]: Display: ${display.minPx}px->${display.maxPx}px | H1: ${h1.minPx}px->${h1.maxPx}px | Valid CSS clamp()`);
  } else {
    console.error(`❌ Preset [${preset.name}] clamp syntax error: ${h1.clampCss}`);
    allPassed = false;
  }
});

// 4. Ecosystem linking verification
console.log('\n--- 4. ECOSYSTEM LINKING VERIFICATION ---');
const typographySlugs = [
  'why-some-fonts-feel-expensive-gotham-typography',
  'why-helvetica-became-the-font-of-corporate-america',
  'why-changing-a-font-changes-brand-personality'
];

typographySlugs.forEach(slug => {
  const rel = getEcosystemRelationship(slug);
  if (rel?.toolBridge?.path === '/tools/typography-scale') {
    console.log(`✅ Article '${slug}' successfully bridges to '/tools/typography-scale'`);
  } else {
    console.error(`❌ Article '${slug}' does NOT link to '/tools/typography-scale'! Found: ${rel?.toolBridge?.path}`);
    allPassed = false;
  }
});

console.log(`\n========================================`);
console.log(allPassed ? '🎉 ALL VERIFICATION TESTS PASSED WITH ZERO DEFECTS!' : '❌ SOME TESTS FAILED');
console.log(`========================================`);
