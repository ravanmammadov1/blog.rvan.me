import { createClient } from '@sanity/client';

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

  for (const item of enrichedItems) {
    try {
      // 1. Check if document already exists by link or slug
      const existing = await client.fetch(
        `*[_type == "contentItem" && (link == $link || slug.current == $slug)][0]{ _id }`,
        { link: item.rawLink, slug: item.slug }
      );

      if (existing) {
        skippedCount++;
        continue;
      }

      // 2. Determine publication status based on Quality Score
      const status = item.qualityScore >= 85 ? 'published' : 'review';

      // 3. Construct Sanity Document
      const doc = {
        _type: 'contentItem',
        _id: `content-${item.slug}-${Date.now().toString(36)}`,
        title: item.title,
        slug: { _type: 'slug', current: item.slug },
        contentType: item.contentType || 'resource',
        summary: item.summary,
        whyItMatters: item.whyItMatters,
        whoShouldUseIt: item.whoShouldUseIt,
        link: item.rawLink,
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
        await client.create(doc);
        console.log(`[Sanity Uploader] Created document: ${doc.title} (${status})`);
        uploadedCount++;
      } else {
        console.log(`[Sanity Uploader Dry Run] Prepared document: ${doc.title} (Score: ${doc.qualityScore})`);
        uploadedCount++;
      }
    } catch (err) {
      console.warn(`[Sanity Uploader Warning] Failed to upload "${item.title}": ${err.message}`);
    }
  }

  console.log(`[Sanity Uploader] Complete! Created: ${uploadedCount}, Skipped duplicates: ${skippedCount}.`);
  return { uploadedCount, skippedCount };
}
