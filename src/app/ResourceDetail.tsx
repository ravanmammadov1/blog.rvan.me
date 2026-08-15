import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import {
  ArrowLeft, ExternalLink, Globe, MapPin, BadgeCheck, Award, Users,
  Calendar, Clock, Building2, DollarSign, Trophy, BookOpen, Layers
} from "lucide-react";

import { fetchResources, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ResourceItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { Button } from "./components/ui/Button";

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  studentPack: "Student Pack",
  aiCredits: "AI Credits",
  software: "Free Software",
  roadmap: "Learning Roadmap",
  scholarship: "Scholarship",
  internship: "Internship",
  job: "Remote Job",
  hackathon: "Hackathon",
  startupProgram: "Startup Program",
};

const RESOURCE_TYPE_ICONS: Record<string, string> = {
  studentPack: "🎒",
  aiCredits: "🤖",
  software: "💻",
  roadmap: "🗺️",
  scholarship: "🎓",
  internship: "🏢",
  job: "💼",
  hackathon: "⚡",
  startupProgram: "🚀",
};

const BADGE_COLORS: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  New: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Popular: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Trending: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Partner: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Hot: "bg-red-500/10 text-red-400 border-red-500/20",
  Limited: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const VERIFICATION_CONFIG = {
  official: { label: "Official Partner", icon: BadgeCheck, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  verified: { label: "Verified by Team", icon: Award, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  community: { label: "Community Sourced", icon: Users, color: "text-muted-foreground", bg: "bg-surface border-border" },
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  all: "All Levels",
};

const portableComponents = {
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-semibold tracking-tight text-foreground mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-semibold tracking-tight text-foreground mt-8 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-sm leading-relaxed text-muted-foreground mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-primary pl-4 my-6 text-sm italic text-muted-foreground">{children}</blockquote>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-foreground">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80 transition-opacity">
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-sm text-muted-foreground">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-sm text-muted-foreground">{children}</ol>,
  },
};

function RelatedCard({ resource }: { resource: ResourceItem }) {
  const { getLocalizedPath } = useLanguage();
  const logoUrl = resource.logo ? urlFor(resource.logo)?.width(60).url() : null;
  const slug = typeof resource.slug === "string" ? resource.slug : resource.slug?.current || resource._id;
  return (
    <Link
      to={getLocalizedPath(`/resources/${slug}`)}
      className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-primary/50 hover:-translate-y-0.5 glass-sm relative overflow-hidden"
    >
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: "radial-gradient(circle at top right, rgba(6,182,212,0.05) 0%, transparent 60%)",
        }}
      />
      <div className="flex-shrink-0 relative z-10">
        {logoUrl ? (
          <img src={logoUrl} alt={resource.title} className="h-9 w-9 rounded-lg object-contain border border-white/10 bg-background p-1" />
        ) : (
          <div className="h-9 w-9 rounded-lg border border-white/10 bg-background flex items-center justify-center text-lg">
            ⚡
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 relative z-10">
        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
          {resource.title}
        </h4>
        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{resource.description}</p>
      </div>
    </Link>
  );
}

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [resource, setResource] = useState<ResourceItem | null>(null);
  const [allResources, setAllResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { t, getLocalizedPath } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetchResourceBySlug(slug)
      .then((res) => {
        setResource(res);
        return fetchAllResources();
      })
      .then((all) => {
        setAllResources(all || []);
      })
      .catch((err) => {
        console.error("Error fetching resource detail:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Related resources: same type or shared tags, excluding self
  const related = useMemo(() => {
    if (!resource) return [];
    const tagIds = new Set((resource.tags || []).map((tItem) => tItem._id));
    return allResources
      .filter((r) => r._id !== resource._id)
      .filter(
        (r) =>
          r.resourceType === resource.resourceType ||
          r.category?._id === resource.category?._id ||
          (r.tags || []).some((tItem) => tagIds.has(tItem._id))
      )
      .slice(0, 6);
  }, [resource, allResources]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
        <SiteHeader siteSettings={siteSettings} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="space-y-4 w-full max-w-2xl px-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-xl bg-surface animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="min-h-screen bg-background px-6 py-32 text-foreground">
        <SEO title={`${t("articleNotFound", "Resource not found")} — Ravan Mammadov`} noIndex />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold">{t("articleNotFound", "Resource not found")}</h1>
          <p className="mt-4 text-muted-foreground">{t("articleNotFoundDesc", "The requested resource is unavailable or has been removed.")}</p>
          <Link to={getLocalizedPath("/resources")} className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold uppercase tracking-widest text-black mono">
            <ArrowLeft size={15} /> {t("backToResources", "Back to resources")}
          </Link>
        </div>
      </main>
    );
  }

  const logoUrl = resource.logo ? urlFor(resource.logo)?.width(120).url() : null;
  const ogImgUrl = resource.seo?.ogImage ? urlFor(resource.seo.ogImage)?.width(1200).url() : logoUrl ?? undefined;
  const typeIcon = RESOURCE_TYPE_ICONS[resource.resourceType] ?? "📦";
  const typeLabel = RESOURCE_TYPE_LABELS[resource.resourceType] ?? resource.resourceType;
  const verification = VERIFICATION_CONFIG[resource.verificationStatus ?? "verified"];

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title={resource.seo?.metaTitle || `${resource.title} — Rvan.me`}
        description={resource.seo?.metaDescription || resource.description}
        image={ogImgUrl}
        url={`https://www.rvan.me/resources/${typeof resource.slug === "string" ? resource.slug : resource.slug?.current || resource._id}`}
      />

      <SiteHeader siteSettings={siteSettings} />

      <div className="mx-auto max-w-[1600px] px-6 pt-20 pb-28 md:px-10 md:pt-28">
        {/* Breadcrumb */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05} className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mono uppercase tracking-widest">
            <Link to={getLocalizedPath("/")} className="hover:text-primary transition-colors">{t("home", "Home")}</Link>
            <span>/</span>
            <Link to={getLocalizedPath("/resources")} className="hover:text-primary transition-colors">{t("navResources", "Resources")}</Link>
            <span>/</span>
            <span className="text-foreground">{typeLabel}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1} className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8 glass relative overflow-hidden group">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start relative z-10">
                <div className="flex-shrink-0">
                  {logoUrl ? <img src={logoUrl} alt={resource.title} width={80} height={80} className="h-20 w-20 rounded-2xl object-contain border border-white/10 bg-background p-3" /> : <div className="h-20 w-20 rounded-2xl border border-white/10 bg-background flex items-center justify-center text-4xl">{typeIcon}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">{resource.title}</h1>
                  <p className="text-sm leading-relaxed text-muted-foreground/80 font-medium">{resource.description}</p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-3 relative z-10">
                <Button
                  href={resource.link}
                  external
                  variant="primary"
                  size="lg"
                  icon={<ExternalLink size={14} />}
                >
                  {t("accessResource", "ACCESS RESOURCE")}
                </Button>
                <Button
                  to={getLocalizedPath("/resources")}
                  variant="secondary"
                  size="lg"
                  icon={<ArrowLeft size={14} />}
                  iconPosition="left"
                >
                  {t("backToDirectory", "BACK TO DIRECTORY")}
                </Button>
              </div>
            </motion.div>

            {(resource.company || resource.salaryRange || resource.prizePool || resource.fundingAmount || resource.difficultyLevel || resource.completionTime) && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.2} className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8 glass relative overflow-hidden group">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-4 relative z-10">{t("details", "Details")}</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 relative z-10">
                  {resource.company && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Company</p><p className="text-sm font-semibold text-foreground mt-0.5">{resource.company}</p></div>}
                  {resource.salaryRange && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Compensation</p><p className="text-sm font-semibold text-emerald-400 mt-0.5">{resource.salaryRange}</p></div>}
                  {resource.prizePool && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Prize Pool</p><p className="text-sm font-semibold text-amber-400 mt-0.5">{resource.prizePool}</p></div>}
                  {resource.fundingAmount && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Funding</p><p className="text-sm font-semibold text-emerald-400 mt-0.5">{resource.fundingAmount}</p></div>}
                  {resource.difficultyLevel && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Difficulty</p><p className="text-sm font-semibold text-foreground capitalize mt-0.5">{resource.difficultyLevel}</p></div>}
                  {resource.completionTime && <div><p className="text-[10px] font-bold text-muted-foreground uppercase mono">Est. Time</p><p className="text-sm font-semibold text-foreground mt-0.5">{resource.completionTime}</p></div>}
                </div>
              </motion.div>
            )}

            {resource.body && resource.body.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.25} className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8 glass">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mono mb-6">{t("aboutResource", "About this Resource")}</h2>
                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <PortableText value={resource.body} components={portableTextComponents} />
                </div>
              </motion.div>
            )}

            {resource.tags && resource.tags.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.3} className="mb-8">
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => (
                    <Link key={tag._id} to={getLocalizedPath(`/resources?q=${encodeURIComponent(tag.name)}`)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 glass-sm">
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <aside>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.15} className="sticky top-[90px] space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 glass relative overflow-hidden group">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-5 relative z-10">{t("quickInfo", "Quick Info")}</h3>
                <div className="space-y-4 relative z-10">
                  <div className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${verification.bg}`}>
                    <VerifyIcon size={14} className={verification.color} />
                    <span className={`text-xs font-semibold ${verification.color}`}>{verification.label}</span>
                  </div>
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/10 px-3 py-2.5">
                    {resource.isGlobal ? (
                      <><Globe size={14} className="text-muted-foreground" /><span className="text-xs font-semibold text-foreground">{t("availableGlobally", "Available Globally")}</span></>
                    ) : (
                      <><MapPin size={14} className="text-muted-foreground" /><span className="text-xs font-semibold text-foreground">{resource.countries?.join(", ") || "Select Countries"}</span></>
                    )}
                  </div>
                </div>
                <div className="mt-6 relative z-10">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-4 py-3 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black glass-sm">
                    <ExternalLink size={12} />
                    {t("accessResource", "ACCESS RESOURCE")}
                  </a>
                </div>
              </div>

              {related.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 glass">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-4">{t("relatedResources", "Related Resources")}</h3>
                  <div className="space-y-3">
                    {related.map((r) => <RelatedCard key={r._id} resource={r} />)}
                  </div>
                  <Link to={getLocalizedPath("/resources")} className="mt-4 block text-center text-xs font-bold uppercase tracking-widest text-primary mono hover:text-white transition-colors">
                    {t("viewAllResources", "VIEW ALL RESOURCES")} →
                  </Link>
                </div>
              )}
            </motion.div>
          </aside>
        </div>
      </div>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
