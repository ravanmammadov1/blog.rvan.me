import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Search, X, FolderKanban } from "lucide-react";

import { fetchProjects, fetchSiteSettings } from "../lib/sanityQueries";
import { urlFor } from "../lib/sanityClient";
import { ProjectItem, SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

// Fallback projects if Sanity has no items yet
const fallbackProjects: ProjectItem[] = [
  {
    _id: "p1",
    title: "Wuling / Creative Campaign",
    slug: { current: "wuling-creative-campaign" },
    client: "Wuling Motors",
    type: "Art direction · Motion · Campaign",
    tags: ["Motion", "Campaign", "Art Direction"],
    year: "2024",
    accent: "#e8fd52",
  },
  {
    _id: "p2",
    title: "Limitless Drive",
    slug: { current: "limitless-drive" },
    client: "Limitless",
    type: "Brand identity · 3D · Automotive",
    tags: ["Brand Identity", "3D", "Automotive"],
    year: "2023",
    accent: "#e8fd52",
  },
  {
    _id: "p3",
    title: "Omoda & Jaecoo",
    slug: { current: "omoda-jaecoo" },
    client: "Omoda & Jaecoo",
    type: "Social system · Performance creative",
    tags: ["Social Media", "Performance Creative"],
    year: "2023",
    accent: "#ff3b30",
  },
  {
    _id: "p4",
    title: "Brand Motion System",
    slug: { current: "brand-motion-system" },
    client: "Ravanimate Practice",
    type: "Motion Design · Visual Identity",
    tags: ["Motion", "Visual Identity"],
    year: "2024",
    accent: "#e8fd52",
  },
  {
    _id: "p5",
    title: "Growth Creative Suite",
    slug: { current: "growth-creative-suite" },
    client: "Performance Media Agency",
    type: "Performance Creative · Digital Marketing",
    tags: ["Performance Creative", "Digital Marketing"],
    year: "2025",
    accent: "#34c759",
  },
];

export default function WorkArchive() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
    fetchProjects()
      .then((data) => {
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects);
        }
      })
      .catch((err) => {
        console.error("Error loading projects archive:", err);
        setProjects(fallbackProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  // Primary 8 categories in order of importance
  const PRIMARY_CATEGORIES = [
    "All",
    "Motion Design",
    "3D",
    "Branding",
    "Automotive",
    "Commercial",
    "Digital Marketing",
    "Art Direction",
  ] as const;

  // Map arbitrary tags / types to primary taxonomy
  const mapToPrimaryCategory = (rawTag: string): string | null => {
    const lower = rawTag.toLowerCase().trim();
    if (!lower) return null;

    if (lower.includes("motion")) return "Motion Design";
    if (lower.includes("3d")) return "3D";
    if (
      lower.includes("brand") ||
      lower.includes("visual identity") ||
      lower.includes("identity") ||
      lower.includes("visual system") ||
      lower.includes("social system")
    ) {
      return "Branding";
    }
    if (lower.includes("automotive") || lower.includes("car")) return "Automotive";
    if (
      lower.includes("campaign") ||
      lower.includes("commercial") ||
      lower.includes("product launch") ||
      lower.includes("performance creative") ||
      lower.includes("video ad")
    ) {
      return "Commercial";
    }
    if (
      lower.includes("digital marketing") ||
      lower.includes("cro") ||
      lower.includes("marketing") ||
      lower.includes("growth") ||
      lower.includes("social media")
    ) {
      return "Digital Marketing";
    }
    if (lower.includes("art direction") || lower.includes("creative direction")) {
      return "Art Direction";
    }

    return null;
  };

  const tagsList = useMemo(() => {
    // Only present categories that actually match projects in the database or fallback
    const availableCategories = new Set<string>(["All"]);

    projects.forEach((p) => {
      const candidates = [...(p.tags || []), ...(p.type ? p.type.split("·").map((s) => s.trim()) : [])];
      candidates.forEach((cand) => {
        const mapped = mapToPrimaryCategory(cand);
        if (mapped) availableCategories.add(mapped);
      });
    });

    // Return in defined primary order
    return PRIMARY_CATEGORIES.filter((cat) => availableCategories.has(cat));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const slugStr = p.slug?.current || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const projectTagsAndTypes = [
        ...(p.tags || []),
        ...(p.type ? p.type.split("·").map((s) => s.trim()) : []),
      ];

      const mappedCategories = projectTagsAndTypes
        .map(mapToPrimaryCategory)
        .filter(Boolean) as string[];

      const matchesCategory =
        activeTag === "All" || mappedCategories.includes(activeTag);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.client && p.client.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.type && p.type.toLowerCase().includes(q)) ||
        slugStr.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeTag, searchQuery]);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title="Portfolio Work Archive & Case Studies — Ravan Mammadov"
        description="Explore selected case studies across 3D motion design, commercial art direction, automotive campaign suites, and high-converting performance creative."
        url="https://www.rvan.me/work"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero section */}
      <section className="px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4">SELECTED CASE STUDIES</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              Work Archive.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Explore case studies across motion graphics, 3D identity, commercial art direction, and high-converting performance creative.
            </p>
          </motion.div>

          {/* Filter & Search Bar */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-t border-border pt-8"
          >
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {tagsList.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "border border-border bg-surface hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Input — Expanded by ~25% (w-80 -> w-96) */}
            <div className="relative w-full md:w-96 shrink-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-surface pl-10 pr-9 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-xl border border-border bg-surface animate-pulse" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center my-12">
              <FolderKanban className="mx-auto text-muted-foreground mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">No Projects Match Your Filter</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6">
                Try searching for a different keyword or select "All" categories to view available case studies.
              </p>
              <button
                onClick={() => {
                  setActiveTag("All");
                  setSearchQuery("");
                }}
                className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground mono"
              >
                RESET FILTERS
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project, index) => {
                const slugStr =
                  project.slug?.current ||
                  project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                const imageUrl = project.coverImage
                  ? urlFor(project.coverImage)?.url() || ""
                  : "";

                return (
                  <motion.article
                    key={project._id || index}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    custom={index * 0.08}
                    onHoverStart={() => setHoveredProject(index)}
                    onHoverEnd={() => setHoveredProject(null)}
                    className="group cursor-pointer"
                  >
                    <Link to={`/work/${slugStr}`}>
                      <div className="relative aspect-[16/11] overflow-hidden rounded-xl border border-border bg-surface">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover object-center transition-transform duration-700"
                            style={{
                              transform: hoveredProject === index ? "scale(1.05)" : "scale(1)",
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col justify-between p-6 bg-gradient-to-br from-surface to-background">
                            <span className="text-[10px] font-bold tracking-widest text-primary mono uppercase">
                              {project.year || "2025"}
                            </span>
                            <div>
                              <p className="text-2xl font-semibold tracking-tight">{project.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">{project.client}</p>
                            </div>
                          </div>
                        )}
                        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-primary group-hover:text-black">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 pt-5">
                        <div>
                          <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                            {project.type || project.client || "Creative Project"}
                          </p>
                        </div>
                        {project.accent && (
                          <span
                            className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                            style={{ backgroundColor: project.accent }}
                          />
                        )}
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
