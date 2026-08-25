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
  ContributorApplicationRecord,
  ContributorProfile,
  ContributorArticleDraft,
  slugifyAuthorName,
} from "../../../services/contributorService";
import { SiteSettings } from "../../../types/cms";
import { fetchSiteSettings } from "../../../lib/sanityQueries";

type AdminTab = "overview" | "applications" | "contributors" | "articles";

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
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
  });
  const [applications, setApplications] = useState<ContributorApplicationRecord[]>([]);
  const [contributors, setContributors] = useState<ContributorProfile[]>([]);
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Application Filters & Details Modal
  const [appFilter, setAppFilter] = useState<"ALL" | "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED">("ALL");
  const [selectedApp, setSelectedApp] = useState<ContributorApplicationRecord | null>(null);
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);
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
      const [m, apps, contribs, arts] = await Promise.all([
        getAdminOverviewMetrics(),
        getAllContributorApplications(),
        getApprovedContributors(),
        getAllSubmittedArticles(),
      ]);
      setMetrics(m);
      setApplications(apps);
      setContributors(contribs);
      setArticles(arts);
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

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (appFilter === "ALL") return true;
    return app.status === appFilter;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <SEO
        title={isAz ? "Admin İdarəetmə Paneli — Rvan.me" : "Admin Console — Rvan.me"}
        description="Editorial management and contributor application review."
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
                    ? "Müəlliflik müraciətlərinin yoxlanılması və redaksiya idarəetmə mərkəzi."
                    : "Editorial management, contributor application review, and platform administration."}
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
                    : "border border-border bg-card/60 dark:bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShieldCheck size={14} />
                <span>{t("adminOverview", "Overview")}</span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("applications")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "applications"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card/60 dark:bg-white/5 text-muted-foreground hover:text-foreground"
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
                onClick={() => switchTab("contributors")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "contributors"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card/60 dark:bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users size={14} />
                <span>
                  {t("adminContributors", "Contributors")} ({metrics.activeContributors})
                </span>
              </button>

              <button
                type="button"
                onClick={() => switchTab("articles")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-primary text-black font-extrabold shadow-sm shadow-primary/20"
                    : "border border-border bg-card/60 dark:bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                <PenTool size={14} />
                <span>{t("adminArticles", "Articles")}</span>
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
                    <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                      <span>{t("adminPendingApps", "Pending Applications")}</span>
                      <Clock size={16} className="text-amber-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.pendingApplications}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                      <span>{t("adminActiveContributors", "Active Contributors")}</span>
                      <Users size={16} className="text-sky-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.activeContributors}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                      <span>{t("adminTotalApps", "Total Applications")}</span>
                      <FileText size={16} className="text-primary" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.totalApplications}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs backdrop-blur-xl">
                    <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                      <span>{t("adminSubmittedArticles", "Submitted Articles")}</span>
                      <PenTool size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-foreground">
                      {metrics.submittedArticles}
                    </p>
                  </div>
                </div>

                {/* Recent Applications Quick Review Deck */}
                <div className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        {t("adminRecentApps", "Recent Applications")}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {isAz
                          ? "Ən son daxil olmuş redaksiya müəlliflik müraciətləri."
                          : "Latest editorial contributor applications submitted through the contact portal."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => switchTab("applications")}
                      className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline font-bold"
                    >
                      <span>{isAz ? "Hamısına Bax" : "View All"}</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {applications.length === 0 ? (
                    <div className="py-12 text-center text-xs font-mono text-muted-foreground">
                      {t("adminNoApps", "No applications found matching the selected filter.")}
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {applications.slice(0, 5).map((app) => (
                        <div
                          key={app.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground truncate">
                                {app.fullName}
                              </span>
                              <span className="text-xs font-mono text-muted-foreground truncate">
                                ({app.email})
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-xl">
                              <span className="font-semibold text-foreground/80">
                                {t("adminArticleIdea", "Idea")}:
                              </span>{" "}
                              {app.idea}
                            </p>
                            <span className="text-[10px] font-mono text-muted-foreground/70 block">
                              {new Date(app.createdAt).toLocaleDateString(isAz ? "az-AZ" : "en-US")}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {app.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 dark:text-amber-400">
                                <Clock size={11} /> {t("adminFilterPending", "Pending")}
                              </span>
                            )}
                            {app.status === "APPROVED" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 size={11} /> {t("adminFilterApproved", "Approved")}
                              </span>
                            )}
                            {app.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1 text-[10.5px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500">
                                <X size={11} /> {t("adminFilterRejected", "Rejected")}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedApp(app);
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

            {/* ── TAB 3: CONTRIBUTORS ── */}
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

            {/* ── TAB 4: ARTICLES ── */}
            {activeTab === "articles" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      {t("adminArticles", "Articles")}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAz
                        ? "Müəlliflər tərəfindən baxış üçün təqdim olunmuş məqalələr."
                        : "Contributor article submissions and draft moderation queue."}
                    </p>
                  </div>
                </div>

                {articles.length === 0 ? (
                  /* Clean, explicit placeholder state */
                  <div className="rounded-3xl border border-border bg-card p-12 text-center space-y-4 max-w-xl mx-auto my-8">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <PenTool size={24} />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-foreground">
                        {isAz ? "Redaksiya Məqalə Növbəsi" : "Editorial Submissions"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(
                          "adminArticlesPlaceholder",
                          "Article review will appear here when contributor submissions are enabled."
                        )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="rounded-2xl border border-border bg-card p-6 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-bold text-foreground">{art.title}</h3>
                            <span className="text-xs font-mono text-muted-foreground">
                              By {art.authorName} · Category: {art.category}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
                            {art.status}
                          </span>
                        </div>
                        {art.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{art.excerpt}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

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

      <Footer siteSettings={siteSettings} />
    </div>
  );
}
