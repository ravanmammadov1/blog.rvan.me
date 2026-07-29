import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  UserCheck,
  Zap,
  Globe,
  Mail,
} from "lucide-react";

import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";
import { client, urlFor } from "../lib/sanityClient";
import { fetchAboutSection, fetchSiteSettings, fetchTestimonials } from "../lib/sanityQueries";
import { AboutSection as IAboutSection, SiteSettings, TestimonialItem } from "../types/cms";
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

const timelineEvents = [
  {
    year: "2024 — PRESENT",
    role: "Senior Creative Director & Motion Strategist",
    company: "Independent Practice",
    desc: "Directing high-stakes motion campaigns, WebGL visual systems, and brand launches for global automotive and tech brands including Wuling Motors, Omoda, and Jaecoo.",
  },
  {
    year: "2021 — 2024",
    role: "Lead Creative Designer",
    company: "Digital Agency Network",
    desc: "Led visual identity systems, 3D product visualizations, and performance creative pipelines generating over 40M+ views across digital channels.",
  },
  {
    year: "2018 — 2021",
    role: "Motion & Graphic Designer",
    company: "Creative Studio",
    desc: "Crafted brand worlds, editorial typography, and kinetic animation for tech startups, luxury retail, and SaaS platforms.",
  },
];

const skillsList = [
  { category: "3D & Motion Craft", skills: ["Blender 3D", "After Effects", "Cinema 4D", "Rive", "Kinetic Typography", "Character & Product Rigging"] },
  { category: "Brand & Visual Systems", skills: ["Art Direction", "Visual Hierarchy", "Design Tokens", "Figma Power Workflows", "Dark Mode UI Systems", "Editorial Design"] },
  { category: "Growth & Performance", skills: ["Performance Creative", "AIDA Campaign Architecture", "CRO Landing Pages", "Digital Marketing Strategy", "AI Creative Workflows"] },
];

const awardsList = [
  { title: "Gold Winner — Best Motion Campaign", issuer: "International Motion Awards", year: "2025" },
  { title: "Site of the Day / Featured Case Study", issuer: "Behance Design Showcase", year: "2025" },
  { title: "Excellence in Brand Identity Systems", issuer: "Creative Craft Guild", year: "2024" },
  { title: "40M+ Digital Views Milestone", issuer: "Performance Creative Recognition", year: "2024" },
];

const faqList = [
  {
    q: "What services does Ravan Mammadov provide?",
    a: "I specialize in senior art direction, 3D product visualization, brand motion systems, performance creative campaigns, and high-converting landing page UI/UX.",
  },
  {
    q: "How can clients initiate a project?",
    a: "Submit a project inquiry through the contact form or email mammadovravan1@gmail.com directly with project goals, estimated budget, and target timeline.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes, I collaborate seamlessly with creative teams, agencies, and brand leaders worldwide across multiple time zones.",
  },
  {
    q: "What is your typical project timeline?",
    a: "Brand motion systems and campaign creative usually take between 2 to 6 weeks depending on scope, complexity, and 3D rendering requirements.",
  },
];

export default function RavanMammadovPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<IAboutSection | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });

    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });

    fetchTestimonials().then((data) => {
      if (data) setTestimonials(data);
    });
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ravan Mammadov",
    jobTitle: "Senior Creative Designer & Marketer",
    url: "https://www.rvan.me/ravan-mammadov",
    sameAs: [
      "https://www.linkedin.com/in/ravanmammadov1/",
      "https://www.behance.net/mammadovravan",
      "https://www.instagram.com/ravanimate/",
      "https://www.facebook.com/rvnmmmdv/",
    ],
    knowsAbout: [
      "Motion Design",
      "3D Product Visualization",
      "Brand Identity",
      "Art Direction",
      "Digital Marketing",
      "UI/UX Design",
    ],
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Biography & Career Timeline — Ravan Mammadov Studio"
        description="Official biography, career trajectory, core philosophy, awards, and client testimonials for Senior Creative Designer and Marketer Ravan Mammadov."
        url="https://www.rvan.me/ravan-mammadov"
        jsonLd={personSchema}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* ── Aurora background blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — emerald / teal, top-left */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.06) 45%, transparent 72%)",
            filter: "blur(64px)",
          }}
        />

        {/* Blob 2 — blue / indigo, top-right */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "0%", right: "-12%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.05) 50%, transparent 78%)",
            filter: "blur(72px)",
          }}
        />

        {/* Micro grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Hero / Biography Header */}
      <section className="px-6 pt-24 pb-16 md:px-10 md:pt-32 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-xs font-bold tracking-widest text-primary mono uppercase">
                <Sparkles size={14} /> ABOUT RAVAN MAMMADOV
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-.07em] md:text-7xl lg:text-8xl">
                Creative Energy <br />
                <span className="text-primary font-bold">Built to Perform.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl font-medium">
                {aboutSection?.introParagraph1 ||
                  "From the first concept to the last frame, every detail is shaped to make an emotional impact. I work across motion, graphic design, art direction and growth-focused creative."}
              </p>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground/80 font-medium">
                {aboutSection?.introParagraph2 ||
                  "My approach pairs a designer's eye with a marketer's clarity: beautiful ideas, built to be remembered and made to perform."}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/#contact"
                  className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
                >
                  START A CONVERSATION
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>

                <a
                  href="mailto:mammadovravan1@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-4 text-xs font-bold tracking-[.18em] text-foreground hover:border-primary transition-colors mono uppercase"
                >
                  <Mail size={14} /> EMAIL DIRECTLY
                </a>
              </div>
            </motion.div>

            {/* Profile Stats & Visual */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="lg:col-span-5"
            >
              <div className="rounded-3xl border border-white/10 bg-surface/40 p-8 shadow-2xl glass backdrop-blur-xl relative overflow-hidden group">
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(circle at top right, rgba(16,185,129,0.1) 0%, transparent 60%)",
                  }}
                />
                <div className="flex items-center gap-4 border-b border-white/10 pb-6 relative z-10">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary/50 bg-black flex-shrink-0 shadow-[0_0_15px_rgba(232,253,82,0.2)]">
                    <picture>
                      <source srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`} type="image/webp" />
                      <img src={aboutSection?.profilePhoto ? urlFor(aboutSection.profilePhoto)?.url() || RavanPortrait1200 : RavanPortrait1200} alt="Ravan Mammadov" className="h-full w-full object-cover object-top" />
                    </picture>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Ravan Mammadov</h3>
                    <p className="text-xs text-muted-foreground mono tracking-wider uppercase">Senior Creative Designer & Marketer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 relative z-10">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 glass-stat transition-colors duration-300 hover:bg-white/10">
                    <span className="text-3xl font-bold text-primary mono">8+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Years Crafting</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 glass-stat transition-colors duration-300 hover:bg-white/10">
                    <span className="text-3xl font-bold text-primary mono">120+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Projects Shipped</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 glass-stat transition-colors duration-300 hover:bg-white/10">
                    <span className="text-3xl font-bold text-primary mono">40M+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Views Driven</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 glass-stat transition-colors duration-300 hover:bg-white/10">
                    <span className="text-3xl font-bold text-primary mono">18</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Awards & Features</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience & Career Timeline */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Career Trajectory</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Experience & Milestones
            </h2>
          </motion.div>

          <div className="mt-16 space-y-8 border-l-[1px] border-white/20 pl-6 md:pl-10 relative">
            {(aboutSection?.experience && aboutSection.experience.length > 0 ? aboutSection.experience : timelineEvents).map((item, idx) => (
              <motion.div
                key={item.role + idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.1}
                className="relative group p-6 -ml-6 md:-ml-10 md:pl-10 rounded-2xl transition-all duration-500 hover:bg-white/5"
              >
                <div className="absolute left-[23px] md:left-[7px] top-8 h-2.5 w-2.5 rounded-full border border-primary bg-background shadow-[0_0_10px_rgba(232,253,82,0.5)] transition-all duration-300 group-hover:scale-150 group-hover:bg-primary" />
                <span className="text-xs font-bold tracking-[.2em] text-primary mono transition-colors duration-300 group-hover:text-white">{item.year}</span>
                <h3 className="mt-3 text-2xl font-bold text-foreground/90 transition-colors duration-300 group-hover:text-primary">{item.role}</h3>
                {item.company && <p className="mt-1 text-sm font-semibold text-muted-foreground mono tracking-wide">{item.company}</p>}
                {item.desc && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground/70 transition-colors duration-300 group-hover:text-foreground/90">{item.desc}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Core Competencies</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Skills & Tooling
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {(aboutSection?.skills && aboutSection.skills.length > 0 ? aboutSection.skills : skillsList).map((group, idx) => (
              <div key={group.category + idx} className="rounded-3xl border border-white/10 bg-white/5 p-8 glass group relative overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1">
                {/* Hover Glow */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background: "radial-gradient(circle at center, rgba(59,130,246,0.1) 0%, transparent 70%)",
                  }}
                />
                <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-3 relative z-10">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-primary shadow-[0_0_15px_rgba(232,253,82,0.15)] group-hover:scale-110 transition-transform duration-300">
                    <Zap size={16} />
                  </div>
                  {group.category}
                </h3>
                <ul className="space-y-4 relative z-10">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-[15px] text-muted-foreground/80 font-medium transition-colors duration-300 group-hover:text-foreground/90">
                      <CheckCircle2 size={14} className="text-primary/70 flex-shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="bg-surface px-6 py-24 md:px-10 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Recognition</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Awards & Features
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {awardsList.map((award) => (
              <div key={award.title} className="rounded-2xl border border-border bg-background p-6">
                <Award size={24} className="text-primary mb-4" />
                <span className="text-[10px] font-bold text-muted-foreground mono uppercase">{award.year} · {award.issuer}</span>
                <h4 className="mt-2 text-base font-bold text-foreground">{award.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Collaborators Say (Testimonials) */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-[1600px] relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Collaborator Feedback</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              What Collaborators Say
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t._id} className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 glass-stat transition-all duration-300 hover:bg-white/10">
                <p className="text-[15px] leading-relaxed text-muted-foreground/90 italic">"{t.quote}"</p>
                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="font-bold text-foreground/90 text-[15px]">{t.name}</p>
                  <p className="text-xs text-muted-foreground mono mt-1 tracking-wide">{t.role} {t.company && `· ${t.company}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-28 md:px-10 md:py-36 relative z-10">
        <div className="absolute inset-0 border-t border-white/5" />
        <div className="mx-auto max-w-4xl relative">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <p className="eyebrow text-muted-foreground">Clarifications</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              Frequently Asked
            </h2>
          </motion.div>

          <div className="mx-auto mt-16 max-w-4xl space-y-4">
            {(aboutSection?.faqs && aboutSection.faqs.length > 0 ? aboutSection.faqs : faqList).map((faq, idx) => (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.1}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 glass transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none transition-colors duration-300 hover:bg-white/5"
                >
                  <h3 className="text-[17px] font-bold text-foreground/90 transition-colors duration-300 hover:text-primary">{faq.q}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-primary transition-transform duration-500 ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <div className="border-t border-white/10 p-6 text-[15px] leading-relaxed text-muted-foreground/80 font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
