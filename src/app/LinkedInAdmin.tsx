import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, AlertTriangle, RefreshCw, Send, ShieldCheck, UserCheck, ExternalLink } from "lucide-react";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

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
  message?: string;
  error?: string;
}

export default function LinkedInAdmin() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);

  // Manual publishing form state
  const [commentary, setCommentary] = useState("🚀 Testing LinkedIn automation on my personal profile via Rvan.me!");
  const [linkUrl, setLinkUrl] = useState("https://www.rvan.me");
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const urlError = searchParams.get("error");
  const urlConnected = searchParams.get("connected");

  const checkStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/linkedin/status");
      const data = await res.json();
      setStatus(data);
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

  useEffect(() => {
    checkStatus();
  }, []);

  const handleConnect = () => {
    window.location.href = "/api/linkedin/auth";
  };

  const handlePublishTestPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentary.trim()) return;

    setPublishing(true);
    setPublishResult(null);
    setPublishError(null);

    try {
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentary: commentary.trim(),
          linkUrl: linkUrl.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setPublishError(data.error || "Failed to publish test post.");
        if (data.reconnectRequired) {
          checkStatus();
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

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO title="LinkedIn OAuth & Automation Control Panel — Rvan.me" noIndex />
      <SiteHeader siteSettings={null} />

      <div className="mx-auto max-w-5xl px-6 pt-24 pb-28 md:px-10 md:pt-32">
        {/* Header Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase tracking-widest">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">LinkedIn OAuth & Member Publishing</span>
          </div>
          <button
            onClick={checkStatus}
            disabled={loadingStatus}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-all mono glass-sm"
          >
            <RefreshCw size={13} className={loadingStatus ? "animate-spin" : ""} /> Refresh Status
          </button>
        </div>

        {/* Title */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary mono uppercase mb-3">
            <ShieldCheck size={14} /> Official LinkedIn OAuth 2.0 Integration
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Personal Member Publishing.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Securely authenticate your personal LinkedIn profile using OAuth 2.0 (`w_member_social`). Client secrets and access tokens are managed strictly server-side on Vercel.
          </p>
        </div>

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
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mono block">Token Valid For</span>
                      <span className="text-lg font-bold text-emerald-400 mono">{status.daysRemaining} Days</span>
                    </div>
                    <div className="p-3 rounded-xl border border-white/10 bg-white/5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mono block">Auto-Refresh</span>
                      <span className="text-xs font-bold text-foreground mono">{status.hasRefreshToken ? "ENABLED" : "STANDARD"}</span>
                    </div>
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-6 py-3.5 text-xs font-bold tracking-[.15em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] glass-sm"
              >
                <ExternalLink size={14} />
                {status?.connected ? "RECONNECT LINKEDIN ACCOUNT" : "CONNECT LINKEDIN ACCOUNT"}
              </button>
            </div>
          </div>

          {/* Test Post Publisher */}
          <div className="md:col-span-7 rounded-2xl border border-white/10 bg-white/5 p-6 glass">
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
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-xs font-bold tracking-[.15em] text-black uppercase transition-all duration-300 hover:bg-primary/90 disabled:opacity-40 mono shadow-[0_0_20px_rgba(232,253,82,0.2)]"
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
                {!status?.connected && (
                  <p className="text-[11px] text-amber-400 mt-2 font-medium">
                    ⚠️ You must connect your LinkedIn account above before publishing test posts.
                  </p>
                )}
              </div>
            </form>

            {/* Publishing Results */}
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
        </div>
      </div>

      <Footer siteSettings={null} />
    </main>
  );
}
