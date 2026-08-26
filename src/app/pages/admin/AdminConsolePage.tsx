import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Lock,
  Sparkles,
  Inbox,
  PenTool,
  Users,
  Eye,
  BarChart3,
  Layers,
  Settings,
  Mail,
  FileText,
  Compass,
  ArrowRight,
  Globe,
  AlertCircle,
  Clock,
  Check,
  X,
  MessageSquare,
  Trash2,
  Send,
  User,
  Plus,
  Upload,
  Image as ImageIcon,
  Edit3,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import SEO from "../../components/SEO";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { SiteSettings } from "../../../types/cms";
import { BlogPost } from "../../../types/blog";
import { fetchAllBlogs, fetchSiteSettings } from "../../../lib/sanityQueries";

type AdminTab = "overview" | "write" | "submissions" | "editorial" | "comments" | "site" | "analytics";
type SubmissionFilter = "ALL" | "PENDING" | "PUBLISHED" | "CHANGES_REQUESTED" | "REJECTED";
type CommentFilter = "ALL" | "pending" | "approved" | "declined";

export interface RealArticleSubmission {
  _id: string;
  _type: string;
  authorName: string;
  authorEmail: string;
  authorBio?: string;
  authorWebsite?: string;
  profilePhotoUrl?: string;
  profilePhotoAssetRef?: string;
  title: string;
  slug?: string;
  language: "en" | "az";
  category: string;
  topic?: string;
  tags?: string[];
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  coverImageAssetRef?: string;
  editorialNote?: string;
  editorialReviewNote?: string;
  originalWorkConfirmed?: boolean;
  status: "PENDING" | "PUBLISHED" | "CHANGES_REQUESTED" | "REJECTED";
  submittedAt: string;
  publishedAt?: string;
  publishedBlogId?: string;
}

export interface AdminCommentItem {
  _id: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  commentText: string;
  status: "approved" | "pending" | "declined";
  likes?: number;
  dislikes?: number;
  createdAt: string;
}

const DEFAULT_CATEGORIES = [
  "Design",
  "Marketing",
  "Branding",
  "AI & Creativity",
  "Motion Design",
  "Strategy",
  "Technology",
];

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
    if (path.includes("/write-blog") || path.includes("/compose")) return "write";
    if (path.includes("/submissions") || path.includes("/inbox")) return "submissions";
    if (path.includes("/editorial") || path.includes("/articles")) return "editorial";
    if (path.includes("/comments")) return "comments";
    if (path.includes("/site")) return "site";
    if (path.includes("/analytics")) return "analytics";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Real Data States
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);
  const [submissions, setSubmissions] = useState<RealArticleSubmission[]>([]);
  const [commentsList, setCommentsList] = useState<AdminCommentItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Submission Review Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<RealArticleSubmission | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [reviewNoteInput, setReviewNoteInput] = useState("");
  const [showFeedbackBox, setShowFeedbackBox] = useState<"approve" | "changes" | "reject" | null>(null);
  const [submissionFilter, setSubmissionFilter] = useState<SubmissionFilter>("ALL");
  const [commentFilter, setCommentFilter] = useState<CommentFilter>("ALL");
  const [editorialSearch, setEditorialSearch] = useState("");

  // ── ARTICLE PUBLISHER FORM STATE ──
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formTitleAz, setFormTitleAz] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formCategory, setFormCategory] = useState("Design");
  const [formTags, setFormTags] = useState("Design, Branding, Strategy");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formExcerptAz, setFormExcerptAz] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formContentAz, setFormContentAz] = useState("");
  const [formAuthorName, setFormAuthorName] = useState("Ravan Mammadov");
  const [formAuthorRole, setFormAuthorRole] = useState("Founder & Creative Director");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formCoverBase64, setFormCoverBase64] = useState<string | null>(null);
  const [formCoverName, setFormCoverName] = useState<string>("");
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishMessage, setPublishMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── COMMENT EDIT MODAL STATE ──
  const [editingComment, setEditingComment] = useState<AdminCommentItem | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [commentActionLoading, setCommentActionLoading] = useState(false);

  // Update tab state when route changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    const basePath =
      tab === "overview"
        ? "/admin"
        : tab === "write"
        ? "/admin/write-blog"
        : `/admin/${tab}`;
    navigate(getLocalizedPath(basePath));
  };

  const loadAllData = async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    setDataError(null);
    try {
      // 1. Load published articles from Sanity
      const blogs = await fetchAllBlogs(language);
      setPublishedBlogs(blogs || []);

      // 2. Load real submissions from Sanity via /api/admin-submissions
      const subRes = await fetch("/api/admin-submissions");
      if (subRes.ok) {
        const json = await subRes.json();
        setSubmissions(json.submissions || []);
      }

      // 3. Load all comments from Sanity via /api/comment?all=true
      const commRes = await fetch("/api/comment?all=true");
      if (commRes.ok) {
        const commJson = await commRes.json();
        setCommentsList(commJson.comments || []);
      }
    } catch (err: any) {
      console.error("[AdminConsole] Error loading admin data:", err);
      setDataError(err?.message || "Failed to load live editorial data.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin, language]);

  // Handle Cover Image File Selection
  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormCoverName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFormCoverBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Reset Blog Form
  const resetBlogForm = () => {
    setEditingBlogId(null);
    setFormTitle("");
    setFormTitleAz("");
    setFormSlug("");
    setFormCategory("Design");
    setFormTags("Design, Branding, Strategy");
    setFormExcerpt("");
    setFormExcerptAz("");
    setFormContent("");
    setFormContentAz("");
    setFormAuthorName("Ravan Mammadov");
    setFormAuthorRole("Founder & Creative Director");
    setFormFeatured(false);
    setFormCoverBase64(null);
    setFormCoverName("");
    setExistingCoverUrl(null);
    setPublishMessage(null);
  };

  // Load an existing blog into the editor
  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog._id);
    setFormTitle(blog.title || "");
    setFormTitleAz(blog.title_az || blog.title || "");
    setFormSlug(blog.slug?.current || blog.originalSlug || "");
    setFormCategory(blog.category || "Design");
    setFormTags(Array.isArray(blog.tags) ? blog.tags.join(", ") : "Design");
    setFormExcerpt(blog.excerpt || "");
    setFormExcerptAz(blog.excerpt_az || blog.excerpt || "");
    
    // Extract text from body if present
    let rawText = "";
    if (Array.isArray(blog.body)) {
      rawText = blog.body
        .map((b) => (b.children ? b.children.map((c: any) => c.text).join("") : ""))
        .join("\n\n");
    }
    setFormContent(rawText || blog.excerpt || "");
    setFormContentAz(rawText || blog.excerpt || "");
    setFormAuthorName(blog.authorName || "Ravan Mammadov");
    setFormAuthorRole(blog.authorRole || "Founder & Creative Director");
    setFormFeatured(Boolean(blog.featured));
    
    const coverUrl = typeof blog.coverImage?.url === "string" ? blog.coverImage.url : null;
    setExistingCoverUrl(coverUrl);
    setFormCoverBase64(null);
    setPublishMessage(null);
    switchTab("write");
  };

  // ── SUBMIT ARTICLE DIRECTLY TO SANITY ──
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setPublishMessage({ type: "error", text: "Please provide an article title." });
      return;
    }

    setPublishLoading(true);
    setPublishMessage(null);

    try {
      const payload: any = {
        action: editingBlogId ? "update" : "create",
        blogId: editingBlogId || undefined,
        title: formTitle.trim(),
        title_az: formTitleAz.trim() || formTitle.trim(),
        slug: formSlug.trim() || undefined,
        category: formCategory,
        tags: formTags.split(",").map((t) => t.trim()).filter(Boolean),
        excerpt: formExcerpt.trim(),
        excerpt_az: formExcerptAz.trim() || formExcerpt.trim(),
        content: formContent.trim(),
        content_az: formContentAz.trim() || formContent.trim(),
        authorName: formAuthorName.trim(),
        authorRole: formAuthorRole.trim(),
        featured: formFeatured,
        coverImageBase64: formCoverBase64 || undefined,
        coverImageName: formCoverName || undefined,
      };

      const res = await fetch("/api/admin-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to publish article.");
      }

      setPublishMessage({
        type: "success",
        text: `✓ Article "${formTitle}" published live to Sanity CMS!`,
      });

      // Reload blogs list
      fetchAllBlogs(language).then((blogs) => {
        setPublishedBlogs(blogs || []);
      });

      if (!editingBlogId) {
        resetBlogForm();
      }
    } catch (err: any) {
      console.error("[AdminConsole] Publish error:", err);
      setPublishMessage({ type: "error", text: err?.message || "An error occurred." });
    } finally {
      setPublishLoading(false);
    }
  };

  // ── DELETE ARTICLE FROM SANITY ──
  const handleDeleteBlog = async (blogId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" from Sanity CMS?`)) {
      return;
    }

    try {
      const res = await fetch("/api/admin-blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", blogId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPublishedBlogs((prev) => prev.filter((b) => b._id !== blogId));
      } else {
        alert(data.error || "Failed to delete article.");
      }
    } catch (e: any) {
      alert(e.message || "Failed to delete article.");
    }
  };

  // ── COMMENT MODERATION ACTIONS ──
  const handleCommentAction = async (action: "approve" | "decline" | "delete" | "edit", commentId: string, text?: string) => {
    setCommentActionLoading(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          commentId,
          commentText: text,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to execute comment action.");
      }

      if (action === "delete") {
        setCommentsList((prev) => prev.filter((c) => c._id !== commentId));
      } else if (action === "approve") {
        setCommentsList((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, status: "approved" } : c))
        );
      } else if (action === "decline") {
        setCommentsList((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, status: "declined" } : c))
        );
      } else if (action === "edit") {
        setCommentsList((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, commentText: text || c.commentText } : c))
        );
        setEditingComment(null);
      }
    } catch (err: any) {
      alert(err.message || "Comment action failed.");
    } finally {
      setCommentActionLoading(false);
    }
  };

  // ── SUBMISSION ACTION HANDLER ──
  const handleSubmissionAction = async (action: "approve_and_publish" | "request_changes" | "reject" | "delete") => {
    if (!selectedSubmission) return;
    setActionLoading(true);
    setActionSuccess(null);
    setActionError(null);

    try {
      const res = await fetch("/api/admin-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          submissionId: selectedSubmission._id,
          editorialNote: reviewNoteInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process submission action.");
      }

      setActionSuccess(data.message || "Action completed successfully.");
      setShowFeedbackBox(null);
      setReviewNoteInput("");

      if (action === "delete") {
        setSubmissions((prev) => prev.filter((s) => s._id !== selectedSubmission._id));
        setSelectedSubmission(null);
      } else {
        const newStatus =
          action === "approve_and_publish"
            ? "PUBLISHED"
            : action === "request_changes"
            ? "CHANGES_REQUESTED"
            : "REJECTED";

        setSubmissions((prev) =>
          prev.map((s) =>
            s._id === selectedSubmission._id
              ? {
                  ...s,
                  status: newStatus,
                  publishedBlogId: data.blogId || s.publishedBlogId,
                  editorialReviewNote: reviewNoteInput.trim() || s.editorialReviewNote,
                }
              : s
          )
        );

        setSelectedSubmission((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                publishedBlogId: data.blogId || prev.publishedBlogId,
                editorialReviewNote: reviewNoteInput.trim() || prev.editorialReviewNote,
              }
            : null
        );
      }

      if (action === "approve_and_publish") {
        fetchAllBlogs(language).then((blogs) => {
          setPublishedBlogs(blogs || []);
        });
      }
    } catch (err: any) {
      console.error("[AdminConsole] Action failed:", err);
      setActionError(err?.message || "An unexpected error occurred.");
    } finally {
      setActionLoading(false);
    }
  };

  // Real Computed Statistics
  const pendingSubmissions = submissions.filter((s) => s.status === "PENDING");
  const pendingComments = commentsList.filter((c) => c.status === "pending");

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === "ALL") return true;
    return s.status === submissionFilter;
  });

  // Filtered Comments
  const filteredComments = commentsList.filter((c) => {
    if (commentFilter === "ALL") return true;
    return c.status === commentFilter;
  });

  // Filtered Published Blogs
  const filteredPublishedBlogs = publishedBlogs.filter((b) => {
    if (!editorialSearch.trim()) return true;
    const q = editorialSearch.toLowerCase();
    return (
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.authorName && b.authorName.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q))
    );
  });

  // Access Control Screen
  if (authLoading) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-mono text-muted-foreground">
          <RefreshCw className="animate-spin text-primary" size={20} />
          <span>{isAz ? "Admin autentifikasiyası yoxlanılır..." : "Verifying admin credentials..."}</span>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <SEO title="Access Denied — Admin Console" canonical="/admin" />
        <SiteHeader siteSettings={siteSettings} />
        <div className="max-w-md mx-auto px-4 py-36 text-center space-y-6">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {t("adminAccessDenied", "Admin Access Required")}
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "adminAccessDeniedDesc",
                "You do not have administrative privileges to view this console. Please sign in with the platform administrator account."
              )}
            </p>
          </div>
          <Button to={getLocalizedPath("/")} variant="primary" size="md">
            {isAz ? "ƏSAS SƏHİFƏYƏ QAYIT" : "RETURN HOME"}
          </Button>
        </div>
        <Footer siteSettings={siteSettings} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <SEO
        title={isAz ? "Admin İdarəetmə Paneli — Rvan.me" : "Admin Console — Rvan.me"}
        canonical={isAz ? "/az/admin" : "/admin"}
      />
      <SiteHeader siteSettings={siteSettings} />

      {/* Admin Top Header Banner */}
      <section className="pt-28 pb-8 px-4 sm:px-6 md:px-8 border-b border-border bg-gradient-to-b from-primary/[0.03] to-transparent">
        <div className="max-w-[1280px] mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck size={12} />
                  <span>{isAz ? "SAYT İDARƏETMƏ MƏRKƏZİ" : "EDITORIAL CONTROL CENTER"}</span>
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Admin: {user?.email}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isAz ? "Rvan.me Redaksiya & Nəşr Paneli" : "Rvan.me Editorial & Publishing Console"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  resetBlogForm();
                  switchTab("write");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
              >
                <Plus size={14} />
                <span>{isAz ? "Yeni Məqalə Yaz" : "Write Article"}</span>
              </button>

              <button
                type="button"
                onClick={loadAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                <RefreshCw size={14} className={loadingData ? "animate-spin text-primary" : ""} />
                <span>{loadingData ? (isAz ? "Yenilənir..." : "Refreshing...") : (isAz ? "Məlumatları Yenilə" : "Refresh")}</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/80 pt-2 overflow-x-auto">
            <button
              onClick={() => switchTab("overview")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass size={14} />
              <span>{isAz ? "Ümumi Baxış" : "Overview"}</span>
            </button>

            <button
              onClick={() => switchTab("write")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "write"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenTool size={14} />
              <span>{editingBlogId ? (isAz ? "Məqaləni Redaktə Et" : "Edit Article") : (isAz ? "Məqalə Yaz & Dərc Et" : "Write & Publish")}</span>
            </button>

            <button
              onClick={() => switchTab("submissions")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "submissions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail size={14} />
              <span>
                {isAz ? "Təqdimatlar" : "Submissions"}
                {pendingSubmissions.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                    {pendingSubmissions.length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => switchTab("editorial")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "editorial"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>{isAz ? "Dərc Olunmuş Məqalələr" : "Published Articles"} ({publishedBlogs.length})</span>
            </button>

            <button
              onClick={() => switchTab("comments")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "comments"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare size={14} />
              <span>
                {isAz ? "Şərhlər" : "Comments"} ({commentsList.length})
                {pendingComments.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                    {pendingComments.length}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => switchTab("site")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "site"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers size={14} />
              <span>{isAz ? "Sayt İdarəetməsi" : "Site Management"}</span>
            </button>

            <button
              onClick={() => switchTab("analytics")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "analytics"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 size={14} />
              <span>{isAz ? "Analitika" : "Analytics"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <section className="px-4 py-8 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-8">
        {dataError && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{dataError}</span>
          </div>
        )}

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "DƏRC EDİLMİŞ MƏQALƏLƏR" : "PUBLISHED ARTICLES"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{publishedBlogs.length}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Sanity CMS üzərindən canlı" : "Live in Sanity CMS"}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "OXUCU ŞƏRHLƏRİ" : "TOTAL COMMENTS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{commentsList.length}</div>
                <p className="text-[11px] text-muted-foreground">
                  {pendingComments.length > 0 ? `${pendingComments.length} pending approval` : "All moderated"}
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "GÖZLƏYƏN TƏQDİMATLAR" : "PENDING SUBMISSIONS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{pendingSubmissions.length}</div>
                <p className="text-[11px] text-muted-foreground">
                  {pendingSubmissions.length > 0 ? "Awaiting editorial review" : "Inbox zero"}
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "SAYT XƏRİTƏSİ" : "SITEMAP URLS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">699</div>
                <p className="text-[11px] text-muted-foreground">4,207 pre-rendered HTML routes</p>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="p-6 sm:p-8 rounded-3xl border border-primary/30 bg-primary/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Məqaləni Birbaşa Saytdan Dərc Et" : "Publish Articles Directly from Rvan.me"}
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl">
                  {isAz
                    ? "Sanity Studio açmadan, birbaşa buradan məqalə yazın, şəkil yükləyin və 1 kliklə Sanity CMS-də canlı yayımlayın."
                    : "No external studio needed. Compose articles, upload covers, and publish live to Sanity CMS in one click."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetBlogForm();
                  switchTab("write");
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>{isAz ? "Məqalə Redaktorunu Aç" : "Open Article Composer"}</span>
              </button>
            </div>

            {/* Recent Submissions */}
            {pendingSubmissions.length > 0 && (
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Baxış Tələb Edən Təqdimatlar" : "Submissions Awaiting Approval"}
                </h3>
                <div className="space-y-3">
                  {pendingSubmissions.slice(0, 3).map((sub) => (
                    <div
                      key={sub._id}
                      className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-foreground">{sub.title}</h4>
                        <p className="text-xs text-muted-foreground">By {sub.authorName} ({sub.authorEmail})</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          switchTab("submissions");
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase shrink-0 cursor-pointer"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: WRITE & PUBLISH ARTICLE DIRECTLY TO SANITY ── */}
        {activeTab === "write" && (
          <form onSubmit={handlePublishArticle} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <PenTool size={20} className="text-primary" />
                  <span>
                    {editingBlogId
                      ? isAz
                        ? `Məqaləni Redaktə Et: ${formTitle}`
                        : `Editing Article: ${formTitle}`
                      : isAz
                      ? "Yeni Məqalə Yaz & Sanity-də Dərc Et"
                      : "Write & Publish Live Article"}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "Məzmun birbaşa Sanity CMS bazasına yazılır və avtomatik SEO ilə saytda aktivləşir."
                    : "Published directly to Sanity CMS with automatic high-standard SEO and OpenGraph generation."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {editingBlogId && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-4 py-2 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                  >
                    {isAz ? "Yenisini Yaz" : "New Article"}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={publishLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {publishLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{isAz ? "Dərc Olunur..." : "Publishing..."}</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{editingBlogId ? (isAz ? "Yenilə & Dərc Et" : "Update Live Post") : (isAz ? "Canlı Dərc Et" : "Publish Live Post")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {publishMessage && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  publishMessage.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 border-destructive/20 text-destructive"
                }`}
              >
                {publishMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{publishMessage.text}</span>
              </div>
            )}

            {/* Form Fields Grid */}
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Left Main Form (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Title (English) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-foreground uppercase">
                    Article Title (English / Primary) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Visual Hierarchy Framework for Modern Interfaces"
                    className="w-full p-4 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Title (Azerbaijani) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-foreground uppercase">
                    Məqalə Başlığı (Azərbaycanca)
                  </label>
                  <input
                    type="text"
                    value={formTitleAz}
                    onChange={(e) => setFormTitleAz(e.target.value)}
                    placeholder="məs. Müasir Veb İnterfeyslər Üçün Vizual İyerarxiya Çərçivəsi"
                    className="w-full p-4 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Excerpt (Summary) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-foreground uppercase">
                    Excerpt / Lead Summary (used for Google Meta Description automatically)
                  </label>
                  <textarea
                    rows={3}
                    value={formExcerpt}
                    onChange={(e) => setFormExcerpt(e.target.value)}
                    placeholder="A concise 2-sentence hook explaining what designers or marketers will learn from this piece..."
                    className="w-full p-4 rounded-2xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Excerpt AZ */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-foreground uppercase">
                    Qısa Xülasə (Azərbaycanca)
                  </label>
                  <textarea
                    rows={2}
                    value={formExcerptAz}
                    onChange={(e) => setFormExcerptAz(e.target.value)}
                    placeholder="Məqalənin Azərbaycan dilində qısa 2 cümləlik xülasəsi..."
                    className="w-full p-4 rounded-2xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Markdown Article Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-foreground uppercase">
                      Article Body (Markdown Supported) *
                    </label>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Use ## for Headings, - for bullets, &gt; for quotes
                    </span>
                  </div>
                  <textarea
                    rows={16}
                    required
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder={`## 1. The Core Principle\n\nWhen designing digital products, visual clarity determines user retention...\n\n### Key Takeaways\n- Principle 1\n- Principle 2`}
                    className="w-full p-4 rounded-2xl border border-border bg-card font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
              </div>

              {/* Right Sidebar Metadata (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Cover Image Upload */}
                <div className="p-5 rounded-3xl border border-border bg-card space-y-3">
                  <span className="text-xs font-mono font-bold text-foreground uppercase block">
                    Cover Image (Auto-syncs with OpenGraph)
                  </span>

                  {formCoverBase64 ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-border bg-neutral-900">
                      <img src={formCoverBase64} alt="Cover preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFormCoverBase64(null);
                          setFormCoverName("");
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : existingCoverUrl ? (
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-border bg-neutral-900">
                      <img src={existingCoverUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="border border-dashed border-border rounded-2xl p-6 text-center text-xs text-muted-foreground space-y-2">
                      <ImageIcon size={24} className="mx-auto text-primary" />
                      <p>Upload 16:9 article cover</p>
                    </div>
                  )}

                  <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground cursor-pointer transition-colors">
                    <Upload size={14} />
                    <span>{formCoverBase64 || existingCoverUrl ? "Change Cover Image" : "Upload Cover Image"}</span>
                    <input type="file" accept="image/*" onChange={handleCoverFileChange} className="hidden" />
                  </label>
                </div>

                {/* Category & Tags */}
                <div className="p-5 rounded-3xl border border-border bg-card space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-foreground uppercase">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-3 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:border-primary"
                    >
                      {DEFAULT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-foreground uppercase">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="UI, UX, Typography, Branding"
                      className="w-full p-3 rounded-xl border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    >
                    </input>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-foreground uppercase">Custom URL Slug (Optional)</label>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="e.g. visual-hierarchy-framework"
                      className="w-full p-3 rounded-xl border border-border bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featuredCheck"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded accent-primary h-4 w-4"
                    />
                    <label htmlFor="featuredCheck" className="text-xs font-bold text-foreground cursor-pointer">
                      Feature on Homepage Top
                    </label>
                  </div>
                </div>

                {/* Author Info */}
                <div className="p-5 rounded-3xl border border-border bg-card space-y-3">
                  <span className="text-xs font-mono font-bold text-foreground uppercase block">Author Attribution</span>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={formAuthorName}
                      onChange={(e) => setFormAuthorName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={formAuthorRole}
                      onChange={(e) => setFormAuthorRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-border bg-background text-xs text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ── TAB 3: SUBMISSIONS INTAKE ── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(["ALL", "PENDING", "PUBLISHED", "CHANGES_REQUESTED", "REJECTED"] as SubmissionFilter[]).map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setSubmissionFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                        submissionFilter === filter
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {filter === "ALL" && `All (${submissions.length})`}
                      {filter === "PENDING" && `Pending (${pendingSubmissions.length})`}
                      {filter === "PUBLISHED" && `Published (${submissions.filter(s=>s.status==='PUBLISHED').length})`}
                      {filter === "CHANGES_REQUESTED" && `Revisions (${submissions.filter(s=>s.status==='CHANGES_REQUESTED').length})`}
                      {filter === "REJECTED" && `Declined (${submissions.filter(s=>s.status==='REJECTED').length})`}
                    </button>
                  )
                )}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {filteredSubmissions.length} records
              </span>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-border bg-card space-y-2">
                <Inbox size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                <h4 className="text-base font-bold text-foreground">No submissions in this filter</h4>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div key={sub._id} className="p-6 rounded-3xl border border-border bg-card space-y-4 hover:border-primary/40 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold border uppercase text-[10px] ${
                            sub.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            sub.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            sub.status === 'CHANGES_REQUESTED' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                          }`}>
                            {sub.status}
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">{sub.category}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">{sub.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{sub.excerpt}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setShowFeedbackBox(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors cursor-pointer shrink-0"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: PUBLISHED ARTICLES DIRECT ACTIONS ── */}
        {activeTab === "editorial" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Live Published Articles ({publishedBlogs.length})</h3>
                <p className="text-xs text-muted-foreground">
                  Click Edit to update any live article directly or Write Article to compose a new one.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetBlogForm();
                  switchTab("write");
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
              >
                <Plus size={14} />
                <span>Compose New Post</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3">
              <input
                type="text"
                value={editorialSearch}
                onChange={(e) => setEditorialSearch(e.target.value)}
                placeholder="Search published articles or authors..."
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 space-y-3">
              {filteredPublishedBlogs.map((art) => (
                <div
                  key={art._id}
                  className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-emerald-500 uppercase text-[10px]">● Live</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-muted-foreground">{art.category}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-muted-foreground">{art.readTime || "4 min"}</span>
                    </div>
                    <h4 className="text-base font-bold text-foreground">{art.title}</h4>
                    <p className="text-xs text-muted-foreground">By {art.authorName}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditBlog(art)}
                      className="px-3.5 py-1.5 rounded-xl border border-primary/40 bg-primary/10 hover:bg-primary/20 text-xs font-semibold text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>

                    <Link
                      to={getLocalizedPath(`/blog/${art.slug?.current || art._id}`)}
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>View</span>
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteBlog(art._id, art.title)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: COMMENT MODERATION ── */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 overflow-x-auto">
                {(["ALL", "pending", "approved", "declined"] as CommentFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setCommentFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                      commentFilter === filter
                        ? "bg-primary text-primary-foreground shadow-2xs"
                        : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {filter === "ALL" && `All (${commentsList.length})`}
                    {filter === "pending" && `Pending (${commentsList.filter(c=>c.status==='pending').length})`}
                    {filter === "approved" && `Approved (${commentsList.filter(c=>c.status==='approved').length})`}
                    {filter === "declined" && `Declined (${commentsList.filter(c=>c.status==='declined').length})`}
                  </button>
                ))}
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                {filteredComments.length} comments
              </span>
            </div>

            {filteredComments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-border bg-card space-y-2">
                <MessageSquare size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                <h4 className="text-base font-bold text-foreground">No comments in this filter</h4>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comm) => (
                  <div key={comm._id} className="p-6 rounded-3xl border border-border bg-card space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold border uppercase text-[10px] ${
                            comm.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            comm.status === 'pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            'bg-destructive/10 text-destructive border-destructive/20'
                          }`}>
                            {comm.status}
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-foreground font-bold">{comm.authorName}</span>
                          <span className="text-muted-foreground">({comm.authorEmail})</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground pt-1">
                          Article Post ID: <strong className="text-foreground">{comm.postId}</strong>
                        </div>
                        <p className="text-sm text-foreground pt-2 font-medium leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/60">
                          "{comm.commentText}"
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {comm.status !== "approved" && (
                          <button
                            type="button"
                            disabled={commentActionLoading}
                            onClick={() => handleCommentAction("approve", comm._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                          >
                            <Check size={13} />
                            <span>Approve</span>
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={commentActionLoading}
                          onClick={() => {
                            setEditingComment(comm);
                            setEditCommentText(comm.commentText);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          disabled={commentActionLoading}
                          onClick={() => {
                            if (window.confirm("Permanently delete this comment?")) {
                              handleCommentAction("delete", comm._id);
                            }
                          }}
                          className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Delete comment"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: SITE MANAGEMENT ── */}
        {activeTab === "site" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <span className="text-xs font-mono font-bold text-primary uppercase">SEO & SITEMAP</span>
                <h4 className="text-base font-bold text-foreground">Sitemap.xml (699 URLs)</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Automatic authoritative sitemap indexes all EN and AZ bilingual pages, blog posts, and resources with hreflang tags.
                </p>
                <div className="pt-2">
                  <a href="/sitemap.xml" target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                    <span>View Sitemap.xml</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <span className="text-xs font-mono font-bold text-primary uppercase">STATIC PRE-RENDERING</span>
                <h4 className="text-base font-bold text-foreground">4,207 Pre-Rendered Routes</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All routes, articles, fonts, topics, and author pages are pre-rendered into static HTML for maximum Googlebot crawlability.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Platform Analytics</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  Rvan.me is integrated with Vercel Analytics, Speed Insights, and Microsoft Clarity tracking. View real telemetry in the official dashboards.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://vercel.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors"
                >
                  <BarChart3 size={14} />
                  <span>Vercel Analytics Dashboard</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── EDIT COMMENT MODAL ── */}
      {editingComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-background border border-border rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Edit Comment Text</h3>
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
            <textarea
              rows={4}
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground focus:outline-none focus:border-primary"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingComment(null)}
                className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={commentActionLoading}
                onClick={() => handleCommentAction("edit", editingComment._id, editCommentText)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase hover:bg-primary/90 disabled:opacity-50"
              >
                {commentActionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBMISSION FULL REVIEW MODAL ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-background border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold uppercase">
                  Editorial Submission Review
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">{selectedSubmission.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Author Profile Block */}
            <div className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-foreground text-sm">{selectedSubmission.authorName}</div>
                <div className="text-muted-foreground">Email: {selectedSubmission.authorEmail}</div>
                {selectedSubmission.authorBio && <p className="italic text-muted-foreground pt-1">"{selectedSubmission.authorBio}"</p>}
              </div>
            </div>

            {/* Content preview */}
            <div className="p-4 rounded-2xl bg-muted/10 border border-border font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
              {selectedSubmission.content}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border">
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleSubmissionAction("approve_and_publish")}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                Approve & Publish Live
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleSubmissionAction("reject")}
                className="px-4 py-2.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-bold uppercase cursor-pointer disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
