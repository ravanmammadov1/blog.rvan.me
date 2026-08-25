import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Sparkles,
  FileText,
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
  User,
  Mail,
  Briefcase,
  Globe,
  Tag,
  Image as ImageIcon,
  Loader2,
  Copy,
  Check,
  UploadCloud,
  X,
  RefreshCw,
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
  uploadSubmissionCoverImage,
  ArticleSubmissionRecord,
} from "../../services/contributorService";
import {
  EDITORIAL_CATEGORIES,
  EDITORIAL_TOPICS,
  EditorialCategory,
} from "../../types/contributor";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WriteForRvanPage() {
  const { t, getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Author Information
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorWebsite, setAuthorWebsite] = useState("");

  // Article Information
  const [articleTitle, setArticleTitle] = useState("");
  const [category, setCategory] = useState<EditorialCategory>("Design");
  const [topic, setTopic] = useState<string>("Design Systems");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "az">(isAz ? "az" : "en");
  const [excerpt, setExcerpt] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [editorialNote, setEditorialNote] = useState("");

  // Cover Image State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [uploadedCoverUrl, setUploadedCoverUrl] = useState<string>("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Editor Tabs & Status
  const [activeEditorTab, setActiveEditorTab] = useState<"write" | "preview">("write");
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

  // Handle Cover Image File Selection
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        isAz
          ? "Şəklin həcmi 5MB-dan artıq ola bilməz."
          : "Cover image size must be less than 5MB."
      );
      return;
    }

    setCoverFile(file);
    const localPreviewUrl = URL.createObjectURL(file);
    setCoverPreview(localPreviewUrl);
    setErrorMessage("");

    // Upload to Firebase Storage in background
    setIsUploadingCover(true);
    try {
      const publicUrl = await uploadSubmissionCoverImage(file);
      setUploadedCoverUrl(publicUrl);
    } catch (uploadErr) {
      console.warn("Cover image upload warning:", uploadErr);
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleRemoveCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setUploadedCoverUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

    // Validate Author Information
    if (!authorName.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa tam adınızı daxil edin." : "Please provide your full name.");
      return;
    }
    if (!authorEmail.trim() || !authorEmail.includes("@")) {
      setErrorMessage(isAz ? "Zəhmət olmasa etibarlı e-poçt ünvanı daxil edin." : "Please provide a valid email address.");
      return;
    }
    if (!authorBio.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa qısa bioqrafiyanızı daxil edin." : "Please provide a short professional bio.");
      return;
    }

    // Validate Article Information
    if (!articleTitle.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa məqalə başlığını daxil edin." : "Please provide an article title.");
      return;
    }
    if (!excerpt.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa qısa xülasə / tezis daxil edin." : "Please provide a short excerpt / summary.");
      return;
    }
    if (!articleContent.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa məqalə mətnini daxil edin." : "Please enter the article content.");
      return;
    }
    if (!tagsStr.trim()) {
      setErrorMessage(isAz ? "Zəhmət olmasa ən azı bir neçə teq daxil edin." : "Please provide relevant tags.");
      return;
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
      let finalCoverUrl = uploadedCoverUrl;
      if (coverFile && !finalCoverUrl) {
        try {
          finalCoverUrl = await uploadSubmissionCoverImage(coverFile);
        } catch (err) {
          console.warn("Cover image fallback error:", err);
        }
      }

      const tags = tagsStr
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        authorName,
        authorEmail,
        authorBio,
        authorWebsite,
        title: articleTitle,
        excerpt,
        content: articleContent,
        category,
        topic,
        tags,
        coverImageUrl: finalCoverUrl || coverPreview,
        language: selectedLanguage,
        editorialNote,
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
    setArticleTitle("");
    setExcerpt("");
    setArticleContent("");
    setTagsStr("");
    setEditorialNote("");
    setCoverFile(null);
    setCoverPreview("");
    setUploadedCoverUrl("");
    setOriginalWorkConfirmed(false);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SEO
        title={isAz ? "Paylaşmağa dəyər fikrin var? — Rvan.me Redaksiya Təqdimatı" : "Have Something Worth Sharing? — Rvan.me Editorial Submissions"}
        description={
          isAz
            ? "Maraqlı ideyan, baxış bucağın və ya hazır məqalən var? Onu Rvan.me ilə paylaş. Hər göndəriş dərc olunmazdan əvvəl redaksiya tərəfindən nəzərdən keçirilir."
            : "Share your article with Rvan.me. We welcome original perspectives on design, technology, marketing, psychology, and strategy."
        }
        canonical={isAz ? "/az/write" : "/write"}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-14 sm:px-6 md:px-8 md:pt-40 md:pb-20 border-b border-border bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <Eyebrow text={t("writePageEyebrow", "EDITORIAL INVITATION")} />

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]"
          >
            {t("writePageTitle", "Have Something Worth Sharing?")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              "writePageSubtitle",
              "Share your article with Rvan.me. We welcome original perspectives on design, technology, marketing, psychology, creativity, and strategy. Every submission is reviewed by our editorial team before publication."
            )}
          </motion.p>

          {/* Trust Matrix Badges */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono font-medium text-muted-foreground"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-2xs">
              <ShieldCheck size={14} className="text-primary" />
              <span>{isAz ? "Müəlliflik Hüququ Qorunur" : "Authorship Retained"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-2xs">
              <Sparkles size={14} className="text-primary" />
              <span>{isAz ? "İnsan Redaksiya Baxışı" : "Human Editorial Review"}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border shadow-2xs">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>{isAz ? "Daimi Müəllif İstinadı" : "Permanent Attribution"}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Workspace Area */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {submissionReceipt ? (
              /* Submission Success Receipt */
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                    {t("statusPendingReview", "Pending Editorial Review")}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {t("submissionReceivedTitle", "Article Submission Received")}
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    {t(
                      "submissionReceivedDesc",
                      "Your article has been securely received and entered into our editorial queue for review."
                    )}
                  </p>
                </div>

                {/* Receipt Details Card */}
                <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-4 text-xs font-mono">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <span className="text-muted-foreground">{t("submissionIdLabel", "Submission ID")}:</span>
                    <span className="font-bold text-foreground selection:bg-primary/20">{submissionReceipt.id}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <span className="text-muted-foreground">{isAz ? "Müəllif" : "Author"}:</span>
                    <span className="font-semibold text-foreground">
                      {submissionReceipt.authorName} ({submissionReceipt.authorEmail})
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <span className="text-muted-foreground">{t("articleTitle", "Article Title")}:</span>
                    <span className="font-semibold text-foreground truncate max-w-md">{submissionReceipt.title}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                    <span className="text-muted-foreground">{t("submittedAtLabel", "Submitted At")}:</span>
                    <span className="text-foreground">
                      {new Date(submissionReceipt.submittedAt).toLocaleString(isAz ? "az-AZ" : "en-US")}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="space-y-1">
                      <span className="text-muted-foreground block">{t("contentIntegrityHashLabel", "Content Integrity Record (SHA-256)")}:</span>
                      <span className="font-mono text-[11px] text-primary break-all block">
                        {submissionReceipt.contentHash}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors shrink-0"
                    >
                      {copiedHash ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      <span>{copiedHash ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "Kodu Kopyala" : "Copy Hash")}</span>
                    </button>
                  </div>
                </div>

                {/* Next Steps Guidance */}
                <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 space-y-3">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span>{isAz ? "Növbəti mərhələdə nə baş verir?" : "What happens next?"}</span>
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>
                        {isAz
                          ? "Redaksiya heyətimiz məqalənizin orijinallığını və mövzu uyğunluğunu nəzərdən keçirir."
                          : "Our editorial board reviews your article for thesis strength, originality, and depth."}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>
                        {isAz
                          ? "Məqalə qəbul edildikdə, o birbaşa Rvan.me bloqunda sizin müəllif adınızla dərc olunur."
                          : "Upon approval, the article is published live on Rvan.me under your permanent author attribution."}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">3.</span>
                      <span>
                        {isAz
                          ? "Düzəliş tələb olunarsa və ya qərar verildikdə qeyd etdiyiniz e-poçt vasitəsilə əlaqə saxlanılır."
                          : "If revisions are requested, the editorial team will follow up via your submitted email."}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button to={getLocalizedPath("/blog")} variant="primary" size="md">
                    {isAz ? "BLOQ YAZILARINA BAX" : "EXPLORE BLOG ARTICLES"}
                  </Button>
                  <Button onClick={handleResetForm} variant="outline" size="md">
                    {t("submitAnotherWork", "SUBMIT ANOTHER ARTICLE")}
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmit} className="space-y-10">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-sm flex items-start gap-3"
                  >
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* SECTION 1: AUTHOR INFORMATION */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="space-y-1 border-b border-border pb-4">
                    <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                      01 / {isAz ? "MÜƏLLİF" : "AUTHOR IDENTITY"}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("authorInformation", "Author Information")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "authorInfoDesc",
                        "No account required. Your name and bio will be permanently attributed to the article if published."
                      )}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <User size={13} className="text-muted-foreground" />
                        <span>{t("fullName", "Full Name")} *</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Leyla Karimova"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Mail size={13} className="text-muted-foreground" />
                        <span>{t("emailAddress", "Email Address")} *</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        placeholder="leyla@example.com"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Briefcase size={13} className="text-muted-foreground" />
                      <span>{t("shortBio", "Short Bio")} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      placeholder={t("shortBioPlaceholder", "e.g. Senior Product Designer, Brand Strategist, UX Researcher...")}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Globe size={13} className="text-muted-foreground" />
                      <span>{t("websiteOrPortfolio", "Website / Portfolio / LinkedIn (Optional)")}</span>
                    </label>
                    <input
                      type="url"
                      value={authorWebsite}
                      onChange={(e) => setAuthorWebsite(e.target.value)}
                      placeholder="https://yourportfolio.com or https://linkedin.com/in/username"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {/* SECTION 2: ARTICLE INFORMATION & CONTENT */}
                <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                  <div className="space-y-1 border-b border-border pb-4">
                    <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase">
                      02 / {isAz ? "MƏQALƏ" : "ARTICLE CONTENT"}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {t("articleInformation", "Article Information")}
                    </h3>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {t("articleTitle", "Article Title")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder={t("articleTitlePlaceholder", "Enter a descriptive, engaging title for your article...")}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-base font-semibold text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Taxonomy & Language Grid */}
                  <div className="grid gap-4 sm:grid-cols-3">
                    {/* Category */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">{t("categoryLabel", "Category")} *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as EditorialCategory)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        {EDITORIAL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Topic */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">{t("topicLabel", "Topic (Optional)")}</label>
                      <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="">{isAz ? "Mövzu seçilməyib" : "No specific topic"}</option>
                        {EDITORIAL_TOPICS.map((top) => (
                          <option key={top} value={top}>
                            {top}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">{t("articleLanguageLabel", "Article Language")} *</label>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as "en" | "az")}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      >
                        <option value="az">{t("langAz", "Azerbaijani")}</option>
                        <option value="en">{t("langEn", "English")}</option>
                      </select>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {t("articleExcerpt", "Excerpt / Short Summary")} *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder={t("articleExcerptPlaceholder", "A 2-3 sentence overview capturing the core thesis of your piece...")}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                    />
                  </div>

                  {/* Markdown Studio */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-foreground">
                        {t("articleContent", "Article Content (Markdown Supported)")} *
                      </label>
                      {/* Editor / Preview Tabs */}
                      <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
                        <button
                          type="button"
                          onClick={() => setActiveEditorTab("write")}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            activeEditorTab === "write"
                              ? "bg-card text-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Edit3 size={13} />
                          <span>{t("writeTab", "Write")}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveEditorTab("preview")}
                          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                            activeEditorTab === "preview"
                              ? "bg-card text-foreground shadow-2xs"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Eye size={13} />
                          <span>{t("previewTab", "Preview")}</span>
                        </button>
                      </div>
                    </div>

                    {activeEditorTab === "write" ? (
                      <div className="space-y-2">
                        {/* Formatting Toolbar */}
                        <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl border border-border bg-muted/20 text-muted-foreground text-xs">
                          <button
                            type="button"
                            onClick={() => insertMarkdown("**", "**")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Bold"
                          >
                            <Bold size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("*", "*")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Italic"
                          >
                            <Italic size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("### ")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Heading"
                          >
                            <Heading size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("> ")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Quote"
                          >
                            <Quote size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("- ")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="List"
                          >
                            <List size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("```\n", "\n```")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Code Block"
                          >
                            <Code size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertMarkdown("[link text](", ")")}
                            className="p-1.5 hover:bg-card hover:text-foreground rounded-lg transition-colors"
                            title="Link"
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
                            "Write or paste your article in Markdown or plain text here..."
                          )}
                          className="w-full rounded-2xl border border-border bg-background p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y leading-relaxed"
                        />
                      </div>
                    ) : (
                      <div className="min-h-[350px] max-h-[500px] overflow-y-auto rounded-2xl border border-border bg-muted/10 p-6 prose prose-slate dark:prose-invert max-w-none text-sm">
                        {articleContent ? (
                          <div className="space-y-4 whitespace-pre-wrap font-sans leading-relaxed">
                            {articleContent}
                          </div>
                        ) : (
                          <div className="text-muted-foreground italic text-center py-16">
                            {isAz ? "Önbaxış üçün məqalə mətni daxil edin..." : "Enter article content to preview..."}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Tag size={13} className="text-muted-foreground" />
                      <span>{t("tagsLabel", "Tags")} *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder={t("tagsPlaceholder", "typography, design-systems, branding")}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-muted-foreground" />
                      <span>{t("coverImageLabel", "Cover Image (Optional)")}</span>
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleCoverFileChange}
                      className="hidden"
                      id="cover-image-upload-input"
                    />

                    {coverPreview ? (
                      <div className="relative rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="relative h-48 w-full rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-border">
                          <img
                            src={coverPreview}
                            alt="Cover Preview"
                            className="h-full w-full object-cover"
                          />
                          {isUploadingCover && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center gap-2 text-white text-xs font-medium">
                              <Loader2 size={16} className="animate-spin" />
                              <span>{isAz ? "Yüklənir..." : "Uploading image..."}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                          >
                            <RefreshCw size={13} />
                            <span>{t("replaceImage", "Replace Image")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/20 bg-destructive/10 hover:bg-destructive/20 text-xs font-semibold text-destructive transition-colors"
                          >
                            <X size={13} />
                            <span>{t("removeImage", "Remove Image")}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/10 hover:bg-primary/[0.02] p-6 text-center transition-all space-y-2"
                      >
                        <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-card border border-border text-primary shadow-2xs">
                          <UploadCloud size={20} />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-foreground block">
                            {t("uploadCoverImage", "Upload Cover Image")}
                          </span>
                          <span className="text-[11px] text-muted-foreground block">
                            {t("uploadCoverDesc", "PNG, JPG, or WebP up to 5MB")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Article Note to Editor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {t("editorialNoteLabel", "Article Note to Editor (Optional)")}
                    </label>
                    <textarea
                      rows={2}
                      value={editorialNote}
                      onChange={(e) => setEditorialNote(e.target.value)}
                      placeholder={t(
                        "editorialNotePlaceholder",
                        "Why do you think this article is relevant to Rvan.me? (A short note to the editor)"
                      )}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                    />
                  </div>
                </div>

                {/* SECTION 3: COPYRIGHT & CONTENT INTEGRITY NOTICE */}
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card p-6 sm:p-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">
                        {t("copyrightOwnershipNoticeTitle", "Your work remains yours.")}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(
                          "copyrightOwnershipNoticeText",
                          "Submitting an article to Rvan.me does not transfer ownership or copyright to Rvan.me. The author remains the copyright holder. If accepted, you grant Rvan.me permission to publish and display the accepted work with permanent attribution."
                        )}
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 pt-2 cursor-pointer border-t border-border/80">
                    <input
                      type="checkbox"
                      required
                      checked={originalWorkConfirmed}
                      onChange={(e) => setOriginalWorkConfirmed(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-foreground leading-snug">
                      {t(
                        "originalWorkConfirmLabel",
                        "I confirm that this is my original work and that I have the right to submit it for publication."
                      )}
                    </span>
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {isAz
                      ? "Bütün təqdimatlar insan redaksiyası tərəfindən nəzərdən keçirilir."
                      : "All submissions undergo human editorial review."}
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{t("submittingToRvan", "SUBMITTING ARTICLE...")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("submitToRvan", "SUBMIT ARTICLE TO RVAN.ME")}</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
