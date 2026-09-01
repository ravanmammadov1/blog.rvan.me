import { BlogPost } from "../types/blog";
import { GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY } from "./blogs/articleResponsiveTypographyGuide";
import { GUIDE_VISUAL_HIERARCHY } from "./blogs/articleVisualHierarchyGuide";
import { ARTICLES_01_TO_10 } from "./blogs/articles01to10";
import { ARTICLES_11_TO_20 } from "./blogs/articles11to20";
import { ARTICLES_21_TO_30 } from "./blogs/articles21to30";
import { ARTICLES_31_TO_39 } from "./blogs/articles31to39";

/**
 * Master Editorial Blog Registry
 * Contains EXACTLY the 17 curated publication articles on DESIGN x PSYCHOLOGY x MARKETING x CULTURE.
 */
const RAW_MASTER_EDITORIAL_BLOGS: BlogPost[] = [
  GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY,
  GUIDE_VISUAL_HIERARCHY,
  ...ARTICLES_01_TO_10,
  ...ARTICLES_11_TO_20,
  ...ARTICLES_21_TO_30,
  ...ARTICLES_31_TO_39,
];

export const MASTER_EDITORIAL_BLOGS: BlogPost[] = RAW_MASTER_EDITORIAL_BLOGS.map((post) => ({
  ...post,
  authorName: "Ravan Mammadov",
  authorSlug: "ravan-mammadov",
  authorPhoto: "/imports/ravan_1-400.webp",
  authorRole: post.authorRole || "Senior Creative Designer & Visual Strategist",
}));

// Verify that the count is exactly 17
if (MASTER_EDITORIAL_BLOGS.length !== 17) {
  console.warn(
    `[editorialBlogRegistry] Expected exactly 17 master blogs, but found ${MASTER_EDITORIAL_BLOGS.length}`
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

// Lightweight backward compatibility aliases for legacy URLs
const avisBlog = BLOG_BY_ID.get("blog-guide-responsive-fluid-typography-css-clamp");
if (avisBlog) {
  BLOG_BY_SLUG.set("guide-responsive-fluid-typography-css-clamp", avisBlog);
  BLOG_BY_SLUG.set("elastik-tipoqrafiya-css-clamp-rehberi", avisBlog);
  BLOG_BY_SLUG.set("avis-we-try-harder", avisBlog);
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
