import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING PHASE 5.2 - 5.4 BATCH IMPLEMENTATION ===\n');

let allPassed = true;

const checkHtml = (relPath, lang, expectedTitleSubstr, expectedCanonical, expectedSchemaType) => {
  const filePath = path.join('dist', relPath);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Pre-rendered file missing: ${filePath}`);
    allPassed = false;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // Check noindex absence
  if (html.includes('content="noindex')) {
    console.error(`❌ Found unexpected noindex in ${filePath}`);
    allPassed = false;
  } else {
    console.log(`✅ [${lang}] Indexable: ${relPath}`);
  }

  // Check Title
  if (html.includes(expectedTitleSubstr)) {
    console.log(`✅ [${lang}] Title matched: "${expectedTitleSubstr}"`);
  } else {
    console.error(`❌ [${lang}] Title missing/mismatched in ${filePath}`);
    allPassed = false;
  }

  // Check Canonical
  if (html.includes(expectedCanonical)) {
    console.log(`✅ [${lang}] Canonical tag verified: ${expectedCanonical}`);
  } else {
    console.error(`❌ [${lang}] Canonical missing in ${filePath}`);
    allPassed = false;
  }

  // Check reciprocal hreflang
  if (html.includes('hreflang="en"') && html.includes('hreflang="az"')) {
    console.log(`✅ [${lang}] Reciprocal hreflang verified`);
  } else {
    console.error(`❌ [${lang}] Hreflang tags missing in ${filePath}`);
    allPassed = false;
  }

  // Check JSON-LD
  if (expectedSchemaType && (html.includes(`"@type":"${expectedSchemaType}"`) || html.includes(`"@type": "${expectedSchemaType}"`))) {
    console.log(`✅ [${lang}] ${expectedSchemaType} JSON-LD schema verified`);
  } else if (expectedSchemaType) {
    console.error(`❌ [${lang}] Schema ${expectedSchemaType} missing in ${filePath}`);
    allPassed = false;
  }
};

console.log('--- 1. PHASE 5.2 (APCA CONTRAST GUIDE) ---');
checkHtml(
  'blog/apca-vs-wcag-contrast-accessibility-guide/index.html',
  'EN',
  'APCA vs. WCAG 2.1',
  'https://www.rvan.me/blog/apca-vs-wcag-contrast-accessibility-guide',
  'BlogPosting'
);
checkHtml(
  'az/blog/apca-vs-wcag-contrast-accessibility-guide/index.html',
  'AZ',
  'APCA və WCAG 2.1',
  'https://www.rvan.me/az/blog/apca-vs-wcag-contrast-accessibility-guide',
  'BlogPosting'
);

console.log('\n--- 2. PHASE 5.3 (COGNITIVE COPYWRITING GUIDE) ---');
checkHtml(
  'blog/guide-cognitive-conversion-copywriting/index.html',
  'EN',
  'Cognitive Conversion Copywriting',
  'https://www.rvan.me/blog/guide-cognitive-conversion-copywriting',
  'BlogPosting'
);
checkHtml(
  'az/blog/guide-cognitive-conversion-copywriting/index.html',
  'AZ',
  'Koqnitiv Konversiya Kopiraytinqi',
  'https://www.rvan.me/az/blog/guide-cognitive-conversion-copywriting',
  'BlogPosting'
);

console.log('\n--- 3. PHASE 5.4 (VISUAL HIERARCHY FRAMEWORK) ---');
checkHtml(
  'blog/visual-hierarchy-framework-web-interfaces/index.html',
  'EN',
  'Visual Hierarchy Framework',
  'https://www.rvan.me/blog/visual-hierarchy-framework-web-interfaces',
  'BlogPosting'
);
checkHtml(
  'az/blog/visual-hierarchy-framework-web-interfaces/index.html',
  'AZ',
  'Vizual İyerarxiya Çərçivəsi',
  'https://www.rvan.me/az/blog/visual-hierarchy-framework-web-interfaces',
  'BlogPosting'
);

console.log('\n--- 4. CORE TOPIC HUBS & TOOLS ---');
checkHtml('topics/accessibility/index.html', 'EN', 'Accessibility', 'https://www.rvan.me/topics/accessibility', 'WebPage');
checkHtml('topics/marketing-psychology/index.html', 'EN', 'Marketing Psychology', 'https://www.rvan.me/topics/marketing-psychology', 'WebPage');
checkHtml('topics/design-psychology/index.html', 'EN', 'Design Psychology', 'https://www.rvan.me/topics/design-psychology', 'WebPage');
checkHtml('topics/typography/index.html', 'EN', 'Typography', 'https://www.rvan.me/topics/typography', 'WebPage');

console.log('\n--- 5. AUTHORITATIVE SITEMAP COVERAGE ---');
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
const urls = [
  'https://www.rvan.me/blog/guide-responsive-fluid-typography-css-clamp',
  'https://www.rvan.me/az/blog/guide-responsive-fluid-typography-css-clamp',
  'https://www.rvan.me/blog/apca-vs-wcag-contrast-accessibility-guide',
  'https://www.rvan.me/az/blog/apca-vs-wcag-contrast-accessibility-guide',
  'https://www.rvan.me/blog/guide-cognitive-conversion-copywriting',
  'https://www.rvan.me/az/blog/guide-cognitive-conversion-copywriting',
  'https://www.rvan.me/blog/visual-hierarchy-framework-web-interfaces',
  'https://www.rvan.me/az/blog/visual-hierarchy-framework-web-interfaces',
  'https://www.rvan.me/tools/contrast-matrix',
  'https://www.rvan.me/tools/persuasion-analyzer',
  'https://www.rvan.me/tools/typography-scale',
  'https://www.rvan.me/topics/accessibility',
  'https://www.rvan.me/topics/marketing-psychology',
  'https://www.rvan.me/topics/design-psychology',
  'https://www.rvan.me/topics/typography'
];

urls.forEach(u => {
  if (sitemap.includes(u)) {
    console.log(`✅ Sitemap contains: ${u}`);
  } else {
    console.error(`❌ Sitemap missing: ${u}`);
    allPassed = false;
  }
});

console.log('\n========================================');
console.log(allPassed ? '🎉 ALL PHASE 5 BATCH VALIDATIONS PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================');
