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
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import RavanPhoto from "@/imports/Ravan.png";
import RavanPortrait from "@/imports/ravan_1.png";
import coverWuling from "@/imports/466885252088463.6a4df53862539.jpg";
import coverLimitless from "@/imports/cbfd4b251276815.6a33abf0bf48e.png";
import coverOmoda from "@/imports/063f86251210609.6a4670b82b027.png";
import { client, urlFor } from "../lib/sanityClient";
import { fetchSiteSettings, fetchProjects, fetchAboutSection, fetchTestimonials } from "../lib/sanityQueries";
import SiteHeader from "./components/SiteHeader";
import { SiteSettings, ProjectItem, AboutSection as IAboutSection, TestimonialItem } from "../types/cms";
import BlogSection from "./components/blog/BlogSection";
import HeroPortrait from "./components/HeroPortrait";
import TestimonialsSection from "./components/TestimonialsSection";
import SEO from "./components/SEO";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

function useSmoothCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  return { springX, springY };
}

const projects = [
  {
    number: "01",
    title: "Wuling / Creative Campaign",
    slug: "wuling-creative-campaign",
    type: "Art direction · Motion · Campaign",
    image: coverWuling,
    accent: "#e8fd52",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "02",
    title: "Limitless Drive",
    slug: "limitless-drive",
    type: "Brand identity · 3D · Automotive",
    image: coverLimitless,
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

const services = [
  {
    name: "3D & Motion Craft",
    externalLink: "#",
    relatedBlogSlug: "blender-3d-product-visualization-lighting-materials",
  },
  {
    name: "Brand Worlds & Systems",
    externalLink: "#",
    relatedBlogSlug: "building-brand-worlds-visual-systems",
  },
  {
    name: "Performance Creative",
    externalLink: "#",
    relatedBlogSlug: "performance-creative-scaling-testing-video",
  },
  {
    name: "Art Direction & Growth",
    externalLink: "#",
    relatedBlogSlug: "agency-grade-portfolio-blueprints-5-figure-clients",
  },
];

const principles = [
  {
    label: "Attention first",
    tools: "If the first 3 seconds don't hook, the rest of the message is invisible.",
    relatedBlogSlug: "short-form-video-blueprint-hooks-retention",
  },
  {
    label: "Clarity over complexity",
    tools: "Simple visual hierarchy always beats over-designed noise.",
    relatedBlogSlug: "visual-hierarchy-secrets-controlling-eye-flow",
  },
  {
    label: "Design made to scale",
    tools: "Every system should work smoothly from 16px icons to massive billboards.",
    relatedBlogSlug: "documenting-scalable-design-systems-tokens",
  },
];

const stats = [
  { value: "8+", label: "Years crafting" },
  { value: "120+", label: "Projects shipped" },
  { value: "40M+", label: "Views driven" },
  { value: "18", label: "Awards & features" },
];

export default function HomePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<IAboutSection | null>(null);
  const [sanityProjects, setSanityProjects] = useState<ProjectItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [aboutTab, setAboutTab] = useState<"about" | "testimonials">("about");

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactHoneypot, setContactHoneypot] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactErrorMessage, setContactErrorMessage] = useState("");

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus === "loading") return;

    setContactStatus("loading");
    setContactErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          projectDetails: contactMessage,
          honeypot: contactHoneypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactHoneypot("");
    } catch (err: any) {
      console.error("Contact form error:", err);
      setContactStatus("error");
      setContactErrorMessage(err.message || "Something went wrong. Please try again or send an email directly.");
    }
  };

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

    fetchTestimonials().then((data) => {
      if (data) setTestimonials(data);
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
  const { springX, springY } = useSmoothCursor();

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

  // Show max 3 featured projects on homepage
  const homepageProjects = useMemo(() => {
    return displayProjects.slice(0, 3);
  }, [displayProjects]);

  const heroTitle = siteSettings?.heroTitle || "MOVE THE NEEDLE.";
  const heroSubtitle = siteSettings?.heroSubtitle || "Senior creative designer blending motion, brand worlds and high-performing digital ideas into work that earns attention.";
  const availabilityStatus = siteSettings?.availabilityStatus || "AVAILABLE FOR SELECT WORK · Q3 2025";

  return (
    <main
      className="overflow-hidden bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Ravan Mammadov — Senior Creative Designer & Marketer"
        description="Portfolio of Ravan Mammadov. Blending 3D, motion design, brand worlds, and growth creative for global brands."
      />

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

      {/* ── 1. Unified Header ── */}
      <SiteHeader siteSettings={siteSettings} />

      {/* ── 1. Hero ── */}
      <section
        id="top"
        className="hero-section relative isolate min-h-screen px-6 pb-16 pt-32 md:px-10 md:pt-40"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          <div
            className="hero-image-wrap absolute right-[5%] top-[8%] h-[62vw] max-h-[790px] min-h-[450px] w-[43vw] min-w-[300px]"
            aria-hidden="true"
          >
            <HeroPortrait />
          </div>
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
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
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease: EASE }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-10 flex flex-col justify-between gap-8 pt-8 md:flex-row md:items-end border-t border-border/40"
          >
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground font-medium md:text-lg">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#work"
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-surface px-7 py-4 text-xs font-bold tracking-[.18em] transition duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground mono uppercase"
              >
                EXPLORE SELECTED WORK
                <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              <Link
                to="/ravanmammadov"
                className="text-xs font-bold tracking-[.18em] text-muted-foreground hover:text-primary transition-colors mono uppercase"
              >
                READ BIOGRAPHY →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Selected Work ── */}
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
              <Eyebrow className="text-muted-foreground">01 / Selected Work</Eyebrow>
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
                        src={project.image}
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
                        rel="noreferrer"
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

      {/* ── 3. Expertise ── */}
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

      {/* ── 4. News / Blog ── */}
      <BlogSection posts={blogPosts} />

      {/* ── 5. About (Integrated with Testimonials tab) ── */}
      <section id="about" className="relative px-6 py-32 md:px-10 md:py-44 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          {/* About Header with Tab Switcher */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-8 mb-16 gap-6">
            <div>
              <Eyebrow className="text-muted-foreground">04 / About the Practice</Eyebrow>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
                {aboutTab === "about" ? "Refusing to blend in." : "What Collaborators Say."}
              </h2>
            </div>

            {/* Tab Toggle */}
            <div className="inline-flex rounded-full border border-border bg-surface p-1.5 mono text-xs font-bold">
              <button
                onClick={() => setAboutTab("about")}
                className={`rounded-full px-6 py-2.5 transition-all duration-300 ${
                  aboutTab === "about" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                BIOGRAPHY & STATS
              </button>
              <button
                onClick={() => setAboutTab("testimonials")}
                className={`rounded-full px-6 py-2.5 transition-all duration-300 ${
                  aboutTab === "testimonials" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                COLLABORATOR REVIEWS ({testimonials.length})
              </button>
            </div>
          </div>

          {aboutTab === "about" ? (
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
              {/* Portrait */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:col-span-4"
              >
                <div className="relative overflow-hidden rounded-2xl border border-border">
                  <ImageWithFallback
                    src={aboutSection?.profilePhoto ? urlFor(aboutSection.profilePhoto)?.url() || RavanPortrait : RavanPortrait}
                    alt="Portrait of Ravan Mammadov"
                    className="aspect-[4/5] w-full object-cover object-top grayscale transition-all duration-700 hover:grayscale-0"
                  />
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-between bg-gradient-to-t from-background via-background/90 to-transparent p-5 text-[10px] tracking-[.2em] mono">
                    <span>RAVAN MAMMADOV</span>
                    <span className="text-primary font-bold">SENIOR DESIGNER</span>
                  </div>
                </div>
              </motion.div>

              <div className="lg:col-span-7 lg:col-start-6">
                <motion.h3
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-3xl font-medium leading-[1.1] tracking-[-.04em] md:text-5xl"
                >
                  {aboutSection?.heading || "I create visual energy for brands that refuse to blend in."}
                </motion.h3>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.2}
                  className="mt-10 grid gap-8 border-t border-border pt-6 md:grid-cols-2"
                >
                  <p className="text-base leading-relaxed text-muted-foreground font-medium">
                    {aboutSection?.introParagraph1 ||
                      "From the first concept to the last frame, every detail is shaped to make an emotional impact. I work across motion, graphic design, art direction and growth-focused creative."}
                  </p>
                  <p className="text-base leading-relaxed text-muted-foreground font-medium">
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
                  className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4"
                >
                  {(aboutSection?.stats && aboutSection.stats.length > 0 ? aboutSection.stats : stats).map((s) => (
                    <div key={s.label} className="bg-background p-6">
                      <p className="text-3xl font-bold tracking-[-.05em] text-primary mono">{s.value}</p>
                      <p className="mt-2 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground mono">{s.label}</p>
                    </div>
                  ))}
                </motion.div>

                <div className="mt-10 flex flex-wrap gap-6 items-center">
                  <Link
                    to="/ravanmammadov"
                    className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-xs font-bold tracking-[.18em] text-black uppercase transition hover:bg-white mono"
                  >
                    READ FULL BIOGRAPHY & CAREER <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Integrated Testimonials View inside About */
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <TestimonialsSection />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── 6. Contact ── */}
      <section
        id="contact"
        className="relative overflow-hidden bg-paper px-6 py-32 text-paper-foreground md:px-10 md:py-44"
      >
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary opacity-70 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-destructive opacity-25 blur-3xl" />
        <div className="relative mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-black/45">05 / Start a conversation</p>
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

              {contactStatus === "success" ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-lg font-bold text-black mb-2">Inquiry Received!</h4>
                  <p className="text-xs text-black/70 leading-relaxed mb-6">
                    Thank you for reaching out. Your message has been routed directly to Ravan's inbox.
                  </p>
                  <button
                    onClick={() => setContactStatus("idle")}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] font-bold tracking-widest text-white uppercase hover:bg-primary hover:text-black transition-colors mono"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {/* Anti-spam honeypot */}
                  <input
                    type="text"
                    name="hp_field"
                    value={contactHoneypot}
                    onChange={(e) => setContactHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  {contactStatus === "error" && (
                    <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-700 text-xs font-medium">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-600" />
                      <p>{contactErrorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      disabled={contactStatus === "loading"}
                      className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                      YOUR EMAIL
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jane@company.com"
                      disabled={contactStatus === "loading"}
                      className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-black/60 mono uppercase mb-1">
                      PROJECT DETAILS
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell me about your timeline, scope, and vision..."
                      disabled={contactStatus === "loading"}
                      className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-sm font-medium text-black placeholder:text-black/40 focus:border-black focus:outline-none disabled:opacity-50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    className="w-full rounded-lg bg-black py-4 text-xs font-bold tracking-[.18em] uppercase text-white hover:bg-primary hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {contactStatus === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>SUBMITTING INQUIRY...</span>
                      </>
                    ) : (
                      <span>SUBMIT INQUIRY</span>
                    )}
                  </button>
                </form>
              )}
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
            <a href={siteSettings?.socialLinks?.facebook || "https://www.facebook.com/rvnmmmdv/"} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              FACEBOOK
            </a>
            <a href={siteSettings?.socialLinks?.pinterest || "https://tr.pinterest.com/mammadovravan1/"} target="_blank" rel="noreferrer" className="transition-colors hover:text-primary">
              PINTEREST
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}