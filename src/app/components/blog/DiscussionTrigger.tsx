import { MessageSquarePlus, ArrowDown, Sparkles } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { BlogDiscussionPrompt } from "../../../types/blog";

interface DiscussionTriggerProps {
  prompt?: BlogDiscussionPrompt;
  postTitle: string;
}

export default function DiscussionTrigger({ prompt, postTitle }: DiscussionTriggerProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const question = isAz
    ? prompt?.question_az || prompt?.question || "Bu təhlil haqqında sizin real təcrübəniz nədir?"
    : prompt?.question || prompt?.question_az || "What is your real-world perspective on this analysis?";

  const context = isAz
    ? prompt?.context_az || prompt?.context || "Fikrini səmimi bölüş, təcrübəni oxucularla paylaş."
    : prompt?.context || prompt?.context_az || "Share your authentic perspective and insights with fellow readers.";

  const handleScrollToComments = () => {
    const commentSection = document.getElementById("comments-section") || document.querySelector("textarea[placeholder]");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth", block: "center" });
      if (commentSection instanceof HTMLTextAreaElement) {
        commentSection.focus();
      } else {
        const textarea = commentSection.querySelector("textarea");
        if (textarea) textarea.focus();
      }
    }
  };

  return (
    <section className="relative my-12 overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 backdrop-blur-xl shadow-lg">
      {/* Subtle Background Glow */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Eyebrow badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
            <Sparkles size={12} />
            {isAz ? "Oxucu Müzakirəsi" : "Reader Discussion"}
          </span>
        </div>

        {/* Provocative Question */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-foreground leading-snug tracking-tight">
          {question}
        </h3>

        {/* Context / Prompt subtext */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {context}
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleScrollToComments}
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-xs font-mono font-bold tracking-wider text-black shadow-md transition-all duration-200 hover:scale-[1.02] hover:bg-primary/90 cursor-pointer"
          >
            <MessageSquarePlus size={15} />
            <span>{isAz ? "Fikrini Bölüş" : "Join Discussion"}</span>
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
