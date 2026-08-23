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
    transition: { duration: 0.9, delay, ease: "easeInOut" },
  }),
};

const fallbackProjects = [
  {
    number: "01",
    title: "Wuling / Creative Campaign",
    slug: "wuling-creative-campaign",
    type: "Art direction · Motion · Campaign",
    image: { large: "/assets/466885252088463.6a4df53862539-1200.webp", medium: "/assets/466885252088463.6a4df53862539-800.webp" },
    accent: "#61c5ad",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "02",
    title: "Limitless Drive",
    slug: "limitless-drive",
    type: "Brand identity · 3D · Automotive",
    image: { large: "/assets/cbfd4b251276815.6a33abf0bf48e-1200.webp", medium: "/assets/cbfd4b251276815.6a33abf0bf48e-800.webp" },
    accent: "#426fba",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
  {
    number: "03",
    title: "Omoda & Jaecoo",
    slug: "omoda-jaecoo",
    type: "Creative suite · Motion system",
    image: "/assets/063f86251210609.6a4670b82b027.png",
    accent: "#984f9f",
    year: "2024",
    liveUrl: undefined as string | undefined,
  },
];

export default function WorkSection() {
  const [sanityProjects, setSanityProjects] = useState<any[]>([]);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "projects" && (status == "published" || !defined(status))] | order(orderAsc asc, year desc)[0..5]{
          _id,
          title,
          "slug": slug.current,
          category,
          year,
          coverImage,
          accentColor,
          liveUrl,
          orderAsc
        }`
      )
      .then((data) => {
        if (data && data.length > 0) {
          setSanityProjects(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch projects from Sanity, using fallback:", err);
      });
  }, []);

  const projectsToRender = useMemo(() => {
    if (sanityProjects.length > 0) {
      return sanityProjects.map((p, idx) => {
        const numStr = (idx + 1).toString().padStart(2, "0");
        let imgUrl = "";
        if (p.coverImage) {
          imgUrl = urlFor(p.coverImage).width(1200).url();
        }

        return {
          number: numStr,
          title: p.title,
          slug: p.slug,
          type: p.category || "Creative Design",
          image: imgUrl || fallbackProjects[idx % fallbackProjects.length].image,
          accent: p.accentColor || "#61c5ad",
          year: p.year || "2024",
          liveUrl: p.liveUrl,
        };
      });
    }
    return fallbackProjects;
  }, [sanityProjects]);

  return (
    <section id="work" className="relative px-6 py-24 md:px-10 md:py-36 bg-background text-foreground">
      <div className="mx-auto max-w-[1600px]">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <Eyebrow number="01" label="SELECTED WORK" />
            <h2
              className="font-bold tracking-tight leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2rem, 4.5vw, 4.2rem)" }}
            >
              Crafting stories.
              <br />
              <span className="text-muted-foreground">Building brands.</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-muted-foreground font-medium max-w-md leading-relaxed">
            A curated collection of visual identities, motion design campaigns, and digital experiences created for global brands.
          </p>
        </motion.div>

        {/* Project Cards Grid */}
        <div className="grid gap-8 md:gap-12 md:grid-cols-2 lg:grid-cols-3">
          {projectsToRender.map((project, idx) => {
            const isObjectImage = typeof project.image === "object" && project.image !== null;
            const srcSet = isObjectImage
              ? `${(project.image as any).medium} 800w, ${(project.image as any).large} 1200w`
              : undefined;
            const imgSrc = isObjectImage ? (project.image as any).large : (project.image as string);

            return (
              <motion.div
                key={project.slug || idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={idx * 0.15}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#61c5ad]/50 hover:bg-white/[0.05] aurora-card"
              >
                <div>
                  {/* Card Art Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/40 mb-6 border border-white/10">
                    <img
                      src={imgSrc}
                      srcSet={srcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={project.title}
                      loading={idx < 2 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-bold mono text-white backdrop-blur-md">
                      <span>{project.number}</span>
                      <span className="text-white/40">/</span>
                      <span>{project.year}</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mb-2 text-xs font-bold mono uppercase tracking-wider text-[#61c5ad]">
                    {project.type}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>

                {/* Footer Action */}
                <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                  <span>{project.liveUrl ? "VIEW LIVE SITE" : "VIEW CASE STUDY"}</span>
                  <div className="grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 group-hover:border-[#61c5ad] group-hover:bg-[#61c5ad] group-hover:text-black">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Projects CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            to="/work"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-xs font-bold tracking-[.18em] text-foreground uppercase transition-all duration-300 hover:border-[#61c5ad]/50 hover:bg-white/10 glass"
          >
            <span>VIEW ALL ARCHIVED PROJECTS</span>
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
