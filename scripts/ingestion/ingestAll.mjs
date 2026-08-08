import { parseRssFeeds } from './rssParser.mjs';
import { fetchGitHubProjects } from './githubFetcher.mjs';
import { enrichItemWithAI } from './aiEnricher.mjs';
import { uploadToSanity } from './sanityUploader.mjs';

// Default curated official RSS feed sources
const DEFAULT_RSS_SOURCES = [
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', defaultContentType: 'resource' },
  { name: 'CSS-Tricks', url: 'https://css-tricks.com/feed/', defaultContentType: 'resource' },
  { name: 'Google Design', url: 'https://design.google/rss.xml', defaultContentType: 'resource' },
  { name: 'Web.dev', url: 'https://web.dev/feed.xml', defaultContentType: 'resource' },
  { name: 'Chrome Developers', url: 'https://developer.chrome.com/feeds/blog.xml', defaultContentType: 'resource' },
  { name: 'Awwwards Blog', url: 'https://www.awwwards.com/blog/feed/', defaultContentType: 'designAsset' },
  { name: 'Motionographer', url: 'https://motionographer.com/feed/', defaultContentType: 'resource' },
  { name: 'Codrops', url: 'https://tympanus.net/codrops/feed/', defaultContentType: 'template' },
  { name: 'Vercel Blog', url: 'https://vercel.com/atom', defaultContentType: 'resource' },
  { name: 'OpenAI News', url: 'https://openai.com/news/rss.xml', defaultContentType: 'aiTool' },
  { name: 'Linear Blog', url: 'https://linear.app/blog/rss.xml', defaultContentType: 'resource' }
];


export async function runFullIngestionPipeline() {
  console.log('====================================================');
  console.log('🚀 Starting Master Content Ingestion & AI Pipeline');
  console.log('====================================================');

  try {
    // 1. Fetch from RSS Feeds
    const rssRaw = await parseRssFeeds(DEFAULT_RSS_SOURCES);

    // 2. Fetch from GitHub Trending
    const githubRaw = await fetchGitHubProjects();

    // 3. Combine raw items
    const combinedRaw = [...rssRaw, ...githubRaw];
    console.log(`[Master Ingestion] Total raw items collected: ${combinedRaw.length}`);

    // 4. Run AI Enrichment
    console.log('[Master Ingestion] Enriching items with AI summaries and metadata...');
    const enrichedItems = [];
    for (const item of combinedRaw) {
      const enriched = await enrichItemWithAI(item);
      enrichedItems.push(enriched);
    }

    // 5. Upload to Sanity
    const result = await uploadToSanity(enrichedItems);

    console.log('====================================================');
    console.log(`✅ Pipeline Complete! Published/Prepared: ${result.uploadedCount}`);
    console.log('====================================================');
  } catch (err) {
    console.error('❌ Master Ingestion Pipeline Error:', err);
  }
}

// Execute if run directly via Node CLI
if (process.argv[1]?.endsWith('ingestAll.mjs')) {
  runFullIngestionPipeline();
}
