import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, Check, Copy, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";

import { fetchApprovedComments, submitComment, voteComment } from "../../lib/sanityQueries";
import { CommentItem } from "../../types/cms";

interface CommentSectionProps {
  postId: string;
  postTitle: string;
}

export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [votedComments, setVotedComments] = useState<string[]>([]);

  useEffect(() => {
    // Load voted comment IDs from localStorage
    const saved = localStorage.getItem("voted_comments");
    if (saved) {
      try {
        setVotedComments(JSON.parse(saved));
      } catch (e) {}
    }

    if (postId) {
      fetchApprovedComments(postId)
        .then((data) => setComments(data))
        .finally(() => setLoading(false));
    }
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !text.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitComment(postId, name, email, text);
      setSubmitted(true);
      setName("");
      setEmail("");
      setText("");
    } catch (err: any) {
      alert(`Failed to submit comment: ${err.message || "Please try again."}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (commentId: string, type: "like" | "dislike") => {
    if (votedComments.includes(commentId)) return;

    try {
      await voteComment(commentId, type);
      const updatedVotes = [...votedComments, commentId];
      setVotedComments(updatedVotes);
      localStorage.setItem("voted_comments", JSON.stringify(updatedVotes));

      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: type === "like" ? (c.likes || 0) + 1 : c.likes,
                dislikes: type === "dislike" ? (c.dislikes || 0) + 1 : c.dislikes,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Vote failed:", err);
    }
  };

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(currentUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="mt-16 border-t border-border pt-12">
      {/* Share Section */}
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-border pb-8 mb-12">
        <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground mono uppercase">
          <Share2 size={16} className="text-primary" />
          <span>SHARE THIS ESSAY</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs font-medium text-foreground hover:border-primary transition-colors"
          >
            {copied ? <Check size={14} className="text-primary" /> : <Copy size={14} />}
            <span>{copied ? "COPIED" : "COPY LINK"}</span>
          </button>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Share on X"
          >
            <Twitter size={15} />
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors"
            aria-label="Share on LinkedIn"
          >
            <Linkedin size={15} />
          </a>
        </div>
      </div>

      {/* Discussion Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="text-primary" size={20} />
        <h2 className="text-2xl font-semibold tracking-tight">Discussion ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      <div className="rounded-xl border border-border bg-surface p-6 mb-12">
        <h3 className="text-lg font-semibold mb-2">Leave a thought</h3>
        <p className="text-xs text-muted-foreground mb-6">
          Your email address is kept private for moderation purposes only.
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-primary/40 bg-primary/10 p-4 text-xs font-semibold text-primary mono"
          >
            ✓ Thank you! Your comment has been submitted and is pending review before appearing live.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">
                  NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">
                  EMAIL (PRIVATE)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1">
                COMMENT
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your perspective or experience..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-widest text-primary-foreground hover:bg-primary/90 transition-colors uppercase mono disabled:opacity-50"
            >
              {submitting ? "SUBMITTING..." : "POST COMMENT"}
            </button>
          </form>
        )}
      </div>

      {/* Approved Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-28 rounded-lg border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground italic py-6">
          No approved comments yet. Be the first to start the conversation!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const hasVoted = votedComments.includes(comment._id);
            const formattedTime = comment.createdAt
              ? format(new Date(comment.createdAt), "MMM d, yyyy · h:mm a")
              : "";

            return (
              <div
                key={comment._id}
                className="rounded-lg border border-border bg-surface/60 p-6 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-xs font-bold text-primary">
                      {comment.authorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{comment.authorName}</h4>
                      <p className="text-[10px] text-muted-foreground mono">{formattedTime}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-muted-foreground mb-4 pl-11">
                  {comment.commentText}
                </p>

                {/* Vote buttons */}
                <div className="flex items-center gap-4 pl-11">
                  <button
                    onClick={() => handleVote(comment._id, "like")}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      hasVoted
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{comment.likes || 0}</span>
                  </button>

                  <button
                    onClick={() => handleVote(comment._id, "dislike")}
                    disabled={hasVoted}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      hasVoted
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <ThumbsDown size={14} />
                    <span>{comment.dislikes || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
