import fs from 'fs';
import path from 'path';

console.log('=== VERIFYING EDITORIAL CONTENT CLEANUP PLAN ===\n');

const planContent = fs.readFileSync('AI/CONTENT_CLEANUP_PLAN.md', 'utf8');
const registryRaw = fs.readFileSync('src/lib/editorialBlogRegistry.ts', 'utf8');

// Load catalog of slugs from registry
const blogFiles = [
  'src/lib/blogs/articleResponsiveTypographyGuide.ts',
  'src/lib/blogs/articleApcaAccessibilityGuide.ts',
  'src/lib/blogs/articleCognitiveCopywritingGuide.ts',
  'src/lib/blogs/articleVisualHierarchyGuide.ts',
  'src/lib/blogs/articles01to10.ts',
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

let enSlugs = 0;
let azSlugs = 0;
const masterSlugs = [];

for (const bf of blogFiles) {
  const content = fs.readFileSync(bf, 'utf8');
  const enMatches = content.matchAll(/slug:\s*\{\s*_type:\s*"slug",\s*current:\s*"([^"]+)"\s*\}/g);
  for (const m of enMatches) {
    masterSlugs.push(m[1]);
    enSlugs++;
  }
  const azMatches = content.matchAll(/slug_az:\s*\{\s*_type:\s*"slug",\s*current:\s*"([^"]+)"\s*\}/g);
  for (const m of azMatches) {
    azSlugs++;
  }
}

console.log(`Discovered ${enSlugs} EN master essays and ${azSlugs} AZ localized versions (Total: ${enSlugs + azSlugs} routes).`);

let missingFromPlan = 0;
for (const slug of masterSlugs) {
  if (!planContent.includes(slug)) {
    console.error(`❌ Slug missing from CONTENT_CLEANUP_PLAN.md: ${slug}`);
    missingFromPlan++;
  }
}

if (missingFromPlan === 0) {
  console.log(`✅ All ${enSlugs} master essays accounted for in CONTENT_CLEANUP_PLAN.md.`);
} else {
  console.error(`❌ Missing slugs: ${missingFromPlan}`);
}
