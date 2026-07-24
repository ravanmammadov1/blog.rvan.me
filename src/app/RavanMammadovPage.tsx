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

import RavanPortrait from "@/imports/ravan_1.png";
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
    url: "https://www.rvan.me/ravanmammadov",
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
        title="Ravan Mammadov — Senior Creative Designer & Marketer"
        description="Official biography, career timeline, skills, awards, and testimonials for Ravan Mammadov, Senior Creative Designer blending motion, brand worlds, and growth creative."
        schema={personSchema}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Hero / Biography Header */}
      <section className="px-6 pt-24 pb-16 md:px-10 md:pt-32">
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
                  className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition hover:bg-white"
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
              <div className="rounded-3xl border border-border bg-surface p-8 shadow-2xl">
                <div className="flex items-center gap-4 border-b border-border pb-6">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-primary bg-black flex-shrink-0">
                    <img
                      src={aboutSection?.profilePhoto ? urlFor(aboutSection.profilePhoto)?.url() || RavanPortrait : RavanPortrait}
                      alt="Ravan Mammadov"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Ravan Mammadov</h3>
                    <p className="text-xs text-muted-foreground mono tracking-wider uppercase">Senior Creative Designer & Marketer</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6">
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <span className="text-3xl font-bold text-primary mono">8+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Years Crafting</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <span className="text-3xl font-bold text-primary mono">120+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Projects Shipped</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
                    <span className="text-3xl font-bold text-primary mono">40M+</span>
                    <p className="text-[11px] font-bold text-muted-foreground mono uppercase mt-1">Views Driven</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background/50 p-4">
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
      <section className="bg-surface px-6 py-28 md:px-10 md:py-36 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Career Trajectory</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Experience & Milestones
            </h2>
          </motion.div>

          <div className="mt-16 space-y-8 border-l-2 border-border pl-6 md:pl-10">
            {(aboutSection?.experience && aboutSection.experience.length > 0 ? aboutSection.experience : timelineEvents).map((item, idx) => (
              <motion.div
                key={item.role + idx}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.1}
                className="relative"
              >
                <div className="absolute -left-[31px] md:-left-[47px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                <span className="text-xs font-bold tracking-widest text-primary mono">{item.year}</span>
                <h3 className="mt-2 text-2xl font-bold text-foreground">{item.role}</h3>
                {item.company && <p className="text-sm font-semibold text-muted-foreground mono">{item.company}</p>}
                {item.desc && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">{item.desc}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section className="px-6 py-28 md:px-10 md:py-36 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Core Competencies</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              Skills & Tooling
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {(aboutSection?.skills && aboutSection.skills.length > 0 ? aboutSection.skills : skillsList).map((group, idx) => (
              <div key={group.category + idx} className="rounded-3xl border border-border bg-surface p-8">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-primary" /> {group.category}
                </h3>
                <ul className="space-y-3">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                      <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
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
      <section className="px-6 py-28 md:px-10 md:py-36 border-t border-border">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="eyebrow text-muted-foreground">Collaborator Feedback</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
              What Collaborators Say
            </h2>
          </motion.div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t._id} className="flex flex-col justify-between rounded-3xl border border-border bg-surface p-8">
                <p className="text-sm leading-relaxed text-muted-foreground italic">"{t.quote}"</p>
                <div className="mt-8 border-t border-border/50 pt-6">
                  <p className="font-bold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mono mt-0.5">{t.role} {t.company && `· ${t.company}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface px-6 py-28 md:px-10 md:py-36 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
            <p className="eyebrow text-muted-foreground">Clarifications</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] md:text-5xl">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="mt-16 space-y-4">
            {faqList.map((item, idx) => (
              <div key={item.q} className="rounded-2xl border border-border bg-background overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-6 text-left font-bold text-foreground text-lg"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`transition-transform duration-300 ${openFaq === idx ? "rotate-180 text-primary" : ""}`} size={20} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground border-t border-border/50 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
