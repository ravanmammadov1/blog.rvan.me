import { Comment, CreateCommentInput, UpdateCommentInput, VoteInput, ReactionInput } from "../types/comments";

const LOCAL_STORAGE_KEY = "rvan_comments_store_v6";

type CommentsSubscriber = (comments: Comment[]) => void;
const subscribers = new Map<string, Set<CommentsSubscriber>>();

const CANONICAL_SLUG_MAP: Record<string, string> = {
  "salary-negotiation-psychology-harvard-method": "maas-danisigi-psixologiyasi-harvard-metodu",
  "maas-danisigi-psixologiyasi-harvard-metodu": "maas-danisigi-psixologiyasi-harvard-metodu",
  "blog-masterclass-maas-danisigi-psixologiyasi-harvard-metodu": "maas-danisigi-psixologiyasi-harvard-metodu",

  "why-beautiful-design-loses-money-nng-research": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
  "gozel-dizayn-niye-pul-itirir-nielsen-norman-group": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
  "blog-masterclass-gozel-dizayn-niye-pul-itirir-nielsen-norman-group": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",

  "why-large-followers-dont-equal-sales-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
  "izleyici-coxlugu-satis-getirmir-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
  "blog-masterclass-izleyici-coxlugu-satis-getirmir-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",

  "global-freelancing-upwork-linkedin-40-dollar-hour": "qlobal-frilans-upwork-linkedin-saati-40-dollar",
  "qlobal-frilans-upwork-linkedin-saati-40-dollar": "qlobal-frilans-upwork-linkedin-saati-40-dollar",
  "blog-masterclass-qlobal-frilans-upwork-linkedin-saati-40-dollar": "qlobal-frilans-upwork-linkedin-saati-40-dollar",

  "why-resumes-get-rejected-in-6-seconds-ats-secrets": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
  "cv-niye-6-saniyede-red-edilir-ats-sistemleri": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
  "blog-masterclass-cv-niye-6-saniyede-red-edilir-ats-sistemleri": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",

  "who-will-ai-replace-mit-stanford-studies": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
  "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
  "blog-masterclass-sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",

  "self-taught-ui-ux-designer-6-month-roadmap": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
  "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
  "blog-masterclass-sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",

  "building-selling-no-code-websites-framer-figma": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
  "kod-yazmadan-sayt-yigib-satmaq-framer-no-code": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
  "blog-masterclass-kod-yazmadan-sayt-yigib-satmaq-framer-no-code": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",

  "landing-first-client-zero-experience-value-audit": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
  "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
  "blog-masterclass-0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",

  "passive-income-digital-templates-figma-notion": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
  "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
  "blog-masterclass-reqemsal-sablonlar-sataraq-passiv-gelir-gumroad": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
};

export function getCanonicalPostId(postId: string): string {
  if (!postId) return "default";
  const clean = postId
    .toLowerCase()
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim();
  return CANONICAL_SLUG_MAP[clean] || clean;
}

export function normalizeComment(c: any): Comment | null {
  if (!c) return null;
  const rawText = c.text || c.content || c.commentText || "";
  const cleanText = typeof rawText === "string" ? rawText.trim() : "";
  if (!cleanText) return null; // Drop empty comments entirely

  const authorName = c.author?.displayName || c.author?.name || c.authorName || "Anonim Oxucu";
  const authorPhoto = c.author?.photoURL || c.author?.avatar || c.authorPhoto || null;
  const authorId = c.authorId || c.author?.uid || c.author?.id || "guest-user";
  const authorEmail = c.author?.email || c.authorEmail || null;
  const authorRole = c.author?.role || c.authorRole || "Oxucu";

  const likedBy: string[] = Array.isArray(c.likedBy) ? c.likedBy : [];
  const likesCount = typeof c.likesCount === "number"
    ? c.likesCount
    : (typeof c.likes === "number" ? c.likes : likedBy.length);

  const dislikedBy: string[] = Array.isArray(c.dislikedBy) ? c.dislikedBy : [];
  const dislikesCount = typeof c.dislikesCount === "number"
    ? c.dislikesCount
    : (typeof c.dislikes === "number" ? c.dislikes : dislikedBy.length);

  // Normalize reactions map: converts number values to array of dummy user ids or preserves string arrays
  let reactions: Record<string, string[]> = {};
  if (c.reactions && typeof c.reactions === "object") {
    Object.entries(c.reactions).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        reactions[key] = val;
      } else if (typeof val === "number" && val > 0) {
        reactions[key] = Array.from({ length: val }, (_, i) => `seed-user-${i + 1}`);
      }
    });
  }

  return {
    id: String(c.id || c._id || `comm-${Date.now()}`),
    postId: getCanonicalPostId(c.postId || c.relatedPost?._ref || ""),
    parentId: c.parentId || null,
    authorId,
    author: {
      uid: authorId,
      displayName: authorName,
      photoURL: authorPhoto,
      email: authorEmail,
      role: authorRole,
      name: authorName,
      avatar: authorPhoto || undefined,
      id: authorId,
    },
    text: cleanText,
    content: cleanText,
    createdAt: c.createdAt ? (c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt)) : new Date(),
    updatedAt: c.updatedAt ? (c.updatedAt instanceof Date ? c.updatedAt : new Date(c.updatedAt)) : undefined,
    isEdited: Boolean(c.isEdited),
    likesCount,
    likes: likesCount,
    likedBy,
    dislikesCount,
    dislikes: dislikesCount,
    dislikedBy,
    reactions,
    status: c.status || "approved",
    isOptimistic: Boolean(c.isOptimistic),
  };
}

export const COMMUNITY_SEED_THREADS: Comment[] = [];

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? (parsed.map((c) => normalizeComment(c)).filter(Boolean) as Comment[])
      : [];
    return list.filter((c) => !c.id.startsWith("seed-comm-") && !c.id.startsWith("comm-dyn-"));
  } catch {
    return [];
  }
}

function saveStoredComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try {
    // Only save normalized, non-empty comments
    const cleanList = comments.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
  } catch (e) {
    console.warn("Failed to persist comments to localStorage:", e);
  }
}

function notifySubscribers(postId: string) {
  const canonicalId = getCanonicalPostId(postId);
  const postSubs = subscribers.get(postId) || subscribers.get(canonicalId);
  if (!postSubs || postSubs.size === 0) return;

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  const allComments = getStoredComments();
  const filtered = allComments
    .filter((c) => getCanonicalPostId(c.postId) === canonicalId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));

  postSubs.forEach((cb) => {
    try {
      cb(filtered);
    } catch (err) {
      console.error("Error in comments subscriber:", err);
    }
  });
}

export function getDynamicCommentsForPost(_canonicalId: string): Comment[] {
  return [];
}

/**
 * Subscribe to comments for a specific post.
 */
export function subscribeToComments(
  postId: string,
  onCommentsUpdate: (comments: Comment[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!postId) {
    onCommentsUpdate([]);
    return () => {};
  }

  const canonicalId = getCanonicalPostId(postId);

  if (!subscribers.has(canonicalId)) {
    subscribers.set(canonicalId, new Set());
  }
  subscribers.get(canonicalId)!.add(onCommentsUpdate);

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  // Deliver current cached/stored comments immediately
  let initial = getStoredComments()
    .filter((c) => getCanonicalPostId(c.postId) === canonicalId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));

  if (initial.length === 0) {
    initial = getDynamicCommentsForPost(canonicalId);
  }

  onCommentsUpdate(initial);

  // Also fetch any remotely approved comments from API
  if (typeof window !== "undefined") {
    fetch(`/api/comment?postId=${encodeURIComponent(canonicalId)}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.comments) && data.comments.length > 0) {
            const remoteComments: Comment[] = data.comments
              .map((rc: any) =>
                normalizeComment({
                  id: rc._id || rc.id,
                  postId: getCanonicalPostId(rc.relatedPost?._ref || postId),
                  authorId: rc.authorEmail || rc.authorId || "remote-user",
                  author: {
                    uid: rc.authorEmail || "remote-user",
                    displayName: rc.authorName || "Anonymous Creator",
                    role: rc.authorRole || "Community Member",
                    photoURL: rc.authorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
                  },
                  text: rc.commentText || rc.text || "",
                  createdAt: rc.createdAt ? new Date(rc.createdAt) : new Date(),
                  likesCount: rc.likes || 0,
                  dislikesCount: rc.dislikes || 0,
                })
              )
              .filter(Boolean) as Comment[];

            const merged = [...initial];
            remoteComments.forEach((rc) => {
              if (!merged.some((m) => m.id === rc.id)) {
                merged.push(rc);
              }
            });
            onCommentsUpdate(merged.sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt)));
          }
        }
      })
      .catch((err) => {
        if (onError) onError(err);
      });
  }

  return () => {
    subscribers.get(canonicalId)?.delete(onCommentsUpdate);
  };
}

/**
 * Add a new top-level comment or reply to an existing comment
 */
export async function addComment(input: CreateCommentInput): Promise<Comment> {
  const canonicalId = getCanonicalPostId(input.postId);
  const textContent = (input.text || input.content || "").trim();
  if (!textContent) {
    throw new Error("Comment text cannot be empty.");
  }

  const rawComment: Comment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    postId: canonicalId,
    parentId: input.parentId || null,
    authorId: input.author?.uid || input.authorId || "user",
    author: input.author,
    text: textContent,
    content: textContent,
    createdAt: new Date(),
    likesCount: 0,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    reactions: {},
    replies: [],
  };

  const newComment = normalizeComment(rawComment)!;
  const stored = getStoredComments();
  stored.unshift(newComment);
  saveStoredComments(stored);
  notifySubscribers(canonicalId);

  // Sync to remote API
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: canonicalId,
          authorName: newComment.author.displayName,
          authorEmail: newComment.author.email || `${newComment.authorId}@rvan.me`,
          authorRole: newComment.author.role,
          authorPhoto: newComment.author.photoURL,
          commentText: newComment.text,
          parentId: newComment.parentId,
        }),
      });
    } catch (e) {
      console.warn("Failed to sync comment to remote API:", e);
    }
  }

  return newComment;
}

/**
 * Update existing comment content
 */
export async function updateComment(input: UpdateCommentInput): Promise<Comment> {
  const targetId = input.commentId || input.id;
  const textContent = (input.text || input.content || "").trim();
  if (!textContent) throw new Error("Comment text cannot be empty.");

  const stored = getStoredComments();
  const index = stored.findIndex((c) => c.id === targetId);
  if (index === -1) throw new Error("Comment not found.");

  stored[index] = {
    ...stored[index],
    text: textContent,
    content: textContent,
    updatedAt: new Date(),
    isEdited: true,
  };

  saveStoredComments(stored);
  notifySubscribers(stored[index].postId);
  return stored[index];
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<void> {
  const stored = getStoredComments();
  const target = stored.find((c) => c.id === id);
  if (!target) return;

  const filtered = stored.filter((c) => c.id !== id && c.parentId !== id);
  saveStoredComments(filtered);
  notifySubscribers(target.postId);
}

/**
 * Vote (like/dislike) on a comment with toggle support
 */
export async function voteComment(input: VoteInput): Promise<{ likes: number; dislikes: number; likedBy: string[]; dislikedBy: string[] }> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  const userId = input.userId || "anonymous-voter";
  const voteType = input.voteType || input.type || "like";

  if (!Array.isArray(comment.likedBy)) comment.likedBy = [];
  if (!Array.isArray(comment.dislikedBy)) comment.dislikedBy = [];

  if (voteType === "like") {
    if (comment.likedBy.includes(userId)) {
      // Toggle off like
      comment.likedBy = comment.likedBy.filter((uid) => uid !== userId);
    } else {
      // Add like and remove dislike if present
      comment.likedBy.push(userId);
      comment.dislikedBy = comment.dislikedBy.filter((uid) => uid !== userId);
    }
  } else if (voteType === "dislike") {
    if (comment.dislikedBy.includes(userId)) {
      // Toggle off dislike
      comment.dislikedBy = comment.dislikedBy.filter((uid) => uid !== userId);
    } else {
      // Add dislike and remove like if present
      comment.dislikedBy.push(userId);
      comment.likedBy = comment.likedBy.filter((uid) => uid !== userId);
    }
  }

  comment.likesCount = comment.likedBy.length;
  comment.likes = comment.likedBy.length;
  comment.dislikesCount = comment.dislikedBy.length;
  comment.dislikes = comment.dislikedBy.length;

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return {
    likes: comment.likesCount,
    dislikes: comment.dislikesCount,
    likedBy: comment.likedBy,
    dislikedBy: comment.dislikedBy,
  };
}

/**
 * React to a comment with an emoji (heart, laugh, fire, insight, etc.)
 */
export async function reactToComment(input: ReactionInput): Promise<Record<string, string[]>> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  const reactionType = input.reactionType || input.type || "heart";
  const userId = input.userId || "anonymous-voter";

  if (!comment.reactions) comment.reactions = {};
  const currentList = Array.isArray(comment.reactions[reactionType])
    ? comment.reactions[reactionType]
    : [];

  if (currentList.includes(userId)) {
    // Toggle off reaction
    comment.reactions[reactionType] = currentList.filter((uid) => uid !== userId);
  } else {
    // Add user reaction
    comment.reactions[reactionType] = [...currentList, userId];
  }

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return comment.reactions;
}
