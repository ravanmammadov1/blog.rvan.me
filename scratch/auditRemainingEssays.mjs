import { MASTER_EDITORIAL_BLOGS } from '../src/lib/editorialBlogRegistry.js';

console.log(`Auditing ${MASTER_EDITORIAL_BLOGS.length} master editorial essays...\n`);

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

let bannedCount = 0;

MASTER_EDITORIAL_BLOGS.forEach((blog, index) => {
  const slug = typeof blog.slug === 'string' ? blog.slug : blog.slug.current;
  const title = blog.title;
  const wordCount = blog.body ? blog.body.split(/\s+/).length : 0;
  
  let foundBanned = [];
  bannedPhrases.forEach(phrase => {
    if (blog.body && blog.body.toLowerCase().includes(phrase)) {
      foundBanned.push(phrase);
    }
  });

  if (foundBanned.length > 0) {
    bannedCount++;
    console.log(`⚠️ [${index + 1}] ${slug} (Words: ${wordCount})`);
    console.log(`   Found banned phrases:`, foundBanned);
  } else {
    console.log(`✅ [${index + 1}] ${slug} (Words: ${wordCount}) - Clean`);
  }
});

console.log(`\nTotal articles with banned phrases: ${bannedCount}`);
