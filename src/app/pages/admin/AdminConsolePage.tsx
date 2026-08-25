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

type AdminTab = "overview" | "editorial" | "submissions" | "site" | "analytics";

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
    if (path.includes("/editorial") || path.includes("/articles")) return "editorial";
    if (path.includes("/submissions")) return "submissions";
    if (path.includes("/site")) return "site";
    if (path.includes("/analytics")) return "analytics";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Data States
  const [publishedBlogs, setPublishedBlogs] = useState<BlogPost[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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
      const blogs = await fetchAllBlogs(language);
      setPublishedBlogs(blogs || []);
    } catch (err) {
      console.error("[AdminConsole] Error loading published articles from Sanity:", err);
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

  // Derive real statistics
  const categoriesList = Array.from(new Set(publishedBlogs.map((b) => b.category).filter(Boolean)));
  const authorsList = Array.from(new Set(publishedBlogs.map((b) => b.authorName).filter(Boolean)));

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
                  <span>{isAz ? "SAYT İDARƏETMƏ MƏRKƏZİ" : "PLATFORM CONTROL CENTER"}</span>
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  UID: {user?.uid.slice(0, 10)}...
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isAz ? "Rvan.me İdarəetmə Paneli" : "Rvan.me Admin Console"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={loadAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw size={14} className={loadingData ? "animate-spin text-primary" : ""} />
                <span>{loadingData ? (isAz ? "Yenilənir..." : "Refreshing...") : (isAz ? "Yenilə" : "Refresh")}</span>
              </button>
              <Link
                to={getLocalizedPath("/write")}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-2xs"
              >
                <span>{isAz ? "Məqalə Təqdimat Portalı" : "Share Your Ideas Form"}</span>
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
              onClick={() => switchTab("editorial")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === "editorial"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>{isAz ? "Redaksiya & Məqalələr" : "Editorial & Content"} ({publishedBlogs.length})</span>
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
              <span>{isAz ? "E-poçt Qəbulu" : "Submissions Intake"}</span>
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
        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Real Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "DƏRC EDİLMİŞ MƏQALƏLƏR" : "PUBLISHED ARTICLES"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{publishedBlogs.length}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Sanity CMS üzərindən" : "Live from Sanity CMS"}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "MÜƏLLİFLƏR" : "TOTAL AUTHORS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{authorsList.length || 1}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Aktiv dərc olunmuş müəlliflər" : "Active published authors"}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "KATEQORİYALAR" : "CATEGORIES"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">{categoriesList.length || 5}</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "Dizayn, Marketinq, AI və s." : "Design, Marketing, AI, etc."}</p>
              </div>

              <div className="p-5 rounded-3xl border border-border bg-card space-y-1">
                <span className="text-[10px] font-bold font-mono text-muted-foreground uppercase tracking-wider">
                  {isAz ? "İNDEKSLƏNƏN SƏHİFƏLƏR" : "SITEMAP URLS"}
                </span>
                <div className="text-3xl font-extrabold text-foreground">699</div>
                <p className="text-[11px] text-muted-foreground">{isAz ? "SEO Sitemap & 4207 statik marşrut" : "Authoritative sitemap.xml"}</p>
              </div>
            </div>

            {/* Platform Model Explainer */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? "Sadələşdirilmiş Redaksiya Modeli Aktivdir" : "Streamlined Editorial Intake Active"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                    {isAz
                      ? "Rvan.me ictimai məqalə qəbulu serverless Resend API vasitəsilə birbaşa redaksiya e-poçtunuza çatdırılır. Bəyənilən məqalələr Sanity CMS-də yaradılır və dərhal saytda yayımlanır."
                      : "Public article submissions are delivered directly to the editorial Gmail inbox via serverless Resend API with binary attachments. Accepted articles are created in Sanity CMS and published instantly."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-mono text-muted-foreground uppercase tracking-wider">
                {isAz ? "SÜRƏTLİ KEÇİDLƏR" : "QUICK ACTIONS"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                  href="https://www.sanity.io/manage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <BookOpen size={15} className="text-primary" /> {isAz ? "Sanity Studio CMS" : "Sanity CMS Studio"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Məqalə yarat və redaktə et" : "Manage content & publishing"}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </a>

                <Link
                  to={getLocalizedPath("/")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Globe size={15} className="text-primary" /> {isAz ? "Sayta Bax (Canlı)" : "View Live Website"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Əsas səhifəni aç" : "Open homepage"}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                <Link
                  to={getLocalizedPath("/write")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <PenTool size={15} className="text-primary" /> {isAz ? "Fikrinizi Paylaşın" : "Share Your Ideas Portal"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "İctimai məqalə təqdimat forması" : "Public /write submission portal"}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                <Link
                  to={getLocalizedPath("/contact")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Mail size={15} className="text-primary" /> {isAz ? "Əlaqə Səhifəsi" : "Contact Page"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Ümumi sorğu forması" : "Public general inquiries"}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>

                <Link
                  to={getLocalizedPath("/about/ravan-mammadov")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Users size={15} className="text-primary" /> {isAz ? "Təsisçi Səhifəsi" : "Founder Profile"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Ravan Mammadov SEO səhifəsi" : "Personal brand & SEO authority"}</p>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: EDITORIAL ── */}
        {activeTab === "editorial" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl border border-border bg-card">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Sanity CMS Redaksiya İdarəetməsi" : "Sanity CMS Editorial Hub"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "Məqalələr Sanity CMS vasitəsilə idarə olunur və dərc edilir."
                    : "Published articles are managed and published directly in Sanity CMS Studio."}
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

            {/* Published Articles List */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-mono text-foreground uppercase">
                  {isAz ? "DƏRC EDİLMİŞ MƏQALƏLƏR" : "LIVE PUBLISHED ARTICLES"} ({publishedBlogs.length})
                </h4>
              </div>

              {publishedBlogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  {isAz ? "Dərc edilmiş məqalə tapılmadı." : "No published articles found."}
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {publishedBlogs.map((art) => (
                    <div
                      key={art._id}
                      className="p-4 rounded-2xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-emerald-500 uppercase">● Live</span>
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
                          className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold text-foreground transition-colors flex items-center gap-1.5"
                        >
                          <span>{isAz ? "Bloqda Oxu" : "View Live Post"}</span>
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

        {/* ── TAB 3: SUBMISSIONS INTAKE ── */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  <Mail size={13} />
                  <span>{isAz ? "E-POÇT ƏSASLI TƏQDİMAT SİSTEMİ" : "EMAIL-BASED INTAKE PIPELINE"}</span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {isAz ? "Məqalə Təqdimatları Birbaşa E-poçtunuza Çatdırılır" : "Article Submissions are Delivered Directly by Email"}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {isAz
                    ? "Ziyarətçilər /write və /az/write səhifələrindən məqalə təqdim etdikdə, bütün məlumatlar və şəkillər (qapaq və müəllif avatarı) serverless Resend servisi vasitəsilə birbaşa redaksiya e-poçtunuza (mammadovravan1@gmail.com) göndərilir. Bəyəndiyiniz məqalələri Sanity CMS-ə daxil edərək bir kliklə yayımlaya bilərsiniz."
                    : "When visitors submit articles through /write or /az/write, the complete payload including cover image and author portrait attachments is delivered directly to your administrative Gmail inbox (mammadovravan1@gmail.com) via Resend. Accepted articles are manually input into Sanity CMS for publishing."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                <a
                  href="https://mail.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Mail size={15} className="text-primary" /> {isAz ? "Gmail Poçt Qutusu" : "Editorial Gmail Inbox"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Daxil olan təqdimatları oxu" : "Review incoming submissions"}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                    <span>{isAz ? "Gmail-i Aç" : "Open Gmail"}</span>
                    <ExternalLink size={12} />
                  </div>
                </a>

                <Link
                  to={getLocalizedPath("/write")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <PenTool size={15} className="text-primary" /> {isAz ? "İctimai Təqdimat Forması" : "Public /write Form"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Ziyarətçi təqdimat portalı" : "Live submission intake page"}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                    <span>{isAz ? "Formanı Aç" : "Open Form"}</span>
                    <ExternalLink size={12} />
                  </div>
                </Link>

                <Link
                  to={getLocalizedPath("/contact")}
                  target="_blank"
                  className="p-5 rounded-2xl border border-border bg-muted/20 hover:border-primary/40 transition-colors flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Mail size={15} className="text-primary" /> {isAz ? "Əlaqə Forması" : "Contact Form"}
                    </span>
                    <p className="text-[11px] text-muted-foreground">{isAz ? "Ümumi müraciət forması" : "General visitor inquiry form"}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                    <span>{isAz ? "Əlaqəni Aç" : "Open Contact"}</span>
                    <ExternalLink size={12} />
                  </div>
                </Link>
              </div>
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
                <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "STATİK GENERASİYA" : "STATIC PAGES"}</span>
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

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
