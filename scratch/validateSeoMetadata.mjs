import fs from 'fs';

const filesToTest = [
  'dist/ravan-mammadov/index.html',
  'dist/az/ravan-mammadov/index.html',
  'dist/admin/linkedin/index.html',
  'dist/az/admin/linkedin/index.html',
  'dist/fonts/inter/index.html',
  'dist/az/fonts/inter/index.html',
  'dist/blog/why-eyes-look-at-certain-things-first/index.html',
  'dist/az/blog/gozler-niye-ilk-baxir/index.html',
  'dist/tools/resume-builder/index.html',
  'dist/az/tools/resume-builder/index.html'
];

for (const f of filesToTest) {
  if (!fs.existsSync(f)) {
    console.log('MISSING:', f);
    continue;
  }
  const content = fs.readFileSync(f, 'utf8');
  const title = content.match(/<title>([^<]+)<\/title>/)?.[1];
  const desc = content.match(/name="description" content="([^"]+)"/)?.[1];
  const canonical = content.match(/link rel="canonical" href="([^"]+)"/)?.[1];
  const robots = content.match(/name="robots" content="([^"]+)"/)?.[1];
  const hasHreflangEn = content.includes('hreflang="en"');
  const hasHreflangAz = content.includes('hreflang="az"');
  const hasJsonLd = content.includes('application/ld+json');

  console.log('====================================');
  console.log('FILE:', f);
  console.log('  Title:', title);
  console.log('  Canonical:', canonical);
  console.log('  Robots:', robots);
  console.log('  Hreflang EN/AZ:', hasHreflangEn, hasHreflangAz);
  console.log('  JSON-LD Schema:', hasJsonLd);
}
