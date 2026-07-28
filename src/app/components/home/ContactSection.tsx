import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowDownRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchSiteSettings } from "../../../lib/sanityQueries";
import { Eyebrow } from "../Eyebrow";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function ContactSection() {
  const [siteSettings, setSiteSettings] = useState<any>(null);
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

  const contactHeading = siteSettings?.contactHeading || "LET'S CREATE SOMETHING";
  const contactSubtext = siteSettings?.contactSubtext || "Select work only. I take on a limited number of projects each quarter to ensure maximum attention and craft.";
  const letsTalkLabel = siteSettings?.letsTalkLabel || "LET'S TALK";

  return (
    <section id="contact" className="px-6 py-28 md:px-10 md:py-40 border-t border-border">
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 flex items-end justify-between border-b border-border pb-6"
        >
          <div>
            <Eyebrow className="text-muted-foreground">08 / Contact</Eyebrow>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-.05em] md:text-6xl">
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
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl"
              >
                {letsTalkLabel}
                <ArrowDownRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>

              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Or reach me directly:</p>
                <p className="mt-1 font-mono">hello@rvan.me</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.2}
          >
            <form onSubmit={handleContactSubmit} className="space-y-6" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold tracking-[.14em] mono uppercase text-muted-foreground mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Tell me about your project, timeline, budget, and what you're looking for..."
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
                className="w-full group inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-xs font-bold tracking-[.18em] text-black uppercase transition-all duration-300 hover:scale-[1.02] hover:bg-white hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary"
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
                    SEND INQUIRY
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
                  I'll get back to you within 1-2 business days.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}