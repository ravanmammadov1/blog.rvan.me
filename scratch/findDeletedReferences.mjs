import fs from 'fs';
import path from 'path';

const deletedSlugs = [
  'why-search-is-a-magnifying-glass',
  'axtaris-niye-boyuducu-susedir',
  'why-phone-icon-is-a-1960s-telephone-receiver',
  'zeng-ikonu-niye-kohne-destekdir',
  'why-settings-icon-is-a-mechanical-gear',
  'tenzimlemeler-niye-disli-carxdir',
  'why-email-is-a-paper-envelope-icon',
  'e-poct-niye-kagiz-zerf-ikonudur',
  'blog-prompt-engineering-for-designers',
  'blog-synthetic-media-and-video-ai',
  'blog-automating-creative-workflows-with-ai-agents',
  'blog-llm-integration-in-saas-products'
];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const fullPath = path.join(dir, f.name);
    if (f.isDirectory()) {
      if (f.name !== 'node_modules' && f.name !== '.git' && f.name !== 'dist' && f.name !== 'scratch') {
        scanDirectory(fullPath);
      }
    } else if (f.isFile() && (f.name.endsWith('.ts') || f.name.endsWith('.tsx') || f.name.endsWith('.mjs') || f.name.endsWith('.json') || f.name.endsWith('.md'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const slug of deletedSlugs) {
        if (content.includes(slug)) {
          console.log(`Found "${slug}" in -> ${fullPath}`);
        }
      }
    }
  }
}

console.log('=== SEARCHING FOR ALL REFERENCES TO 4 DELETED ARTICLES ===\n');
scanDirectory('.');
