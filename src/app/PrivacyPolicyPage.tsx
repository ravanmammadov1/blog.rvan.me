import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ArrowUpRight, CheckCircle2, Lock, Eye, Mail, Server } from "lucide-react";
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
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Privacy Policy — Rvan.me"
        description="Official Privacy Policy for Rvan.me. Learn how we collect, process, and protect your personal information under GDPR and international privacy standards."
        url="https://www.rvan.me/privacy-policy"
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
              <Shield size={14} /> DATA PROTECTION & PRIVACY
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              Privacy Policy.
            </h1>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed font-medium">
              This Privacy Policy explains how Rvan.me ("we", "us", or "our") collects, uses, and discloses information about you when you access our creative platform, tools, and services.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST REVISED: AUGUST 2026</span>
              <span>·</span>
              <span>COMPLIANCE: GDPR, CCPA & PECR</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase cursor-pointer"
              >
                MANAGE COOKIES →
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Body */}
      <section className="px-6 py-16 md:px-10 md:py-24 relative z-10">
        <div className="mx-auto max-w-[1200px] grid gap-12 lg:grid-cols-12">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-4 space-y-3 sticky top-32 h-fit">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 glass">
              <p className="text-xs font-bold tracking-widest text-primary mono uppercase mb-4">
                SECTIONS
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><a href="#data-controller" className="hover:text-primary transition-colors">1. Data Controller</a></li>
                <li><a href="#information-collected" className="hover:text-primary transition-colors">2. Information We Collect</a></li>
                <li><a href="#how-we-use-data" className="hover:text-primary transition-colors">3. How We Use Information</a></li>
                <li><a href="#third-party-services" className="hover:text-primary transition-colors">4. Third-Party Services</a></li>
                <li><a href="#data-retention" className="hover:text-primary transition-colors">5. Data Retention</a></li>
                <li><a href="#user-rights" className="hover:text-primary transition-colors">6. Your Privacy Rights</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">7. Contact Information</a></li>
              </ul>
            </div>
          </div>

          {/* Policy Text */}
          <div className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
            {/* 1. Data Controller */}
            <div id="data-controller" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">01.</span> Data Controller
              </h2>
              <p>
                Rvan.me is operated by Ravan Mammadov Studio, located in Baku, Azerbaijan. For the purposes of the General Data Protection Regulation (GDPR) and applicable data privacy laws, Rvan.me acts as the Data Controller for personal data processed through our website.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div id="information-collected" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">02.</span> Information We Collect
              </h2>
              <p>We collect information only when necessary to provide and improve our creative directory services:</p>
              <div className="space-y-3 pl-4 border-l-2 border-primary/40">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Account & Auth Data (Voluntary)</h3>
                  <p className="text-xs">When you sign in using Google OAuth, we collect your name, email address, and profile avatar URL to authenticate your session and enable member features (such as saving bookmarks).</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Technical & Telemetry Data (Automatic)</h3>
                  <p className="text-xs">We automatically log anonymized technical details including IP address hash, browser type, operating system, referring URL, and page request timestamps to maintain edge performance and infrastructure security.</p>
                </div>
              </div>
            </div>

            {/* 3. How We Use Information */}
            <div id="how-we-use-data" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">03.</span> How We Use Information
              </h2>
              <p>We process your personal data strictly for legitimate operational purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>To authenticate user accounts and persist personal resource bookmarks.</li>
                <li>To optimize edge delivery speed and monitor sub-second search index performance.</li>
                <li>To diagnose technical errors and protect against automated scraping or malicious bot traffic.</li>
                <li>We do <strong>never</strong> sell, rent, or trade your personal data to third parties for marketing purposes.</li>
              </ul>
            </div>

            {/* 4. Third-Party Services */}
            <div id="third-party-services" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">04.</span> Third-Party Service Providers
              </h2>
              <p>We rely on trusted infrastructure providers to operate the platform safely:</p>
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h4 className="font-bold text-foreground text-xs mb-1">Google Firebase</h4>
                  <p className="text-[11px]">Handles Google OAuth authentication and Firestore database storage for comments and bookmarks.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h4 className="font-bold text-foreground text-xs mb-1">Vercel Web Analytics</h4>
                  <p className="text-[11px]">Provides privacy-first, cookieless aggregate traffic measurement and Speed Insights performance metrics.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h4 className="font-bold text-foreground text-xs mb-1">Google Analytics (GTAG)</h4>
                  <p className="text-[11px]">Measures aggregate usage patterns with IP anonymization enabled by default.</p>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                  <h4 className="font-bold text-foreground text-xs mb-1">Microsoft Clarity</h4>
                  <p className="text-[11px]">Analyzes user interaction session heatmaps to diagnose navigation bottlenecks.</p>
                </div>
              </div>
            </div>

            {/* 5. Data Retention */}
            <div id="data-retention" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">05.</span> Data Retention
              </h2>
              <p>
                We retain your account authentication data only for as long as your account remains active. Anonymized analytics and server telemetry logs are automatically purged after 14 months.
              </p>
            </div>

            {/* 6. Your Privacy Rights */}
            <div id="user-rights" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">06.</span> Your Privacy Rights (GDPR & CCPA)
              </h2>
              <p>Depending on your jurisdiction, you hold the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Right to Access & Portability:</strong> Request a copy of all personal data associated with your profile.</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request complete deletion of your account and saved comments.</li>
                <li><strong>Right to Revoke Consent:</strong> Update or withdraw cookie consent preferences at any time.</li>
              </ul>
            </div>

            {/* 7. Contact Information */}
            <div id="contact" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">07.</span> Contact Information
              </h2>
              <p>
                For privacy enquiries, data deletion requests, or GDPR rights execution, contact us directly:
              </p>
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Privacy Officer — Rvan.me</p>
                  <a href="mailto:mammadovravan1@gmail.com" className="text-xs text-primary font-mono hover:underline">
                    mammadovravan1@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer siteSettings={siteSettings} />
      <ScrollToTopButton />
    </main>
  );
}
