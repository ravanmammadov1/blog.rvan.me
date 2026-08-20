import { Comment, CreateCommentInput, UpdateCommentInput, VoteInput, ReactionInput } from "../types/comments";

const LOCAL_STORAGE_KEY = "rvan_comments_store_v2";

type CommentsSubscriber = (comments: Comment[]) => void;
const subscribers = new Map<string, Set<CommentsSubscriber>>();

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((c) => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
        }))
      : [];
  } catch {
    return [];
  }
}

function saveStoredComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.warn("Failed to persist comments to localStorage:", e);
  }
}

function notifySubscribers(postId: string) {
  const postSubs = subscribers.get(postId);
  if (!postSubs || postSubs.size === 0) return;

  const allComments = getStoredComments();
  const filtered = allComments
    .filter((c) => c.postId === postId)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

  postSubs.forEach((cb) => {
    try {
      cb(filtered);
    } catch (err) {
      console.error("Error in comments subscriber:", err);
    }
  });
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

  if (!subscribers.has(postId)) {
    subscribers.set(postId, new Set());
  }
  subscribers.get(postId)!.add(onCommentsUpdate);

  // Deliver current cached/stored comments immediately
  const initial = getStoredComments()
    .filter((c) => c.postId === postId)
    .sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  onCommentsUpdate(initial);

  // Also fetch any remotely approved comments from API
  if (typeof window !== "undefined") {
    fetch(`/api/comment?postId=${encodeURIComponent(postId)}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.comments)) {
            const remoteComments: Comment[] = data.comments.map((rc: any) => ({
              id: rc._id || rc.id,
              postId: rc.relatedPost?._ref || postId,
              authorId: rc.authorEmail || rc.authorId || "remote-user",
              author: {
                uid: rc.authorEmail || "remote-user",
                displayName: rc.authorName || "Anonymous Creator",
                photoURL: rc.authorPhoto || null,
                email: rc.authorEmail || null,
              },
              text: rc.commentText || rc.text || "",
              createdAt: rc.createdAt ? new Date(rc.createdAt) : new Date(),
              parentId: rc.parentId || null,
              likesCount: rc.likes || 0,
              dislikesCount: rc.dislikes || 0,
              reactions: rc.reactions || {},
              status: rc.status || "approved",
            }));

            // Merge remote comments with local comments
            const current = getStoredComments();
            const existingIds = new Set(current.map((c) => c.id));
            const newToSave = [...current];
            remoteComments.forEach((rc) => {
              if (!existingIds.has(rc.id)) {
                newToSave.push(rc);
              }
            });
            saveStoredComments(newToSave);
            notifySubscribers(postId);
          }
        }
      })
      .catch((err) => {
        // Silent catch for offline or dev mode
      });
  }

  return () => {
    const postSubs = subscribers.get(postId);
    if (postSubs) {
      postSubs.delete(onCommentsUpdate);
      if (postSubs.size === 0) {
        subscribers.delete(postId);
      }
    }
  };
}

/**
 * Add a new comment or reply.
 */
export async function addComment(input: CreateCommentInput): Promise<string> {
  if (!input.postId) throw new Error("postId is required to create a comment.");
  if (!input.text.trim()) throw new Error("Comment text cannot be empty.");

  const newCommentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newComment: Comment = {
    id: newCommentId,
    postId: input.postId,
    authorId: input.author.uid,
    author: {
      uid: input.author.uid,
      displayName: input.author.displayName || "User",
      photoURL: input.author.photoURL || null,
      email: input.author.email || null,
    },
    text: input.text.trim(),
    parentId: input.parentId || null,
    likesCount: 0,
    likedBy: [],
    dislikesCount: 0,
    dislikedBy: [],
    reactions: {},
    status: "approved",
    isEdited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 1. Immediately persist locally
  const current = getStoredComments();
  saveStoredComments([newComment, ...current]);
  notifySubscribers(input.postId);

  // 2. Dispatch to serverless backend in background
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          postId: input.postId,
          authorName: input.author.displayName || "User",
          authorEmail: input.author.email || `${input.author.uid}@rvan.me`,
          authorPhoto: input.author.photoURL || null,
          commentText: input.text.trim(),
          parentId: input.parentId || null,
        }),
      });
    } catch (e) {
      console.warn("Could not sync comment to remote server (stored locally):", e);
    }
  }

  return newCommentId;
}

/**
 * Edit an existing comment.
 */
export async function updateComment(input: UpdateCommentInput): Promise<void> {
  const current = getStoredComments();
  let updatedPostId = "";
  const next = current.map((c) => {
    if (c.id === input.commentId) {
      updatedPostId = c.postId;
      return {
        ...c,
        text: input.text.trim(),
        isEdited: true,
        updatedAt: new Date(),
      };
    }
    return c;
  });

  saveStoredComments(next);
  if (updatedPostId) {
    notifySubscribers(updatedPostId);
  }
}

/**
 * Delete a comment.
 */
export async function deleteComment(commentId: string): Promise<void> {
  const current = getStoredComments();
  const target = current.find((c) => c.id === commentId);
  const postId = target?.postId;

  // Also remove child replies
  const next = current.filter((c) => c.id !== commentId && c.parentId !== commentId);
  saveStoredComments(next);

  if (postId) {
    notifySubscribers(postId);
  }
}

/**
 * Vote on a comment (Like / Dislike).
 */
export async function voteComment(input: VoteInput): Promise<{ likes: number; dislikes: number }> {
  const current = getStoredComments();
  let postId = "";
  let updatedLikes = 0;
  let updatedDislikes = 0;

  const next = current.map((c) => {
    if (c.id === input.commentId) {
      postId = c.postId;
      const likedBy = new Set(c.likedBy || []);
      const dislikedBy = new Set(c.dislikedBy || []);

      if (input.voteType === "like") {
        if (likedBy.has(input.userId)) {
          likedBy.delete(input.userId); // Toggle off
        } else {
          likedBy.add(input.userId);
          dislikedBy.delete(input.userId); // Remove dislike if liked
        }
      } else if (input.voteType === "dislike") {
        if (dislikedBy.has(input.userId)) {
          dislikedBy.delete(input.userId); // Toggle off
        } else {
          dislikedBy.add(input.userId);
          likedBy.delete(input.userId); // Remove like if disliked
        }
      }

      updatedLikes = likedBy.size;
      updatedDislikes = dislikedBy.size;

      return {
        ...c,
        likesCount: updatedLikes,
        likedBy: Array.from(likedBy),
        dislikesCount: updatedDislikes,
        dislikedBy: Array.from(dislikedBy),
      };
    }
    return c;
  });

  saveStoredComments(next);
  if (postId) {
    notifySubscribers(postId);
  }

  // Sync vote to backend
  if (typeof window !== "undefined") {
    fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "vote",
        commentId: input.commentId,
        voteType: input.voteType,
        userId: input.userId,
      }),
    }).catch(() => {});
  }

  return { likes: updatedLikes, dislikes: updatedDislikes };
}

/**
 * React to a comment with an emoji/avatar (❤️, 😂, 💡, 🤔, 🔥, 👏).
 */
export async function reactToComment(input: ReactionInput): Promise<Record<string, string[]>> {
  const current = getStoredComments();
  let postId = "";
  let updatedReactions: Record<string, string[]> = {};

  const next = current.map((c) => {
    if (c.id === input.commentId) {
      postId = c.postId;
      const reactions = { ...(c.reactions || {}) };
      const currentList = new Set(reactions[input.reactionType] || []);

      if (currentList.has(input.userId)) {
        currentList.delete(input.userId); // Toggle off
      } else {
        currentList.add(input.userId); // Add reaction
      }

      reactions[input.reactionType] = Array.from(currentList);
      updatedReactions = reactions;

      return {
        ...c,
        reactions,
      };
    }
    return c;
  });

  saveStoredComments(next);
  if (postId) {
    notifySubscribers(postId);
  }

  // Sync reaction to backend
  if (typeof window !== "undefined") {
    fetch("/api/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "react",
        commentId: input.commentId,
        reactionType: input.reactionType,
        userId: input.userId,
      }),
    }).catch(() => {});
  }

  return updatedReactions;
}
