import { client } from "./sanityClient";
import exportData from "../../sanity_to_wp_export.json";
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
      *[_type == "projects" && defined(slug.current) && (status == "published" || !defined(status))] | order(order asc, _createdAt desc){
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
      *[_type == "projects" && slug.current == $slug && (status == "published" || !defined(status))][0]{
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
        analyticsId,
        seo{
          metaTitle,
          metaDescription,
          ogImage,
          canonicalUrl,
          noIndex
        }
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


export async function fetchUniversalContentItems(contentType?: string) {
  try {
    const filter = contentType
      ? `*[_type == "contentItem" && status == "published" && contentType == $contentType]`
      : `*[_type == "contentItem" && status == "published"]`;

    const data = await client.fetch(
      `
      ${filter} | order(trendingScore desc, publishedAt desc)[0...50]{
        _id,
        _createdAt,
        title,
        "slug": slug.current,
        contentType,
        summary,
        whyItMatters,
        whoShouldUseIt,
        link,
        coverImage,
        logo,
        qualityScore,
        trendingScore,
        publishedAt,
        status,
        verificationStatus,
        sourceName,
        category->{
          name,
          "slug": slug.current,
          icon
        },
        tags[]->{
          name,
          "slug": slug.current
        },
        jobDetails,
        scholarshipDetails,
        aiToolDetails,
        githubDetails,
        courseDetails,
        competitionDetails,
        seoTitle,
        seoDescription
      }
    `,
      contentType ? { contentType } : {}
    );
    return data || [];
  } catch (error) {
    console.error("Error fetching universal content items from Sanity:", error);
    return [];
  }
}

export const getAllContentItemsQuery = `
  *[_type == "contentItem" && status == "published"] | order(trendingScore desc, publishedAt desc)[$start..$end] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    whoShouldUseIt,
    link,
    coverImage,
    logo,
    qualityScore,
    trendingScore,
    publishedAt,
    verificationStatus,
    sourceName,
    category->{ name, "slug": slug.current, icon },
    tags[]->{ name, "slug": slug.current },
    jobDetails,
    scholarshipDetails,
    aiToolDetails,
    githubDetails,
    courseDetails,
    competitionDetails
  }
`;

export const getContentItemsByVerticalQuery = `
  *[_type == "contentItem" && status == "published" && contentType == $contentType] | order(trendingScore desc, publishedAt desc)[$start..$end] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    whoShouldUseIt,
    link,
    coverImage,
    logo,
    qualityScore,
    trendingScore,
    publishedAt,
    verificationStatus,
    sourceName,
    category->{ name, "slug": slug.current, icon },
    tags[]->{ name, "slug": slug.current },
    jobDetails,
    scholarshipDetails,
    aiToolDetails,
    githubDetails,
    courseDetails,
    competitionDetails
  }
`;

export const getContentItemsByCategoryQuery = `
  *[_type == "contentItem" && status == "published" && category->slug.current == $categorySlug] | order(trendingScore desc, publishedAt desc)[$start..$end] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    whoShouldUseIt,
    link,
    coverImage,
    logo,
    qualityScore,
    trendingScore,
    publishedAt,
    category->{ name, "slug": slug.current, icon },
    tags[]->{ name, "slug": slug.current },
    jobDetails,
    scholarshipDetails,
    aiToolDetails,
    githubDetails,
    courseDetails,
    competitionDetails
  }
`;

export const getContentItemsByTagQuery = `
  *[_type == "contentItem" && status == "published" && $tagSlug in tags[]->slug.current] | order(trendingScore desc, publishedAt desc)[$start..$end] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    whoShouldUseIt,
    link,
    coverImage,
    logo,
    qualityScore,
    trendingScore,
    publishedAt,
    category->{ name, "slug": slug.current, icon },
    tags[]->{ name, "slug": slug.current },
    jobDetails,
    scholarshipDetails,
    aiToolDetails,
    githubDetails,
    courseDetails,
    competitionDetails
  }
`;

export const getSingleContentItemBySlugQuery = `
  *[_type == "contentItem" && (slug.current == $slug || _id == $slug)][0] {
    _id,
    _createdAt,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    whoShouldUseIt,
    link,
    coverImage,
    logo,
    qualityScore,
    trendingScore,
    publishedAt,
    status,
    verificationStatus,
    sourceName,
    category->{ name, "slug": slug.current, icon },
    tags[]->{ name, "slug": slug.current },
    jobDetails,
    scholarshipDetails,
    aiToolDetails,
    githubDetails,
    courseDetails,
    competitionDetails,
    seoTitle,
    seoDescription
  }
`;

export const getRelatedContentItemsQuery = `
  *[_type == "contentItem" && status == "published" && _id != $currentId && (contentType == $contentType || category._ref == $categoryId)] | order(qualityScore desc, publishedAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    contentType,
    summary,
    whyItMatters,
    link,
    qualityScore,
    category->{ name, "slug": slug.current, icon }
  }
`;

export async function fetchSingleContentItemBySlug(slug: string) {
  try {
    const data = await client.fetch(getSingleContentItemBySlugQuery, { slug });
    return data || null;
  } catch (error) {
    console.error(`Error fetching content item by slug '${slug}':`, error);
    return null;
  }
}

export async function fetchRelatedContentItems(currentId: string, contentType: string, categoryId?: string) {
  try {
    const data = await client.fetch(getRelatedContentItemsQuery, {
      currentId,
      contentType,
      categoryId: categoryId || ""
    });
    return data || [];
  } catch (error) {
    console.error("Error fetching related content items:", error);
    return [];
  }
}
function getLocalBlogBySlug(slug: string) {
  const blogs = (exportData as any)?.blogs || [];
  return blogs.find((b: any) => {
    const s = b.slug;
    const slugStr = typeof s === "object" ? s?.current : s;
    return slugStr === slug;
  });
}

export async function fetchBlogBySlug(slug: string) {
  const localBlog = getLocalBlogBySlug(slug);
  try {
    const data = await client.fetch(
      `
      *[_type == "blog" && (slug.current == $slug || _id == $slug) && (status == "published" || !defined(status))][0]{
        _id,
        title,
        slug,
        excerpt,
        category,
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        body
      }
    `,
      { slug }
    );
    const post = data || localBlog || null;
    if (post && localBlog) {
      if (localBlog.coverImage && typeof localBlog.coverImage === "object" && (localBlog.coverImage as any).url) {
        post.coverImage = localBlog.coverImage;
      }
      if (Array.isArray(localBlog.body)) {
        const localImages = localBlog.body.filter((b: any) => b && b._type === "image" && String(b._key || "").startsWith("generated_inline_"));
        if (localImages.length > 0) {
          post.body = localBlog.body;
        }
      }
    }
    return post;
  } catch (error) {
    console.error("Error fetching blog by slug from Sanity:", error);
    return localBlog || null;
  }
}

export async function fetchAllBlogs() {
  try {
    const data = await client.fetch(
      `
      *[_type == "blog" && (status == "published" || !defined(status)) && defined(slug.current)] | order(featured desc, publishDate desc){
        _id,
        title,
        slug,
        excerpt,
        category,
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        body
      }
    `
    );
    return data || [];
  } catch (error) {
    console.error("Error fetching all blogs from Sanity:", error);
    return [];
  }
}



