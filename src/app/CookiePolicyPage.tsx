import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ArrowUpRight, CheckCircle2, Sliders, BarChart3, Lock, Cookie } from "lucide-react";
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
        description="Official Cookie Policy for Rvan.me. Learn about the cookies we use, why we use them, and how you can manage your preferences."
        url="https://www.rvan.me/cookie-policy"
      />

      <SiteHeader siteSettings={siteSettings} />

      {/* Header Section */}
      <section className="px-6 pt-24 pb-12 md:px-10 md:pt-32 border-b border-white/10 relative z-10">
        <div className="mx-auto max-w-[1200px]">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.05}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors mono uppercase mb-6"
            >
              <ArrowLeft size={14} /> BACK TO HOME
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold tracking-widest text-primary mono uppercase">
              <Cookie size={14} /> COOKIE DISCLOSURE
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              Cookie Policy.
            </h1>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed font-medium">
              This Cookie Policy discloses how Rvan.me uses cookies and browser storage technologies to maintain secure authentication and analyze website traffic.
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
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10">
        <div className="mx-auto max-w-[1200px] space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
          {/* 1. What Are Cookies */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">01.</span> What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device by your browser when you visit websites. They allow websites to store session state, remember user preferences, and collect anonymous telemetry data.
            </p>
          </div>

          {/* 2. Categorization */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">02.</span> How We Categorize Cookies
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Category 1 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 01 · MANDATORY
                </span>
                <h3 className="text-base font-bold text-foreground">Strictly Necessary</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Essential for secure Google OAuth session tokens, CSRF protection, and storing your consent preferences.
                </p>
              </div>

              {/* Category 2 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 02 · OPTIONAL
                </span>
                <h3 className="text-base font-bold text-foreground">Analytics & Performance</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Enables Google Analytics 4, Microsoft Clarity, and Vercel Speed Insights to aggregate anonymous metrics to optimize site speed.
                </p>
              </div>

              {/* Category 3 */}
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <span className="text-[10px] font-bold text-primary mono uppercase tracking-wider block">
                  CATEGORY 03 · OPTIONAL
                </span>
                <h3 className="text-base font-bold text-foreground">Functional & Customization</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Remembers custom font specimen preview text, type sizes, and interactive sandbox states.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-400 font-mono">
              ✓ <strong>Zero Marketing Cookies:</strong> Rvan.me does NOT use marketing, advertising, cross-site tracking, or behavioral profiling cookies.
            </div>
          </div>

          {/* 3. Detailed Inventory */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">03.</span> Cookie Inventory & Service Providers
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs text-muted-foreground">
                <thead className="bg-white/5 text-foreground mono uppercase text-[10px]">
                  <tr>
                    <th className="p-3.5 border-b border-white/10">Provider</th>
                    <th className="p-3.5 border-b border-white/10">Cookie Name</th>
                    <th className="p-3.5 border-b border-white/10">Category</th>
                    <th className="p-3.5 border-b border-white/10">Purpose</th>
                    <th className="p-3.5 border-b border-white/10">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Rvan.me System</td>
                    <td className="p-3.5 text-primary">rvan_cookie_consent</td>
                    <td className="p-3.5">Necessary</td>
                    <td className="p-3.5">Stores your cookie consent selection.</td>
                    <td className="p-3.5">1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Google Firebase</td>
                    <td className="p-3.5 text-primary">__session / firebase:authUser</td>
                    <td className="p-3.5">Necessary</td>
                    <td className="p-3.5">Authenticates Google Sign-In user session.</td>
                    <td className="p-3.5">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Google Analytics</td>
                    <td className="p-3.5 text-primary">_ga / _ga_*</td>
                    <td className="p-3.5">Analytics</td>
                    <td className="p-3.5">Calculates aggregate visitor telemetry.</td>
                    <td className="p-3.5">2 Years</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Microsoft Clarity</td>
                    <td className="p-3.5 text-primary">_clck / _clsk</td>
                    <td className="p-3.5">Analytics</td>
                    <td className="p-3.5">Diagnoses UI bottlenecks via heatmap telemetry.</td>
                    <td className="p-3.5">1 Year</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-foreground">Vercel Analytics</td>
                    <td className="p-3.5 text-primary">va_speed_insights</td>
                    <td className="p-3.5">Analytics</td>
                    <td className="p-3.5">Measures Web Vitals edge performance.</td>
                    <td className="p-3.5">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Managing Preferences */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-primary mono text-base">04.</span> Managing Your Preferences
            </h2>
            <p>
              You can adjust your consent choices at any time by clicking the button below, or by modifying your browser settings to block cookies.
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
