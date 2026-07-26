import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { FileText, Shield, ArrowLeft, ArrowUpRight, Scale, Mail } from "lucide-react";
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

export default function TermsPage() {
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
        title="Terms of Service — Ravan Mammadov Studio"
        description="Terms of Service and legal notice for Ravan Mammadov Studio. Information regarding intellectual property, artwork licensing, and commercial engagement terms."
        url="https://www.rvan.me/terms"
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
              <Scale size={14} /> LEGAL TERMS
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-.06em] md:text-7xl">
              Terms of Service.
            </h1>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
              Welcome to Ravan Mammadov Studio. By accessing or using <strong className="text-foreground">www.rvan.me</strong>, you agree to comply with and be bound by these Terms of Service.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST UPDATED: JULY 2026</span>
              <span>·</span>
              <span>GOVERNING LAW: INTERNATIONAL & AZERBAIJAN</span>
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
                  <a href="#acceptance" className="hover:text-foreground transition-colors">
                    1. Acceptance of Terms
                  </a>
                </li>
                <li>
                  <a href="#intellectual-property" className="hover:text-foreground transition-colors">
                    2. Intellectual Property Rights
                  </a>
                </li>
                <li>
                  <a href="#authorized-use" className="hover:text-foreground transition-colors">
                    3. Authorized Website Use
                  </a>
                </li>
                <li>
                  <a href="#client-engagements" className="hover:text-foreground transition-colors">
                    4. Client Engagements & Scope
                  </a>
                </li>
                <li>
                  <a href="#limitation-of-liability" className="hover:text-foreground transition-colors">
                    5. Limitation of Liability
                  </a>
                </li>
                <li>
                  <a href="#contact-legal" className="hover:text-foreground transition-colors">
                    6. Legal Inquiries
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-8 space-y-12 leading-relaxed text-muted-foreground">
            {/* Section 1 */}
            <div id="acceptance" className="scroll-mt-32 space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                1. Acceptance of Terms
              </h2>
              <p className="text-sm leading-relaxed">
                By entering and exploring this site, you acknowledge that you have read, understood, and agreed to these Terms of Service. If you do not agree with any part of these terms, please discontinue use of www.rvan.me.
              </p>
            </div>

            {/* Section 2 */}
            <div id="intellectual-property" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                2. Intellectual Property Rights
              </h2>
              <p className="text-sm leading-relaxed">
                All visual concepts, 3D renders, motion graphic video reels, brand identity systems, custom source code, design mockups, and written content published on this website are the sole intellectual property of Ravan Mammadov Studio or licensed from client partners.
              </p>
              <div className="rounded-xl border border-border bg-surface p-5 space-y-2 text-xs">
                <p className="font-bold text-primary">PROHIBITION OF UNAUTHORIZED REPRODUCTION</p>
                <p>No material from this portfolio may be copied, modified, distributed, republished, or used for AI dataset training without prior explicit written permission.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div id="authorized-use" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                3. Authorized Website Use
              </h2>
              <p className="text-sm leading-relaxed">
                You are granted a limited, revocable, non-exclusive license to view and interact with the content on this website solely for personal evaluation, design inspiration, or prospective business collaboration.
              </p>
            </div>

            {/* Section 4 */}
            <div id="client-engagements" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                4. Client Engagements & Project Scope
              </h2>
              <p className="text-sm leading-relaxed">
                Inquiries submitted through our contact form do not constitute a binding work agreement. Commercial design services, deliverables, revision terms, licensing rights, and payment milestones are established exclusively via formal master services agreements (MSA) signed by both parties.
              </p>
            </div>

            {/* Section 5 */}
            <div id="limitation-of-liability" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                5. Limitation of Liability
              </h2>
              <p className="text-sm leading-relaxed">
                Ravan Mammadov Studio provides this website on an "as is" and "as available" basis. While we strive to maintain 100% uptime and precise information, we make no warranties regarding uninterrupted availability or error-free rendering.
              </p>
            </div>

            {/* Section 6 */}
            <div id="contact-legal" className="scroll-mt-32 space-y-4 border-t border-border pt-10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                6. Legal Inquiries & Licensing Requests
              </h2>
              <p className="text-sm leading-relaxed">
                For questions regarding these Terms of Service or to request artwork licensing rights, please contact:
              </p>
              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <a
                  href="mailto:mammadovravan1@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-widest text-black uppercase hover:bg-white transition-colors mono"
                >
                  <Mail size={14} /> EMAIL STUDIO LEGAL
                </a>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-xs font-bold tracking-widest text-foreground hover:border-primary transition-colors mono uppercase"
                >
                  VIEW PRIVACY POLICY <ArrowUpRight size={14} />
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
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              PRIVACY POLICY
            </Link>
            <Link to="/cookie-policy" className="hover:text-primary transition-colors">
              COOKIE POLICY
            </Link>
            <Link to="/terms" className="text-primary">
              TERMS OF SERVICE
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
