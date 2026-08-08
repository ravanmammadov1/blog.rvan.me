import { useEffect, useState, useMemo, lazy, Suspense, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoveUpRight,
  Zap,
  Layers,
  Sparkles,
  Newspaper,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import coverWuling1200 from "@/imports/466885252088463.6a4df53862539-1200.webp";
import coverWuling800 from "@/imports/466885252088463.6a4df53862539-800.webp";
import coverLimitless1200 from "@/imports/cbfd4b251276815.6a33abf0bf48e-1200.webp";
import coverLimitless800 from "@/imports/cbfd4b251276815.6a33abf0bf48e-800.webp";
import coverOmoda from "@/imports/063f86251210609.6a4670b82b027.png";
import { client, urlFor } from "../lib/sanityClient";
import { fetchSiteSettings, fetchProjects } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings, ProjectItem } from "../types/cms";
import BlogCard from "./components/blog/BlogCard";
import SEO from "./components/SEO";
import { useCookieConsent } from "./context/CookieConsentContext";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const HeroPortrait = lazy(() => import("./components/HeroPortrait"));
const HeroParticles = lazy(() => import("./components/HeroParticles"));

// Lazy-load below-fold sections
const NewsSection = lazy(() => import("./components/home/NewsSection"));
const BlogSection = lazy(() => import("./components/home/BlogSection"));
const ResourcesSection = lazy(() => import("./components/home/ResourcesSection"));
const ToolsSection = lazy(() => import("./components/home/ToolsSection"));
const WorkSection = lazy(() => import("./components/home/WorkSection"));
const ContactSection = lazy(() => import("./components/home/ContactSection"));
const AmbientStars = lazy(() => import("./components/home/AmbientStars"));
const KnowledgeHubSection = lazy(() => import("./components/home/KnowledgeHubSection").then(m => ({ default: m.KnowledgeHubSection })));
const FeaturedInteractiveTools = lazy(() => import("./components/home/FeaturedInteractiveTools").then(m => ({ default: m.FeaturedInteractiveTools })));




// Modular Section Enable/Disable Toggles
const CONFIG_SHOW_HERO = true;
const CONFIG_SHOW_NEWS = true;
const CONFIG_SHOW_BLOG = true;
const CONFIG_SHOW_RESOURCES = true;
const CONFIG_SHOW_TOOLS = true;
const CONFIG_SHOW_WORK = true;
const CONFIG_SHOW_CONTACT = true;

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
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


const fallbackProjects = [
  {
    number: "01",
    title: "Wuling / Creative Campaign",
    slug: "wuling-creative-campaign",
    type: "Art direction · Motion · Campaign",
    image: { large: coverWuling1200, medium: coverWuling800 },
    accent: "#e8fd52",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "02",
    title: "Limitless Drive",
    slug: "limitless-drive",
    type: "Brand identity · 3D · Automotive",
    image: { large: coverLimitless1200, medium: coverLimitless800 },
    accent: "#ff764b",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "03",
    title: "Omoda & Jaecoo",
    slug: "omoda-jaecoo",
    type: "Creative suite · Motion system",
    image: coverOmoda,
    accent: "#5ce1e6",
    year: "2025",
    liveUrl: undefined as string | undefined,
  },
];

function imageSource(image: unknown): string | undefined {
  if (typeof image === "string") return image;
  if (image && typeof image === "object") {
    const candidate = image as { medium?: string; large?: string };
    return candidate.medium || candidate.large;
  }
  return undefined;
}

const services = [
  {
    name: "3D & Motion Craft",
    externalLink: "#",
    relatedBlogSlug: "3d-product-visualization-guide",
  },
  {
    name: "Brand Worlds & Systems",
    externalLink: "#",
    relatedBlogSlug: "building-brand-worlds-visual-systems",
  },
  {
    name: "Performance Creative",
    externalLink: "#",
    relatedBlogSlug: "performance-creative-video-scaling",
  },
  {
    name: "Art Direction & Growth",
    externalLink: "#",
    relatedBlogSlug: "portfolio-client-blueprint",
  },
];

const platformModules = [
  {
    id: "resources",
    title: "Design Resources",
    desc: "Curated templates, fonts, mockups, UI kits and creative assets.",
    cta: "Explore Resources",
    link: "/resources",
    icon: Layers,
  },
  {
    id: "news",
    title: "Industry News",
    desc: "Latest branding, technology, automotive and creative industry news.",
    cta: "Read News",
    link: "/news",
    icon: Newspaper,
  },
  {
    id: "blog",
    title: "Blog",
    desc: "Articles, tutorials, case studies and creative insights.",
    cta: "Read Blog",
    link: "/blog",
    icon: BookOpen,
  },
  {
    id: "tools",
    title: "Tools",
    desc: "Discover AI tools, software recommendations and productivity resources.",
    cta: "Explore Tools",
    link: "/tools",
    icon: Sparkles,
  },
];

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [sanityProjects, setSanityProjects] = useState<ProjectItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [toolsList, setToolsList] = useState<any[]>([]);
  const [resourcesList, setResourcesList] = useState<any[]>([]);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hoveredBlog, setHoveredBlog] = useState<string | null>(null);
  const [loadHeroParticles, setLoadHeroParticles] = useState(false);

  // Mouse & touch tracking for Hero particles
  const mouseRef = useRef({ x: -99999, y: -99999 });

  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleHeroMouseLeave = useCallback(() => {
    mouseRef.current = { x: -99999, y: -99999 };
  }, []);

  const handleHeroTouchMove = useCallback((e: React.TouchEvent<HTMLElement>) => {
    if (e.touches.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRef.current = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
  }, []);

  const handleHeroTouchEnd = useCallback(() => {
    mouseRef.current = { x: -99999, y: -99999 };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const blogQuery = `*[_type == "blog" && (status == "published" || !defined(status)) && (!defined(publishDate) || publishDate <= now())] | order(featured desc, publishDate desc){
      _id, title, slug, excerpt, category, tags, featured, publishDate, readTime, coverImage, body
    }`;

    const newsQuery = `*[_type == "news" && (status == "published" || !defined(status)) && (!defined(publishedAt) || publishedAt <= now())] | order(publishedAt desc)[0...3]{
      _id, title, "slug": slug.current, coverImage, excerpt, publishedAt, category
    }`;

    const toolsQuery = `*[_type == "tools"] | order(category asc, name asc)[0...4]{
      _id, name, description, icon, link, category
    }`;

    const resourcesQuery = `*[_type == "resource" && status == "published"] | order(sortPriority asc, featuredScore desc, _createdAt desc)[0...4]{
      _id, title, "slug": slug.current, resourceType, description, benefitSummary, link, logo, status, verificationStatus, isGlobal, countries, difficultyLevel, completionTime, badges
    }`;

    Promise.allSettled([
      fetchSiteSettings().then((data) => data && setSiteSettings(data)),
      fetchProjects().then((data) => data && data.length > 0 && setSanityProjects(data)),
      client.fetch(blogQuery).then((data) => setBlogPosts(data || [])),
      client.fetch(newsQuery).then((data) => setNewsList(data || [])),
      client.fetch(toolsQuery).then((data) => setToolsList(data || [])),
      client.fetch(resourcesQuery).then((data) => setResourcesList(data || [])),
    ]).catch(() => {
      // Silently catch to prevent unhandled promise rejection
    }).finally(() => {
      clearTimeout(timeoutId);
    });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);


  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    const startParticles = () => setLoadHeroParticles(true);
    const idleHandle = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(startParticles, { timeout: 1800 })
      : undefined;
    const timeoutHandle = idleHandle === undefined ? window.setTimeout(startParticles, 1200) : undefined;

    return () => {
      if (idleHandle !== undefined) idleWindow.cancelIdleCallback?.(idleHandle);
      if (timeoutHandle !== undefined) window.clearTimeout(timeoutHandle);
    };
  }, []);
  const displayProjects = useMemo(() => {
    if (sanityProjects.length > 0) {
      return sanityProjects.map((p, index) => ({
        number: String(index + 1).padStart(2, "0"),
        title: p.title,
        slug: p.slug?.current || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        type: p.type || (p.tags && p.tags.length > 0 ? p.tags.join(" · ") : "Creative Project"),
        image: p.coverImage ? urlFor(p.coverImage)?.width(1200).format("webp").auto("format").url() || fallbackProjects[index % fallbackProjects.length].image : fallbackProjects[index % fallbackProjects.length].image,
        accent: p.accent || "#e8fd52",
        year: p.year || "2025",
        liveUrl: p.liveUrl,
      }));
    }
    return fallbackProjects.map((p) => ({
      ...p,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  }, [sanityProjects]);

  const homepageProjects = useMemo(() => {
    return displayProjects.slice(0, 3);
  }, [displayProjects]);

  const heroTitle = siteSettings?.heroTitle || "MOVE THE NEEDLE.";
  const heroSubtitle = siteSettings?.heroSubtitle || "Senior creative designer in Baku, Azerbaijan, blending motion design, brand identity, graphic design, and high-performing digital ideas into work that earns attention.";
  const availabilityStatus = siteSettings?.availabilityStatus || "AVAILABLE FOR SELECT WORK · Q3 2025";

  return (
    <main
      className="overflow-hidden bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Ravan Mammadov — Senior Creative Designer & Art Director"
        description="Senior Creative Designer blending 3D motion design, brand worlds, and high-performing digital marketing ideas into work that commands attention."
        url="https://www.rvan.me/"
      />
      {/* Ambient star field backdrop */}
      <Suspense fallback={null}>
        <AmbientStars />
      </Suspense>


      {/* ── Header ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. Hero ── */}
      {CONFIG_SHOW_HERO && (
        <section
          id="top"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          onTouchMove={handleHeroTouchMove}
          onTouchEnd={handleHeroTouchEnd}
          className="relative isolate min-h-screen overflow-hidden flex items-center"
          style={{ paddingTop: "5rem" }}
        >
          {/* ══ 1. Premium Deep-Black Hero Background ══ */}
          <div 
            className="pointer-events-none absolute inset-0 -z-20 bg-[#050506] transform-gpu" 
            aria-hidden="true"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.04) 25%, rgba(16, 185, 129, 0.01) 45%, transparent 60%),
                radial-gradient(circle at 40% 45%, rgba(6, 182, 212, 0.06) 0%, rgba(6, 182, 212, 0.03) 25%, rgba(6, 182, 212, 0.01) 45%, transparent 55%),
                radial-gradient(circle at 60% 55%, rgba(139, 92, 246, 0.05) 0%, rgba(139, 92, 246, 0.025) 25%, rgba(139, 92, 246, 0.008) 45%, transparent 55%)
              `
            }}
          />

          {/* ══ 2. Decorative WebGL Particle Background ══ */}
          {loadHeroParticles && (
            <Suspense fallback={null}>
              <HeroParticles mouseRef={mouseRef} />
            </Suspense>
          )}


          {/* ══ 3. Original Hero Content Grid ══ */}
          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-10 py-16 sm:py-20 lg:py-0">
            <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8 min-h-[calc(100vh-5rem)]">

              {/* Left — text */}
              <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-center">

                <p className="mb-4 sm:mb-5 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono uppercase">
                  Rvan.me · Ravan Mammadov · Senior Creative Designer · Baku, Azerbaijan
                </p>


                {/* Glass availability badge */}
                <motion.div
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
                  className="mb-6 sm:mb-8 md:mb-9 inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2 text-[10px] font-bold tracking-[.22em] text-primary mono uppercase glass-badge"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary badge-pulse-dot" />
                  {availabilityStatus}
                </motion.div>

                {/* Headline — word-by-word reveal */}
                <h1 className="mb-0">
                  <span className="sr-only">Ravan Mammadov — Motion, Brand & Graphic Designer in Baku</span>
                  {heroTitle.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="inline-block overflow-hidden"
                      style={{ marginRight: "0.16em" }}
                    >
                      <motion.span
                        className={`inline-block text-[11vw] font-bold leading-[0.88] tracking-[-0.07em] sm:text-[8.5vw] md:text-[7vw] lg:text-[7.2vw] xl:text-[6.2vw] ${word.includes('MOVE') ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 aurora-text-animate' : 'text-foreground'}`}
                        initial={{ y: "112%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.05, delay: 0.15 + i * 0.1, ease: EASE }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </h1>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
                  className="mt-6 sm:mt-8 max-w-[500px] text-sm sm:text-base md:text-[15.5px] leading-[1.75] text-muted-foreground font-medium"
                >
                  {heroSubtitle}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.76, ease: EASE }}
                  className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  {/* Primary CTA */}
                  <Link
                    to="/resources"
                    className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-[11px] font-bold tracking-[.18em] text-black transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_40px_rgba(216,255,68,0.30)] mono uppercase text-center"
                  >
                    EXPLORE DIRECTORY
                    <ArrowDownRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </Link>

                  {/* Secondary CTA — glass */}
                  <Link
                    to="/ravan-mammadov"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-bold tracking-[.18em] text-foreground/80 transition-all duration-300 hover:text-foreground mono uppercase glass-sm text-center"
                  >
                    ABOUT ME
                    <ArrowUpRight size={13} />
                  </Link>
                </motion.div>

                {/* ── MOBILE & TABLET LOGO ── */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.85, ease: EASE }}
                  className="block lg:hidden my-8 sm:my-10 w-full max-w-[260px] sm:max-w-[320px] mx-auto"
                >
                  <Suspense fallback={<div className="h-44" aria-hidden="true" />}>
                    <HeroPortrait />
                  </Suspense>
                </motion.div>

                {/* ── Premium Editorial Navigation Tiles ── */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9, ease: EASE }}
                  className="mt-2 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5"
                >
                  {platformModules.map((module, i) => {
                    const IconComp = module.icon;
                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.95 + i * 0.08, ease: EASE }}
                      >
                        <Link
                          to={module.link}
                          className="group p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-lg hover:border-primary/40 hover:bg-white/[0.06] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(232,253,82,0.1)] transition-all duration-300 flex items-center gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-foreground/80 group-hover:text-primary group-hover:border-primary/40 transition-all duration-300 flex-shrink-0">
                            <IconComp size={16} />
                          </div>
                          <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                            {module.title}
                          </h3>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>



                {/* ── Google OAuth Verification Statement & Application Purpose ── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
                  className="mt-4 p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <h2 className="text-[11px] font-bold tracking-[.14em] text-foreground mono uppercase">About Rvan.me & Account Features</h2>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    <strong className="text-foreground">Rvan.me</strong> is a curated digital hub for design thinking, creative resources, developer tools, and industry insights. Users can sign in with Google to save resources, bookmark tools, personalize their experience, and access member features. View our <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and <Link to="/terms-of-service" className="text-primary hover:underline">Terms of Service</Link>.
                  </p>
                </motion.div>
              </div>


              {/* Right column — DESKTOP LOGO */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                className="hidden lg:flex items-center justify-center lg:col-span-6 xl:col-span-5 lg:h-[calc(100vh-5rem)] lg:max-h-[820px]"
              >
                <Suspense fallback={<div style={{ height: 400 }} aria-hidden="true" />}>
                  <HeroPortrait />
                </Suspense>
              </motion.div>

            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="pointer-events-none absolute bottom-0 inset-x-0 h-40"
            style={{ background: "linear-gradient(to bottom, transparent, #050506)" }}
          />
        </section>
      )}


      {/* ── 2. Featured News ── */}

      {CONFIG_SHOW_NEWS && (
        <section id="news" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 flex items-end justify-between border-b border-border pb-6"
            >
              <div>
                <Eyebrow className="text-muted-foreground">02 / Announcements & Field Notes</Eyebrow>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                  Latest updates.
                </h2>
              </div>
              <Link
                to="/news"
                className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
              >
                VIEW ALL NEWS
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {newsList.length === 0 ? (
              <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
                No news updates available.
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {newsList.map((item, index) => {
                  const newsSlug = item.slug || item._id;
                  let formattedDate = "";
                  if (item.publishedAt) {
                    try {
                      formattedDate = format(new Date(item.publishedAt), "MMM d, yyyy");
                    } catch (e) {
                      formattedDate = "";
                    }
                  }
                  const imgUrl = item.coverImage ? urlFor(item.coverImage)?.width(1200).format("webp").auto("format").url() : null;

                  return (
                    <motion.article
                      key={item._id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={index * 0.08}
                      className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary flex flex-col justify-between"
                    >
                      <Link to={`/news/${newsSlug}`}>
                        {imgUrl && (
                          <div className="mb-5 overflow-hidden rounded-xl aspect-[16/10] bg-background">
                            <img
                              src={imgUrl}
                              alt={item.title}
                              width={1200}
                              height={750}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between gap-3 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-3">
                          {item.category && <span className="text-primary">{item.category}</span>}
                          {formattedDate && <span>{formattedDate}</span>}
                        </div>
                        <h3 className="text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary mb-3 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3 mb-6">
                            {item.excerpt}
                          </p>
                        )}
                      </Link>
                      <div className="border-t border-border/50 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                        <Link to={`/news/${newsSlug}`} className="inline-flex items-center gap-1.5 hover:underline">
                          <span>READ FULL ARTICLE</span>
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

            <div className="mt-16 flex justify-center md:hidden">
              <Link
                to="/news"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-xs font-bold tracking-[.14em] text-foreground transition-colors hover:border-primary mono"
              >
                VIEW ALL NEWS
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Featured Blog Articles ── */}
      {CONFIG_SHOW_BLOG && (
        <section id="blog" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 flex items-end justify-between border-b border-border pb-6"
            >
              <div>
                <Eyebrow className="text-muted-foreground">03 / Insights & Ideas</Eyebrow>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                  Thinking out loud.
                </h2>
              </div>
              <Link
                to="/blog"
                className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
              >
                EXPLORE ALL ARTICLES
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {blogPosts.length === 0 ? (
              <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
                No blog articles available.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts
                  .slice(0, 3)
                  .map((post) => (
                    <BlogCard
                      key={post._id}
                      post={post}
                      hovered={hoveredBlog === post._id}
                      onHoverStart={() => setHoveredBlog(post._id)}
                      onHoverEnd={() => setHoveredBlog(null)}
                    />
                  ))}
              </div>
            )}

            <div className="mt-16 flex justify-center">
              <Link
                to="/blog"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg"
              >
                EXPLORE FULL BLOG ARCHIVE ({blogPosts.length} ARTICLES)
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Live Curated Resources Directory ── */}
      {CONFIG_SHOW_RESOURCES && (
        <Suspense fallback={<div className="h-96" />}>
          <ResourcesSection />
        </Suspense>
      )}

      {/* ── 5. Featured Tools ── */}
      {CONFIG_SHOW_TOOLS && (
        <section id="tools" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 flex items-end justify-between border-b border-border pb-6"
            >
              <div>
                <Eyebrow className="text-muted-foreground">05 / Utilities & Stack</Eyebrow>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                  Utilities & Stack.
                </h2>
              </div>
              <Link
                to="/tools"
                className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
              >
                VIEW ALL UTILITIES
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            {toolsList.length === 0 ? (
              <div className="h-64 rounded-xl border border-border bg-surface flex items-center justify-center text-muted-foreground text-sm">
                No tools or stack items available.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {toolsList.map((tool, index) => {
                  const iconUrl = tool.icon ? urlFor(tool.icon)?.url() : null;
                  const CardElement = tool.link ? "a" : "div";
                  const cardProps = tool.link
                    ? { href: tool.link, target: "_blank", rel: "noreferrer" }
                    : {};

                  return (
                    <motion.div
                      key={tool._id}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={index * 0.05}
                    >
                      <CardElement
                        {...cardProps}
                        className="group flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:bg-surface/80 cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-4 mb-4">
                            {iconUrl ? (
                              <img
                                src={iconUrl}
                                alt={tool.name}
                                width={40}
                                height={40}
                                loading="lazy"
                                decoding="async"
                                className="h-10 w-10 rounded-lg object-contain bg-background border border-border p-2"
                              />
                            ) : (
                              <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background text-primary">
                                <Zap size={18} />
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                                {tool.name}
                              </h3>
                              {tool.category && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground mono block mt-0.5">
                                  {tool.category}
                                </span>
                              )}
                            </div>
                          </div>
                          {tool.description && (
                            <p className="text-xs leading-relaxed text-muted-foreground mt-2 line-clamp-2">
                              {tool.description}
                            </p>
                          )}
                        </div>
                        {tool.link && (
                          <span className="mt-4 inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-primary mono uppercase">
                            ACCESS UTILITY <ArrowUpRight size={10} />
                          </span>
                        )}
                      </CardElement>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="mt-16 flex justify-center">
              <Link
                to="/tools"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl"
              >
                EXPLORE ALL IN-BROWSER UTILITIES
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Interactive Developer & Designer Tools ── */}
      <Suspense fallback={<div className="h-96" />}>
        <FeaturedInteractiveTools />
      </Suspense>

      {/* ── Daily Curated Knowledge & Opportunities Feed ── */}
      <Suspense fallback={<div className="h-96" />}>
        <KnowledgeHubSection />
      </Suspense>


      {/* ── 6. Selected Work ── */}
      {CONFIG_SHOW_WORK && (

        <section id="work" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
          <div className="mx-auto max-w-[1600px]">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 flex items-end justify-between border-b border-border pb-6"
            >
              <div>
                <Eyebrow className="text-muted-foreground">06 / Selected Work</Eyebrow>
                <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                  Built to be remembered.
                </h2>
              </div>
              <Link
                to="/work"
                className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
              >
                VIEW ALL PROJECTS ({displayProjects.length})
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <div className="grid gap-12 lg:gap-20">
              {homepageProjects.map((project, index) => (
                <motion.article
                  key={project.slug}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.1}
                  className="project-card group relative grid gap-8 lg:grid-cols-12 items-center"
                  onMouseEnter={() => setHoveredProject(index)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div className="lg:col-span-7">
                    <Link to={`/work/${project.slug}`} className="block overflow-hidden rounded-2xl border border-border bg-surface">
                      <div className="project-art relative aspect-[16/10] overflow-hidden">
                        <ImageWithFallback
                          src={imageSource(project.image) || imageSource(fallbackProjects[index % fallbackProjects.length].image)}
                          fallbackSrc={imageSource(fallbackProjects[index % fallbackProjects.length].image)}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="lg:col-span-5 lg:pl-6">
                    <div className="flex items-center gap-4 text-xs font-bold tracking-[.2em] text-muted-foreground mono">
                      <span>{project.number}</span>
                      <span>·</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] md:text-5xl">
                      <Link to={`/work/${project.slug}`} className="transition-colors duration-300 hover:text-primary">
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-4 text-sm font-medium text-muted-foreground">{project.type}</p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        to={`/work/${project.slug}`}
                        className="group/btn inline-flex items-center gap-3 rounded-full border border-border bg-surface px-6 py-3.5 text-xs font-bold tracking-[.18em] text-foreground transition duration-300 hover:border-primary hover:bg-primary hover:text-black mono uppercase"
                      >
                        VIEW CASE STUDY
                        <ArrowUpRight size={14} className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                      </Link>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase"
                        >
                          LIVE SITE <ArrowUpRight size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-20 flex justify-center">
              <Link
                to="/work"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl"
              >
                <span>VIEW FULL PROJECT ARCHIVE ({displayProjects.length} PROJECTS)</span>
                <MoveUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={17} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {CONFIG_SHOW_CONTACT && (
        <Suspense fallback={<div className="h-96" />}>
          <ContactSection />
        </Suspense>
      )}

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
