import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Sparkles,
  MapPin,
  Building2,
  Globe,
  Linkedin,
  Instagram,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ArrowLeft,
  UserX,
  Compass,
} from "lucide-react";

import { useLanguage } from "../../lib/i18n/LanguageContext";
import { fetchArticlesByAuthor, fetchSiteSettings } from "../../lib/sanityQueries";
import { SiteSettings } from "../../types/cms";
import { BlogPost } from "../../types/blog";
import {
  getPublicAuthorBySlug,
  getContributorArticles,
  ContributorProfile,
} from "../../services/contributorService";
import { formatBlogDate, estimateReadingTime } from "../../lib/blogHelpers";
import { urlFor } from "../../lib/sanityClient";
import SEO from "../components/SEO";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import GlobalFaqSection from "../components/GlobalFaqSection";
import { Button } from "../components/ui/Button";

// Behance SVG
const BehanceIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.105 0-5-2.28-5-5 0-2.887 1.854-5 4.821-5 3.007 0 4.679 2.051 4.679 4.792 0 .343-.031.708-.063.868h-7.371c.134 1.302 1.155 2.116 2.502 2.116 1.13 0 1.944-.45 2.378-1.206h2.78zm-4.793-4.887c-1.12 0-1.897.674-2.072 1.637h4.095c-.097-.932-.871-1.637-2.023-1.637zm-10.933 7.887h-8v-14h8.315c2.99 0 4.685 1.549 4.685 3.738 0 1.523-.811 2.766-2.148 3.328 1.748.513 2.648 1.91 2.648 3.784 0 2.531-1.993 3.15-5.5 3.15zm-4.5-8.5h4.15c1.229 0 2.15-.472 2.15-1.579 0-1.14-.863-1.421-2.15-1.421h-4.15v3zm0 6h4.383c1.385 0 2.417-.468 2.417-1.741 0-1.258-1.032-1.759-2.417-1.759h-4.383v3.5z" />
  </svg>
);

// Dribbble SVG
const DribbbleIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm10.192 11.237c-.31-.054-2.457-.406-4.945.318-.088-.201-.182-.403-.277-.604-.775-1.642-1.713-3.239-2.73-4.664 2.825 1.05 4.962 3.32 5.672 6.208.28.08.18-.08.28-.258zm-7.632-6.536c.995 1.385 1.905 2.923 2.658 4.499-2.227.671-5.127.882-8.384.444 1.135-2.072 3.204-3.704 5.726-4.943zm-7.391 1.764c2.812.378 5.485.195 7.643-.44-1.077 2.477-2.449 4.793-4.037 6.779-.906-.062-1.844-.094-2.808-.094-1.272 0-2.493.061-3.649.176.438-2.673 1.488-4.908 2.851-6.421zm-5.169 7.535c1.079-.105 2.215-.16 3.407-.16.892 0 1.758.029 2.597.086-1.395 3.822-3.323 7.027-5.592 9.176-1.579-2.316-2.5-5.1-2.5-8.102 0-.34.029-.669.088-1zm3.897 9.878c2.099-2.03 3.893-5.064 5.239-8.683 2.607 1.129 4.394 2.936 5.176 4.912-2.593 2.457-6.046 3.967-9.854 3.967-.189 0-.374-.015-.561-.027v.031zm11.759-3.237c-.724-1.802-2.368-3.483-4.801-4.577.106-.248.204-.502.296-.757 2.673-.787 5.093-.418 5.437-.361-.067 2.115-.815 4.053-2.062 5.695h1.13z" />
  </svg>
);

export default function PublicAuthorProfilePage() {
  const { authorSlug } = useParams();
  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";

  const [author, setAuthor] = useState<ContributorProfile | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });

    const cleanSlug = (authorSlug || "").trim().toLowerCase();
    if (!cleanSlug) {
      setLoading(false);
      return;
    }

    Promise.all([
      getPublicAuthorBySlug(cleanSlug),
      fetchArticlesByAuthor(cleanSlug, language),
    ])
      .then(async ([authorProfile, matchedBlogs]) => {
        setAuthor(authorProfile);

        let combinedArticles: BlogPost[] = matchedBlogs || [];

        // Also check if author has published contributor drafts
        if (authorProfile?.uid) {
          try {
            const drafts = await getContributorArticles(authorProfile.uid);
            const publishedDrafts = drafts.filter((d) => d.status === "published");
            const mappedDrafts: BlogPost[] = publishedDrafts.map((d) => ({
              _id: d.id,
              title: d.title,
              slug: { current: d.slug },
              originalSlug: d.slug,
              excerpt: d.excerpt,
              body: [],
              publishDate: d.updatedAt || d.createdAt,
              readTime: "4 min read",
              category: d.category || "Design",
              coverImage: d.coverImageUrl ? { asset: { url: d.coverImageUrl } } : null,
              authorName: authorProfile.name,
              authorSlug: authorProfile.slug,
              authorRole: authorProfile.professionalTitle,
            }));

            // Append drafts if not already in combined list
            mappedDrafts.forEach((md) => {
              if (!combinedArticles.some((a) => a.slug?.current === md.slug.current || a._id === md._id)) {
                combinedArticles.push(md);
              }
            });
          } catch (e) {
            console.warn("Could not fetch contributor drafts for author:", e);
          }
        }

        setArticles(combinedArticles);
      })
      .catch((err) => {
        console.error("Error loading author profile:", err);
        setAuthor(null);
      })
      .finally(() => setLoading(false));
  }, [authorSlug, language]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  // Author Not Found State
  if (!author) {
    return (
      <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
        <SEO
          title={isAz ? "Müəllif Tapılmadı — Rvan.me" : "Author Not Found — Rvan.me"}
          description={isAz ? "Axtarılan müəllif profili tapılmadı." : "The requested author profile does not exist."}
          noIndex={true}
        />
        <SiteHeader siteSettings={siteSettings} />

        <section className="px-6 pt-36 pb-24 md:pt-48 md:pb-36">
          <div className="mx-auto max-w-xl text-center space-y-6">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card text-muted-foreground shadow-sm">
              <UserX size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                404 / {isAz ? "MÜƏLLİF PROFİLİ" : "AUTHOR PROFILE"}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {isAz ? "Müəllif Profili Tapılmadı" : "Author Profile Not Found"}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {isAz
                  ? `«${authorSlug}» adlı müəllif profili mövcud deyil və ya hələ dərc edilməyib.`
                  : `The author profile for "${authorSlug}" could not be found or has not been published yet.`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button
                to={getLocalizedPath("/blog")}
                variant="primary"
                size="md"
                icon={<ArrowLeft size={14} />}
                iconPosition="left"
              >
                {isAz ? "BÜTÜN MƏQALƏLƏR" : "EXPLORE BLOG"}
              </Button>
              <Button
                to={getLocalizedPath("/write")}
                variant="secondary"
                size="md"
                icon={<Compass size={14} />}
              >
                {isAz ? "FİKRİNİZİ PAYLAŞIN" : "SHARE YOUR IDEAS"}
              </Button>
            </div>
          </div>
        </section>

        <Footer siteSettings={siteSettings} />
      </main>
    );
  }

  const profile = author;

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={`${profile.name} — ${isAz ? "Müəllif Profili" : "Author Profile"} | Rvan.me`}
        description={profile.bio || `${profile.name} — ${profile.professionalTitle}`}
        image={profile.profileImage || undefined}
        url={isAz ? `https://www.rvan.me/az/author/${profile.slug}` : `https://www.rvan.me/author/${profile.slug}`}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero Header Section */}
      <section className="relative px-6 pt-28 pb-16 md:px-10 md:pt-36">
        <div className="mx-auto max-w-[1400px]">
          <Link
            to={getLocalizedPath("/blog")}
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} /> {isAz ? "Bütün Məqalələrə Qayıt" : "Back to All Articles"}
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 md:p-12 backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-2xl">
            {/* Portrait Photo or Fallback Initials */}
            <div className="relative shrink-0">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="h-32 w-32 md:h-40 md:w-40 rounded-3xl object-cover border-2 border-primary/60 shadow-[0_0_35px_rgba(97,197,173,0.25)] bg-neutral-900"
                />
              ) : (
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-3xl border-2 border-primary/60 shadow-[0_0_35px_rgba(97,197,173,0.25)] bg-gradient-to-br from-[#61c5ad]/20 to-[#984f9f]/20 flex items-center justify-center text-3xl font-extrabold text-primary mono">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-black shadow-md mono">
                <CheckCircle2 size={12} /> {isAz ? "TƏSDİQLƏNMİŞ" : "VERIFIED"}
              </span>
            </div>

            {/* Author Information */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase font-bold tracking-widest">
                <Sparkles size={14} /> {isAz ? "REDAKSİYA MÜƏLLİFİ" : "EDITORIAL AUTHOR"}
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {profile.name}
              </h1>

              <p className="text-base md:text-lg font-medium text-primary/90">
                {profile.professionalTitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mono pt-1">
                {profile.currentWorkplace && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} className="text-primary" />
                    {profile.currentWorkplace}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" />
                    {profile.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-foreground font-semibold">
                  <BookOpen size={13} className="text-primary" />
                  {articles.length} {isAz ? "Dərc edilmiş məqalə" : "Published essays"}
                </span>
              </div>

              {profile.bio && (
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground pt-2">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              {profile.socialLinks && Object.values(profile.socialLinks).some((v) => Boolean(v?.trim())) && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xs transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={15} />
                    </a>
                  )}
                  {profile.socialLinks.instagram && (
                    <a
                      href={profile.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xs transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={15} />
                    </a>
                  )}
                  {profile.socialLinks.behance && (
                    <a
                      href={profile.socialLinks.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xs transition-colors"
                      aria-label="Behance"
                    >
                      <BehanceIcon size={15} />
                    </a>
                  )}
                  {profile.socialLinks.dribbble && (
                    <a
                      href={profile.socialLinks.dribbble}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xs transition-colors"
                      aria-label="Dribbble"
                    >
                      <DribbbleIcon size={15} />
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 shadow-2xs transition-colors"
                      aria-label="Website"
                    >
                      <Globe size={15} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Expertise & Career History Section */}
      {(profile.skills?.length > 0 || profile.experience || profile.education) && (
        <section className="px-6 py-8 md:px-10">
          <div className="mx-auto max-w-[1400px] grid gap-6 md:grid-cols-2">
            {/* Expertise Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mono mb-4">
                  {isAz ? "İXTİSASLAŞMA VƏ EKSPERTİZA" : "CORE EXPERTISE & COMPETENCIES"}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-[#DDE1E0] dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs text-foreground font-medium shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Background */}
            {(profile.experience || profile.education) && (
              <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none backdrop-blur-xl">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary mono mb-4">
                  {isAz ? "PEŞƏKAR TƏCRÜBƏ VƏ TƏHSİL" : "PROFESSIONAL BACKGROUND"}
                </h2>
                <div className="space-y-3 text-xs leading-relaxed text-muted-foreground font-medium">
                  {profile.experience && (
                    <p>
                      <strong className="text-foreground">{isAz ? "Təcrübə:" : "Experience:"}</strong> {profile.experience}
                    </p>
                  )}
                  {profile.education && (
                    <p>
                      <strong className="text-foreground">{isAz ? "Təhsil:" : "Education:"}</strong> {profile.education}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Published Body of Work Section */}
      <section className="px-6 py-12 md:px-10 pb-28">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 flex items-center justify-between border-b border-[#DDE1E0] dark:border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-primary mono uppercase">
                {isAz ? "MÜƏLLİFİN NƏŞRLƏRİ" : "BODY OF WORK"}
              </span>
              <h2 className="mt-2 text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {isAz ? `${profile.name} tərəfindən yazılan məqalələr` : `Articles & Essays by ${profile.name}`}
              </h2>
            </div>
            <span className="text-xs text-muted-foreground mono font-bold">
              {articles.length} {isAz ? "Nəşr" : "Publications"}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none">
              <BookOpen size={32} className="mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="text-base font-bold text-foreground">
                {isAz ? "Hələ Dərc Edilmiş Məqalə Yoxdur" : "No Published Articles Yet"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                {isAz
                  ? `Bu müəllif Rvan.me redaksiyasında qeydiyyatdan keçib. ${profile.name} tərəfindən yazılan məqalələr redaksiya baxışından sonra burada dərc olunacaq.`
                  : `This author is a registered author on Rvan.me. Articles written by ${profile.name} will appear here once editorially approved and published.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((post) => {
                const formattedDate = formatBlogDate(post.publishDate, language);
                const readTimeStr = estimateReadingTime(post.body, post.readTime, language);
                const slugStr = post.slug?.current || post.originalSlug || post._id || "";
                const imgUrl = post.coverImage?.asset?.url || (post.coverImage ? urlFor(post.coverImage)?.url() : null);

                return (
                  <Link
                    key={post._id || slugStr}
                    to={getLocalizedPath(`/blog/${slugStr}`)}
                    className="group flex flex-col justify-between rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-white/[0.05] shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none hover:shadow-xl hover:shadow-primary/5 focus:outline-none"
                  >
                    <div>
                      {imgUrl && (
                        <div className="mb-4 overflow-hidden rounded-2xl aspect-[16/9] bg-neutral-900 border border-[#DDE1E0] dark:border-white/5">
                          <img
                            src={imgUrl}
                            alt={post.title}
                            width={800}
                            height={450}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      {post.category && (
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider mono uppercase text-primary">
                          {post.category}
                        </span>
                      )}

                      <h3 className="mt-2.5 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#DDE1E0] dark:border-white/10 pt-4 text-[10px] text-muted-foreground mono font-bold">
                      <span>{formattedDate}</span>
                      <span className="flex items-center gap-1 text-primary">
                        {readTimeStr} <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Global FAQ Section ── */}
      <GlobalFaqSection />

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
