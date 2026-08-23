import fs from 'fs';
import path from 'path';

const files = [
  'src/lib/blogs/articles01to10.ts',
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

let allArticles = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match slug: { current: "..." }, title: "...", category: "...", tags: [...]
  const slugMatches = [...content.matchAll(/current:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const titleMatches = [...content.matchAll(/title:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const categoryMatches = [...content.matchAll(/category:\s*["']([^"']+)["']/g)].map(m => m[1]);
  
  // Also extract block chunks
  const blocks = content.split(/{\s*_id:\s*["']/);
  blocks.shift(); // remove header
  
  for (const block of blocks) {
    const slug = block.match(/current:\s*["']([^"']+)["']/)?.[1] || '';
    const title = block.match(/title:\s*["']([^"']+)["']/)?.[1] || '';
    const category = block.match(/category:\s*["']([^"']+)["']/)?.[1] || '';
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(s => s.replace(/["'\s]/g, '')).filter(Boolean) : [];
    
    if (slug && title) {
      allArticles.push({ slug, title, category, tags });
    }
  }
}

console.log('Total articles found:', allArticles.length);
allArticles.forEach((a, i) => {
  console.log(`${i+1}. [${a.slug}] ${a.title} | ${a.category} | [${a.tags.join(', ')}]`);
});
