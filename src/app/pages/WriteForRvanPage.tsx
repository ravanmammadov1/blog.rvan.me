import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Sparkles,
  FileText,
  Lightbulb,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Edit3,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  Code,
  Link as LinkIcon,
  HelpCircle,
  User,
  Mail,
  Briefcase,
  Globe,
  Tag,
  Image as ImageIcon,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Eyebrow } from "../components/Eyebrow";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import {
  createArticleSubmission,
  ArticleSubmissionRecord,
} from "../../services/contributorService";
import { ArticleSubmissionType } from "../../types/contributor";

const CATEGORY_OPTIONS = [
  "Design",
  "Branding",
  "UI/UX",
  "AI & Technology",
  "Motion Design",
  "Creative Industry",
  "Typography",
  "Strategy",
];

const TOPIC_OPTIONS = [
  "Design Systems",
  "Brand Identity",
  "Motion Principles",
  "Generative AI",
  "Web Standards",
  "Product Strategy",
  "Creative Culture",
  "Case Study",
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WriteForRvanPage() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Form State
  const [submissionType, setSubmissionType] = useState<ArticleSubmissionType>("article");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [shortBio, setShortBio] = useState("");
  const [website, setWebsite] = useState("");

  // Idea Mode Specific
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaContent, setIdeaContent] = useState("");
  const [pitchReason, setPitchReason] = useState("");

  // Finished Article Mode Specific
  const [articleTitle, setArticleTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<"write" | "preview">("write");

  // Shared Taxonomy & Meta
  const [category, setCategory] = useState("Design");
  const [topic, setTopic] = useState("Design Systems");
  const [tagsStr, setTagsStr] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "az">(isAz ? "az" : "en");

  // Confirmation & Status
  const [originalWorkConfirmed, setOriginalWorkConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionReceipt, setSubmissionReceipt] = useState<ArticleSubmissionRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  const insertMarkdown = (before: string, after: string = "") => {
    const textarea = document.getElementById("article-markdown-input") as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);
    const replacement = before + (selectedText || "text") + after;

    const updated = previousText.substring(0, start) + replacement + previousText.substring(end);
    setArticleContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selectedText.length || 4));
    }, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate Required Fields
    if (!fullName.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa ad və soyadınızı daxil edin." : "Please provide your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage(isAz ? "Düzgün e-poçt ünvanı daxil edin." : "Please provide a valid email address.");
      return;
    }
    if (!shortBio.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa qısa bioqrafiyanızı daxil edin." : "Please provide a short professional bio.");
      return;
    }

    if (submissionType === "idea") {
      if (!ideaTitle.trim()) {
        setErrorMessage(isAz ? "Zəhmət olmasa işçi başlığı daxil edin." : "Please provide a working title for your idea.");
        return;
      }
      if (!ideaContent.trim()) {
        setErrorMessage(isAz ? "Zəhmət olmasa ideya təklifinizi ətraflı izah edin." : "Please explain your article proposal.");
        return;
      }
    } else {
      if (!articleTitle.trim()) {
        setErrorMessage(isAz ? "Zəhmət olmasa məqalə başlığını daxil edin." : "Please provide an article title.");
        return;
      }
      if (!excerpt.trim()) {
        setErrorMessage(isAz ? "Zəhmət olmasa qısa xülasə daxil edin." : "Please provide a short excerpt.");
        return;
      }
      if (!articleContent.trim()) {
        setErrorMessage(isAz ? "Zəhmət olmasa məqalə mətnini daxil edin." : "Please enter the article content.");
        return;
      }
    }

    if (!originalWorkConfirmed) {
      setErrorMessage(
        isAz
          ? "Zəhmət olmasa əsərin sizə məxsus olduğunu təsdiqləyin."
          : "Please confirm that this is your original work."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        submissionType,
        fullName,
        email,
        shortBio,
        website,
        title: submissionType === "idea" ? ideaTitle : articleTitle,
        excerpt: submissionType === "idea" ? "" : excerpt,
        content: submissionType === "idea" ? ideaContent : articleContent,
        pitchReason: submissionType === "idea" ? pitchReason : "",
        category,
        topic,
        tags,
        coverImageUrl,
        language: selectedLanguage,
        originalWorkConfirmed: true,
      };

      const record = await createArticleSubmission(payload);
      setSubmissionReceipt(record);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission failed:", err);
      setErrorMessage(
        err?.message ||
          (isAz
            ? "Müraciət zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin."
            : "Failed to submit. Please check your connection and try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyHash = () => {
    if (submissionReceipt?.contentHash) {
      navigator.clipboard.writeText(submissionReceipt.contentHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2500);
    }
  };

  const handleResetForm = () => {
    setSubmissionReceipt(null);
    setIdeaTitle("");
    setIdeaContent("");
    setPitchReason("");
    setArticleTitle("");
    setExcerpt("");
    setArticleContent("");
    setOriginalWorkConfirmed(false);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={isAz ? "Rvan.me üçün yaz — Redaksiyaya Məqalə Təqdimatı" : "Write for Rvan.me — Editorial Article Submission"}
        description={
          isAz
            ? "Rvan.me-də məqalə ideyanızı və ya hazır yazınızı redaksiya baxışına təqdim edin. Müəlliflik hüququnuz tam qorunur."
            : "Submit an article idea or finished essay to Rvan.me. Human editorial review with complete author copyright preservation."
        }
      />

      <SiteHeader />

      {/* ── 1. HERO SECTION ── */}
      <section className="relative px-6 pt-32 pb-12 md:px-10 md:pt-40 md:pb-16 border-b border-border bg-radial from-card/60 via-background to-background">
        <div className="mx-auto max-w-4xl text-center space-y-5">
          <div className="flex justify-center">
            <Eyebrow className="text-primary tracking-[.25em]">
              {t("writePageEyebrow", "EDITORIAL SUBMISSIONS")}
            </Eyebrow>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] bg-clip-text text-transparent inline-block">
              {t("writePageTitle", "Write for Rvan.me")}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
            {t(
              "writePageSubtitle",
              "Submit an article idea or a finished essay. Every piece is carefully evaluated by our editorial board."
            )}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs mono text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card">
              <ShieldCheck size={13} className="text-primary" />
              {isAz ? "Müəllif hüququ sizdə qalır" : "Your copyright remains yours"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card">
              <Sparkles size={13} className="text-primary" />
              {isAz ? "Redaksiya baxışı" : "Human editorial review"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card">
              <User size={13} className="text-primary" />
              {isAz ? "Fərdi müəllif profili" : "Dedicated author attribution"}
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. SUBMISSION FORM CONTAINER ── */}
      <section className="relative px-6 py-12 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl">
          {submissionReceipt ? (
            /* ── SUCCESS RECEIPT SCREEN ── */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="rounded-3xl border border-emerald-500/30 bg-card p-8 sm:p-12 md:p-14 shadow-2xl shadow-emerald-500/5 space-y-8 text-center relative overflow-hidden"
            >
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">
                  {t("submissionReceivedTitle", "Submission Received")}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {isAz ? "Təqdimatınız Uğurla Qəbul Edildi" : "Your Submission is in the Queue"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  {t(
                    "submissionReceivedDesc",
                    "Your submission has been received and will be reviewed by the Rvan.me editorial team."
                  )}
                </p>
              </div>

              {/* Technical Integrity Receipt Details */}
              <div className="p-6 rounded-2xl border border-border bg-surface/50 text-left space-y-4 font-mono text-xs max-w-2xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="text-muted-foreground uppercase">{t("submissionIdLabel", "Submission ID")}:</span>
                  <span className="text-primary font-bold text-sm">{submissionReceipt.id}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="text-muted-foreground uppercase">{t("adminStatus", "Status")}:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold uppercase text-[10.5px]">
                    ● {t("statusPendingReview", "Pending Review")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="text-muted-foreground uppercase">{t("fullName", "Author")}:</span>
                  <span className="text-foreground font-semibold">{submissionReceipt.fullName}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="text-muted-foreground uppercase">{t("articleTitle", "Title")}:</span>
                  <span className="text-foreground font-semibold truncate max-w-md">{submissionReceipt.title}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                  <span className="text-muted-foreground uppercase">{t("submittedAtLabel", "Submitted At")}:</span>
                  <span className="text-foreground">{new Date(submissionReceipt.submittedAt).toLocaleString()}</span>
                </div>

                {submissionReceipt.contentHash && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground uppercase text-[10px]">
                        {t("contentIntegrityHashLabel", "Content Integrity SHA-256")}:
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyHash}
                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline cursor-pointer"
                      >
                        {copiedHash ? <Check size={11} /> : <Copy size={11} />}
                        <span>{copiedHash ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "Kodu Kopyala" : "Copy Hash")}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-muted-foreground bg-background p-2.5 rounded-xl border border-border break-all font-mono">
                      {submissionReceipt.contentHash}
                    </p>
                  </div>
                )}
              </div>

              {/* What Happens Next Guidance */}
              <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 max-w-2xl mx-auto text-left space-y-2">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mono flex items-center gap-1.5">
                  <Sparkles size={13} /> {isAz ? "Növbəti Addımlar" : "What Happens Next"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Redaksiya heyətimiz yazınızı orijinallıq, struktur, analitik dərinlik və aktuallıq meyarları üzrə qiymətləndirəcək. Qərar qəbul edildikdə göstərdiyiniz e-poçt ünvanı ilə əlaqə saxlanılacaq."
                    : "Our editorial board will evaluate your work for analytical depth, originality, and actionable value. We will reach out via the provided email address once reviewed."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button to={getLocalizedPath("/blog")} variant="primary" size="md">
                  {isAz ? "BÜTÜN MƏQALƏLƏRİ OXU" : "EXPLORE PUBLISHED ARTICLES"}
                </Button>
                <Button onClick={handleResetForm} variant="secondary" size="md">
                  {t("submitAnotherWork", "SUBMIT ANOTHER WORK")}
                </Button>
              </div>
            </motion.div>
          ) : (
            /* ── SUBMISSION FORM ── */
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* ── STEP 1: SUBMISSION TYPE ── */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                  <PenTool size={14} />
                  <span>01 / {t("submissionTypeQuestion", "WHAT ARE YOU SUBMITTING?")}</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Article Idea Card */}
                  <button
                    type="button"
                    onClick={() => setSubmissionType("idea")}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                      submissionType === "idea"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                        <Lightbulb size={20} />
                      </div>
                      {submissionType === "idea" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider mono bg-primary text-black px-2 py-0.5 rounded-md">
                          {isAz ? "SEÇİLDİ" : "SELECTED"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {t("articleIdeaOptTitle", "Article Idea / Proposal")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("articleIdeaOptDesc", "Pitch a premise, concept, or outline for editorial feedback before writing.")}
                    </p>
                  </button>

                  {/* Finished Article Card */}
                  <button
                    type="button"
                    onClick={() => setSubmissionType("article")}
                    className={`p-5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative ${
                      submissionType === "article"
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40 hover:bg-surface/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                        <FileText size={20} />
                      </div>
                      {submissionType === "article" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider mono bg-primary text-black px-2 py-0.5 rounded-md">
                          {isAz ? "SEÇİLDİ" : "SELECTED"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground">
                      {t("finishedArticleOptTitle", "Finished Article")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("finishedArticleOptDesc", "Submit a complete, fully drafted article ready for direct publication review.")}
                    </p>
                  </button>
                </div>
              </div>

              {/* ── STEP 2: AUTHOR INFORMATION ── */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase mb-1">
                    <User size={14} />
                    <span>02 / {t("authorInformation", "Author Information")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("authorInfoDesc", "No account required. Your identity will be permanently attributed if published.")}
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("fullName", "Full Name")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Leyla Karimova"
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("emailAddress", "Email Address")} <span className="text-primary">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="leyla@example.com"
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("shortBio", "Short Bio")} <span className="text-primary">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={shortBio}
                      onChange={(e) => setShortBio(e.target.value)}
                      placeholder={t("shortBioPlaceholder", "e.g. Senior Product Designer, Brand Strategist...")}
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all resize-none shadow-2xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("websiteOrPortfolio", "Website / Portfolio / Social Link (Optional)")}
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://linkedin.com/in/username or https://myportfolio.design"
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* ── STEP 3: CONTENT FIELDS (IDEA vs FINISHED ARTICLE) ── */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                  <Edit3 size={14} />
                  <span>
                    03 / {submissionType === "idea" ? t("articleIdea", "Article Idea") : t("finishedArticle", "Finished Article")}
                  </span>
                </div>

                {/* Common Taxonomy */}
                <div className="grid gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("categoryLabel", "Category")} <span className="text-primary">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {t("topicLabel", "Topic (Optional)")}
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                    >
                      {TOPIC_OPTIONS.map((tp) => (
                        <option key={tp} value={tp}>
                          {tp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      {isAz ? "Yazı Dili" : "Language"}
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as "en" | "az")}
                      className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none transition-all shadow-2xs"
                    >
                      <option value="az">Azərbaycan Dili (AZ)</option>
                      <option value="en">English (EN)</option>
                    </select>
                  </div>
                </div>

                {submissionType === "idea" ? (
                  /* ── IDEA MODE FIELDS ── */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("workingTitle", "Working Title")} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ideaTitle}
                        onChange={(e) => setIdeaTitle(e.target.value)}
                        placeholder={t("workingTitlePlaceholder", "e.g. The Architecture of Modern Design Systems")}
                        className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("ideaProposal", "Article Idea / Proposal")} <span className="text-primary">*</span>
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={ideaContent}
                        onChange={(e) => setIdeaContent(e.target.value)}
                        placeholder={t(
                          "ideaProposalPlaceholder",
                          "Explain the key arguments, questions, and insights you want to explore..."
                        )}
                        className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all resize-y shadow-2xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("whyRvanMe", "Why should Rvan.me publish this? (Optional)")}
                      </label>
                      <textarea
                        rows={3}
                        value={pitchReason}
                        onChange={(e) => setPitchReason(e.target.value)}
                        placeholder={t(
                          "whyRvanMePlaceholder",
                          "How will this benefit creative readers in Azerbaijan and globally?..."
                        )}
                        className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all resize-none shadow-2xs"
                      />
                    </div>
                  </div>
                ) : (
                  /* ── FINISHED ARTICLE FIELDS & EDITOR ── */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("articleTitle", "Article Title")} <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="e.g. Design Systems at Scale: Architecture, Tokens, and Adoption"
                        className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-base font-bold text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("articleExcerpt", "Excerpt / Short Summary")} <span className="text-primary">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder={t(
                          "articleExcerptPlaceholder",
                          "A 2-3 sentence overview that captures the core thesis of your piece..."
                        )}
                        className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all resize-none shadow-2xs leading-relaxed"
                      />
                    </div>

                    {/* Markdown Writing Studio */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                        <label className="text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono">
                          {t("articleContent", "Article Content (Markdown Supported)")} <span className="text-primary">*</span>
                        </label>

                        {/* Write vs Preview Tabs */}
                        <div className="flex items-center gap-1 rounded-xl border border-border p-1 bg-surface/80">
                          <button
                            type="button"
                            onClick={() => setActiveEditorTab("write")}
                            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                              activeEditorTab === "write"
                                ? "bg-primary text-black"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t("writeTab", "Write")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveEditorTab("preview")}
                            className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer ${
                              activeEditorTab === "preview"
                                ? "bg-primary text-black"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {t("previewTab", "Preview")}
                          </button>
                        </div>
                      </div>

                      {activeEditorTab === "write" ? (
                        <div className="space-y-2">
                          {/* Markdown Formatting Toolbar */}
                          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl border border-border bg-surface/40 text-muted-foreground">
                            <button
                              type="button"
                              onClick={() => insertMarkdown("**", "**")}
                              title="Bold"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Bold size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("*", "*")}
                              title="Italic"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Italic size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("## ", "\n")}
                              title="Heading 2"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Heading size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("> ", "\n")}
                              title="Quote"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Quote size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("- ", "\n")}
                              title="Bullet List"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <List size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("`", "`")}
                              title="Inline Code"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <Code size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => insertMarkdown("[Link Text](", ")")}
                              title="Link"
                              className="p-1.5 rounded-lg hover:bg-surface hover:text-foreground transition-colors cursor-pointer"
                            >
                              <LinkIcon size={14} />
                            </button>
                          </div>

                          <textarea
                            id="article-markdown-input"
                            required
                            rows={14}
                            value={articleContent}
                            onChange={(e) => setArticleContent(e.target.value)}
                            placeholder={t(
                              "articleContentPlaceholder",
                              "Write or paste your article draft in Markdown or plain text here..."
                            )}
                            className="w-full rounded-xl border border-border bg-surface/80 p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all resize-y leading-relaxed shadow-2xs"
                          />
                        </div>
                      ) : (
                        /* Local Draft Preview */
                        <div className="rounded-xl border border-border bg-surface/40 p-6 min-h-[300px] space-y-4">
                          <h2 className="text-2xl font-extrabold text-foreground">{articleTitle || "Untitled Article"}</h2>
                          {excerpt && <p className="text-sm text-muted-foreground italic border-l-2 border-primary pl-3">{excerpt}</p>}
                          <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap font-sans leading-relaxed">
                            {articleContent || (
                              <span className="text-muted-foreground italic">
                                {isAz ? "Məqalə mətni daxil edilməyib." : "No article content entered yet."}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Metadata: Tags and Cover Image */}
                    <div className="grid gap-5 sm:grid-cols-2 pt-2">
                      <div>
                        <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                          {t("tagsLabel", "Tags (Optional, comma separated)")}
                        </label>
                        <input
                          type="text"
                          value={tagsStr}
                          onChange={(e) => setTagsStr(e.target.value)}
                          placeholder={t("tagsPlaceholder", "typography, design-tokens, branding")}
                          className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                          {t("coverImageUrlLabel", "Cover Image URL (Optional)")}
                        </label>
                        <input
                          type="url"
                          value={coverImageUrl}
                          onChange={(e) => setCoverImageUrl(e.target.value)}
                          placeholder={t("coverImagePlaceholder", "https://images.unsplash.com/photo-...")}
                          className="w-full rounded-xl border border-border bg-surface/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none transition-all shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── STEP 4: COPYRIGHT & OWNERSHIP NOTICE ── */}
              <div className="rounded-3xl border border-primary/25 bg-primary/5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2.5 text-xs font-bold tracking-wider text-primary mono uppercase">
                  <ShieldCheck size={16} />
                  <span>{t("copyrightOwnershipNoticeTitle", "Your work remains yours.")}</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "copyrightOwnershipNoticeText",
                    "Submitting your work to Rvan.me does not transfer ownership or copyright to Rvan.me. If your submission is accepted, you grant Rvan.me permission to publish and display the accepted work with attribution."
                  )}
                </p>
              </div>

              {/* ── STEP 5: ORIGINAL WORK CONFIRMATION CHECKBOX ── */}
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={originalWorkConfirmed}
                    onChange={(e) => setOriginalWorkConfirmed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer accent-primary"
                  />
                  <span className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                    {t(
                      "originalWorkConfirmLabel",
                      "I confirm that this is my original work and that I have the right to submit it."
                    )}
                  </span>
                </label>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="flex items-center gap-3 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-xs">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* ── STEP 6: SUBMIT ACTION ── */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !originalWorkConfirmed}
                  className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl px-10 py-4 text-xs font-bold tracking-[.2em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 mono disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
                    backgroundSize: "200% 200%",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> {t("submittingToRvan", "SUBMITTING...")}
                    </>
                  ) : (
                    <>
                      {t("submitToRvan", "SUBMIT TO RVAN.ME")}
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <span className="text-[11px] font-mono text-muted-foreground text-center sm:text-right">
                  {isAz ? "Yazınız birbaşa redaksiya heyətinə göndəriləcək." : "Your submission is sent directly to the editorial board."}
                </span>
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
