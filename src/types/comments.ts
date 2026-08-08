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
  
  // Prepared architecture for future expansions (replies, likes, moderation)
  parentId?: string | null;
  likesCount?: number;
  likedBy?: string[];
  status?: "approved" | "pending" | "flagged";
  
  // Local UI metadata (optimistic updates)
  isOptimistic?: boolean;
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
