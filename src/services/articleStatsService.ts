import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
  collection,
  getDocs,
} from "firebase/firestore";

export interface ArticleStats {
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
}

export type ArticleReactionType = "like" | "dislike";

const STATS_COLLECTION = "article_stats";
const VOTES_COLLECTION = "article_votes";
const LOCAL_STORAGE_STATS_KEY = "rvan_article_stats_cache_v1";
const LOCAL_STORAGE_VOTES_KEY = "rvan_user_votes_cache_v1";

// In-memory guard to prevent double-counting within the same page lifecycle
const inMemoryViewLocks = new Set<string>();

// Helpers for localStorage fallback & fast render cache
function getLocalStatsCache(): Record<string, ArticleStats> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalStatsCache(cache: Record<string, ArticleStats>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(cache));
  } catch {}
}

function getLocalUserVotes(): Record<string, ArticleReactionType> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_VOTES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setLocalUserVote(postId: string, reaction: ArticleReactionType | null) {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalUserVotes();
    if (reaction === null) {
      delete current[postId];
    } else {
      current[postId] = reaction;
    }
    localStorage.setItem(LOCAL_STORAGE_VOTES_KEY, JSON.stringify(current));
  } catch {}
}

/**
 * Standardize postId/slug key for consistent stats tracking
 */
export function normalizePostId(postId: string): string {
  if (!postId) return "default";
  return postId
    .toLowerCase()
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim();
}

/**
 * Tracks and increments an article view with StrictMode & Session deduplication.
 */
export async function trackArticleView(postId: string): Promise<number> {
  const normId = normalizePostId(postId);
  if (!normId) return 0;

  // 1. In-memory and Session Deduplication Guard
  const sessionKey = `rvan_viewed_${normId}`;
  if (inMemoryViewLocks.has(normId)) {
    const cached = getLocalStatsCache()[normId];
    return cached?.viewCount || 1;
  }
  inMemoryViewLocks.add(normId);

  const alreadyViewedInSession = typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

  // Update local cache immediately
  const localCache = getLocalStatsCache();
  const currentStats = localCache[normId] || { viewCount: 0, likeCount: 0, dislikeCount: 0 };
  
  if (!alreadyViewedInSession) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "1");
    }
    currentStats.viewCount = (currentStats.viewCount || 0) + 1;
    localCache[normId] = currentStats;
    setLocalStatsCache(localCache);

    // 2. Persist to Firestore if available
    if (db) {
      try {
        const statsRef = doc(db, STATS_COLLECTION, normId);
        const snap = await getDoc(statsRef);
        if (snap.exists()) {
          await updateDoc(statsRef, {
            viewCount: increment(1),
            lastViewedAt: new Date().toISOString(),
          });
        } else {
          await setDoc(statsRef, {
            viewCount: 1,
            likeCount: 0,
            dislikeCount: 0,
            createdAt: new Date().toISOString(),
            lastViewedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn("[ArticleStats] Firestore view increment skipped:", err);
      }
    }
  }

  return currentStats.viewCount;
}

/**
 * Subscribe to real-time stats for a specific article.
 */
export function subscribeToArticleStats(
  postId: string,
  onUpdate: (stats: ArticleStats) => void
): () => void {
  const normId = normalizePostId(postId);
  
  // Deliver cached value immediately
  const localCache = getLocalStatsCache();
  const cached = localCache[normId] || { viewCount: 0, likeCount: 0, dislikeCount: 0 };
  onUpdate(cached);

  if (!db) {
    return () => {};
  }

  try {
    const statsRef = doc(db, STATS_COLLECTION, normId);
    const unsubscribe = onSnapshot(
      statsRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const stats: ArticleStats = {
            viewCount: typeof data.viewCount === "number" ? data.viewCount : 0,
            likeCount: typeof data.likeCount === "number" ? data.likeCount : 0,
            dislikeCount: typeof data.dislikeCount === "number" ? data.dislikeCount : 0,
          };
          // Sync with local cache
          const c = getLocalStatsCache();
          c[normId] = stats;
          setLocalStatsCache(c);
          onUpdate(stats);
        }
      },
      (err) => {
        console.warn("[ArticleStats] Snapshot listener warning:", err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("[ArticleStats] Failed to initialize listener:", err);
    return () => {};
  }
}

/**
 * Cast or toggle an article Like or Dislike reaction.
 */
export async function voteArticleReaction(
  postId: string,
  userId: string,
  voteType: ArticleReactionType
): Promise<{ userVote: ArticleReactionType | null; stats: ArticleStats }> {
  const normId = normalizePostId(postId);
  if (!normId || !userId) {
    throw new Error("postId and authenticated userId are required.");
  }

  const localVotes = getLocalUserVotes();
  const previousVote = localVotes[normId] || null;
  const localCache = getLocalStatsCache();
  const stats = localCache[normId] || { viewCount: 0, likeCount: 0, dislikeCount: 0 };

  let nextVote: ArticleReactionType | null = null;
  let likeDelta = 0;
  let dislikeDelta = 0;

  if (previousVote === voteType) {
    // Toggling off existing vote
    nextVote = null;
    if (voteType === "like") likeDelta = -1;
    if (voteType === "dislike") dislikeDelta = -1;
  } else if (previousVote === null) {
    // Casting a new vote
    nextVote = voteType;
    if (voteType === "like") likeDelta = 1;
    if (voteType === "dislike") dislikeDelta = 1;
  } else {
    // Switching vote (e.g. from dislike to like)
    nextVote = voteType;
    if (voteType === "like") {
      likeDelta = 1;
      dislikeDelta = -1;
    } else {
      dislikeDelta = 1;
      likeDelta = -1;
    }
  }

  // Update local states
  stats.likeCount = Math.max(0, (stats.likeCount || 0) + likeDelta);
  stats.dislikeCount = Math.max(0, (stats.dislikeCount || 0) + dislikeDelta);
  localCache[normId] = stats;
  setLocalStatsCache(localCache);
  setLocalUserVote(normId, nextVote);

  // Persist to Firestore
  if (db) {
    try {
      const statsRef = doc(db, STATS_COLLECTION, normId);
      const voteDocId = `${normId}_${userId}`;
      const voteRef = doc(db, VOTES_COLLECTION, voteDocId);

      // Update vote record
      if (nextVote === null) {
        await setDoc(voteRef, { vote: null, updatedAt: new Date().toISOString() });
      } else {
        await setDoc(voteRef, {
          postId: normId,
          userId,
          vote: nextVote,
          updatedAt: new Date().toISOString(),
        });
      }

      // Update aggregation document
      const snap = await getDoc(statsRef);
      if (snap.exists()) {
        await updateDoc(statsRef, {
          likeCount: increment(likeDelta),
          dislikeCount: increment(dislikeDelta),
          updatedAt: new Date().toISOString(),
        });
      } else {
        await setDoc(statsRef, {
          viewCount: stats.viewCount || 1,
          likeCount: Math.max(0, likeDelta),
          dislikeCount: Math.max(0, dislikeDelta),
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("[ArticleStats] Firestore vote update error:", err);
    }
  }

  return { userVote: nextVote, stats };
}

/**
 * Get current authenticated user's active reaction on an article.
 */
export async function getUserArticleReaction(
  postId: string,
  userId: string | null
): Promise<ArticleReactionType | null> {
  const normId = normalizePostId(postId);
  if (!normId || !userId) return null;

  // Check local cache first
  const localVotes = getLocalUserVotes();
  if (localVotes[normId]) {
    return localVotes[normId];
  }

  if (db) {
    try {
      const voteDocId = `${normId}_${userId}`;
      const voteRef = doc(db, VOTES_COLLECTION, voteDocId);
      const snap = await getDoc(voteRef);
      if (snap.exists()) {
        const val = snap.data()?.vote as ArticleReactionType | null;
        setLocalUserVote(normId, val);
        return val;
      }
    } catch (err) {
      console.warn("[ArticleStats] Failed to retrieve user reaction:", err);
    }
  }

  return null;
}

/**
 * Fetch all stats for all articles (for listing & sorting views)
 */
export async function fetchAllArticleStats(): Promise<Record<string, ArticleStats>> {
  const local = getLocalStatsCache();
  if (!db) return local;

  try {
    const colRef = collection(db, STATS_COLLECTION);
    const snap = await getDocs(colRef);
    const result: Record<string, ArticleStats> = { ...local };

    snap.forEach((d) => {
      const data = d.data();
      result[d.id] = {
        viewCount: typeof data.viewCount === "number" ? data.viewCount : 0,
        likeCount: typeof data.likeCount === "number" ? data.likeCount : 0,
        dislikeCount: typeof data.dislikeCount === "number" ? data.dislikeCount : 0,
      };
    });

    setLocalStatsCache(result);
    return result;
  } catch (err) {
    console.warn("[ArticleStats] Error fetching all stats:", err);
    return local;
  }
}
