import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  PenTool,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  AlertCircle,
  Plus,
  Send,
  Save,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import {
  getContributorProfile,
  getContributorArticles,
  getContributorDashboardStats,
  saveContributorArticle,
  saveContributorProfile,
  createDefaultContributorProfile,
  slugifyAuthorName,
  ContributorProfile,
  ContributorArticleDraft,
  ContributorDashboardStats,
} from "../../services/contributorService";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import AuthModal from "../components/AuthModal";
import { Button } from "../components/ui/Button";

export default function ContributorDashboardPage() {
  const { user } = useAuth();
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [profile, setProfile] = useState<ContributorProfile | null>(null);
  const [articles, setArticles] = useState<ContributorArticleDraft[]>([]);
  const [stats, setStats] = useState<ContributorDashboardStats>({
    draftsCount: 0,
    submittedCount: 0,
    underReviewCount: 0,
    changesRequestedCount: 0,
    publishedCount: 0,
    totalViews: 0,
    totalComments: 0,
    profileCompleteness: 0,
  });
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // New Draft Modal
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Partial<ContributorArticleDraft>>({
    title: "",
    category: "Design",
    language: isAz ? "az" : "en",
    excerpt: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    if (user) {
      Promise.all([
        getContributorProfile(user.uid),
        getContributorArticles(user.uid),
      ])
        .then(([prof, arts]) => {
          const resolvedProf = prof || createDefaultContributorProfile(user.uid, user.displayName, user.email, user.photoURL);
          setProfile(resolvedProf);
          setArticles(arts);
          getContributorDashboardStats(user.uid, resolvedProf).then((s) => setStats(s));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, language]);

  const handleSaveArticle = async (status: "draft" | "submitted") => {
    if (!user || !editingDraft.title?.trim()) {
      alert(isAz ? "Zəhmət olmasa məqalənin başlığını daxil edin." : "Please provide an article title.");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await saveContributorArticle({
        ...editingDraft,
        authorUid: user.uid,
        authorName: user.displayName || profile?.name || "Contributor",
        title: editingDraft.title || "",
        status,
      });

      setArticles((prev) => [saved, ...prev.filter((a) => a.id !== saved.id)]);
      setSaveSuccessMsg(
        status === "submitted"
          ? (isAz ? "Məqalə redaksiya baxışına təqdim edildi!" : "Article submitted for editorial review!")
          : (isAz ? "Qaralama yadda saxlanıldı." : "Draft saved successfully.")
      );

      setTimeout(() => {
        setSaveSuccessMsg("");
        setEditorOpen(false);
        setEditingDraft({
          title: "",
          category: "Design",
          language: isAz ? "az" : "en",
          excerpt: "",
          content: "",
        });
      }, 1500);

      // Refresh stats
      if (profile) {
        getContributorDashboardStats(user.uid, profile).then((s) => setStats(s));
      }
    } catch (err) {
      console.error("Error saving draft:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${isAz ? "Kontributor İdarəetmə Paneli" : "Contributor Dashboard"} — Rvan.me`}
        description={isAz ? "Müəllif idarəetmə paneli, qaralamalar və analitika." : "Editorial contributor dashboard, article writing, and publishing analytics."}
        url="https://www.rvan.me/contributor/dashboard"
      />

      <SiteHeader siteSettings={siteSettings} />

      <section className="px-6 pt-28 pb-20 md:px-10 md:pt-36">
        <div className="mx-auto max-w-[1400px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[#DDE1E0] dark:border-white/10 pb-8 mb-10">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase flex items-center gap-2">
                <PenTool size={14} /> {isAz ? "KONTRIBUTOR VƏ REDAKSİYA MƏRKƏZİ" : "CONTRIBUTOR & EDITORIAL HUB"}
              </span>
              <h1 className="mt-2 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {isAz ? "Müəllif İdarəetmə Paneli" : "Contributor Dashboard"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground font-medium">
                {isAz
                  ? "Məqalə yazın, qaralamaları idarə edin və dərc olunma statusunu izləyin."
                  : "Draft new essays, submit for editorial review, and track publication status."}
              </p>
            </div>

            {user ? (
              <Button
                onClick={() => setEditorOpen(true)}
                variant="primary"
                size="md"
                icon={<Plus size={16} />}
                iconPosition="left"
              >
                {isAz ? "YENİ MƏQALƏ YAZ" : "WRITE NEW ESSAY"}
              </Button>
            ) : (
              <Button
                onClick={() => setAuthModalOpen(true)}
                variant="primary"
                size="md"
              >
                {isAz ? "DAXİL OLUN" : "SIGN IN TO WRITE"}
              </Button>
            )}
          </div>

          {!user ? (
            <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-2xl">
              <ShieldCheck size={36} className="mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold text-foreground">
                {isAz ? "Müəllif kimi qoşulmaq üçün daxil olun" : "Sign in to access your Contributor Hub"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                {isAz
                  ? "Rvan.me müstəqil dizayn nəşrində öz yazılarınızı dərc etmək üçün Google profilinizlə daxil olun."
                  : "Sign in with Google to apply as an author, submit articles, and build your verified body of work."}
              </p>
              <Button onClick={() => setAuthModalOpen(true)} variant="primary" size="lg" className="mt-6">
                {isAz ? "Google ilə Daxil Ol" : "Sign In with Google"}
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Stats Overview Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                    <span>{isAz ? "Dərc Olunmuş" : "Published"}</span>
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.publishedCount}</p>
                </div>

                <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                    <span>{isAz ? "Baxışda Olan" : "Under Review"}</span>
                    <Clock size={16} className="text-amber-500" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.submittedCount}</p>
                </div>

                <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                    <span>{isAz ? "Qaralamalar" : "Drafts"}</span>
                    <FileText size={16} className="text-primary" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.draftsCount}</p>
                </div>

                <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                  <div className="flex items-center justify-between text-muted-foreground text-xs mono uppercase">
                    <span>{isAz ? "Profil Dolğunluğu" : "Profile Completeness"}</span>
                    <UserCheck size={16} className="text-sky-500" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-foreground">{stats.profileCompleteness}%</p>
                </div>
              </div>

              {/* Contributor Profile Status Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-6 backdrop-blur-xl">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase">
                    <Sparkles size={14} /> {isAz ? "Status: Aktiv Kontributor" : "Status: Active Contributor"}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {profile?.name || user.displayName} — {profile?.professionalTitle || "Visual Creator"}
                  </p>
                </div>

                <Link
                  to={getLocalizedPath(`/author/${profile?.slug || slugifyAuthorName(user.displayName || "contributor")}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline font-semibold"
                >
                  {isAz ? "İctimai Müəllif Profilinizə Baxın" : "View Your Public Author Profile"} <ArrowRight size={13} />
                </Link>
              </div>

              {/* Articles & Submissions List */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground">
                  {isAz ? "Məqalələriniz və Qaralamalar" : "Your Articles & Drafts"}
                </h2>

                {articles.length === 0 ? (
                  <div className="rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-10 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                    <PenTool size={28} className="mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-semibold text-foreground">
                      {isAz ? "Hələ heç bir məqalə qaralamanız yoxdur" : "No articles drafted yet"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isAz
                        ? "Yuxarıdakı 'Yeni Məqalə Yaz' düyməsinə klikləyərək ilk məqalənizi yazmağa başlayın."
                        : "Click 'Write New Essay' above to start your first submission."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] dark:shadow-none backdrop-blur-xl hover:border-primary/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold mono uppercase px-2 py-0.5 rounded-full border ${
                                art.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : art.status === "submitted"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                                  : "bg-slate-100 dark:bg-white/10 text-muted-foreground border-slate-200 dark:border-white/15"
                              }`}
                            >
                              {art.status}
                            </span>
                            <span className="text-xs text-primary font-mono">{art.category}</span>
                          </div>
                          <h3 className="text-base font-bold text-foreground">{art.title}</h3>
                          {art.excerpt && <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{art.excerpt}</p>}
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => {
                              setEditingDraft(art);
                              setEditorOpen(true);
                            }}
                            variant="secondary"
                            size="sm"
                          >
                            {isAz ? "Redaktə et" : "Edit"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Editor Modal */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-[#DDE1E0] dark:border-white/15 bg-white dark:bg-neutral-900/95 p-6 md:p-8 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-foreground mb-4">
              {editingDraft.id ? (isAz ? "Məqaləni Redaktə Et" : "Edit Article Draft") : (isAz ? "Yeni Məqalə Yaz" : "Draft New Article")}
            </h2>

            {saveSuccessMsg && (
              <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                {saveSuccessMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {isAz ? "MƏQALƏNİN BAŞLIĞI" : "ARTICLE TITLE"}
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  value={editingDraft.title || ""}
                  onChange={(e) => setEditingDraft({ ...editingDraft, title: e.target.value })}
                  placeholder={isAz ? "məs. Niyə Müasir Vebsaytlar Eyni Görünür?" : "e.g. Why Modern Websites All Look the Same"}
                  className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">
                    {isAz ? "KATEQORİYA" : "CATEGORY"}
                  </label>
                  <select
                    value={editingDraft.category || "Design"}
                    onChange={(e) => setEditingDraft({ ...editingDraft, category: e.target.value })}
                    className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50 dark:bg-neutral-800 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="Design">Design</option>
                    <option value="Psychology">Psychology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Typography">Typography</option>
                    <option value="UX">UX</option>
                    <option value="AI">AI</option>
                    <option value="Creative Culture">Creative Culture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-muted-foreground mb-1">
                    {isAz ? "DİL" : "LANGUAGE"}
                  </label>
                  <select
                    value={editingDraft.language || "en"}
                    onChange={(e) => setEditingDraft({ ...editingDraft, language: e.target.value as "en" | "az" })}
                    className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50 dark:bg-neutral-800 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="az">Azərbaycan dili</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {isAz ? "QISA TƏSVİR / XÜLASƏ" : "SHORT EXCERPT"}
                </label>
                <textarea
                  rows={2}
                  autoComplete="off"
                  value={editingDraft.excerpt || ""}
                  onChange={(e) => setEditingDraft({ ...editingDraft, excerpt: e.target.value })}
                  placeholder={isAz ? "Məqalənin əsas tezisi və maraqlı sualı..." : "Core premise and editorial question..."}
                  className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-muted-foreground mb-1">
                  {isAz ? "MƏQALƏNİN MƏTNİ (MARKDOWN)" : "ARTICLE CONTENT (MARKDOWN)"}
                </label>
                <textarea
                  rows={8}
                  autoComplete="off"
                  value={editingDraft.content || ""}
                  onChange={(e) => setEditingDraft({ ...editingDraft, content: e.target.value })}
                  placeholder={isAz ? "Məqalənin tam mətni və fəsilləri..." : "Write your essay content and chapters..."}
                  className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-white/5 px-4 py-2.5 text-sm text-foreground font-mono focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#DDE1E0] dark:border-white/10 pt-4">
              <Button onClick={() => setEditorOpen(false)} variant="ghost" size="sm">
                {isAz ? "Bağla" : "Close"}
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleSaveArticle("draft")}
                  variant="secondary"
                  size="sm"
                  disabled={isSaving}
                  icon={<Save size={14} />}
                  iconPosition="left"
                >
                  {isAz ? "Qaralama Kimi Saxla" : "Save Draft"}
                </Button>

                <Button
                  onClick={() => handleSaveArticle("submitted")}
                  variant="primary"
                  size="sm"
                  disabled={isSaving}
                  icon={<Send size={14} />}
                  iconPosition="left"
                >
                  {isAz ? "Təsdiqə Göndər" : "Submit for Review"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer siteSettings={siteSettings} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </main>
  );
}
