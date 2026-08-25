import React, { useState, useEffect } from "react";
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
  Send,
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
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [editorialNote, setEditorialNote] = useState("");

  // Editor Tabs & Status
  const [activeEditorTab, setActiveEditorTab] = useState<"write" | "preview">("write");
  const [originalWorkConfirmed, setOriginalWorkConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

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
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim(),
        authorBio: authorBio.trim(),
        authorWebsite: authorWebsite.trim(),
        title: articleTitle.trim(),
        excerpt: excerpt.trim(),
        content: articleContent.trim(),
        category,
        topic: topic.trim(),
        tags,
        coverImageUrl: coverImageUrl.trim(),
        language: selectedLanguage,
        editorialNote: editorialNote.trim(),
        originalWorkConfirmed: true,
      };

      const response = await fetch("/api/submit-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || (isAz ? "Göndərilmə zamanı xəta baş verdi." : "Failed to submit article."));
      }

      setIsSubmittedSuccess(true);
      window.scrollTo({ top: 120, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMessage(
        err?.message ||
          (isAz
            ? "Müraciət zamanı xəta baş verdi. Zəhmət olmasa bağlantınızı yoxlayın və yenidən cəhd edin."
            : "Failed to submit. Please check your connection and try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSubmittedSuccess(false);
    setArticleTitle("");
    setExcerpt("");
    setArticleContent("");
    setTagsStr("");
    setCoverImageUrl("");
    setEditorialNote("");
    setOriginalWorkConfirmed(false);
    setErrorMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SEO
        title={
          isAz
            ? "Paylaşmağa dəyər fikrin var? — Rvan.me Məqalə Təqdimatı"
            : "Have Something Worth Sharing? — Rvan.me Article Submissions"
        }
        description={
          isAz
            ? "Orijinal məqaləni Rvan.me ilə paylaş. Dizayn, texnologiya, marketinq, psixologiya, yaradıcılıq və strategiya mövzularında maraqlı baxış bucaqlarını qəbul edirik."
            : "Share your finished article with Rvan.me. We welcome original perspectives on design, technology, marketing, psychology, creativity, and strategy."
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
            {isAz ? "Paylaşmağa dəyər fikrin var?" : "Have Something Worth Sharing?"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {isAz
              ? "Orijinal məqaləni Rvan.me ilə paylaş. Dizayn, texnologiya, marketinq, psixologiya, yaradıcılıq və strategiya mövzularında maraqlı baxış bucaqlarını qəbul edirik."
              : "Share your finished article with Rvan.me. We welcome original perspectives on design, technology, marketing, psychology, creativity, and strategy."}
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
              <span>{isAz ? "Müəllif İstinadı ilə Nəşr" : "Published With Attribution"}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Workspace Area */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            {isSubmittedSuccess ? (
              /* Submission Success Screen */
              <motion.div
                key="receipt"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-2xl space-y-8 text-center"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>

                <div className="space-y-3 max-w-lg mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {isAz ? "Məqalə uğurla göndərildi." : "Article submitted successfully."}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isAz
                      ? "İşinizi Rvan.me ilə paylaşdığınız üçün təşəkkür edirik. Məqaləniz redaksiya tərəfindən nəzərdən keçirildikdən sonra qərar barədə sizinlə əlaqə saxlanılacaq."
                      : "Thank you for sharing your work with Rvan.me. Our editorial team will review your submission."}
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6 text-left space-y-3 max-w-lg mx-auto">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <span>{isAz ? "Növbəti mərhələdə nə baş verir?" : "What happens next?"}</span>
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">1.</span>
                      <span>
                        {isAz
                          ? "Məqaləniz birbaşa Rvan.me baş redaktorunun e-poçt ünvanına daxil olur."
                          : "Your submission is delivered directly to the Rvan.me editorial board inbox."}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold">2.</span>
                      <span>
                        {isAz
                          ? "Yazınız qəbul edildikdə, redaksiya tərəfindən Sanity CMS vasitəsilə adınız və profilinizlə dərc olunur."
                          : "If accepted, the piece is created in Sanity CMS and published live under your author attribution."}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button to={getLocalizedPath("/blog")} variant="primary" size="md">
                    {isAz ? "BLOQ YAZILARINA BAX" : "EXPLORE BLOG ARTICLES"}
                  </Button>
                  <Button onClick={handleResetForm} variant="outline" size="md">
                    {isAz ? "BAŞQA MƏQALƏ GÖNDƏR" : "SUBMIT ANOTHER ARTICLE"}
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
                      {isAz
                        ? "Hesab açmağa ehtiyac yoxdur. Məqalə qəbul edildikdə adınız və bioqrafiyanız yazıda qeyd olunacaq."
                        : "No account required. Your name and bio will be attributed to the article if published."}
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
                      <span>{t("tagsLabel", "Tags (Optional)")}</span>
                    </label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder={t("tagsPlaceholder", "typography, design-systems, branding")}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-muted-foreground" />
                      <span>{isAz ? "Üz Qabığı Şəklinin Linki (Könüllü)" : "Cover Image URL (Optional)"}</span>
                    </label>
                    <input
                      type="url"
                      value={coverImageUrl}
                      onChange={(e) => setCoverImageUrl(e.target.value)}
                      placeholder="https://example.com/cover-image.jpg"
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      {isAz
                        ? "Könüllü. Əgər üz qabığı şəkliniz yoxdursa, redaksiya heyətimiz uyğun şəkil seçəcəkdir."
                        : "Optional. If you don't have a cover image, our editorial team can select one."}
                    </p>
                  </div>

                  {/* Article Note to Editor */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      {isAz ? "Redaktora Qeyd (Könüllü)" : "Note to Editor (Optional)"}
                    </label>
                    <textarea
                      rows={2}
                      value={editorialNote}
                      onChange={(e) => setEditorialNote(e.target.value)}
                      placeholder={
                        isAz
                          ? "Sizcə bu məqalə nə üçün Rvan.me üçün uyğundur? (Redaktor üçün qısa qeyd)"
                          : "Why do you think this article is relevant to Rvan.me? (A short note to the editor)"
                      }
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y"
                    />
                  </div>
                </div>

                {/* SECTION 3: COPYRIGHT & INTEGRITY NOTICE */}
                <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card p-6 sm:p-8 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">
                        {isAz ? "Müəlliflik hüququnuz sizdə qalır." : "Your work remains yours."}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isAz
                          ? "Əsərinizin müəlliflik hüququ sizə məxsus olaraq qalır. Məqaləni Rvan.me-ə göndərmək onun mülkiyyətini və ya müəlliflik hüququnu Rvan.me-ə ötürmür. Məqalə qəbul edilərsə, müəllif adı göstərilməklə dərc olunur."
                          : "Your work remains yours. Submitting your article to Rvan.me does not transfer ownership or copyright to Rvan.me. If accepted, the article will be published with author attribution."}
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
                      {isAz
                        ? "Bu məqalənin mənim orijinal işim olduğunu və onu dərc üçün təqdim etmək hüququna sahib olduğumu təsdiq edirəm."
                        : "I confirm that this is my original work and that I have the right to submit it for publication."}
                    </span>
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-mono">
                    {isAz
                      ? "Təqdimat birbaşa redaksiyanın e-poçt qutusuna çatdırılır."
                      : "Submission is delivered directly to our editorial inbox."}
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>{isAz ? "MƏQALƏ GÖNDƏRİLİR..." : "SUBMITTING ARTICLE..."}</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>{isAz ? "MƏQALƏNİ GÖNDƏR" : "SUBMIT ARTICLE TO RVAN.ME"}</span>
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
