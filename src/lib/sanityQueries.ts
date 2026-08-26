import { client } from "./sanityClient";
import {
  MASTER_EDITORIAL_BLOGS,
  getEditorialBlogBySlug,
  getAllEditorialBlogs,
} from "./editorialBlogRegistry";
import {
  ProjectItem,
  SiteSettings,
  AboutSection,
  TestimonialItem,
} from "../types/cms";
import { BlogPost } from "../types/blog";

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
  return getEditorialBlogBySlug(slug);
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
        "category": coalesce(
          select(${isAz} && defined(category->title_az) => category->title_az, category->title),
          category->name,
          select(${isAz} && defined(category_az) => category_az, category),
          "Design"
        ),
        "authorName": coalesce(author->name, authorName, "Ravan Mammadov"),
        "authorSlug": coalesce(author->slug.current, authorSlug, "ravan-mammadov"),
        "authorRole": coalesce(
          select(${isAz} && defined(author->role_az) => author->role_az, author->role),
          authorRole,
          "Founder & Creative Director"
        ),
        "authorPhoto": coalesce(author->image, authorPhoto),
        "authorBio": coalesce(
          select(${isAz} && defined(author->bio_az) => author->bio_az, author->bio),
          authorBio
        ),
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        "body": select(${isAz} && defined(body_az) => body_az, body),
        seo
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

      const isSanityCoverValid = Boolean(
        data?.coverImage && (data.coverImage.asset?._ref || data.coverImage.asset?.url || data.coverImage.url || data.coverImage.asset)
      );
      const effectiveCover = isSanityCoverValid
        ? data.coverImage
        : (editorialBlog?.coverImage || base.coverImage || data?.coverImage);

      return {
        ...base,
        ...(data || {}),
        coverImage: effectiveCover,
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
  const editorialMap = new Map<string, BlogPost>();
  MASTER_EDITORIAL_BLOGS.forEach((b) => {
    editorialMap.set(b._id.toLowerCase(), b);
    if (b.slug?.current) editorialMap.set(b.slug.current.toLowerCase(), b);
    if (b.slug_az?.current) editorialMap.set(b.slug_az.current.toLowerCase(), b);
    if (b.originalSlug) editorialMap.set(b.originalSlug.toLowerCase(), b);
    if (b.title) editorialMap.set(b.title.toLowerCase().trim(), b);
    if (b.title_az) editorialMap.set(b.title_az.toLowerCase().trim(), b);
  });

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
        "category": coalesce(
          select(${isAz} && defined(category->title_az) => category->title_az, category->title),
          category->name,
          select(${isAz} && defined(category_az) => category_az, category),
          "Design"
        ),
        "authorName": coalesce(author->name, authorName, "Ravan Mammadov"),
        "authorSlug": coalesce(author->slug.current, authorSlug, "ravan-mammadov"),
        "authorRole": coalesce(
          select(${isAz} && defined(author->role_az) => author->role_az, author->role),
          authorRole,
          "Founder & Creative Director"
        ),
        "authorPhoto": coalesce(author->image, authorPhoto),
        "authorBio": coalesce(
          select(${isAz} && defined(author->bio_az) => author->bio_az, author->bio),
          authorBio
        ),
        tags,
        featured,
        publishDate,
        readTime,
        coverImage,
        "body": select(${isAz} && defined(body_az) => body_az, body),
        seo
      }
    `
    );

    if (Array.isArray(data) && data.length > 0) {
      const seenIds = new Set<string>();
      const seenSlugs = new Set<string>();

      const mergedList = data.map((item: any) => {
        const slugKey = (typeof item.slug === "object" ? item.slug?.current : item.slug || "").toLowerCase().trim();
        const origSlugKey = (item.originalSlug || "").toLowerCase().trim();
        const idKey = (item._id || "").toLowerCase().trim();
        const titleKey = (item.title || "").toLowerCase().trim();

        seenIds.add(idKey);
        if (slugKey) seenSlugs.add(slugKey);
        if (origSlugKey) seenSlugs.add(origSlugKey);

        const ed = editorialMap.get(idKey) || 
                   editorialMap.get(slugKey) || 
                   editorialMap.get(origSlugKey) || 
                   editorialMap.get(titleKey) ||
                   getEditorialBlogBySlug(slugKey) ||
                   getEditorialBlogBySlug(idKey);

        if (ed) {
          const isSanityCoverValid = Boolean(
            item.coverImage && (item.coverImage.asset?._ref || item.coverImage.asset?.url || item.coverImage.url || item.coverImage.asset)
          );
          const effectiveCover = isSanityCoverValid
            ? item.coverImage
            : (ed.coverImage || item.coverImage);

          return {
            ...item,
            coverImage: effectiveCover,
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

      // Append any editorial master blogs that are not yet in Sanity
      MASTER_EDITORIAL_BLOGS.forEach((ed) => {
        const idKey = ed._id.toLowerCase().trim();
        const slugKey = (ed.slug?.current || "").toLowerCase().trim();
        const origSlugKey = (ed.originalSlug || "").toLowerCase().trim();

        if (!seenIds.has(idKey) && !seenSlugs.has(slugKey) && (!origSlugKey || !seenSlugs.has(origSlugKey))) {
          mergedList.push(isAz ? {
            ...ed,
            title: ed.title_az || ed.title,
            category: ed.category_az || ed.category,
            excerpt: ed.excerpt_az || ed.excerpt,
            body: (Array.isArray(ed.body_az) && ed.body_az.length > 0) ? ed.body_az : ed.body,
          } : ed);
        }
      });

      return mergedList;
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

export interface AuthorDocument {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  role_az?: string;
  bio?: string;
  bio_az?: string;
  image?: any;
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    behance?: string;
    instagram?: string;
  };
  isVerified?: boolean;
}

export async function fetchAuthorBySlug(slug: string, lang: string = "en"): Promise<AuthorDocument | null> {
  const cleanSlug = (slug || "").trim().toLowerCase();
  const isAz = lang === "az" || (typeof window !== "undefined" && window.location.pathname.startsWith("/az"));

  try {
    const data = await client.fetch(
      `
      *[_type == "author" && (slug.current == $cleanSlug || lower(name) == $cleanSlug || _id == $cleanSlug)][0]{
        _id,
        name,
        "slug": slug.current,
        "role": select(${isAz} && defined(role_az) => role_az, role),
        "bio": select(${isAz} && defined(bio_az) => bio_az, bio),
        image,
        socialLinks,
        isVerified
      }
      `,
      { cleanSlug }
    );

    if (data) return data;
  } catch (err) {
    console.warn("Could not fetch author from Sanity:", err);
  }

  // Fallback for primary founder/author
  if (cleanSlug === "ravan-mammadov" || cleanSlug === "ravan" || cleanSlug === "founder") {
    return {
      _id: "founder-ravan",
      name: "Ravan Mammadov",
      slug: "ravan-mammadov",
      role: isAz ? "Təsisçi və Kreativ Direktor" : "Founder & Creative Director",
      bio: isAz
        ? "Vizual mədəniyyət, brend arxitekturası, texnologiya və kreativ strategiyanın kəsişməsini araşdıran dizayner və marketoloq."
        : "Designer and marketer exploring the intersection of visual culture, brand architecture, technology, and creative strategy.",
      socialLinks: {
        website: "https://www.rvan.me",
        linkedin: "https://linkedin.com/in/ravanmammadov",
        twitter: "https://x.com/ravanmammadov",
        github: "https://github.com/ravanmammadov1",
      },
      isVerified: true,
    };
  }

  return null;
}

export async function fetchArticlesByAuthor(authorSlug: string, lang: string = "en"): Promise<BlogPost[]> {
  const allBlogs = await fetchAllBlogs(lang);
  const cleanSlug = (authorSlug || "").trim().toLowerCase();

  // If searching for primary author or all published
  if (cleanSlug === "ravan-mammadov" || cleanSlug === "ravan") {
    return allBlogs;
  }

  return allBlogs.filter((b) => {
    const aSlug = (b.authorSlug || b.authorName || "").toLowerCase().replace(/\s+/g, "-");
    return aSlug.includes(cleanSlug) || cleanSlug.includes(aSlug);
  });
}




