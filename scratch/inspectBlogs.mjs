import fs from 'fs';
import path from 'path';

const files = ['articles01to10.ts', 'articles11to20.ts', 'articles21to30.ts', 'articles31to39.ts'];
let count = 0;

for (const f of files) {
  const p = path.join('src/lib/blogs', f);
  const content = fs.readFileSync(p, 'utf8');
  
  // Extract individual objects
  const titleMatches = [...content.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
  const titleAzMatches = [...content.matchAll(/title_az:\s*"([^"]+)"/g)].map(m => m[1]);
  const catMatches = [...content.matchAll(/category:\s*"([^"]+)"/g)].map(m => m[1]);
  const slugMatches = [...content.matchAll(/slug:\s*\{\s*_type:\s*"slug",\s*current:\s*"([^"]+)"\s*\}/g)].map(m => m[1]);
  const readTimeMatches = [...content.matchAll(/readTime:\s*"([^"]+)"/g)].map(m => m[1]);

  for (let i = 0; i < titleMatches.length; i++) {
    count++;
    console.log(`${count}. [${catMatches[i] || 'General'}] "${titleMatches[i]}"`);
    console.log(`   Slug: ${slugMatches[i]} | AZ: "${titleAzMatches[i]}" | ReadTime: ${readTimeMatches[i]}`);
  }
}
