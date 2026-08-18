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

console.log('=== SEARCHING FOR THREE.JS / WEBGL USAGES ===');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('three') || content.includes('@react-three') || content.includes('WebGLRenderer')) {
    console.log(f);
  }
});
