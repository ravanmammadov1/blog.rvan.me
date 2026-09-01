import { BlogPost } from "../types/blog";
import { GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY } from "./blogs/articleResponsiveTypographyGuide";
import { GUIDE_APCA_ACCESSIBILITY } from "./blogs/articleApcaAccessibilityGuide";
import { GUIDE_COGNITIVE_COPYWRITING } from "./blogs/articleCognitiveCopywritingGuide";
import { GUIDE_VISUAL_HIERARCHY } from "./blogs/articleVisualHierarchyGuide";
import { ARTICLES_01_TO_10 } from "./blogs/articles01to10";
import { ARTICLES_11_TO_20 } from "./blogs/articles11to20";
import { ARTICLES_21_TO_30 } from "./blogs/articles21to30";
import { ARTICLES_31_TO_39 } from "./blogs/articles31to39";
import { ARTICLES_VIRAL_MASTERCLASS } from "./blogs/articlesViralMasterclass";

/**
 * Master Editorial Blog Registry
 * Contains the 39 publication articles on DESIGN x PSYCHOLOGY x MARKETING x CULTURE.
 */
const RAW_MASTER_EDITORIAL_BLOGS: BlogPost[] = [
  GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY,
  GUIDE_APCA_ACCESSIBILITY,
  GUIDE_COGNITIVE_COPYWRITING,
  GUIDE_VISUAL_HIERARCHY,
  ...ARTICLES_01_TO_10,
  ...ARTICLES_11_TO_20,
  ...ARTICLES_21_TO_30,
  ...ARTICLES_VIRAL_MASTERCLASS,
  ...ARTICLES_31_TO_39,
];

export const MASTER_EDITORIAL_BLOGS: BlogPost[] = RAW_MASTER_EDITORIAL_BLOGS.map((post) => ({
  ...post,
  authorName: "Ravan Mammadov",
  authorSlug: "ravan-mammadov",
  authorPhoto: "/imports/ravan_1-400.webp",
  authorRole: post.authorRole || "Senior Creative Designer & Visual Strategist",
}));

// Verify that the count is at least 39
if (MASTER_EDITORIAL_BLOGS.length < 39) {
  console.warn(
    `[editorialBlogRegistry] Expected at least 39 master blogs, but found ${MASTER_EDITORIAL_BLOGS.length}`
  );
}

// Maps for fast O(1) retrieval
const BLOG_BY_SLUG = new Map<string, BlogPost>();
const BLOG_BY_ID = new Map<string, BlogPost>();

MASTER_EDITORIAL_BLOGS.forEach((post) => {
  BLOG_BY_SLUG.set(post.slug.current, post);
  if (post.slug_az?.current) {
    BLOG_BY_SLUG.set(post.slug_az.current, post);
  }
  if (post.originalSlug) {
    BLOG_BY_SLUG.set(post.originalSlug, post);
  }
  BLOG_BY_ID.set(post._id, post);
});

// Backward compatibility aliases for replaced articles so old URLs resolve gracefully
const avisBlog = BLOG_BY_ID.get("blog-guide-responsive-fluid-typography-css-clamp");
if (avisBlog) {
  BLOG_BY_SLUG.set("guide-responsive-fluid-typography-css-clamp", avisBlog);
  BLOG_BY_SLUG.set("elastik-tipoqrafiya-css-clamp-rehberi", avisBlog);
}

const oatlyBlog = BLOG_BY_ID.get("blog-visual-hierarchy-masterclass");
if (oatlyBlog) {
  BLOG_BY_SLUG.set("why-eyes-look-at-certain-things-first", oatlyBlog);
  BLOG_BY_SLUG.set("gozler-niye-ilk-baxir", oatlyBlog);
  BLOG_BY_SLUG.set("visual-hierarchy-masterclass", oatlyBlog);
}

const bettyCrockerBlog = BLOG_BY_ID.get("blog-iconography-and-vector-precision");
if (bettyCrockerBlog) {
  BLOG_BY_SLUG.set("why-notification-icon-is-a-bell", bettyCrockerBlog);
  BLOG_BY_SLUG.set("bildiris-ikonu-niye-zengdir", bettyCrockerBlog);
  BLOG_BY_SLUG.set("iconography-and-vector-precision", bettyCrockerBlog);
}

const economistBlog = BLOG_BY_ID.get("blog-conversion-rate-optimization-cro");
if (economistBlog) {
  BLOG_BY_SLUG.set("why-most-popular-works-on-pricing-tables", economistBlog);
  BLOG_BY_SLUG.set("en-meshur-nisani-ve-sosial-subut", economistBlog);
  BLOG_BY_SLUG.set("conversion-rate-optimization-cro", economistBlog);
}

export function getEditorialBlogBySlug(slug: string): BlogPost | null {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "").toLowerCase();
  for (const [key, val] of BLOG_BY_SLUG.entries()) {
    if (key.toLowerCase() === cleanSlug) return val;
  }
  for (const [key, val] of BLOG_BY_ID.entries()) {
    if (key.toLowerCase() === cleanSlug) return val;
  }
  return null;
}

export function getEditorialBlogById(id: string): BlogPost | null {
  if (!id) return null;
  return BLOG_BY_ID.get(id) || null;
}

export function getAllEditorialBlogs(): BlogPost[] {
  return MASTER_EDITORIAL_BLOGS;
}

export function getAllEditorialSlugs(): { en: string; az?: string }[] {
  return MASTER_EDITORIAL_BLOGS.map((post) => ({
    en: post.slug.current,
    az: post.slug_az?.current,
  }));
}

export function getRelatedEditorialBlogs(currentSlug: string, count = 3): BlogPost[] {
  const current = getEditorialBlogBySlug(currentSlug);
  if (!current) return MASTER_EDITORIAL_BLOGS.slice(0, count);

  return MASTER_EDITORIAL_BLOGS.filter(
    (b) => b.slug.current !== current.slug.current
  )
    .sort((a, b) => {
      // Prioritize same category, then matching tags
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, count);
}
