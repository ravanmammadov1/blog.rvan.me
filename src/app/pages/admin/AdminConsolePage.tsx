import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  X,
  ExternalLink,
  RefreshCw,
  Eye,
  PenTool,
  Check,
  ChevronRight,
  Filter,
  Lock,
  MessageSquare,
  AlertCircle,
  Sparkles,
  BookOpen,
  Lightbulb,
  Copy,
  ArrowRight,
  Inbox,
} from "lucide-react";
import SEO from "../../components/SEO";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import {
  getAllContributorApplications,
  approveContributorApplication,
  rejectContributorApplication,
  getApprovedContributors,
  getAllSubmittedArticles,
  getAdminOverviewMetrics,
  adminRequestChanges,
  adminRejectArticle,
  adminApproveAndPublishArticle,
  getAllArticleSubmissions,
  adminRequestChangesOnSubmission,
  adminRejectSubmission,
  adminApproveAndPublishSubmission,
  ContributorApplicationRecord,
  ContributorProfile,
  ContributorArticleDraft,
  ArticleSubmissionRecord,
  slugifyAuthorName,
  calculateReadTime,
} from "../../../services/contributorService";
import { ArticleSubmissionStatus } from "../../../types/contributor";
import { SiteSettings } from "../../../types/cms";
import { fetchSiteSettings } from "../../../lib/sanityQueries";

type AdminTab = "overview" | "submissions" | "applications" | "contributors" | "articles";

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
    if (path.includes("/applications")) return "applications";
    if (path.includes("/contributors")) return "contributors";
    if (path.includes("/articles")) return "articles";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Data States
  const [metrics, setMetrics] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    activeContributors: 0,
    submittedArticles: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
  });
  const [submissions, setSubmissions] = useState<ArticleSubmissionRecord[]>([]);
  const [applications, setApplications] = useState<ContributorApplicationRecord[]>([]);
  const [contributors, setContributors] = useState<ContributorProfile[]>([]);
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Submissions Tab Filter & Review Modal State
  const [submissionFilter, setSubmissionFilter] = useState<"ALL" | ArticleSubmissionStatus>("ALL");
  const [selectedSubmission, setSelectedSubmission] = useState<ArticleSubmissionRecord | null>(null);
  const [subReviewActionType, setSubReviewActionType] = useState<"publish" | "changes" | "reject" | null>(null);
  const [subEditorialNoteInput, setSubEditorialNoteInput] = useState("");
  const [processingSubId, setProcessingSubId] = useState<string | null>(null);
  const [copiedSubHash, setCopiedSubHash] = useState(false);

  // Application Filters & Details Modal
  const [appFilter, setAppFilter] = useState<"ALL" | "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedApp, setSelectedApp] = useState<ContributorApplicationRecord | null>(null);
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);

  // Article Filters & Review Modal State
  const [articleFilter, setArticleFilter] = useState<"ALL" | "submitted" | "changes_requested" | "published" | "rejected">("ALL");
  const [selectedArticle, setSelectedArticle] = useState<ContributorArticleDraft | null>(null);
  const [reviewActionType, setReviewActionType] = useState<"publish" | "changes" | "reject" | null>(null);
  const [editorialNoteInput, setEditorialNoteInput] = useState("");
  const [processingArticleId, setProcessingArticleId] = useState<string | null>(null);

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
    try {
      const [m, apps, contribs, arts, subs] = await Promise.all([
        getAdminOverviewMetrics(),
        getAllContributorApplications(),
        getApprovedContributors(),
        getAllSubmittedArticles(),
        getAllArticleSubmissions(),
      ]);
      setMetrics(m);
      setApplications(apps);
      setContributors(contribs);
      setArticles(arts);
      setSubmissions(subs);
    } catch (err) {
      console.error("[AdminConsole] Error loading data:", err);
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

  // Application Approval Handlers
  const handleApprove = async (appId: string) => {
    setProcessingAppId(appId);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      await approveContributorApplication(appId, reviewer);
      setActionSuccessMsg(isAz ? "Müraciət təsdiqləndi və müəllif profili aktivləşdirildi." : "Application approved and contributor profile activated.");
      await loadAllData();
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp((prev) => (prev ? { ...prev, status: "APPROVED" } : null));
      }
    } catch (err) {
      console.error("Failed to approve application:", err);
    } finally {
      setProcessingAppId(null);
    }
  };

  const handleReject = async (appId: string) => {
    setProcessingAppId(appId);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      await rejectContributorApplication(appId, reviewer);
      setActionSuccessMsg(isAz ? "Müraciət imtina statusuna keçirildi." : "Application marked as rejected.");
      await loadAllData();
      if (selectedApp && selectedApp.id === appId) {
        setSelectedApp((prev) => (prev ? { ...prev, status: "REJECTED" } : null));
      }
    } catch (err) {
      console.error("Failed to reject application:", err);
    } finally {
      setProcessingAppId(null);
    }
  };

  // Article Moderation Handlers
  const handleApproveAndPublishArticle = async (articleId: string) => {
    setProcessingArticleId(articleId);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      await adminApproveAndPublishArticle(articleId, reviewer);
      setActionSuccessMsg(isAz ? "Məqalə təsdiqləndi və Rvan.me-də rəsmi olaraq dərc edildi." : "Article approved and published live on Rvan.me!");
      await loadAllData();
      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle((prev) => (prev ? { ...prev, status: "published", publishedAt: new Date().toISOString() } : null));
      }
      setReviewActionType(null);
    } catch (err) {
      console.error("Failed to publish article:", err);
    } finally {
      setProcessingArticleId(null);
    }
  };

  const handleRequestChangesArticle = async () => {
    if (!selectedArticle || !editorialNoteInput.trim()) return;
    setProcessingArticleId(selectedArticle.id);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      await adminRequestChanges(selectedArticle.id, editorialNoteInput.trim(), reviewer);
      setActionSuccessMsg(isAz ? "Düzəliş qeydi müəllifə göndərildi." : "Changes requested and editorial note sent to author.");
      await loadAllData();
      setSelectedArticle((prev) => (prev ? { ...prev, status: "changes_requested", reviewNote: editorialNoteInput.trim() } : null));
      setReviewActionType(null);
      setEditorialNoteInput("");
    } catch (err) {
      console.error("Failed to request changes:", err);
    } finally {
      setProcessingArticleId(null);
    }
  };

  const handleRejectArticle = async () => {
    if (!selectedArticle) return;
    setProcessingArticleId(selectedArticle.id);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      await adminRejectArticle(selectedArticle.id, editorialNoteInput.trim(), reviewer);
      setActionSuccessMsg(isAz ? "Məqalə imtina statusuna keçirildi." : "Article rejected.");
      await loadAllData();
      setSelectedArticle((prev) => (prev ? { ...prev, status: "rejected", reviewNote: editorialNoteInput.trim() } : null));
      setReviewActionType(null);
      setEditorialNoteInput("");
    } catch (err) {
      console.error("Failed to reject article:", err);
    } finally {
      setProcessingArticleId(null);
    }
  };

  // ── ARTICLE SUBMISSIONS MODERATION HANDLERS ──
  const handleApproveSubmission = async (sub: ArticleSubmissionRecord) => {
    setProcessingSubId(sub.id);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      const ok = await adminApproveAndPublishSubmission(sub.id, reviewer);
      if (ok) {
        setActionSuccessMsg(
          isAz
            ? `Təqdimat (${sub.id}) təsdiqləndi və rəsmi olaraq nəşr edildi!`
            : `Submission (${sub.id}) approved and published live with author attribution!`
        );
        setSelectedSubmission(null);
        setSubReviewActionType(null);
        setSubEditorialNoteInput("");
        await loadAllData();
      }
    } catch (err) {
      console.error("Error approving submission:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleRequestChangesSubmission = async () => {
    if (!selectedSubmission || !subEditorialNoteInput.trim()) return;
    setProcessingSubId(selectedSubmission.id);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      const ok = await adminRequestChangesOnSubmission(
        selectedSubmission.id,
        subEditorialNoteInput.trim(),
        reviewer
      );
      if (ok) {
        setActionSuccessMsg(
          isAz
            ? `Düzəliş təklifləri (${selectedSubmission.id}) qeydə alındı.`
            : `Editorial revision notes stored for submission ${selectedSubmission.id}.`
        );
        setSelectedSubmission((prev) =>
          prev ? { ...prev, status: "CHANGES_REQUESTED", reviewNote: subEditorialNoteInput.trim() } : null
        );
        setSubReviewActionType(null);
        setSubEditorialNoteInput("");
        await loadAllData();
      }
    } catch (err) {
      console.error("Error requesting changes on submission:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  const handleRejectSubmission = async () => {
    if (!selectedSubmission) return;
    setProcessingSubId(selectedSubmission.id);
    setActionSuccessMsg(null);
    try {
      const reviewer = user?.email || user?.displayName || "Platform Admin";
      const ok = await adminRejectSubmission(
        selectedSubmission.id,
        subEditorialNoteInput.trim() || "Does not match current editorial criteria.",
        reviewer
      );
      if (ok) {
        setActionSuccessMsg(
          isAz
            ? `Təqdimat (${selectedSubmission.id}) imtina statusuna keçirildi.`
            : `Submission (${selectedSubmission.id}) marked as rejected.`
        );
        setSelectedSubmission((prev) =>
          prev ? { ...prev, status: "REJECTED", reviewNote: subEditorialNoteInput.trim() } : null
        );
        setSubReviewActionType(null);
        setSubEditorialNoteInput("");
        await loadAllData();
      }
    } catch (err) {
      console.error("Error rejecting submission:", err);
    } finally {
      setProcessingSubId(null);
    }
  };

  // Filtered submissions (prioritize 'PENDING' / 'IN_REVIEW' at top)
  const sortedSubmissions = [...submissions].sort((a, b) => {
    const isAPending = a.status === "PENDING" || a.status === "IN_REVIEW";
    const isBPending = b.status === "PENDING" || b.status === "IN_REVIEW";
    if (isAPending && !isBPending) return -1;
    if (!isAPending && isBPending) return 1;
    return new Date(b.submittedAt || b.createdAt).getTime() - new Date(a.submittedAt || a.createdAt).getTime();
  });

  const filteredSubmissions = sortedSubmissions.filter((sub) => {
    if (submissionFilter === "ALL") return true;
    return sub.status === submissionFilter;
  });

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (appFilter === "ALL") return true;
    return app.status === appFilter;
  });

  // Filtered articles (prioritize 'submitted' / under review at the top)
  const sortedArticles = [...articles].sort((a, b) => {
    if (a.status === "submitted" && b.status !== "submitted") return -1;
    if (b.status === "submitted" && a.status !== "submitted") return 1;
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  const filteredArticles = sortedArticles.filter((art) => {
    if (articleFilter === "ALL") return true;
    return art.status === articleFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "Admin İdarəetmə Paneli — Rvan.me" : "Admin Console — Rvan.me"}
        description="Editorial management, contributor application review, and publishing studio."
        noIndex
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="flex-1 px-4 sm:px-6 md:px-10 pt-28 pb-24 max-w-6xl mx-auto w-full">
        {/* Loading State */}
        {authLoading ? (
          <div className="py-24 text-center space-y-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
              {isAz ? "İstifadəçi hüquqları yoxlanılır..." : "Verifying administrator credentials..."}
            </p>
          </div>
        ) : !isAdmin ? (
          /* Access Denied / Auth Gateway */
          <div className="max-w-md mx-auto my-16 rounded-3xl border border-border bg-card/60 dark:bg-white/[0.02] p-8 md:p-10 text-center backdrop-blur-2xl shadow-xl space-y-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-xs">
              <Lock size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
                {t("adminAccessDenied", "Admin Authentication Required")}
              </span>
              <h1 className="text-2xl font-bold text-foreground">
                {isAz ? "Giriş Məhdudlaşdırılıb" : "Access Restricted"}
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {t(
                  "adminAccessDeniedDesc",
                  "You do not have administrative permissions to view this console. Please log in with the platform administrator account."
                )}
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <Button to={getLocalizedPath("/")} variant="primary" size="md">
                {isAz ? "ANA SƏHİFƏYƏ QAYIT" : "RETURN TO HOME"}
              </Button>
            </div>
          </div>
        ) : (
          /* Authorized Admin Console */
          <div className="space-y-8">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  <ShieldCheck size={14} /> {t("adminConsole", "Admin Console")}
                </div>
                <h1 className="mt-1 text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                  {t("adminConsole", "Admin Console")}
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isAz
                    ? "Müəlliflik müraciətlərinin yoxlanılması və redaksiya məqalə nəşriyyat mərkəzi."
                    : "Editorial management, contributor application review, and article publishing."}
                </p>
              </div>

              <button
                type="button"
                onClick={loadAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
              >
                <RefreshCw size={13} className={loadingData ? "animate-spin" : ""} />
                <span>{isAz ? "Yenilə" : "Refresh"}</span>
              </button>
            </div>

            {/* Admin Console Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => switchTab("overview")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck size={14} />
                <span>{t("adminOverview", "Overview")}</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("submissions")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "submissions"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Inbox size={14} />
                <span>
                  {t("adminSubmissions", "Submissions")}
                  {metrics.pendingSubmissions > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                      {metrics.pendingSubmissions}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("applications")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "applications"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText size={14} />
                <span>
                  {t("adminApplications", "Applications")}
                  {metrics.pendingApplications > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                      {metrics.pendingApplications}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("articles")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <PenTool size={14} />
                <span>
                  {t("adminArticles", "Articles")}
                  {articles.filter((a) => a.status === "submitted").length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30">
                      {articles.filter((a) => a.status === "submitted").length}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("contributors")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "contributors"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users size={14} />
                <span>
                  {t("adminContributors", "Contributors")} ({metrics.activeContributors})
                </span>
              </button>
            </div>

            {/* Action Feedback Banner */}
            {actionSuccessMsg && (
              <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  <span>{actionSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionSuccessMsg(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* ── TAB 1: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Metric Summary Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("adminPendingSubmissions", "Pending Submissions")}</span>
                      <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.pendingSubmissions}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("adminTotalSubmissions", "Total Submissions")}</span>
                      <Inbox size={16} className="text-primary" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.totalSubmissions}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("adminActiveContributors", "Active Contributors")}</span>
                      <Users size={16} className="text-sky-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.activeContributors}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                      <span>{t("published", "Published Contributor Essays")}</span>
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {articles.filter((a) => a.status === "published").length}
                    </p>
                  </div>
                </div>

                {/* Submissions Requiring Review */}
                {submissions.filter((s) => s.status === "PENDING" || s.status === "IN_REVIEW").length > 0 && (
                  <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6 md:p-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-amber-500" />
                        <h2 className="text-base font-bold text-foreground">
                          {isAz ? "Baxış Gözləyən Məqalə Təqdimatları" : "Article Submissions Awaiting Review"}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmissionFilter("PENDING");
                          switchTab("submissions");
                        }}
                        className="text-xs font-mono text-amber-500 hover:underline font-bold"
                      >
                        {isAz ? "Hamısına Bax →" : "View Queue →"}
                      </button>
                    </div>

                    <div className="divide-y divide-border/60">
                      {submissions
                        .filter((s) => s.status === "PENDING" || s.status === "IN_REVIEW")
                        .slice(0, 3)
                        .map((sub) => (
                          <div key={sub.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                            <div className="space-y-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                  {sub.submissionType === "idea" ? (isAz ? "İdeya" : "Idea") : (isAz ? "Məqalə" : "Article")}
                                </span>
                                <span className="text-xs font-mono text-muted-foreground">{sub.id}</span>
                              </div>
                              <h3 className="text-sm font-bold text-foreground truncate">{sub.title}</h3>
                              <span className="text-xs font-mono text-muted-foreground block truncate">
                                By {sub.authorName} ({sub.authorEmail}) · {new Date(sub.submittedAt).toLocaleDateString(isAz ? "az-AZ" : "en-US")}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setSubReviewActionType(null);
                                setSubEditorialNoteInput("");
                              }}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all cursor-pointer shrink-0 shadow-xs"
                            >
                              {isAz ? "Nəzərdən Keçir" : "Review & Decide"}
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Recent Submissions Quick Review Deck */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        {t("adminRecentSubmissions", "Recent Article Submissions")}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz
                          ? "Write for Rvan.me portalından daxil olmuş ən son məqalə və ideya təqdimatları."
                          : "Latest article ideas and drafts submitted via the public Write for Rvan.me portal."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => switchTab("submissions")}
                      className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline font-bold"
                    >
                      <span>{isAz ? "Hamısına Bax" : "View All"}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-muted-foreground">
                      {t("adminNoSubmissions", "No article submissions found.")}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {submissions.slice(0, 5).map((sub) => (
                        <div
                          key={sub.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground truncate">
                                {sub.title}
                              </span>
                              <span className="text-xs font-mono text-muted-foreground truncate">
                                by {sub.authorName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono text-[10.5px] text-primary font-bold">
                                {sub.id}
                              </span>
                              <span>·</span>
                              <span className="capitalize">{sub.submissionType}</span>
                              <span>·</span>
                              <span>{new Date(sub.submittedAt).toLocaleDateString(isAz ? "az-AZ" : "en-US")}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                sub.status === "APPROVED" || sub.status === "PUBLISHED"
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                  : sub.status === "CHANGES_REQUESTED"
                                  ? "border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                  : sub.status === "REJECTED"
                                  ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                                  : "border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400"
                              }`}
                            >
                              {sub.status === "PENDING" && <Clock size={11} />}
                              {(sub.status === "APPROVED" || sub.status === "PUBLISHED") && <CheckCircle2 size={11} />}
                              {sub.status === "REJECTED" && <X size={11} />}
                              {sub.status}
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSubmission(sub);
                                setSubReviewActionType(null);
                                setSubEditorialNoteInput("");
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-border bg-card hover:border-primary/50 text-foreground transition-colors cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>{isAz ? "Bax" : "Review"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 2: SUBMISSIONS ── */}
            {activeTab === "submissions" && (
              <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-2">
                    <Filter size={15} className="text-primary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {t("adminStatus", "Status")}:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["ALL", "PENDING", "IN_REVIEW", "CHANGES_REQUESTED", "APPROVED", "PUBLISHED", "REJECTED"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setSubmissionFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          submissionFilter === filter
                            ? "bg-primary text-black font-extrabold shadow-xs"
                            : "border border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {filter === "ALL" && t("adminFilterAll", "All")}
                        {filter === "PENDING" && t("adminFilterPending", "Pending")}
                        {filter === "IN_REVIEW" && (isAz ? "Baxışda" : "In Review")}
                        {filter === "CHANGES_REQUESTED" && t("changesRequested", "Changes Requested")}
                        {filter === "APPROVED" && t("adminFilterApproved", "Approved")}
                        {filter === "PUBLISHED" && t("published", "Published")}
                        {filter === "REJECTED" && t("adminFilterRejected", "Rejected")}
                        {filter !== "ALL" && ` (${submissions.filter((s) => s.status === filter).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submissions Deck */}
                {loadingData ? (
                  <div className="py-16 text-center text-xs font-mono text-muted-foreground">
                    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2" />
                    {isAz ? "Təqdimatlar yüklənir..." : "Loading submissions..."}
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl border border-border bg-card text-xs font-mono text-muted-foreground space-y-3">
                    <Inbox size={28} className="mx-auto text-muted-foreground/50" />
                    <p>{t("adminNoSubmissions", "No article submissions found matching the selected filter.")}</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 hover:border-primary/40 transition-all shadow-xs"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-primary px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
                                {sub.id}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  sub.submissionType === "article"
                                    ? "border-sky-500/30 bg-sky-500/10 text-sky-500"
                                    : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                                }`}
                              >
                                {sub.submissionType === "article" ? "Finished Article" : "Article Idea"}
                              </span>
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                  sub.status === "APPROVED" || sub.status === "PUBLISHED"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : sub.status === "CHANGES_REQUESTED"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                    : sub.status === "REJECTED"
                                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                                    : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                                }`}
                              >
                                {sub.status}
                              </span>
                              {sub.category && (
                                <span className="text-xs font-mono text-muted-foreground font-semibold">
                                  · {sub.category}
                                </span>
                              )}
                            </div>

                            <h3 className="text-lg font-bold text-foreground mt-1">
                              {sub.title}
                            </h3>

                            <div className="text-xs font-mono text-muted-foreground flex flex-wrap items-center gap-3">
                              <span>
                                Author: <strong className="text-foreground">{sub.authorName}</strong> ({sub.authorEmail})
                              </span>
                              <span>·</span>
                              <span>
                                {new Date(sub.submittedAt).toLocaleString(isAz ? "az-AZ" : "en-US")}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setSubReviewActionType(null);
                              setSubEditorialNoteInput("");
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all cursor-pointer font-extrabold shadow-xs shrink-0"
                          >
                            <BookOpen size={13} />
                            <span>{isAz ? "Bax & Qərar Ver" : "Review & Decide"}</span>
                          </button>
                        </div>

                        {sub.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {sub.excerpt}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-mono text-muted-foreground">
                          <span className="truncate max-w-md">
                            SHA-256: <code className="text-foreground/70">{sub.contentHash.substring(0, 16)}...</code>
                          </span>
                          {sub.originalWorkConfirmed && (
                            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={12} /> Original work confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 2: APPLICATIONS ── */}
            {activeTab === "applications" && (
              <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-2">
                    <Filter size={15} className="text-primary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {t("adminStatus", "Status")}:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setAppFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          appFilter === filter
                            ? "bg-primary text-black font-extrabold shadow-xs"
                            : "border border-border bg-card text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {filter === "ALL" && t("adminFilterAll", "All")}
                        {filter === "PENDING" && t("adminFilterPending", "Pending")}
                        {filter === "APPROVED" && t("adminFilterApproved", "Approved")}
                        {filter === "REJECTED" && t("adminFilterRejected", "Rejected")}
                        {filter !== "ALL" && ` (${applications.filter((a) => a.status === filter).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications Deck */}
                {loadingData ? (
                  <div className="py-16 text-center text-xs font-mono text-muted-foreground">
                    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-2" />
                    {isAz ? "Müraciətlər yüklənir..." : "Loading applications..."}
                  </div>
                ) : filteredApps.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl border border-border bg-card text-xs font-mono text-muted-foreground">
                    {t("adminNoApps", "No applications found matching the selected filter.")}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredApps.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 hover:border-primary/30 transition-all shadow-xs"
                      >
                        {/* Header Row */}
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                          <div>
                            <div className="flex items-center gap-2.5">
                              <h3 className="text-base font-bold text-foreground">
                                {app.fullName}
                              </h3>
                              <span className="text-xs font-mono text-muted-foreground">
                                ({app.email})
                              </span>
                            </div>
                            <span className="text-[10.5px] font-mono text-muted-foreground/80 mt-1 block">
                              {t("adminSubmittedDate", "Submitted Date")}:{" "}
                              {new Date(app.createdAt).toLocaleString(isAz ? "az-AZ" : "en-US")} · ID: {app.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {app.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                                <Clock size={11} /> {t("adminFilterPending", "Pending")}
                              </span>
                            )}
                            {app.status === "APPROVED" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={11} /> {t("adminFilterApproved", "Approved")}
                              </span>
                            )}
                            {app.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500">
                                <X size={11} /> {t("adminFilterRejected", "Rejected")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Content Preview */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider block mb-0.5">
                              {t("adminArticleIdea", "Proposed Topic / Idea")}:
                            </span>
                            <p className="text-sm font-semibold text-foreground">
                              {app.idea}
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                              {t("adminEditorialMessage", "Editorial Angle & Details")}:
                            </span>
                            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                              {app.message}
                            </p>
                          </div>

                          {app.portfolioUrl && (
                            <div>
                              <a
                                href={app.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline font-semibold"
                              >
                                <span>Portfolio / Social Profile: {app.portfolioUrl}</span>
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Action Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                          <span className="text-[10.5px] font-mono text-muted-foreground">
                            Suggested Author Slug:{" "}
                            <code className="text-primary font-bold">
                              {app.slug || slugifyAuthorName(app.fullName)}
                            </code>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedApp(app)}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border border-border bg-card hover:border-primary/50 text-foreground transition-colors cursor-pointer"
                            >
                              <Eye size={12} />
                              <span>{isAz ? "Təfərrüatlar" : "Details"}</span>
                            </button>

                            {app.status !== "APPROVED" && (
                              <button
                                type="button"
                                disabled={processingAppId === app.id}
                                onClick={() => handleApprove(app.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer disabled:opacity-50"
                              >
                                <Check size={13} />
                                <span>
                                  {processingAppId === app.id
                                    ? isAz ? "Təsdiqlənir..." : "Approving..."
                                    : t("adminApproveAndActivate", "Approve & Activate")}
                                </span>
                              </button>
                            )}

                            {app.status !== "REJECTED" && (
                              <button
                                type="button"
                                disabled={processingAppId === app.id}
                                onClick={() => handleReject(app.id)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                              >
                                <X size={13} />
                                <span>
                                  {processingAppId === app.id
                                    ? isAz ? "İmtina edilir..." : "Rejecting..."
                                    : t("adminReject", "Reject")}
                                </span>
                              </button>
                            )}

                            {app.status === "APPROVED" && (
                              <Link
                                to={getLocalizedPath(`/author/${app.slug || slugifyAuthorName(app.fullName)}`)}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline font-bold px-2 py-1"
                              >
                                <span>{isAz ? "Müəllif Səhifəsi" : "Author Page"}</span>
                                <ExternalLink size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 3: ARTICLES ── */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 rounded-2xl border border-border bg-card">
                  <div className="flex items-center gap-2">
                    <Filter size={15} className="text-primary" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {t("adminStatus", "Status")}:
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["ALL", "submitted", "changes_requested", "published", "rejected"] as const).map((filter) => (
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
                        {filter === "submitted" && t("underReview", "Under Review")}
                        {filter === "changes_requested" && t("changesRequested", "Changes Requested")}
                        {filter === "published" && t("published", "Published")}
                        {filter === "rejected" && t("rejected", "Rejected")}
                        {filter !== "ALL" && ` (${articles.filter((a) => a.status === filter).length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-4 max-w-xl mx-auto my-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <PenTool size={24} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground">
                        {isAz ? "Redaksiya Məqalə Növbəsi" : "Editorial Queue"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("noArticlesFound", "No articles found matching the selected filter.")}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredArticles.map((art) => (
                      <div
                        key={art.id}
                        className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-4 hover:border-primary/40 transition-all shadow-xs"
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
                              <span className="text-[11px] font-mono text-muted-foreground">
                                · {art.language === "az" ? "AZ" : "EN"}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-foreground mt-1">
                              {art.title}
                            </h3>
                            <span className="text-xs font-mono text-muted-foreground block mt-0.5">
                              By <strong className="text-foreground">{art.authorName}</strong> ·{" "}
                              {new Date(art.submittedAt || art.updatedAt || art.createdAt).toLocaleString(isAz ? "az-AZ" : "en-US")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedArticle(art);
                                setReviewActionType(null);
                                setEditorialNoteInput("");
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all cursor-pointer font-extrabold shadow-xs"
                            >
                              <BookOpen size={13} />
                              <span>{isAz ? "Məqaləyə Bax & Qərar Ver" : "Review & Decide"}</span>
                            </button>

                            {art.status === "published" && (
                              <Link
                                to={getLocalizedPath(`/blog/${art.slug}`)}
                                target="_blank"
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono font-bold border border-border bg-card hover:border-primary/50 text-foreground transition-all"
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

                        {art.reviewNote && (
                          <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs font-sans text-foreground">
                            <span className="font-mono text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 block mb-0.5">
                              Latest Editorial Note:
                            </span>
                            {art.reviewNote}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB 4: CONTRIBUTORS ── */}
            {activeTab === "contributors" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {t("adminActiveContributors", "Active Contributors")}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAz
                        ? "Təsdiqlənmiş və aktiv statusda olan Rvan.me müəllifləri."
                        : "Verified and active editorial contributors with public author profiles."}
                    </p>
                  </div>
                </div>

                {contributors.length === 0 ? (
                  <div className="py-16 text-center rounded-3xl border border-border bg-card text-xs font-mono text-muted-foreground">
                    {t("adminNoContributors", "No active approved contributors found.")}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {contributors.map((contrib) => (
                      <div
                        key={contrib.uid}
                        className="rounded-3xl border border-border bg-card p-6 space-y-4 shadow-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-foreground">
                              {contrib.name}
                            </h3>
                            <span className="text-xs font-mono text-primary font-semibold block mt-0.5">
                              {contrib.professionalTitle || "Editorial Contributor"}
                            </span>
                            {contrib.email && (
                              <span className="text-xs font-mono text-muted-foreground block mt-0.5">
                                {contrib.email}
                              </span>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 size={11} /> {t("activeContributor", "Active")}
                          </span>
                        </div>

                        {contrib.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {contrib.bio}
                          </p>
                        )}

                        <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono">
                          <span className="text-muted-foreground">
                            Slug: <code className="text-foreground font-bold">{contrib.slug}</code>
                          </span>

                          <Link
                            to={getLocalizedPath(`/author/${contrib.slug}`)}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                          >
                            <span>{isAz ? "Profilə Bax" : "View Profile"}</span>
                            <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── SUBMISSION DETAILS & REVIEW MODAL ── */}
      {selectedSubmission && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedSubmission(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest px-2.5 py-0.5 rounded-lg bg-primary/10 border border-primary/20">
                    {selectedSubmission.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      selectedSubmission.submissionType === "article"
                        ? "border-sky-500/30 bg-sky-500/10 text-sky-500"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {selectedSubmission.submissionType === "article" ? "Finished Article" : "Article Idea"}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      selectedSubmission.status === "APPROVED" || selectedSubmission.status === "PUBLISHED"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : selectedSubmission.status === "CHANGES_REQUESTED"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : selectedSubmission.status === "REJECTED"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {selectedSubmission.status}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mt-2">
                  {selectedSubmission.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Author Profile Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border text-xs font-mono">
              <div>
                <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">Author Name</span>
                <span className="font-bold text-foreground text-sm font-sans">{selectedSubmission.authorName}</span>
              </div>
              <div>
                <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">Email</span>
                <span className="text-foreground">{selectedSubmission.authorEmail}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">Short Bio</span>
                <p className="text-foreground font-sans text-xs leading-relaxed">{selectedSubmission.authorBio}</p>
              </div>
              {selectedSubmission.authorWebsite && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground uppercase text-[10px] block mb-0.5">Website / Portfolio</span>
                  <a
                    href={selectedSubmission.authorWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-bold"
                  >
                    <span>{selectedSubmission.authorWebsite}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              )}
            </div>

            {/* Cryptographic SHA-256 Proof */}
            <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-bold text-primary uppercase tracking-wider">
                  SHA-256 Content Fingerprint
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSubmission.contentHash);
                    setCopiedSubHash(true);
                    setTimeout(() => setCopiedSubHash(false), 2000);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Copy size={11} />
                  <span>{copiedSubHash ? "Copied" : "Copy Hash"}</span>
                </button>
              </div>
              <code className="block p-2 rounded-lg bg-muted text-[11px] text-foreground/80 break-all">
                {selectedSubmission.contentHash}
              </code>
            </div>

            {/* Cover Image Preview if available */}
            {selectedSubmission.coverImageUrl && (
              <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-muted max-h-56">
                <img
                  src={selectedSubmission.coverImageUrl}
                  alt={selectedSubmission.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Excerpt if available */}
            {selectedSubmission.excerpt && (
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-1">
                <span className="font-mono text-[10.5px] font-bold text-primary uppercase tracking-wider block">
                  {t("articleExcerpt", "Excerpt / Short Premise")}:
                </span>
                <p className="text-sm font-sans text-foreground leading-relaxed">
                  {selectedSubmission.excerpt}
                </p>
              </div>
            )}

            {/* Content / Proposal Body */}
            <div className="space-y-2">
              <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                {selectedSubmission.submissionType === "idea" ? "Article Proposal & Pitch" : "Full Article Content"}:
              </span>
              <div className="p-6 rounded-2xl border border-border bg-background whitespace-pre-wrap font-sans text-xs text-foreground/90 leading-relaxed max-h-80 overflow-y-auto">
                {selectedSubmission.content}
              </div>
            </div>

            {/* Taxonomy info */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground pt-2 border-t border-border">
              {selectedSubmission.category && (
                <span>Category: <strong className="text-foreground">{selectedSubmission.category}</strong></span>
              )}
              {selectedSubmission.topic && (
                <span>Topic: <strong className="text-foreground">{selectedSubmission.topic}</strong></span>
              )}
              {selectedSubmission.tags && selectedSubmission.tags.length > 0 && (
                <span>Tags: <strong className="text-foreground">{selectedSubmission.tags.join(", ")}</strong></span>
              )}
            </div>

            {/* Existing Review Note */}
            {selectedSubmission.reviewNote && (
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-1">
                <span className="text-[10.5px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                  Latest Editorial Note / Reason:
                </span>
                <p className="text-xs font-sans text-foreground">{selectedSubmission.reviewNote}</p>
                {selectedSubmission.reviewedBy && (
                  <span className="text-[10px] font-mono text-muted-foreground block">
                    Reviewed by {selectedSubmission.reviewedBy} at {new Date(selectedSubmission.reviewedAt || "").toLocaleString(isAz ? "az-AZ" : "en-US")}
                  </span>
                )}
              </div>
            )}

            {/* Request Changes Action Drawer */}
            {subReviewActionType === "changes" && (
              <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-3">
                <label className="block text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  {t("reviewNote", "Editorial Review Note / Feedback for Author")} <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  autoComplete="off"
                  value={subEditorialNoteInput}
                  onChange={(e) => setSubEditorialNoteInput(e.target.value)}
                  placeholder={t("reviewNotePlaceholder", "Specify required changes or suggestions for the author...")}
                  className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSubReviewActionType(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {t("discardChanges", "Cancel")}
                  </button>
                  <button
                    type="button"
                    disabled={!subEditorialNoteInput.trim() || processingSubId === selectedSubmission.id}
                    onClick={handleRequestChangesSubmission}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {processingSubId === selectedSubmission.id ? "Saving..." : t("requestChanges", "Save & Request Changes")}
                  </button>
                </div>
              </div>
            )}

            {/* Reject Action Drawer */}
            {subReviewActionType === "reject" && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-3">
                <label className="block text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
                  {t("rejectionReason", "Rejection Reason / Internal Note")}
                </label>
                <textarea
                  rows={3}
                  autoComplete="off"
                  value={subEditorialNoteInput}
                  onChange={(e) => setSubEditorialNoteInput(e.target.value)}
                  placeholder={t("rejectionReasonPlaceholder", "State the reason for rejecting this submission...")}
                  className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSubReviewActionType(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {t("discardChanges", "Cancel")}
                  </button>
                  <button
                    type="button"
                    disabled={processingSubId === selectedSubmission.id}
                    onClick={handleRejectSubmission}
                    className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {processingSubId === selectedSubmission.id ? "Rejecting..." : t("rejected", "Confirm Rejection")}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-border hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                {isAz ? "Bağla" : "Close"}
              </button>

              <div className="flex items-center gap-2">
                {selectedSubmission.status !== "PUBLISHED" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setSubReviewActionType("changes");
                        setSubEditorialNoteInput(selectedSubmission.reviewNote || "");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>{t("requestChanges", "Request Changes")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSubReviewActionType("reject");
                        setSubEditorialNoteInput(selectedSubmission.reviewNote || "");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={13} />
                      <span>{t("rejected", "Reject")}</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingSubId === selectedSubmission.id}
                      onClick={() => handleApproveSubmission(selectedSubmission)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-primary text-black hover:brightness-110 transition-all cursor-pointer font-extrabold disabled:opacity-50 shadow-xs"
                    >
                      <Sparkles size={13} />
                      <span>
                        {processingSubId === selectedSubmission.id
                          ? isAz ? "Nəşr edilir..." : "Publishing..."
                          : t("approveAndPublish", "Approve & Publish")}
                      </span>
                    </button>
                  </>
                )}

                {selectedSubmission.status === "PUBLISHED" && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 size={13} />
                    <span>Published & Attributed</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── APPLICATION DETAILS MODAL ── */}
      {selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                  {t("adminApplicationDetails", "Application Details")}
                </span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">
                  {selectedApp.fullName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-border">
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block mb-1">
                    {t("adminApplicant", "Applicant")}
                  </span>
                  <span className="font-bold text-foreground text-sm font-sans">{selectedApp.fullName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block mb-1">
                    Email Address
                  </span>
                  <span className="text-foreground">{selectedApp.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block mb-1">
                    {t("adminSubmittedDate", "Submitted Date")}
                  </span>
                  <span className="text-foreground">
                    {new Date(selectedApp.createdAt).toLocaleString(isAz ? "az-AZ" : "en-US")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase text-[10px] block mb-1">
                    {t("adminStatus", "Status")}
                  </span>
                  <span className="font-bold text-primary uppercase">{selectedApp.status}</span>
                </div>
              </div>

              <div>
                <span className="text-primary uppercase text-[10.5px] font-bold block mb-1">
                  {t("adminArticleIdea", "Proposed Topic / Article Idea")}
                </span>
                <div className="p-3.5 rounded-xl border border-border bg-card text-foreground text-sm font-sans font-semibold">
                  {selectedApp.idea}
                </div>
              </div>

              <div>
                <span className="text-muted-foreground uppercase text-[10.5px] font-bold block mb-1">
                  {t("adminEditorialMessage", "Editorial Angle & Details")}
                </span>
                <div className="p-4 rounded-xl border border-border bg-muted/20 text-foreground font-sans text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedApp.message}
                </div>
              </div>

              {selectedApp.portfolioUrl && (
                <div>
                  <span className="text-muted-foreground uppercase text-[10.5px] font-bold block mb-1">
                    Portfolio / Website / LinkedIn
                  </span>
                  <a
                    href={selectedApp.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-bold"
                  >
                    <span>{selectedApp.portfolioUrl}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-border hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                {isAz ? "Bağla" : "Close"}
              </button>

              <div className="flex items-center gap-2">
                {selectedApp.status !== "APPROVED" && (
                  <button
                    type="button"
                    disabled={processingAppId === selectedApp.id}
                    onClick={() => handleApprove(selectedApp.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Check size={13} />
                    <span>
                      {processingAppId === selectedApp.id
                        ? isAz ? "Təsdiqlənir..." : "Approving..."
                        : t("adminApproveAndActivate", "Approve & Activate")}
                    </span>
                  </button>
                )}

                {selectedApp.status !== "REJECTED" && (
                  <button
                    type="button"
                    disabled={processingAppId === selectedApp.id}
                    onClick={() => handleReject(selectedApp.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X size={13} />
                    <span>
                      {processingAppId === selectedApp.id
                        ? isAz ? "İmtina edilir..." : "Rejecting..."
                        : t("adminReject", "Reject")}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ARTICLE REVIEW & DECISION MODAL ── */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-3xl rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                    {selectedArticle.category} · {selectedArticle.language === "az" ? "AZ" : "EN"}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      selectedArticle.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : selectedArticle.status === "submitted"
                        ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30"
                        : selectedArticle.status === "changes_requested"
                        ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                        : selectedArticle.status === "rejected"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {selectedArticle.status === "submitted"
                      ? t("underReview", "Under Review")
                      : selectedArticle.status}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mt-1">
                  {selectedArticle.title}
                </h2>
                <span className="text-xs font-mono text-muted-foreground block mt-0.5">
                  Author: <strong className="text-foreground">{selectedArticle.authorName}</strong> (UID: {selectedArticle.authorUid}) · {calculateReadTime(selectedArticle.content, selectedArticle.language)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Body / Article Preview */}
            <div className="space-y-6 text-xs">
              {/* Cover Image if available */}
              {selectedArticle.coverImageUrl && (
                <div className="rounded-2xl border border-border overflow-hidden aspect-video bg-muted max-h-60">
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt */}
              {selectedArticle.excerpt && (
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1">
                  <span className="font-mono text-[10.5px] font-bold text-primary uppercase tracking-wider block">
                    {t("articleExcerpt", "Excerpt / Short Premise")}:
                  </span>
                  <p className="text-sm font-sans text-foreground leading-relaxed">
                    {selectedArticle.excerpt}
                  </p>
                </div>
              )}

              {/* Rendered Body Content */}
              <div className="space-y-2">
                <span className="font-mono text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                  {t("articleContent", "Article Body")}:
                </span>
                <div className="p-6 rounded-2xl border border-border bg-background whitespace-pre-wrap font-sans text-xs text-foreground/90 leading-relaxed max-h-72 overflow-y-auto">
                  {selectedArticle.content}
                </div>
              </div>

              {/* Review feedback input form when an action is selected */}
              {reviewActionType === "changes" && (
                <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5 space-y-3">
                  <label className="block text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                    {t("reviewNote", "Editorial Review Note / Feedback for Author")} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    autoComplete="off"
                    value={editorialNoteInput}
                    onChange={(e) => setEditorialNoteInput(e.target.value)}
                    placeholder={t("reviewNotePlaceholder", "Write editorial feedback or required revisions...")}
                    className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewActionType(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground"
                    >
                      {t("discardChanges", "Cancel")}
                    </button>
                    <button
                      type="button"
                      disabled={!editorialNoteInput.trim() || processingArticleId === selectedArticle.id}
                      onClick={handleRequestChangesArticle}
                      className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {processingArticleId === selectedArticle.id ? "..." : t("requestChanges", "Request Changes")}
                    </button>
                  </div>
                </div>
              )}

              {reviewActionType === "reject" && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 space-y-3">
                  <label className="block text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
                    {t("rejectionReason", "Rejection Reason")}
                  </label>
                  <textarea
                    rows={3}
                    autoComplete="off"
                    value={editorialNoteInput}
                    onChange={(e) => setEditorialNoteInput(e.target.value)}
                    placeholder={t("rejectionReasonPlaceholder", "State the reason for rejecting this submission...")}
                    className="w-full rounded-xl border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReviewActionType(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono text-muted-foreground"
                    >
                      {t("discardChanges", "Cancel")}
                    </button>
                    <button
                      type="button"
                      disabled={processingArticleId === selectedArticle.id}
                      onClick={handleRejectArticle}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {processingArticleId === selectedArticle.id ? "..." : t("rejected", "Reject Article")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-border hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              >
                {isAz ? "Bağla" : "Close"}
              </button>

              <div className="flex items-center gap-2">
                {selectedArticle.status !== "published" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setReviewActionType("changes")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                    >
                      <MessageSquare size={13} />
                      <span>{t("requestChanges", "Request Changes")}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReviewActionType("reject")}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border border-rose-500/30 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                    >
                      <X size={13} />
                      <span>{t("rejected", "Reject")}</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingArticleId === selectedArticle.id}
                      onClick={() => handleApproveAndPublishArticle(selectedArticle.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-primary text-black hover:brightness-110 transition-all cursor-pointer font-extrabold disabled:opacity-50 shadow-xs"
                    >
                      <Sparkles size={13} />
                      <span>
                        {processingArticleId === selectedArticle.id
                          ? isAz ? "Dərc edilir..." : "Publishing..."
                          : t("approveAndPublish", "Approve & Publish")}
                      </span>
                    </button>
                  </>
                )}

                {selectedArticle.status === "published" && (
                  <Link
                    to={getLocalizedPath(`/blog/${selectedArticle.slug}`)}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-primary text-black hover:brightness-110 transition-all"
                  >
                    <ExternalLink size={13} />
                    <span>{t("viewPublicArticle", "View Live Article")}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
    </div>
  );
}
