import { MASTER_EDITORIAL_BLOGS, getEditorialBlogBySlug } from "../src/lib/editorialBlogRegistry.ts";

console.log("=== 39 EDITORIAL BLOGS VERIFICATION ===");
console.log("Total Blogs Count:", MASTER_EDITORIAL_BLOGS.length);

let passed = 0;
let failed = 0;

MASTER_EDITORIAL_BLOGS.forEach((blog, index) => {
  const num = String(index + 1).padStart(2, "0");
  const hasId = !!blog._id;
  const hasSlug = !!blog.slug?.current;
  const hasTitle = !!blog.title && blog.title.length > 5;
  const hasCategory = !!blog.category;
  const hasTags = Array.isArray(blog.tags) && blog.tags.length > 0;
  const hasBody = Array.isArray(blog.body) && blog.body.length > 0;
  const hasCover = !!blog.coverImage;

  // Calculate word count from body
  let wordCount = 0;
  if (Array.isArray(blog.body)) {
    blog.body.forEach((b) => {
      if (b.children && Array.isArray(b.children)) {
        b.children.forEach((c) => {
          if (c.text) wordCount += c.text.trim().split(/\s+/).filter(Boolean).length;
        });
      }
    });
  }

  const ok = hasId && hasSlug && hasTitle && hasCategory && hasTags && hasBody && hasCover;
  if (ok) {
    passed++;
    console.log(
      `[${num}/39] OK: "${blog.title}" | Slug: /blog/${blog.slug.current} | Cat: ${blog.category} | Words: ~${wordCount}`
    );
  } else {
    failed++;
    console.error(
      `[${num}/39] FAILED: ID: ${blog._id} | Missing fields: id:${hasId}, slug:${hasSlug}, title:${hasTitle}, body:${hasBody}`
    );
  }
});

console.log(`\nVerification complete: ${passed} passed, ${failed} failed out of ${MASTER_EDITORIAL_BLOGS.length}.`);
