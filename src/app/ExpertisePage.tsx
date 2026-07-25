import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Zap, Target, Layers, TrendingUp, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
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

const expertiseAreas = [
  {
    id: "motion",
    number: "01",
    title: "3D & Motion Craft",
    icon: <Layers className="text-primary" size={24} />,
    tagline: "High-impact visual energy for brands that refuse to blend in.",
    description: "From 3D product visualizations to complex motion graphic systems, every frame is crafted to capture attention within the critical first 3 seconds.",
    deliverables: [
      "3D Product & Commercial Animation",
      "Broadcast & Social Motion Graphics",
      "CGI & VFX Integration",
      "Dynamic Logo & Identity Animations",
    ],
    tools: ["Blender", "Cinema 4D", "After Effects", "Premiere Pro", "Spline"],
  },
  {
    id: "branding",
    number: "02",
    title: "Brand Worlds & Systems",
    icon: <Target className="text-primary" size={24} />,
    tagline: "Cohesive visual identities designed to scale across touchpoints.",
    description: "Building complete brand ecosystems — from typographic guidelines to motion design tokens — that perform flawlessly from 16px icons to massive billboards.",
    deliverables: [
      "Visual Identity & Brand Architecture",
      "Motion Design Guidelines & Systems",
      "Design Systems & Token Libraries",
      "Art Direction & Campaign Guides",
    ],
    tools: ["Figma", "Photoshop", "Illustrator", "Rive", "Design Tokens"],
  },
  {
    id: "performance",
    number: "03",
    title: "Performance Creative",
    icon: <TrendingUp className="text-primary" size={24} />,
    tagline: "Data-backed visual assets built for high conversion and scale.",
    description: "Combining creative direction with marketing analytics to produce short-form video ads and campaign assets engineered for maximum hook rate and ROAS.",
    deliverables: [
      "Short-Form Video Ad Suites (TikTok, Meta)",
      "High-Converting Motion Banners",
      "A/B Creative Variant Libraries",
      "Creative Strategy & Hook Testing",
    ],
    tools: ["DaVinci Resolve", "CapCut Pro", "Analytics Dashboards", "Figma"],
  },
  {
    id: "art-direction",
    number: "04",
    title: "Art Direction & Creative Strategy",
    icon: <Zap className="text-primary" size={24} />,
    tagline: "Strategic creative leadership from initial concept to final delivery.",
    description: "Guiding campaigns and digital products with agency-grade rigor: aligning aesthetic excellence with business objectives to earn attention and drive growth.",
    deliverables: [
      "Commercial Campaign Art Direction",
      "Product & Brand Photography Direction",
      "Creative Pitch & Strategy Decks",
      "Cross-Functional Design Leadership",
    ],
    tools: ["Notion", "Figma", "Keynote", "AI Prompt Engineering"],
  },
];

export default function ExpertisePage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Creative Design & Motion Services",
    provider: {
      "@type": "Person",
      name: "Ravan Mammadov",
      url: "https://www.rvan.me",
    },
    serviceType: [
      "3D & Motion Craft",
      "Brand Worlds & Systems",
      "Performance Creative",
      "Art Direction & Creative Strategy",
    ],
    areaServed: "Global",
    url: "https://www.rvan.me/expertise",
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Expertise & Creative Services — Ravan Mammadov"
        description="Core creative capabilities: 3D & Motion Craft, Brand Worlds & Systems, Performance Creative, and Commercial Art Direction."
        url="https://www.rvan.me/expertise"
        jsonLd={jsonLd}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-6 pt-24 md:px-10 max-w-[1600px] mx-auto">
        <ol className="flex items-center gap-2 text-xs mono text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-bold">EXPERTISE</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4">CORE CAPABILITIES & SERVICES</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl">
              Expertise.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Blending motion design, brand strategy, 3D craft, and performance marketing to build visual experiences that command attention and drive business outcomes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Detail Grid */}
      <section className="px-6 pb-24 md:px-10 border-t border-border/60 pt-16">
        <div className="mx-auto max-w-[1600px] space-y-16">
          {expertiseAreas.map((area, index) => (
            <motion.article
              key={area.id}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              custom={index * 0.1}
              className="rounded-2xl border border-border bg-surface p-8 md:p-12 transition-all hover:border-primary/40"
            >
              <div className="grid gap-8 lg:grid-cols-12">
                {/* Left: Title & Overview */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      {area.number}
                    </span>
                    {area.icon}
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    {area.title}
                  </h2>
                  <p className="text-sm font-semibold text-primary/90 leading-snug">
                    {area.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                    {area.description}
                  </p>
                </div>

                {/* Right: Deliverables & Stack */}
                <div className="lg:col-span-7 flex flex-col justify-between gap-8 border-t lg:border-t-0 lg:border-l border-border/60 pt-8 lg:pt-0 lg:pl-10">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-4">
                      Key Deliverables
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {area.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-foreground">
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-3">
                      Tooling & Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {area.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 pb-24 md:px-10 border-t border-border/60 pt-16">
        <div className="mx-auto max-w-[1600px]">
          <div className="max-w-2xl mb-12">
            <p className="eyebrow text-muted-foreground">WORKING TOGETHER</p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-5xl mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl space-y-4">
            {[
              {
                q: "What types of projects do you take on?",
                a: "I specialize in 3D motion design, brand identity systems, high-converting performance video creatives, and commercial art direction. Projects range from full campaign suites to standalone brand film animations.",
              },
              {
                q: "How does the engagement process work?",
                a: "We start with a discovery call or brief review to align on scope, timelines, and business goals. Following alignment, I provide a detailed proposal and timeline before kicking off conceptual design.",
              },
              {
                q: "What software and rendering engines do you use?",
                a: "My daily stack includes Blender, Cinema 4D, After Effects, Figma, Photoshop, and Premiere Pro. Deliverables are optimized for broadcast, web, or social media performance.",
              },
              {
                q: "Are you available for freelance, contract, or full-time roles?",
                a: "I take on select project contracts, agency collaborations, and strategic creative partnerships. Feel free to reach out via the contact page with your project details.",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-base md:text-lg hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} className="text-primary shrink-0" /> : <ChevronDown size={20} className="text-muted-foreground shrink-0" />}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="px-6 pb-20 md:px-10">
        <div className="mx-auto max-w-[1600px] rounded-2xl bg-gradient-to-r from-surface via-background to-surface border border-border p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl mx-auto">
            Ready to bring your vision to life?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto text-sm">
            Have an ambitious motion project, campaign, or brand system in mind? Let's talk.
          </p>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold tracking-widest text-black uppercase hover:bg-white transition-colors mono"
            >
              GET IN TOUCH <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV</span>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-primary">HOME</Link>
            <Link to="/work" className="hover:text-primary">WORK</Link>
            <Link to="/expertise" className="hover:text-primary">EXPERTISE</Link>
            <Link to="/news" className="hover:text-primary">NEWS</Link>
            <Link to="/tools" className="hover:text-primary">TOOLS</Link>
            <Link to="/blog" className="hover:text-primary">BLOG</Link>
            <Link to="/contact" className="hover:text-primary">CONTACT</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
