import { useEffect, useState, useRef, useMemo } from "react";
import { Share2, Check, Copy, Twitter, Linkedin, MessageSquare } from "lucide-react";
import { Comment } from "../../types/comments";
import { subscribeToComments, addComment, updateComment, deleteComment } from "../../services/commentService";
import { useAuth } from "../../hooks/useAuth";
import { getSeedCommentsForPost } from "../../lib/seedCommentsRegistry";
import CommentForm from "./comments/CommentForm";
import CommentItemComponent from "./comments/CommentItem";

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const { user } = useAuth();
  const [firestoreComments, setFirestoreComments] = useState<Comment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lazy loading observer: initialize real-time listener when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  // Real-time Firestore Listener strictly filtered by postId
  useEffect(() => {
    if (!postId || !isVisible) return;

    const unsubscribe = subscribeToComments(
      postId,
      (updatedComments) => {
        setFirestoreComments(updatedComments);
      },
      (err) => {
        console.warn("[Comments Warning]:", err?.message);
      }
    );

    return () => unsubscribe();
  }, [postId, isVisible]);

  // Retrieve article-specific seed discussion comments
  const initialSeedComments = useMemo(() => {
    return getSeedCommentsForPost(postId);
  }, [postId]);

  // Combine Firestore user comments with article-specific initial seed comments
  const activeComments = useMemo(() => {
    if (firestoreComments.length > 0) {
      const existingIds = new Set(firestoreComments.map((c) => c.id));
      const uniqueSeeds = initialSeedComments.filter((c) => !existingIds.has(c.id));
      return [...firestoreComments, ...uniqueSeeds];
    }
    return initialSeedComments;
  }, [firestoreComments, initialSeedComments]);

  // Separate top-level comments and nested replies for this specific article/post
  const { topLevelComments, repliesMap, totalCount } = useMemo(() => {
    const topLevel: Comment[] = [];
    const replies: Record<string, Comment[]> = {};
    let count = 0;

    activeComments.forEach((c) => {
      // Data isolation check: Ensure comment belongs strictly to current postId
      if (c.postId === postId) {
        count++;
        if (c.parentId) {
          if (!replies[c.parentId]) replies[c.parentId] = [];
          replies[c.parentId].push(c);
        } else {
          topLevel.push(c);
        }
      }
    });

    return { topLevelComments: topLevel, repliesMap: replies, totalCount: count };
  }, [activeComments, postId]);

  // Add Comment (Top Level)
  const handleAddComment = async (text: string) => {
    if (!user || !postId) return;
    setSubmitting(true);
    setError(null);

    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      postId,
      authorId: user.uid,
      author: {
        uid: user.uid,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        photoURL: user.photoURL || null,
        email: user.email || null,
      },
      text: text.trim(),
      createdAt: new Date(),
      parentId: null,
      isOptimistic: true,
    };

    setFirestoreComments((prev) => [optimisticComment, ...prev]);

    try {
      await addComment({
        postId,
        author: optimisticComment.author,
        text,
        parentId: null,
      });
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      setError(err?.message || "Failed to post comment. Please try again.");
      setFirestoreComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } finally {
      setSubmitting(false);
    }
  };

  // Reply to a Comment (Threaded)
  const handleReplyComment = async (parentId: string, text: string) => {
    if (!user || !postId) return;
    setError(null);

    const optimisticReply: Comment = {
      id: `temp-reply-${Date.now()}`,
      postId,
      authorId: user.uid,
      author: {
        uid: user.uid,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        photoURL: user.photoURL || null,
        email: user.email || null,
      },
      text: text.trim(),
      createdAt: new Date(),
      parentId,
      isOptimistic: true,
    };

    setFirestoreComments((prev) => [...prev, optimisticReply]);

    try {
      await addComment({
        postId,
        author: optimisticReply.author,
        text,
        parentId,
      });
    } catch (err: any) {
      console.error("Error submitting reply:", err);
      setError(err?.message || "Failed to post reply.");
      setFirestoreComments((prev) => prev.filter((c) => c.id !== optimisticReply.id));
    }
  };

  // Update Comment
  const handleUpdateComment = async (commentId: string, newText: string) => {
    setError(null);
    try {
      await updateComment({ commentId, postId, text: newText });
    } catch (err: any) {
      console.error("Error updating comment:", err);
      setError(err?.message || "Failed to edit comment.");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId: string) => {
    setError(null);
    try {
      await deleteComment(commentId);
      setFirestoreComments((prev) => prev.filter((c) => c.id !== commentId && c.parentId !== commentId));
    } catch (err: any) {
      console.error("Error deleting comment:", err);
      setError(err?.message || "Failed to delete comment.");
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div ref={sectionRef} className="mt-16 border-t border-border pt-12">
      {/* Prominent Article Share Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8 mb-10">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground mono uppercase">
          <Share2 size={16} className="text-primary" />
          <span>Share Article</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:border-primary/50 hover:text-primary transition-all duration-200 glass-sm"
          >
            {copied ? (
              <>
                <Check size={14} className="text-primary" />
                <span className="text-primary font-bold">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground hover:border-primary/50 hover:text-primary transition-colors glass-sm"
            aria-label="Share on X"
          >
            <Twitter size={15} />
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground hover:border-primary/50 hover:text-primary transition-colors glass-sm"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={15} />
          </a>
        </div>
      </div>

      {/* Discussion Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={18} className="text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Discussion ({totalCount})
          </h2>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <CommentForm onSubmit={handleAddComment} submitting={submitting} error={error} />
      </div>

      {/* Comments & Threaded Replies List */}
      {topLevelComments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center backdrop-blur-xl">
          <MessageSquare size={24} className="mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm font-semibold text-foreground">No comments yet</p>
          <p className="text-xs text-muted-foreground mt-1">Be the first to start the discussion on this article.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topLevelComments.map((comment) => (
            <CommentItemComponent
              key={comment.id}
              comment={comment}
              replies={repliesMap[comment.id] || []}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReply={handleReplyComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
