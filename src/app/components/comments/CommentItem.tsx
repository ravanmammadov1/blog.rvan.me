import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  CornerDownRight,
  Send,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Smile,
} from "lucide-react";
import { Comment } from "../../../types/comments";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { voteComment, reactToComment } from "../../../services/commentService";
import { generateDeterministicPeep, peepConfigToSvgDataUri } from "../../../lib/avatarEngine";
import AuthModal from "../AuthModal";

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  onUpdate: (commentId: string, newText: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<void>;
}

const REACTION_LIST = [
  { type: "heart" as const, emoji: "❤️", labelEn: "Love", labelAz: "Sevimli" },
  { type: "laugh" as const, emoji: "😂", labelEn: "Funny", labelAz: "Gülməli" },
  { type: "fire" as const, emoji: "🔥", labelEn: "Awesome", labelAz: "Möhtəşəm" },
  { type: "insight" as const, emoji: "💡", labelEn: "Insightful", labelAz: "Dəyərli" },
  { type: "think" as const, emoji: "🤔", labelEn: "Thinking", labelAz: "Düşüncəli" },
  { type: "clap" as const, emoji: "👏", labelEn: "Clap", labelAz: "Əla" },
];

export default function CommentItemComponent({
  comment,
  replies = [],
  onUpdate,
  onDelete,
  onReply,
}: CommentItemProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isAz = language === "az";
  const isOwner = Boolean(user && user.uid === comment.authorId);
  const currentUserId = user?.uid || "";
  const isLiked = Boolean(currentUserId && comment.likedBy?.includes(currentUserId));
  const isDisliked = Boolean(currentUserId && comment.dislikedBy?.includes(currentUserId));

  // Determine Cheerful Avatar Fallback
  const avatarUri = comment.author.photoURL
    ? comment.author.photoURL
    : peepConfigToSvgDataUri(
        generateDeterministicPeep(comment.authorId || comment.author.displayName || "guest")
      );

  const handleVote = async (voteType: "like" | "dislike") => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    await voteComment({
      commentId: comment.id,
      voteType,
      userId: user.uid,
    });
  };

  const handleReact = async (reactionType: "heart" | "laugh" | "think" | "fire" | "insight" | "clap") => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setShowReactionPicker(false);
    await reactToComment({
      commentId: comment.id,
      reactionType,
      userId: user.uid,
    });
  };

  const handleShareComment = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.hash = `comment-${comment.id}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.toString());
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (e) {
      console.warn("Could not copy link:", e);
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || updating) return;
    setUpdating(true);
    try {
      await onUpdate(comment.id, editText);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update comment:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || replySubmitting) return;

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setReplySubmitting(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyForm(false);
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setReplySubmitting(false);
    }
  };

  const formatTimestamp = (raw: any) => {
    if (!raw) return isAz ? "İndicə" : "Just now";
    try {
      const date = raw instanceof Date ? raw : new Date(raw);
      if (isNaN(date.getTime())) return isAz ? "İndicə" : "Just now";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return isAz ? "İndicə" : "Just now";
    }
  };

  return (
    <div id={`comment-${comment.id}`} className="space-y-3 scroll-mt-28">
      {/* Primary Comment Box */}
      <div
        className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
          comment.isOptimistic
            ? "border-primary/30 bg-primary/[0.02] opacity-75"
            : "border-border bg-card/90 hover:border-primary/40 shadow-sm"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Cheerful / Google Avatar */}
          <img
            src={avatarUri}
            alt={comment.author.displayName}
            className="h-9 w-9 rounded-full object-cover border border-white/20 shrink-0 mt-0.5 shadow-sm bg-neutral-900"
          />

          <div className="flex-1 min-w-0">
            {/* Header metadata */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-bold text-foreground truncate">
                  {comment.author.displayName}
                </span>
                <span className="text-[10px] text-muted-foreground/60 mono">
                  {formatTimestamp(comment.createdAt)}
                </span>
                {comment.isEdited && (
                  <span className="text-[9px] text-muted-foreground/50 italic mono">
                    ({isAz ? "redaktə edilib" : "edited"})
                  </span>
                )}
                {comment.isOptimistic && (
                  <span className="text-[9px] text-primary/70 mono animate-pulse">
                    ({isAz ? "yayımlanır..." : "posting..."})
                  </span>
                )}
              </div>

              {/* Owner Actions */}
              {isOwner && !comment.isOptimistic && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isEditing && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                        title={isAz ? "Düzəliş et" : "Edit comment"}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title={isAz ? "Sil" : "Delete comment"}
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Comment Body / Edit Mode */}
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  maxLength={1000}
                  rows={2}
                  className="w-full resize-y rounded-xl border border-white/20 bg-background/80 p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={11} /> {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || updating}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-black hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {updating ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    <span>{isAz ? "Saxla" : "Save"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-[13px] leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap break-words mt-1">
                {comment.text}
              </p>
            )}

            {/* Active Emoji Reactions Badges */}
            {comment.reactions && Object.keys(comment.reactions).length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {REACTION_LIST.map((item) => {
                  const uids = comment.reactions?.[item.type] || [];
                  if (uids.length === 0) return null;
                  const hasUserReacted = Boolean(currentUserId && uids.includes(currentUserId));
                  return (
                    <button
                      key={item.type}
                      onClick={() => handleReact(item.type)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border transition-all ${
                        hasUserReacted
                          ? "border-primary/50 bg-primary/15 text-primary scale-105"
                          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                      }`}
                      title={`${isAz ? item.labelAz : item.labelEn} (${uids.length})`}
                    >
                      <span>{item.emoji}</span>
                      <span className="mono text-[10px] font-bold">{uids.length}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Bar (Likes, Dislikes, Reactions, Reply, Share) */}
            {!isEditing && !comment.isOptimistic && (
              <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-muted-foreground text-xs">
                {/* Like Button */}
                <button
                  onClick={() => handleVote("like")}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                    isLiked ? "text-emerald-400 font-bold" : "hover:text-emerald-400"
                  }`}
                  title={isAz ? "Bəyən" : "Like"}
                >
                  <ThumbsUp size={12} className={isLiked ? "fill-emerald-400" : ""} />
                  <span className="mono">{comment.likesCount || 0}</span>
                </button>

                {/* Dislike Button */}
                <button
                  onClick={() => handleVote("dislike")}
                  className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                    isDisliked ? "text-rose-400 font-bold" : "hover:text-rose-400"
                  }`}
                  title={isAz ? "Bəyənmə" : "Dislike"}
                >
                  <ThumbsDown size={12} className={isDisliked ? "fill-rose-400" : ""} />
                  {comment.dislikesCount && comment.dislikesCount > 0 ? (
                    <span className="mono">{comment.dislikesCount}</span>
                  ) : null}
                </button>

                {/* Emoji / Avatar Reaction Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-amber-400 transition-colors"
                    title={isAz ? "Reaksiya bildir" : "React"}
                  >
                    <Smile size={12} />
                    <span>{isAz ? "Reaksiya" : "React"}</span>
                  </button>

                  {/* Reaction Picker Popover */}
                  {showReactionPicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-30 flex items-center gap-1 rounded-2xl border border-white/15 bg-neutral-900/95 p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                      {REACTION_LIST.map((r) => (
                        <button
                          key={r.type}
                          onClick={() => handleReact(r.type)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-base hover:scale-125 hover:bg-white/10 transition-transform"
                          title={isAz ? r.labelAz : r.labelEn}
                        >
                          {r.emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reply Trigger */}
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthModalOpen(true);
                    } else {
                      setShowReplyForm(!showReplyForm);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-primary transition-colors"
                >
                  <CornerDownRight size={12} />
                  <span>{isAz ? "Cavabla" : "Reply"}</span>
                </button>

                {/* Share Link */}
                <button
                  onClick={handleShareComment}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-cyan-400 transition-colors ml-auto"
                  title={isAz ? "Rəyi Paylaş" : "Share comment link"}
                >
                  {copiedLink ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold">
                        {isAz ? "Kopyalandı!" : "Link Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 size={12} />
                      <span>{isAz ? "Paylaş" : "Share"}</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Delete Confirmation Overlay */}
            {showDeleteConfirm && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-red-300 font-medium">
                  {isAz ? "Bu rəyi silmək istədiyinizdən əminsiniz?" : "Delete this comment?"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting && <Loader2 size={10} className="animate-spin" />}
                    <span>{isAz ? "Bəli, Sil" : "Delete"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Inline Reply Form */}
            {showReplyForm && (
              <form onSubmit={handlePostReply} className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-start gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={1000}
                    rows={2}
                    placeholder={
                      isAz
                        ? `${comment.author.displayName} üçün cavabınızı yazın...`
                        : `Reply to ${comment.author.displayName}...`
                    }
                    className="w-full resize-y rounded-xl border border-white/15 bg-background/90 p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || replySubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-black hover:bg-primary/90 disabled:opacity-40"
                  >
                    {replySubmitting ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <Send size={11} />
                    )}
                    <span>{isAz ? "Cavabı Göndər" : "Post Reply"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Render Threaded Replies */}
      {replies.length > 0 && (
        <div className="ml-5 sm:ml-9 border-l-2 border-primary/20 pl-3 sm:pl-4 space-y-3">
          {replies.map((reply) => (
            <CommentItemComponent
              key={reply.id}
              comment={reply}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
