import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING EDITORIAL REWRITE BATCH C & CONSOLIDATION ===\n');

let allPassed = true;

// 1. Check generated cover image
const img = path.join('public', 'images', 'editorial', 'von-restorff-visual-salience.jpg');
if (fs.existsSync(img)) {
  console.log('✅ Generated Gemini editorial cover exists: public/images/editorial/von-restorff-visual-salience.jpg');
} else {
  console.error('❌ Missing Von Restorff cover image');
  allPassed = false;
}

// 2. Check that the 3 rewritten articles exist in source files
const rewrittenSlugs = [
  'why-helvetica-became-the-font-of-corporate-america',
  'why-contrast-makes-designs-impossible-to-ignore-von-restorff',
  'why-we-group-things-together-gestalt-proximity'
];

const blogFiles = [
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

for (const slug of rewrittenSlugs) {
  let found = false;
  for (const bf of blogFiles) {
    const content = fs.readFileSync(bf, 'utf8');
    if (content.includes(`current: "${slug}"`)) {
      found = true;
      console.log(`✅ [Rewritten Article] "${slug}" found in ${bf}`);
      break;
    }
  }
  if (!found) {
    console.error(`❌ [Rewritten Article] "${slug}" NOT found!`);
    allPassed = false;
  }
}

// 3. Check that the 4 deleted articles do NOT exist in src/lib/blogs/
const deletedSlugs = [
  'why-search-is-a-magnifying-glass',
  'why-phone-icon-is-a-1960s-telephone-receiver',
  'why-settings-icon-is-a-mechanical-gear',
  'why-email-is-a-paper-envelope-icon'
];

for (const slug of deletedSlugs) {
  let found = false;
  for (const bf of blogFiles) {
    const content = fs.readFileSync(bf, 'utf8');
    if (content.includes(`current: "${slug}"`)) {
      found = true;
      console.error(`❌ [Deleted Article] "${slug}" was still found in ${bf}`);
      allPassed = false;
      break;
    }
  }
  if (!found) {
    console.log(`✅ [Deleted Article] "${slug}" successfully purged from blog source files`);
  }
}

// 4. Check 301 redirects in vercel.json
const vercelContent = fs.readFileSync('vercel.json', 'utf8');
const vercelJson = JSON.parse(vercelContent);
const redirects = vercelJson.redirects || [];

for (const slug of deletedSlugs) {
  const enRedirect = redirects.find(r => r.source === `/blog/${slug}`);
  if (enRedirect && enRedirect.permanent === true) {
    console.log(`✅ [301 Redirect EN] /blog/${slug} -> ${enRedirect.destination}`);
  } else {
    console.error(`❌ [301 Redirect EN] Missing redirect for /blog/${slug}`);
    allPassed = false;
  }
}

console.log('\n========================================');
console.log(allPassed ? '🎉 BATCH C & CONSOLIDATION VALIDATION PASSED!' : '❌ VALIDATION FAILED');
console.log('========================================\n');
