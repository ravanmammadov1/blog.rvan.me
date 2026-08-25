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
} from "lucide-react";
import SEO from "../../components/SEO";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import {
  getAllSubmittedArticles,
  ContributorArticleDraft,
} from "../../../services/contributorService";
import { SiteSettings } from "../../../types/cms";
import { fetchSiteSettings } from "../../../lib/sanityQueries";

type AdminTab = "overview" | "articles";

export default function AdminConsolePage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t, getLocalizedPath, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const isAz = language === "az";

  // Determine active tab from URL pathname
  const getTabFromPath = (): AdminTab => {
    const path = location.pathname.replace(/^\/az/, "");
    if (path.includes("/articles")) return "articles";
    return "overview";
  };

  const [activeTab, setActiveTab] = useState<AdminTab>(getTabFromPath());
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  // Data States
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
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
      const arts = await getAllSubmittedArticles();
      setArticles(arts);
    } catch (err) {
      console.error("[AdminConsole] Error loading published articles:", err);
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
                  <span>{isAz ? "SAYT İDARƏETMƏSİ" : "SITE ADMINISTRATION"}</span>
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
                <span>{isAz ? "Məqalə Təqdimat Səhifəsi" : "Public Submission Form"}</span>
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
              onClick={() => switchTab("articles")}
              className={`pb-3 px-4 text-xs font-bold tracking-wider uppercase transition-colors border-b-2 flex items-center gap-2 shrink-0 ${
                activeTab === "articles"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen size={14} />
              <span>{isAz ? "Nəşr Olunmuş Məqalələr" : "Published Articles"} ({articles.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Body */}
      <section className="px-4 py-8 sm:px-6 md:px-8 max-w-[1280px] mx-auto space-y-8">
        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* System Status Banner */}
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-card p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                  <Sparkles size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? "Email Əsaslı Redaksiya Qəbulu Aktivdir" : "Email-Based Editorial Intake Active"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
                    {isAz
                      ? "/write səhifəsi vasitəsilə göndərilən bütün məqalələr birbaşa server tərəfli Resend servisi vasitəsilə redaksiya e-poçtunuza çatdırılır. Bəyənilən məqalələri birbaşa Sanity Studio-da yaradıb dərc edə bilərsiniz."
                      : "All submissions from the public /write form are securely delivered directly to your editorial email inbox via serverless API. Accepted articles are manually created and published in Sanity CMS."}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links / Resources */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "Məzmun İdarəetməsi" : "Editorial CMS"}</span>
                  <BookOpen size={16} className="text-muted-foreground" />
                </div>
                <h4 className="text-base font-bold text-foreground">Sanity Studio</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Məqalələri, müəllifləri və kateqoriyaları Sanity CMS vasitəsilə idarə edin."
                    : "Manage published articles, authors, categories, and media assets in Sanity."}
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.sanity.io/manage"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{isAz ? "Sanity Panelinə Keç" : "Open Sanity Studio"}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "İctimai Forma" : "Public Intake"}</span>
                  <PenTool size={16} className="text-muted-foreground" />
                </div>
                <h4 className="text-base font-bold text-foreground">{isAz ? "Məqalə Təqdimatı" : "Article Submission"}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Ziyarətçilər üçün ictimai /write və /az/write məqalə qəbul səhifəsi."
                    : "Live public /write editorial submission portal for visitors."}
                </p>
                <div className="pt-2">
                  <Link
                    to={getLocalizedPath("/write")}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{isAz ? "Səhifəyə Bax" : "View Form"}</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary uppercase">{isAz ? "Nəşr Arxivi" : "Published Content"}</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <h4 className="text-base font-bold text-foreground">{articles.length} {isAz ? "Məqalə" : "Articles"}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isAz
                    ? "Rvan.me portalında aktiv yayımlanan bloq və müəllif yazıları."
                    : "Total articles currently published on Rvan.me."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => switchTab("articles")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>{isAz ? "Arxivə Bax" : "View Published Articles"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: PUBLISHED ARTICLES ── */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">
                  {isAz ? "Dərc Edilmiş Məqalələr" : "Published Articles"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isAz
                    ? "Rvan.me bloqunda yayımlanan müəllif məqalələri."
                    : "Articles currently live on the public blog."}
                </p>
              </div>

              {articles.length === 0 ? (
                <div className="py-12 text-center text-xs text-muted-foreground">
                  {isAz ? "Dərc edilmiş məqalə tapılmadı." : "No published articles found."}
                </div>
              ) : (
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
              )}
            </div>
          </div>
        )}
      </section>

      <Footer siteSettings={siteSettings} />
    </main>
  );
}
