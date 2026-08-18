import fs from 'fs';

const xml = fs.readFileSync('dist/sitemap.xml', 'utf8');

// Check an obscure font from Tier 2 (e.g. atomic-age, aurore, etc.)
const sampleTier2Slug = 'atomic-age';
const tier2HtmlPath = 'dist/fonts/' + sampleTier2Slug + '/index.html';

if (fs.existsSync(tier2HtmlPath)) {
  const content = fs.readFileSync(tier2HtmlPath, 'utf8');
  const robots = content.match(/name="robots" content="([^"]+)"/)?.[1];
  console.log('Tier 2 font (Atomic Age) robots meta:', robots);
} else {
  console.log('Tier 2 font file does not exist directly:', tier2HtmlPath);
}

const inSitemap = xml.includes(sampleTier2Slug);
console.log('Is Tier 2 font in sitemap (should be FALSE):', inSitemap);

// Check Tier 1 font in sitemap (e.g. inter)
console.log('Is Tier 1 font (Inter) in sitemap (should be TRUE):', xml.includes('/fonts/inter'));
console.log('Is Tier 1 AZ font (Inter) in sitemap (should be TRUE):', xml.includes('/az/fonts/inter'));
