import {
  ArticleSubmission,
  ContributorApplication,
  ContributorStatus,
  ArticleAnalytics,
  ArticleDailyView,
  ArticleReport,
} from "../types/contributor";

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

  // Check if has published articles
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
    status: "APPROVED", // Auto-enable author workspace upon detailed application completion
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getLocalStorage<Record<string, ContributorApplication>>(
    APPLICATIONS_STORAGE_KEY,
    {}
  );
  current[appData.uid] = application;
  setLocalStorage(APPLICATIONS_STORAGE_KEY, current);

  // Send server-side email notification
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

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

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

  // Update daily timeline
  const dayEntryIndex = current.dailyViews.findIndex((d) => d.date === todayStr);
  if (dayEntryIndex >= 0) {
    current.dailyViews[dayEntryIndex].views += 1;
  } else {
    current.dailyViews.push({ date: todayStr, views: 1 });
  }

  // Keep last 30 days
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

  // Aggregate over submissions or direct author match
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

  // Send server-side notification email
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
