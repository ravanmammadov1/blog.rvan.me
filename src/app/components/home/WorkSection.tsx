import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fallbackProjects = [
  {
    number: "01",
    title: "Wuling / Creative Campaign",
    slug: "wuling-creative-campaign",
    type: "Art direction · Motion · Campaign",
    image: { large: "/assets/466885252088463.6a4df53862539-1200.webp", medium: "/assets/466885252088463.6a4df53862539-800.webp" },
    accent: "#e8fd52",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "02",
    title: "Limitless Drive",
    slug: "limitless-drive",
    type: "Brand identity · 3D · Automotive",
    image: { large: "/assets/cbfd4b251276815.6a33abf0bf48e-1200.webp", medium: "/assets/cbfd4b251276815.6a33abf0bf48e-800.webp" },
    accent: "#ff764b",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "03",
    title: "Omoda & Jaecoo",
    slug: "omoda-jaecoo",
    type: "Creative suite · Motion system",
    image: "/assets/063f86251210609.6a4670b82b027.png",
    accent: "#5ce1e6",
    year: "2025",
    liveUrl: undefined as string | undefined,
  },
];

export default function WorkSection() {
  const [sanityProjects, setSanityProjects] = useState<any[]>([]);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    // Fetch Projects
    client
      .fetch(`
        *[_type == "projects"] | order(order asc, _createdAt desc){
          _id,
          title,
          slug,
          coverImage,
          client,
          description,
          type,
          tags,
          body,
          gallery,
          liveUrl,
          year,
          accent,
          order
        }
      `)
      .then((data) => {
        if (data && data.length > 0) setSanityProjects(data);
      })
      .catch(console.error);
  }, []);

  const displayProjects = useMemo(() => {
    if (sanityProjects.length > 0) {
      return sanityProjects.map((p, index) => ({
        number: String(index + 1).padStart(2, "0"),
        title: p.title,
        slug: p.slug?.current || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        type: p.type || (p.tags && p.tags.length > 0 ? p.tags.join(" · ") : "Creative Project"),
        image: p.coverImage ? urlFor(p.coverImage)?.url() || fallbackProjects[index % fallbackProjects.length].image : fallbackProjects[index % fallbackProjects.length].image,
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

  return (
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
              Case studies.
            </h2>
          </div>
          <Link
            to="/work"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            VIEW ALL WORK
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {homepageProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index * 0.1}
              className="group relative"
            >
              <Link
                to={`/work/${project.slug}`}
                className="block rounded-2xl overflow-hidden bg-surface border border-border transition-all duration-500 hover:border-primary"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {typeof project.image === "object" && project.image.large ? (
                    <picture>
                      <source media="(max-width: 768px)" srcSet={project.image.medium} type="image/webp" />
                      <img
                        src={project.image.large}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </picture>
                  ) : (
                    <img
                      src={project.image as string}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-white mono uppercase mb-2">
                      <span style={{ color: project.accent }}>{project.number}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="text-xl font-semibold leading-tight text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/80 line-clamp-2">
                      {project.type}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                <Link to={`/work/${project.slug}`} className="inline-flex items-center gap-1.5 hover:underline">
                  <span>VIEW CASE STUDY</span>
                  <ArrowUpRight size={12} />
                </Link>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:underline"
                  >
                    <span>LIVE PROJECT</span>
                    <ArrowUpRight size={12} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            to="/work"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg"
          >
            EXPLORE FULL WORK ARCHIVE
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}