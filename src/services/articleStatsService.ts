import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from "firebase/firestore";

export interface ArticleStats {
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  readStarts?: number;
  readCompletions?: number;
  shares?: number;
}

export type ArticleReactionType = "like" | "dislike";

const STATS_COLLECTION = "article_stats";
const VOTES_COLLECTION = "article_votes";
const LOCAL_STORAGE_STATS_KEY = "rvan_article_stats_cache_v4";
const LOCAL_STORAGE_VOTES_KEY = "rvan_user_votes_cache_v4";

// In-memory guard to prevent duplicate view increments in the same session
const inMemoryViewLocks = new Set<string>();

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

export function getBaselineStats(postId: string): ArticleStats {
  const normId = normalizePostId(postId);
  let hash = 0;
  for (let i = 0; i < normId.length; i++) {
    hash = (hash << 5) - hash + normId.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const baseViews = 54 + (positive % 145); // Strictly in the 50–200 range
  const baseLikes = Math.max(4, Math.floor(baseViews * (0.055 + (positive % 20) / 1000)));
  const baseDislikes = positive % 8 === 0 ? 1 : 0;

  return {
    viewCount: baseViews,
    likeCount: baseLikes,
    dislikeCount: baseDislikes,
  };
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
 * Tracks and increments an article view with session deduplication.
 */
export async function trackArticleView(postId: string): Promise<number> {
  const normId = normalizePostId(postId);
  if (!normId) return 0;

  const sessionKey = `rvan_viewed_${normId}`;
  if (inMemoryViewLocks.has(normId)) {
    const cached = getLocalStatsCache()[normId] || getBaselineStats(normId);
    return cached?.viewCount || 1;
  }
  inMemoryViewLocks.add(normId);

  const alreadyViewedInSession = typeof window !== "undefined" && sessionStorage.getItem(sessionKey);

  const localCache = getLocalStatsCache();
  const baseline = getBaselineStats(normId);
  const currentStats = localCache[normId] || { ...baseline };
  
  if (!alreadyViewedInSession) {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(sessionKey, "1");
    }
    currentStats.viewCount = (currentStats.viewCount || baseline.viewCount) + 1;
    localCache[normId] = currentStats;
    setLocalStatsCache(localCache);

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
            viewCount: currentStats.viewCount,
            likeCount: currentStats.likeCount || baseline.likeCount,
            dislikeCount: currentStats.dislikeCount || baseline.dislikeCount,
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
 * Tracks reading progress milestones (25%, 50%, 75%, 100% completion)
 */
export async function trackReadingProgress(postId: string, milestone: "start" | 25 | 50 | 75 | 100) {
  const normId = normalizePostId(postId);
  if (!normId) return;

  const milestoneKey = `rvan_read_${normId}_${milestone}`;
  if (typeof window !== "undefined" && sessionStorage.getItem(milestoneKey)) {
    return; // Milestone already logged for this reader session
  }

  if (typeof window !== "undefined") {
    sessionStorage.setItem(milestoneKey, "1");
  }

  const localCache = getLocalStatsCache();
  const current = localCache[normId] || { viewCount: 1, likeCount: 0, dislikeCount: 0 };

  if (milestone === "start") {
    current.readStarts = (current.readStarts || 0) + 1;
  } else if (milestone === 100) {
    current.readCompletions = (current.readCompletions || 0) + 1;
  }

  localCache[normId] = current;
  setLocalStatsCache(localCache);

  if (db && (milestone === "start" || milestone === 100)) {
    try {
      const statsRef = doc(db, STATS_COLLECTION, normId);
      const field = milestone === "start" ? "readStarts" : "readCompletions";
      await updateDoc(statsRef, { [field]: increment(1) });
    } catch {}
  }
}

/**
 * Tracks real social shares or link copy
 */
export async function trackArticleShare(postId: string, platform: "copy" | "twitter" | "linkedin" | "native") {
  const normId = normalizePostId(postId);
  if (!normId) return;

  const localCache = getLocalStatsCache();
  const current = localCache[normId] || { viewCount: 1, likeCount: 0, dislikeCount: 0 };
  current.shares = (current.shares || 0) + 1;
  localCache[normId] = current;
  setLocalStatsCache(localCache);

  if (db) {
    try {
      const statsRef = doc(db, STATS_COLLECTION, normId);
      await updateDoc(statsRef, { shares: increment(1) });
    } catch {}
  }
}

/**
 * Subscribe to real-time stats for a specific article.
 */
export function subscribeToArticleStats(
  postId: string,
  onUpdate: (stats: ArticleStats) => void
): () => void {
  const normId = normalizePostId(postId);
  
  const localCache = getLocalStatsCache();
  const baseline = getBaselineStats(normId);
  const cached = localCache[normId] || { ...baseline };
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
            readStarts: data.readStarts || 0,
            readCompletions: data.readCompletions || 0,
            shares: data.shares || 0,
          };
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
    nextVote = null;
    if (voteType === "like") likeDelta = -1;
    if (voteType === "dislike") dislikeDelta = -1;
  } else if (previousVote === null) {
    nextVote = voteType;
    if (voteType === "like") likeDelta = 1;
    if (voteType === "dislike") dislikeDelta = 1;
  } else {
    nextVote = voteType;
    if (voteType === "like") {
      likeDelta = 1;
      dislikeDelta = -1;
    } else {
      dislikeDelta = 1;
      likeDelta = -1;
    }
  }

  stats.likeCount = Math.max(0, (stats.likeCount || 0) + likeDelta);
  stats.dislikeCount = Math.max(0, (stats.dislikeCount || 0) + dislikeDelta);
  localCache[normId] = stats;
  setLocalStatsCache(localCache);
  setLocalUserVote(normId, nextVote);

  if (db) {
    try {
      const statsRef = doc(db, STATS_COLLECTION, normId);
      const voteDocId = `${normId}_${userId}`;
      const voteRef = doc(db, VOTES_COLLECTION, voteDocId);

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

      await updateDoc(statsRef, {
        likeCount: increment(likeDelta),
        dislikeCount: increment(dislikeDelta),
        lastVotedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("[ArticleStats] Firestore reaction sync warning:", err);
    }
  }

  return { userVote: nextVote, stats };
}

export function getUserVoteForArticle(postId: string): ArticleReactionType | null {
  const normId = normalizePostId(postId);
  return getLocalUserVotes()[normId] || null;
}

export async function getUserArticleReaction(
  postId: string,
  userId?: string | null
): Promise<ArticleReactionType | null> {
  const normId = normalizePostId(postId);
  if (!normId) return null;

  // Check local cache first
  const localVotes = getLocalUserVotes();
  if (localVotes[normId] !== undefined) {
    return localVotes[normId];
  }

  if (db && userId) {
    try {
      const voteDocId = `${normId}_${userId}`;
      const voteRef = doc(db, VOTES_COLLECTION, voteDocId);
      const snap = await getDoc(voteRef);
      if (snap.exists()) {
        const val = snap.data()?.vote as ArticleReactionType | null;
        setLocalUserVote(normId, val);
        return val;
      }
    } catch {}
  }

  return null;
}

export async function fetchAllArticleStats(): Promise<Record<string, ArticleStats>> {
  const local = getLocalStatsCache();
  return local;
}


