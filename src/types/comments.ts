import { Timestamp } from "firebase/firestore";

export interface CommentAuthor {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  email?: string | null;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: CommentAuthor;
  text: string;
  createdAt: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
  isEdited?: boolean;
  
  // Threaded replies, likes, dislikes, and rich reactions
  parentId?: string | null;
  likesCount?: number;
  likedBy?: string[];
  dislikesCount?: number;
  dislikedBy?: string[];
  reactions?: Record<string, string[]>; // { heart: ["uid1"], laugh: ["uid2"], fire: ["uid3"] }
  status?: "approved" | "pending" | "flagged";
  
  // Local UI metadata (optimistic updates)
  isOptimistic?: boolean;
}

export interface ReactionInput {
  commentId: string;
  reactionType: "heart" | "laugh" | "think" | "fire" | "insight" | "clap";
  userId: string;
}

export interface VoteInput {
  commentId: string;
  voteType: "like" | "dislike";
  userId: string;
}

export interface CreateCommentInput {
  postId: string;
  author: CommentAuthor;
  text: string;
  parentId?: string | null;
}

export interface UpdateCommentInput {
  commentId: string;
  postId: string;
  text: string;
}
