import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function ContactPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectDetails: "",
    honeypot: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to send message. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", projectDetails: "", honeypot: "" });
    } catch (err: any) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Ravan Mammadov",
    description: "Get in touch with Ravan Mammadov for 3D motion design, brand identity systems, or digital campaign inquiries.",
    url: "https://www.rvan.me/contact",
    mainEntity: {
      "@type": "Person",
      name: "Ravan Mammadov",
      email: siteSettings?.socialLinks?.email || "mammadovravan1@gmail.com",
      url: "https://www.rvan.me",
    },
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Contact — Let's Make Something Move | Ravan Mammadov"
        description="Have an ambitious project or motion campaign in mind? Contact Ravan Mammadov for creative direction, 3D design, and brand systems."
        url="https://www.rvan.me/contact"
        jsonLd={jsonLd}
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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-6 pt-24 md:px-10 max-w-[1600px] mx-auto relative z-10">
        <ol className="flex items-center gap-2 text-xs mono text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-bold">CONTACT</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <section className="px-6 pt-6 pb-12 md:px-10 md:pb-16 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4">START A CONVERSATION</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl uppercase">
              LET'S MAKE SOMETHING <span className="aurora-text-animate font-bold block sm:inline">MOVE.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {siteSettings?.contactSubtext || "Have an ambitious campaign, motion project, or visual system in mind? I'm always open to new creative partnerships."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="px-6 pb-28 md:px-10 relative z-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 border-t border-white/10 pt-12">
            {/* Direct Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-4">
                  Direct Inquiries
                </h2>
                <a
                  href={`mailto:${siteSettings?.socialLinks?.email || "mammadovravan1@gmail.com"}`}
                  className="group flex items-center gap-3 text-xl md:text-2xl font-semibold hover:text-primary transition-colors"
                >
                  <Mail className="text-primary shrink-0" size={24} />
                  <span>{siteSettings?.socialLinks?.email || "mammadovravan1@gmail.com"}</span>
                </a>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-3">
                  Location & Availability
                </h2>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin size={16} className="text-primary" />
                  <span>Baku, Azerbaijan (UTC+4) — Available Worldwide</span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground mono">
                  Current Status: <span className="text-emerald-400 font-bold">{siteSettings?.availabilityStatus || "AVAILABLE FOR Q3 2025"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-4">
                  Connect Across Networks
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "LinkedIn", href: siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/" },
                    { label: "Behance", href: siteSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan" },
                    { label: "Instagram", href: siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/" },
                    { label: "Facebook", href: siteSettings?.socialLinks?.facebook || "https://www.facebook.com/rvnmmmdv/" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 mono hover:-translate-y-0.5 shadow-sm"
                    >
                      {social.label} <ArrowUpRight size={12} className="opacity-70 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 glass shadow-2xl relative overflow-hidden group">
              {/* Subtle hover glow */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at top right, rgba(16,185,129,0.05) 0%, transparent 60%)",
                }}
              />
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold tracking-tight mb-2 text-foreground/90">Send a Message</h2>
                <p className="text-xs text-muted-foreground/80 mb-8 font-medium">
                Fill out the fields below and I'll get back to you within 24 hours.
              </p>

              {status === "success" ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4">
                  <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
                  <h3 className="text-xl font-semibold text-foreground">Message Delivered</h3>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    Thank you for reaching out! Your inquiry has been sent directly to my inbox.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 rounded-full bg-primary px-6 py-2 text-xs font-bold uppercase tracking-widest text-black mono"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot anti-spam field */}
                  <input
                    type="text"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      Project Details & Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your campaign goals, timeline, and scope..."
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-background/50 px-5 py-4 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> SENDING...
                      </>
                    ) : (
                      <>
                        SEND MESSAGE <Send size={14} />
                      </>
                    )}
                  </button>
                </form>
              )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
