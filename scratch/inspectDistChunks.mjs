import fs from 'fs';
import path from 'path';

// Let's inspect dist/assets to see all generated JS chunks
const assets = fs.readdirSync('dist/assets');
console.log('=== ASSETS IN DIST/ASSETS ===');
assets.filter(a => a.endsWith('.js')).forEach(a => {
  const stat = fs.statSync(path.join('dist/assets', a));
  console.log(a.padEnd(50), `${(stat.size / 1024).toFixed(2)} KB`);
});
