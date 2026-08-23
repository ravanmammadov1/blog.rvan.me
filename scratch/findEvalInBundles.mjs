import fs from 'fs';
import path from 'path';

// Let's search dist/assets to see where eval or new Function exists in the production JS bundles
const assets = fs.readdirSync('dist/assets').filter(a => a.endsWith('.js'));

console.log('=== SEARCHING FOR eval / Function in dist/assets ===\n');

assets.forEach(a => {
  const content = fs.readFileSync(path.join('dist/assets', a), 'utf8');
  const hasEval = /\beval\s*\(/.test(content);
  const hasFunctionConstructor = /new\s+Function\s*\(/.test(content);
  const hasWindowEval = /window\.eval/.test(content);
  
  if (hasEval || hasFunctionConstructor || hasWindowEval) {
    console.log(`Found in ${a}:`);
    if (hasEval) console.log('  - eval(...)');
    if (hasFunctionConstructor) console.log('  - new Function(...)');
    if (hasWindowEval) console.log('  - window.eval(...)');
    
    // Find snippet
    const evalMatches = [...content.matchAll(/(.{0,40}\b(eval|new\s+Function)\s*\(.{0,60})/g)].map(m => m[0]);
    console.log('  Snippets:', evalMatches.slice(0, 3));
  }
});
