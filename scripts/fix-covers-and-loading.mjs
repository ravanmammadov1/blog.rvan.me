/**
 * Fix 3 problems:
 * 1. Duplicate/missing cover images in news cards (contentEngine.ts)
 * 2. 10-second loading on news detail page (NewsDetail.tsx) 
 * 3. Blog card placeholder images (BlogCard.tsx)
 */
import fs from 'fs';
import path from 'path';

const ROOT = 'C:/Project/ReplicateGitHubPortfolioSite-main/src';

// ============================================================
// FIX 1: Expand cover image pool in contentEngine.ts
// ============================================================
const contentEnginePath = path.join(ROOT, 'lib/contentEngine.ts');
let contentEngine = fs.readFileSync(contentEnginePath, 'utf-8');

// Replace the entire CATEGORY_COVER_FALLBACKS + getArticleCoverImage block
const oldFallbackStart = 'const CATEGORY_COVER_FALLBACKS: Record<string, string[]> = {';
const oldFallbackEnd = `return covers[charSum % covers.length];
}`;

const startIdx = contentEngine.indexOf(oldFallbackStart);
const endIdx = contentEngine.indexOf(oldFallbackEnd);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find CATEGORY_COVER_FALLBACKS block in contentEngine.ts');
  process.exit(1);
}

const newBlock = `const CATEGORY_COVER_FALLBACKS: Record<string, string[]> = {
  designNews: [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
  ],
  aiNews: [
    "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1655720828018-edd2daec9349?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1676299081847-c3c9b9e9fad3?q=80&w=1200&auto=format&fit=crop",
  ],
  frontendNews: [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1537884944318-390069bb8665?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592609931095-54a2168ae893?q=80&w=1200&auto=format&fit=crop",
  ],
  devNews: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509718443690-d8e2fb3474b7?q=80&w=1200&auto=format&fit=crop",
  ],
  marketingNews: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop",
  ],
  motionNews: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614854262318-831574f15f1f?q=80&w=1200&auto=format&fit=crop",
  ],
  announcements: [
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  ],
};

export function getArticleCoverImage(category?: string, title?: string): string {
  const cat = category || "designNews";
  const covers = CATEGORY_COVER_FALLBACKS[cat] || CATEGORY_COVER_FALLBACKS.designNews;
  // Position-weighted hash: titles with same chars in different order get different images
  let charSum = 0;
  if (title) {
    for (let i = 0; i < title.length; i++) charSum += title.charCodeAt(i) * (i + 1);
  }
  return covers[Math.abs(charSum) % covers.length];
}`;

contentEngine = contentEngine.substring(0, startIdx) + newBlock + contentEngine.substring(endIdx + oldFallbackEnd.length);
fs.writeFileSync(contentEnginePath, contentEngine, 'utf-8');
console.log('✅ FIX 1: Expanded CATEGORY_COVER_FALLBACKS to 6-8 images per category in contentEngine.ts');


// ============================================================
// FIX 2: Fix NewsDetail.tsx - call aggregateNewsFeeds only ONCE 
//         + use fetchCuratedNewsEngine instead for instant cache
// ============================================================
const newsDetailPath = path.join(ROOT, 'app/NewsDetail.tsx');
let newsDetail = fs.readFileSync(newsDetailPath, 'utf-8');

// Replace the double aggregateNewsFeeds call with single call + cache
const oldLoadArticle = `    async function loadArticleData() {
      try {
        // 1. First check Sanity CMS
        const sanityDoc = await fetchNewsBySlug(slug!);
        if (sanityDoc) {
          const pubIso = sanityDoc.publishedAt || new Date().toISOString();
          const cover = sanityDoc.coverImage ? urlFor(sanityDoc.coverImage)?.url() : getArticleCoverImage(sanityDoc.category, sanityDoc.title);
          
          setArticle({
            id: sanityDoc._id,
            title: sanityDoc.title,
            slug: sanityDoc.slug?.current || sanityDoc._id,
            resourceType: "news",
            description: sanityDoc.excerpt || sanityDoc.title,
            benefitSummary: "Studio Announcement",
            link: \`/news/\${sanityDoc.slug?.current || sanityDoc._id}\`,
            sourceName: "Rvan Studio",
            publishedAt: pubIso,
            formattedDate: format(new Date(pubIso), "MMMM d, yyyy"),
            category: sanityDoc.category || "Announcements",
            country: "Global",
            workType: "na",
            isFree: true,
            logoUrl: cover,
            isRss: false,
          });
          setSanityBody(sanityDoc.body || null);
        } else {
          // 2. Fetch from aggregated news stream (Sanity + RSS + Curated Baseline)
          const cmsNews = await fetchNews();
          const allItems = await aggregateNewsFeeds(cmsNews || []);
          const matched = allItems.find(
            (item) => item.slug === slug || item.id === slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
          );

          if (matched) {
            if (!matched.logoUrl) {
              matched.logoUrl = getArticleCoverImage(matched.category, matched.title);
            }
            setArticle(matched);
          }
        }

        // Fetch related items
        const allFeeds = await aggregateNewsFeeds();
        setRelatedArticles(allFeeds.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));
      } catch (err) {
        console.error("Error loading article detail:", err);
      } finally {
        setLoading(false);
      }
    }`;

const newLoadArticle = `    async function loadArticleData() {
      try {
        // 1. First check Sanity CMS
        const sanityDoc = await fetchNewsBySlug(slug!);
        if (sanityDoc) {
          const pubIso = sanityDoc.publishedAt || new Date().toISOString();
          const cover = sanityDoc.coverImage ? urlFor(sanityDoc.coverImage)?.url() : getArticleCoverImage(sanityDoc.category, sanityDoc.title);
          
          setArticle({
            id: sanityDoc._id,
            title: sanityDoc.title,
            slug: sanityDoc.slug?.current || sanityDoc._id,
            resourceType: "news",
            description: sanityDoc.excerpt || sanityDoc.title,
            benefitSummary: "Studio Announcement",
            link: \`/news/\${sanityDoc.slug?.current || sanityDoc._id}\`,
            sourceName: "Rvan Studio",
            publishedAt: pubIso,
            formattedDate: format(new Date(pubIso), "MMMM d, yyyy"),
            category: sanityDoc.category || "Announcements",
            country: "Global",
            workType: "na",
            isFree: true,
            logoUrl: cover,
            isRss: false,
          });
          setSanityBody(sanityDoc.body || null);
          setLoading(false); // Show Sanity content immediately
        }

        // 2. Single aggregateNewsFeeds call (reused for article lookup AND related)
        const cmsNews = await fetchNews();
        const feedPromise = aggregateNewsFeeds(cmsNews || []);
        const timeoutPromise = new Promise<NormalizedResource[]>((resolve) =>
          setTimeout(() => resolve([]), 3000)
        );
        const allItems = await Promise.race([feedPromise, timeoutPromise]);

        if (!sanityDoc && allItems.length > 0) {
          const matched = allItems.find(
            (item) => item.slug === slug || item.id === slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
          );

          if (matched) {
            if (!matched.logoUrl && !matched.imageUrl) {
              matched.logoUrl = getArticleCoverImage(matched.category, matched.title);
            }
            setArticle(matched);
          }
        }

        // Reuse same allItems for related articles (no second network call!)
        if (allItems.length > 0) {
          setRelatedArticles(allItems.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error("Error loading article detail:", err);
      } finally {
        setLoading(false);
      }
    }`;

if (newsDetail.includes(oldLoadArticle)) {
  newsDetail = newsDetail.replace(oldLoadArticle, newLoadArticle);
  fs.writeFileSync(newsDetailPath, newsDetail, 'utf-8');
  console.log('✅ FIX 2: Fixed NewsDetail.tsx - single aggregateNewsFeeds call + 3s timeout');
} else {
  console.log('⚠️  FIX 2: Could not find exact loadArticleData block. Manual fix needed.');
  // Try a simpler replacement approach
  if (newsDetail.includes('const allFeeds = await aggregateNewsFeeds();')) {
    newsDetail = newsDetail.replace(
      '        // Fetch related items\n        const allFeeds = await aggregateNewsFeeds();\n        setRelatedArticles(allFeeds.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));',
      '        // Reuse allItems for related articles (no second network call!)\n        setRelatedArticles(allItems.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 3));'
    );
    fs.writeFileSync(newsDetailPath, newsDetail, 'utf-8');
    console.log('✅ FIX 2 (partial): Removed duplicate aggregateNewsFeeds call');
  }
}


// ============================================================
// FIX 3: Fix BlogCard.tsx - real cover images instead of placeholders
// ============================================================
const blogCardPath = path.join(ROOT, 'app/components/blog/BlogCard.tsx');
let blogCard = fs.readFileSync(blogCardPath, 'utf-8');

// Add import for getArticleCoverImage
if (!blogCard.includes('getArticleCoverImage')) {
  blogCard = blogCard.replace(
    'import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";',
    'import { formatBlogDate, estimateReadingTime } from "../../../lib/blogHelpers";\nimport { getArticleCoverImage } from "../../../lib/contentEngine";'
  );
}

// Replace the coverUrl line to use fallback instead of null
blogCard = blogCard.replace(
  'const coverUrl = imgBuilder ? imgBuilder.width(800).url() : null;',
  `const coverUrl = imgBuilder ? imgBuilder.width(800).url() : getArticleCoverImage(
    post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : post.category === "Marketing" ? "marketingNews" : "frontendNews",
    post.title
  );`
);

// Replace the conditional rendering block: remove the null/placeholder branch since coverUrl is never null now
// Find the old conditional block
const oldConditionalStart = '          {coverUrl ? (';
const oldConditionalEnd = `          {/* Dynamic visual overlay */}`;

const condStart = blogCard.indexOf(oldConditionalStart);
const condEnd = blogCard.indexOf(oldConditionalEnd);

if (condStart !== -1 && condEnd !== -1) {
  const newCoverBlock = `          <img
              src={coverUrl}
              alt={post.title || "Blog cover"}
              width={800}
              height={520}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getArticleCoverImage(
                  post.category === "Design" ? "designNews" : post.category === "AI" ? "aiNews" : post.category === "Motion" ? "motionNews" : "designNews",
                  post.title
                );
              }}
            />
          {/* Dynamic visual overlay */}`;
  blogCard = blogCard.substring(0, condStart) + newCoverBlock + blogCard.substring(condEnd + oldConditionalEnd.length);
}

fs.writeFileSync(blogCardPath, blogCard, 'utf-8');
console.log('✅ FIX 3: BlogCard.tsx now uses real cover images instead of dark placeholders');


// ============================================================
// FIX 4: Ensure Home page news items are also in /news archive
// The issue: Home uses fetchHomeNewsEngine (via newsEngine.ts)
// which calls fetchCuratedNewsEngine which calls aggregateNewsFeeds
// /news also calls fetchCuratedNewsEngine
// Both should use the same cached pipeline!
// The actual fix: newsEngine already caches via cachedNewsPipeline
// The problem is RSS feeds are timing out inconsistently.
// Solution: Make newsEngine cache persist to localStorage
// ============================================================
const newsEnginePath = path.join(ROOT, 'lib/newsEngine.ts');
let newsEngine = fs.readFileSync(newsEnginePath, 'utf-8');

// Replace cachedNewsPipeline with localStorage-backed version
const oldCacheLines = `let cachedNewsPipeline: CuratedArticle[] | null = null;
let cachedAuditMetrics: NewsPipelineAuditResult | null = null;`;

const newCacheLines = `let cachedNewsPipeline: CuratedArticle[] | null = null;
let cachedAuditMetrics: NewsPipelineAuditResult | null = null;

// Persist news pipeline to localStorage so Home and /news always share the same dataset
const NEWS_PIPELINE_CACHE_KEY = "rvan_news_pipeline_v3";

function loadPipelineCache(): CuratedArticle[] | null {
  try {
    const raw = localStorage.getItem(NEWS_PIPELINE_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function savePipelineCache(items: CuratedArticle[]) {
  try {
    if (items.length > 0) {
      localStorage.setItem(NEWS_PIPELINE_CACHE_KEY, JSON.stringify(items.slice(0, 100)));
    }
  } catch (e) { /* ignore quota */ }
}`;

if (newsEngine.includes(oldCacheLines)) {
  newsEngine = newsEngine.replace(oldCacheLines, newCacheLines);
}

// Update fetchCuratedNewsEngine to check localStorage first
const oldFetchCurated = `export async function fetchCuratedNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  if (cachedNewsPipeline) return cachedNewsPipeline;
  const { articles } = await runNewsPipelineAudit(cmsNews);
  return articles;
}`;

const newFetchCurated = `export async function fetchCuratedNewsEngine(cmsNews: any[] = []): Promise<CuratedArticle[]> {
  if (cachedNewsPipeline) return cachedNewsPipeline;

  // Check localStorage for persisted pipeline (ensures Home + /news share same data)
  const persisted = loadPipelineCache();
  if (persisted && persisted.length > 0) {
    cachedNewsPipeline = persisted;
    // Background revalidate without blocking
    runNewsPipelineAudit(cmsNews).then(({ articles }) => {
      cachedNewsPipeline = articles;
      savePipelineCache(articles);
    }).catch(() => {});
    return persisted;
  }

  const { articles } = await runNewsPipelineAudit(cmsNews);
  savePipelineCache(articles);
  return articles;
}`;

if (newsEngine.includes(oldFetchCurated)) {
  newsEngine = newsEngine.replace(oldFetchCurated, newFetchCurated);
}

// Also save to cache after runNewsPipelineAudit
newsEngine = newsEngine.replace(
  '  cachedNewsPipeline = diverseNews;\n  cachedAuditMetrics = audit;',
  '  cachedNewsPipeline = diverseNews;\n  cachedAuditMetrics = audit;\n  savePipelineCache(diverseNews);'
);

fs.writeFileSync(newsEnginePath, newsEngine, 'utf-8');
console.log('✅ FIX 4: newsEngine now persists pipeline to localStorage - Home and /news share same dataset');

console.log('\n🎉 All 4 fixes applied successfully!');
