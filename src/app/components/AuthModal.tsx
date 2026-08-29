import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../lib/i18n/LanguageContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, loading: globalLoading, error: globalError, clearError } = useAuth();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      setLocalError(null);
      clearError?.();
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, clearError]);

  const isBusy = localLoading || globalLoading;
  const displayError = localError || globalError;

  const handleGoogleSignIn = async () => {
    if (isBusy) return;
    setLocalLoading(true);
    setLocalError(null);
    try {
      const user = await signIn();
      if (user) {
        onClose();
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setLocalError(err?.message || "Sign in failed. Please try again.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 1, 0.5, 1] } }}
            exit={{ opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl liquid-glass-card p-6 sm:p-8 shadow-2xl text-foreground"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-xl border border-border bg-muted/60 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Close dialog"
            >
              <X size={15} />
            </button>

            {/* Badge icon */}
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
              <Sparkles size={18} />
            </div>

            {/* Title & Description */}
            <h2 className="mb-2 text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t("signInTitle", "Sign in to Rvan.me")}
            </h2>
            <p className="mb-6 text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
              {t(
                "signInDesc",
                "Access your personal profile, customize your avatar, participate in article discussions, and save your preferences."
              )}
            </p>

            {/* Error Banner */}
            {displayError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{displayError}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-foreground text-background font-bold text-xs sm:text-sm py-3 px-6 tracking-wide transition-opacity hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm cursor-pointer"
            >
              {isBusy ? (
                <Loader2 className="w-4 h-4 animate-spin text-background" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              )}
              <span>{isBusy ? t("signingIn", "Signing in...") : t("continueWithGoogle", "Continue with Google")}</span>
            </button>

            {/* Secondary Links & Compliance */}
            <div className="mt-6 border-t border-border pt-4 flex items-center justify-center gap-4 text-[11px] font-mono tracking-wider text-muted-foreground">
              <Link
                to={getLocalizedPath("/privacy-policy")}
                onClick={onClose}
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                {t("privacyPolicy", "Privacy Policy")}
              </Link>
              <span className="text-border">·</span>
              <Link
                to={getLocalizedPath("/terms")}
                onClick={onClose}
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                {t("termsOfService", "Terms of Service")}
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
