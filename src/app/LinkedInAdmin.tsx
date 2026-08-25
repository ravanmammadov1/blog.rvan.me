import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  ShieldCheck,
  UserCheck,
  ExternalLink,
  Lock,
  LogOut,
  Key,
  Sparkles,
  Check,
  X,
  Clock,
  FileText,
  History,
  PenTool,
  Users,
} from "lucide-react";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import {
  getAllContributorApplications,
  approveContributorApplication,
  rejectContributorApplication,
  ContributorApplicationRecord,
} from "../services/contributorService";

interface PendingPost {
  _id: string;
  headline: string;
  sourceName: string;
  sourceUrl: string;
  originalSourceUrl?: string;
  articleSlug?: string;
  category: string;
  generatedPost: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string;
  pipelineScore?: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  scheduledTime?: string;
  postId?: string;
}

interface PublishHistoryItem {
  _id: string;
  headline: string;
  sourceUrl: string;
  originalSourceUrl?: string;
  articleSlug?: string;
  sourceName?: string;
  category?: string;
  postId: string;
  publishedAt: string;
}

interface StatusResponse {
  connected: boolean;
  reconnectRequired?: boolean;
  memberName?: string;
  memberUrn?: string;
  memberEmail?: string;
  memberPicture?: string;
  expiresAt?: number;
  daysRemaining?: number;
  hasRefreshToken?: boolean;
  refreshTokenExpiresAt?: number | null;
  refreshTokenDaysRemaining?: number | null;
  autoRefreshMechanism?: string;
  message?: string;
  error?: string;
  pendingPost?: PendingPost | null;
  historyList?: PublishHistoryItem[];
}

export default function LinkedInAdmin() {
  const [searchParams] = useSearchParams();
  const { getLocalizedPath } = useLanguage();
  const { user, isAdmin, loading: authLoading } = useAuth();

  // Admin Section Tab State
  const [adminTab, setAdminTab] = useState<"contributors" | "linkedin">("contributors");

  // Contributor Applications State
  const [applications, setApplications] = useState<ContributorApplicationRecord[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appFilter, setAppFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [processingAppId, setProcessingAppId] = useState<string | null>(null);

  // Security Auth State
  const [adminSecret, setAdminSecret] = useState<string>(() => {
    return sessionStorage.getItem("linkedin_admin_secret") || "";
  });
  const [inputSecret, setInputSecret] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Status & Form State
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Pipeline approval action states
  const [actionLoading, setActionLoading] = useState(false);
  const [pipelineMessage, setPipelineMessage] = useState<string | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // Manual publishing form state
  const [commentary, setCommentary] = useState("🚀 Testing LinkedIn automation on my personal profile via Rvan.me!");
  const [linkUrl, setLinkUrl] = useState("https://www.rvan.me");
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const urlError = searchParams.get("error");
  const urlConnected = searchParams.get("connected");

  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const list = await getAllContributorApplications();
      setApplications(list);
    } catch (e) {
      console.error("Error loading contributor applications:", e);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleApproveApp = async (id: string) => {
    setProcessingAppId(id);
    try {
      await approveContributorApplication(id);
      await loadApplications();
    } catch (e) {
      console.error("Error approving contributor application:", e);
    } finally {
      setProcessingAppId(null);
    }
  };

  const handleRejectApp = async (id: string) => {
    setProcessingAppId(id);
    try {
      await rejectContributorApplication(id);
      await loadApplications();
    } catch (e) {
      console.error("Error rejecting contributor application:", e);
    } finally {
      setProcessingAppId(null);
    }
  };

  const checkStatusWithSecret = async (secret: string) => {
    setLoadingStatus(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/linkedin/status", {
        headers: {
          "x-admin-secret": secret,
        },
      });

      const data = await res.json();

      if (res.status === 401 || (data.error && data.error.includes("Unauthorized"))) {
        setIsAuthenticated(false);
        setAuthError("Invalid Admin Secret. Access Denied.");
        setStatus(null);
      } else {
        setIsAuthenticated(true);
        setStatus(data);
        sessionStorage.setItem("linkedin_admin_secret", secret);
        loadApplications();
      }
    } catch (err: any) {
      setStatus({
        connected: false,
        reconnectRequired: true,
        error: err.message || "Failed to contact status endpoint",
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  // Authenticate immediately if the logged in Firebase user is the platform admin
  useEffect(() => {
    if (isAdmin) {
      setIsAuthenticated(true);
      loadApplications();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (adminSecret) {
      checkStatusWithSecret(adminSecret);
    } else {
      setLoadingStatus(false);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSecret.trim()) return;
    setAdminSecret(inputSecret.trim());
    checkStatusWithSecret(inputSecret.trim());
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("linkedin_admin_secret");
    setAdminSecret("");
    setIsAuthenticated(false);
    setStatus(null);
    setInputSecret("");
  };

  const handleConnect = () => {
    window.location.href = "/api/linkedin/auth";
  };

  // Trigger manual pipeline run
  const handleTriggerPipeline = async () => {
    if (!adminSecret) return;
    setActionLoading(true);
    setPipelineMessage(null);
    setPipelineError(null);

    try {
      const res = await fetch("/api/linkedin/pipeline", {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPipelineError(data.error || "Failed to trigger pipeline.");
      } else {
        setPipelineMessage("Pipeline executed! Generated new candidate post for review.");
        checkStatusWithSecret(adminSecret);
      }
    } catch (err: any) {
      setPipelineError(err.message || "Pipeline trigger error");
    } finally {
      setActionLoading(false);
    }
  };

  // Approve pending candidate
  const handleApprovePendingPost = async () => {
    if (!adminSecret) return;
    setActionLoading(true);
    setPipelineMessage(null);
    setPipelineError(null);

    try {
      const res = await fetch("/api/linkedin/pipeline?action=approve", {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPipelineError(data.error || "Failed to approve post.");
      } else {
        setPipelineMessage(`🎉 Approved & Published to LinkedIn! (Post ID: ${data.postId})`);
        checkStatusWithSecret(adminSecret);
      }
    } catch (err: any) {
      setPipelineError(err.message || "Approval error");
    } finally {
      setActionLoading(false);
    }
  };

  // Reject pending candidate
  const handleRejectPendingPost = async () => {
    if (!adminSecret) return;
    setActionLoading(true);
    setPipelineMessage(null);
    setPipelineError(null);

    try {
      const res = await fetch("/api/linkedin/pipeline?action=reject", {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPipelineError(data.error || "Failed to reject draft.");
      } else {
        setPipelineMessage("Pending draft candidate rejected.");
        checkStatusWithSecret(adminSecret);
      }
    } catch (err: any) {
      setPipelineError(err.message || "Rejection error");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishTestPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentary.trim() || !adminSecret) return;

    setPublishing(true);
    setPublishResult(null);
    setPublishError(null);

    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": adminSecret,
        },
        body: JSON.stringify({
          commentary: commentary.trim(),
          linkUrl: linkUrl.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPublishError(data.error || "Failed to publish test post.");
        if (res.status === 401) {
          setIsAuthenticated(false);
          setAuthError("Session expired or unauthorized secret.");
        } else if (data.reconnectRequired) {
          checkStatusWithSecret(adminSecret);
        }
      } else {
        setPublishResult(data);
      }
    } catch (err: any) {
      setPublishError(err.message || "An unexpected error occurred during publishing.");
    } finally {
      setPublishing(false);
    }
  };

  const pendingCandidate = status?.pendingPost && status.pendingPost.status === "pending" ? status.pendingPost : null;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO title="LinkedIn OAuth & Automation Control Panel — Rvan.me" noIndex />
      <SiteHeader siteSettings={null} />

      <div className="mx-auto max-w-5xl px-6 pt-24 pb-28 md:px-10 md:pt-32">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase tracking-widest">
            <Link to={getLocalizedPath("/")} className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">LinkedIn OAuth & Member Publishing</span>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => checkStatusWithSecret(adminSecret)}
                disabled={loadingStatus}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-all mono glass-sm"
              >
                <RefreshCw size={13} className={loadingStatus ? "animate-spin" : ""} /> Refresh Status
              </button>
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500 hover:text-white transition-all mono glass-sm"
              >
                <LogOut size={13} /> Lock Session
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mono uppercase mb-3">
            <ShieldCheck size={14} /> Protected Admin Console
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Personal Member Publishing.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Manage daily Automated Content Pipelines with **Approval Mode**. Review, approve, or reject generated LinkedIn posts before publishing directly to your feed.
          </p>
        </div>

        {/* SECURITY GATEWAY: Passcode Authentication Screen */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto rounded-3xl border border-white/10 bg-white/5 p-8 glass shadow-2xl my-12">
            <div className="text-center mb-6">
              <div className="h-14 w-14 rounded-2xl border border-primary/40 bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <Lock size={28} />
              </div>
              <h2 className="text-xl font-bold text-foreground">Admin Authentication Required</h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Enter your private server secret key (`LINKEDIN_ADMIN_SECRET`) to unlock the LinkedIn control panel.
              </p>
            </div>

            {authError && (
              <div className="mb-6 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-medium flex items-center gap-2.5 glass">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mono block mb-2">
                  Admin Secret Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={inputSecret}
                    onChange={(e) => setInputSecret(e.target.value)}
                    placeholder="Enter secret key..."
                    className="w-full rounded-xl border border-white/10 bg-background/90 px-4 py-3.5 pl-10 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none glass-sm font-mono"
                    required
                  />
                  <Key size={15} className="absolute left-3.5 top-4 text-muted-foreground/60" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingStatus || !inputSecret.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold tracking-[.15em] text-white uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 mono shadow-[0_0_20px_rgba(97,197,173,0.3)]"
                style={{
                  background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
                }}
              >
                {loadingStatus ? "VERIFYING SECRET..." : "AUTHENTICATE ADMIN SESSION"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* ADMIN CONSOLE TABS */}
            <div className="mb-8 flex items-center gap-3 border-b border-white/10 pb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setAdminTab("contributors")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider mono transition-all cursor-pointer ${
                  adminTab === "contributors"
                    ? "bg-primary text-black font-extrabold shadow-md shadow-primary/20"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                }`}
              >
                <Users size={14} /> Contributor Applications ({applications.filter((a) => a.status === "PENDING").length} Pending)
              </button>

              <button
                type="button"
                onClick={() => setAdminTab("linkedin")}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold uppercase tracking-wider mono transition-all cursor-pointer ${
                  adminTab === "linkedin"
                    ? "bg-primary text-black font-extrabold shadow-md shadow-primary/20"
                    : "border border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                }`}
              >
                <Sparkles size={14} /> LinkedIn Automation & Pipeline
              </button>
            </div>

            {/* TAB 1: CONTRIBUTOR APPLICATIONS */}
            {adminTab === "contributors" && (
              <div className="space-y-6 mb-12">
                {/* Stats & Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-white/5 glass">
                  <div>
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Users size={18} className="text-primary" /> Curated Contributor Applications
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Review editorial submissions. Approving an applicant activates their Contributor Profile & Dashboard.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setAppFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          appFilter === filter
                            ? "bg-primary text-black font-extrabold"
                            : "border border-white/10 bg-white/5 text-muted-foreground hover:text-white"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Applications List */}
                {loadingApps ? (
                  <div className="p-12 text-center text-xs mono text-muted-foreground animate-pulse">
                    Loading contributor applications...
                  </div>
                ) : applications.filter((a) => appFilter === "ALL" || a.status === appFilter).length === 0 ? (
                  <div className="p-12 rounded-2xl border border-white/10 bg-white/5 text-center text-xs mono text-muted-foreground">
                    No applications found matching the "{appFilter}" filter.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {applications
                      .filter((a) => appFilter === "ALL" || a.status === appFilter)
                      .map((app) => (
                        <div
                          key={app.id}
                          className="p-6 rounded-2xl border border-white/10 bg-white/5 glass hover:border-primary/30 transition-all space-y-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                            <div>
                              <div className="flex items-center gap-2.5">
                                <h3 className="text-base font-bold text-foreground">{app.fullName}</h3>
                                <span className="text-xs font-mono text-muted-foreground">({app.email})</span>
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground/80 mt-1 block">
                                Submitted: {new Date(app.createdAt).toLocaleString()} · ID: {app.id}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {app.status === "PENDING" && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                                  <Clock size={11} /> Pending Review
                                </span>
                              )}
                              {app.status === "APPROVED" && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                                  <CheckCircle2 size={11} /> Approved
                                </span>
                              )}
                              {app.status === "REJECTED" && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400">
                                  <X size={11} /> Rejected
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-wider block mb-0.5">
                                Proposed Topic / Idea:
                              </span>
                              <p className="text-sm font-semibold text-foreground">{app.idea}</p>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-wider block mb-0.5">
                                Details & Editorial Angle:
                              </span>
                              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{app.message}</p>
                            </div>

                            {app.portfolioUrl && (
                              <div className="pt-1">
                                <a
                                  href={app.portfolioUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                                >
                                  Portfolio / Profile: {app.portfolioUrl} <ExternalLink size={11} />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <span className="text-[10.5px] font-mono text-muted-foreground">
                              Suggested Slug: <code className="text-primary font-bold">{app.slug || slugifyAuthorName(app.fullName)}</code>
                            </span>

                            <div className="flex items-center gap-2">
                              {app.status !== "APPROVED" && (
                                <button
                                  type="button"
                                  disabled={processingAppId === app.id}
                                  onClick={() => handleApproveApp(app.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all mono cursor-pointer disabled:opacity-50"
                                >
                                  <Check size={13} /> {processingAppId === app.id ? "Approving..." : "Approve & Activate"}
                                </button>
                              )}

                              {app.status !== "REJECTED" && (
                                <button
                                  type="button"
                                  disabled={processingAppId === app.id}
                                  onClick={() => handleRejectApp(app.id)}
                                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500 hover:text-white transition-all mono cursor-pointer disabled:opacity-50"
                                >
                                  <X size={13} /> Reject
                                </button>
                              )}

                              {app.status === "APPROVED" && (
                                <Link
                                  to={getLocalizedPath(`/author/${app.slug || slugifyAuthorName(app.fullName)}`)}
                                  target="_blank"
                                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline font-bold px-2 py-1"
                                >
                                  View Author Page <ExternalLink size={12} />
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

            {/* TAB 2: LINKEDIN AUTOMATION */}
            {adminTab === "linkedin" && (
              <div>
            {/* OAuth URL Status Banners */}
            {urlConnected && (
              <div className="mb-8 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm flex items-center gap-3 glass">
                <CheckCircle2 size={18} className="shrink-0" />
                <div>
                  <strong className="font-bold">OAuth Authentication Successful!</strong> Your personal LinkedIn profile is now connected.
                </div>
              </div>
            )}

            {urlError && (
              <div className="mb-8 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm flex items-center gap-3 glass">
                <AlertTriangle size={18} className="shrink-0" />
                <div>
                  <strong className="font-bold">Authentication Error:</strong> {decodeURIComponent(urlError)}
                </div>
              </div>
            )}

            {/* PIPELINE APPROVAL SECTION */}
            <div className="mb-10 rounded-3xl border border-primary/30 bg-primary/5 p-6 md:p-8 glass relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mono uppercase tracking-wider mb-1">
                    <Sparkles size={14} /> Automated Daily Content Pipeline
                  </div>
                  <h2 className="text-xl font-bold text-foreground">APPROVAL MODE: ON (Manual Review Required)</h2>
                  <p className="text-xs text-muted-foreground mt-1">Selects the best article from the existing Rvan.me News Engine dataset. Posts link to rvan.me/az/news/. Posts are NEVER published automatically without your approval.</p>
                </div>
                <button
                  onClick={handleTriggerPipeline}
                  disabled={actionLoading}
                  className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-black transition-all mono glass-sm"
                >
                  <Sparkles size={14} className={actionLoading ? "animate-spin" : ""} /> Generate New Draft Candidate
                </button>
              </div>

              {pipelineMessage && (
                <div className="mb-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium flex items-center gap-2.5 glass">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{pipelineMessage}</span>
                </div>
              )}

              {pipelineError && (
                <div className="mb-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-medium flex items-center gap-2.5 glass">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{pipelineError}</span>
                </div>
              )}

              {pendingCandidate ? (
                <div className="rounded-2xl border border-white/10 bg-background/80 p-6 glass-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase mono">
                      <Clock size={12} /> Pending Approval Candidate
                    </span>
                    <div className="flex items-center gap-3">
                      {pendingCandidate.pipelineScore && (
                        <span className="text-[10px] font-mono text-primary/80 bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                          Score: {pendingCandidate.pipelineScore}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Generated: {new Date(pendingCandidate.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Cover Image Preview */}
                  {pendingCandidate.coverImageUrl && (
                    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20">
                      <img
                        src={pendingCandidate.coverImageUrl}
                        alt={pendingCandidate.coverImageAlt || pendingCandidate.headline}
                        className="w-full h-48 object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="px-3 py-1.5 text-[10px] font-mono text-muted-foreground bg-black/40">
                        LinkedIn Image Preview — Sanity CDN
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mono block">{pendingCandidate.sourceName} | {pendingCandidate.category}</span>
                    <h3 className="text-base font-bold text-foreground mt-1">{pendingCandidate.headline}</h3>

                    {/* Rvan.me Article URL */}
                    <a
                      href={pendingCandidate.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 mt-1.5 font-mono break-all"
                    >
                      <ExternalLink size={12} /> {pendingCandidate.sourceUrl}
                    </a>

                    {/* Original Source (for reference only) */}
                    {pendingCandidate.originalSourceUrl && (
                      <div className="mt-1">
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          Original: {pendingCandidate.originalSourceUrl}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI-Generated Azerbaijani Post Preview */}
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mono block mb-2">
                      AI-Generated Azerbaijani LinkedIn Post
                    </span>
                    <div className="p-4 rounded-xl border border-white/10 bg-black/40 text-xs leading-relaxed text-foreground whitespace-pre-wrap font-sans">
                      {pendingCandidate.generatedPost}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={handleApprovePendingPost}
                      disabled={actionLoading || !status?.connected}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold tracking-[.1em] text-black uppercase transition-all hover:bg-emerald-400 disabled:opacity-40 mono shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      <Check size={16} /> APPROVE & PUBLISH TO LINKEDIN
                    </button>

                    <button
                      onClick={handleRejectPendingPost}
                      disabled={actionLoading}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-6 py-3 text-xs font-bold tracking-[.1em] text-rose-400 uppercase transition-all hover:bg-rose-500 hover:text-white disabled:opacity-40 mono"
                    >
                      <X size={16} /> REJECT DRAFT
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <FileText size={32} className="mx-auto mb-2 opacity-50 text-primary" />
                  <p className="text-sm font-semibold text-foreground">No Pending Draft Candidate</p>
                  <p className="text-xs text-muted-foreground mt-1">The daily scheduler will generate the next candidate, or click "Generate New Draft Candidate" above to trigger now.</p>
                </div>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-12">
              {/* Connection Status Card */}
              <div className="md:col-span-5 rounded-2xl border border-white/10 bg-white/5 p-6 glass relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono">OAuth Connection Status</h2>
                    {status?.connected ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Connected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase mono">
                        Disconnected
                      </span>
                    )}
                  </div>

                  {loadingStatus ? (
                    <div className="py-12 text-center text-muted-foreground text-xs mono animate-pulse">
                      Checking server-side token state...
                    </div>
                  ) : status?.connected ? (
                    <div className="space-y-4">
                      {status.memberPicture && (
                        <img
                          src={status.memberPicture}
                          alt={status.memberName || "Profile"}
                          className="h-16 w-16 rounded-full border-2 border-primary/50 object-cover mb-2"
                        />
                      )}
                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mono block">Authenticated Member</label>
                        <p className="text-base font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                          <UserCheck size={16} className="text-primary" /> {status.memberName}
                        </p>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-muted-foreground uppercase mono block">LinkedIn Member URN</label>
                        <p className="text-xs font-mono text-primary/90 bg-black/40 p-2 rounded-lg border border-white/5 mt-0.5 break-all">
                          {status.memberUrn}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase mono block">Access Expiry</span>
                          <span className="text-lg font-bold text-emerald-400 mono">{status.daysRemaining} Days</span>
                        </div>
                        <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase mono block">Refresh Token Expiry</span>
                          <span className="text-xs font-bold text-foreground mono">
                            {status.hasRefreshToken && status.refreshTokenDaysRemaining !== null
                              ? `${status.refreshTokenDaysRemaining} Days`
                              : status.hasRefreshToken
                              ? "ACTIVE (365 Days)"
                              : "NOT ISSUED"}
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl border border-white/10 bg-black/30">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase mono block">Auto-Refresh Mechanism</span>
                        <span className="text-xs font-bold text-primary mono">
                          {status.autoRefreshMechanism || (status.hasRefreshToken ? "AUTOMATIC (REQUEST-TIME)" : "MANUAL RE-AUTH (EVERY 60 DAYS)")}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <AlertTriangle size={32} className="mx-auto text-amber-400 mb-3 opacity-80" />
                      <p className="text-sm font-semibold text-foreground">No Active Personal LinkedIn Token</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                        Authorize your personal LinkedIn member profile to enable single-click publishing directly to your feed.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-white/10">
                  <button
                    onClick={handleConnect}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-[#61c5ad]/40 px-6 py-3.5 text-xs font-bold tracking-[.15em] text-[#61c5ad] uppercase transition-all duration-300 hover:text-white hover:border-transparent shadow-[0_0_20px_rgba(97,197,173,0.15)] glass-sm"
                    style={{
                      background: "linear-gradient(135deg, rgba(97,197,173,0.12) 0%, rgba(66,111,186,0.12) 50%, rgba(152,79,159,0.12) 100%)",
                    }}
                  >
                    <ExternalLink size={14} />
                    {status?.connected ? "RECONNECT LINKEDIN ACCOUNT" : "CONNECT LINKEDIN ACCOUNT"}
                  </button>
                </div>
              </div>

              {/* Test Post Publisher & History */}
              <div className="md:col-span-7 space-y-8">
                {/* Test Post Publisher */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 glass">
                  <div className="border-b border-white/10 pb-4 mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono">Manual Test Post Publisher</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Publish ONE manual post directly to your personal LinkedIn profile feed (`w_member_social`).</p>
                  </div>

                  <form onSubmit={handlePublishTestPost} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mono block mb-1.5">
                        Post Commentary Text *
                      </label>
                      <textarea
                        rows={4}
                        value={commentary}
                        onChange={(e) => setCommentary(e.target.value)}
                        placeholder="Type commentary text to share on your personal LinkedIn feed..."
                        className="w-full rounded-xl border border-white/10 bg-background/80 p-3.5 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none glass-sm font-medium leading-relaxed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mono block mb-1.5">
                        Attached Article Link (Optional)
                      </label>
                      <input
                        type="url"
                        autoComplete="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://www.rvan.me/news/..."
                        className="w-full rounded-xl border border-white/10 bg-background/80 p-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none glass-sm font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={publishing || !status?.connected}
                        className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-xs font-bold tracking-[.15em] text-white uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 mono shadow-[0_0_20px_rgba(97,197,173,0.25)]"
                        style={{
                          background: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
                        }}
                      >
                        {publishing ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                            PUBLISHING TO LINKEDIN...
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            PUBLISH TEST POST TO PERSONAL FEED
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {publishResult && (
                    <div className="mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs space-y-2 glass">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <CheckCircle2 size={16} /> {publishResult.message || "Successfully published!"}
                      </div>
                      <div className="font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 space-y-1">
                        <p><strong>Post ID:</strong> {publishResult.postId}</p>
                        <p><strong>Author Member URN:</strong> {publishResult.authorUrn}</p>
                        <p><strong>Timestamp:</strong> {publishResult.publishedAt}</p>
                      </div>
                    </div>
                  )}

                  {publishError && (
                    <div className="mt-6 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs space-y-2 glass">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle size={16} /> Publication Failed
                      </div>
                      <p className="font-mono text-[11px] bg-black/40 p-2.5 rounded-lg border border-white/5 break-all">
                        {publishError}
                      </p>
                    </div>
                  )}
                </div>

                {/* Published History Log */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 glass">
                  <div className="border-b border-white/10 pb-4 mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono flex items-center gap-2">
                        <History size={16} /> Published Story History
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">Stories published to LinkedIn to prevent duplicates.</p>
                    </div>
                  </div>

                  {status?.historyList && status.historyList.length > 0 ? (
                    <div className="space-y-3">
                      {status.historyList.map((item) => (
                        <div key={item._id} className="p-3.5 rounded-xl border border-white/10 bg-black/30 text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span className="truncate max-w-md">{item.headline}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{new Date(item.publishedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                            <span className="text-primary/80">ID: {item.postId}</span>
                            {item.sourceUrl && (
                              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                Source <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-muted-foreground mono">
                      No publication history recorded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>
          )}
          </>
        )}
      </div>

      <Footer siteSettings={null} />
    </main>
  );
}
