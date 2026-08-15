import { wpFetch, getWpImage } from "./wordpressClient";
import { BlogPost } from "../types/blog";
import { NewsItem, ToolItem, ProjectItem, SiteSettings } from "../types/cms";

/**
 * Fetch All Blog Posts from WordPress via WPGraphQL
 */
export async function wpFetchAllBlogs(): Promise<BlogPost[]> {
  const query = `
    query GetBlogArchive {
      posts(where: { status: PUBLISH }, first: 100) {
        nodes {
          id
          databaseId
          title
          slug
          date
          excerpt
          content
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featured
          }
        }
      }
    }
  `;

  const response = await wpFetch<{ posts: { nodes: any[] } }>(query);
  if (!response?.posts?.nodes) return [];

  return response.posts.nodes.map((node) => ({
    _id: String(node.databaseId || node.id),
    title: node.title,
    slug: { current: node.slug },
    excerpt: node.excerpt ? node.excerpt.replace(/<[^>]+>/g, "").trim() : "",
    category: node.categories?.nodes?.[0]?.name || "Design",
    tags: node.tags?.nodes?.map((t: any) => t.name) || [],
    featured: Boolean(node.acfBlogFields?.featured),
    publishDate: node.date,
    readTime: node.acfBlogFields?.readTime || "5 min read",
    coverImage: getWpImage(node.featuredImage?.node),
    body: node.content || "",
  }));
}

/**
 * Fetch Single Blog Post By Slug from WordPress
 */
export async function wpFetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  const query = `
    query GetBlogBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        id
        databaseId
        title
        slug
        date
        excerpt
        content
        categories {
          nodes {
            name
            slug
          }
        }
        tags {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        acfBlogFields {
          readTime
          featured
        }
      }
    }
  `;

  const response = await wpFetch<{ post: any }>(query, { slug });
  if (!response?.post) return null;

  const node = response.post;
  return {
    _id: String(node.databaseId || node.id),
    title: node.title,
    slug: { current: node.slug },
    excerpt: node.excerpt ? node.excerpt.replace(/<[^>]+>/g, "").trim() : "",
    category: node.categories?.nodes?.[0]?.name || "Design",
    tags: node.tags?.nodes?.map((t: any) => t.name) || [],
    featured: Boolean(node.acfBlogFields?.featured),
    publishDate: node.date,
    readTime: node.acfBlogFields?.readTime || "5 min read",
    coverImage: getWpImage(node.featuredImage?.node),
    body: node.content || "",
  };
}

/**
 * Fetch Portfolio Projects from WordPress
 */
export async function wpFetchProjects(): Promise<ProjectItem[]> {
  const query = `
    query GetProjects {
      portfolioProjects(first: 50) {
        nodes {
          id
          databaseId
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          acfProjectFields {
            clientName
            projectType
            projectYear
            accentColor
            liveUrl
            order
            tags
          }
          content
        }
      }
    }
  `;

  const response = await wpFetch<{ portfolioProjects: { nodes: any[] } }>(query);
  if (!response?.portfolioProjects?.nodes) return [];

  return response.portfolioProjects.nodes.map((node, index) => ({
    _id: String(node.databaseId || node.id),
    title: node.title,
    slug: { current: node.slug },
    coverImage: getWpImage(node.featuredImage?.node),
    client: node.acfProjectFields?.clientName || "Client Project",
    description: node.excerpt ? node.excerpt.replace(/<[^>]+>/g, "").trim() : "",
    type: node.acfProjectFields?.projectType || "Visual Identity & Design",
    tags: node.acfProjectFields?.tags ? node.acfProjectFields.tags.split(",") : [],
    body: node.content || "",
    liveUrl: node.acfProjectFields?.liveUrl || "",
    year: String(node.acfProjectFields?.projectYear || new Date().getFullYear()),
    accent: node.acfProjectFields?.accentColor || "#61c5ad",
    order: node.acfProjectFields?.order ?? index,
  }));
}
