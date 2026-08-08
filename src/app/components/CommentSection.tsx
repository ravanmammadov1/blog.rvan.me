import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Share2, Check, Copy, Twitter, Linkedin, MessageSquare, Loader2 } from "lucide-react";
import { Comment } from "../../types/comments";
import { subscribeToComments, addComment, updateComment, deleteComment } from "../../services/commentService";
import { useAuth } from "../../hooks/useAuth";
import CommentForm from "./comments/CommentForm";
import CommentItemComponent from "./comments/CommentItem";

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Lazy loading observer: only initialize real-time listener when section enters viewport
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

  // Real-time Firestore Listener
  useEffect(() => {
    if (!postId || !isVisible) return;

    setLoading(true);
    const unsubscribe = subscribeToComments(
      postId,
      (updatedComments) => {
        setComments(updatedComments);
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to load real-time comments.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [postId, isVisible]);

  // Optimistic Add Comment
  const handleAddComment = async (text: string) => {
    if (!user) return;
    setSubmitting(true);
    setError(null);

    // Create optimistic comment object
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
      isOptimistic: true,
    };

    setComments((prev) => [optimisticComment, ...prev]);

    try {
      await addComment({
        postId,
        author: optimisticComment.author,
        text,
      });
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      setError(err?.message || "Failed to post comment. Please try again.");
      // Rollback optimistic addition
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    } finally {
      setSubmitting(false);
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
      {/* Social Share Bar */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-8 mb-12">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground mono uppercase">
          <Share2 size={16} className="text-primary" />
          <span>Share Article</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:border-primary/50 transition-colors glass-sm"
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <MessageSquare size={18} className="text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Discussion ({comments.length})
          </h2>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-10">
        <CommentForm onSubmit={handleAddComment} submitting={submitting} error={error} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Loader2 size={24} className="animate-spin text-primary mb-2" />
          <span className="text-xs font-mono">Loading real-time comments...</span>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.01] p-8 text-center backdrop-blur-md">
          <p className="text-xs text-muted-foreground font-medium">
            No comments yet. Be the first to start the discussion!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItemComponent
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
