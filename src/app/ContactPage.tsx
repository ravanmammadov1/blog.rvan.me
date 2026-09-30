import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PenTool,
  Sparkles,
  UserCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import { Button } from "./components/ui/Button";
import { CONTACT_FAQS } from "../data/faqData";
import GlobalFaqSection from "./components/GlobalFaqSection";
import { useAuth } from "../hooks/useAuth";
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
  const { t, language, isAz, getLocalizedPath } = useLanguage();
  const { user } = useAuth();

  // General Contact Form State
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

  // Pre-fill contact form if user is authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

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
        "@id": "https://blog.rvan.me/#person",
        name: "Ravan Mammadov",
        url: "https://blog.rvan.me/ravan-mammadov",
      },
      {
        "@type": "WebSite",
        "@id": "https://blog.rvan.me/#website",
        name: "Ravan Mammadov Portfolio",
        url: "https://blog.rvan.me/",
        publisher: { "@id": "https://blog.rvan.me/#person" },
      },
      {
        "@type": "ContactPage",
        "@id": "https://blog.rvan.me/contact#webpage",
        name: "Contact Ravan Mammadov",
        description: "Get in touch with Ravan Mammadov for motion design, brand identity systems, or digital collaboration ideas.",
        url: "https://blog.rvan.me/contact",
        mainEntity: { "@id": "https://blog.rvan.me/#person" },
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
        url="https://blog.rvan.me/contact"
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
      <section className="px-4 pt-12 pb-20 sm:px-6 md:px-8 md:pt-16 md:pb-28 relative z-10">
        <div className="mx-auto max-w-[1280px]">
          
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14 items-start">
            
            {/* LEFT COLUMN: Premium Intro & Social Links */}
            <motion.div 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
              custom={0.05}
              className="lg:col-span-5 flex flex-col justify-between pt-2"
            >
              <div>
                <p className="text-xs font-semibold tracking-[.24em] text-primary mono uppercase mb-3.5">
                  {t("contactBadge", "GET IN TOUCH")}
                </p>
                <h1
                  className="font-extrabold tracking-tight leading-[1.05] text-foreground uppercase mb-4"
                  style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
                >
                  <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                    {siteSettings?.contactHeading || (isAz ? "GƏLİN DANIŞAQ." : "LET'S TALK.")}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal max-w-md">
                  {siteSettings?.contactSubtext || t("contactSubtitle", "Have a project, collaboration idea, or feedback? Let's talk.")}
                </p>
              </div>

              {/* Social links block */}
              <div className="mt-10 sm:mt-12 pt-6 border-t border-[#DDE1E0] dark:border-white/10">
                <p className="text-[10px] font-bold tracking-[.22em] text-muted-foreground/80 mono uppercase mb-3.5">
                  {t("connectAcrossNetworks", "CONNECT ACROSS NETWORKS")}
                </p>
                <div className="flex flex-wrap gap-2.5">
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
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#DDE1E0] dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-200 mono hover:-translate-y-0.5"
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
              className="lg:col-span-7 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-6 sm:p-9 md:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] backdrop-blur-xl relative overflow-hidden group"
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
                          autoComplete="name"
                          required
                          placeholder={t("placeholderName", "Your name")}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white dark:focus:bg-background/80 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 shadow-2xs"
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
                          autoComplete="email"
                          required
                          placeholder={t("placeholderEmail", "your@email.com")}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white dark:focus:bg-background/80 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 shadow-2xs"
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
                        className="w-full rounded-xl border border-[#DDE1E0] dark:border-white/15 bg-slate-50/80 dark:bg-background/50 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:bg-white dark:focus:bg-background/80 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 resize-none shadow-2xs"
                      />
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-xs text-rose-500 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="group inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-xs font-bold tracking-[.18em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 mono disabled:opacity-50 cursor-pointer"
                      style={{
                        backgroundImage: "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)",
                        backgroundSize: "200% 200%",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={15} className="animate-spin" /> SENDING...
                        </>
                      ) : (
                        <>
                          {t("btnSendMessage", "SEND MESSAGE")} <Send size={13} className="transition-transform group-hover:translate-x-1" />
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

      {/* ── Section 2: Editorial Submissions & Article Invitation ── */}
      <section id="editorial-intake" className="relative px-4 py-16 sm:px-6 md:px-8 md:py-24 border-t border-[#DDE1E0] dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="mx-auto max-w-[1280px]">
          <div className="p-8 md:p-12 lg:p-14 rounded-3xl border border-[#DDE1E0] dark:border-white/10 bg-white dark:bg-card shadow-[0_12px_40px_rgba(15,23,42,0.05)] dark:shadow-none">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              
              {/* Left Column: Editorial Pitch */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[.2em] text-primary mono uppercase mb-3">
                    <PenTool size={14} />
                    <span>{t("writePageEyebrow", "EDITORIAL INVITATION")}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground uppercase leading-tight mb-4">
                    <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] bg-clip-text text-transparent inline-block">
                      {isAz ? "Paylaşmağa dəyər fikrin var?" : "Have Something Worth Sharing?"}
                    </span>
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed font-normal">
                    {t(
                      "writePageSubtitle",
                      "Share your article with Rvan.me. We welcome original perspectives on design, technology, marketing, psychology, creativity, and strategy. Every submission is reviewed by our editorial team before publication."
                    )}
                  </p>
                </div>

                {/* Editorial Pillars */}
                <div className="space-y-4 pt-4 border-t border-[#DDE1E0] dark:border-white/10">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                        {isAz ? "SEÇİLMİŞ NƏŞR MƏDƏNİYYƏTİ" : "CURATED EDITORIAL PLATFORM"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {isAz
                          ? "Hər bir yazı redaksiya süzgəcindən keçir və yüksək keyfiyyətlə təqdim edilir."
                          : "Every article is curated for high editorial quality, clarity, and real utility."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
                        {isAz ? "MÜƏLLİFLİK HÜQUQU VƏ ATTRIBUTİYA" : "COPYRIGHT PRESERVATION & ATTRIBUTION"}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                        {isAz
                          ? "Müəlliflik hüququnuz sizdə qalır. Yazınız dərc edildikdə adınız və profiliniz qeyd olunur."
                          : "Your copyright remains yours. Published articles feature dedicated author attribution."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Portal Link Card */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-background p-8 sm:p-10 space-y-6 shadow-md">
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
                      {isAz ? "RƏSMİ NƏŞR PORTALI" : "OFFICIAL SUBMISSION PORTAL"}
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">
                      {isAz ? "Məqalə Təqdimatı Portalı" : "Article Submission Portal"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isAz
                        ? "Orijinal məqalənizi birbaşa Rvan.me təqdimat portalı vasitəsilə redaksiyamıza göndərin."
                        : "Submit your original article directly to our editorial board through the public submission portal."}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Button
                      to={getLocalizedPath("/write")}
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight size={16} />}
                      iconPosition="right"
                      className="w-full sm:w-auto"
                    >
                      {isAz ? "FİKRİNİZİ BİZİMLƏ PAYLAŞIN" : "SHARE YOUR IDEAS"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-muted-foreground pt-2 border-t border-border">
                    <span>✓ {isAz ? "Hesab tələb olunmur" : "No account required"}</span>
                    <span>✓ {isAz ? "İlkin qaralama qorunur" : "Original content preserved"}</span>
                    <span>✓ {isAz ? "İnsan redaksiya baxışı" : "Human editorial review"}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Contextual Contact Global FAQ Section */}
      <GlobalFaqSection
        items={CONTACT_FAQS}
        eyebrow={language === "az" ? "ƏLAQƏ VƏ ƏMƏKDAŞLIQ" : "CONTACT & INQUIRIES"}
        title={language === "az" ? "Əlaqə Haqqında Suallar" : "Inquiries & Submissions"}
        description={
          language === "az"
            ? "Redaksiya heyəti ilə əlaqə, əməkdaşlıq təklifləri və düzəlişlər haqqında ən çox verilən suallar:"
            : "Common questions regarding contacting the editorial desk, partnership proposals, and corrections:"
        }
      />

      {/* Footer */}
      <Footer siteSettings={siteSettings} />
    </main>
  );
}
