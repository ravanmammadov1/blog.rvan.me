import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Cookie, Settings, ShieldCheck, BarChart3, Sliders, ArrowLeft, RotateCcw } from "lucide-react";
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

export default function CookiePolicyPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const { consent, openPreferences, rejectNonEssential, acceptAll } = useCookieConsent();

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
        title="Cookie Policy & Audit — Ravan Mammadov Studio"
        description="Comprehensive audit of all cookies and tracking technologies used on rvan.me. Manage your consent preferences and view cookie lifespans and vendors."
        url="https://www.rvan.me/cookie-policy"
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
              <Cookie size={14} /> COOKIE GOVERNANCE
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-[-.06em] md:text-7xl">
              Cookie Policy.
            </h1>

            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
              This Cookie Policy explains how Ravan Mammadov Studio uses cookies and similar tracking technologies when you visit <strong className="text-foreground">www.rvan.me</strong>.
            </p>

            {/* Interactive Preference Control Card */}
            <div className="mt-10 rounded-2xl border border-primary/30 bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-primary mono uppercase">YOUR CURRENT CONSENT STATUS</span>
                <div className="mt-2 flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-lg font-bold text-foreground">
                    {consent?.analytics ? "All Cookies Accepted" : "Essential Cookies Only"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Analytics: {consent?.analytics ? "Enabled" : "Disabled"} · Functional: {consent?.functional ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <button
                  onClick={openPreferences}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold tracking-widest text-black uppercase hover:bg-white transition-colors mono w-full sm:w-auto"
                >
                  <Settings size={14} /> MANAGE PREFERENCES
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audit Table Section */}
      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1200px] space-y-16">
          {/* Section 1: Overview */}
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              1. What Are Cookies?
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files placed on your device by websites that you visit. They are widely used to make websites work efficiently, provide secure authentication, and supply statistical reporting to site owners.
            </p>
          </div>

          {/* Section 2: Audit Table */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                2. Detailed Cookie Audit Table
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                The table below itemizes every active cookie deployed on www.rvan.me, categorized by purpose and lifespan.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="border-b border-border bg-background/50 text-[10px] font-bold uppercase tracking-widest text-primary mono">
                  <tr>
                    <th className="p-4 sm:p-5">Cookie Name</th>
                    <th className="p-4 sm:p-5">Provider / Vendor</th>
                    <th className="p-4 sm:p-5">Category</th>
                    <th className="p-4 sm:p-5">Lifespan</th>
                    <th className="p-4 sm:p-5">Purpose & Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 font-medium">
                  {/* Essential */}
                  <tr className="hover:bg-background/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground mono">ravan_cookie_consent_v1</td>
                    <td className="p-4 sm:p-5 text-foreground">First-Party (rvan.me)</td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block rounded-full bg-[#d8ff44]/10 px-2.5 py-1 text-[9px] font-bold text-primary mono uppercase">
                        Essential
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 mono">1 Year</td>
                    <td className="p-4 sm:p-5">Stores your cookie consent choices so the banner does not re-appear on subsequent visits.</td>
                  </tr>
                  <tr className="hover:bg-background/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground mono">ravan_cookie_consent</td>
                    <td className="p-4 sm:p-5 text-foreground">First-Party (rvan.me)</td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block rounded-full bg-[#d8ff44]/10 px-2.5 py-1 text-[9px] font-bold text-primary mono uppercase">
                        Essential
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 mono">1 Year</td>
                    <td className="p-4 sm:p-5">HTTP-accessible cookie maintaining consent status for edge routing.</td>
                  </tr>

                  {/* Analytics */}
                  <tr className="hover:bg-background/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground mono">_ga, _ga_*</td>
                    <td className="p-4 sm:p-5 text-foreground">Google Analytics 4</td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-[9px] font-bold text-blue-400 mono uppercase">
                        Analytics
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 mono">2 Years</td>
                    <td className="p-4 sm:p-5">Used to distinguish users and aggregate anonymous page view statistics.</td>
                  </tr>
                  <tr className="hover:bg-background/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground mono">_clck, _clsk</td>
                    <td className="p-4 sm:p-5 text-foreground">Microsoft Clarity</td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-[9px] font-bold text-blue-400 mono uppercase">
                        Analytics
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 mono">1 Year / Session</td>
                    <td className="p-4 sm:p-5">Persists user session IDs to evaluate UX heatmaps and interaction flows.</td>
                  </tr>
                  <tr className="hover:bg-background/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground mono">_vercel_analytics</td>
                    <td className="p-4 sm:p-5 text-foreground">Vercel Inc.</td>
                    <td className="p-4 sm:p-5">
                      <span className="inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-[9px] font-bold text-blue-400 mono uppercase">
                        Performance
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 mono">Session</td>
                    <td className="p-4 sm:p-5">Measures real-user web vitals, page load latencies, and edge server health.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Browser Controls */}
          <div className="space-y-4 max-w-3xl border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              3. Managing Cookies via Browser Settings
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              In addition to our on-site privacy controls, you can block or delete cookies directly through your web browser preferences. Most modern browsers allow you to decline all cookies or remove stored cookies under Privacy & Security settings:
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold mono uppercase">
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Google Chrome →
              </a>
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Apple Safari →
              </a>
              <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                Mozilla Firefox →
              </a>
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
            <Link to="/cookie-policy" className="text-primary">
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
