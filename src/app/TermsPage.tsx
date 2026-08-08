import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowLeft, ArrowUpRight, Scale, Mail } from "lucide-react";
import { fetchSiteSettings } from "../lib/sanityQueries";
import { SiteSettings } from "../types/cms";
import SEO from "./components/SEO";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: EASE },
  }),
};

export default function TermsPage() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings().then((data) => {
      if (data) setSiteSettings(data);
    });
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Geist', sans-serif" }}>
      <SEO
        title="Terms of Service — Rvan.me"
        description="Official Terms of Service for Rvan.me. Learn about acceptable use, intellectual property, and service terms."
        url="https://www.rvan.me/terms"
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
              <Scale size={14} /> SERVICE AGREEMENT
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl text-foreground">
              Terms of Service.
            </h1>

            <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed font-medium">
              These Terms of Service govern your access to and use of the Rvan.me website, resources directory, tools, and services.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground mono">
              <span>LAST REVISED: AUGUST 2026</span>
              <span>·</span>
              <span>GOVERNING LAW: AZERBAIJAN</span>
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
                CONTENTS OVERVIEW
              </p>
              <ul className="space-y-2 text-xs font-medium text-muted-foreground">
                <li><a href="#acceptance" className="hover:text-primary transition-colors">1. Acceptance of Terms</a></li>
                <li><a href="#intellectual-property" className="hover:text-primary transition-colors">2. Intellectual Property</a></li>
                <li><a href="#acceptable-use" className="hover:text-primary transition-colors">3. Acceptable Use Policy</a></li>
                <li><a href="#external-links" className="hover:text-primary transition-colors">4. External Directory Links</a></li>
                <li><a href="#limitation-liability" className="hover:text-primary transition-colors">5. Limitation of Liability</a></li>
                <li><a href="#changes" className="hover:text-primary transition-colors">6. Modifications to Terms</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">7. Contact Information</a></li>
              </ul>
            </div>
          </div>

          {/* Terms Text */}
          <div className="lg:col-span-8 space-y-12 text-sm leading-relaxed text-muted-foreground font-medium">
            {/* 1. Acceptance */}
            <div id="acceptance" className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">01.</span> Acceptance of Terms
              </h2>
              <p>
                By browsing, accessing, or creating an account on Rvan.me, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must discontinue use of the platform immediately.
              </p>
            </div>

            {/* 2. Intellectual Property */}
            <div id="intellectual-property" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">02.</span> Intellectual Property
              </h2>
              <p>
                The Rvan.me website code, visual design system, brand assets, logos, and original written essays are protected by copyright, trademark, and international intellectual property laws, owned by Ravan Mammadov Studio.
              </p>
              <p className="text-xs text-muted-foreground/80">
                Third-party fonts, tools, icons, and software showcased in our directory remain the sole property of their respective creators and are subject to their respective SIL Open Font, MIT, or commercial licenses.
              </p>
            </div>

            {/* 3. Acceptable Use */}
            <div id="acceptable-use" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">03.</span> Acceptable Use Policy
              </h2>
              <p>You agree not to engage in any of the following prohibited activities:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Automated web scraping, aggressive crawling, or denial-of-service (DoS) attacks.</li>
                <li>Attempting to bypass security mechanisms or access unauthorized database environments.</li>
                <li>Submitting offensive, malicious, or spam content through the comment system.</li>
              </ul>
            </div>

            {/* 4. External Links */}
            <div id="external-links" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">04.</span> External Directory Links
              </h2>
              <p>
                Rvan.me provides curated links to external websites, developer utilities, and downloadable assets. We do not control or endorse the content, privacy policies, or safety of external third-party sites.
              </p>
            </div>

            {/* 5. Limitation of Liability */}
            <div id="limitation-liability" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">05.</span> Limitation of Liability
              </h2>
              <p>
                Rvan.me is provided on an "as is" and "as available" basis without warranties of any kind. In no event shall Rvan.me or Ravan Mammadov Studio be liable for any direct, indirect, or consequential damages resulting from your use or inability to use the site.
              </p>
            </div>

            {/* 6. Modifications */}
            <div id="changes" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">06.</span> Modifications to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. Changes become effective immediately upon publication to this page. Continued use of the platform constitutes your acceptance of modified terms.
              </p>
            </div>

            {/* 7. Contact */}
            <div id="contact" className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                <span className="text-primary mono text-base">07.</span> Contact Information
              </h2>
              <p>For inquiries regarding these Terms of Service, contact:</p>
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-foreground">Legal — Rvan.me Studio</p>
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
