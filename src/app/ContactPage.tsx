import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { CONTACT_FAQS } from "../data/faqData";
import FaqAccordion from "./components/ui/FaqAccordion";

import { useLanguage } from "../lib/i18n/LanguageContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE },
  }),
};

export default function ContactPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { t, language } = useLanguage();
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
    fetchSiteSettings(language).then((data) => {
      if (data) setSiteSettings(data);
    });
  }, [language]);

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
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.rvan.me/#person",
        name: "Ravan Mammadov",
        url: "https://www.rvan.me/ravan-mammadov",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.rvan.me/#website",
        name: "Ravan Mammadov Portfolio",
        url: "https://www.rvan.me/",
        publisher: { "@id": "https://www.rvan.me/#person" },
      },
      {
        "@type": "ContactPage",
        "@id": "https://www.rvan.me/contact#webpage",
        name: "Contact Ravan Mammadov",
        description: "Get in touch with Ravan Mammadov for motion design, brand identity systems, or digital collaboration ideas.",
        url: "https://www.rvan.me/contact",
        mainEntity: { "@id": "https://www.rvan.me/#person" },
      },
    ],
  };

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Geist', sans-serif" }}
    >
      <SEO
        title={`${t("navContact", "Contact")} — Rvan.me Studio`}
        description={t("contactSubtitle", "Have a project, collaboration idea, or feedback? Let's talk.")}
        url="https://www.rvan.me/contact"
        jsonLd={jsonLd}
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* ── Background Aurora Glow ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-background" />
        
        {/* Blob 1 — teal/emerald */}
        <div
          className="aurora-blob-1 absolute"
          style={{
            top: "-15%", left: "-10%",
            width: "60%", height: "70%",
            background: "radial-gradient(ellipse at 40% 40%, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 45%, transparent 72%)",
            filter: "blur(70px)",
          }}
        />

        {/* Blob 2 — blue */}
        <div
          className="aurora-blob-2 absolute"
          style={{
            top: "10%", right: "-10%",
            width: "55%", height: "65%",
            background: "radial-gradient(ellipse at 65% 30%, rgba(59,130,246,0.06) 0%, rgba(79,70,229,0.03) 50%, transparent 78%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main Container */}
      <section className="px-6 pt-24 pb-28 md:px-10 md:pt-32 md:pb-36 relative z-10">
        <div className="mx-auto max-w-[1440px]">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: Premium Intro & Social Links */}
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              custom={0.05}
              className="lg:col-span-5 flex flex-col justify-between pt-2"
            >
              <div>
                <p className="text-[11px] font-bold tracking-[.2em] text-primary mono uppercase mb-4">
                  {t("contactBadge", "GET IN TOUCH")}
                </p>
                <h1 className="text-4xl font-semibold tracking-[-.05em] sm:text-5xl lg:text-6xl text-foreground leading-[1.08] uppercase">
                  {siteSettings?.contactHeading || t("contactHeading", "LET'S TALK.")}
                </h1>
                <p className="mt-6 text-base sm:text-lg text-muted-foreground/90 leading-relaxed max-w-md font-medium">
                  {siteSettings?.contactSubtext || t("contactSubtitle", "Have a project, collaboration idea, or feedback? Let's talk.")}
                </p>
              </div>

              {/* Social links block */}
              <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10">
                <p className="text-[10px] font-bold tracking-[.22em] text-muted-foreground/70 mono uppercase mb-4">
                  {t("connectAcrossNetworks", "CONNECT ACROSS NETWORKS")}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "LinkedIn", href: siteSettings?.socialLinks?.linkedin || "https://www.linkedin.com/in/ravanmammadov1/" },
                    { label: "Behance", href: siteSettings?.socialLinks?.behance || "https://www.behance.net/mammadovravan" },
                    { label: "Instagram", href: siteSettings?.socialLinks?.instagram || "https://www.instagram.com/ravanimate/" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300 mono hover:-translate-y-0.5 glass-sm"
                    >
                      {social.label} <ArrowUpRight size={13} className="opacity-70" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Send a Message Form Card */}
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              custom={0.15}
              className="lg:col-span-7 rounded-3xl border border-white/10 bg-white/5 p-7 sm:p-10 md:p-12 glass shadow-2xl relative overflow-hidden group"
            >
              {/* Subtle hover glow */}
              <div 
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                  background: "radial-gradient(circle at top right, rgba(16,185,129,0.04) 0%, transparent 60%)",
                }}
              />

              <div className="relative z-10">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-1">
                  {t("sendMessageTitle", "Send a Message")}
                </h2>
                <p className="text-xs text-muted-foreground/80 mb-8 font-medium">
                  {t("sendMessageDesc", "Fill out the fields below and I'll get back to you as soon as possible.")}
                </p>

                {status === "success" ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center space-y-4">
                    <CheckCircle2 size={40} className="mx-auto text-emerald-400" />
                    <h3 className="text-xl font-semibold text-foreground">Message Delivered</h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out! Your message has been delivered directly. I will review it and reply shortly.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-4 rounded-full bg-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-black mono transition hover:scale-105"
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
                        <label htmlFor="contact-name" className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                          {t("yourName", "YOUR NAME *")}
                        </label>
                        <input
                          type="text"
                          id="contact-name"
                          name="name"
                          required
                          placeholder={t("placeholderName", "Your name")}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                          {t("yourEmail", "YOUR EMAIL *")}
                        </label>
                        <input
                          type="email"
                          id="contact-email"
                          name="email"
                          required
                          placeholder={t("placeholderEmail", "your@email.com")}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-project-details" className="block text-[10.5px] font-bold uppercase tracking-widest text-muted-foreground mono mb-2">
                        {t("yourMessage", "MESSAGE *")}
                      </label>
                      <textarea
                        required
                        id="contact-project-details"
                        name="projectDetails"
                        rows={5}
                        placeholder={t("placeholderMessage", "How can we collaborate? Share your details...")}
                        value={formData.projectDetails}
                        onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-[11px] font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(216,255,68,0.3)] mono disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> SENDING...
                        </>
                      ) : (
                        <>
                          {t("btnSendMessage", "SEND MESSAGE")} <Send size={13} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Contextual Contact FAQ Section */}
      <section className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-card/20">
        <div className="mx-auto max-w-[1200px]">
          <FaqAccordion
            items={CONTACT_FAQS}
            eyebrow={language === "az" ? "ƏLAQƏ VƏ ƏMƏKDAŞLIQ" : "CONTACT & INQUIRIES"}
            title={language === "az" ? "Əlaqə Haqqında Suallar" : "Inquiries & Submissions"}
            description={
              language === "az"
                ? "Redaksiya heyəti ilə əlaqə, əməkdaşlıq təklifləri və düzəlişlər haqqında ən çox verilən suallar:"
                : "Common questions regarding contacting the editorial desk, partnership proposals, and corrections:"
            }
            viewAllHref="/faq"
            viewAllLabel={language === "az" ? "BÜTÜN SUALLARA BAX (10)" : "VIEW ALL FAQS (10)"}
            showNumbers={true}
          />
        </div>
      </section>

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
