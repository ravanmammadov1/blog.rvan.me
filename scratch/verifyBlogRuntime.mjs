import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING BLOG ARCHIVE & RUNTIME INTEGRATION ===\n');

let allPassed = true;

// 1. Check EN & AZ Blog Pre-rendered HTML
const checkBlogHtml = (filePath, lang) => {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    allPassed = false;
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');

  // Verify SEO metadata
  if (html.includes('content="noindex')) {
    console.error(`❌ Found 'noindex' in ${filePath}`);
    allPassed = false;
  } else {
    console.log(`✅ ${lang} Blog is indexable (no noindex tag)`);
  }

  // Canonical tag check
  const expectedCanonical = lang === 'az' ? 'https://www.rvan.me/az/blog' : 'https://www.rvan.me/blog';
  if (html.includes(expectedCanonical)) {
    console.log(`✅ ${lang} Canonical URL verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ ${lang} Canonical URL missing or incorrect in ${filePath}`);
    allPassed = false;
  }

  // Hreflang tag check
  if (html.includes('hreflang="en"') && html.includes('hreflang="az"')) {
    console.log(`✅ ${lang} Reciprocal hreflang tags verified`);
  } else {
    console.error(`❌ ${lang} Hreflang tags missing`);
    allPassed = false;
  }
};

console.log('--- 1. BLOG PRE-RENDERED HTML CHECK ---');
checkBlogHtml('dist/blog/index.html', 'en');
checkBlogHtml('dist/az/blog/index.html', 'az');

// 2. Check BlogArchive JS chunk dependencies
console.log('\n--- 2. BLOG BUNDLE ISOLATION & LIGHTWEIGHT PROMOTION CHECK ---');
const assets = fs.readdirSync('dist/assets');
const blogChunk = assets.find(a => a.startsWith('BlogArchive-') && a.endsWith('.js'));

if (!blogChunk) {
  console.error('❌ BlogArchive chunk not found in dist/assets!');
  allPassed = false;
} else {
  const chunkContent = fs.readFileSync(path.join('dist/assets', blogChunk), 'utf8');
  console.log(`✅ BlogArchive chunk found: ${blogChunk} (${(chunkContent.length / 1024).toFixed(2)} KB)`);

  // Verify that ApcaContrastCalculator is NOT bundled into BlogArchive
  if (chunkContent.includes('calcAPCA') || chunkContent.includes('ApcaContrastCalculator')) {
    console.error('❌ Heavy APCA calculator is bundled into BlogArchive!');
    allPassed = false;
  } else {
    console.log('✅ APCA heavy engine is NOT bundled into BlogArchive (lightweight promo verified)');
  }

  // Verify that Three.js is NOT imported into BlogArchive
  if (chunkContent.includes('three-vendor') || chunkContent.includes('WebGLRenderer')) {
    console.error('❌ Three.js is bundled into BlogArchive!');
    allPassed = false;
  } else {
    console.log('✅ Three.js / WebGL is NOT imported into BlogArchive (isolated)');
  }
}

// 3. Check All Tool and Blog routes in sitemap.xml
console.log('\n--- 3. SITEMAP VERIFICATION ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const routesToCheck = [
  'https://www.rvan.me/blog',
  'https://www.rvan.me/az/blog',
  'https://www.rvan.me/tools/contrast-matrix',
  'https://www.rvan.me/az/tools/contrast-matrix',
  'https://www.rvan.me/tools/typography-scale',
  'https://www.rvan.me/az/tools/typography-scale'
];

routesToCheck.forEach(url => {
  if (sitemap.includes(url)) {
    console.log(`✅ URL in sitemap: ${url}`);
  } else {
    console.error(`❌ URL missing from sitemap: ${url}`);
    allPassed = false;
  }
});

console.log('\n========================================');
console.log(allPassed ? '🎉 BLOG RUNTIME & BUNDLE VERIFICATION PASSED!' : '❌ VERIFICATION FAILED');
console.log('========================================');
