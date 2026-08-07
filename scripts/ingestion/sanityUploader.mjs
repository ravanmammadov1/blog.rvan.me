import { createClient } from '@sanity/client';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retryWithBackoff(fn, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await sleep(delay);
    return retryWithBackoff(fn, retries - 1, delay * 2);
  }
}

/**
 * Uploads enriched items to Sanity CMS dataset after de-duplication checks.
 * @param {Array<object>} enrichedItems 
 * @param {object} options 
 */
export async function uploadToSanity(enrichedItems = [], options = {}) {
  const projectId = options.projectId || process.env.SANITY_PROJECT_ID || '0lqwkcmg';
  const dataset = options.dataset || process.env.SANITY_DATASET || 'production';
  const token = options.token || process.env.SANITY_TOKEN;

  console.log(`[Sanity Uploader] Connecting to Sanity dataset '${dataset}' (Project ID: ${projectId})...`);

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    useCdn: false,
    token: token || undefined
  });

  let uploadedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const item of enrichedItems) {
    try {
      // Rate limit throttling
      await sleep(150);

      // 1. Check if document already exists by link, slug, or sourceHash
      const existing = await retryWithBackoff(() =>
        client.fetch(
          `*[_type == "contentItem" && (link == $link || slug.current == $slug || sourceHash == $hash)][0]{ _id }`,
          { link: item.rawLink, slug: item.slug, hash: item.sourceHash || '' }
        )
      );

      if (existing) {
        skippedCount++;
        continue;
      }

      // 2. Determine publication status & document ID
      const isAutoPublish = (item.qualityScore || 85) >= 85;
      const status = isAutoPublish ? 'published' : 'review';
      const docId = isAutoPublish
        ? `content-${item.slug}-${Date.now().toString(36)}`
        : `drafts.content-${item.slug}-${Date.now().toString(36)}`;

      // 3. Construct Sanity Document
      const doc = {
        _type: 'contentItem',
        _id: docId,
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        contentType: item.contentType || 'resource',
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        whoShouldUseIt: item.whoShouldUseIt,
        link: item.rawLink,
        sourceHash: item.sourceHash,
        sourceName: item.sourceName || 'Curated Feed',
        qualityScore: item.qualityScore || 85,
        trendingScore: (item.qualityScore || 85) + 10,
        status,
        verificationStatus: 'verified',
        publishedAt: item.publishedAt || new Date().toISOString(),
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        ...(item.githubData ? { githubDetails: item.githubData } : {})
      };

      if (token) {
        await retryWithBackoff(() => client.create(doc));
        console.log(`[Sanity Uploader] Created document: ${doc.title} (ID: ${doc._id}, Status: ${status})`);
        uploadedCount++;
      } else {
        console.log(`[Sanity Uploader Dry Run] Prepared document: ${doc.title} (ID: ${doc._id}, Score: ${doc.qualityScore})`);
        uploadedCount++;
      }
    } catch (err) {
      console.warn(`[Sanity Uploader Warning] Failed to upload "${item.title}": ${err.message}`);
      errorCount++;
    }
  }

  console.log(`[Sanity Uploader] Summary — Created/Prepared: ${uploadedCount}, Skipped duplicates: ${skippedCount}, Errors: ${errorCount}.`);
  return { uploadedCount, skippedCount, errorCount };
}
