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

function getGuestVoterId(): string {
  if (typeof window === "undefined") return "guest-default";
  let guestId = localStorage.getItem("rvan_guest_voter_uid");
  if (!guestId) {
    guestId = "guest-" + Math.random().toString(36).substring(2, 11);
    localStorage.setItem("rvan_guest_voter_uid", guestId);
  }
  return guestId;
}

export default function CommentItemComponent({
  comment,
  replies = [],
  onUpdate,
  onDelete,
  onReply,
}: CommentItemProps) {
  const { user, userPhoto } = useAuth();
  const { language } = useLanguage();
  const isAz = language === "az";

  const displayText = comment.text || comment.content || "";
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(displayText);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Voting & Reactions local state for instant feedback
  const currentUserId = user?.uid || getGuestVoterId();
  const isOwner = Boolean(user && user.uid === comment.authorId);

  const [localLikedBy, setLocalLikedBy] = useState<string[]>(
    Array.isArray(comment.likedBy) ? comment.likedBy : []
  );
  const [localDislikedBy, setLocalDislikedBy] = useState<string[]>(
    Array.isArray(comment.dislikedBy) ? comment.dislikedBy : []
  );
  const [localReactions, setLocalReactions] = useState<Record<string, string[]>>(
    comment.reactions || {}
  );

  const isLiked = localLikedBy.includes(currentUserId);
  const isDisliked = localDislikedBy.includes(currentUserId);

  const displayLikes = localLikedBy.length > 0
    ? localLikedBy.length
    : (typeof comment.likesCount === "number" ? comment.likesCount : (comment.likes || 0));

  const displayDislikes = localDislikedBy.length > 0
    ? localDislikedBy.length
    : (typeof comment.dislikesCount === "number" ? comment.dislikesCount : (comment.dislikes || 0));

  const displayAuthorName = comment.author?.displayName || comment.author?.name || "Anonim Oxucu";
  const avatarUri = (isOwner && userPhoto) ? userPhoto : (comment.author?.photoURL || comment.author?.avatar || null);
  const authorInitial = displayAuthorName ? displayAuthorName.charAt(0).toUpperCase() : "U";

  const handleVote = async (voteType: "like" | "dislike") => {
    const voterId = user?.uid || getGuestVoterId();

    // Optimistic UI updates
    if (voteType === "like") {
      if (localLikedBy.includes(voterId)) {
        setLocalLikedBy((prev) => prev.filter((id) => id !== voterId));
      } else {
        setLocalLikedBy((prev) => [...prev, voterId]);
        setLocalDislikedBy((prev) => prev.filter((id) => id !== voterId));
      }
    } else if (voteType === "dislike") {
      if (localDislikedBy.includes(voterId)) {
        setLocalDislikedBy((prev) => prev.filter((id) => id !== voterId));
      } else {
        setLocalDislikedBy((prev) => [...prev, voterId]);
        setLocalLikedBy((prev) => prev.filter((id) => id !== voterId));
      }
    }

    try {
      const res = await voteComment({
        commentId: comment.id,
        voteType,
        userId: voterId,
        type: voteType,
      });
      if (res && Array.isArray(res.likedBy)) setLocalLikedBy(res.likedBy);
      if (res && Array.isArray(res.dislikedBy)) setLocalDislikedBy(res.dislikedBy);
    } catch (e) {
      console.warn("Failed to register vote:", e);
    }
  };

  const handleReact = async (reactionType: string) => {
    setShowReactionPicker(false);
    const voterId = user?.uid || getGuestVoterId();

    const existingList = Array.isArray(localReactions[reactionType]) ? localReactions[reactionType] : [];
    const nextList = existingList.includes(voterId)
      ? existingList.filter((id) => id !== voterId)
      : [...existingList, voterId];

    setLocalReactions((prev) => ({
      ...prev,
      [reactionType]: nextList,
    }));

    try {
      const updated = await reactToComment({
        commentId: comment.id,
        reactionType,
        userId: voterId,
        type: reactionType,
      });
      if (updated) setLocalReactions(updated);
    } catch (e) {
      console.warn("Failed to register reaction:", e);
    }
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

  // If text is totally empty, hide comment from rendering
  if (!displayText.trim()) return null;

  return (
    <div id={`comment-${comment.id}`} className="space-y-3 scroll-mt-28">
      {/* Primary Comment Box */}
      <div
        className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
          comment.isOptimistic
            ? "border-primary/30 bg-primary/[0.02] opacity-75"
            : "border-border bg-card/90 hover:border-primary/40 shadow-xs"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Canonical Profile Avatar / Initial Badge */}
          {avatarUri ? (
            <img
              src={avatarUri}
              alt={displayAuthorName}
              className="h-9 w-9 rounded-full object-cover border border-border shrink-0 mt-0.5 shadow-xs bg-surface"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
              {authorInitial}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Header metadata */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-bold text-foreground truncate">
                  {displayAuthorName}
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
                        className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                        title={isAz ? "Düzəliş et" : "Edit comment"}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
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
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <X size={11} /> {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || updating}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-black hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    <span>{isAz ? "Saxla" : "Save"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-[13px] leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap break-words mt-1">
                {displayText}
              </p>
            )}

            {/* Active Emoji Reactions Badges */}
            {localReactions && Object.keys(localReactions).length > 0 && (
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                {REACTION_LIST.map((item) => {
                  const rawList = localReactions[item.type];
                  const uids = Array.isArray(rawList) ? rawList : [];
                  const count = uids.length;
                  if (count === 0) return null;
                  const hasUserReacted = uids.includes(currentUserId);

                  return (
                    <button
                      key={item.type}
                      onClick={() => handleReact(item.type)}
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border transition-all cursor-pointer ${
                        hasUserReacted
                          ? "border-primary/50 bg-primary/15 text-primary scale-105"
                          : "border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                      title={`${isAz ? item.labelAz : item.labelEn} (${count})`}
                    >
                      <span>{item.emoji}</span>
                      <span className="mono text-[10px] font-bold">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Action Bar (Likes, Dislikes, Reactions, Reply, Share) */}
            {!isEditing && !comment.isOptimistic && (
              <div className="mt-3 flex flex-wrap items-center gap-3 pt-2 border-t border-border/50 text-muted-foreground text-xs">
                {/* Like Button */}
                <button
                  onClick={() => handleVote("like")}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 ${
                    isLiked ? "text-emerald-400 font-bold bg-emerald-500/10" : "hover:text-emerald-400"
                  }`}
                  title={isAz ? "Bəyən" : "Like"}
                >
                  <ThumbsUp size={13} className={isLiked ? "fill-emerald-400" : ""} />
                  <span className="mono">{displayLikes}</span>
                </button>

                {/* Dislike Button */}
                <button
                  onClick={() => handleVote("dislike")}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-semibold transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5 ${
                    isDisliked ? "text-rose-400 font-bold bg-rose-500/10" : "hover:text-rose-400"
                  }`}
                  title={isAz ? "Bəyənmə" : "Dislike"}
                >
                  <ThumbsDown size={13} className={isDisliked ? "fill-rose-400" : ""} />
                  {displayDislikes > 0 ? (
                    <span className="mono">{displayDislikes}</span>
                  ) : null}
                </button>

                {/* Emoji Reaction Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowReactionPicker(!showReactionPicker)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-amber-400 transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
                    title={isAz ? "Reaksiya bildir" : "React"}
                  >
                    <Smile size={13} />
                    <span>{isAz ? "Reaksiya" : "React"}</span>
                  </button>

                  {/* Reaction Picker Popover */}
                  {showReactionPicker && (
                    <div className="absolute bottom-full left-0 mb-2 z-30 flex items-center gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
                      {REACTION_LIST.map((r) => (
                        <button
                          key={r.type}
                          onClick={() => handleReact(r.type)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-base hover:scale-125 hover:bg-white/10 transition-transform cursor-pointer"
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
                  className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-primary transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
                >
                  <CornerDownRight size={13} />
                  <span>{isAz ? "Cavabla" : "Reply"}</span>
                </button>

                {/* Share Link */}
                <button
                  onClick={handleShareComment}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold hover:text-cyan-400 transition-colors ml-auto cursor-pointer py-1 px-2 rounded-lg hover:bg-white/5"
                  title={isAz ? "Rəyi Paylaş" : "Share comment link"}
                >
                  {copiedLink ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400 font-bold">
                        {isAz ? "Kopyalandı!" : "Link Copied!"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Share2 size={13} />
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
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                  >
                    {deleting && <Loader2 size={10} className="animate-spin" />}
                    <span>{isAz ? "Bəli, Sil" : "Delete"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Inline Reply Form */}
            {showReplyForm && (
              <form onSubmit={handlePostReply} className="mt-3 pt-3 border-t border-border">
                <div className="flex items-start gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    maxLength={1000}
                    rows={2}
                    placeholder={
                      isAz
                        ? `${displayAuthorName} üçün cavabınızı yazın...`
                        : `Reply to ${displayAuthorName}...`
                    }
                    className="w-full resize-y rounded-xl border border-border bg-surface p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="rounded-lg border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {isAz ? "Ləğv et" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    disabled={!replyText.trim() || replySubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-black hover:bg-primary/90 disabled:opacity-40 cursor-pointer"
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
