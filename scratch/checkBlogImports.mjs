import fs from 'fs';
import path from 'path';

const blogFiles = [
  'src/app/BlogArchive.tsx',
  'src/app/BlogDetail.tsx',
  'src/app/components/home/BlogSection.tsx',
  'src/app/components/blog/AuthorCard.tsx',
  'src/app/components/blog/BlogCard.tsx',
  'src/app/components/blog/BlogContent.tsx',
  'src/app/components/blog/BlogHero.tsx',
  'src/app/components/blog/CategoryFilter.tsx',
  'src/app/components/blog/EcosystemBridgeCard.tsx',
  'src/app/components/blog/PortableTextComponents.tsx',
  'src/app/components/blog/ReadingProgress.tsx',
  'src/app/components/blog/RelatedPosts.tsx',
  'src/app/components/blog/ShareButtons.tsx',
  'src/app/components/blog/TableOfContents.tsx',
  'src/app/components/PageHero.tsx',
  'src/app/components/PageFilterBar.tsx',
  'src/app/components/ScrollToTopButton.tsx',
  'src/app/components/SiteHeader.tsx',
  'src/app/components/Footer.tsx',
  'src/app/components/SEO.tsx',
  'src/app/hooks/useProgressiveRendering.ts',
  'src/app/hooks/useClarity.ts'
];

console.log('=== CHECKING BLOG COMPONENT EXPORTS & IMPORTS ===\n');

blogFiles.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error(`MISSING: ${f}`);
    return;
  }
  const code = fs.readFileSync(f, 'utf8');
  
  // Find all import statements
  const importLines = code.split('\n').filter(l => l.trim().startsWith('import '));
  
  const hasDefault = /export\s+default\s+/.test(code);
  const named = [...code.matchAll(/export\s+(const|function|class|type|interface)\s+([a-zA-Z0-9_]+)/g)].map(m => m[2]);
  
  console.log(`\nFILE: ${f}`);
  console.log(`  Export default: ${hasDefault}`);
  console.log(`  Export named: ${named.join(', ')}`);
  console.log(`  Imports (${importLines.length}):`);
  importLines.forEach(imp => console.log(`    ${imp.trim()}`));
});
