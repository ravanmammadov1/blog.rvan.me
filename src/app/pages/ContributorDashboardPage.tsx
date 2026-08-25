import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  PenTool,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Save,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  UserCheck,
  X,
  ExternalLink,
  Trash2,
  Edit3,
  Eye,
  Bold,
  Italic,
  Heading,
  Quote,
  List,
  Code,
  Link2,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  Check,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import {
  getContributorProfile,
  getContributorArticles,
  getContributorDashboardStats,
  saveContributorArticle,
  submitContributorArticle,
  deleteContributorDraft,
  saveContributorProfile,
  isUserApprovedContributor,
  slugifyAuthorName,
  calculateReadTime,
  ContributorProfile,
  ContributorArticleDraft,
  ContributorDashboardStats,
} from "../../services/contributorService";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { Button } from "../components/ui/Button";

type DashboardTab = "overview" | "articles" | "profile";

export default function ContributorDashboardPage() {
  const { user } = useAuth();
  const { t, language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [profile, setProfile] = useState<ContributorProfile | null>(null);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
  const [stats, setStats] = useState<ContributorDashboardStats>({
    draftsCount: 0,
    submittedCount: 0,
    underReviewCount: 0,
    changesRequestedCount: 0,
    publishedCount: 0,
    totalViews: 0,
    totalComments: 0,
    profileCompleteness: 0,
  });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // Articles Filter
  const [articleFilter, setArticleFilter] = useState<"ALL" | "draft" | "submitted" | "changes_requested" | "published" | "rejected">("ALL");

  // Studio / Editor State
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState<"write" | "preview">("write");
  const [currentArticle, setCurrentArticle] = useState<Partial<ContributorArticleDraft>>({
    title: "",
    slug: "",
    category: "Design",
    topic: "",
    tags: [],
    language: isAz ? "az" : "en",
    excerpt: "",
    content: "",
    coverImageUrl: "",
  });
  const [tagInput, setTagInput] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState<Partial<ContributorProfile>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const approved = await isUserApprovedContributor(user.uid);
      setIsApproved(approved);
      if (approved) {
        const [prof, arts] = await Promise.all([
          getContributorProfile(user.uid),
          getContributorArticles(user.uid),
        ]);
        setProfile(prof);
        setArticles(arts);
        if (prof) {
          setProfileForm(prof);
          const s = await getContributorDashboardStats(user.uid, prof);
          setStats(s);
        }
      }
    } catch (err) {
      console.error("[ContributorDashboard] Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    if (user) {
      loadDashboardData();
    } else {
      setIsApproved(false);
      setLoading(false);
    }
  }, [user, language]);

  // Open Studio for a new article
  const handleCreateNewArticle = () => {
    const authorSlug = profile?.slug || slugifyAuthorName(user?.displayName || "contributor");
    setCurrentArticle({
      id: "",
      authorUid: user?.uid || "",
      authorName: profile?.name || user?.displayName || "Contributor",
      authorSlug,
      authorRole: profile?.professionalTitle || "Editorial Contributor",
      authorPhoto: profile?.profileImage || user?.photoURL || "",
      title: "",
      slug: "",
      category: "Design",
      topic: "",
      tags: [],
      language: isAz ? "az" : "en",
      excerpt: "",
      content: "",
      coverImageUrl: "",
      status: "draft",
    });
    setTagInput("");
    setValidationErrors({});
    setFeedbackBanner(null);
    setEditorPreviewMode("write");
    setIsStudioOpen(true);
  };

  // Open Studio to edit existing article
  const handleEditArticle = (art: ContributorArticleDraft) => {
    setCurrentArticle(art);
    setTagInput(art.tags ? art.tags.join(", ") : "");
    setValidationErrors({});
    setFeedbackBanner(null);
    setEditorPreviewMode("write");
    setIsStudioOpen(true);
  };

  // Auto-generate slug when title changes if slug was not manually customized
  const handleTitleChange = (newTitle: string) => {
    const isNew = !currentArticle.id;
    const currentSlug = currentArticle.slug || "";
    const autoExpectedSlug = slugifyAuthorName(currentArticle.title || "");
    
    // If slug is empty or matches auto-generated slug of previous title, keep in sync
    if (isNew || !currentSlug || currentSlug === autoExpectedSlug) {
      setCurrentArticle((prev) => ({
        ...prev,
        title: newTitle,
        slug: slugifyAuthorName(newTitle),
      }));
    } else {
      setCurrentArticle((prev) => ({
        ...prev,
        title: newTitle,
      }));
    }
  };

  // Format toolbar helper for markdown textarea
  const insertFormatting = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    setCurrentArticle((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 10);
  };

  // Validate required fields before saving/submitting
  const validateArticle = (forSubmission: boolean = false): boolean => {
    const errors: Record<string, string> = {};

    if (!currentArticle.title?.trim()) {
      errors.title = isAz ? "Məqalənin başlığı mütləq daxil edilməlidir." : "Article title is required.";
    }

    if (forSubmission) {
      if (!currentArticle.excerpt?.trim()) {
        errors.excerpt = isAz ? "Xülasə / tezis qeyd olunmalıdır." : "Excerpt is required before submitting.";
      }
      if (!currentArticle.content?.trim() || currentArticle.content.trim().length < 50) {
        errors.content = isAz ? "Məqalə mətni ən azı 50 simvol olmalıdır." : "Article body must be at least 50 characters.";
      }
      if (!currentArticle.category) {
        errors.category = isAz ? "Kateqoriya seçilməlidir." : "Category is required.";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Save Draft
  const handleSaveDraft = async () => {
    if (!user) return;
    if (!validateArticle(false)) return;

    setIsSaving(true);
    setFeedbackBanner(null);

    const authorSlug = profile?.slug || slugifyAuthorName(user.displayName || "contributor");
    const parsedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter(Boolean)
      : currentArticle.tags || [];

    try {
      const saved = await saveContributorArticle({
        ...currentArticle,
        authorUid: user.uid,
        authorName: profile?.name || user.displayName || "Contributor",
        authorSlug,
        authorRole: profile?.professionalTitle || "Editorial Contributor",
        authorPhoto: profile?.profileImage || user.photoURL || "",
        authorBio: profile?.bio || "",
        tags: parsedTags,
        title: currentArticle.title || "",
        status: "draft",
      });

      setCurrentArticle(saved);
      setFeedbackBanner({
        type: "success",
        message: isAz ? "Qaralama uğurla yadda saxlanıldı." : "Draft saved successfully.",
      });

      await loadDashboardData();
    } catch (err) {
      console.error("[ContributorDashboard] Error saving draft:", err);
      setFeedbackBanner({
        type: "error",
        message: isAz ? "Qaralamanı saxlamaq mümkün olmadı." : "Failed to save draft.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Submit for Review
  const handleSubmitForReview = async () => {
    if (!user) return;
    if (!validateArticle(true)) return;

    setIsSaving(true);
    setFeedbackBanner(null);

    const authorSlug = profile?.slug || slugifyAuthorName(user.displayName || "contributor");
    const parsedTags = tagInput
      ? tagInput.split(",").map((t) => t.trim()).filter(Boolean)
      : currentArticle.tags || [];

    try {
      // Save full article first
      const saved = await saveContributorArticle({
        ...currentArticle,
        authorUid: user.uid,
        authorName: profile?.name || user.displayName || "Contributor",
        authorSlug,
        authorRole: profile?.professionalTitle || "Editorial Contributor",
        authorPhoto: profile?.profileImage || user.photoURL || "",
        authorBio: profile?.bio || "",
        tags: parsedTags,
        title: currentArticle.title || "",
        status: "submitted",
        submittedAt: new Date().toISOString(),
      });

      setCurrentArticle(saved);
      setFeedbackBanner({
        type: "success",
        message: isAz
          ? "Məqalə redaksiya baxışına təqdim edildi! Rvan.me redaktoru tərəfindən nəzərdən keçiriləcək."
          : "Article submitted for editorial review! Rvan.me editor will review your piece.",
      });

      await loadDashboardData();
      setTimeout(() => {
        setIsStudioOpen(false);
        setActiveTab("articles");
      }, 1800);
    } catch (err) {
      console.error("[ContributorDashboard] Error submitting article:", err);
      setFeedbackBanner({
        type: "error",
        message: isAz ? "Məqaləni təqdim etmək mümkün olmadı." : "Failed to submit article for review.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Draft
  const handleDeleteDraft = async (articleId: string) => {
    if (!user) return;
    const confirmMsg = t("confirmDeleteDraft", "Are you sure you want to delete this draft?");
    if (!window.confirm(confirmMsg)) return;

    try {
      await deleteContributorDraft(articleId, user.uid);
      await loadDashboardData();
      if (isStudioOpen && currentArticle.id === articleId) {
        setIsStudioOpen(false);
      }
    } catch (err) {
      console.error("Error deleting draft:", err);
    }
  };

  // Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileSaveSuccess(false);

    try {
      const updated = await saveContributorProfile(user.uid, profileForm);
      setProfile(updated);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
      await loadDashboardData();
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Filtered articles list
  const filteredArticles = articles.filter((art) => {
    if (articleFilter === "ALL") return true;
    return art.status === articleFilter;
  });

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${isAz ? "Kontributor İdarəetmə Paneli" : "Contributor Dashboard"} — Rvan.me`}
        description={isAz ? "Müəllif idarəetmə paneli, məqalə emalatxanası və dərc olunma statusu." : "Editorial contributor dashboard, article writing studio, and publishing workflow."}
        url="https://www.rvan.me/contributor/dashboard"
        noIndex
      />

      <SiteHeader siteSettings={siteSettings} />

      <section className="flex-1 px-4 sm:px-6 md:px-10 pt-28 pb-20 max-w-6xl mx-auto w-full">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {isAz ? "Müəllif statusu yoxlanılır..." : "Loading Contributor Studio..."}
            </p>
          </div>
        ) : !user ? (
          /* Unauthenticated State */
          <div className="rounded-3xl border border-border bg-card p-10 md:p-14 text-center shadow-lg backdrop-blur-2xl max-w-xl mx-auto my-12 space-y-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <ShieldCheck size={28} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {isAz ? "Müəllif kimi qoşulmaq üçün daxil olun" : "Sign In to Access Contributor Studio"}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                {isAz
                  ? "Rvan.me müstəqil dizayn və yaradıcı texnologiya nəşrində məqalələrinizi idarə etmək üçün Google profilinizlə daxil olun."
                  : "Sign in with Google to draft essays, submit for editorial review, and publish under your verified author identity."}
              </p>
            </div>
            <Button onClick={() => setAuthModalOpen(true)} variant="primary" size="lg">
              {isAz ? "Google ilə Daxil Ol" : "Sign In with Google"}
            </Button>
          </div>
        ) : !isApproved ? (
          /* Logged In Normal User (Unapproved) */
          <div className="rounded-3xl border border-border bg-card p-10 md:p-14 text-center shadow-lg backdrop-blur-2xl max-w-2xl mx-auto my-12 space-y-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <PenTool size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                {isAz ? "RVAN.ME REDAKSİYASI" : "RVAN.ME EDITORIAL"}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {isAz ? "Rvan.me Üçün Məqalə Yazın" : "Write for Rvan.me"}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-lg mx-auto">
                {isAz
                  ? "Rvan.me-də dərc olunması üçün bir məqalə ideyanız və ya hazır yazınız var? Təklifinizi redaksiya baxışına təqdim edin."
                  : "Have an article idea or a draft to contribute to Rvan.me? Submit your proposal through the Contact portal for editorial review."}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                to={getLocalizedPath("/write")}
                variant="primary"
                size="md"
                icon={<ArrowRight size={14} />}
                iconPosition="right"
              >
                {isAz ? "MƏQALƏ TƏKLİFİ GÖNDƏR" : "SUBMIT ARTICLE PROPOSAL"}
              </Button>
              <Button to={getLocalizedPath("/blog")} variant="secondary" size="md">
                {isAz ? "BLOQ YAZILARINA BAX" : "READ ARTICLES"}
              </Button>
            </div>
          </div>
        ) : isStudioOpen ? (
          /* ── DEDICATED ARTICLE STUDIO VIEW ── */
          <div className="space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsStudioOpen(false)}
                  className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={t("backToDashboard", "Back to Dashboard")}
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                      {t("contributorStudio", "Article Studio")}
                    </span>
                    {currentArticle.status && (
                      <span
                        className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                          currentArticle.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : currentArticle.status === "submitted"
                            ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                            : currentArticle.status === "changes_requested"
                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                            : currentArticle.status === "rejected"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {currentArticle.status === "submitted"
                          ? t("underReview", "Under Review")
                          : currentArticle.status === "changes_requested"
                          ? t("changesRequested", "Changes Requested")
                          : currentArticle.status === "published"
                          ? t("published", "Published")
                          : currentArticle.status === "rejected"
                          ? t("rejected", "Rejected")
                          : t("draft", "Draft")}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold text-foreground truncate max-w-xl">
                    {currentArticle.title || (isAz ? "Yeni Məqalə Qaralaması" : "New Article Draft")}
                  </h1>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {currentArticle.id && currentArticle.status === "draft" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteDraft(currentArticle.id!)}
                    className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                    title={t("deleteDraft", "Delete Draft")}
                  >
                    <Trash2 size={15} />
                  </button>
                )}

                {/* Only allow saving/submitting if status is draft or changes_requested */}
                {currentArticle.status !== "submitted" && currentArticle.status !== "published" && (
                  <>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveDraft}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold border border-border bg-card hover:border-primary/40 text-foreground transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save size={13} />
                      <span>{isSaving ? "..." : t("saveDraft", "Save Draft")}</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSubmitForReview}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-primary text-black hover:brightness-110 transition-all cursor-pointer font-extrabold disabled:opacity-50 shadow-xs"
                    >
                      <Send size={13} />
                      <span>
                        {currentArticle.status === "changes_requested"
                          ? t("resubmitForReview", "Resubmit for Review")
                          : t("submitForReview", "Submit for Review")}
                      </span>
                    </button>
                  </>
                )}

                {currentArticle.status === "published" && (
                  <Link
                    to={getLocalizedPath(`/blog/${currentArticle.slug}`)}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all"
                  >
                    <ExternalLink size={13} />
                    <span>{t("viewPublicArticle", "View Live Article")}</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Notification / Feedback Banner */}
            {feedbackBanner && (
              <div
                className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between ${
                  feedbackBanner.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  {feedbackBanner.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                  <span>{feedbackBanner.message}</span>
                </div>
                <button type="button" onClick={() => setFeedbackBanner(null)}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Review Feedback Banner for Changes Requested */}
            {currentArticle.status === "changes_requested" && currentArticle.reviewNote && (
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  <MessageSquare size={14} /> {t("reviewNote", "Editorial Review Note")} (
                  {currentArticle.reviewedBy || "Admin"})
                </div>
                <p className="text-xs text-foreground font-sans leading-relaxed whitespace-pre-wrap">
                  {currentArticle.reviewNote}
                </p>
                <span className="text-[10px] font-mono text-muted-foreground block pt-1">
                  {t(
                    "changesRequestedNotice",
                    "The editorial team has requested changes for this article. Review the feedback above, make revisions, and resubmit."
                  )}
                </span>
              </div>
            )}

            {/* Read-Only Status Notice for Under Review */}
            {currentArticle.status === "submitted" && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-center gap-3 text-xs font-mono text-amber-600 dark:text-amber-400">
                <Clock size={16} className="shrink-0" />
                <span>
                  {t(
                    "underReviewNotice",
                    "This article is currently under editorial review by Rvan.me. Editing is paused until review is completed."
                  )}
                </span>
              </div>
            )}

            {/* Author Attribution Card */}
            <div className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-bold text-primary">
                  {profile?.name ? profile.name[0].toUpperCase() : "A"}
                </div>
                <div>
                  <span className="font-bold text-foreground block">
                    {profile?.name || user.displayName}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {profile?.professionalTitle || "Editorial Contributor"} · Author slug:{" "}
                    <code className="text-primary font-bold">{profile?.slug || slugifyAuthorName(user.displayName || "")}</code>
                  </span>
                </div>
              </div>

              <span className="text-[10.5px] font-mono text-muted-foreground hidden sm:block">
                {calculateReadTime(currentArticle.content || "", currentArticle.language || "en")}
              </span>
            </div>

            {/* Main Editor Form */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left 2 Cols: Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("articleTitle", "Article Title")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    autoComplete="off"
                    disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                    value={currentArticle.title || ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={isAz ? "məsələn: Dizayn Sistemlərində Tipografiya İerarxiyası..." : "e.g. Typography Hierarchy in Modern Design Systems..."}
                    className={`w-full rounded-2xl border bg-card px-4 py-3 text-base font-bold text-foreground focus:border-primary focus:outline-none transition-colors ${
                      validationErrors.title ? "border-rose-500" : "border-border"
                    }`}
                  />
                  {validationErrors.title && (
                    <p className="mt-1 text-xs font-mono text-rose-500">{validationErrors.title}</p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {t("articleExcerpt", "Excerpt / Short Premise")} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    autoComplete="off"
                    disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                    value={currentArticle.excerpt || ""}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, excerpt: e.target.value })}
                    placeholder={isAz ? "Məqalənin əsas tezisi, oxucuya verəcəyi dəyər və qısa xülasəsi..." : "Core premise, thesis question, and editorial takeaway for the reader..."}
                    className={`w-full rounded-2xl border bg-card px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none transition-colors ${
                      validationErrors.excerpt ? "border-rose-500" : "border-border"
                    }`}
                  />
                  {validationErrors.excerpt && (
                    <p className="mt-1 text-xs font-mono text-rose-500">{validationErrors.excerpt}</p>
                  )}
                </div>

                {/* Body Content Editor with Toolbar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {t("articleContent", "Article Body (Markdown)")} <span className="text-rose-500">*</span>
                    </label>

                    {/* Write / Preview Tab Switcher */}
                    <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-0.5">
                      <button
                        type="button"
                        onClick={() => setEditorPreviewMode("write")}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                          editorPreviewMode === "write"
                            ? "bg-primary text-black"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorPreviewMode("preview")}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase transition-all ${
                          editorPreviewMode === "preview"
                            ? "bg-primary text-black"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t("preview", "Preview")}
                      </button>
                    </div>
                  </div>

                  {editorPreviewMode === "write" ? (
                    <div className="rounded-2xl border border-border bg-card overflow-hidden">
                      {/* Markdown Toolbar */}
                      {currentArticle.status !== "submitted" && currentArticle.status !== "published" && (
                        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/30 text-muted-foreground">
                          <button
                            type="button"
                            onClick={() => insertFormatting("**", "**")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Bold"
                          >
                            <Bold size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("*", "*")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Italic"
                          >
                            <Italic size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("## ", "")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Heading 2"
                          >
                            <Heading size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("> ", "")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Quote"
                          >
                            <Quote size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("- ", "")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Bullet List"
                          >
                            <List size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("```\n", "\n```")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Code Block"
                          >
                            <Code size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting("[", "](https://)")}
                            className="p-1.5 rounded hover:bg-card hover:text-foreground transition-colors"
                            title="Link"
                          >
                            <Link2 size={13} />
                          </button>
                        </div>
                      )}

                      <textarea
                        ref={textareaRef}
                        rows={16}
                        autoComplete="off"
                        disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                        value={currentArticle.content || ""}
                        onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                        placeholder={isAz ? "Məqalənizin tam mətni, başlıqlar və paraqraflar..." : "Write your essay content, headings, and code snippets in Markdown..."}
                        className="w-full bg-transparent p-4 text-xs font-mono text-foreground focus:outline-none leading-relaxed resize-y"
                      />
                    </div>
                  ) : (
                    /* Rendered Preview */
                    <div className="rounded-2xl border border-border bg-card p-6 min-h-[350px] prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
                      {currentArticle.content ? (
                        <div className="whitespace-pre-wrap font-sans text-xs text-foreground/90">
                          {currentArticle.content}
                        </div>
                      ) : (
                        <p className="text-muted-foreground font-mono italic">No content written yet.</p>
                      )}
                    </div>
                  )}

                  {validationErrors.content && (
                    <p className="mt-1 text-xs font-mono text-rose-500">{validationErrors.content}</p>
                  )}
                </div>
              </div>

              {/* Right Col: Metadata & Settings */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                    Editorial Metadata
                  </h3>

                  {/* Slug */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-muted-foreground mb-1">
                      {t("articleSlug", "Article URL Slug")}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                      value={currentArticle.slug || ""}
                      onChange={(e) =>
                        setCurrentArticle({
                          ...currentArticle,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-muted-foreground mt-0.5 block">
                      /blog/{currentArticle.slug || "slug"}
                    </span>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-muted-foreground mb-1">
                      {t("articleCategory", "Category")}
                    </label>
                    <select
                      disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                      value={currentArticle.category || "Design"}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="Design">Design</option>
                      <option value="Motion">Motion</option>
                      <option value="Branding">Branding</option>
                      <option value="AI & Tech">AI & Tech</option>
                      <option value="Marketing">Marketing</option>
                      <option value="UX">UX</option>
                      <option value="Typography">Typography</option>
                      <option value="Creative Culture">Creative Culture</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-muted-foreground mb-1">
                      Language
                    </label>
                    <select
                      disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                      value={currentArticle.language || "en"}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, language: e.target.value as "en" | "az" })}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="en">English (EN)</option>
                      <option value="az">Azərbaycan dili (AZ)</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-muted-foreground mb-1">
                      {t("articleTags", "Tags (comma-separated)")}
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="UI, Motion, Figma, Typography"
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Cover Image URL */}
                  <div>
                    <label className="block text-[11px] font-mono font-bold uppercase text-muted-foreground mb-1">
                      {t("coverImageUrl", "Cover Image URL")}
                    </label>
                    <input
                      type="url"
                      autoComplete="off"
                      disabled={currentArticle.status === "submitted" || currentArticle.status === "published"}
                      value={currentArticle.coverImageUrl || ""}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, coverImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                    />
                    {currentArticle.coverImageUrl && (
                      <div className="mt-2 rounded-xl border border-border overflow-hidden aspect-video bg-muted relative">
                        <img
                          src={currentArticle.coverImageUrl}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── MAIN DASHBOARD VIEW ── */
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border pb-8">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                  <PenTool size={14} /> {isAz ? "MÜƏLLİF VƏ REDAKSİYA MƏRKƏZİ" : "CONTRIBUTOR & EDITORIAL HUB"}
                </span>
                <h1 className="mt-1 text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {isAz ? "Müəllif İdarəetmə Paneli" : "Contributor Dashboard"}
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isAz
                    ? "Məqalə yazın, qaralamaları idarə edin və dərc olunma statusunu izləyin."
                    : "Draft new essays, submit for editorial review, and track publication status."}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateNewArticle}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-black hover:brightness-110 transition-all cursor-pointer font-extrabold shadow-sm"
              >
                <Plus size={15} />
                <span>{t("writeNewEssay", "Write New Article")}</span>
              </button>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-primary text-black font-extrabold shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sparkles size={14} />
                <span>{t("adminOverview", "Overview")}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-primary text-black font-extrabold shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={14} />
                <span>
                  {t("myArticles", "My Articles")} ({articles.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-primary text-black font-extrabold shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserCheck size={14} />
                <span>{t("navProfile", "Profile")}</span>
              </button>
            </div>

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("published", "Published")}</span>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.publishedCount}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("underReview", "Under Review")}</span>
                      <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.submittedCount}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("changesRequested", "Changes Requested")}</span>
                      <MessageSquare size={16} className="text-purple-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.changesRequestedCount}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("draft", "Drafts")}</span>
                      <FileText size={16} className="text-primary" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.draftsCount}</p>
                  </div>
                </div>

                {/* Contributor Profile Status Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-xl">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase">
                      <Sparkles size={14} /> {isAz ? "Status: Aktiv Kontributor" : "Status: Active Contributor"}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {profile?.name || user.displayName} — {profile?.professionalTitle || "Editorial Contributor"}
                    </p>
                  </div>

                  <Link
                    to={getLocalizedPath(`/author/${profile?.slug || slugifyAuthorName(user.displayName || "contributor")}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline font-bold"
                  >
                    <span>{isAz ? "İctimai Müəllif Profilinizə Baxın" : "View Your Public Author Profile"}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Recent Articles Deck */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        {isAz ? "Son Məqalələriniz" : "Recent Articles"}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz ? "Son hazırladığınız qaralamalar və baxışda olan məqalələr." : "Recent drafts, submissions, and published pieces."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("articles")}
                      className="text-xs font-mono font-bold text-primary hover:underline"
                    >
                      {isAz ? "Bütün Məqalələr →" : "All Articles →"}
                    </button>
                  </div>

                  {articles.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-muted-foreground">
                      {t("noArticlesFound", "No articles found.")}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {articles.slice(0, 4).map((art) => (
                        <div
                          key={art.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-foreground truncate">{art.title}</h3>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                                  art.status === "published"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : art.status === "submitted"
                                    ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                                    : art.status === "changes_requested"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                    : art.status === "rejected"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                {art.status === "submitted" ? t("underReview", "Under Review") : art.status}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {art.category} · {calculateReadTime(art.content || "", art.language || "en")} ·{" "}
                              {new Date(art.updatedAt || art.createdAt).toLocaleDateString(isAz ? "az-AZ" : "en-US")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleEditArticle(art)}
                              className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border border-border bg-card hover:border-primary/50 text-foreground transition-colors cursor-pointer"
                            >
                              {art.status === "submitted" || art.status === "published" ? t("preview", "Preview") : t("edit", "Edit")}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: MY ARTICLES ── */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                    {t("adminStatus", "Status")}:
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["ALL", "draft", "submitted", "changes_requested", "published", "rejected"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setArticleFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          articleFilter === filter
                            ? "bg-primary text-black font-extrabold shadow-xs"
                            : "border border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {filter === "ALL" && t("allArticles", "All Articles")}
                        {filter === "draft" && t("draft", "Draft")}
                        {filter === "submitted" && t("underReview", "Under Review")}
                        {filter === "changes_requested" && t("changesRequested", "Changes Requested")}
                        {filter === "published" && t("published", "Published")}
                        {filter === "rejected" && t("rejected", "Rejected")}
                        {filter !== "ALL" && ` (${articles.filter((a) => a.status === filter).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Articles Deck */}
                {filteredArticles.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl border border-border bg-card text-xs font-mono text-muted-foreground space-y-4">
                    <PenTool size={28} className="mx-auto text-muted-foreground/40" />
                    <p>{t("noArticlesFound", "No articles found.")}</p>
                    <button
                      type="button"
                      onClick={handleCreateNewArticle}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black text-xs font-mono font-bold"
                    >
                      <Plus size={13} /> {t("writeNewEssay", "Write New Article")}
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        className="rounded-3xl border border-border bg-card p-6 space-y-4 hover:border-primary/40 transition-colors shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  art.status === "published"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : art.status === "submitted"
                                    ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                                    : art.status === "changes_requested"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                    : art.status === "rejected"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                    : "bg-muted text-muted-foreground border-border"
                                }`}
                              >
                                {art.status === "submitted"
                                  ? t("underReview", "Under Review")
                                  : art.status === "changes_requested"
                                  ? t("changesRequested", "Changes Requested")
                                  : art.status}
                              </span>
                              <span className="text-xs font-mono text-primary font-bold">
                                {art.category}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-foreground mt-1">
                              {art.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditArticle(art)}
                              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border border-border bg-card hover:border-primary/50 text-foreground transition-colors cursor-pointer"
                            >
                              <Edit3 size={12} />
                              <span>{art.status === "submitted" || art.status === "published" ? t("preview", "Preview") : t("edit", "Edit")}</span>
                            </button>

                            {art.status === "draft" && (
                              <button
                                type="button"
                                onClick={() => handleDeleteDraft(art.id)}
                                className="p-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                                title={t("deleteDraft", "Delete Draft")}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}

                            {art.status === "published" && (
                              <Link
                                to={getLocalizedPath(`/blog/${art.slug}`)}
                                target="_blank"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all"
                              >
                                <ExternalLink size={12} />
                                <span>{t("viewPublicArticle", "View Live")}</span>
                              </Link>
                            )}
                          </div>
                        </div>

                        {art.excerpt && (
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {art.excerpt}
                          </p>
                        )}

                        {/* If changes requested, show review feedback callout */}
                        {art.status === "changes_requested" && art.reviewNote && (
                          <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                              {t("reviewNote", "Editorial Review Note")}:
                            </span>
                            <p className="text-xs text-foreground font-sans">{art.reviewNote}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-[10.5px] font-mono text-muted-foreground/80 pt-2 border-t border-border">
                          <span>Slug: <code>/blog/{art.slug}</code></span>
                          <span>{new Date(art.updatedAt || art.createdAt).toLocaleString(isAz ? "az-AZ" : "en-US")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: PROFILE ── */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} className="max-w-2xl mx-auto space-y-6">
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-lg font-bold text-foreground">
                      {isAz ? "Müəllif Profili Məlumatları" : "Contributor Author Profile"}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAz
                        ? "Dərc edilmiş məqalələrinizdə və ictimai müəllif səhifənizdə görünən məlumatlar."
                        : "Information presented on your public author page and alongside your published essays."}
                    </p>
                  </div>

                  {profileSaveSuccess && (
                    <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>{isAz ? "Profil uğurla yeniləndi." : "Profile updated successfully."}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-muted-foreground uppercase mb-1">
                        Full Display Name
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        value={profileForm.name || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-muted-foreground uppercase mb-1">
                        Professional Title
                      </label>
                      <input
                        type="text"
                        autoComplete="off"
                        value={profileForm.professionalTitle || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, professionalTitle: e.target.value })}
                        placeholder="e.g. Senior Product Designer, Motion Director"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-muted-foreground uppercase mb-1">
                        Bio / Editorial Statement
                      </label>
                      <textarea
                        rows={4}
                        autoComplete="off"
                        value={profileForm.bio || ""}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        placeholder="Write a brief professional background..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-mono font-bold text-muted-foreground uppercase mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={profileForm.location || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          placeholder="Baku, Azerbaijan"
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-bold text-muted-foreground uppercase mb-1">
                          Current Workplace / Studio
                        </label>
                        <input
                          type="text"
                          autoComplete="off"
                          value={profileForm.currentWorkplace || ""}
                          onChange={(e) => setProfileForm({ ...profileForm, currentWorkplace: e.target.value })}
                          placeholder="Independent / Studio name"
                          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <Link
                      to={getLocalizedPath(`/author/${profile?.slug || slugifyAuthorName(user.displayName || "")}`)}
                      target="_blank"
                      className="text-xs font-mono text-primary hover:underline font-bold inline-flex items-center gap-1"
                    >
                      <span>{isAz ? "İctimai Səhifəyə Bax" : "View Public Page"}</span>
                      <ExternalLink size={12} />
                    </Link>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-5 py-2 rounded-xl bg-primary text-black font-extrabold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? "..." : (isAz ? "Yadda Saxla" : "Save Changes")}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </section>

      <Footer siteSettings={siteSettings} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </main>
  );
}
