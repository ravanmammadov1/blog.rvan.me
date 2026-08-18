import fs from 'fs';

// Read the relationship map
const content = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');

// Parse the entries in ECOSYSTEM_RELATIONSHIPS
const slugMatches = [...content.matchAll(/["']([a-z0-9-]+)["']:\s*\{[\s\S]*?slug:\s*["']([a-z0-9-]+)["']/g)];
const registeredSlugs = slugMatches.map(m => m[1]);

console.log('=== ECOSYSTEM INTERNAL LINKING ENGINE AUDIT ===');
console.log('Registered primary article relationships in map:', registeredSlugs.length);

// Read the 39 master articles
const blogFiles = [
  'src/lib/blogs/articles01to10.ts',
  'src/lib/blogs/articles11to20.ts',
  'src/lib/blogs/articles21to30.ts',
  'src/lib/blogs/articles31to39.ts'
];

let masterEnSlugs = [];
let masterAzSlugs = [];

for (const file of blogFiles) {
  const fContent = fs.readFileSync(file, 'utf8');
  const enMatches = [...fContent.matchAll(/slug:\s*\{[^}]*current:\s*["']([^"']+)["']/g)].map(m => m[1]);
  const azMatches = [...fContent.matchAll(/slug_az:\s*\{[^}]*current:\s*["']([^"']+)["']/g)].map(m => m[1]);
  masterEnSlugs.push(...enMatches);
  masterAzSlugs.push(...azMatches);
}

console.log('Total Master Articles (EN):', masterEnSlugs.length);
console.log('Total Master Articles (AZ):', masterAzSlugs.length);

// Verify 100% EN coverage
const unmappedEn = masterEnSlugs.filter(s => !registeredSlugs.includes(s));
console.log('Unmapped EN articles (should be 0):', unmappedEn.length, unmappedEn);

// Extract relationship details for each article
let toolBridgesCount = 0;
let resourceBridgesCount = 0;
let relatedArticlesCount = 0;
let incomingLinks = {};
let outgoingLinks = {};

masterEnSlugs.forEach(s => {
  incomingLinks[s] = 0;
  outgoingLinks[s] = 0;
});

for (const slug of masterEnSlugs) {
  const regex = new RegExp(`["']${slug}["']:\\s*\\{([\\s\\S]*?)(?:\\n  \\},|\\n\\};)`, 'm');
  const match = content.match(regex);
  if (!match) continue;
  const block = match[1];

  if (block.includes('toolBridge:')) toolBridgesCount++;
  if (block.includes('resourceBridge:')) resourceBridgesCount++;

  const relatedMatch = block.match(/relatedSlugs:\s*\[([\s\S]*?)\]/);
  if (relatedMatch) {
    const targets = relatedMatch[1].split(',').map(s => s.replace(/["'\s]/g, '')).filter(Boolean);
    outgoingLinks[slug] = targets.length;
    relatedArticlesCount += targets.length;
    for (const t of targets) {
      if (incomingLinks[t] !== undefined) {
        incomingLinks[t]++;
      } else {
        console.warn(`WARNING: Target slug '${t}' referenced in '${slug}' does not exist in masterSlugs!`);
      }
    }
  }
}

console.log('\n--- METRICS REPORT ---');
console.log('Articles with contextual Tool Bridges:', toolBridgesCount, `(${Math.round(toolBridgesCount/39*100)}%)`);
console.log('Articles with contextual Resource Bridges:', resourceBridgesCount, `(${Math.round(resourceBridgesCount/39*100)}%)`);
console.log('Total curated inter-article connections:', relatedArticlesCount);
console.log('Average outgoing related articles per essay:', (relatedArticlesCount / masterEnSlugs.length).toFixed(1));

// Orphan analysis
const orphanIncoming = Object.entries(incomingLinks).filter(([k, v]) => v === 0);
const orphanOutgoing = Object.entries(outgoingLinks).filter(([k, v]) => v === 0);

console.log('\n--- ORPHAN CONTENT ANALYSIS ---');
console.log('Articles with 0 incoming recommendations (should be 0):', orphanIncoming.length, orphanIncoming.map(o => o[0]));
console.log('Articles with 0 outgoing recommendations (should be 0):', orphanOutgoing.length, orphanOutgoing.map(o => o[0]));

console.log('\n--- TOP INTERLINKED HUBS ---');
const sortedByIncoming = Object.entries(incomingLinks).sort((a, b) => b[1] - a[1]);
sortedByIncoming.slice(0, 10).forEach(([s, count], i) => {
  console.log(`${i+1}. [${count} incoming links] -> ${s}`);
});
