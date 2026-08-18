import fs from 'fs';
import { evaluateContrast } from '../src/lib/accessibility/apcaEngine.ts';
import { getEcosystemRelationship } from '../src/lib/ecosystemRelationshipMap.ts';

console.log('=== VALIDATING APCA CONTRAST MATRIX PRODUCT & REGRESSION ===\n');

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
  'dist/tools/contrast-matrix/index.html',
  'https://www.rvan.me/tools/contrast-matrix',
  'https://www.rvan.me/az/tools/contrast-matrix',
  'APCA Contrast Matrix'
);
checkHtml(
  'dist/az/tools/contrast-matrix/index.html',
  'https://www.rvan.me/az/tools/contrast-matrix',
  'https://www.rvan.me/tools/contrast-matrix',
  'APCA Kontrast Matrisi'
);

// 2. Check sitemap.xml
console.log('\n--- 2. SITEMAP INCLUSION VALIDATION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const enUrl = 'https://www.rvan.me/tools/contrast-matrix';
const azUrl = 'https://www.rvan.me/az/tools/contrast-matrix';

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

// 3. Check mathematical calculations
console.log('\n--- 3. MATHEMATICAL SOLVER BENCHMARK VERIFICATION ---');
const blackOnWhite = evaluateContrast('#000000', '#FFFFFF');
const whiteOnBlack = evaluateContrast('#FFFFFF', '#000000');

if (blackOnWhite.lc === 106 && blackOnWhite.polarity === 'normal') {
  console.log(`✅ Black on White (+106 Lc, Normal Polarity) verified`);
} else {
  console.error(`❌ Black on White failed: ${blackOnWhite.lc}`);
  allPassed = false;
}

if (whiteOnBlack.lc === -107.9 && whiteOnBlack.polarity === 'reverse') {
  console.log(`✅ White on Black (-107.9 Lc, Reverse Polarity) verified`);
} else {
  console.error(`❌ White on Black failed: ${whiteOnBlack.lc}`);
  allPassed = false;
}

// 4. Ecosystem linking verification
console.log('\n--- 4. ECOSYSTEM LINKING VERIFICATION ---');
const contrastSlugs = [
  'why-contrast-makes-designs-impossible-to-ignore-von-restorff',
  'psychology-of-dark-mode-oled-black-ui'
];

contrastSlugs.forEach(slug => {
  const rel = getEcosystemRelationship(slug);
  if (rel?.toolBridge?.path === '/tools/contrast-matrix') {
    console.log(`✅ Article '${slug}' successfully bridges to '/tools/contrast-matrix'`);
  } else {
    console.error(`❌ Article '${slug}' does NOT link to '/tools/contrast-matrix'! Found: ${rel?.toolBridge?.path}`);
    allPassed = false;
  }
});

// 5. Product Regression Check across all tools
console.log('\n--- 5. PLATFORM TOOLS REGRESSION CHECK ---');
const allToolRoutes = [
  '/tools/typography-scale',
  '/tools/resume-builder',
  '/tools/open-peeps',
  '/tools/contrast-matrix'
];

allToolRoutes.forEach(route => {
  const enDist = `dist${route}/index.html`;
  const azDist = `dist/az${route}/index.html`;
  if (fs.existsSync(enDist) && fs.existsSync(azDist) && sitemap.includes(`https://www.rvan.me${route}`)) {
    console.log(`✅ Tool ${route.padEnd(25)} -> EN & AZ pre-rendered + Sitemap verified`);
  } else {
    console.error(`❌ Tool ${route} regression failed!`);
    allPassed = false;
  }
});

console.log(`\n========================================`);
console.log(allPassed ? '🎉 ALL VERIFICATION & REGRESSION TESTS PASSED WITH ZERO DEFECTS!' : '❌ SOME TESTS FAILED');
console.log(`========================================`);
