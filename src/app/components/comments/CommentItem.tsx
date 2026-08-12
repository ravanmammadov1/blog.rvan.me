import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Edit2, Trash2, Check, X, Loader2, CornerDownRight, Send } from "lucide-react";
import { Comment } from "../../../types/comments";
import { useAuth } from "../../../hooks/useAuth";
import AuthModal from "../AuthModal";

interface CommentItemProps {
  comment: Comment;
  replies?: Comment[];
  onUpdate: (commentId: string, newText: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  onReply: (parentId: string, text: string) => Promise<void>;
}

export default function CommentItemComponent({
  comment,
  replies = [],
  onUpdate,
  onDelete,
  onReply,
}: CommentItemProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isOwner = Boolean(user && user.uid === comment.authorId);

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
    if (!raw) return "Just now";
    try {
      const date = raw instanceof Date ? raw : new Date(raw);
      if (isNaN(date.getTime())) return "Just now";
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  const userInitial = comment.author.displayName
    ? comment.author.displayName.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="space-y-3">
      {/* Primary Comment Box */}
      <div
        className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
          comment.isOptimistic
            ? "border-primary/30 bg-primary/[0.02] opacity-75"
            : "border-border bg-card hover:border-primary/40 shadow-sm"
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {comment.author.photoURL ? (
            <img
              src={comment.author.photoURL}
              alt={comment.author.displayName}
              className="h-8 w-8 rounded-full object-cover border border-white/20 shrink-0 mt-0.5"
            />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/20 text-primary font-bold text-xs shrink-0 mt-0.5 border border-primary/30">
              {userInitial}
            </span>
          )}

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
                  <span className="text-[9px] text-muted-foreground/50 italic mono">(edited)</span>
                )}
                {comment.isOptimistic && (
                  <span className="text-[9px] text-primary/70 mono animate-pulse">(posting...)</span>
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
                        title="Edit comment"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="p-1 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete comment"
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
                    <X size={11} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editText.trim() || updating}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1 text-[10px] font-bold text-black hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {updating ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-[13px] leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap break-words mt-1">
                {comment.text}
              </p>
            )}

            {/* Reply trigger button */}
            {!isEditing && !comment.isOptimistic && (
              <div className="mt-2.5 flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!user) {
                      setAuthModalOpen(true);
                    } else {
                      setShowReplyForm(!showReplyForm);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  <CornerDownRight size={12} />
                  <span>Reply</span>
                </button>
              </div>
            )}

            {/* Delete Confirmation Overlay */}
            {showDeleteConfirm && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-red-300 font-medium">Delete this comment?</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1 text-[10px] font-bold text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting && <Loader2 size={10} className="animate-spin" />}
                    <span>Delete</span>
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
                    placeholder={`Reply to ${comment.author.displayName}...`}
                    className="w-full resize-y rounded-xl border border-white/15 bg-background/90 p-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
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
                    <span>Post Reply</span>
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
