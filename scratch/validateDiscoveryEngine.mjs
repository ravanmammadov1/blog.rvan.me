import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING PHASE 4 ORGANIC DISCOVERY ENGINE ===\n');

let allPassed = true;

// 1. Check Topic Hub static HTML files
const checkHub = (relPath, lang, expectedCanonical) => {
  const filePath = path.join('dist', relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Pre-rendered Topic Hub file missing: ${filePath}`);
    allPassed = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Verify noindex is NOT present
  if (html.includes('content="noindex')) {
    console.error(`❌ Found 'noindex' in ${filePath}`);
    allPassed = false;
  } else {
    console.log(`✅ ${lang} Hub indexable: ${relPath}`);
  }

  // Check canonical
  if (html.includes(expectedCanonical)) {
    console.log(`✅ ${lang} Canonical verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ ${lang} Canonical tag missing or incorrect in ${filePath}`);
    allPassed = false;
  }

  // Check reciprocal hreflang
  if (html.includes('hreflang="en"') && html.includes('hreflang="az"')) {
    console.log(`✅ ${lang} Reciprocal hreflang tags verified`);
  } else {
    console.error(`❌ ${lang} Hreflang tags missing in ${filePath}`);
    allPassed = false;
  }
};

console.log('--- 1. TOPIC HUBS STATIC HTML PRE-RENDERING ---');
const hubs = ['typography', 'design-psychology', 'marketing-psychology', 'accessibility'];
hubs.forEach(h => {
  checkHub(`topics/${h}/index.html`, 'en', `https://www.rvan.me/topics/${h}`);
  checkHub(`az/topics/${h}/index.html`, 'az', `https://www.rvan.me/az/topics/${h}`);
});
checkHub('topics/index.html', 'en', 'https://www.rvan.me/topics');
checkHub('az/topics/index.html', 'az', 'https://www.rvan.me/az/topics');

// 2. Check Font Detail Resource-to-Tool Bridge
console.log('\n--- 2. RESOURCE TO TOOL BRIDGE CHECK ---');
const fontSrc = fs.readFileSync('src/app/pages/FontDetailPage.tsx', 'utf8');
if (fontSrc.includes('/tools/typography-scale') && fontSrc.includes('Calculate Fluid CSS clamp() Scale')) {
  console.log('✅ FontDetailPage.tsx contains high-intent bridge to /tools/typography-scale');
} else {
  console.error('❌ FontDetailPage.tsx missing typography tool bridge!');
  allPassed = false;
}

// 3. Check Sitemap URL Counts
console.log('\n--- 3. AUTHORITATIVE SITEMAP INCLUSION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const sitemapUrlsToCheck = [
  'https://www.rvan.me/topics',
  'https://www.rvan.me/az/topics',
  'https://www.rvan.me/topics/typography',
  'https://www.rvan.me/az/topics/typography',
  'https://www.rvan.me/topics/design-psychology',
  'https://www.rvan.me/az/topics/design-psychology',
  'https://www.rvan.me/topics/marketing-psychology',
  'https://www.rvan.me/az/topics/marketing-psychology',
  'https://www.rvan.me/topics/accessibility',
  'https://www.rvan.me/az/topics/accessibility',
  'https://www.rvan.me/tools/persuasion-analyzer',
  'https://www.rvan.me/tools/contrast-matrix',
  'https://www.rvan.me/tools/typography-scale'
];

sitemapUrlsToCheck.forEach(u => {
  if (sitemap.includes(u)) {
    console.log(`✅ Sitemap contains: ${u}`);
  } else {
    console.error(`❌ Sitemap missing: ${u}`);
    allPassed = false;
  }
});

// 4. Check Global Search Bundle
console.log('\n--- 4. GLOBAL SEARCH MODAL INTEGRATION ---');
const headerSrc = fs.readFileSync('src/app/components/SiteHeader.tsx', 'utf8');
if (headerSrc.includes('GlobalSearchModal') && headerSrc.includes('handleGlobalKey')) {
  console.log('✅ SiteHeader includes GlobalSearchModal and Cmd+K listener');
} else {
  console.error('❌ SiteHeader missing GlobalSearchModal integration!');
  allPassed = false;
}

console.log('\n========================================');
console.log(allPassed ? '🎉 DISCOVERY ENGINE VALIDATION PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================');
