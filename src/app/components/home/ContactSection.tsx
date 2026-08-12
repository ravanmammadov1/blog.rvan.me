import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchSiteSettings } from "../../../lib/sanityQueries";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
      transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ContactSection() {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const { t } = useLanguage();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactHoneypot, setContactHoneypot] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactErrorMessage, setContactErrorMessage] = useState("");

  useEffect(() => {
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactStatus === "loading") return;

    setContactStatus("loading");
    setContactErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          projectDetails: contactMessage,
          honeypot: contactHoneypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
      setContactHoneypot("");
    } catch (err: any) {
      console.error("Contact form error:", err);
      setContactStatus("error");
      setContactErrorMessage(err.message || "Something went wrong. Please try again or send an email directly.");
    }
  };

  const contactHeading = siteSettings?.contactHeading || t("contactHeading", "LET'S TALK.");
  const contactSubtext = siteSettings?.contactSubtext || t("contactSubtitle", "Have a project, collaboration idea, or feedback? Let's talk.");
  const letsTalkLabel = siteSettings?.letsTalkLabel || t("btnGetInTouch", "ƏLAQƏ SAXLA");

  return (
    <section id="contact" className="relative px-6 py-28 md:px-10 md:py-40 overflow-hidden">
      {/* Subtle section aurora background */}
      <div 
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 55%, transparent 70%)",
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
            <Eyebrow className="text-muted-foreground">{t("contactBadge", "ƏLAQƏ SAXLA")}</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl text-foreground">
              {contactHeading}
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.1}
            className="flex flex-col justify-center"
          >
            <p className="text-base leading-relaxed text-muted-foreground font-medium md:text-lg mb-10">
              {contactSubtext}
            </p>

            <div className="space-y-6">
              <a
                href="mailto:hello@rvan.me"
                className="group inline-flex items-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm"
              >
                {letsTalkLabel}
                <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12 glass shadow-2xl relative overflow-hidden group"
          >
            {/* Subtle hover glow */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              style={{
                background: "radial-gradient(circle at top right, rgba(16,185,129,0.05) 0%, transparent 60%)",
              }}
            />
            <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-[11px] font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                    {t("yourName", "YOUR NAME *")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                    placeholder={t("placeholderName", "Your name")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[11px] font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                    {t("yourEmail", "YOUR EMAIL *")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300"
                    placeholder={t("placeholderEmail", "your@email.com")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-[11px] font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                  {t("yourMessage", "MESSAGE *")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-white/10 bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 resize-none"
                  placeholder={t("placeholderMessage", "How can we collaborate? Share your details...")}
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={contactHoneypot}
                onChange={(e) => setContactHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
                aria-hidden="true"
              />

              <button
                type="submit"
                disabled={contactStatus === "loading"}
                className="w-full group inline-flex items-center justify-center gap-3 rounded-full border border-primary/50 bg-primary/10 px-8 py-4 text-xs font-bold tracking-[.18em] text-primary uppercase transition-all duration-300 hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(232,253,82,0.15)] hover:shadow-[0_0_30px_rgba(232,253,82,0.3)] glass-sm disabled:opacity-50"
              >
                {contactStatus === "loading" && (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>SENDING...</span>
                  </>
                )}
                {contactStatus === "success" && (
                  <>
                    <CheckCircle2 size={16} />
                    <span>SENT SUCCESSFULLY</span>
                  </>
                )}
                {contactStatus === "error" && (
                  <>
                    <AlertCircle size={16} />
                    <span>FAILED - TRY AGAIN</span>
                  </>
                )}
                {contactStatus === "idle" && (
                  <>
                    {t("btnSendMessage", "SEND MESSAGE")}
                    <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                  </>
                )}
              </button>

              {contactStatus === "error" && (
                <p className="text-sm text-red-400 text-center" role="alert">
                  {contactErrorMessage}
                </p>
              )}
              {contactStatus === "success" && (
                <p className="text-sm text-green-400 text-center" role="status">
                  We'll review your query and respond shortly.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
