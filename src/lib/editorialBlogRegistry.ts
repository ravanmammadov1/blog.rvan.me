import { BlogPost } from "../types/blog";
import { GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY } from "./blogs/articleResponsiveTypographyGuide";
import { GUIDE_APCA_ACCESSIBILITY } from "./blogs/articleApcaAccessibilityGuide";
import { GUIDE_COGNITIVE_COPYWRITING } from "./blogs/articleCognitiveCopywritingGuide";
import { GUIDE_VISUAL_HIERARCHY } from "./blogs/articleVisualHierarchyGuide";
import { ARTICLES_01_TO_10 } from "./blogs/articles01to10";
import { ARTICLES_11_TO_20 } from "./blogs/articles11to20";
import { ARTICLES_21_TO_30 } from "./blogs/articles21to30";
import { ARTICLES_31_TO_39 } from "./blogs/articles31to39";

/**
 * Master Editorial Blog Registry
 * Contains the publication articles on DESIGN x PSYCHOLOGY x MARKETING x CULTURE.
 */
export const MASTER_EDITORIAL_BLOGS: BlogPost[] = [
  GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY,
  GUIDE_APCA_ACCESSIBILITY,
  GUIDE_COGNITIVE_COPYWRITING,
  GUIDE_VISUAL_HIERARCHY,
  ...ARTICLES_01_TO_10,
  ...ARTICLES_11_TO_20,
  ...ARTICLES_21_TO_30,
  ...ARTICLES_31_TO_39,
];

// Verify that the count is at least 43
if (MASTER_EDITORIAL_BLOGS.length < 43) {
  console.warn(
    `[editorialBlogRegistry] Expected at least 43 master blogs, but found ${MASTER_EDITORIAL_BLOGS.length}`
  );
}

// Maps for fast O(1) retrieval
const BLOG_BY_SLUG = new Map<string, BlogPost>();
const BLOG_BY_ID = new Map<string, BlogPost>();

MASTER_EDITORIAL_BLOGS.forEach((post) => {
  BLOG_BY_SLUG.set(post.slug.current, post);
  BLOG_BY_ID.set(post._id, post);
});

export function getEditorialBlogBySlug(slug: string): BlogPost | null {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return BLOG_BY_SLUG.get(cleanSlug) || BLOG_BY_ID.get(cleanSlug) || null;
}

export function getEditorialBlogById(id: string): BlogPost | null {
  if (!id) return null;
  return BLOG_BY_ID.get(id) || null;
}

export function getAllEditorialBlogs(): BlogPost[] {
  return MASTER_EDITORIAL_BLOGS;
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
