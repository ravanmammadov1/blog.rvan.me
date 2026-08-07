import { parseRssFeeds } from './rssParser.mjs';
import { fetchGitHubProjects } from './githubFetcher.mjs';
import { enrichItemWithAI } from './aiEnricher.mjs';
import { uploadToSanity } from './sanityUploader.mjs';

// Default curated RSS feed sources
const DEFAULT_RSS_SOURCES = [
  { name: 'Smashing Magazine', url: 'https://www.smashingmagazine.com/feed/', defaultContentType: 'resource' },
  { name: 'UX Collective', url: 'https://uxdesign.cc/feed', defaultContentType: 'resource' },
  { name: 'We Work Remotely - Design', url: 'https://weworkremotely.com/categories/remote-design-jobs.rss', defaultContentType: 'remoteJob' },
  { name: 'Abduzeedo', url: 'https://abduzeedo.com/feed.xml', defaultContentType: 'designAsset' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/feed', defaultContentType: 'aiTool' }
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
