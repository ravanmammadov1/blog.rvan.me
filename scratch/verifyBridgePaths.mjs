import fs from 'fs';

const content = fs.readFileSync('src/lib/ecosystemRelationshipMap.ts', 'utf8');

// Extract all 'path: "..."' in ecosystemRelationshipMap
const pathMatches = [...content.matchAll(/path:\s*["']([^"']+)["']/g)].map(m => m[1]);
const uniquePaths = [...new Set(pathMatches)];

console.log('=== VERIFYING ALL BRIDGE PATH TARGETS ===');
console.log('Total unique target paths referenced in bridges:', uniquePaths.length);

const validRootRoutes = [
  '/',
  '/about',
  '/work',
  '/contact',
  '/blog',
  '/tools',
  '/resources',
  '/ravan-mammadov',
  '/tools/resume-builder',
  '/tools/open-peeps',
  '/fonts/inter',
  '/fonts/playfair-display',
  '/fonts/space-grotesk',
  '/fonts/fira-code',
];

let allValid = true;
for (const p of uniquePaths) {
  const base = p.split('?')[0];
  const isValid = validRootRoutes.includes(base) || base.startsWith('/fonts/') || base.startsWith('/work/') || base.startsWith('/blog/');
  console.log(`Path: ${p.padEnd(35)} -> Valid: ${isValid}`);
  if (!isValid) {
    console.error(`ERROR: Invalid path target '${p}'`);
    allValid = false;
  }
}

if (allValid) {
  console.log('SUCCESS: All bridge paths are 100% valid canonical internal routes.');
}
