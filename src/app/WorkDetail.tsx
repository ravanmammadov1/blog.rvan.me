import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Calendar, User, ExternalLink, Tag } from "lucide-react";
import { PortableText } from "@portabletext/react";

import { fetchProjectBySlug, fetchProjects, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ProjectItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

const fallbackProjects: ProjectItem[] = [
  {
    _id: "xor-valentine-s-luxury-edition",
    title: "Xor — Valentine's Luxury Edition",
    slug: { current: "xor-valentine-s-luxury-edition" },
    client: "Xor Mobile Luxury",
    type: "3D Brand World · Motion · Product Launch",
    tags: ["3D Design", "Motion", "Luxury", "Product Launch"],
    year: "2025",
    accent: "#ff3b30",
    description: "Exclusive luxury product launch campaign featuring 3D WebGL asset pipelines, kinetic video ads, and digital brand collateral for Xor's Valentine Edition.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Project Overview" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Xor Mobile is a bespoke luxury communications brand engineering hand-crafted titanium handsets. For their flagship Valentine's Luxury Edition release, Ravanimate was commissioned to lead creative direction, 3D product visualization, and multi-channel campaign motion graphics.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "The Challenge" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Luxury tech requires a delicate balance between engineering precision and emotional prestige. The challenge was to communicate the tactile warmth of rose gold and handcrafted leather while maintaining a sleek, modern visual aesthetic across digital touchpoints.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Creative Direction & Motion System" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "We established a high-contrast low-key studio lighting setup with 3-point rim highlights. Motion physics featured deliberate, slow rotation timing with cubic-bezier easing to emphasize weight and physical craftsmanship.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Results & Impact" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The campaign generated over 4.2 Million organic impressions across digital launch channels and increased pre-order inquiry rates by 34% during launch week.",
          },
        ],
      },
    ],
  },
  {
    _id: "wuling-creative-campaign",
    title: "Wuling / Creative Campaign",
    slug: { current: "wuling-creative-campaign" },
    client: "Wuling Motors",
    type: "Art direction · Motion · Campaign",
    tags: ["Motion", "Campaign", "Art Direction", "Automotive"],
    year: "2024",
    accent: "#e8fd52",
    description: "National EV campaign blending kinetic motion graphics, commercial 3D renders, and social performance ads.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Project Overview" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "A comprehensive digital campaign for Wuling's urban electric vehicle series, targeting young urban professionals with energetic visual storytelling.",
          },
        ],
      },
    ],
  },
  {
    _id: "limitless-drive",
    title: "Limitless Drive",
    slug: { current: "limitless-drive" },
    client: "Limitless Automotive",
    type: "Brand identity · 3D · Automotive",
    tags: ["Brand Identity", "3D", "Automotive", "Visual System"],
    year: "2023",
    accent: "#ff764b",
    description: "3D brand identity and visual ecosystem for performance automotive enthusiasts.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Project Overview" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Limitless Drive required an authoritative visual identity and 3D brand world for their high-performance automotive media platform.",
          },
        ],
      },
    ],
  },
];

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      const imgUrl = urlFor(value)?.url();
      return (
        <figure className="my-10 overflow-hidden rounded-xl border border-border">
          <img
            src={imgUrl}
            alt={value.alt || "Project visual"}
            className="w-full max-h-[600px] object-cover"
          />
          {value.caption && (
            <figcaption className="p-3 text-center text-xs text-muted-foreground mono border-t border-border bg-surface">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="mt-10 mb-4 text-3xl font-semibold tracking-tight text-foreground">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-foreground">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-base leading-relaxed text-muted-foreground">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 border-l-2 border-primary pl-6 text-xl italic text-foreground bg-surface/50 py-4 pr-6 rounded-r">
        {children}
      </blockquote>
    ),
  },
};

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    async function loadData() {
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [fetchedProject, all] = await Promise.all([
          fetchProjectBySlug(slug),
          fetchProjects(),
        ]);

        const projectList = all && all.length > 0 ? all : fallbackProjects;
        setAllProjects(projectList);

        if (fetchedProject) {
          setProject(fetchedProject);
        } else {
          // Robust fallback match by slug or title pattern
          const slugClean = slug.toLowerCase().trim();
          const match = projectList.find(
            (p) =>
              p.slug?.current?.toLowerCase() === slugClean ||
              p._id === slug ||
              p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slugClean)
          ) || fallbackProjects[0];

          setProject(match);
        }
      } catch (err) {
        console.error("Error loading project detail:", err);
        const match = fallbackProjects.find((p) => p.slug?.current === slug) || fallbackProjects[0];
        setProject(match);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/work");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground grid place-items-center">
        <p className="text-sm font-semibold tracking-widest text-muted-foreground mono animate-pulse">
          LOADING CASE STUDY...
        </p>
      </div>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-32">
        <SEO title="Project Not Found — Ravan Mammadov" />
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold mb-4">Project Case Study Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested case study could not be found.</p>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all mono"
          >
            <ArrowLeft size={16} /> BACK TO WORK ARCHIVE
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = project.coverImage ? urlFor(project.coverImage)?.url() : null;

  const currentIndex = allProjects.findIndex(
    (p) => p.slug?.current === slug || p._id === project._id || p.title === project.title
  );
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${project.title} — Case Study`}
        description={project.description || `${project.title} by Ravan Mammadov`}
      />

      {/* Global Unified Header */}
      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-16 pb-12 md:px-10 md:pt-24">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold tracking-widest text-primary mono mb-6">
              <span>{project.year || "2025"}</span>
              {project.type && <span>· {project.type}</span>}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-7xl lg:text-8xl text-foreground leading-[0.95]">
              {project.title}
            </h1>

            {project.description && (
              <p className="mt-8 text-xl text-muted-foreground max-w-3xl leading-relaxed">
                {project.description}
              </p>
            )}

            {/* Metadata Bar */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-border py-6">
              {project.client && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">CLIENT</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{project.client}</p>
                </div>
              )}
              {project.type && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">DISCIPLINE</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{project.type.split("·")[0]}</p>
                </div>
              )}
              {project.year && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">YEAR</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{project.year}</p>
                </div>
              )}
              {project.liveUrl && (
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">LIVE PROJECT</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <span>VISIT SITE</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover Image Banner */}
      {coverUrl && (
        <section className="px-6 py-6 md:px-10">
          <div className="mx-auto max-w-[1600px] overflow-hidden rounded-2xl border border-border aspect-[21/9] bg-surface">
            <img
              src={coverUrl}
              alt={project.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        </section>
      )}

      {/* Body Content / Case Study */}
      <section className="px-6 py-16 md:px-10">
        <div className="mx-auto max-w-4xl">
          {Array.isArray(project.body) && project.body.length > 0 ? (
            <div className="prose prose-invert max-w-none">
              <PortableText value={project.body} components={portableTextComponents} />
            </div>
          ) : (
            <div className="space-y-8 text-muted-foreground leading-relaxed">
              <h2 className="text-2xl font-semibold text-foreground">Project Highlights</h2>
              <p>
                {project.description || "Comprehensive brand identity, 3D visual direction, and digital performance campaign."}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Previous & Next Navigation */}
      {(prevProject || nextProject) && (
        <div className="border-t border-border mt-20 pt-12 px-6 md:px-10">
          <div className="mx-auto max-w-[1600px] grid gap-6 sm:grid-cols-2">
            {prevProject ? (
              <Link
                to={`/work/${prevProject.slug?.current || prevProject._id}`}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary"
              >
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">← PREVIOUS CASE STUDY</span>
                <p className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{prevProject.title}</p>
              </Link>
            ) : <div />}

            {nextProject ? (
              <Link
                to={`/work/${nextProject.slug?.current || nextProject._id}`}
                className="group flex flex-col justify-between items-end rounded-xl border border-border bg-surface p-6 transition-all hover:border-primary text-right"
              >
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">NEXT CASE STUDY →</span>
                <p className="mt-2 text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{nextProject.title}</p>
              </Link>
            ) : <div />}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border px-6 py-12 md:px-10 mt-20">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <Link to="/work" className="hover:text-primary transition-colors">
            ← BACK TO WORK ARCHIVE
          </Link>
        </div>
      </footer>
    </main>
  );
}
