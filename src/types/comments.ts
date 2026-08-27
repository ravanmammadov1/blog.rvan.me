export interface CommentAuthor {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  email?: string | null;
  role?: string | null;
  name?: string;
  avatar?: string;
  id?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: CommentAuthor;
  text: string;
  content?: string;
  createdAt: any;
  updatedAt?: any;
  isEdited?: boolean;
  
  // Threaded replies, likes, dislikes, and rich reactions
  parentId?: string | null;
  likesCount?: number;
  likedBy?: string[];
  dislikesCount?: number;
  dislikedBy?: string[];
  reactions?: Record<string, string[]>; // { heart: ["uid1", "uid2"], laugh: ["uid3"] }
  status?: "approved" | "pending" | "flagged";
  
  // Local UI metadata (optimistic updates)
  isOptimistic?: boolean;
  likes?: number;
  dislikes?: number;
  replies?: Comment[];
}

export interface ReactionInput {
  commentId: string;
  reactionType: "heart" | "laugh" | "think" | "fire" | "insight" | "clap" | string;
  userId: string;
  type?: string;
}

export interface VoteInput {
  commentId: string;
  voteType: "like" | "dislike";
  userId: string;
  type?: "like" | "dislike";
}

export interface CreateCommentInput {
  postId: string;
  author: CommentAuthor;
  text?: string;
  content?: string;
  authorId?: string;
  parentId?: string | null;
}

export interface UpdateCommentInput {
  commentId?: string;
  id?: string;
  postId?: string;
  text?: string;
  content?: string;
}
