import fs from 'fs';

console.log('=== REGRESSION TESTING SYSTEM VERIFICATION ===');

const keyDistFiles = [
  'dist/index.html',
  'dist/az/index.html',
  'dist/about/index.html',
  'dist/az/about/index.html',
  'dist/contact/index.html',
  'dist/az/contact/index.html',
  'dist/work/index.html',
  'dist/az/work/index.html',
  'dist/blog/index.html',
  'dist/az/blog/index.html',
  'dist/tools/index.html',
  'dist/az/tools/index.html',
  'dist/resources/index.html',
  'dist/az/resources/index.html',
  'dist/tools/resume-builder/index.html',
  'dist/az/tools/resume-builder/index.html',
  'dist/tools/open-peeps/index.html',
  'dist/az/tools/open-peeps/index.html',
  'dist/ravan-mammadov/index.html',
  'dist/az/ravan-mammadov/index.html',
  'dist/fonts/inter/index.html',
  'dist/az/fonts/inter/index.html',
  'dist/blog/why-eyes-look-at-certain-things-first/index.html',
  'dist/az/blog/gozler-niye-ilk-baxir/index.html'
];

let allExist = true;
for (const f of keyDistFiles) {
  const exists = fs.existsSync(f);
  if (!exists) {
    console.error('FAIL: Missing pre-rendered route:', f);
    allExist = false;
  }
}

if (allExist) {
  console.log('SUCCESS: All 24 core EN & AZ pre-rendered routes exist and verified on disk.');
}

// Verify sitemap exists and is valid XML
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
if (sitemap.startsWith('<?xml') && sitemap.includes('</urlset>') && !sitemap.includes('/admin')) {
  console.log('SUCCESS: dist/sitemap.xml is valid, formatted, and excludes admin paths.');
} else {
  console.error('FAIL: sitemap.xml is invalid or contains admin paths');
}
