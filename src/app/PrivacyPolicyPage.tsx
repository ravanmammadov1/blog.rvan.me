import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, Mail } from "lucide-react";
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
        description="Official Privacy Policy for Rvan.me. Information disclosures and user privacy controls designed with applicable privacy standards in mind."
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
              <Shield size={14} /> PRIVACY & GOVERNANCE
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              Privacy Policy.
            </h1>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed font-medium">
              This Privacy Policy explains how Rvan.me ("we", "us", or "our") collects, processes, and protects your information when you access our creative platform and directory. Privacy information and user controls are designed with applicable privacy requirements in mind.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST REVISED: AUGUST 2026</span>
              <span>·</span>
              <button
                onClick={openPreferences}
                className="text-primary font-bold hover:underline mono uppercase cursor-pointer"
              >
                MANAGE COOKIE CONSENT →
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
                <li><a href="#marketing-disclosure" className="hover:text-primary transition-colors">5. Marketing & Advertising</a></li>
                <li><a href="#data-retention" className="hover:text-primary transition-colors">6. Data Retention</a></li>
                <li><a href="#user-rights" className="hover:text-primary transition-colors">7. Your Privacy Rights</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">8. Contact Information</a></li>
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
                Rvan.me is operated by Ravan Mammadov Studio. For the purposes of applicable data protection laws, Rvan.me acts as the data controller for personal information processed through the platform.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div id="information-collected" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">02.</span> Information We Collect
              </h2>
              <p>We collect information necessary to operate member features and maintain platform performance:</p>
              <div className="space-y-3 pl-4 border-l-2 border-primary/40">
                <div>
                  <h3 className="font-bold text-foreground text-sm">Authentication Data (Voluntary)</h3>
                  <p className="text-xs">When you sign in using Google OAuth, we receive basic profile information (such as your name, email address, and avatar image) to authenticate your account and save your member preferences.</p>
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Telemetry & Performance Data (Automatic)</h3>
                  <p className="text-xs">We automatically collect standard technical metrics, including browser type, operating system, aggregate page views, and request timestamps to monitor site health and speed.</p>
                </div>
              </div>
            </div>

            {/* 3. How We Use Information */}
            <div id="how-we-use-data" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">03.</span> How We Use Information
              </h2>
              <p>We process your information for the following legitimate purposes:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Authenticating user sign-in and providing member features (such as saving favorite resources).</li>
                <li>Measuring site performance, diagnosing technical errors, and maintaining platform security.</li>
                <li>Improving directory organization and user experience based on aggregate usage patterns.</li>
              </ul>
            </div>

            {/* 4. Third-Party Services */}
            <div id="third-party-services" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">04.</span> Third-Party Services & Future Expansion
              </h2>
              <p>
                Rvan.me may use third-party service providers for authentication, analytics, performance monitoring, communications, advertising, marketing, payments, AI services, and platform operations. The specific providers used may change over time. Where a new service materially changes how personal data is processed, the relevant privacy and cookie disclosures will be updated as required.
              </p>
            </div>

            {/* 5. Marketing Disclosure */}
            <div id="marketing-disclosure" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">05.</span> Marketing & Advertising Technologies
              </h2>
              <p>
                Rvan.me does not currently use marketing or advertising cookies or tracking tags. We may introduce advertising, marketing, conversion measurement, remarketing, or similar technologies in the future. Where required by applicable law, appropriate consent and user controls will be provided before such technologies are activated.
              </p>
            </div>

            {/* 6. Data Retention */}
            <div id="data-retention" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">06.</span> Data Retention
              </h2>
              <p>
                Account authentication details are retained for as long as your account remains active. Technical logs and aggregate analytics data are stored in accordance with standard provider retention periods and automatically purged when no longer needed.
              </p>
            </div>

            {/* 7. Your Privacy Rights */}
            <div id="user-rights" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">07.</span> Your Privacy Rights & Controls
              </h2>
              <p>Depending on your jurisdiction, you hold the following rights regarding your information:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Access & Deletion:</strong> Request access to or deletion of your personal account data.</li>
                <li><strong>Consent Management:</strong> Modify or withdraw your optional cookie preferences at any time using our privacy panel.</li>
              </ul>
            </div>

            {/* 8. Contact Information */}
            <div id="contact" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">08.</span> Contact Information
              </h2>
              <p>For privacy inquiries or data requests, contact us at:</p>
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Privacy Enquiries — Rvan.me</p>
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
