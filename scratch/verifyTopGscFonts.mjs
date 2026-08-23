import fs from 'fs';
import path from 'path';

const raw = fs.readFileSync('src/lib/googleFontsCatalog.json', 'utf8');
const catalog = JSON.parse(raw);

const targetSlugs = [
  'general-sans',
  'syne',
  'plus-jakarta-sans',
  'plus-jakarta-display',
  'montenegrin-gothic-one',
  'federo',
  'faustina',
  'karantina',
  'open-sans',
  'luckiest-guy',
  'pacifico',
  'playfair-display',
  'cormorant-garamond',
  'league-spartan'
];

console.log(`Total catalog items: ${catalog.length}`);

for (const target of targetSlugs) {
  const found = catalog.find(f => {
    const slug = f.family.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return slug === target || f.id === target;
  });

  if (found) {
    console.log(`✅ Found: ${target} -> "${found.family}" (Category: ${found.category}, Styles: ${found.stylesCount}, Score: ${found.trendingScore})`);
  } else {
    console.log(`⚠️ Not directly found in catalog: ${target}`);
  }
}
