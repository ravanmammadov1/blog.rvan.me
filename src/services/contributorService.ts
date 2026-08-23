import { ArticleSubmission, ContributorProfile } from "../types/contributor";

const SUBMISSIONS_STORAGE_KEY = "rvan_contributor_submissions_v1";
const PROFILES_STORAGE_KEY = "rvan_contributor_profiles_v1";

function getStoredSubmissions(): ArticleSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveStoredSubmissions(submissions: ArticleSubmission[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(submissions));
  } catch (e) {
    console.warn("Failed to persist contributor submissions:", e);
  }
}

/**
 * Retrieves all article submissions for a specific contributor.
 */
export function getSubmissionsByAuthor(authorId: string): ArticleSubmission[] {
  if (!authorId) return [];
  const all = getStoredSubmissions();
  return all
    .filter((s) => s.authorId === authorId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * Creates and submits a new contributor article for editorial review.
 */
export async function submitArticle(
  data: Omit<ArticleSubmission, "id" | "createdAt" | "updatedAt" | "status">
): Promise<ArticleSubmission> {
  const newSubmission: ArticleSubmission = {
    ...data,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    status: "SUBMITTED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const current = getStoredSubmissions();
  const updated = [newSubmission, ...current];
  saveStoredSubmissions(updated);

  // If a backend API is available, forward submission
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/contributor-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSubmission),
      });
    } catch (e) {
      // Graceful offline/local persistence
    }
  }

  return newSubmission;
}

/**
 * Retrieves or initializes a contributor profile for an authenticated user.
 */
export function getContributorProfile(uid: string): ContributorProfile | null {
  if (!uid || typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${PROFILES_STORAGE_KEY}_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

/**
 * Saves or updates contributor profile information.
 */
export function saveContributorProfile(profile: ContributorProfile) {
  if (!profile.uid || typeof window === "undefined") return;
  try {
    localStorage.setItem(
      `${PROFILES_STORAGE_KEY}_${profile.uid}`,
      JSON.stringify({
        ...profile,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (e) {
    console.warn("Failed to persist contributor profile:", e);
  }
}
