import fs from 'fs';
import path from 'path';

console.log('=== TARGETED FONT SEO VALIDATION (GSC HIGH OPPORTUNITY) ===\n');

let allPassed = true;

const topFonts = [
  { slug: 'general-sans', family: 'General Sans', family_az: 'General Sans' },
  { slug: 'syne', family: 'Syne', family_az: 'Syne' },
  { slug: 'open-sans', family: 'Open Sans', family_az: 'Open Sans' },
  { slug: 'playfair-display', family: 'Playfair Display', family_az: 'Playfair Display' },
  { slug: 'cormorant-garamond', family: 'Cormorant Garamond', family_az: 'Cormorant Garamond' },
  { slug: 'plus-jakarta-sans', family: 'Plus Jakarta Sans', family_az: 'Plus Jakarta Sans' },
  { slug: 'montenegrin-gothic-one', family: 'Montenegrin Gothic One', family_az: 'Montenegrin Gothic One' }
];

const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');

for (const f of topFonts) {
  const enPath = path.join('dist', 'fonts', f.slug, 'index.html');
  const azPath = path.join('dist', 'az', 'fonts', f.slug, 'index.html');

  // Check EN
  if (fs.existsSync(enPath)) {
    const html = fs.readFileSync(enPath, 'utf8');
    const hasNoIndex = html.includes('content="noindex');
    const hasCanonical = html.includes(`https://www.rvan.me/fonts/${f.slug}`);
    const hasTitle = html.includes(`${f.family} Font Family: Specimen, CSS & Free Download`);
    const hasHreflang = html.includes('hreflang="en"') && html.includes('hreflang="az"');
    const hasSchema = html.includes('@type":"WebPage') && html.includes('@type":"BreadcrumbList');

    if (!hasNoIndex && hasCanonical && hasTitle && hasHreflang && hasSchema) {
      console.log(`✅ [EN] ${f.slug}: Pre-rendered, Indexed, Canonical & Title verified`);
    } else {
      console.error(`❌ [EN] ${f.slug} check failed (noindex=${hasNoIndex}, canonical=${hasCanonical}, title=${hasTitle}, hreflang=${hasHreflang})`);
      allPassed = false;
    }
  } else {
    console.error(`❌ [EN] ${enPath} does not exist`);
    allPassed = false;
  }

  // Check AZ
  if (fs.existsSync(azPath)) {
    const html = fs.readFileSync(azPath, 'utf8');
    const hasNoIndex = html.includes('content="noindex');
    const hasCanonical = html.includes(`https://www.rvan.me/az/fonts/${f.slug}`);
    const hasTitle = html.includes(`${f.family_az} Şrift Ailəsi: Nümunə, CSS və Pulsuz Yüklə`);
    const hasHreflang = html.includes('hreflang="en"') && html.includes('hreflang="az"');

    if (!hasNoIndex && hasCanonical && hasTitle && hasHreflang) {
      console.log(`✅ [AZ] ${f.slug}: Pre-rendered, Indexed, Canonical & Title verified`);
    } else {
      console.error(`❌ [AZ] ${f.slug} check failed (noindex=${hasNoIndex}, canonical=${hasCanonical}, title=${hasTitle})`);
      allPassed = false;
    }
  } else {
    console.error(`❌ [AZ] ${azPath} does not exist`);
    allPassed = false;
  }

  // Check Sitemap
  const enUrl = `https://www.rvan.me/fonts/${f.slug}`;
  const azUrl = `https://www.rvan.me/az/fonts/${f.slug}`;
  if (sitemap.includes(enUrl) && sitemap.includes(azUrl)) {
    console.log(`✅ [SITEMAP] ${f.slug} (EN & AZ) confirmed in sitemap.xml`);
  } else {
    console.error(`❌ [SITEMAP] ${f.slug} missing from sitemap.xml`);
    allPassed = false;
  }
  console.log('');
}

console.log('========================================');
console.log(allPassed ? '🎉 ALL FONT SEO VALIDATIONS PASSED!' : '❌ FONT SEO VALIDATION FAILED');
console.log('========================================');
