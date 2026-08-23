import { MASTER_EDITORIAL_BLOGS } from '../src/lib/editorialBlogRegistry';

console.log('=== DEEP ANALYSIS OF ALL 39 MASTER ESSAYS ===\n');

function extractBlockText(body: any): string[] {
  if (!body) return [];
  if (typeof body === 'string') return [body];
  if (Array.isArray(body)) {
    return body.map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((c: any) => c.text || '').join(' ');
      }
      return '';
    }).filter(Boolean);
  }
  return [];
}

const bannedPhrases = [
  "in today's fast-paced",
  "in today’s fast-paced",
  "plays a crucial role",
  "plays a vital role",
  "understanding the psychology behind",
  "in conclusion",
  "whether you're a designer or",
  "whether you’re a designer or",
  "here are 5 ways",
  "here are 7 ways"
];

MASTER_EDITORIAL_BLOGS.forEach((blog, idx) => {
  const slug = blog.slug?.current || blog.slug;
  const enBlocks = extractBlockText(blog.body);
  const azBlocks = extractBlockText(blog.body_az);

  const fullEnText = enBlocks.join(' ');
  const fullAzText = azBlocks.join(' ');

  const enWords = fullEnText.split(/\s+/).filter(Boolean).length;
  const azWords = fullAzText.split(/\s+/).filter(Boolean).length;

  const foundBanned = bannedPhrases.filter(p => fullEnText.toLowerCase().includes(p));
  const opening = enBlocks.length > 1 ? enBlocks[1] : (enBlocks[0] || 'NO OPENING');

  console.log(`[#${idx + 1}] ${slug}`);
  console.log(`    Title EN: "${blog.title}"`);
  console.log(`    Title AZ: "${blog.title_az || 'MISSING'}"`);
  console.log(`    Words: EN=${enWords}, AZ=${azWords} | Blocks: EN=${enBlocks.length}, AZ=${azBlocks.length}`);
  console.log(`    Opening snippet: "${opening.substring(0, 100)}..."`);
  if (foundBanned.length > 0) {
    console.log(`    ⚠️ BANNED PHRASES:`, foundBanned);
  }
  console.log('');
});
