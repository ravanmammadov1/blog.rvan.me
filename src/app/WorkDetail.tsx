import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Calendar, User, ExternalLink, Tag } from "lucide-react";
import { PortableText } from "@portabletext/react";

import { fetchProjectBySlug, fetchProjects } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ProjectItem } from "../types/cms";
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
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchProjectBySlug(slug)
        .then((data) => setProject(data))
        .finally(() => setLoading(false));
    }
  }, [slug]);

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
          <p className="text-muted-foreground mb-8">The requested case study could not be found or is currently being updated.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition-all mono"
          >
            <ArrowLeft size={16} /> BACK TO HOME
          </Link>
        </div>
      </main>
    );
  }

  const coverUrl = project.coverImage ? urlFor(project.coverImage)?.url() : null;

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title={`${project.title} — Case Study`}
        description={project.description || `${project.title} by Ravan Mammadov`}
      />

      {/* Header / Nav */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 md:px-10">
          <Link
            to="/"
            className="group flex items-center gap-3 text-xs font-bold tracking-[.18em] uppercase hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>BACK TO WORK</span>
          </Link>
          <div className="flex items-center gap-6 text-[11px] font-semibold tracking-[.16em]">
            <Link to="/news" className="hover:text-primary transition-colors">
              NEWS
            </Link>
            <Link to="/tools" className="hover:text-primary transition-colors">
              TOOLS
            </Link>
            <Link to="/blog" className="hover:text-primary transition-colors">
              BLOG
            </Link>
          </div>
        </div>
      </header>

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
                  <p className="mt-1 text-sm font-semibold text-foreground">{project.type}</p>
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
                  <p className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">LIVE LINK</p>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    Visit Site <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Cover image */}
          {coverUrl && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-12 overflow-hidden rounded-xl border border-border"
            >
              <img
                src={coverUrl}
                alt={project.title}
                className="w-full max-h-[700px] object-cover"
              />
            </motion.div>
          )}

          {/* Case study body */}
          {project.body && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mt-16 mx-auto max-w-4xl"
            >
              <div className="mb-4 text-[11px] font-bold tracking-widest text-primary mono uppercase">
                OVERVIEW & EXECUTION
              </div>
              <PortableText value={project.body} components={portableTextComponents} />
            </motion.div>
          )}

          {/* Additional Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="mt-20 border-t border-border pt-16"
            >
              <h2 className="text-3xl font-semibold mb-8 tracking-tight">Project Visuals</h2>
              <div className="grid gap-8 sm:grid-cols-2">
                {project.gallery.map((img: any, idx: number) => {
                  const gUrl = urlFor(img)?.url();
                  if (!gUrl) return null;
                  return (
                    <div key={idx} className="overflow-hidden rounded-xl border border-border bg-surface">
                      <img src={gUrl} alt={img.alt || `Gallery image ${idx + 1}`} className="w-full object-cover aspect-[4/3]" />
                      {img.caption && (
                        <p className="p-4 text-xs text-muted-foreground mono border-t border-border">{img.caption}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
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
          <Link to="/" className="hover:text-primary transition-colors">
            ← BACK TO HOME WORK
          </Link>
        </div>
      </footer>
    </main>
  );
}
