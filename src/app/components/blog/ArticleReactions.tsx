import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import {
  voteArticleReaction,
  subscribeToArticleStats,
  getUserArticleReaction,
  ArticleReactionType,
  ArticleStats,
} from "../../../services/articleStatsService";
import AuthModal from "../AuthModal";

interface ArticleReactionsProps {
  postId: string;
  postTitle?: string;
}

export default function ArticleReactions({ postId, postTitle }: ArticleReactionsProps) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAz = language === "az";

  const [stats, setStats] = useState<ArticleStats>({
    viewCount: 0,
    likeCount: 0,
    dislikeCount: 0,
  });
  const [userReaction, setUserReaction] = useState<ArticleReactionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Subscribe to real-time stats
  useEffect(() => {
    if (!postId) return;
    const unsubscribe = subscribeToArticleStats(postId, (updatedStats) => {
      setStats(updatedStats);
    });
    return () => unsubscribe();
  }, [postId]);

  // Fetch current user's reaction
  useEffect(() => {
    if (!postId) return;
    getUserArticleReaction(postId, user ? user.uid : null).then((reaction) => {
      setUserReaction(reaction);
    });
  }, [postId, user]);

  const handleVote = async (type: ArticleReactionType) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await voteArticleReaction(postId, user.uid, type);
      setUserReaction(res.userVote);
      setStats(res.stats);
    } catch (err) {
      console.error("Error voting on article:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="my-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/80 dark:border-white/10 dark:bg-white/[0.03] p-5 md:p-6 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isAz ? "Bu məqalə sizə faydalı oldu?" : "Was this article insightful?"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isAz
                ? "Fikrinizi bildirin və redaksiya keyfiyyətinə töhfə verin."
                : "Help shape our independent publication with your feedback."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={() => handleVote("like")}
            disabled={isSubmitting}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 mono cursor-pointer ${
              userReaction === "like"
                ? "bg-primary text-primary-foreground dark:text-black shadow-lg shadow-primary/20 scale-105 border border-primary"
                : "border border-border bg-background/80 dark:border-white/15 dark:bg-white/5 text-muted-foreground hover:border-primary/50 hover:bg-muted/60 hover:text-foreground"
            }`}
            title={isAz ? "Məqaləni Bəyən" : "Like Article"}
          >
            <ThumbsUp size={15} className={userReaction === "like" ? "fill-current" : ""} />
            <span>{isAz ? "Faydalı" : "Insightful"}</span>
            {stats.likeCount > 0 && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] ${
                  userReaction === "like" ? "bg-black/20 text-current font-extrabold" : "bg-primary/10 text-primary font-bold"
                }`}
              >
                {stats.likeCount}
              </span>
            )}
          </button>

          {/* Dislike Button */}
          <button
            onClick={() => handleVote("dislike")}
            disabled={isSubmitting}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-300 mono cursor-pointer ${
              userReaction === "dislike"
                ? "bg-rose-500/20 text-rose-500 border border-rose-500/50 shadow-lg shadow-rose-500/10 scale-105"
                : "border border-border bg-background/80 dark:border-white/15 dark:bg-white/5 text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground"
            }`}
            title={isAz ? "Təkmilləşdirmə Tələb Olunur" : "Needs Improvement"}
          >
            <ThumbsDown size={15} className={userReaction === "dislike" ? "fill-rose-500" : ""} />
            <span>{isAz ? "Zəif" : "Not really"}</span>
            {stats.dislikeCount > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.2 text-[10px] text-muted-foreground">
                {stats.dislikeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
