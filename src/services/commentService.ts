import { Comment, CreateCommentInput, UpdateCommentInput, VoteInput, ReactionInput } from "../types/comments";

const LOCAL_STORAGE_KEY = "rvan_comments_store_v2";

type CommentsSubscriber = (comments: Comment[]) => void;
const subscribers = new Map<string, Set<CommentsSubscriber>>();

const DEFAULT_SEED_COMMENTS: Comment[] = [
  {
    id: "seed-comm-1",
    postId: "maas-danisigi-psixologiyasi-harvard-metodu",
    authorId: "orxan-quliyev",
    author: {
      id: "orxan-quliyev",
      name: "Orxan Quliyev",
      role: "Lead Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Bizdə əksər şirkətlər 'Maaş gözləntiniz nədir?' sualını namizədi psixoloji cəhətdən sıxışdırmaq üçün verir. Kris Vossun 'Necə?' sualları metodunu son müsahibəmdə tətbiq etdim və təklifi 400 AZN artırmağa nail oldum. Çox dəyərli analizdir!",
    createdAt: new Date("2026-08-26T09:30:00.000Z"),
    likes: 19,
    dislikes: 0,
    reactions: { like: 19, heart: 8, celebrate: 5 },
    replies: [
      {
        id: "seed-comm-1-reply",
        postId: "maas-danisigi-psixologiyasi-harvard-metodu",
        authorId: "aydan-aliyeva",
        author: {
          id: "aydan-aliyeva",
          name: "Aydan Əliyeva",
          role: "HR & Talent Partner",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Tamamilə razıyam. HR olaraq deyə bilərəm ki, arqumentli 'Strateji Aralıq' verən namizədə dərhal peşəkar kimi baxırıq.",
        createdAt: new Date("2026-08-26T10:15:00.000Z"),
        likes: 12,
        dislikes: 0,
        reactions: { like: 12 },
      },
    ],
  },
  {
    id: "seed-comm-2",
    postId: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    authorId: "murad-hasanov",
    author: {
      id: "murad-hasanov",
      name: "Murad Həsənov",
      role: "E-Commerce Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Dribbble-dakı konseptlərin çoxu real istifadəçi psixologiyasını nəzərə almır. Bizim saytda One-Page Checkout tətbiq etdikdən sonra səbət tərki 64%-dən 38%-ə düşdü. Məqalədəki Baymard statistikası hər bir dizaynerin stolüstü qaydası olmalıdır.",
    createdAt: new Date("2026-08-25T14:20:00.000Z"),
    likes: 24,
    dislikes: 1,
    reactions: { like: 24, heart: 6 },
  },
  {
    id: "seed-comm-3",
    postId: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    authorId: "samir-mammadli",
    author: {
      id: "samir-mammadli",
      name: "Samir Məmmədli",
      role: "Growth Marketer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    },
    content: "50k izləyicili səhifələrin satış edə bilməməsinin əsas səbəbi auditoriyanın güvəninin olmamasıdır. Çaldininin sosial sübut və qarşılıqlılıq prinsipləri dəqiq işləyir. Məzmun strategiyamızı bu 3 pilləli qıfa uyğunlaşdırdıq.",
    createdAt: new Date("2026-08-24T18:00:00.000Z"),
    likes: 16,
    dislikes: 0,
    reactions: { like: 16, celebrate: 4 },
  },
  {
    id: "seed-comm-4",
    postId: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
    authorId: "elmir-rzayev",
    author: {
      id: "elmir-rzayev",
      name: "Elmir Rzayev",
      role: "Senior UI/UX Freelancer",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Upwork-də 90 saniyəlik Loom videosu göndərmək təklifin qəbul edilmə şansını ən azı 3 qat artırır. Yerli bazarda ilişib qalmaq vaxt itkisidir, qlobal bazar böyükdür və ödəniş qabiliyyəti qat-qat yüksəkdir.",
    createdAt: new Date("2026-08-23T11:45:00.000Z"),
    likes: 31,
    dislikes: 0,
    reactions: { like: 31, heart: 14, celebrate: 9 },
  },
  {
    id: "seed-comm-5",
    postId: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    authorId: "nigar-ahmadova",
    author: {
      id: "nigar-ahmadova",
      name: "Nigar Əhmədova",
      role: "HR Consultant",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Google-un XYZ formulu CV-ni adi vəzifə siyahısından çıxarıb biznes təsir sənədinə çevirir. Canva dizaynlarının ATS sistemlərindən keçməməsi faktını hər gün görürük. Tək sütunlu, təmiz format ən yaxşısıdır.",
    createdAt: new Date("2026-08-22T16:10:00.000Z"),
    likes: 27,
    dislikes: 0,
    reactions: { like: 27, heart: 11 },
  },
];

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") return DEFAULT_SEED_COMMENTS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_COMMENTS));
      return DEFAULT_SEED_COMMENTS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? parsed.map((c) => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
        }))
      : [];
    return list.length > 0 ? list : DEFAULT_SEED_COMMENTS;
  } catch {
    return DEFAULT_SEED_COMMENTS;
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

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  const allComments = getStoredComments();
  const filtered = allComments
    .filter((c) => c.postId === postId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));

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

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  // Deliver current cached/stored comments immediately
  const initial = getStoredComments()
    .filter((c) => c.postId === postId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));
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
