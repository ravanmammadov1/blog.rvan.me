import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CANONICAL_AUTHOR } from "../lib/blogHelpers";
import {
  ArticleSubmission,
  ContributorApplication,
  ContributorStatus,
  ArticleAnalytics,
  ArticleDailyView,
  ArticleReport,
} from "../types/contributor";

export interface ContributorProfile {
  uid: string;
  slug: string;
  name: string;
  email: string;
  profileImage: string;
  professionalTitle: string;
  bio: string;
  location: string;
  currentWorkplace: string;
  experience: string;
  education: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    behance?: string;
    dribbble?: string;
    instagram?: string;
    website?: string;
  };
  status: "approved" | "pending" | "rejected" | "none";
  appliedAt?: string;
  approvedAt?: string;
  publishedArticlesCount: number;
}

export interface ContributorArticleDraft {
  id: string;
  authorUid: string;
  authorName: string;
  title: string;
  slug: string;
  category: string;
  topic?: string;
  language: "en" | "az";
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  status: "draft" | "submitted" | "changes_requested" | "published";
  reviewerFeedback?: string;
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
}

export interface ContributorDashboardStats {
  draftsCount: number;
  submittedCount: number;
  underReviewCount: number;
  changesRequestedCount: number;
  publishedCount: number;
  totalViews: number;
  totalComments: number;
  profileCompleteness: number;
}

const CONTRIBUTORS_COLLECTION = "contributors";
const DRAFTS_COLLECTION = "contributor_articles";
const LOCAL_CONTRIBUTOR_CACHE_KEY = "rvan_contributor_profile_cache_v1";

const SUBMISSIONS_STORAGE_KEY = "rvan_contributor_submissions_v1";
const APPLICATIONS_STORAGE_KEY = "rvan_contributor_applications_v1";
const ANALYTICS_STORAGE_KEY = "rvan_article_analytics_v1";
const REPORTS_STORAGE_KEY = "rvan_article_reports_v1";

function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalStorage<T>(key: string, data: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to persist key: ${key}`, e);
  }
}

// Canonical Founder Profile
export const FOUNDER_CONTRIBUTOR_PROFILE: ContributorProfile = {
  uid: "founder-ravan-mammadov",
  slug: "ravan-mammadov",
  name: "Ravan Mammadov",
  email: "mammadov@rvan.me",
  profileImage: "/imports/ravan_1-400.webp",
  professionalTitle: "Senior Creative Designer & Visual Strategist",
  bio: "Lead creator specializing in high-performance digital identity systems, visual hierarchy, behavioural psychology, and fluid design engineering.",
  location: "Baku, Azerbaijan",
  currentWorkplace: "RAM Holding",
  experience: "8+ years in Art Direction, Motion Design, Brand Identity & UI/UX Strategy",
  education: "Creative Direction & Interactive Visual Systems",
  skills: [
    "Brand Architecture",
    "Design Systems",
    "Motion Dynamics",
    "Typography Scaling",
    "Cognitive UX",
    "Creative Direction",
  ],
  socialLinks: {
    linkedin: "https://linkedin.com/in/ravanmammadov",
    behance: "https://behance.net/ravanmammadov",
    dribbble: "https://dribbble.com/ravanmammadov",
    instagram: "https://instagram.com/rvan.me",
    website: "https://www.rvan.me",
  },
  status: "approved",
  approvedAt: "2026-01-01T00:00:00Z",
  publishedArticlesCount: 39,
};

/**
 * Converts a person's display name into a clean, URL-safe slug with Azerbaijani transliteration support.
 */
export function slugifyAuthorName(name: string): string {
  if (!name || !name.trim()) return "author";
  return name
    .toLowerCase()
    .trim()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ç/g, "c")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "author";
}

/**
 * Builds a default ContributorProfile instance for an authenticated user.
 */
export function createDefaultContributorProfile(
  uid: string,
  name?: string | null,
  email?: string | null,
  photoURL?: string | null
): ContributorProfile {
  const cleanName = name?.trim() || "Contributor";
  return {
    uid,
    slug: slugifyAuthorName(cleanName),
    name: cleanName,
    email: email || "",
    profileImage: photoURL || "",
    professionalTitle: "Creative Contributor",
    bio: "",
    location: "Baku, Azerbaijan",
    currentWorkplace: "",
    experience: "",
    education: "",
    skills: [],
    socialLinks: {},
    status: "approved",
    appliedAt: new Date().toISOString(),
    publishedArticlesCount: 0,
  };
}

export function calculateProfileCompleteness(profile: Partial<ContributorProfile>): number {
  const fields = [
    Boolean(profile.name?.trim()),
    Boolean(profile.profileImage?.trim()),
    Boolean(profile.professionalTitle?.trim()),
    Boolean(profile.bio?.trim()),
    Boolean(profile.location?.trim()),
    Boolean(profile.currentWorkplace?.trim()),
    Boolean(profile.experience?.trim()),
    Boolean(profile.education?.trim()),
    Boolean(profile.skills && profile.skills.length > 0),
    Boolean(profile.socialLinks && Object.values(profile.socialLinks).some((v) => Boolean(v?.trim()))),
  ];

  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// ── 1. CONTRIBUTOR STATUS & APPLICATION ──

export function getContributorApplication(uid: string): ContributorApplication | null {
  if (!uid) return null;
  const applications = getLocalStorage<Record<string, ContributorApplication>>(
    APPLICATIONS_STORAGE_KEY,
    {}
  );
  return applications[uid] || null;
}

export function getContributorStatus(uid: string): ContributorStatus {
  if (!uid) return "NONE";
  const app = getContributorApplication(uid);
  if (!app) return "NONE";

  if (app.isVerifiedAuthor) return "VERIFIED";

  const userSubmissions = getSubmissionsByAuthor(uid);
  const hasPublished = userSubmissions.some((s) => s.status === "PUBLISHED");
  if (hasPublished) return "PUBLISHED";

  if (app.status === "APPROVED") return "APPROVED";
  if (app.status === "APPLICANT") return "APPLICANT";

  return "NONE";
}

export async function submitContributorApplication(
  appData: Omit<ContributorApplication, "submittedAt" | "status" | "updatedAt">
): Promise<ContributorApplication> {
  const application: ContributorApplication = {
    ...appData,
    status: "APPROVED",
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getLocalStorage<Record<string, ContributorApplication>>(
    APPLICATIONS_STORAGE_KEY,
    {}
  );
  current[appData.uid] = application;
  setLocalStorage(APPLICATIONS_STORAGE_KEY, current);

  if (typeof window !== "undefined") {
    try {
      await fetch("/api/contributor-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contributor_application",
          ...application,
        }),
      });
    } catch (e) {
      console.warn("Could not dispatch application notification email:", e);
    }
  }

  return application;
}

// ── 2. ARTICLE SUBMISSIONS & EDITORIAL LIFECYCLE ──

export function getSubmissionsByAuthor(authorId: string): ArticleSubmission[] {
  if (!authorId) return [];
  const all = getLocalStorage<ArticleSubmission[]>(SUBMISSIONS_STORAGE_KEY, []);
  return all
    .filter((s) => s.authorId === authorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSubmissionById(id: string): ArticleSubmission | null {
  if (!id) return null;
  const all = getLocalStorage<ArticleSubmission[]>(SUBMISSIONS_STORAGE_KEY, []);
  return all.find((s) => s.id === id) || null;
}

export async function submitArticle(
  data: Omit<ArticleSubmission, "id" | "createdAt" | "updatedAt" | "status">
): Promise<ArticleSubmission> {
  const newSubmission: ArticleSubmission = {
    ...data,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    analytics: {
      articleSlug: "",
      articleTitle: data.title,
      authorId: data.authorId,
      views: 0,
      reads: 0,
      commentsCount: 0,
      sharesCount: 0,
      dailyViews: [],
    },
  };

  const current = getLocalStorage<ArticleSubmission[]>(SUBMISSIONS_STORAGE_KEY, []);
  const updated = [newSubmission, ...current];
  setLocalStorage(SUBMISSIONS_STORAGE_KEY, updated);

  if (typeof window !== "undefined") {
    try {
      await fetch("/api/contributor-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "article_submission",
          ...newSubmission,
        }),
      });
    } catch (e) {
      console.warn("Could not dispatch draft notification email:", e);
    }
  }

  return newSubmission;
}

export function updateArticleSubmission(
  submissionId: string,
  updates: Partial<ArticleSubmission>
): ArticleSubmission | null {
  const current = getLocalStorage<ArticleSubmission[]>(SUBMISSIONS_STORAGE_KEY, []);
  const index = current.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const target = current[index];
  const updatedItem: ArticleSubmission = {
    ...target,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  current[index] = updatedItem;
  setLocalStorage(SUBMISSIONS_STORAGE_KEY, current);
  return updatedItem;
}

// ── 3. REAL ARTICLE ANALYTICS & INSIGHTS ──

export function trackArticleView(articleSlug: string, articleTitle: string = "", authorId: string = "") {
  if (!articleSlug || typeof window === "undefined") return;

  const cleanSlug = articleSlug.toLowerCase().trim();
  const allAnalytics = getLocalStorage<Record<string, ArticleAnalytics>>(ANALYTICS_STORAGE_KEY, {});
  const todayStr = new Date().toISOString().split("T")[0];

  const current = allAnalytics[cleanSlug] || {
    articleSlug: cleanSlug,
    articleTitle: articleTitle || cleanSlug,
    authorId: authorId,
    views: 0,
    reads: 0,
    commentsCount: 0,
    sharesCount: 0,
    dailyViews: [],
    lastViewedAt: new Date().toISOString(),
  };

  current.views += 1;
  current.lastViewedAt = new Date().toISOString();
  if (articleTitle) current.articleTitle = articleTitle;
  if (authorId) current.authorId = authorId;

  const dayEntryIndex = current.dailyViews.findIndex((d) => d.date === todayStr);
  if (dayEntryIndex >= 0) {
    current.dailyViews[dayEntryIndex].views += 1;
  } else {
    current.dailyViews.push({ date: todayStr, views: 1 });
  }

  if (current.dailyViews.length > 30) {
    current.dailyViews = current.dailyViews.slice(-30);
  }

  allAnalytics[cleanSlug] = current;
  setLocalStorage(ANALYTICS_STORAGE_KEY, allAnalytics);
}

export function trackArticleShare(articleSlug: string) {
  if (!articleSlug || typeof window === "undefined") return;
  const cleanSlug = articleSlug.toLowerCase().trim();
  const allAnalytics = getLocalStorage<Record<string, ArticleAnalytics>>(ANALYTICS_STORAGE_KEY, {});

  if (allAnalytics[cleanSlug]) {
    allAnalytics[cleanSlug].sharesCount = (allAnalytics[cleanSlug].sharesCount || 0) + 1;
    setLocalStorage(ANALYTICS_STORAGE_KEY, allAnalytics);
  }
}

export function getContributorAggregatedAnalytics(authorId: string) {
  const submissions = getSubmissionsByAuthor(authorId);
  const allAnalytics = getLocalStorage<Record<string, ArticleAnalytics>>(ANALYTICS_STORAGE_KEY, {});

  let totalViews = 0;
  let totalComments = 0;
  let totalShares = 0;
  const combinedDailyMap: Record<string, number> = {};

  Object.values(allAnalytics).forEach((item) => {
    if (item.authorId === authorId || submissions.some((s) => s.title === item.articleTitle)) {
      totalViews += item.views || 0;
      totalComments += item.commentsCount || 0;
      totalShares += item.sharesCount || 0;

      item.dailyViews?.forEach((d) => {
        combinedDailyMap[d.date] = (combinedDailyMap[d.date] || 0) + d.views;
      });
    }
  });

  const dailyViews: ArticleDailyView[] = Object.keys(combinedDailyMap)
    .sort()
    .slice(-14)
    .map((date) => ({ date, views: combinedDailyMap[date] }));

  return {
    totalViews,
    totalComments,
    totalShares,
    dailyViews,
    totalSubmissions: submissions.length,
    publishedCount: submissions.filter((s) => s.status === "PUBLISHED").length,
    underReviewCount: submissions.filter(
      (s) => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW"
    ).length,
    changesRequestedCount: submissions.filter((s) => s.status === "CHANGES_REQUESTED").length,
  };
}

// ── 4. ARTICLE REPORTING ──

export async function submitArticleReport(reportData: Omit<ArticleReport, "id" | "createdAt" | "status">) {
  const newReport: ArticleReport = {
    ...reportData,
    id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };

  const reports = getLocalStorage<ArticleReport[]>(REPORTS_STORAGE_KEY, []);
  reports.unshift(newReport);
  setLocalStorage(REPORTS_STORAGE_KEY, reports);

  if (typeof window !== "undefined") {
    try {
      await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });
    } catch (e) {
      console.warn("Could not dispatch report alert email:", e);
    }
  }

  return newReport;
}

// ── 5. FIRESTORE CONTRIBUTOR PROFILES & DASHBOARD ──

export async function getContributorProfile(uid: string): Promise<ContributorProfile | null> {
  if (!uid) return null;
  if (uid === "founder-ravan-mammadov" || uid === "ravan-mammadov") {
    return FOUNDER_CONTRIBUTOR_PROFILE;
  }

  // 1. Check local contributor profile cache
  try {
    const raw = localStorage.getItem(`${LOCAL_CONTRIBUTOR_CACHE_KEY}_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  // 2. Check local application submissions
  try {
    const apps = getLocalStorage<Record<string, ContributorApplication>>(
      APPLICATIONS_STORAGE_KEY,
      {}
    );
    const app = apps[uid];
    if (app) {
      const mapped: ContributorProfile = {
        uid: app.uid,
        slug: app.slug || slugifyAuthorName(app.displayName),
        name: app.displayName,
        email: app.email || "",
        profileImage: app.photoURL || "",
        professionalTitle: app.roleTitle || "Creative Contributor",
        bio: app.bio || "",
        location: app.location || "Baku, Azerbaijan",
        currentWorkplace: app.currentRole || "",
        experience: app.yearsOfExperience || "",
        education: "",
        skills: app.preferredTopics || [],
        socialLinks: app.socialLinks || {},
        status: app.status === "APPROVED" ? "approved" : "pending",
        appliedAt: app.submittedAt,
        publishedArticlesCount: 0,
      };
      return mapped;
    }
  } catch {}

  // 3. Query Firestore
  if (db) {
    try {
      const docRef = doc(db, CONTRIBUTORS_COLLECTION, uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as ContributorProfile;
        try {
          localStorage.setItem(`${LOCAL_CONTRIBUTOR_CACHE_KEY}_${uid}`, JSON.stringify(data));
        } catch {}
        return data;
      }
    } catch (err) {
      console.warn("[ContributorService] Error fetching profile:", err);
    }
  }

  return null;
}

export async function getPublicAuthorBySlug(slug: string): Promise<ContributorProfile | null> {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();

  if (cleanSlug === "ravan-mammadov" || cleanSlug === "ravanmammadov" || cleanSlug === "founder-ravan-mammadov" || cleanSlug === "founder") {
    return FOUNDER_CONTRIBUTOR_PROFILE;
  }

  // 1. Check local storage contributor profile caches
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_CONTRIBUTOR_CACHE_KEY)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const prof = JSON.parse(raw) as ContributorProfile;
            if (prof && prof.slug && prof.slug.toLowerCase() === cleanSlug) {
              return prof;
            }
          }
        }
      }
    } catch {}

    // 2. Check local applications
    try {
      const apps = getLocalStorage<Record<string, ContributorApplication>>(
        APPLICATIONS_STORAGE_KEY,
        {}
      );
      for (const app of Object.values(apps)) {
        const appSlug = (app.slug || slugifyAuthorName(app.displayName)).toLowerCase();
        if (appSlug === cleanSlug) {
          return {
            uid: app.uid,
            slug: appSlug,
            name: app.displayName,
            email: app.email || "",
            profileImage: app.photoURL || "",
            professionalTitle: app.roleTitle || "Creative Contributor",
            bio: app.bio || "",
            location: app.location || "Baku, Azerbaijan",
            currentWorkplace: app.currentRole || "",
            experience: app.yearsOfExperience || "",
            education: "",
            skills: app.preferredTopics || [],
            socialLinks: app.socialLinks || {},
            status: "approved",
            appliedAt: app.submittedAt,
            publishedArticlesCount: 0,
          };
        }
      }
    } catch {}
  }

  // 3. Query Firestore
  if (db) {
    try {
      const q = query(
        collection(db, CONTRIBUTORS_COLLECTION),
        where("slug", "==", cleanSlug)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as ContributorProfile;
      }
    } catch (err) {
      console.warn("[ContributorService] Error querying author:", err);
    }
  }

  return null;
}

export async function saveContributorProfile(
  uid: string,
  data: Partial<ContributorProfile>
): Promise<ContributorProfile> {
  const existing = await getContributorProfile(uid);
  const fallbackSlug = slugifyAuthorName(data.name || existing?.name || "author");
  const baseProfile = existing || createDefaultContributorProfile(uid, data.name, data.email, data.profileImage);

  const updated: ContributorProfile = {
    ...baseProfile,
    ...data,
    uid,
    slug: data.slug || baseProfile.slug || fallbackSlug,
  };

  try {
    localStorage.setItem(`${LOCAL_CONTRIBUTOR_CACHE_KEY}_${uid}`, JSON.stringify(updated));
  } catch {}

  if (db) {
    try {
      const docRef = doc(db, CONTRIBUTORS_COLLECTION, uid);
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn("[ContributorService] Error saving profile:", err);
    }
  }

  return updated;
}

export async function getContributorArticles(authorUid: string): Promise<ContributorArticleDraft[]> {
  const localKey = `rvan_contributor_articles_${authorUid}`;
  let localDrafts: ContributorArticleDraft[] = [];

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) localDrafts = JSON.parse(raw);
    } catch {}
  }

  if (db) {
    try {
      const q = query(
        collection(db, DRAFTS_COLLECTION),
        where("authorUid", "==", authorUid)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        const remoteDrafts = snap.docs.map((d) => d.data() as ContributorArticleDraft);
        if (typeof window !== "undefined") {
          localStorage.setItem(localKey, JSON.stringify(remoteDrafts));
        }
        return remoteDrafts;
      }
    } catch (err) {
      console.warn("[ContributorService] Error querying contributor articles:", err);
    }
  }

  return localDrafts;
}

export async function saveContributorArticle(
  draft: Partial<ContributorArticleDraft> & { authorUid: string; title: string }
): Promise<ContributorArticleDraft> {
  const draftId = draft.id || `draft-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const slug = (draft.title || "untitled-article")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const fullDraft: ContributorArticleDraft = {
    id: draftId,
    authorUid: draft.authorUid,
    authorName: draft.authorName || "Contributor",
    title: draft.title,
    slug,
    category: draft.category || "Design",
    topic: draft.topic,
    language: draft.language || "en",
    excerpt: draft.excerpt || "",
    content: draft.content || "",
    coverImageUrl: draft.coverImageUrl,
    status: draft.status || "draft",
    createdAt: draft.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const localKey = `rvan_contributor_articles_${draft.authorUid}`;
  if (typeof window !== "undefined") {
    try {
      const current = (await getContributorArticles(draft.authorUid)) || [];
      const updatedList = [
        fullDraft,
        ...current.filter((d) => d.id !== draftId),
      ];
      localStorage.setItem(localKey, JSON.stringify(updatedList));
    } catch {}
  }

  if (db) {
    try {
      const docRef = doc(db, DRAFTS_COLLECTION, draftId);
      await setDoc(docRef, fullDraft, { merge: true });
    } catch (err) {
      console.warn("[ContributorService] Error saving article draft:", err);
    }
  }

  return fullDraft;
}

export async function getContributorDashboardStats(
  authorUid: string,
  profile: ContributorProfile | null
): Promise<ContributorDashboardStats> {
  const articles = await getContributorArticles(authorUid);

  let draftsCount = 0;
  let submittedCount = 0;
  let underReviewCount = 0;
  let changesRequestedCount = 0;
  let publishedCount = 0;
  let totalViews = 0;

  articles.forEach((a) => {
    if (a.status === "draft") draftsCount++;
    else if (a.status === "submitted") submittedCount++;
    else if (a.status === "changes_requested") changesRequestedCount++;
    else if (a.status === "published") {
      publishedCount++;
      totalViews += a.viewCount || 0;
    }
  });

  if (authorUid === "founder-ravan-mammadov" || authorUid === "ravan-mammadov") {
    publishedCount = 39;
  }

  const profileCompleteness = profile ? calculateProfileCompleteness(profile) : 0;

  return {
    draftsCount,
    submittedCount,
    underReviewCount,
    changesRequestedCount,
    publishedCount,
    totalViews,
    totalComments: 0,
    profileCompleteness,
  };
}

export async function getApprovedContributors(): Promise<ContributorProfile[]> {
  const result: ContributorProfile[] = [FOUNDER_CONTRIBUTOR_PROFILE];

  // 1. Local contributor applications
  if (typeof window !== "undefined") {
    try {
      const apps = getLocalStorage<Record<string, ContributorApplication>>(
        APPLICATIONS_STORAGE_KEY,
        {}
      );
      Object.values(apps).forEach((app) => {
        if (app.uid !== FOUNDER_CONTRIBUTOR_PROFILE.uid && !result.some((r) => r.uid === app.uid)) {
          result.push({
            uid: app.uid,
            slug: app.slug || slugifyAuthorName(app.displayName),
            name: app.displayName,
            email: app.email || "",
            profileImage: app.photoURL || "",
            professionalTitle: app.roleTitle || "Creative Contributor",
            bio: app.bio || "",
            location: app.location || "Baku, Azerbaijan",
            currentWorkplace: app.currentRole || "",
            experience: app.yearsOfExperience || "",
            education: "",
            skills: app.preferredTopics || [],
            socialLinks: app.socialLinks || {},
            status: "approved",
            appliedAt: app.submittedAt,
            publishedArticlesCount: 0,
          });
        }
      });
    } catch {}
  }

  // 2. Firestore contributors
  if (db) {
    try {
      const q = query(
        collection(db, CONTRIBUTORS_COLLECTION),
        where("status", "==", "approved")
      );
      const snap = await getDocs(q);
      snap.forEach((d) => {
        const item = d.data() as ContributorProfile;
        if (item.uid !== FOUNDER_CONTRIBUTOR_PROFILE.uid && !result.some((r) => r.uid === item.uid)) {
          result.push(item);
        }
      });
    } catch (err) {
      console.warn("[ContributorService] Error getting approved contributors:", err);
    }
  }

  return result;
}
