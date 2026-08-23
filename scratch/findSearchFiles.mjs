import fs from 'fs';
import path from 'path';

function findInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findInDir(full);
    } else if (e.isFile() && (e.name.endsWith('.ts') || e.name.endsWith('.tsx'))) {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('MASTER_EDITORIAL_BLOGS') || txt.includes('getEditorialBlog') || txt.includes('getAllEditorialBlogs')) {
        console.log(`Uses blog registry: ${full}`);
      }
      if (e.name.toLowerCase().includes('search')) {
        console.log(`Search file: ${full}`);
      }
    }
  }
}

findInDir('src');
