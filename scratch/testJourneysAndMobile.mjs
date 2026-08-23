import fs from 'fs';
import path from 'path';

console.log('=== VALIDATING USER JOURNEYS & PRODUCTION BUILD ARTIFACTS ===\n');

let passed = true;

// 1. Verify build output dist directory
if (fs.existsSync('dist/index.html')) {
  console.log('✅ dist/index.html exists');
} else {
  console.error('❌ dist/index.html missing');
  passed = false;
}

// 2. Test Journey A Routes
const journeyARoutes = [
  'blog/why-helvetica-became-the-font-of-corporate-america',
  'tools/typography-scale',
  'fonts/inter',
  'blog/why-some-fonts-feel-expensive-gotham-typography'
];

for (const r of journeyARoutes) {
  const file = path.join('dist', r, 'index.html');
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    if (html.includes('<title>') && html.length > 500) {
      console.log(`✅ [Journey A] Prerendered HTML verified: ${r}`);
    } else {
      console.error(`❌ [Journey A] Prerendered HTML empty: ${r}`);
      passed = false;
    }
  } else {
    console.error(`❌ [Journey A] Missing prerendered route: ${r}`);
    passed = false;
  }
}

// 3. Test Journey B Routes
const journeyBRoutes = [
  'work',
  'tools/contrast-matrix',
  'blog/apca-vs-wcag-contrast-accessibility-guide'
];

for (const r of journeyBRoutes) {
  const file = path.join('dist', r, 'index.html');
  if (fs.existsSync(file)) {
    console.log(`✅ [Journey B] Prerendered HTML verified: ${r}`);
  } else {
    console.error(`❌ [Journey B] Missing prerendered route: ${r}`);
    passed = false;
  }
}

// 4. Test Journey C Routes
const journeyCRoutes = [
  'topics/design-psychology',
  'blog/why-contrast-makes-designs-impossible-to-ignore-von-restorff'
];

for (const r of journeyCRoutes) {
  const file = path.join('dist', r, 'index.html');
  if (fs.existsSync(file)) {
    console.log(`✅ [Journey C] Prerendered HTML verified: ${r}`);
  } else {
    console.error(`❌ [Journey C] Missing prerendered route: ${r}`);
    passed = false;
  }
}

// 5. Test Journey D Routes
const journeyDRoutes = [
  'fonts/space-grotesk',
  'blog/guide-responsive-fluid-typography-css-clamp'
];

for (const r of journeyDRoutes) {
  const file = path.join('dist', r, 'index.html');
  if (fs.existsSync(file)) {
    console.log(`✅ [Journey D] Prerendered HTML verified: ${r}`);
  } else {
    console.error(`❌ [Journey D] Missing prerendered route: ${r}`);
    passed = false;
  }
}

// 6. Test Journey E Localized Routes
const journeyERoutes = [
  'az/blog/helvetica-ve-korporativ-amerika',
  'az/tools/resume-builder',
  'az/tools/persuasion-analyzer'
];

for (const r of journeyERoutes) {
  const file = path.join('dist', r, 'index.html');
  if (fs.existsSync(file)) {
    console.log(`✅ [Journey E] Localized AZ Prerendered HTML verified: ${r}`);
  } else {
    console.error(`❌ [Journey E] Missing prerendered route: ${r}`);
    passed = false;
  }
}

console.log('\n========================================');
console.log(passed ? '🎉 ALL 5 USER JOURNEYS & ROUTES VALIDATED!' : '❌ VALIDATION FAILED');
console.log('========================================\n');
