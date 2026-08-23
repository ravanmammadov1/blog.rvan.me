import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, AlertCircle, CheckCircle2, FileText, Info } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { submitArticle } from "../../../services/contributorService";
import { AiDisclosureLevel } from "../../../types/contributor";

interface ArticleSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function ArticleSubmissionModal({
  isOpen,
  onClose,
  onSubmitted,
}: ArticleSubmissionModalProps) {
  const { user, userPhoto } = useAuth();
  const { language } = useLanguage();
  const isAz = language === "az";

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("design");
  const [articleLang, setArticleLang] = useState<"az" | "en" | "tr">(isAz ? "az" : "en");
  const [content, setContent] = useState("");
  const [sources, setSources] = useState("");
  const [aiDisclosure, setAiDisclosure] = useState<AiDisclosureLevel>("none");
  const [aiNotes, setAiNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError(isAz ? "Zəhmət olmasa əvvəlcə daxil olun." : "Please sign in first.");
      return;
    }
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError(
        isAz
          ? "Başlıq, xülasə və məqalə mətni mütləq daxil edilməlidir."
          : "Title, excerpt, and article content are required."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitArticle({
        authorId: user.uid,
        author: {
          uid: user.uid,
          displayName: user.displayName || "Contributor",
          email: user.email,
          photoURL: userPhoto || user.photoURL,
        },
        title: title.trim(),
        excerpt: excerpt.trim(),
        category,
        language: articleLang,
        content: content.trim(),
        sources: sources.trim() || undefined,
        aiDisclosure,
        aiNotes: aiNotes.trim() || undefined,
      });

      setSuccess(true);
      if (onSubmitted) onSubmitted();
    } catch (err: any) {
      setError(err?.message || "Failed to submit article draft.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setExcerpt("");
    setContent("");
    setSources("");
    setAiDisclosure("none");
    setAiNotes("");
    setSuccess(false);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 text-foreground z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[.18em] text-primary mono">
                  {isAz ? "REDASİYA TƏQDİMATI" : "EDITORIAL SUBMISSION"}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-0.5">
                  {isAz ? "Yeni Məqalə Təqdim Edin" : "Submit an Article Draft"}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="py-10 text-center space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-primary">
                  <CheckCircle2 size={32} />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h4 className="text-xl font-bold text-foreground">
                    {isAz ? "Məqaləniz Redaksiyaya Təqdim Olundu!" : "Draft Submitted for Review!"}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Təşəkkür edirik! Redaksiya heyəti yazınızı nəzərdən keçirəcək. Təsdiq olunduqdan sonra məqaləniz adınız və müəllif profilinizlə Rvan.me-də yayımlanacaq."
                      : "Thank you! Our editorial team will review your draft. Once approved, your article will be published under your author profile on Rvan.me."}
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity"
                  >
                    {isAz ? "BAĞLA" : "DONE"}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="overflow-y-auto space-y-6 pr-1">
                {error && (
                  <div className="p-3.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Article Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                    {isAz ? "Məqalənin Başlığı" : "Article Title"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      isAz
                        ? "Məsələn: Azərbaycan Dizayn Bazarında Şəbəkə Arxitekturasının Rolu"
                        : "e.g. The Architecture of Modern Visual Identity Systems"
                    }
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Category & Language Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                      {isAz ? "Mövzu / Kateqoriya" : "Topic / Category"} *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="design">{isAz ? "Dizayn" : "Design"}</option>
                      <option value="marketing">{isAz ? "Marketinq" : "Marketing"}</option>
                      <option value="branding">{isAz ? "Brendinq" : "Branding"}</option>
                      <option value="ai-creativity">{isAz ? "Süni İntellekt və Yaradıcılıq" : "AI & Creativity"}</option>
                      <option value="creative-industry">{isAz ? "Kreativ Sənaye" : "Creative Industry"}</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                      {isAz ? "Məqalənin Dili" : "Article Language"} *
                    </label>
                    <select
                      value={articleLang}
                      onChange={(e) => setArticleLang(e.target.value as any)}
                      className="w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="az">Azərbaycan Dili (AZ)</option>
                      <option value="en">English (EN)</option>
                      <option value="tr">Türkçe (TR)</option>
                    </select>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                    {isAz ? "Qısa Xülasə / Excerpt" : "Short Excerpt"} *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder={
                      isAz
                        ? "Məqalənin əsas qayəsi haqqında 2-3 cümləlik qısa xülasə."
                        : "A concise 2-3 sentence overview of what readers will learn."
                    }
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Article Draft Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono flex items-center justify-between">
                    <span>{isAz ? "Məqalə Mətni (Markdown dəstəklənir)" : "Article Body (Markdown Supported)"} *</span>
                    <span className="text-[10px] text-muted-foreground font-normal lowercase">{content.length} characters</span>
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={
                      isAz
                        ? "Məqalənizi buraya daxil edin. Başlıqlar üçün # və ##, siyahılar üçün - istifadə edə bilərsiniz..."
                        : "Write your article draft here. You can use markdown headings (#, ##), bullet points (-), and quotes (>)..."
                    }
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-sans leading-relaxed"
                  />
                </div>

                {/* Sources & References */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                    {isAz ? "Mənbələr və İstinadlar (İxtiyari)" : "Sources & References (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={sources}
                    onChange={(e) => setSources(e.target.value)}
                    placeholder={isAz ? "İstifadə etdiyiniz araşdırma və ya mənbə linkləri" : "Links to studies, articles, or data sources"}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* AI Policy & Transparent Disclosure */}
                <div className="p-4 rounded-xl border border-border bg-surface/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                      {isAz ? "Süni İntellekt (AI) İstifadə Bəyanatı" : "AI Assistance Disclosure"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isAz
                      ? "Rvan.me məsuliyyətli AI köməkçilərinin istifadəsini dəstəkləyir (araşdırma, qrammatika, redaktə). Lakin yazı müəllifin şəxsi baxış bucağını və təcrübəsini əks etdirməlidir."
                      : "Rvan.me supports responsible AI assistance for research, drafting, and editing. We ask for transparency regarding AI usage."}
                  </p>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="aiDisclosure"
                        value="none"
                        checked={aiDisclosure === "none"}
                        onChange={() => setAiDisclosure("none")}
                        className="text-primary"
                      />
                      <span>{isAz ? "Süni intellektdən istifadə etməmişəm" : "I did not use AI"}</span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="aiDisclosure"
                        value="assisted"
                        checked={aiDisclosure === "assisted"}
                        onChange={() => setAiDisclosure("assisted")}
                        className="text-primary"
                      />
                      <span>
                        {isAz
                          ? "Süni intellektdən araşdırma, beyin fırtınası və ya redaktə üçün istifadə etmişəm"
                          : "I used AI for research, brainstorming or editing"}
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
                      <input
                        type="radio"
                        name="aiDisclosure"
                        value="substantial"
                        checked={aiDisclosure === "substantial"}
                        onChange={() => setAiDisclosure("substantial")}
                        className="text-primary"
                      />
                      <span>
                        {isAz
                          ? "Qaralama mərhələsində süni intellektdən geniş istifadə olunub"
                          : "I used AI substantially while drafting"}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Footer Submit Button */}
                <div className="pt-2 border-t border-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {isAz ? "LƏĞV ET" : "CANCEL"}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={13} />
                    <span>{isSubmitting ? (isAz ? "GÖNDƏRİLİR..." : "SUBMITTING...") : (isAz ? "REDAKSİYAYA GÖNDƏR" : "SUBMIT FOR REVIEW")}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
