import fs from 'fs';
import path from 'path';

async function inspectAllArticles() {
  const blogsDir = path.join('src', 'lib', 'blogs');
  const files = fs.readdirSync(blogsDir);
  
  const articles = [];

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    const content = fs.readFileSync(path.join(blogsDir, file), 'utf8');
    const blocks = content.split(/{\s*_id:\s*"/);
    for (let i = 1; i < blocks.length; i++) {
      const b = blocks[i];
      const idMatch = b.match(/^([^"]+)"/);
      const titleMatch = b.match(/title:\s*"([^"]+)"/);
      const slugMatch = b.match(/current:\s*"([^"]+)"/);
      const categoryMatch = b.match(/category:\s*"([^"]+)"/);
      const excerptMatch = b.match(/excerpt:\s*"([^"]+)"/);
      
      // Calculate word count from body
      const bodyBlocks = b.split(/children:\s*\[/);
      let wordCount = 0;
      for (let j = 1; j < bodyBlocks.length; j++) {
        const textMatches = bodyBlocks[j].match(/text:\s*"([^"]+)"/g);
        if (textMatches) {
          for (const tm of textMatches) {
            const text = tm.replace(/^text:\s*"/, '').replace(/"$/, '');
            wordCount += text.trim().split(/\s+/).filter(Boolean).length;
          }
        }
      }

      if (slugMatch && titleMatch) {
        articles.push({
          id: idMatch ? idMatch[1] : `art-${i}`,
          slug: slugMatch[1],
          title: titleMatch[1],
          category: categoryMatch ? categoryMatch[1] : 'Uncategorized',
          excerpt: excerptMatch ? excerptMatch[1] : '',
          wordCount,
          file
        });
      }
    }
  }

  console.log(`Total extracted articles: ${articles.length}`);
  fs.writeFileSync('scratch/all43ArticlesAudit.json', JSON.stringify(articles, null, 2));
}

inspectAllArticles().catch(console.error);
