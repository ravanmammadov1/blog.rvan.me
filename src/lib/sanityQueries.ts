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
        seo,
        navItems,
        contactHeading,
        contactSubtext,
        letsTalkLabel,
        heroCoordinates,
        footerText,
        announcementBar,
        services,
        principles,
        fieldNotes
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
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const data = await client.fetch(`
      *[_type == "news" && publishedAt >= $cutoffDate] | order(publishedAt desc){
        _id,
        title,
        slug,
        coverImage,
        excerpt,
        body,
        publishedAt,
        category
      }
    `, { cutoffDate });
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
    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "submit",
        postId,
        authorName,
        authorEmail,
        commentText,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to submit comment.");
    }
    return data;
  } catch (error: any) {
    console.error("Error submitting comment via API:", error);
    throw error;
  }
}

export async function voteComment(commentId: string, type: "like" | "dislike") {
  try {
    const response = await fetch("/api/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "vote",
        commentId,
        voteType: type,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to submit vote.");
    }
    return data;
  } catch (error: any) {
    console.error(`Error voting ${type} via API:`, error);
    throw error;
  }
}

export async function fetchResources() {
  try {
    const data = await client.fetch(`
      *[_type == "resource" && status == "published"] | order(sortPriority asc, featuredScore desc, _createdAt desc){
        _id,
        title,
        "slug": slug.current,
        resourceType,
        description,
        benefitSummary,
        link,
        logo,
        status,
        verificationStatus,
        isGlobal,
        countries,
        body,
        category->{
          name,
          "slug": slug.current
        },
        tags[]->{
          name,
          "slug": slug.current
        },
        difficultyLevel,
        completionTime,
        company,
        salaryRange,
        prizePool,
        startDate,
        endDate,
        fundingAmount,
        featuredScore,
        sortPriority,
        badges,
        analyticsId
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching resources from Sanity:", error);
    return [];
  }
}

export async function fetchResourceCategories() {
  try {
    const data = await client.fetch(`
      *[_type == "resourceCategory"] | order(name asc){
        _id,
        name,
        "slug": slug.current
      }
    `);
    return data || [];
  } catch (error) {
    console.error("Error fetching resource categories from Sanity:", error);
    return [];
  }
}
