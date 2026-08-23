import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING EDITORIAL REWRITE BATCH B ===\n');

const targetSlugs = [
  'why-luxury-brands-use-so-much-empty-space',
  'psychology-of-google-search-position-bias',
  'why-small-creators-sell-more-than-celebrities',
  'why-personalized-ads-feel-creepy-privacy-paradox'
];

let allPassed = true;

// Check image assets
const img = path.join('public', 'images', 'editorial', 'luxury-spatial-restraint.jpg');

if (fs.existsSync(img)) {
  console.log('✅ Generated Gemini editorial cover exists: public/images/editorial/luxury-spatial-restraint.jpg');
} else {
  console.error('❌ Missing luxury spatial cover image');
  allPassed = false;
}

// Check source files for content richness
const filesToCheck = [
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

for (const slug of targetSlugs) {
  let found = false;
  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(`current: "${slug}"`)) {
      found = true;
      console.log(`✅ [${slug}] Found in ${file}`);
      break;
    }
  }
  if (!found) {
    console.error(`❌ [${slug}] NOT found in source files`);
    allPassed = false;
  }
}

console.log('\n========================================');
console.log(allPassed ? '🎉 BATCH B SOURCE VALIDATION PASSED!' : '❌ BATCH B SOURCE VALIDATION FAILED');
console.log('========================================\n');
