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

type AdminTab = "overview" | "submissions" | "editorial" | "site" | "analytics";
type SubmissionFilter = "ALL" | "PENDING" | "PUBLISHED" | "CHANGES_REQUESTED" | "REJECTED";

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

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
    if (path.includes("/submissions") || path.includes("/inbox")) return "submissions";
    if (path.includes("/editorial") || path.includes("/articles")) return "editorial";
    if (path.includes("/site")) return "site";
    if (path.includes("/analytics")) return "analytics";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Real Data States
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);
  const [submissions, setSubmissions] = useState<RealArticleSubmission[]>([]);
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
  const [editorialSearch, setEditorialSearch] = useState("");

  // Update tab state when route changes
  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab);
    const basePath = tab === "overview" ? "/admin" : `/admin/${tab}`;
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
      const res = await fetch("/api/admin-submissions");
      if (res.ok) {
        const json = await res.json();
        setSubmissions(json.submissions || []);
      } else {
        console.warn("[AdminConsole] Could not load submissions from API:", res.statusText);
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

  // Real Computed Statistics
  const pendingSubmissions = submissions.filter((s) => s.status === "PENDING");
  const publishedSubmissions = submissions.filter((s) => s.status === "PUBLISHED");
  const changesRequestedSubmissions = submissions.filter((s) => s.status === "CHANGES_REQUESTED");
  const rejectedSubmissions = submissions.filter((s) => s.status === "REJECTED");

  const categoriesList = Array.from(
    new Set(publishedBlogs.map((b) => b.category).filter(Boolean))
  );
  const authorsList = Array.from(
    new Set(publishedBlogs.map((b) => b.authorName).filter(Boolean))
  );

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === "ALL") return true;
    return s.status === submissionFilter;
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

  // ── HANDLE ADMIN EDITORIAL ACTIONS ──
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

      // Update selected submission locally
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

      // Re-fetch published articles if an article was published
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
                  UID: {user?.uid.slice(0, 10)}...
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isAz ? "Rvan.me Redaksiya Paneli" : "Rvan.me Editorial Console"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
              >
                <RefreshCw size={14} className={loadingData ? "animate-spin text-primary" : ""} />
                <span>{loadingData ? (isAz ? "Yenilənir..." : "Refreshing...") : (isAz ? "Məlumatları Yenilə" : "Refresh Data")}</span>
              </button>
              <Link
                to={getLocalizedPath("/write")}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
              >
                <span>{isAz ? "Məqalə Təqdimat Portalı" : "Public Submission Portal"}</span>
                <ExternalLink size={13} />
              </Link>
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
              onClick={() => switchTab("submissions")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "submissions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail size={14} />
              <span>
                {isAz ? "Məqalə Təqdimatları" : "Submissions Intake"}
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
            {/* Real Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "GÖZLƏYƏN TƏQDİMATLAR" : "PENDING SUBMISSIONS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{pendingSubmissions.length}</div>
                <p className="text-[11px] text-muted-foreground">
                  {pendingSubmissions.length > 0
                    ? isAz
                      ? "Baxış tələb edən yeni məqalələr"
                      : "Awaiting editorial review"
                    : isAz
                    ? "Bütün təqdimatlar cavablandırılıb"
                    : "Inbox zero — all reviewed"}
                </p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "DƏRC EDİLMİŞ MƏQALƏLƏR" : "PUBLISHED ARTICLES"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{publishedBlogs.length}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Sanity CMS üzərindən canlı" : "Live in Sanity CMS"}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "MÜƏLLİF HEYƏTİ" : "ACTIVE AUTHORS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{authorsList.length || 1}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Dərc olunmuş müəlliflər" : "Published editorial authors"}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "SAYT XƏRİTƏSİ" : "SITEMAP URLS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">699</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "4,207 statik pre-rendered səhifə" : "4,207 pre-rendered HTML routes"}</p>
              </div>
            </div>

            {/* Pending Submissions Alert / Review Feed */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? "Baxış Tələb Edən Təqdimatlar" : "Incoming Article Submissions Requiring Attention"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isAz
                      ? "Ziyarətçilər tərəfindən /write səhifəsi vasitəsilə göndərilən və baxılmamış məqalələr."
                      : "Articles submitted by creators via /write that are pending editorial approval."}
                  </p>
                </div>
                <button
                  onClick={() => switchTab("submissions")}
                  className="text-xs font-bold text-primary mono uppercase hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isAz ? "Hamısına Bax" : "View All"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {pendingSubmissions.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-border/80 rounded-2xl text-xs text-muted-foreground space-y-1">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                  <p className="font-bold text-foreground">{isAz ? "Gözləyən məqalə yoxdur" : "No pending submissions"}</p>
                  <p>{isAz ? "Bütün daxil olan təqdimatlar nəzərdən keçirilib." : "All incoming editorial submissions have been reviewed."}</p>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {pendingSubmissions.slice(0, 5).map((sub) => (
                    <div
                      key={sub._id}
                      className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 uppercase text-[10px]">
                            Pending Review
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">{sub.category}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">
                            {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-foreground line-clamp-1">{sub.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {isAz ? "Müəllif" : "Author"}: <strong className="text-foreground">{sub.authorName}</strong> ({sub.authorEmail})
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setShowFeedbackBox(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors shrink-0 cursor-pointer"
                      >
                        {isAz ? "Məqaləni Oxu & Qərar Ver" : "Review & Decide"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recently Published Content Feed */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? "Son Dərc Olunmuş Məqalələr" : "Recently Published Live Articles"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isAz ? "Sanity CMS üzərindən saytda aktiv olan məqalələr." : "Live articles published on Rvan.me."}
                  </p>
                </div>
                <button
                  onClick={() => switchTab("editorial")}
                  className="text-xs font-bold text-primary mono uppercase hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{isAz ? "Bütün Məqalələr" : "All Articles"}</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                {publishedBlogs.slice(0, 6).map((blog) => (
                  <div
                    key={blog._id}
                    className="p-4 rounded-2xl border border-border bg-muted/10 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-primary uppercase">{blog.category}</span>
                      <h4 className="text-sm font-bold text-foreground line-clamp-2">{blog.title}</h4>
                      <p className="text-[11px] text-muted-foreground">By {blog.authorName}</p>
                    </div>
                    <Link
                      to={getLocalizedPath(`/blog/${blog.slug?.current || blog._id}`)}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline pt-2"
                    >
                      <span>{isAz ? "Saytda Bax" : "View on Live Site"}</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: SUBMISSIONS INTAKE ── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            {/* Filter Bar */}
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
                      {filter === "PUBLISHED" && `Published (${publishedSubmissions.length})`}
                      {filter === "CHANGES_REQUESTED" && `Revisions (${changesRequestedSubmissions.length})`}
                      {filter === "REJECTED" && `Declined (${rejectedSubmissions.length})`}
                    </button>
                  )
                )}
              </div>

              <span className="text-xs font-mono text-muted-foreground">
                {filteredSubmissions.length} {isAz ? "təqdimat" : "records"}
              </span>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-border bg-card space-y-2">
                <Inbox size={32} className="mx-auto text-muted-foreground/40 mb-2" />
                <h4 className="text-base font-bold text-foreground">
                  {isAz ? "Bu kateqoriyada təqdimat tapılmadı" : "No submissions in this filter"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "İstifadəçilər /write səhifəsindən məqalə təqdim etdikdə burada görünəcək."
                    : "Submissions received via /write will appear here in real-time."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    className="p-6 rounded-3xl border border-border bg-card space-y-4 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          {sub.status === "PENDING" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 uppercase text-[10px]">
                              ● Pending Review
                            </span>
                          )}
                          {sub.status === "PUBLISHED" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 uppercase text-[10px]">
                              ✓ Published Live
                            </span>
                          )}
                          {sub.status === "CHANGES_REQUESTED" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 uppercase text-[10px]">
                              Revisions Requested
                            </span>
                          )}
                          {sub.status === "REJECTED" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive font-bold border border-destructive/20 uppercase text-[10px]">
                              Declined
                            </span>
                          )}
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">{sub.category}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground uppercase">{sub.language}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">
                            {new Date(sub.submittedAt).toLocaleDateString()} {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-foreground">{sub.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{sub.excerpt}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setShowFeedbackBox(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors cursor-pointer"
                        >
                          {isAz ? "Ətraflı Bax" : "Review Article"}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {sub.profilePhotoUrl ? (
                          <img
                            src={sub.profilePhotoUrl}
                            alt={sub.authorName}
                            className="h-6 w-6 rounded-full object-cover border border-border"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                            {sub.authorName[0]}
                          </div>
                        )}
                        <span className="font-semibold text-foreground">{sub.authorName}</span>
                        <span>({sub.authorEmail})</span>
                      </div>

                      {sub.publishedBlogId && (
                        <Link
                          to={getLocalizedPath(`/blog/${sub.slug}`)}
                          target="_blank"
                          className="text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          <span>View Live Article</span>
                          <ExternalLink size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: PUBLISHED ARTICLES ── */}
        {activeTab === "editorial" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Sanity CMS Redaksiya Arxivi" : "Sanity CMS Editorial Library"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "Bütün dərc olunmuş məqalələr birbaşa Sanity CMS Studio vasitəsilə idarə olunur."
                    : "All live articles are stored in Sanity CMS production dataset."}
                </p>
              </div>

              <a
                href="https://www.sanity.io/manage"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase shadow-2xs hover:bg-primary/90 transition-colors shrink-0"
              >
                <BookOpen size={14} />
                <span>{isAz ? "Sanity Studio-nu Aç" : "Open Sanity Studio"}</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Search Input */}
            <div className="p-4 rounded-2xl border border-border bg-card flex items-center gap-3">
              <input
                type="text"
                value={editorialSearch}
                onChange={(e) => setEditorialSearch(e.target.value)}
                placeholder={isAz ? "Məqalə və ya müəllif axtar..." : "Search published articles or authors..."}
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {editorialSearch && (
                <button
                  type="button"
                  onClick={() => setEditorialSearch("")}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Published Articles List */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-mono text-foreground uppercase">
                  {isAz ? "DƏRC EDİLMİŞ MƏQALƏLƏR" : "LIVE ARTICLES"} ({filteredPublishedBlogs.length})
                </h4>
              </div>

              {filteredPublishedBlogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  {isAz ? "Məqalə tapılmadı." : "No matching articles found."}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {filteredPublishedBlogs.map((art) => (
                    <div
                      key={art._id}
                      className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-emerald-500 uppercase text-[10px]">● Live</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">{art.category}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">{art.readTime || "4 min read"}</span>
                        </div>
                        <h4 className="text-base font-bold text-foreground">{art.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {isAz ? "Müəllif" : "Author"}: <strong className="text-foreground">{art.authorName}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={getLocalizedPath(`/blog/${art.slug?.current || art._id}`)}
                          target="_blank"
                          className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5 shadow-2xs"
                        >
                          <span>{isAz ? "Saytda Oxu" : "View Live Post"}</span>
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: SITE MANAGEMENT ── */}
        {activeTab === "site" && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "SEO & XƏRİTƏ" : "SEO & SITEMAP"}</span>
                <h4 className="text-base font-bold text-foreground">Sitemap.xml (699 URLs)</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Avtomatik yaradılan sitemap.xml bütün ingilis və azərbaycan dillərindəki səhifələri, bloq yazılarını və resursları indeksləyir."
                    : "Authoritative sitemap.xml automatically indexes all EN and AZ bilingual pages, blog posts, and resources with hreflang tags."}
                </p>
                <div className="pt-2">
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{isAz ? "Sitemap.xml Faylına Bax" : "View Sitemap.xml"}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "STATİK GENERASİYA" : "STATIC PRE-RENDERING"}</span>
                <h4 className="text-base font-bold text-foreground">4,207 Pre-Rendered Routes</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Bütün dinamik bloq, resurs, alət və mövzu səhifələri axtarış sistemləri üçün statik HTML olaraq generasiya edilir."
                    : "All routes, articles, fonts, topics, and author pages are pre-rendered into static HTML for maximum crawlability."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 5: ANALYTICS ── */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Platforma Analitikası" : "Platform Analytics"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {isAz
                    ? "Rvan.me Vercel Analytics və Microsoft Clarity ilə inteqrasiya olunub. Real ziyarətçi statistikasını Vercel və Clarity panellərindən izləyə bilərsiniz."
                    : "Rvan.me is configured with Vercel Analytics, Speed Insights, and Microsoft Clarity tracking. View real telemetry in the official dashboards."}
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
                  <span>{isAz ? "Vercel Analitika Paneli" : "Vercel Analytics Dashboard"}</span>
                  <ExternalLink size={13} />
                </a>

                <a
                  href="https://clarity.microsoft.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-foreground text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <span>Microsoft Clarity</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── SUBMISSION FULL REVIEW MODAL ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-background border border-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-bold uppercase">
                    Editorial Submission Review
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ID: {selectedSubmission._id}
                  </span>
                </div>
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

            {/* Action Feedback Messages */}
            {actionSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{actionError}</span>
              </div>
            )}

            {/* Author Profile Block */}
            <div className="p-5 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row items-start gap-4">
              {selectedSubmission.profilePhotoUrl ? (
                <img
                  src={selectedSubmission.profilePhotoUrl}
                  alt={selectedSubmission.authorName}
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/40 shrink-0"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xl shrink-0">
                  {selectedSubmission.authorName[0]}
                </div>
              )}
              <div className="space-y-1 text-xs">
                <div className="font-bold text-foreground text-sm">{selectedSubmission.authorName}</div>
                <div className="text-muted-foreground">
                  Email: <a href={`mailto:${selectedSubmission.authorEmail}`} className="text-primary hover:underline">{selectedSubmission.authorEmail}</a>
                </div>
                {selectedSubmission.authorBio && (
                  <p className="text-muted-foreground pt-1 italic">"{selectedSubmission.authorBio}"</p>
                )}
                {selectedSubmission.authorWebsite && (
                  <div className="pt-1">
                    <a href={selectedSubmission.authorWebsite} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline flex items-center gap-1">
                      <span>{selectedSubmission.authorWebsite}</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Article Details & Excerpt */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl border border-border bg-muted/10 font-mono">
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Category</span>
                  <span className="font-bold text-foreground">{selectedSubmission.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Topic</span>
                  <span className="font-bold text-foreground">{selectedSubmission.topic || "General"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Language</span>
                  <span className="font-bold text-foreground uppercase">{selectedSubmission.language}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block">Status</span>
                  <span className="font-bold text-primary uppercase">{selectedSubmission.status}</span>
                </div>
              </div>

              {selectedSubmission.coverImageUrl && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Cover Image Preview</span>
                  <div className="rounded-2xl overflow-hidden border border-border aspect-[16/9] max-h-60 bg-neutral-900">
                    <img
                      src={selectedSubmission.coverImageUrl}
                      alt={selectedSubmission.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Excerpt / Summary</span>
                <div className="p-4 rounded-2xl bg-muted/20 border border-border text-foreground leading-relaxed italic">
                  "{selectedSubmission.excerpt}"
                </div>
              </div>

              {selectedSubmission.editorialNote && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Author's Note</span>
                  <div className="p-3 rounded-xl bg-muted/10 border border-border text-muted-foreground leading-relaxed">
                    {selectedSubmission.editorialNote}
                  </div>
                </div>
              )}

              {selectedSubmission.editorialReviewNote && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase">Previous Review Note</span>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-foreground leading-relaxed">
                    {selectedSubmission.editorialReviewNote}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase">Article Content (Markdown Body)</span>
                <div className="p-4 rounded-2xl bg-muted/10 border border-border font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {selectedSubmission.content}
                </div>
              </div>
            </div>

            {/* Editorial Decision Actions */}
            <div className="space-y-4 pt-4 border-t border-border">
              {showFeedbackBox && (
                <div className="p-4 rounded-2xl border border-primary/30 bg-muted/20 space-y-3">
                  <span className="text-xs font-bold text-foreground">
                    {showFeedbackBox === "approve"
                      ? "Editorial approval note (optional):"
                      : showFeedbackBox === "changes"
                      ? "Describe the revisions required from the author (will be emailed to author):"
                      : "Reason for declining submission (will be emailed to author):"}
                  </span>
                  <textarea
                    value={reviewNoteInput}
                    onChange={(e) => setReviewNoteInput(e.target.value)}
                    rows={3}
                    placeholder="Enter editorial message..."
                    className="w-full p-3 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() =>
                        handleSubmissionAction(
                          showFeedbackBox === "approve"
                            ? "approve_and_publish"
                            : showFeedbackBox === "changes"
                            ? "request_changes"
                            : "reject"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {actionLoading ? "Processing..." : "Confirm & Send Email"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowFeedbackBox(null)}
                      className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {!showFeedbackBox && (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setShowFeedbackBox("approve");
                        setReviewNoteInput("Approved for publication on Rvan.me.");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Check size={14} />
                      <span>Approve & Publish to Sanity</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setShowFeedbackBox("changes");
                        setReviewNoteInput("");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wider uppercase shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <MessageSquare size={14} />
                      <span>Request Revisions</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        setShowFeedbackBox("reject");
                        setReviewNoteInput("");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <X size={14} />
                      <span>Decline Submission</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to permanently delete this submission record?")) {
                        handleSubmissionAction("delete");
                      }
                    }}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
