import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Crosshair,
  Menu,
  MoveUpRight,
  Plus,
  X,
  Zap,
  Target,
  Layers,
  TrendingUp,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import RavanPhoto from "@/imports/Ravan.png";
import RavanPortrait from "@/imports/ravan_1.png";
import coverWuling from "@/imports/466885252088463.6a4df53862539.jpg";
import coverLimitless from "@/imports/cbfd4b251276815.6a33abf0bf48e.png";
import coverOmoda from "@/imports/063f86251210609.6a4670b82b027.png";
import { client, urlFor } from "../lib/sanityClient";
import { fetchSiteSettings, fetchProjects, fetchAboutSection } from "../lib/sanityQueries";
import { SiteSettings, ProjectItem, AboutSection as IAboutSection } from "../types/cms";
import BlogSection from "./components/blog/BlogSection";
import HeroPortrait from "./components/HeroPortrait";
import TestimonialsSection from "./components/TestimonialsSection";

/* ─── Motion tokens ─── */
const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

/* ─── Data ─── */
const projects = [
  {
    number: "01",
    title: "Wuling / Creative Campaign",
    type: "Art direction · Motion · Campaign",
    image: coverWuling,
    accent: "#e8fd52",
    year: "2024",
  },
  {
    number: "02",
    title: "Limitless Drive",
    type: "Brand identity · 3D · Automotive",
    image: coverLimitless,
    accent: "#ff764b",
    year: "2023",
  },
  {
    number: "03",
    title: "Omoda & Jaecoo",
    type: "Social system · Performance creative",
    image: coverOmoda,
    accent: "#f9ead4",
    year: "2023",
  },
];

const services = [
  { name: "Motion Design", relatedBlogSlug: "physics-of-kinetic-motion-timing-easing-curves", externalLink: "https://www.motiondesign.school" },
  { name: "Creative Direction", relatedBlogSlug: "client-communication-handling-revisions-design-choices", externalLink: "https://www.adweek.com" },
  { name: "Brand Identity", relatedBlogSlug: "building-brand-worlds-visual-systems", externalLink: "https://www.underconsideration.com/brandnew" },
  { name: "3D Design", relatedBlogSlug: "blender-3d-product-visualization-lighting-materials", externalLink: "https://www.vectary.com" },
  { name: "Digital Marketing", relatedBlogSlug: "saas-landing-page-ui-blueprints-conversion", externalLink: "https://www.marketingweek.com" },
  { name: "Performance Creative", relatedBlogSlug: "aida-framework-performance-creative-attention-action", externalLink: "https://www.marketingprofs.com" },
  { name: "Social Media Design", relatedBlogSlug: "short-form-video-blueprint-hooks-retention", externalLink: "https://www.socialmediatoday.com" },
  { name: "AI Assisted Design", relatedBlogSlug: "ai-assisted-design-workflows-creativity", externalLink: "https://www.smashingmagazine.com" },
];

const marqueeWords = [
  "MOTION",
  "BRAND WORLDS",
  "ART DIRECTION",
  "3D",
  "PERFORMANCE CREATIVE",
  "CAMPAIGN",
  "STRATEGY",
];

const stats = [
  { value: "8+", label: "Years crafting" },
  { value: "120+", label: "Projects shipped" },
  { value: "40M+", label: "Views driven" },
  { value: "18", label: "Awards & features" },
];

const principles = [
  {
    label: "ATTENTION",
    tools: "In a world of infinite scroll, attention is the only real currency.",
    relatedBlogSlug: "10-graphic-design-rules-art-directors-never-break",
  },
  {
    label: "MOTION",
    tools: "Static explains. Motion persuades. How it moves is the message.",
    relatedBlogSlug: "physics-of-kinetic-motion-timing-easing-curves",
  },
  {
    label: "TENSION",
    tools: "Great work isn't calm — it's controlled tension that keeps the eye awake.",
    relatedBlogSlug: "building-brand-worlds-visual-systems",
  },
];

const fieldNotes = [
  {
    role: "The 3-second rule",
    period: "N° 01",
    badge: "HOOK",
    desc1: "If it doesn't earn a second look in three seconds, it never will. The first frame does 80% of the work.",
    desc2: "Lead with tension, contrast or a question — never with a warm-up. The scroll is merciless and it never sleeps.",
    relatedBlogSlug: "10-graphic-design-rules-art-directors-never-break",
  },
  {
    role: "Kill your darlings",
    period: "N° 02",
    badge: "CRAFT",
    desc1: "The idea you love most is usually the one holding the work back. Ego is the enemy of clarity.",
    desc2: "Cut anything that serves the maker more than the message. What remains should feel inevitable, not decorated.",
    relatedBlogSlug: "client-communication-handling-revisions-design-choices",
  },
  {
    role: "Constraints are fuel",
    period: "N° 03",
    badge: "PROCESS",
    desc1: "A blank canvas is paralysing. A tight brief is a launchpad. Limits force the interesting decisions.",
    desc2: "The best ideas are born the moment someone says it can't be done — that's where the real design begins.",
    relatedBlogSlug: "overcoming-creative-burnout-design-frameworks",
  },
];

/* ─── Smooth cursor hook ─── */
function useSmoothCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 180, damping: 22, mass: 0.5 });
  const springY = useSpring(cursorY, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [cursorX, cursorY]);

  return { springX, springY };
}

/* ─── Reusable eyebrow label ─── */
function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/* ─── App ─── */
export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeExperience, setActiveExperience] = useState<number | null>(0);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<IAboutSection | null>(null);
  const [sanityProjects, setSanityProjects] = useState<ProjectItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });

    fetchProjects().then((data) => {
      if (data && data.length > 0) setSanityProjects(data);
    });

    client
      .fetch(`
        *[_type == "blog"] | order(featured desc, publishDate desc){
          _id,
          title,
          slug,
          excerpt,
          category,
          tags,
          featured,
          publishDate,
          readTime,
          coverImage
        }
      `)
      .then((data) => {
        setBlogPosts(data);
      })
      .catch(console.error);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  const headerBg = useTransform(scrollY, [0, 80], [0, 1]);
  const { springX, springY } = useSmoothCursor();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = [
    { label: "WORK", type: "scroll", target: "work" },
    { label: "ABOUT", type: "scroll", target: "about" },
    { label: "EXPERTISE", type: "scroll", target: "expertise" },
    { label: "NEWS", type: "link", target: "/news" },
    { label: "TOOLS", type: "link", target: "/tools" },
    { label: "BLOG", type: "link", target: "/blog" },
    { label: "CONTACT", type: "scroll", target: "contact" },
  ];

  const displayProjects = useMemo(() => {
    if (sanityProjects.length > 0) {
      return sanityProjects.map((p, index) => ({
        number: String(index + 1).padStart(2, "0"),
        title: p.title,
        slug: p.slug?.current || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        type: p.type || (p.tags && p.tags.length > 0 ? p.tags.join(" · ") : "Creative Project"),
        image: p.coverImage ? urlFor(p.coverImage)?.url() || projects[index % projects.length].image : projects[index % projects.length].image,
        accent: p.accent || "#e8fd52",
        year: p.year || "2025",
        liveUrl: p.liveUrl,
      }));
    }
    return projects.map((p) => ({
      ...p,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    }));
  }, [sanityProjects]);

  const heroTitle = siteSettings?.heroTitle || "MOVE THE NEEDLE.";
  const heroSubtitle = siteSettings?.heroSubtitle || "Senior creative designer blending motion, brand worlds and high-performing digital ideas into work that earns attention.";
  const availabilityStatus = siteSettings?.availabilityStatus || "AVAILABLE FOR SELECT WORK · Q3 2025";

  return (
    <main
      className="overflow-hidden bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <style>{`
        ::selection { background: var(--primary); color: var(--primary-foreground); }
        .eyebrow { font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; letter-spacing: .22em; text-transform: uppercase; }
        .mono { font-family: 'DM Mono', monospace; }
        .hero-image-wrap { overflow: hidden; border-radius: 1.75rem 1.75rem .25rem .25rem; transform: rotate(3deg); box-shadow: 0 40px 90px rgba(0,0,0,.5); max-height: 680px; object-fit: cover; }
        .hero-image { display: block; filter: saturate(.9) contrast(1.03); transition: transform 1.2s cubic-bezier(.2,.7,.2,1); object-fit: cover; }
        .hero-section:hover .hero-image { transform: scale(1.04); }
        .hero-vignette { background: radial-gradient(ellipse at 62% 38%, transparent 16%, rgba(16,16,16,.14) 52%, var(--background) 84%); }
        .project-art { transform: translateZ(0); transition: transform .7s cubic-bezier(.2,.7,.2,1), box-shadow .7s ease; }
        .project-card:hover .project-art { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) translateY(-8px); box-shadow: 0 34px 70px rgba(0,0,0,.28); }
        .project-art::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(115deg, rgba(255,255,255,.24), transparent 38%, rgba(0,0,0,.2)); pointer-events: none; }
        .marquee { display: flex; width: max-content; animation: marquee 34s linear infinite; }
        .marquee-track:hover .marquee { animation-play-state: paused; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        @media (max-width: 1024px) {
          .hero-image-wrap { max-height: 500px; width: 45vw; right: 2%; }
        }
        @media (max-width: 767px) {
          .hero-image-wrap { position: relative; right: auto; top: auto; height: 60vw; max-height: 360px; width: 100%; max-width: 320px; margin: 0 auto 1.5rem auto; opacity: .9; }
          .hero-vignette { background: radial-gradient(ellipse at 65% 36%, transparent 8%, rgba(16,16,16,.3) 48%, var(--background) 76%); }
        }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {/* Scroll progress */}
      <motion.div
        className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-primary"
        style={{ scaleX: progressScale }}
      />

      {/* Smooth cursor ring */}
      <motion.div
        className="pointer-events-none fixed z-[60] hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary mix-blend-difference md:block"
        style={{ left: springX, top: springY }}
      />

      {/* ── Header ── */}
      <motion.header className="fixed inset-x-0 top-0 z-50">
        <motion.div className="absolute inset-0 bg-background/90 backdrop-blur-md" style={{ opacity: headerBg }} />
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10 md:py-6">
          <button
            onClick={() => scrollTo("top")}
            className="group flex items-center gap-3 text-left mix-blend-difference"
            aria-label="Back to top"
          >
            {siteSettings?.logo ? (
              <img
                src={urlFor(siteSettings.logo)?.url() || ""}
                alt="Ravan Mammadov Logo"
                className="h-10 w-10 rounded-full object-contain border border-white/50 p-1"
              />
            ) : (
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/50 text-sm font-bold transition-transform duration-500 group-hover:rotate-45">
                R
              </span>
            )}
            <span className="hidden text-[10px] font-bold leading-tight tracking-[.24em] sm:block">
              RAVAN
              <br />
              MAMMADOV
            </span>
          </button>

          <nav className="hidden items-center gap-8 text-[11px] font-semibold tracking-[.16em] uppercase mix-blend-difference lg:flex">
            {navItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.label}
                  to={item.target}
                  className="text-[11px] font-semibold tracking-[.16em] uppercase transition-colors duration-300 hover:text-primary"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.target)}
                  className="text-[11px] font-semibold tracking-[.16em] uppercase transition-colors duration-300 hover:text-primary"
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          <button
            onClick={() => scrollTo("contact")}
            className="mix-blend-difference hidden items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-[10px] font-bold tracking-[.16em] transition duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground sm:flex"
          >
            {"LET'S TALK"} <ArrowUpRight size={13} />
          </button>

          <button
            className="mix-blend-difference grid h-10 w-10 place-items-center rounded-full border border-white/40 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 pt-16 lg:hidden"
          >
            {navItems.map((item, i) =>
              item.type === "link" ? (
                <Link
                  key={item.label}
                  to={item.target}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-4 border-b border-border py-6 text-left text-4xl font-semibold uppercase tracking-tight transition-colors hover:text-primary"
                >
                  <span className="mono text-xs text-muted-foreground">0{i + 1}</span>
                  {item.label}
                </Link>
              ) : (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  onClick={() => scrollTo(item.target)}
                  className="flex items-baseline gap-4 border-b border-border py-6 text-left text-4xl font-semibold uppercase tracking-tight transition-colors hover:text-primary"
                >
                  <span className="mono text-xs text-muted-foreground">0{i + 1}</span>
                  {item.label}
                </motion.button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section
        id="top"
        className="hero-section relative isolate min-h-screen px-6 pb-16 pt-32 md:px-10 md:pt-40"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          <div
            className="hero-image-wrap absolute right-[5%] top-[8%] h-[62vw] max-h-[790px] min-h-[450px] w-[43vw] min-w-[300px]"
            aria-hidden="true"
          >
          <HeroPortrait embedUrl={siteSettings?.heroEmbedUrl} />
          </div>
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
          <div className="hero-vignette absolute inset-0" />
        </div>

        {/* Corner coordinate detail */}
        <div className="absolute left-6 top-28 hidden text-[10px] tracking-[.2em] text-muted-foreground mono md:left-10 md:block">
          40.40° N
          <br />
          49.86° E
        </div>

        <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-[1600px] flex-col justify-end">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="mb-8 flex items-center gap-3 text-[11px] font-bold tracking-[.24em] text-primary mono"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            {availabilityStatus}
          </motion.div>

          <h1 className="max-w-[1280px] overflow-hidden text-[14.5vw] font-semibold leading-[.78] tracking-[-.09em] sm:text-[13vw] lg:text-[10.7vw]">
            {heroTitle.split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.15 + i * 0.14, ease: EASE }}
                className={`block ${i === 1 ? "ml-[9vw] text-primary" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="mt-12 grid items-end gap-8 border-t border-border pt-6 md:grid-cols-12"
          >
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground md:col-span-4">
              {heroSubtitle}
            </p>
            <div className="md:col-span-5" />
            <button
              onClick={() => scrollTo("work")}
              className="group flex items-center justify-between rounded-full border border-border px-6 py-4 text-[11px] font-bold tracking-[.18em] transition duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground md:col-span-3"
            >
              EXPLORE SELECTED WORK
              <ArrowDownRight className="transition-transform duration-300 group-hover:translate-y-1" size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee divider ── */}
      <div className="marquee-track relative overflow-hidden border-y border-border bg-surface py-5">
        <div className="marquee">
          {[...marqueeWords, ...marqueeWords].map((word, i) => (
            <span key={i} className="flex items-center gap-8 pr-8 text-lg font-semibold tracking-[-.02em] text-foreground/70">
              {word}
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Work ── */}
      <section id="work" className="bg-paper px-6 py-28 text-paper-foreground md:px-10 md:py-40">
        <div className="mx-auto max-w-[1600px]">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-16 flex items-end justify-between border-b border-black/15 pb-6"
          >
            <div>
              <p className="eyebrow text-black/45">Selected Work / 2022—2025</p>
              <h2 className="mt-5 text-6xl font-semibold tracking-[-.07em] md:text-8xl">Made to move.</h2>
            </div>
            <span className="hidden text-xs font-medium text-black/40 mono md:block">({String(displayProjects.length).padStart(2, '0')} — 25)</span>
          </motion.div>

          <div className="grid gap-x-6 gap-y-12 lg:grid-cols-3">
            {displayProjects.map((project, index) => (
              <motion.article
                key={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                custom={index * 0.12}
                onHoverStart={() => setHoveredProject(index)}
                onHoverEnd={() => setHoveredProject(null)}
                className="project-card cursor-pointer"
              >
                <Link to={`/work/${project.slug}`}>
                  <div className="project-art relative aspect-[16/11] overflow-hidden rounded-lg">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover object-center transition-transform duration-700"
                      style={{ transform: hoveredProject === index ? "scale(1.05)" : "scale(1)" }}
                    />
                    <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/45 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
                    <span className="absolute left-6 top-6 text-xs font-bold text-white mono">{project.number}</span>
                    <span className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-sm transition-all duration-500 hover:rotate-45 hover:bg-white/25">
                      <ArrowUpRight size={17} />
                    </span>
                    <div className="absolute bottom-6 left-6 text-[10px] tracking-[.2em] text-white mono">CREATIVE SYSTEMS™</div>
                    <div className="absolute bottom-6 right-6 text-[10px] tracking-[.15em] text-white/60 mono">{project.year}</div>
                  </div>
                  <div className="flex items-start justify-between gap-4 pt-6">
                    <div>
                      <h3 className="text-2xl font-semibold tracking-[-.04em]">{project.title}</h3>
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-[.14em] text-black/45">{project.type}</p>
                    </div>
                    <span className="mt-1.5 h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: project.accent }} />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <Link
            to="/work"
            className="group mt-16 flex w-full items-center justify-between border-y border-black/15 py-6 text-xs font-bold tracking-[.18em] transition-all duration-300 hover:px-4"
          >
            <span>VIEW FULL ARCHIVE</span>
            <MoveUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={17} />
          </Link>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="relative px-6 py-32 md:px-10 md:py-44">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Portrait */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4"
          >
            <div className="relative overflow-hidden rounded-lg border border-border">
              <ImageWithFallback
                src={aboutSection?.profilePhoto ? urlFor(aboutSection.profilePhoto)?.url() || RavanPortrait : RavanPortrait}
                alt="Portrait of Ravan Mammadov"
                className="aspect-[4/5] w-full object-cover object-top grayscale transition-all duration-700 hover:grayscale-0"
              />
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-background to-transparent p-5 text-[10px] tracking-[.2em] mono">
                <span>RAVAN MAMMADOV</span>
                <span className="text-primary">EST. BAKU</span>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Eyebrow className="text-muted-foreground">01 / About the practice</Eyebrow>
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
              className="mt-6 text-4xl font-medium leading-[1.05] tracking-[-.05em] sm:text-5xl lg:text-6xl"
            >
              {aboutSection?.heading || "I create visual energy for brands that refuse to blend in."}
            </motion.h2>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="mt-12 grid gap-8 border-t border-border pt-6 md:grid-cols-2"
            >
              <p className="text-base leading-relaxed text-muted-foreground">
                {aboutSection?.introParagraph1 ||
                  "From the first concept to the last frame, every detail is shaped to make an emotional impact. I work across motion, graphic design, art direction and growth-focused creative."}
              </p>
              <p className="text-base leading-relaxed text-muted-foreground">
                {aboutSection?.introParagraph2 ||
                  "My approach pairs a designer's eye with a marketer's clarity: beautiful ideas, built to be remembered and made to perform."}
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
              className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4"
            >
              {(aboutSection?.stats && aboutSection.stats.length > 0 ? aboutSection.stats : stats).map((s) => (
                <div key={s.label} className="bg-background p-6">
                  <p className="text-4xl font-semibold tracking-[-.05em] text-primary">{s.value}</p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-[.12em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Expertise ── */}
      <section id="expertise" className="bg-primary px-6 py-28 text-primary-foreground md:px-10 md:py-40">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-black/50">02 / Expertise</p>
            <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-[.92] tracking-[-.07em] md:text-7xl">
              A wider lens for ambitious ideas.
            </h2>
          </motion.div>
          <div className="mt-16 grid border-l border-t border-black/20 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => {
              const Content = (
                <div className="group flex min-h-44 flex-col justify-between border-b border-r border-black/20 p-6 transition-colors duration-300 hover:bg-background hover:text-primary">
                  <span className="text-[11px] font-bold text-black/40 mono group-hover:text-primary/60">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-[-.03em]">{service.name}</p>
                    <ArrowUpRight className="mt-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={16} />
                  </div>
                </div>
              );

              return (
                <motion.div
                  key={service.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.06}
                >
                  {service.relatedBlogSlug ? (
                    <Link to={`/blog/${service.relatedBlogSlug}`}>{Content}</Link>
                  ) : (
                    <a href={service.externalLink} target="_blank" rel="noreferrer">
                      {Content}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Process & Tools ── */}
      <section className="px-6 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <Eyebrow className="text-muted-foreground">03 / The Philosophy</Eyebrow>
              <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-5xl">
                Why some work sticks.
              </h2>
            </motion.div>
            <div className="lg:col-span-7 lg:col-start-6">
              {principles.map((group, index) => (
                <motion.div
                  key={group.label}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={index * 0.1}
                  className="border-t border-border py-8"
                >
                  <Link to={`/blog/${group.relatedBlogSlug}`} className="group block">
                    <div className="flex items-baseline justify-between gap-5">
                      <span className="text-[11px] font-bold tracking-[.2em] mono transition-colors group-hover:text-primary">
                        0{index + 1} / {group.label}
                      </span>
                      <Crosshair className="text-primary transition-transform group-hover:scale-125" size={16} />
                    </div>
                    <p className="mt-5 text-xl tracking-[-.03em] text-muted-foreground transition-colors group-hover:text-foreground md:text-3xl">
                      {group.tools}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Experience ── */}
      <section className="bg-surface px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Eyebrow className="text-muted-foreground">04 / Field Notes</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Rules worth breaking.
            </h2>
          </motion.div>
          <div className="mt-12 border-t border-border">
            {fieldNotes.map((exp, index) => (
              <div key={exp.role} className="border-b border-border">
                <button
                  onClick={() => setActiveExperience(activeExperience === index ? null : index)}
                  className="group flex w-full items-center justify-between gap-6 py-8 text-left"
                >
                  <span className="flex items-baseline gap-6">
                    <span className="hidden text-xs text-muted-foreground mono sm:block">{exp.period}</span>
                    <span className="text-2xl font-semibold tracking-[-.04em] transition-colors duration-300 group-hover:text-primary md:text-4xl">
                      {exp.role}
                    </span>
                  </span>
                  <span className="flex items-center gap-4 text-[10px] font-bold tracking-[.16em] text-muted-foreground mono">
                    <span className="hidden md:block">{exp.badge}</span>
                    <ChevronDown
                      className={`transition-transform duration-300 ${activeExperience === index ? "rotate-180 text-primary" : ""}`}
                      size={18}
                    />
                  </span>
                </button>
                <AnimatePresence>
                  {activeExperience === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 text-sm leading-relaxed text-muted-foreground md:grid-cols-2 md:pl-[calc(6rem+1.5rem)]">
                        <p>{exp.desc1}</p>
                        <div>
                          <p>{exp.desc2}</p>
                          {exp.relatedBlogSlug && (
                            <Link
                              to={`/blog/${exp.relatedBlogSlug}`}
                              className="mt-4 inline-flex items-center gap-2 text-xs font-bold tracking-widest text-primary mono uppercase hover:underline"
                            >
                              READ FULL ESSAY <ArrowUpRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialsSection />

      {/* ── Blog ── */}
      <BlogSection posts={blogPosts} />

      {/* ── Contact ── */}
      <section
        id="contact"
        className="relative overflow-hidden bg-paper px-6 py-32 text-paper-foreground md:px-10 md:py-44"
      >
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary opacity-70 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-destructive opacity-25 blur-3xl" />
        <div className="relative mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-black/45">06 / Start a conversation</p>
          </motion.div>

          <div className="grid gap-12 lg:grid-cols-12 mt-8 items-start">
            <div className="lg:col-span-7">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.1}
                className="text-[12vw] font-semibold leading-[.82] tracking-[-.09em] lg:text-[8vw]"
              >
                {"LET'S MAKE"}
                <br />
                <span className="text-destructive">SOMETHING</span>
                <br />
                MOVE.
              </motion.h2>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
                className="mt-12 space-y-6"
              >
                <p className="max-w-md text-base leading-relaxed text-black/70 font-medium">
                  Have an ambitious campaign, motion project, or visual system in mind? I'm always open to new creative partnerships.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href={`mailto:${siteSettings?.socialLinks?.email || "mammadovravan1@gmail.com"}`}
                    className="group inline-flex items-center gap-3 rounded-full bg-black text-white px-7 py-4 text-xs font-bold tracking-[.18em] uppercase transition duration-300 hover:bg-primary hover:text-black"
                  >
                    SEND EMAIL DIRECTLY
                    <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={16} />
                  </a>

                  {siteSettings?.resumeFileUrl && (
                    <a
                      href={siteSettings.resumeFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-black/30 px-6 py-4 text-xs font-bold tracking-[.18em] uppercase text-black hover:border-black hover:bg-black/10 transition-colors mono"
                    >
                      DOWNLOAD RESUME (PDF)
                    </a>
                  )}
                </div>

                {/* Social Links List */}
                <div className="mt-12 border-t border-black/15 pt-8">
                  <p className="text-xs font-bold tracking-widest text-black/50 mono uppercase mb-6">
                    CONNECT ACROSS PLATFORMS
                  </p>
                  <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-semibold tracking-tight text-black">
                    <a
                      href={siteSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan"}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                    >
                      BEHANCE
                    </a>
                    <a
                      href={siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/"}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                    >
                      LINKEDIN
                    </a>
                    <a
                      href={siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/"}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                    >
                      INSTAGRAM
                    </a>
                    <a
                      href={siteSettings?.socialLinks?.facebook || "https://www.facebook.com/rvnmmmdv/"}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                    >
                      FACEBOOK
                    </a>
                    <a
                      href={siteSettings?.socialLinks?.pinterest || "https://tr.pinterest.com/mammadovravan1/"}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary transition-colors underline decoration-2 underline-offset-4"
                    >
                      PINTEREST
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Contact Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
              className="lg:col-span-5 rounded-2xl border border-black/15 bg-white/70 backdrop-blur-md p-8 shadow-xl"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-black mb-2">
                Send a message
              </h3>
              <p className="text-xs text-black/60 mb-6">
                Fill out the details below and I'll respond within 24 hours.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thank you for your message! Ravan will get back to you shortly.");
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                    YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                    YOUR EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@company.com"
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                    PROJECT DETAILS
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell me about your timeline, scope, and vision..."
                    className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-black py-4 text-xs font-bold tracking-[.18em] uppercase text-white hover:bg-primary hover:text-black transition-colors"
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-10 md:px-10 border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a href={siteSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan"} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              BEHANCE
            </a>
            <a href={siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/"} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              LINKEDIN
            </a>
            <a href={siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/"} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              INSTAGRAM
            </a>
            <a href={`mailto:${siteSettings?.socialLinks?.email || "mammadovravan1@gmail.com"}`} className="transition-colors hover:text-primary">
              EMAIL
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}