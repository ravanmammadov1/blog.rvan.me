import Parser from 'rss-parser';
import crypto from 'crypto';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'KnowledgePlatformIngestion/1.0 (+https://www.rvan.me)'
  }
});

function generateHash(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Fetches and normalizes articles from a list of RSS/Atom feed sources in parallel.
 * @param {Array<{ url: string, name: string, defaultContentType?: string }>} sources 
 * @returns {Promise<Array<object>>}
 */
export async function parseRssFeeds(sources = []) {
  console.log(`[RSS Parser] Processing ${sources.length} feed sources...`);

  const results = await Promise.allSettled(
    sources.map(async (src) => {
      try {
        const feed = await parser.parseURL(src.url);
        const items = (feed.items || []).slice(0, 8).map((item) => {
          const rawLink = item.link || item.guid || '';
          return {
            rawTitle: item.title?.trim() || 'Untitled Feed Item',
            rawLink,
            sourceHash: generateHash(rawLink),
            rawSnippet: item.contentSnippet || item.summary || item.content || '',
            publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
            sourceName: src.name || feed.title || 'RSS Source',
            defaultContentType: src.defaultContentType || 'resource',
            sourceUrl: src.url
          };
        });
        return items;
      } catch (err) {
        console.warn(`[RSS Parser Warning] Failed to fetch feed from ${src.name} (${src.url}): ${err.message}`);
        return [];
      }
    })
  );

  const allItems = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .filter((item) => item.rawLink && item.rawTitle);

  console.log(`[RSS Parser] Successfully parsed ${allItems.length} raw items from RSS.`);
  return allItems;
}
