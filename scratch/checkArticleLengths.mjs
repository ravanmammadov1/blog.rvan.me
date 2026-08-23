import fs from 'fs';
import path from 'path';

const blogFiles = [
  'src/lib/blogs/articles01to10.ts',
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

const articles = [];

for (const bf of blogFiles) {
  const content = fs.readFileSync(bf, 'utf8');
  const blocks = content.split(/{\s*_id:\s*"/);
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const slugMatch = b.match(/current:\s*"([^"]+)"/);
    const titleMatch = b.match(/title:\s*"([^"]+)"/);
    const createBlocks = (b.match(/createBlock\(/g) || []).length;
    if (slugMatch) {
      articles.push({
        slug: slugMatch[1],
        title: titleMatch ? titleMatch[1] : '',
        blocksCount: createBlocks,
        file: bf
      });
    }
  }
}

// Sort by lowest blocksCount
articles.sort((a, b) => a.blocksCount - b.blocksCount);

console.log('--- ALL ARTICLES BY CONTENT DEPTH ---');
for (const a of articles) {
  console.log(`${a.blocksCount.toString().padStart(2, ' ')} blocks | ${a.slug} (${a.file})`);
}
