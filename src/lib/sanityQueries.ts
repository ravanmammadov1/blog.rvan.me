import { client } from "./sanityClient";
import {
  NewsItem,
  ToolItem,
  ProjectItem,
  SiteSettings,
  AboutSection,
  TestimonialItem,
} from "../types/cms";

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await client.fetch(`
      *[_type == "siteSettings"][0]{
        _id,
        heroTitle,
        heroSubtitle,
        availabilityStatus,
        heroEmbedUrl,
        favicon,
        logo,
        "resumeFileUrl": resumeFile.asset->url,
        socialLinks,
        seo
      }
    `);
    return data || null;
  } catch (error) {
    console.error("Error fetching site settings from Sanity:", error);
    return null;
  }
}

export async function fetchAboutSection(): Promise<AboutSection | null> {
  try {
    const data = await client.fetch(`
      *[_type == "about"][0]{
        _id,
        heading,
        introParagraph1,
        introParagraph2,
        profilePhoto,
        stats,
        experience,
        skills
      }
    `);
    return data || null;
  } catch (error) {
    console.error("Error fetching about section from Sanity:", error);
    return null;
  }
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const data = await client.fetch(`
      *[_type == "projects"] | order(order asc, _createdAt desc){
        _id,
        title,
        slug,
        coverImage,
        client,
        description,
        type,
        tags,
        body,
        gallery,
        liveUrl,
        year,
        accent,
        order
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return [];
  }
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectItem | null> {
  try {
    const data = await client.fetch(
      `
      *[_type == "projects" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        coverImage,
        client,
        description,
        type,
        tags,
        body,
        gallery,
        liveUrl,
        year,
        accent,
        order
      }
    `,
      { slug }
    );
    return data || null;
  } catch (error) {
    console.error("Error fetching project by slug from Sanity:", error);
    return null;
  }
}

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    const data = await client.fetch(`
      *[_type == "news"] | order(publishedAt desc){
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        body,
        publishedAt,
        category
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching news from Sanity:", error);
    return [];
  }
}

export async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  try {
    const slugClean = (slug || "").toLowerCase().trim();
    const data = await client.fetch(
      `
      *[_type == "news" && (slug.current == $slug || _id == $slug || lower(slug.current) == $slugClean)][0]{
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        body,
        publishedAt,
        category
      }
    `,
      { slug, slugClean }
    );
    return data || null;
  } catch (error) {
    console.error("Error fetching news by slug from Sanity:", error);
    return null;
  }
}

export async function fetchTools(): Promise<ToolItem[]> {
  try {
    const data = await client.fetch(`
      *[_type == "tools"] | order(category asc, name asc){
        _id,
        name,
        description,
        icon,
        link,
        category
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching tools from Sanity:", error);
    return [];
  }
}

export async function fetchTestimonials(): Promise<TestimonialItem[]> {
  try {
    const data = await client.fetch(`
      *[_type == "testimonial"] | order(_createdAt desc){
        _id,
        name,
        role,
        company,
        quote,
        photo,
        linkedURL
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching testimonials from Sanity:", error);
    return [];
  }
}

export async function fetchApprovedComments(postId: string) {
  try {
    const data = await client.fetch(
      `
      *[_type == "comment" && status == "approved" && references($postId)] | order(createdAt desc){
        _id,
        authorName,
        commentText,
        status,
        likes,
        dislikes,
        createdAt
      }
    `,
      { postId }
    );
    return data || [];
  } catch (error) {
    console.error("Error fetching approved comments from Sanity:", error);
    return [];
  }
}

export async function submitComment(
  postId: string,
  authorName: string,
  authorEmail: string,
  commentText: string
) {
  try {
    const doc = {
      _type: "comment",
      relatedPost: {
        _type: "reference",
        _ref: postId,
      },
      authorName,
      authorEmail,
      commentText,
      status: "pending",
      likes: 0,
      dislikes: 0,
      createdAt: new Date().toISOString(),
    };
    const result = await client.create(doc);
    return result;
  } catch (error) {
    console.error("Error submitting comment to Sanity:", error);
    throw error;
  }
}

export async function voteComment(commentId: string, type: "like" | "dislike") {
  try {
    const field = type === "like" ? "likes" : "dislikes";
    const result = await client.patch(commentId).inc({ [field]: 1 }).commit();
    return result;
  } catch (error) {
    console.error(`Error voting ${type} on comment:`, error);
    throw error;
  }
}
