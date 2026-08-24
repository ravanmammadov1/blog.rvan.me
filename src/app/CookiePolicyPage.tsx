import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useCookieConsent } from "./context/CookieConsentContext";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export default function CookiePolicyPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { openPreferences } = useCookieConsent();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Cookie Policy — Rvan.me"
        description="Official Cookie Policy for Rvan.me. Learn about essential, analytics, functional, and future marketing cookie categories."
        url="https://www.rvan.me/cookie-policy"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Header Section */}
      <section className="px-4 pt-12 pb-10 sm:px-6 md:px-8 md:pt-16 border-b border-border relative z-10">
        <div className="mx-auto max-w-[1280px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <Link
              to={getLocalizedPath("/")}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase mb-6"
            >
              <ArrowLeft size={14} /> BACK TO HOME
            </Link>

            <div className="mb-3.5">
              <span className="text-xs font-semibold tracking-[.24em] text-primary mono uppercase">
                COOKIE DISCLOSURE
              </span>
            </div>

            <h1
              className="font-extrabold tracking-tight leading-[1.05] text-foreground uppercase mb-4"
              style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.4rem)" }}
            >
              <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                Cookie Policy.
              </span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              This Cookie Policy explains how Rvan.me uses cookies and browser storage technologies to maintain secure user authentication and measure site performance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST REVISED: AUGUST 2026</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase cursor-pointer"
              >
                OPEN PREFERENCES PANEL →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Body */}
      <section className="px-4 py-12 sm:px-6 md:px-8 md:py-20 relative z-10">
        <div className="mx-auto max-w-[1280px] space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
          {/* 1. What Are Cookies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">01.</span> What Are Cookies?
            </h2>
            <p>
              Cookies and local browser storage are standard web technologies that allow websites to store session state, remember user settings, and collect aggregate performance metrics.
            </p>
          </div>

          {/* 2. Categorization */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">02.</span> Cookie Categories
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Category 1 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 01 · MANDATORY
                </span>
                <h3 className="text-base font-bold text-foreground">Strictly Necessary</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Essential for secure user authentication, account sessions, and persisting your cookie privacy choices.
                </p>
              </div>

              {/* Category 2 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 02 · OPTIONAL
                </span>
                <h3 className="text-base font-bold text-foreground">Functional</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Remembers font specimen preview settings, UI layout preferences, and interactive sandbox states.
                </p>
              </div>

              {/* Category 3 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 03 · OPTIONAL
                </span>
                <h3 className="text-base font-bold text-foreground">Analytics</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Allows aggregate, anonymized traffic measurement (e.g., page load speeds and error monitoring) to improve directory responsiveness.
                </p>
              </div>

              {/* Category 4 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-amber-400 mono uppercase tracking-wider block">
                  CATEGORY 04 · INACTIVE
                </span>
                <h3 className="text-base font-bold text-foreground">Marketing & Ads</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Marketing and advertising technologies are currently inactive on Rvan.me. They may be introduced in the future with explicit user consent controls.
                </p>
              </div>
            </div>
          </div>

          {/* 3. Managing Preferences */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">03.</span> Managing Your Preferences
            </h2>
            <p>
              You can modify or withdraw your consent choices at any time through our privacy preferences panel or through your web browser settings.
            </p>
            <button
              onClick={openPreferences}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-colors mono cursor-pointer"
            >
              CHANGE COOKIE PREFERENCES
            </button>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
