import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (/\.(tsx|ts|jsx|js)$/.test(file)) results.push(file);
  });
  return results;
}

const files = walk('src');

console.log('=== SEARCHING FOR "Apca" IN src/ ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.toLowerCase().includes('apca')) {
    console.log(f);
  }
});

console.log('\n=== SEARCHING FOR "contrast-matrix" IN src/ ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('contrast-matrix')) {
    console.log(f);
  }
});
