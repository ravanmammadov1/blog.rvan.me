import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchSiteSettings } from "../../../lib/sanityQueries";
import { Eyebrow } from "../Eyebrow";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { Button } from "../ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
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
  const letsTalkLabel = siteSettings?.letsTalkLabel || t("btnGetInTouch", "GET IN TOUCH");

  return (
    <section id="contact" className="relative px-6 py-20 md:px-10 md:py-28 border-t border-border bg-surface/30">
      <div className="mx-auto max-w-[1600px] relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-12 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-primary tracking-[.2em]">{t("contactBadge", "GET IN TOUCH")}</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl text-foreground">
              {contactHeading}
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left: Info */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.08}
            className="flex flex-col justify-center space-y-6"
          >
            <p className="text-base leading-relaxed text-muted-foreground font-normal md:text-lg">
              {contactSubtext}
            </p>

            <div>
              <Button
                href="mailto:hello@rvan.me"
                variant="secondary"
                size="lg"
                icon={<ArrowDownRight size={16} />}
              >
                {letsTalkLabel}
              </Button>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.15}
            className="rounded-2xl border border-border bg-card p-8 md:p-10"
          >
            <form onSubmit={handleContactSubmit} className="space-y-6" noValidate>
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
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
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
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
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
                  className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors resize-none"
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

              <Button
                type="submit"
                disabled={contactStatus === "loading"}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {contactStatus === "loading" && (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>SENDING...</span>
                  </span>
                )}
                {contactStatus === "success" && (
                  <span className="inline-flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} />
                    <span>SENT SUCCESSFULLY</span>
                  </span>
                )}
                {contactStatus === "error" && (
                  <span className="inline-flex items-center justify-center gap-2">
                    <AlertCircle size={16} />
                    <span>FAILED - TRY AGAIN</span>
                  </span>
                )}
                {contactStatus === "idle" && (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span>{t("btnSendMessage", "SEND MESSAGE")}</span>
                    <ArrowDownRight size={16} />
                  </span>
                )}
              </Button>

              {contactStatus === "error" && (
                <p className="text-sm text-destructive text-center" role="alert">
                  {contactErrorMessage}
                </p>
              )}
              {contactStatus === "success" && (
                <p className="text-sm text-emerald-500 text-center" role="status">
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
