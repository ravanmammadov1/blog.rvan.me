import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Mail, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="px-6 pt-24 md:px-10 max-w-[1600px] mx-auto">
        <ol className="flex items-center gap-2 text-xs mono text-muted-foreground">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">HOME</Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-bold">CONTACT</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <section className="px-6 pt-6 pb-12 md:px-10 md:pb-16">
        <div className="mx-auto max-w-[1600px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <p className="eyebrow text-primary mb-4">START A CONVERSATION</p>
            <h1 className="text-5xl font-semibold tracking-[-.06em] md:text-8xl max-w-4xl uppercase">
              {siteSettings?.contactHeading || "LET'S MAKE SOMETHING MOVE."}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {siteSettings?.contactSubtext || "Have an ambitious campaign, motion project, or visual system in mind? I'm always open to new creative partnerships."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content Grid */}
      <section className="px-6 pb-28 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-12 border-t border-border/60 pt-12">
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

              <div className="pt-4 border-t border-border/40">
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

              <div className="pt-4 border-t border-border/40">
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
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors mono"
                    >
                      {social.label} <ArrowUpRight size={12} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-surface p-8 md:p-12">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Send a Message</h2>
              <p className="text-xs text-muted-foreground mb-8">
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
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="alex@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                      Project Details & Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell me about your campaign goals, timeline, and scope..."
                      value={formData.projectDetails}
                      onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
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
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs font-bold tracking-widest text-black uppercase hover:bg-white transition-colors disabled:opacity-50 mono"
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
