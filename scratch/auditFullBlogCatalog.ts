import { MASTER_EDITORIAL_BLOGS } from '../src/lib/editorialBlogRegistry';

console.log('=== AUDITING FULL 39-ESSAY MASTER EDITORIAL CATALOG ===\n');

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

function extractText(body: any): string {
  if (!body) return '';
  if (typeof body === 'string') return body;
  if (Array.isArray(body)) {
    return body.map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map((c: any) => c.text || '').join(' ');
      }
      return '';
    }).join('\n');
  }
  return '';
}

let issues = 0;
const articlesSummary: any[] = [];

MASTER_EDITORIAL_BLOGS.forEach((blog, i) => {
  const slug = typeof blog.slug === 'string' ? blog.slug : blog.slug.current;
  const enText = extractText(blog.body);
  const azText = extractText(blog.body_az);

  const enWords = enText.split(/\s+/).filter(Boolean).length;
  const azWords = azText.split(/\s+/).filter(Boolean).length;
  
  const foundBanned = bannedPhrases.filter(p => enText.toLowerCase().includes(p));

  const hasShortBody = enWords < 400 || azWords < 250;
  const hasNoAz = !blog.title_az || azWords === 0;

  articlesSummary.push({
    index: i + 1,
    slug,
    title: blog.title,
    title_az: blog.title_az,
    enWords,
    azWords,
    foundBanned,
    hasShortBody,
    hasNoAz
  });

  if (foundBanned.length > 0 || hasShortBody || hasNoAz) {
    issues++;
    console.log(`⚠️ [${i + 1}] ${slug}`);
    console.log(`    EN Words: ${enWords}, AZ Words: ${azWords}`);
    if (foundBanned.length > 0) console.log(`    Banned phrases:`, foundBanned);
    if (hasShortBody) console.log(`    Short body detected!`);
    if (hasNoAz) console.log(`    Missing AZ content!`);
  } else {
    console.log(`✅ [${i + 1}] ${slug} (EN: ${enWords}w, AZ: ${azWords}w) - PASS`);
  }
});

console.log(`\n======================================================`);
console.log(`Total essays inspected: ${MASTER_EDITORIAL_BLOGS.length}`);
console.log(`Issues requiring editorial polish: ${issues}`);
console.log(`======================================================\n`);
