import { useState } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import AuthModal from "../AuthModal";

interface CommentFormProps {
  onSubmit: (text: string) => Promise<void>;
  submitting: boolean;
  error?: string | null;
}

export default function CommentForm({ onSubmit, submitting: externalSubmitting, error }: CommentFormProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [localSubmitting, setLocalSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const isPosting = localSubmitting || externalSubmitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPosting) return;

    const submittedText = text;
    setText("");
    setLocalSubmitting(true);

    try {
      await onSubmit(submittedText);
    } catch (err) {
      console.error("Error submitting form:", err);
    } finally {
      setLocalSubmitting(false);
    }
  };


  if (!user) {
    return (
      <div className="relative rounded-2xl border border-border bg-card p-6 text-center backdrop-blur-xl shadow-sm">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          <Sparkles size={18} />
        </div>
        <h3 className="text-sm font-bold text-foreground tracking-tight mb-1">
          Join the Discussion
        </h3>
        <p className="text-xs text-muted-foreground font-medium max-w-md mx-auto mb-4 leading-relaxed">
          Sign in to leave a comment, share feedback, save your favorite design tools and bookmark resources.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface text-foreground font-semibold text-xs py-2.5 px-6 tracking-wide transition-all duration-300 hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : "U";

  return (
    <form onSubmit={handleSubmit} className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 backdrop-blur-xl shadow-sm">
      <div className="flex items-start gap-3">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || "User"}
            className="h-8 w-8 rounded-full object-cover border border-border shrink-0 mt-0.5"
          />
        ) : (
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground font-bold text-xs shrink-0 mt-0.5">
            {userInitial}
          </span>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-foreground truncate">
              {user.displayName || user.email?.split("@")[0]}
            </span>
            <span className="text-[10px] text-muted-foreground mono">
              {text.length}/1000
            </span>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Share your thoughts, feedback or questions..."
            className="w-full resize-y rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-background focus:outline-none transition-all duration-200"
          />

          {error && (
            <p className="mt-2 text-xs text-red-400 font-medium">{error}</p>
          )}

          <div className="mt-3 flex items-center justify-end">
            <button
              type="submit"
              disabled={!text.trim() || isPosting}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 mono uppercase"
            >
              {isPosting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Post Comment</span>
                </>
              )}
            </button>

          </div>
        </div>
      </div>
    </form>
  );
}
