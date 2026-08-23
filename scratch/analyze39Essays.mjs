import fs from 'fs';
import path from 'path';

// Let's read ecosystemRelationshipMap.ts directly
const mapContent = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');

// Parse out all entries in ECOSYSTEM_RELATIONSHIPS
const regex = /"([^"]+)":\s*\{\s*slug:\s*"([^"]+)",\s*cluster:\s*"([^"]+)",\s*primaryTopic:\s*\{\s*en:\s*"([^"]+)"/g;

let match;
const clusters = {};
let count = 0;

while ((match = regex.exec(mapContent)) !== null) {
  count++;
  const slug = match[1];
  const cluster = match[3];
  const topicEn = match[4];

  if (!clusters[cluster]) clusters[cluster] = [];
  clusters[cluster].push({ slug, topicEn });
}

console.log(`Parsed ${count} relationships across ${Object.keys(clusters).length} clusters:\n`);

Object.keys(clusters).forEach(c => {
  console.log(`\n### ${c} (${clusters[c].length} articles):`);
  clusters[c].forEach((a, i) => {
    console.log(`  ${i + 1}. [${a.slug}] - ${a.topicEn}`);
  });
});
