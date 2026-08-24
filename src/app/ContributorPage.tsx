import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  UserCheck,
  Compass,
  Users,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  FileEdit,
  Globe,
  PenTool,
  Send,
  BarChart3,
  FileText,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Share2,
  Lock,
  Plus,
  RefreshCw,
  Edit3,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import SEO from "./components/SEO";
import { Eyebrow } from "./components/Eyebrow";
import { Button } from "./components/ui/Button";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "./components/AuthModal";
import ArticleSubmissionModal from "./components/contributor/ArticleSubmissionModal";
import ContributorApplicationWizard from "./components/contributor/ContributorApplicationWizard";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { CONTRIBUTORS_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";
import {
  getContributorStatus,
  getContributorApplication,
  getSubmissionsByAuthor,
  getContributorAggregatedAnalytics,
  updateArticleSubmission,
} from "../services/contributorService";
import {
  ContributorApplication,
  ArticleSubmission,
  ContributorStatus,
  SubmissionStatus,
} from "../types/contributor";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

type DashboardTab = "overview" | "articles" | "insights" | "apply";

export default function ContributorPage() {
  const { language, getLocalizedPath } = useLanguage();
  const { user, userPhoto } = useAuth();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);

  // Contributor state
  const [contributorStatus, setContributorStatus] = useState<ContributorStatus>("NONE");
  const [application, setApplication] = useState<ContributorApplication | null>(null);
  const [submissions, setSubmissions] = useState<ArticleSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [showApplyWizard, setShowApplyWizard] = useState(false);

  // Selected article for feedback viewing / editing
  const [selectedSubmission, setSelectedSubmission] = useState<ArticleSubmission | null>(null);

  useEffect(() => {
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

  const loadContributorData = () => {
    if (user?.uid) {
      const status = getContributorStatus(user.uid);
      const app = getContributorApplication(user.uid);
      const subs = getSubmissionsByAuthor(user.uid);

      setContributorStatus(status);
      setApplication(app);
      setSubmissions(subs);
    } else {
      setContributorStatus("NONE");
      setApplication(null);
      setSubmissions([]);
    }
  };

  useEffect(() => {
    loadContributorData();
  }, [user?.uid]);

  const isContributor = contributorStatus !== "NONE";

  const analytics = user?.uid ? getContributorAggregatedAnalytics(user.uid) : null;

  const handleApplicationSuccess = (newApp: ContributorApplication) => {
    setApplication(newApp);
    setContributorStatus("APPROVED");
    setShowApplyWizard(false);
    setActiveTab("overview");
    loadContributorData();
  };

  const handleStartContribution = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else if (!isContributor) {
      setShowApplyWizard(true);
    } else {
      setSubmitModalOpen(true);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter === "ALL") return true;
    return s.status === statusFilter;
  });

  const benefits = [
    {
      icon: UserCheck,
      title: isAz ? "Profilinizi Qurun" : "Build Your Profile",
      desc: isAz
        ? "Rvan.me-də öz şəxsi müəllif səhifənizi yaradın, bioqrafiyanızı və portfolionuzu nümayiş etdirin."
        : "Create your own dedicated author page on Rvan.me, showcasing your bio, links, and portfolio.",
    },
    {
      icon: PenTool,
      title: isAz ? "Öz Adınızla Nəşr Olunun" : "Publish Under Your Name",
      desc: isAz
        ? "Fikirləriniz, təcrübəniz və kreativ bilikləriniz birbaşa sizin adınız və kimliyiniz altında yayımlanır."
        : "Your insights, expertise, and ideas are permanently credited to your name and verified profile.",
    },
    {
      icon: Compass,
      title: isAz ? "Kəşf Olunun" : "Get Discovered",
      desc: isAz
        ? "Məqalələriniz Rvan.me oxucuları, axtarış sistemləri və sosial paylaşımlar vasitəsilə yeni auditoriyalara çatır."
        : "Your articles reach new audiences through Rvan.me, search engines, and organic social sharing.",
    },
    {
      icon: Users,
      title: isAz ? "İcmaya Qoşulun" : "Join the Community",
      desc: isAz
        ? "Azərbaycanın inkişaf edən dizayner, marketoloq və texnologiya peşəkarları icmasının bir hissəsi olun."
        : "Become part of Azerbaijan's growing community of designers, marketers, and creative technologists.",
    },
    {
      icon: Sparkles,
      title: isAz ? "Redaksiya Seçimi" : "Editorial Recognition",
      desc: isAz
        ? "Yüksək keyfiyyətli analitik məqalələr və müəlliflər Rvan.me-nin əsas səhifəsində xüsusi olaraq vurğulanır."
        : "Standout analytical pieces and distinguished writers are featured across Rvan.me publications.",
    },
    {
      icon: ShieldCheck,
      title: isAz ? "Təmiz və Şərtsiz Məkan" : "Zero Noise, Pure Knowledge",
      desc: isAz
        ? "Heç bir reklam səs-küyü və spam olmadan yalnız real peşəkar dəyər yaradan bilik mühiti."
        : "A distraction-free, high-standard editorial environment focused entirely on craft and substance.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={isAz ? "Müəllif Kabineti və İcma — Rvan.me" : "Contributor Dashboard & Community — Rvan.me"}
        description={
          isAz
            ? "Rvan.me müəllif kabineti: məqalələrinizi idarə edin, redaksiya statusunu izləyin və real oxucu analitikasını görün."
            : "Rvan.me Contributor Workspace: manage your drafts, track editorial reviews, and view real article insights."
        }
        url="https://www.rvan.me/contributor"
      />

      <SiteHeader siteSettings={siteSettings} />

      <main className="relative z-10 pt-10 pb-20 md:pt-14 md:pb-28">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 md:px-8">
          {/* SCENARIO A: Authenticated user applying to become contributor */}
          {user && showApplyWizard && !isContributor && (
            <div className="py-6">
              <ContributorApplicationWizard
                onSuccess={handleApplicationSuccess}
                onCancel={() => setShowApplyWizard(false)}
              />
            </div>
          )}

          {/* SCENARIO B: ACTIVE CONTRIBUTOR DASHBOARD / CABINET */}
          {user && isContributor && !showApplyWizard && (
            <div className="space-y-10">
              {/* Dashboard Header Bar */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  {application?.photoURL || userPhoto ? (
                    <img
                      src={application?.photoURL || userPhoto || ""}
                      alt={application?.displayName || user.displayName || "Author"}
                      className="h-16 w-16 rounded-2xl object-cover border border-border bg-surface shrink-0 shadow-sm"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center text-xl shrink-0">
                      {user.displayName?.charAt(0) || "C"}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                        {application?.displayName || user.displayName}
                      </h1>
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary">
                        {contributorStatus === "VERIFIED" ? (isAz ? "TƏSDİQLƏNMİŞ MÜƏLLİF" : "VERIFIED AUTHOR") : (isAz ? "MÜƏLLİF" : "CONTRIBUTOR")}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground font-medium">
                      {application?.roleTitle || "Creative Contributor"}
                      {application?.location ? ` · ${application.location}` : ""}
                    </p>

                    {application?.slug && (
                      <Link
                        to={getLocalizedPath(`/author/${application.slug}`)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline pt-0.5"
                      >
                        <span>{isAz ? "İctimai Müəllif Səhifəniz" : "View Public Author Profile"}</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Top Action Button */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSubmitModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-primary/10"
                  >
                    <Plus size={14} />
                    <span>{isAz ? "YENİ MƏQALƏ" : "NEW ARTICLE"}</span>
                  </button>
                </div>
              </motion.div>

              {/* Dashboard Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto">
                {[
                  { id: "overview", labelAz: "Ümumi Baxış", labelEn: "Overview", icon: Compass },
                  { id: "articles", labelAz: "Məqalələrim", labelEn: "My Articles", icon: FileText, count: submissions.length },
                  { id: "insights", labelAz: "Oxucu Analitikası", labelEn: "Article Insights", icon: BarChart3 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold mono uppercase transition-all cursor-pointer ${
                        isActive
                          ? "bg-muted text-foreground border border-border"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={14} className={isActive ? "text-primary" : ""} />
                      <span>{isAz ? tab.labelAz : tab.labelEn}</span>
                      {tab.count !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border text-muted-foreground">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-8">
                  {/* Metric Summary Cards (Real metrics only, zero fake statistics) */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                        {isAz ? "NƏŞR OLUNAN MƏQALƏLƏR" : "PUBLISHED ARTICLES"}
                      </div>
                      <div className="text-3xl font-extrabold text-foreground">
                        {analytics?.publishedCount || 0}
                      </div>
                      <div className="text-[11px] text-muted-foreground mono">
                        {analytics?.totalSubmissions || 0} {isAz ? "ümumi təqdimat" : "total submissions"}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                        {isAz ? "REDAKSİYA BAXIŞINDA" : "UNDER REVIEW"}
                      </div>
                      <div className="text-3xl font-extrabold text-primary">
                        {analytics?.underReviewCount || 0}
                      </div>
                      <div className="text-[11px] text-muted-foreground mono">
                        {analytics?.changesRequestedCount || 0} {isAz ? "düzəliş tələb olunan" : "changes requested"}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                        {isAz ? "REAL BAXIŞ SAYI" : "REAL ARTICLE VIEWS"}
                      </div>
                      <div className="text-3xl font-extrabold text-foreground">
                        {analytics?.totalViews || 0}
                      </div>
                      <div className="text-[11px] text-muted-foreground mono">
                        {isAz ? "Canlı oxucu baxışları" : "Tracked live impressions"}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-border bg-card space-y-2 shadow-sm">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mono">
                        {isAz ? "ŞƏRHLƏR VƏ PAYLAŞIMLAR" : "COMMENTS & SHARES"}
                      </div>
                      <div className="text-3xl font-extrabold text-foreground">
                        {(analytics?.totalComments || 0) + (analytics?.totalShares || 0)}
                      </div>
                      <div className="text-[11px] text-muted-foreground mono">
                        {analytics?.totalComments || 0} {isAz ? "şərh" : "comments"} · {analytics?.totalShares || 0} {isAz ? "paylaşım" : "shares"}
                      </div>
                    </div>
                  </div>

                  {/* Editorial Guidance & Welcome */}
                  <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-primary mono uppercase">
                      <Sparkles size={14} />
                      <span>{isAz ? "Redaksiya Bələdçisi" : "Editorial Guidance"}</span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {isAz ? "Rvan.me-də Məqalənizi Necə Uğurla Nəşr Etmək Olar?" : "How to Publish Successfully on Rvan.me"}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isAz
                        ? "Rvan.me orijinal ideyaları, dərin kommersiya təcrübələrini və dizayn sənətkarlığını qiymətləndirir. Süni intellektdən araşdırma və qrammatika üçün istifadə edə bilərsiniz, lakin hər bir yazı sizin şəxsi baxış bucağınızı əks etdirməlidir. Təqdim etdiyiniz hər bir yazı 24-48 saat ərzində redaksiya heyəti tərəfindən yoxlanılır."
                        : "Rvan.me values authentic analysis, real project experiences, and thoughtful design craft. AI assistance is allowed for research and editing, but original perspectives are required. Submissions are reviewed within 24-48 hours."}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: MY ARTICLES */}
              {activeTab === "articles" && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
                  {/* Status Filters */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {["ALL", "SUBMITTED", "UNDER_REVIEW", "CHANGES_REQUESTED", "PUBLISHED"].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold mono uppercase transition-all cursor-pointer ${
                          statusFilter === st
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {st === "ALL"
                          ? (isAz ? "HAMISI" : "ALL")
                          : st === "SUBMITTED"
                          ? (isAz ? "GÖNDƏRİLƏNLƏR" : "SUBMITTED")
                          : st === "UNDER_REVIEW"
                          ? (isAz ? "BAXIŞDA" : "UNDER REVIEW")
                          : st === "CHANGES_REQUESTED"
                          ? (isAz ? "DÜZƏLİŞ TƏLƏBİ" : "CHANGES REQUESTED")
                          : (isAz ? "NƏŞR OLUNANLAR" : "PUBLISHED")}
                      </button>
                    ))}
                  </div>

                  {filteredSubmissions.length > 0 ? (
                    <div className="space-y-4">
                      {filteredSubmissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5">
                                <h4 className="text-base font-bold text-foreground">{sub.title}</h4>
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                                  {sub.category}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{sub.excerpt}</p>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              <span
                                className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${
                                  sub.status === "PUBLISHED"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : sub.status === "APPROVED"
                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    : sub.status === "CHANGES_REQUESTED"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : "bg-primary/10 text-primary border-primary/20"
                                }`}
                              >
                                {sub.status}
                              </span>
                            </div>
                          </div>

                          {/* Editorial Feedback alert if changes requested */}
                          {sub.editorialFeedback && (
                            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-amber-600 dark:text-amber-400 uppercase">
                                <AlertCircle size={13} />
                                <span>{isAz ? "Redaksiya Qeydi / Düzəliş Tələbi:" : "Editorial Note / Changes Requested:"}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {sub.editorialFeedback}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between border-t border-border pt-4 text-xs font-mono text-muted-foreground gap-3">
                            <div className="flex items-center gap-3">
                              <span>Tarix: {new Date(sub.createdAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>AI: {sub.aiDisclosure}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {sub.status === "PUBLISHED" && sub.publishedSlug && (
                                <Link
                                  to={getLocalizedPath(`/blog/${sub.publishedSlug}`)}
                                  className="inline-flex items-center gap-1 text-primary font-bold hover:underline"
                                >
                                  <span>{isAz ? "Məqaləni Oxu" : "View Live"}</span>
                                  <ArrowUpRight size={13} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 rounded-2xl border border-border bg-card text-center space-y-4">
                      <FileText size={32} className="mx-auto text-muted-foreground/60" />
                      <h4 className="text-base font-bold text-foreground">
                        {isAz ? "Bu filtr üzrə məqalə tapılmadı" : "No articles found in this filter"}
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        {isAz
                          ? "İlk məqalə qaralamanızı yaratmaq üçün yuxarıdakı «Yeni Məqalə» düyməsinə klikləyin."
                          : "Click 'New Article' above to draft your first submission."}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: ARTICLE INSIGHTS */}
              {activeTab === "insights" && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-8">
                  <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card space-y-6 shadow-sm">
                    <div className="flex items-center justify-between pb-4 border-b border-border">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">
                          {isAz ? "Son 14 Günlük Oxucu Baxışları" : "14-Day View History"}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isAz ? "Yalnız sizin məqalələrinizə aid olan real baxış qeydləri." : "Real verified pageview timeline for your publications."}
                        </p>
                      </div>
                      <BarChart3 size={18} className="text-primary" />
                    </div>

                    {/* Simple, lightweight CSS Bar Chart */}
                    {analytics?.dailyViews && analytics.dailyViews.length > 0 ? (
                      <div className="space-y-3">
                        <div className="h-40 flex items-end gap-2 pt-8">
                          {analytics.dailyViews.map((d) => {
                            const maxViews = Math.max(...analytics.dailyViews.map((v) => v.views), 1);
                            const heightPct = Math.max(12, (d.views / maxViews) * 100);
                            return (
                              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                <span className="text-[9px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  {d.views}
                                </span>
                                <div
                                  style={{ height: `${heightPct}%` }}
                                  className="w-full rounded-t-md bg-primary/80 group-hover:bg-primary transition-colors"
                                />
                                <span className="text-[8px] font-mono text-muted-foreground truncate w-full text-center">
                                  {d.date.split("-").slice(1).join("/")}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 text-center text-xs text-muted-foreground">
                        {isAz
                          ? "Hələlik analitik məlumat qeydə alınmayıb. Məqalələriniz nəşr olunduqdan sonra burada real baxış statistikası göstəriləcək."
                          : "No analytics recorded yet. Once your articles are published and read, real data will appear here."}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* SCENARIO C: UN-AUTHENTICATED OR NON-APPLICANT VISITOR (Public Contributor Landing Page) */}
          {(!user || (!isContributor && !showApplyWizard)) && (
            <div className="space-y-20">
              {/* Hero Section */}
              <section className="max-w-4xl space-y-6">
                <Eyebrow className="text-primary tracking-[.2em]">
                  {isAz ? "AZƏRBAYCANIN KREATIV İCMASI VƏ NƏŞRİ" : "COMMUNITY & PERSPECTIVES"}
                </Eyebrow>

                <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl text-foreground leading-[1.08]">
                  {isAz ? "Fikirləriniz görülməyə layiqdir." : "Your ideas deserve to be seen."}
                </h1>

                <p className="text-lg md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-3xl">
                  {isAz
                    ? "Bildiklərinizi paylaşın. Peşəkar kimliyinizi qurun. Öz adınız və profilinizlə nəşr olun."
                    : "Share what you know. Build your professional identity. Get published under your name."}
                </p>

                {/* Authentic Value Box */}
                <div className="p-6 rounded-2xl border border-primary/25 bg-primary/5 max-w-2xl">
                  <p className="text-sm md:text-base text-foreground leading-relaxed font-medium">
                    {isAz
                      ? "«Peşəkar kimliyinizi qurmaq üçün böyük auditoriyanızın olmasını gözləməyə ehtiyac yoxdur. Sadəcə faydalı, orijinal və ya maraqlı bir ideya ilə başlayın.»"
                      : "“You don’t need an audience to start building your professional identity. Start with an idea.”"}
                  </p>
                </div>

                {/* Hero Trigger */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleStartContribution}
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase mono tracking-wider hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-primary/10"
                  >
                    <Send size={14} />
                    <span>{user ? (isAz ? "MÜƏLLİF PROFİLİNİ QUR" : "SET UP CONTRIBUTOR PROFILE") : (isAz ? "GOOGLE İLƏ DAXİL OL VƏ BAŞLA" : "SIGN IN TO CONTRIBUTE")}</span>
                  </button>

                  <span className="text-xs text-muted-foreground mono">
                    {isAz ? "Dizaynerlər, marketoloqlar və kreativ mütəxəssislər üçün açıqdır" : "Open for designers, marketers, and creative professionals"}
                  </span>
                </div>
              </section>

              {/* Value Pillars */}
              <section className="space-y-8 border-t border-border/60 pt-16">
                <div>
                  <Eyebrow className="text-primary tracking-[.2em]">
                    {isAz ? "REAL ÜSTÜNLÜKLƏR" : "WHY WRITE ON RVAN.ME"}
                  </Eyebrow>
                  <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">
                    {isAz ? "Niyə Rvan.me-də Yazmalısınız?" : "What you get as a contributor"}
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {benefits.map((b) => (
                    <div
                      key={b.title}
                      className="p-8 rounded-2xl border border-border bg-card space-y-4 shadow-sm"
                    >
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                        <b.icon size={20} />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{b.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contextual Contributor FAQ Section */}
              <section className="space-y-8 border-t border-border/60 pt-16">
                <FaqAccordion
                  items={CONTRIBUTORS_FAQS}
                  eyebrow={isAz ? "MÜƏLLİFLİK SUALLARI" : "CONTRIBUTOR FAQ"}
                  title={isAz ? "Yazı və Qəbul Qaydaları" : "Submissions & Review FAQ"}
                  description={
                    isAz
                      ? "Müəlliflik prosesi, dil seçimi, süni intellekt qaydaları və redaksiya meyarları:"
                      : "Clear answers on our contributor criteria, language support, review stages, and AI policy:"
                  }
                  viewAllHref="/faq"
                  viewAllLabel={isAz ? "BÜTÜN SUALLARA BAX (10)" : "VIEW ALL FAQS (10)"}
                  showNumbers={true}
                />
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer siteSettings={siteSettings} />

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ArticleSubmissionModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmitted={loadContributorData}
      />
    </div>
  );
}
