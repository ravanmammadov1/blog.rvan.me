import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING MARKETING & PERSUASION ANALYZER PRODUCT ===\n');

let allPassed = true;

// 1. Check Pre-rendered HTML files
const checkPage = (filePath, lang, expectedCanonical) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Pre-rendered HTML file missing: ${filePath}`);
    allPassed = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Check noindex
  if (html.includes('content="noindex')) {
    console.error(`❌ Found 'noindex' in ${filePath}`);
    allPassed = false;
  } else {
    console.log(`✅ ${lang} Pre-rendered page is indexable: ${filePath}`);
  }

  // Check canonical
  if (html.includes(expectedCanonical)) {
    console.log(`✅ ${lang} Canonical tag verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ ${lang} Canonical tag missing or incorrect in ${filePath}`);
    allPassed = false;
  }

  // Check hreflang
  if (html.includes('hreflang="en"') && html.includes('hreflang="az"')) {
    console.log(`✅ ${lang} Reciprocal hreflang tags verified`);
  } else {
    console.error(`❌ ${lang} Hreflang tags missing in ${filePath}`);
    allPassed = false;
  }

  // Check title
  if (html.includes('<title>') && !html.includes('undefined')) {
    console.log(`✅ ${lang} Valid page title found`);
  } else {
    console.error(`❌ ${lang} Title invalid or contains undefined in ${filePath}`);
    allPassed = false;
  }
};

console.log('--- 1. PRE-RENDERED STATIC HTML INTEGRITY ---');
checkPage('dist/tools/persuasion-analyzer/index.html', 'en', 'https://www.rvan.me/tools/persuasion-analyzer');
checkPage('dist/az/tools/persuasion-analyzer/index.html', 'az', 'https://www.rvan.me/az/tools/persuasion-analyzer');

// 2. Check Sitemap inclusion
console.log('\n--- 2. AUTHORITATIVE SITEMAP INCLUSION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');

const sitemapUrls = [
  'https://www.rvan.me/tools/persuasion-analyzer',
  'https://www.rvan.me/az/tools/persuasion-analyzer',
  'https://www.rvan.me/tools/contrast-matrix',
  'https://www.rvan.me/az/tools/contrast-matrix',
  'https://www.rvan.me/tools/typography-scale',
  'https://www.rvan.me/az/tools/typography-scale',
  'https://www.rvan.me/blog',
  'https://www.rvan.me/az/blog'
];

sitemapUrls.forEach(u => {
  if (sitemap.includes(u)) {
    console.log(`✅ Sitemap contains: ${u}`);
  } else {
    console.error(`❌ Missing from sitemap: ${u}`);
    allPassed = false;
  }
});

// 3. Check JavaScript Bundle Split
console.log('\n--- 3. BUNDLE CHUNK ISOLATION ---');
const assets = fs.readdirSync('dist/assets');
const persuasionChunk = assets.find(a => a.startsWith('PersuasionAnalyzer-') && a.endsWith('.js'));
if (persuasionChunk) {
  const size = fs.statSync(path.join('dist/assets', persuasionChunk)).size;
  console.log(`✅ PersuasionAnalyzer chunk created: ${persuasionChunk} (${(size / 1024).toFixed(2)} KB)`);
} else {
  console.error('❌ PersuasionAnalyzer chunk not found in dist/assets!');
  allPassed = false;
}

console.log('\n========================================');
console.log(allPassed ? '🎉 PERSUASION PRODUCT VALIDATION PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================');
