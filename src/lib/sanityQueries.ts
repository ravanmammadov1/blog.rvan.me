import { client } from "./sanityClient";
import exportData from "../../sanity_to_wp_export.json";
import {
  MASTER_EDITORIAL_BLOGS,
  getEditorialBlogBySlug,
  getAllEditorialBlogs,
} from "./editorialBlogRegistry";
import {
  NewsItem,
  ToolItem,
  ProjectItem,
  SiteSettings,
  AboutSection,
  TestimonialItem,
} from "../types/cms";

export async function fetchSiteSettings(lang: string = "en"): Promise<SiteSettings | null> {
  try {
    const isAz = lang === "az";
    const data = await client.fetch(`
      *[_type == "siteSettings"][0]{
        _id,
        "heroTitle": select(${isAz} && defined(heroTitle_az) => heroTitle_az, heroTitle),
        "heroSubtitle": select(${isAz} && defined(heroSubtitle_az) => heroSubtitle_az, heroSubtitle),
        availabilityStatus,
        heroEmbedUrl,
        favicon,
        logo,
        "resumeFileUrl": resumeFile.asset->url,
        socialLinks,
        seo,
        navItems,
        "contactHeading": select(${isAz} && defined(contactHeading_az) => contactHeading_az, contactHeading),
        "contactSubtext": select(${isAz} && defined(contactSubtext_az) => contactSubtext_az, contactSubtext),
        letsTalkLabel,
        heroCoordinates,
        "footerText": select(${isAz} && defined(footerText_az) => footerText_az, footerText),
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

export async function fetchAboutSection(lang: string = "en"): Promise<AboutSection | null> {
  try {
    const isAz = lang === "az";
    const data = await client.fetch(`
      *[_type == "about"][0]{
        _id,
        "heading": select(${isAz} && defined(heading_az) => heading_az, heading),
        "introParagraph1": select(${isAz} && defined(introParagraph1_az) => introParagraph1_az, introParagraph1),
        "introParagraph2": select(${isAz} && defined(introParagraph2_az) => introParagraph2_az, introParagraph2),
        profilePhoto,
        stats,
        platformValues,
        experience,
        skills,
        education,
        awards,
        brandLogos
      }
    `);
    return data || null;
  } catch (error) {
    console.error("Error fetching about section from Sanity:", error);
    return null;
  }
}

export async function fetchProjects(lang: string = "en"): Promise<ProjectItem[]> {
  try {
    const isAz = lang === "az";
    const data = await client.fetch(`
      *[_type == "projects" && defined(slug.current) && (status == "published" || !defined(status))] | order(order asc, _createdAt desc){
        _id,
        "title": select(${isAz} && defined(title_az) => title_az, title),
        slug,
        coverImage,
        client,
        "description": select(${isAz} && defined(description_az) => description_az, description),
        "type": select(${isAz} && defined(type_az) => type_az, type),
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
  const editorial = getEditorialBlogBySlug(slug);
  if (editorial) return editorial;

  const blogs = (exportData as any)?.blogs || [];
  const raw = (slug || "").trim();
  const clean = decodeURIComponent(raw)
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim()
    .toLowerCase();

  return blogs.find((b: any) => {
    const s = b.slug;
    const slugStr = (typeof s === "object" ? s?.current : s || "").toLowerCase().replace(/\/+$/, "");
    const bId = (b._id || "").toLowerCase();
    return slugStr === clean || bId === clean || slugStr === raw.toLowerCase();
  });
}

export async function fetchBlogBySlug(slug: string, lang: string = "en") {
  const raw = (slug || "").trim();
  const cleanSlug = decodeURIComponent(raw)
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim();
  const lowerSlug = cleanSlug.toLowerCase();
  const isAz = lang === "az" || (typeof window !== "undefined" && window.location.pathname.startsWith("/az"));
  const editorialBlog = getEditorialBlogBySlug(cleanSlug);

  try {
    const data = await client.fetch(
      `
      *[_type == "blog" && (
        slug.current == $cleanSlug || 
        slug_az.current == $cleanSlug || 
        lower(slug.current) == $lowerSlug || 
        lower(slug_az.current) == $lowerSlug || 
        slug.current == $raw || 
        slug_az.current == $raw || 
        _id == $cleanSlug || 
        _id == $raw
      ) && (status == "published" || !defined(status))][0]{
        _id,
        "title": select(${isAz} && defined(title_az) => title_az, title),
        "slug": select(${isAz} && defined(slug_az.current) => slug_az, slug),
        "originalSlug": slug.current,
        "azSlug": slug_az.current,
        "excerpt": select(${isAz} && defined(excerpt_az) => excerpt_az, excerpt),
        "category": select(${isAz} && defined(category_az) => category_az, category),
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        "body": select(${isAz} && defined(body_az) => body_az, body)
      }
    `,
      { raw, cleanSlug, lowerSlug }
    );

    // Merge: Prefer editorial registry's deep researched chapters while respecting Sanity overrides
    const base = editorialBlog || data || getLocalBlogBySlug(cleanSlug) || null;
    if (base) {
      const isAzPost = isAz;
      const localizedBody = (isAzPost && Array.isArray(base.body_az) && base.body_az.length > 0)
        ? base.body_az
        : (Array.isArray(base.body) && base.body.length > 0 ? base.body : (data?.body || []));
      const localizedTitle = (isAzPost && base.title_az) ? base.title_az : (base.title || data?.title || "");
      const localizedExcerpt = (isAzPost && base.excerpt_az) ? base.excerpt_az : (base.excerpt || data?.excerpt || "");
      const localizedCategory = (isAzPost && base.category_az) ? base.category_az : (base.category || data?.category || "");

      return {
        ...base,
        ...(data || {}),
        title: localizedTitle,
        category: localizedCategory,
        excerpt: localizedExcerpt,
        tags: base.tags || data?.tags,
        body: localizedBody,
        readTime: base.readTime || data?.readTime,
        featured: base.featured ?? data?.featured,
      };
    }
    return base;
  } catch (error) {
    console.error("Error fetching blog by slug from Sanity:", error);
    const fallback = editorialBlog || getLocalBlogBySlug(cleanSlug) || null;
    if (fallback && isAz) {
      return {
        ...fallback,
        title: fallback.title_az || fallback.title,
        category: fallback.category_az || fallback.category,
        excerpt: fallback.excerpt_az || fallback.excerpt,
        body: (Array.isArray(fallback.body_az) && fallback.body_az.length > 0) ? fallback.body_az : fallback.body,
      };
    }
    return fallback;
  }
}

export async function fetchAllBlogs(lang: string = "en") {
  const editorialMap = new Map(MASTER_EDITORIAL_BLOGS.map((b) => [b.slug.current, b]));

  try {
    const isAz = lang === "az" || (typeof window !== "undefined" && window.location.pathname.startsWith("/az"));
    const data = await client.fetch(
      `
      *[_type == "blog" && (status == "published" || !defined(status)) && defined(slug.current)] | order(select(featured == true => 1, 0) desc, _updatedAt desc, publishDate desc){
        _id,
        "title": select(${isAz} && defined(title_az) => title_az, title),
        "slug": select(${isAz} && defined(slug_az.current) => slug_az, slug),
        "originalSlug": slug.current,
        "azSlug": slug_az.current,
        "excerpt": select(${isAz} && defined(excerpt_az) => excerpt_az, excerpt),
        "category": select(${isAz} && defined(category_az) => category_az, category),
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        "body": select(${isAz} && defined(body_az) => body_az, body)
      }
    `
    );

    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        const slugKey = typeof item.slug === "object" ? item.slug?.current : item.slug;
        const ed = editorialMap.get(slugKey) || editorialMap.get(item._id);
        if (ed) {
          return {
            ...item,
            title: (isAz && ed.title_az) ? ed.title_az : ed.title,
            category: (isAz && ed.category_az) ? ed.category_az : ed.category,
            excerpt: (isAz && ed.excerpt_az) ? ed.excerpt_az : ed.excerpt,
            tags: ed.tags || item.tags,
            readTime: ed.readTime || item.readTime,
            featured: ed.featured ?? item.featured,
            body: (isAz && Array.isArray(ed.body_az) && ed.body_az.length > 0) ? ed.body_az : ed.body,
          };
        }
        return item;
      });
    }

    return getAllEditorialBlogs().map((ed) => isAz ? {
      ...ed,
      title: ed.title_az || ed.title,
      category: ed.category_az || ed.category,
      excerpt: ed.excerpt_az || ed.excerpt,
      body: (Array.isArray(ed.body_az) && ed.body_az.length > 0) ? ed.body_az : ed.body,
    } : ed);
  } catch (error) {
    console.error("Error fetching all blogs from Sanity:", error);
    const isAz = lang === "az" || (typeof window !== "undefined" && window.location.pathname.startsWith("/az"));
    return getAllEditorialBlogs().map((ed) => isAz ? {
      ...ed,
      title: ed.title_az || ed.title,
      category: ed.category_az || ed.category,
      excerpt: ed.excerpt_az || ed.excerpt,
      body: (Array.isArray(ed.body_az) && ed.body_az.length > 0) ? ed.body_az : ed.body,
    } : ed);
  }
}



