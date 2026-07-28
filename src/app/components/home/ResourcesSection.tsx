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

export default function ResourcesSection() {
  const [resourcesList, setResourcesList] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Resources (published, sortPriority, featuredScore)
    client
      .fetch(`
        *[_type == "resource" && status == "published"] | order(sortPriority asc, featuredScore desc, _createdAt desc)[0...4]{
          _id,
          title,
          "slug": slug.current,
          resourceType,
          description,
          benefitSummary,
          link,
          logo,
          status,
          verificationStatus,
          isGlobal,
          countries,
          difficultyLevel,
          completionTime,
          badges
        }
      `)
      .then((data) => {
        setResourcesList(data || []);
      })
      .catch(console.error);
  }, []);

  return (
    <section id="resources" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">04 / Resources Directory</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Curated Knowledge.
            </h2>
          </div>
          <Link
            to="/resources"
            className="group hidden items-center gap-2 text-xs font-bold tracking-[.14em] text-muted-foreground transition-colors hover:text-primary mono md:flex"
          >
            VIEW ALL RESOURCES
            <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* Top resource types cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-12">
          {[
            { type: "aiCredits", label: "Free AI Credits", icon: "🤖", desc: "Credits and tokens for premium generative AI platforms." },
            { type: "studentPack", label: "Student Packs", icon: "🎒", desc: "Premium software licenses and packs for students." },
            { type: "roadmap", label: "Learning Roadmaps", icon: "🗺️", desc: "Step-by-step masterclass pathways for design and tech." },
            { type: "software", label: "Free Software", icon: "💻", desc: "Completely free design, development, and animation tools." },
            { type: "job", label: "Remote Jobs", icon: "💼", desc: "High-paying remote roles in creative and design fields." },
            { type: "hackathon", label: "Hackathons", icon: "⚡", desc: "Active hackathons, challenges, and prize program entries." }
          ].map((item, index) => (
            <motion.div
              key={item.type}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={index * 0.05}
            >
              <Link
                to={`/resources?type=${item.type}`}
                className="group flex h-full flex-col justify-between rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:bg-surface/80"
              >
                <div>
                  <span className="text-3xl block mb-4">{item.icon}</span>
                  <h3 className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-bold tracking-[.14em] text-primary mono uppercase">
                  <span>VIEW ALL</span>
                  <ArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured Resources */}
        {resourcesList.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resourcesList.map((resource, index) => (
              <motion.article
                key={resource._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.08}
                className="group rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:border-primary/50 hover:bg-surface/80 flex flex-col"
              >
                <div className="flex items-start gap-4 mb-4">
                  {resource.logo && (
                    <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-background overflow-hidden">
                      <img
                        src={urlFor(resource.logo)?.url() || ""}
                        alt={resource.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-wider text-muted-foreground mono uppercase mb-2">
                      {resource.resourceType && RESOURCE_TYPE_LABELS[resource.resourceType] && (
                        <span className="text-primary">{RESOURCE_TYPE_LABELS[resource.resourceType]}</span>
                      )}
                      {resource.verificationStatus && (
                        <span className="text-green-500">✓ Verified</span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold leading-tight text-foreground line-clamp-2">
                      {resource.title}
                    </h3>
                  </div>
                </div>
                {resource.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {resource.description}
                  </p>
                )}
                {resource.benefitSummary && (
                  <p className="text-xs leading-relaxed text-primary/80 mb-4 line-clamp-2">
                    {resource.benefitSummary}
                  </p>
                )}
                <div className="border-t border-border/50 pt-4 flex items-center justify-between text-xs font-bold tracking-widest text-primary mono uppercase">
                  <Link to={`/resources/${resource.slug}`} className="inline-flex items-center gap-1.5 hover:underline">
                    <span>VIEW DETAILS</span>
                    <ArrowUpRight size={12} />
                  </Link>
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      <span>EXTERNAL LINK</span>
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            to="/resources"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-lg"
          >
            EXPLORE FULL RESOURCES DIRECTORY
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}