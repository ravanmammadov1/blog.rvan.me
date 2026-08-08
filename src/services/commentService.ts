import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  Timestamp
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Comment, CreateCommentInput, UpdateCommentInput } from "../types/comments";

const COMMENTS_COLLECTION = "comments";

/**
 * Subscribe to real-time comments for a specific blog post.
 * Returns unsubscribe function to clean up listener on component unmount.
 */
export function subscribeToComments(
  postId: string,
  onCommentsUpdate: (comments: Comment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!db) {
    console.warn("[Firestore] Database instance not available.");
    onCommentsUpdate([]);
    return () => {};
  }

  const commentsRef = collection(db, COMMENTS_COLLECTION);
  const q = query(
    commentsRef,
    where("postId", "==", postId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Comment[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          postId: data.postId,
          authorId: data.authorId || data.author?.uid,
          author: {
            uid: data.author?.uid || data.authorId,
            displayName: data.author?.displayName || "Anonymous Creator",
            photoURL: data.author?.photoURL || null,
            email: data.author?.email || null,
          },
          text: data.text || "",
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt || new Date(),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt || null,
          isEdited: data.isEdited || false,
          parentId: data.parentId || null,
          likesCount: data.likesCount || 0,
          likedBy: data.likedBy || [],
          status: data.status || "approved",
        };
      });
      onCommentsUpdate(items);
    },
    (err) => {
      console.error("[Firestore Comments Error]:", err);
      if (onError) onError(err);
    }
  );
}

/**
 * Add a new comment to Firestore using serverTimestamp.
 */
export async function addComment(input: CreateCommentInput): Promise<string> {
  if (!db) throw new Error("Firestore instance not initialized.");

  const commentsRef = collection(db, COMMENTS_COLLECTION);
  const docRef = await addDoc(commentsRef, {
    postId: input.postId,
    authorId: input.author.uid,
    author: {
      uid: input.author.uid,
      displayName: input.author.displayName || "Anonymous Creator",
      photoURL: input.author.photoURL || null,
      email: input.author.email || null,
    },
    text: input.text.trim(),
    parentId: input.parentId || null,
    likesCount: 0,
    likedBy: [],
    status: "approved",
    isEdited: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Edit an existing comment in Firestore.
 */
export async function updateComment(input: UpdateCommentInput): Promise<void> {
  if (!db) throw new Error("Firestore instance not initialized.");

  const docRef = doc(db, COMMENTS_COLLECTION, input.commentId);
  await updateDoc(docRef, {
    text: input.text.trim(),
    isEdited: true,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a comment from Firestore.
 */
export async function deleteComment(commentId: string): Promise<void> {
  if (!db) throw new Error("Firestore instance not initialized.");

  const docRef = doc(db, COMMENTS_COLLECTION, commentId);
  await deleteDoc(docRef);
}
