/**
 * AI Enrichment Pipeline
 * Transforms raw feed items into structured, editorial-grade JSON matching Sanity schema.
 */

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Enriches a raw item using AI or robust heuristic rules.
 * @param {object} rawItem 
 * @param {string} apiKey Optional Gemini/OpenAI API key
 * @returns {Promise<object>}
 */
export async function enrichItemWithAI(rawItem, apiKey = process.env.GEMINI_API_KEY) {
  const cleanTitle = rawItem.rawTitle.replace(/\s+/g, ' ').trim();
  const baseSlug = slugify(cleanTitle);

  // Default fallback enrichment if AI key is omitted or during offline execution
  let enriched = {
    title: cleanTitle,
    slug: baseSlug,
    summary: rawItem.rawSnippet ? rawItem.rawSnippet.slice(0, 240) + '...' : `${cleanTitle} — curated resource for digital creatives.`,
    whyItMatters: `High-value tool curated to boost productivity and workflow quality for modern creators.`,
    whoShouldUseIt: 'Designers, Marketers, Developers & Students',
    contentType: rawItem.defaultContentType || 'resource',
    qualityScore: 85,
    trendingScore: 75,
    tags: ['curated', 'productivity', 'design-tools'],
    seoTitle: `${cleanTitle} — Curated Resource & Insights`,
    seoDescription: rawItem.rawSnippet ? rawItem.rawSnippet.slice(0, 155) : `Explore ${cleanTitle} on our curated knowledge platform.`
  };

  if (apiKey) {
    try {
      const prompt = `Analyze this raw item and return ONLY valid JSON:
Title: "${cleanTitle}"
Snippet: "${rawItem.rawSnippet}"
Link: "${rawItem.rawLink}"

Respond in exact JSON format:
{
  "title": "Clean, punchy headline",
  "summary": "2-3 sentence overview of what this item offers",
  "whyItMatters": "Single strong editorial sentence explaining why creators should care",
  "whoShouldUseIt": "Target persona (e.g. Senior UI/UX Designers, Growth Marketers, Developers)",
  "contentType": "resource" | "aiTool" | "scholarship" | "remoteJob" | "competition" | "freeCourse" | "githubProject" | "designAsset" | "template" | "marketingResource" | "industryNews",
  "tags": ["tag1", "tag2", "tag3"],
  "qualityScore": number (70 to 98 based on utility),
  "seoTitle": "50-60 character SEO meta title",
  "seoDescription": "140-155 character SEO meta description"
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          enriched = {
            ...enriched,
            title: parsed.title || enriched.title,
            summary: parsed.summary || enriched.summary,
            whyItMatters: parsed.whyItMatters || enriched.whyItMatters,
            whoShouldUseIt: parsed.whoShouldUseIt || enriched.whoShouldUseIt,
            contentType: parsed.contentType || enriched.contentType,
            tags: Array.isArray(parsed.tags) ? parsed.tags : enriched.tags,
            qualityScore: typeof parsed.qualityScore === 'number' ? parsed.qualityScore : 85,
            seoTitle: parsed.seoTitle || enriched.seoTitle,
            seoDescription: parsed.seoDescription || enriched.seoDescription
          };
        }
      }
    } catch (err) {
      console.warn(`[AI Enricher Warning] Gemini API call failed for "${cleanTitle}": ${err.message}. Using fallback.`);
    }
  }

  return {
    ...rawItem,
    ...enriched,
    slug: slugify(enriched.title || cleanTitle)
  };
}
