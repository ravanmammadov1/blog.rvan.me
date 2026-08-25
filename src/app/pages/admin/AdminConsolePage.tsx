import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  RefreshCw,
  Eye,
  Check,
  ChevronRight,
  Filter,
  Lock,
  MessageSquare,
  AlertCircle,
  Sparkles,
  BookOpen,
  Copy,
  ArrowRight,
  Inbox,
  User,
  Mail,
  Globe,
  Tag,
  Image as ImageIcon,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCheck,
} from "lucide-react";
import SEO from "../../components/SEO";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import {
  getAllArticleSubmissions,
  adminRequestChangesOnSubmission,
  adminRejectSubmission,
  adminApproveAndPublishSubmission,
  getAllSubmittedArticles,
  ArticleSubmissionRecord,
  ContributorArticleDraft,
} from "../../../services/contributorService";
import { ArticleSubmissionStatus } from "../../../types/contributor";
import { SiteSettings } from "../../../types/cms";
import { fetchSiteSettings } from "../../../lib/sanityQueries";

type AdminTab = "overview" | "submissions" | "articles";

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
    if (path.includes("/submissions")) return "submissions";
    if (path.includes("/articles")) return "articles";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Data States
  const [submissions, setSubmissions] = useState<ArticleSubmissionRecord[]>([]);
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Submissions Tab Filter & Review Modal State
  const [submissionFilter, setSubmissionFilter] = useState<"ALL" | ArticleSubmissionStatus>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<ArticleSubmissionRecord | null>(null);
  const [subReviewActionType, setSubReviewActionType] = useState<"publish" | "changes" | "reject" | null>(null);
  const [subEditorialNoteInput, setSubEditorialNoteInput] = useState("");
  const [processingSubId, setProcessingSubId] = useState<string | null>(null);
  const [copiedSubHash, setCopiedSubHash] = useState(false);

  // Action Success Banner
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

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
    setLoadError(null);
    try {
      const [subs, arts] = await Promise.all([
        getAllArticleSubmissions(),
        getAllSubmittedArticles(),
      ]);
      setSubmissions(subs);
      setArticles(arts);
    } catch (err: any) {
      console.error("[AdminConsole] Error loading data:", err);
      setLoadError(err?.message || "Failed to load submission data.");
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

  // Derived Metrics
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const inReviewCount = submissions.filter((s) => s.status === "IN_REVIEW").length;
  const changesRequestedCount = submissions.filter((s) => s.status === "CHANGES_REQUESTED").length;
  const publishedCount = submissions.filter((s) => s.status === "PUBLISHED").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJECTED").length;
  const totalCount = submissions.length;

  // Filtered Submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (submissionFilter === "ALL") return true;
    return sub.status === submissionFilter;
  });

  // Action Handlers
  const handleApproveAndPublish = async (submission: ArticleSubmissionRecord) => {
    setProcessingSubId(submission.id);
    try {
      const adminName = user?.displayName || user?.email || "Admin";
      const success = await adminApproveAndPublishSubmission(submission.id, adminName);
      if (success) {
        setActionSuccessMsg(
          isAz
            ? `"${submission.title}" məqaləsi uğurla təsdiqləndi və Rvan.me-də dərc olundu.`
            : `Article "${submission.title}" successfully approved and published on Rvan.me.`
        );
        setSelectedSubmission(null);
        setSubReviewActionType(null);
        await loadAllData();
      }
    } catch (err) {
      console.error("Publishing error:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleRequestChanges = async (submissionId: string) => {
    if (!subEditorialNoteInput.trim()) return;
    setProcessingSubId(submissionId);
    try {
      const adminName = user?.displayName || user?.email || "Admin";
      const success = await adminRequestChangesOnSubmission(
        submissionId,
        subEditorialNoteInput.trim(),
        adminName
      );
      if (success) {
        setActionSuccessMsg(
          isAz
            ? "Müəllifə düzəliş qeydi göndərildi və status dəyişdirildi."
            : "Editorial revision feedback saved for author."
        );
        setSelectedSubmission(null);
        setSubReviewActionType(null);
        setSubEditorialNoteInput("");
        await loadAllData();
      }
    } catch (err) {
      console.error("Request changes error:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleRejectSubmission = async (submissionId: string) => {
    setProcessingSubId(submissionId);
    try {
      const adminName = user?.displayName || user?.email || "Admin";
      const success = await adminRejectSubmission(
        submissionId,
        subEditorialNoteInput.trim() || "Does not meet current editorial criteria",
        adminName
      );
      if (success) {
        setActionSuccessMsg(
          isAz
            ? "Təqdimat imtina edildi."
            : "Submission status updated to Rejected."
        );
        setSelectedSubmission(null);
        setSubReviewActionType(null);
        setSubEditorialNoteInput("");
        await loadAllData();
      }
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  const getStatusBadge = (status: ArticleSubmissionStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock size={12} />
            <span>{isAz ? "Gözləmədə" : "Pending Review"}</span>
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Eye size={12} />
            <span>{isAz ? "Baxışdadır" : "In Review"}</span>
          </span>
        );
      case "CHANGES_REQUESTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <RotateCcw size={12} />
            <span>{isAz ? "Düzəliş Tələbi" : "Changes Requested"}</span>
          </span>
        );
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCheck size={12} />
            <span>{isAz ? "Dərc Olunub" : "Published"}</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-destructive/10 text-destructive border border-destructive/20">
            <X size={12} />
            <span>{isAz ? "İmtina Edilib" : "Rejected"}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-muted text-muted-foreground border border-border">
            <span>{status}</span>
          </span>
        );
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
        title={isAz ? "Redaksiya İdarəetmə Paneli — Rvan.me Admin" : "Editorial Console — Rvan.me Admin"}
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
                  <span>{isAz ? "REDAKSİYA İDARƏETMƏSİ" : "EDITORIAL CONSOLE"}</span>
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  UID: {user?.uid.slice(0, 10)}...
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isAz ? "Məqalə Təqdimatları və Nəşr Mərkəzi" : "Article Submissions & Editorial Hub"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={loadingData ? "animate-spin text-primary" : ""} />
                <span>{loadingData ? (isAz ? "Yenilənir..." : "Refreshing...") : (isAz ? "Yenilə" : "Refresh")}</span>
              </button>
              <Link
                to={getLocalizedPath("/write")}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
              >
                <span>{isAz ? "Təqdimat Səhifəsi" : "Public Submission Page"}</span>
                <ExternalLink size={13} />
              </Link>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-border/80 pt-2 overflow-x-auto">
            <button
              onClick={() => switchTab("overview")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Inbox size={14} />
              <span>{t("adminOverview", "Overview")}</span>
            </button>

            <button
              onClick={() => switchTab("submissions")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                activeTab === "submissions"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText size={14} />
              <span>{t("adminSubmissions", "Submissions")}</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-black">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => switchTab("articles")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>{isAz ? "Nəşr Arxivi" : "Published Articles"} ({articles.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <section className="px-4 py-8 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-8">
        {/* Success Banner */}
        {actionSuccessMsg && (
          <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionSuccessMsg(null)}
              className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {loadError && (
          <div className="p-4 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium flex items-center gap-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{loadError}</span>
          </div>
        )}

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Metric Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-semibold">
                  <span>{isAz ? "Baxış Gözləyən" : "Pending Review"}</span>
                  <Clock size={16} className="text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-foreground font-mono">{pendingCount}</div>
                <div className="text-[11px] text-muted-foreground">
                  {isAz ? "Redaksiya qərarı gözləyən yeni məqalələr" : "Submissions awaiting editorial decision"}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/[0.04] space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-semibold">
                  <span>{isAz ? "Düzəliş Tələb Olunan" : "Changes Requested"}</span>
                  <RotateCcw size={16} className="text-orange-500" />
                </div>
                <div className="text-3xl font-bold text-foreground font-mono">{changesRequestedCount}</div>
                <div className="text-[11px] text-muted-foreground">
                  {isAz ? "Müəllifə qeyd göndərilmiş təqdimatlar" : "Articles with feedback sent to author"}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-semibold">
                  <span>{isAz ? "Dərc Edilmiş" : "Published Live"}</span>
                  <CheckCheck size={16} className="text-emerald-500" />
                </div>
                <div className="text-3xl font-bold text-foreground font-mono">{publishedCount}</div>
                <div className="text-[11px] text-muted-foreground">
                  {isAz ? "Bloqda canlı yayımlanan müəllif yazıları" : "Live articles on public blog"}
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono font-semibold">
                  <span>{isAz ? "Cəmi Təqdimatlar" : "Total Submissions"}</span>
                  <FileText size={16} className="text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground font-mono">{totalCount}</div>
                <div className="text-[11px] text-muted-foreground">
                  {isAz ? "Portal vasitəsilə daxil olmuş bütün yazılar" : "All article submissions received"}
                </div>
              </div>
            </div>

            {/* Pending Submissions Immediate Action Queue */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Clock size={18} className="text-amber-500" />
                    <span>{isAz ? "Redaksiya Baxışı Növbəsi" : "Editorial Review Queue"}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isAz
                      ? "Baxış və qərar gözləyən ən son məqalələr."
                      : "Articles awaiting your editorial review and publication decision."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => switchTab("submissions")}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>{isAz ? "BÜTÜNÜNƏ BAX" : "VIEW ALL"}</span>
                  <ChevronRight size={14} />
                </button>
              </div>

              {submissions.filter((s) => s.status === "PENDING" || s.status === "IN_REVIEW").length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-xs font-mono space-y-2">
                  <CheckCircle2 size={24} className="mx-auto text-emerald-500" />
                  <p>{isAz ? "Hal-hazırda gözləmədə olan heç bir məqalə yoxdur." : "No pending submissions in queue. You are all caught up!"}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions
                    .filter((s) => s.status === "PENDING" || s.status === "IN_REVIEW")
                    .slice(0, 5)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                            <span className="font-bold text-foreground">{sub.id}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-primary uppercase">
                              {sub.category || "Design"}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-bold text-muted-foreground uppercase">
                              {sub.language.toUpperCase()}
                            </span>
                            {getStatusBadge(sub.status)}
                          </div>
                          <h4 className="text-base font-bold text-foreground truncate">{sub.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {isAz ? "Müəllif" : "By"}: <strong className="text-foreground">{sub.authorName}</strong> ({sub.authorEmail})
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(sub)}
                            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs flex items-center gap-1.5"
                          >
                            <Eye size={13} />
                            <span>{isAz ? "Nəzərdən Keçir" : "Review & Decide"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: SUBMISSIONS (MAIN CORE SECTION) ── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 mr-2">
                  <Filter size={13} />
                  <span>{isAz ? "Filtr" : "Filter"}:</span>
                </span>
                {(["ALL", "PENDING", "IN_REVIEW", "CHANGES_REQUESTED", "APPROVED", "PUBLISHED", "REJECTED"] as const).map(
                  (f) => {
                    const count =
                      f === "ALL"
                        ? submissions.length
                        : submissions.filter((s) => s.status === f).length;
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setSubmissionFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          submissionFilter === f
                            ? "bg-primary text-primary-foreground shadow-2xs"
                            : "bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{f === "ALL" ? (isAz ? "Hamısı" : "All") : f.replace("_", " ")}</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-black/10 dark:bg-white/10">
                          {count}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                {isAz ? `Tapıldı: ${filteredSubmissions.length}` : `Showing ${filteredSubmissions.length} submissions`}
              </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center rounded-3xl border border-border bg-card space-y-3">
                <Inbox size={32} className="mx-auto text-muted-foreground" />
                <h4 className="text-base font-bold text-foreground">
                  {t("adminNoSubmissions", "No article submissions found matching the selected filter.")}
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {isAz
                    ? "Write for Rvan.me portalından yeni bir məqalə təqdim edildikdə burada görünəcəkdir."
                    : "When visitors submit articles through the public /write page, they will instantly appear here."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-6 rounded-3xl border border-border bg-card hover:border-primary/40 transition-all space-y-4 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-primary">{sub.id}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="px-2.5 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase text-foreground">
                            {sub.category}
                          </span>
                          {sub.topic && (
                            <span className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] text-muted-foreground">
                              {sub.topic}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-bold text-muted-foreground uppercase">
                            {sub.language.toUpperCase()}
                          </span>
                          {getStatusBadge(sub.status)}
                        </div>

                        <h3 className="text-xl font-bold text-foreground tracking-tight">{sub.title}</h3>

                        {sub.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed max-w-3xl">
                            {sub.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedSubmission(sub)}
                          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-2xs flex items-center gap-1.5"
                        >
                          <Eye size={14} />
                          <span>{isAz ? "Nəzərdən Keçir" : "Review & Decide"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Author Bar & Metadata */}
                    <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5 text-foreground font-medium">
                          <User size={13} className="text-primary" />
                          <span>{sub.authorName}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} />
                          <span>{sub.authorEmail}</span>
                        </span>
                        {sub.authorWebsite && (
                          <a
                            href={sub.authorWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Globe size={13} />
                            <span>{sub.authorWebsite.replace(/^https?:\/\//, "")}</span>
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span>
                          {new Date(sub.submittedAt).toLocaleDateString(isAz ? "az-AZ" : "en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: PUBLISHED ARTICLES ── */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Dərc Edilmiş Müəllif Məqalələri" : "Live Published Articles"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "Admin tərəfindən təsdiqlənərək Rvan.me bloqunda yayımlanan məqalələr."
                    : "Articles approved by editorial review and currently published in the Rvan.me public blog repository."}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="font-bold text-emerald-500 uppercase">{art.status}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground">{art.category}</span>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="text-muted-foreground uppercase">{art.language || "en"}</span>
                      </div>
                      <h4 className="text-base font-bold text-foreground">{art.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {isAz ? "Müəllif" : "Author"}: <strong className="text-foreground">{art.authorName}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={getLocalizedPath(`/blog/${art.slug}`)}
                        target="_blank"
                        className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5"
                      >
                        <span>{isAz ? "Bloqda Oxu" : "View Live Post"}</span>
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── EDITORIAL REVIEW & DECISION MODAL ── */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-2xl space-y-8 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="font-bold text-primary">{selectedSubmission.id}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase text-foreground">
                    {selectedSubmission.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-bold uppercase text-muted-foreground">
                    {selectedSubmission.language.toUpperCase()}
                  </span>
                  {getStatusBadge(selectedSubmission.status)}
                </div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  {selectedSubmission.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setSubReviewActionType(null);
                }}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Author Breakdown Box */}
            <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3 text-xs">
              <span className="font-mono font-bold text-primary uppercase tracking-wider block">
                {isAz ? "Müəllif Məlumatları" : "Author Identity"}
              </span>
              <div className="grid gap-3 sm:grid-cols-2 font-mono">
                <div>
                  <span className="text-muted-foreground block">{isAz ? "Ad və Soyad" : "Full Name"}:</span>
                  <span className="font-bold text-foreground text-sm">{selectedSubmission.authorName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">{isAz ? "E-poçt" : "Email"}:</span>
                  <span className="font-semibold text-foreground">{selectedSubmission.authorEmail}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block">{isAz ? "Bioqrafiya" : "Bio"}:</span>
                  <span className="text-foreground font-sans text-xs">{selectedSubmission.authorBio}</span>
                </div>
                {selectedSubmission.authorWebsite && (
                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block">{isAz ? "Veb-sayt / Portfolio" : "Website / Portfolio"}:</span>
                    <a
                      href={selectedSubmission.authorWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>{selectedSubmission.authorWebsite}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Article Body Display */}
            <div className="space-y-4">
              {selectedSubmission.coverImageUrl && (
                <div className="h-64 w-full rounded-2xl overflow-hidden bg-black/10 border border-border">
                  <img
                    src={selectedSubmission.coverImageUrl}
                    alt={selectedSubmission.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {selectedSubmission.excerpt && (
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/[0.02] text-xs leading-relaxed italic text-muted-foreground">
                  <strong>{isAz ? "Xülasə" : "Excerpt"}:</strong> {selectedSubmission.excerpt}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider block">
                  {isAz ? "Məqalə Mətni" : "Article Content"}
                </span>
                <div className="p-6 rounded-2xl border border-border bg-background max-h-[400px] overflow-y-auto font-mono text-xs leading-relaxed whitespace-pre-wrap selection:bg-primary/20">
                  {selectedSubmission.content}
                </div>
              </div>

              {selectedSubmission.editorialNote && (
                <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs space-y-1">
                  <span className="font-mono font-bold text-foreground block">
                    {isAz ? "Müəllifin Redaktora Qeydi" : "Author's Note to Editor"}:
                  </span>
                  <p className="text-muted-foreground">{selectedSubmission.editorialNote}</p>
                </div>
              )}
            </div>

            {/* Technical Integrity Snapshot */}
            <div className="rounded-2xl border border-border bg-muted/10 p-4 text-xs font-mono space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-muted-foreground block">{t("contentIntegrityHashLabel", "Content Integrity Record (SHA-256)")}:</span>
                  <span className="text-primary text-[11px] break-all">{selectedSubmission.contentHash}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSubmission.contentHash);
                    setCopiedSubHash(true);
                    setTimeout(() => setCopiedSubHash(false), 2500);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors shrink-0 flex items-center gap-1"
                >
                  {copiedSubHash ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  <span>{copiedSubHash ? (isAz ? "Kopyalandı" : "Copied") : (isAz ? "Kodu Kopyala" : "Copy Hash")}</span>
                </button>
              </div>
            </div>

            {/* Existing Review Note / Status Details */}
            {selectedSubmission.reviewNote && (
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-1 text-xs">
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  {isAz ? "Əvvəlki Redaksiya Qeydi" : "Previous Editorial Feedback"}:
                </span>
                <p className="text-foreground">{selectedSubmission.reviewNote}</p>
                {selectedSubmission.reviewedAt && (
                  <span className="text-[10px] font-mono text-muted-foreground block pt-1">
                    {isAz ? "Baxıldı" : "Reviewed"}: {new Date(selectedSubmission.reviewedAt).toLocaleString(isAz ? "az-AZ" : "en-US")}
                  </span>
                )}
              </div>
            )}

            {/* Editorial Action Drawer */}
            {subReviewActionType === "changes" ? (
              <div className="p-6 rounded-2xl border border-orange-500/30 bg-orange-500/[0.04] space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <RotateCcw size={15} className="text-orange-500" />
                    <span>{isAz ? "Müəllifdən Düzəliş Tələb Et" : "Request Changes from Author"}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isAz
                      ? "Müəllifin məqaləni təkmilləşdirməsi üçün konkret redaksiya təkliflərinizi yazın."
                      : "Provide constructive editorial guidance for the author to revise and strengthen the piece."}
                  </p>
                </div>

                <textarea
                  rows={4}
                  value={subEditorialNoteInput}
                  onChange={(e) => setSubEditorialNoteInput(e.target.value)}
                  placeholder={
                    isAz
                      ? "məsələn: Məqalənin ideyası çox yaxşıdır, lakin 2-ci bölmədəki nümunələri zənginləşdirməyi tövsiyə edirik..."
                      : "e.g. The premise is strong, but please expand section 2 with concrete real-world case studies..."
                  }
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSubReviewActionType(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {isAz ? "Ləğv Et" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={!subEditorialNoteInput.trim() || processingSubId === selectedSubmission.id}
                    onClick={() => handleRequestChanges(selectedSubmission.id)}
                    className="px-5 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send size={13} />
                    <span>{processingSubId === selectedSubmission.id ? (isAz ? "Saxlanılır..." : "Saving...") : (isAz ? "Qeydi Saxla və Tələb Et" : "Save & Request Changes")}</span>
                  </button>
                </div>
              </div>
            ) : subReviewActionType === "reject" ? (
              <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/[0.04] space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <X size={15} className="text-destructive" />
                    <span>{isAz ? "Təqdimatdan İmtina Et" : "Reject Submission"}</span>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {isAz
                      ? "İmtina səbəbini daxil edin (məsələn: mövzu uyğunsuzluğu və ya hazırkı redaksiya planına uyğun deyil)."
                      : "State the internal reason for declining this piece."}
                  </p>
                </div>

                <textarea
                  rows={3}
                  value={subEditorialNoteInput}
                  onChange={(e) => setSubEditorialNoteInput(e.target.value)}
                  placeholder={
                    isAz
                      ? "İmtina səbəbini qeyd edin..."
                      : "State rejection reason..."
                  }
                  className="w-full rounded-xl border border-border bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/20 focus:border-destructive"
                />

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSubReviewActionType(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {isAz ? "Ləğv Et" : "Cancel"}
                  </button>
                  <button
                    type="button"
                    disabled={processingSubId === selectedSubmission.id}
                    onClick={() => handleRejectSubmission(selectedSubmission.id)}
                    className="px-5 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-bold hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-2xs"
                  >
                    <X size={13} />
                    <span>{processingSubId === selectedSubmission.id ? (isAz ? "Yenilənir..." : "Updating...") : (isAz ? "Təsdiq Et və İmtina Et" : "Confirm Rejection")}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Core Decision Buttons */
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSubReviewActionType("changes")}
                    className="px-4 py-2.5 rounded-xl border border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw size={14} />
                    <span>{isAz ? "Düzəliş Tələb Et" : "Request Changes"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubReviewActionType("reject")}
                    className="px-4 py-2.5 rounded-xl border border-destructive/30 text-destructive bg-destructive/10 hover:bg-destructive/20 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <X size={14} />
                    <span>{isAz ? "İmtina Et" : "Reject"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={processingSubId === selectedSubmission.id || selectedSubmission.status === "PUBLISHED"}
                  onClick={() => handleApproveAndPublish(selectedSubmission)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCheck size={16} />
                  <span>
                    {processingSubId === selectedSubmission.id
                      ? (isAz ? "Dərc Edilir..." : "Publishing...")
                      : selectedSubmission.status === "PUBLISHED"
                      ? (isAz ? "Artıq Dərc Edilib" : "Already Published")
                      : (isAz ? "Təsdiqlə və Dərc Et" : "Approve & Publish Live")}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
