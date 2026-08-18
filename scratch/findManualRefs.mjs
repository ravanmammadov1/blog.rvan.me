import fs from 'fs';
import path from 'path';

const dir = 'src/lib/blogs';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (f.endsWith('.ts')) {
    const p = path.join(dir, f);
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('_ref:') && !l.includes('image-') || l.includes('image-manual') || l.includes('image-von-restorff')) {
        console.log(`${f}:${idx + 1}: ${l}`);
      }
    });
  }
});
