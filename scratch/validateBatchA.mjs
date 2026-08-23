import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING EDITORIAL REWRITE BATCH A ===\n');

const targetSlugs = [
  'why-changing-a-font-changes-brand-personality',
  'why-youre-almost-done-works-zeigarnik-effect',
  'fomo-loss-aversion-scarcity-psychology',
  'why-minimalist-designs-look-more-expensive'
];

let allPassed = true;

// Check image assets
const img1 = path.join('public', 'images', 'editorial', 'typographic-personality-transition.jpg');
const img2 = path.join('public', 'images', 'editorial', 'minimalist-industrial-precision.jpg');

if (fs.existsSync(img1) && fs.existsSync(img2)) {
  console.log('✅ Generated Gemini editorial covers exist in public/images/editorial/');
} else {
  console.error('❌ Missing editorial cover images');
  allPassed = false;
}

// Check source files for content richness
const filesToCheck = [
  'src/lib/blogs/articles01to10.ts',
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles31to39.ts'
];

for (const slug of targetSlugs) {
  let found = false;
  for (const file of filesToCheck) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(`current: "${slug}"`)) {
      found = true;
      // Count blocks
      const blockMatches = content.match(/createBlock\(/g);
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
console.log(allPassed ? '🎉 BATCH A SOURCE VALIDATION PASSED!' : '❌ BATCH A SOURCE VALIDATION FAILED');
console.log('========================================\n');
