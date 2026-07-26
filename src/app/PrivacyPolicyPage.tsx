import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, Lock, Eye, Mail, ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import { useCookieConsent } from "./context/CookieConsentContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

export default function PrivacyPolicyPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { openPreferences } = useCookieConsent();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "'Manrope', sans-serif" }}
    >
      <SEO
        title="Privacy Policy — Ravan Mammadov Studio"
        description="Official Privacy Policy for Ravan Mammadov Studio. Learn how we handle data protection, cookies, analytics, and your rights under GDPR and international privacy standards."
        url="https://www.rvan.me/privacy-policy"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Header Section */}
      <section className="px-6 pt-24 pb-12 md:px-10 md:pt-32 border-b border-border">
        <div className="mx-auto max-w-[1200px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase mb-6"
            >
              <ArrowLeft size={14} /> BACK TO HOME
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary mono uppercase">
              <Shield size={14} /> LEGAL & GOVERNANCE
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-.06em] md:text-7xl">
              Privacy Policy.
            </h1>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Ravan Mammadov Studio ("we", "us", or "our") respects your privacy and is committed to protecting your personal data in accordance with GDPR and applicable international data protection standards.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST UPDATED: JULY 2026</span>
              <span>·</span>
              <span>EFFECTIVE DATE: IMMEDIATE</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase"
              >
                MANAGE COOKIE CONSENT →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1200px] grid gap-12 lg:grid-cols-12">
          {/* Navigation Sidebar */}
          <div className="hidden lg:block lg:col-span-4 space-y-3 sticky top-32 h-fit">
            <div className="rounded-2xl border border-border bg-surface p-6">
              <p className="text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                CONTENTS OVERVIEW
              </p>
              <ul className="space-y-2.5 text-xs font-medium text-muted-foreground">
                <li>
                  <a href="#data-controller" className="hover:text-foreground transition-colors">
                    1. Data Controller
                  </a>
                </li>
                <li>
                  <a href="#data-collection" className="hover:text-foreground transition-colors">
                    2. Information We Collect
                  </a>
                </li>
                <li>
                  <a href="#legal-basis" className="hover:text-foreground transition-colors">
                    3. Legal Basis for Processing
                  </a>
                </li>
                <li>
                  <a href="#third-parties" className="hover:text-foreground transition-colors">
                    4. Third-Party Analytics & Services
                  </a>
                </li>
                <li>
                  <a href="#user-rights" className="hover:text-foreground transition-colors">
                    5. Your Data Rights (GDPR)
                  </a>
                </li>
                <li>
                  <a href="#contact-privacy" className="hover:text-foreground transition-colors">
                    6. Privacy Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Policy Text */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-muted-foreground">
            {/* Section 1 */}
            <div id="data-controller" className="scroll-mt-32 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                1. Data Controller Information
              </h2>
              <p className="text-sm leading-relaxed">
                The data controller responsible for processing personal information gathered on{" "}
                <strong className="text-foreground">www.rvan.me</strong> is:
              </p>
              <div className="rounded-xl border border-border bg-surface p-6 text-xs mono text-foreground space-y-1">
                <p className="font-bold text-primary">RAVAN MAMMADOV STUDIO</p>
                <p>Senior Creative Designer & Art Director</p>
                <p>Location: Baku, Azerbaijan</p>
                <p>Contact Email: mammadovravan1@gmail.com</p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="data-collection" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                2. Information We Collect
              </h2>
              <p className="text-sm leading-relaxed">
                We collect personal information through two main channels:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Voluntary Contact Details:</strong> Name, email address, project scope, and message contents when you submit our contact form or send email inquiries directly.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Automated Usage & Technical Data:</strong> Anonymized IP addresses, browser type, device resolution, referrer URLs, and interactive event data collected via cookies if you grant analytics consent.
                  </div>
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div id="legal-basis" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                3. Legal Basis for Processing
              </h2>
              <p className="text-sm leading-relaxed">
                We process your personal data under the following legal bases pursuant to Article 6 of the General Data Protection Regulation (GDPR):
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-primary mono uppercase">GDPR ART. 6(1)(A)</span>
                  <h3 className="font-bold text-foreground text-sm">Explicit Consent</h3>
                  <p className="text-xs">Applied when you grant permission for analytics cookies or subscribe to field notes.</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-5 space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-primary mono uppercase">GDPR ART. 6(1)(F)</span>
                  <h3 className="font-bold text-foreground text-sm">Legitimate Interest</h3>
                  <p className="text-xs">Applied when processing project inquiries and protecting website security.</p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="third-parties" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                4. Third-Party Analytics & Infrastructure
              </h2>
              <p className="text-sm leading-relaxed">
                We partner with trusted performance infrastructure and analytics providers to ensure zero downtime and optimal user experiences:
              </p>
              <ul className="space-y-3 text-sm">
                <li className="border-b border-border/50 pb-3">
                  <strong className="text-foreground">Vercel Inc.:</strong> Hosting platform, Speed Insights, and edge deployment (USA/EU).
                </li>
                <li className="border-b border-border/50 pb-3">
                  <strong className="text-foreground">Google Analytics 4:</strong> Anonymized web traffic and audience measurement (Google LLC).
                </li>
                <li className="border-b border-border/50 pb-3">
                  <strong className="text-foreground">Microsoft Clarity:</strong> Session recording and UX visual heatmaps (Microsoft Corp.).
                </li>
                <li>
                  <strong className="text-foreground">Sanity.io:</strong> Headless content management platform (Sanity AS, Norway).
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div id="user-rights" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                5. Your Data Rights (GDPR & CCPA)
              </h2>
              <p className="text-sm leading-relaxed">
                As a user, you hold full authority over your personal data. You are entitled to:
              </p>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                  <Lock size={16} className="text-primary flex-shrink-0" />
                  <span>Right to access, retrieve, or correct your personal data records.</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                  <Eye size={16} className="text-primary flex-shrink-0" />
                  <span>Right to request erasure ("Right to be forgotten") of your data.</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4">
                  <Shield size={16} className="text-primary flex-shrink-0" />
                  <span>Right to withdraw consent at any time without affecting prior lawfulness.</span>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div id="contact-privacy" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                6. Privacy Inquiries & Data Requests
              </h2>
              <p className="text-sm leading-relaxed">
                If you have questions regarding this Privacy Policy or wish to exercise your data rights, please email us directly:
              </p>
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <a
                  href="mailto:mammadovravan1@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-widest text-black uppercase hover:bg-white transition-colors mono"
                >
                  <Mail size={14} /> EMAIL PRIVACY OFFICER
                </a>
                <Link
                  to="/cookie-policy"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold tracking-widest text-foreground hover:border-primary transition-colors mono uppercase"
                >
                  VIEW COOKIE POLICY <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 md:px-10">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 text-[10px] font-bold tracking-[.18em] text-muted-foreground mono sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} RAVAN MAMMADOV STUDIO</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy-policy" className="text-primary">
              PRIVACY POLICY
            </Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">
              COOKIE POLICY
            </Link>
            <button onClick={openPreferences} className="hover:text-primary transition-colors uppercase">
              COOKIE PREFERENCES
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
