import { useEffect, useState, useMemo } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { client, urlFor } from "../../../lib/sanityClient";
import { fetchAboutSection, fetchTestimonials } from "../../../lib/sanityQueries";
import { Eyebrow } from "../Eyebrow";
import TestimonialsSection from "../TestimonialsSection";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stats = [
  { value: "8+", label: "Years crafting" },
  { value: "120+", label: "Projects shipped" },
  { value: "40M+", label: "Views driven" },
  { value: "18", label: "Awards & features" },
];

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

export default function AboutSection() {
  const [aboutSection, setAboutSection] = useState<any>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [aboutTab, setAboutTab] = useState<"about" | "testimonials">("about");

  useEffect(() => {
    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });

    fetchTestimonials().then((data) => {
      if (data) setTestimonials(data);
    });
  }, []);

  return (
    <section id="about" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 10% 30%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-white/10 pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">07 / Creative Platform & Publication</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Behind the publication.
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Bio & Stats */}
          <div className="flex flex-col justify-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.1}
            >
              <p className="text-base leading-relaxed text-muted-foreground font-medium md:text-lg mb-6">
                This platform is curated by Ravan Mammadov—Senior Creative Designer and Art Director. 
                Our mission is to share advanced insights, resources, and free tools to help designers and marketing creatives build high-impact digital experiences.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground/80 font-medium md:text-base mb-10">
                We believe that the intersection of design, motion, and clear marketing strategy is where true engagement happens. 
                Explore our curated directories, frameworks, and articles designed to build authority.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.2}
              className="grid grid-cols-2 gap-6 md:grid-cols-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="text-center rounded-2xl border border-white/10 bg-white/5 p-4 glass-stat">
                  <div className="text-2xl md:text-3xl font-bold tracking-tight text-primary mono">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Services */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.3}
              className="mt-12"
            >
              <h3 className="text-sm font-semibold tracking-tight text-foreground mb-6">
                Core Domains & Frameworks
              </h3>
              <div className="space-y-3">
                {services.map((service, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-white/10 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    <span>{service.name}</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Profile Photo & Testimonials */}
          <div className="relative">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.15}
              className="relative rounded-3xl overflow-hidden border border-white/10"
            >
              {aboutSection?.profilePhoto ? (
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-background">
                  <img
                    src={urlFor(aboutSection.profilePhoto)?.width(800)?.height(1067)?.url() || ""}
                    alt="Ravan Mammadov"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-background">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Profile Photo
                  </div>
                </div>
              )}
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0.25}
              className="mt-8"
            >
              <div className="flex gap-4 border-b border-white/10 mb-6">
                <button
                  onClick={() => setAboutTab("about")}
                  className={`pb-3 text-sm font-bold tracking-[.14em] mono uppercase transition-all ${
                    aboutTab === "about" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Philosophy
                </button>
                <button
                  onClick={() => setAboutTab("testimonials")}
                  className={`pb-3 text-sm font-bold tracking-[.14em] mono uppercase transition-all ${
                    aboutTab === "testimonials" ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Reviews & Feedback
                </button>
              </div>

              <AnimatePresence mode="wait">
                {aboutTab === "about" && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {aboutSection?.experience && aboutSection.experience.length > 0 ? (
                      <div className="space-y-6">
                        {aboutSection.experience.map((exp: any, i: number) => (
                          <div key={i} className="space-y-2 p-4 rounded-xl border border-white/10 bg-white/5 glass">
                            <div className="flex items-center justify-between gap-4">
                              <h4 className="text-base font-semibold text-foreground">{exp.role}</h4>
                              <span className="text-[10px] font-bold tracking-[.14em] text-muted-foreground mono uppercase whitespace-nowrap">
                                {exp.period}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{exp.company}</p>
                            {exp.description && <p className="text-[11px] text-muted-foreground/80 font-medium">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground p-4 rounded-xl border border-white/10 bg-white/5 glass">
                        Crafting visual systems that drive engagement. Publications updated weekly.
                      </p>
                    )}
                  </motion.div>
                )}
                {aboutTab === "testimonials" && (
                  <motion.div
                    key="testimonials"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TestimonialsSection testimonials={testimonials} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}