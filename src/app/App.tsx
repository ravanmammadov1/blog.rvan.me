import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense } from "react";

import HomePage from "./HomePage";
import ContactPage from "./ContactPage";
import NotFound from "./NotFound";

const WorkArchive = lazy(() => import("./WorkArchive"));
const WorkDetail = lazy(() => import("./WorkDetail"));
const BlogArchive = lazy(() => import("./BlogArchive"));
const BlogDetail = lazy(() => import("./BlogDetail"));
const NewsArchive = lazy(() => import("./NewsArchive"));
const NewsDetail = lazy(() => import("./NewsDetail"));
const ToolsArchive = lazy(() => import("./ToolsArchive"));
const RavanMammadovPage = lazy(() => import("./RavanMammadovPage"));
const PrivacyPolicyPage = lazy(() => import("./PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./CookiePolicyPage"));
const TermsPage = lazy(() => import("./TermsPage"));
const ResourcesArchive = lazy(() => import("./ResourcesArchive"));
const ResourceDetail = lazy(() => import("./ResourceDetail"));

import { useClarity } from "./hooks/useClarity";
import { CookieConsentProvider, useCookieConsent } from "./context/CookieConsentContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import CookiePreferencesModal from "./components/CookiePreferencesModal";
import { GlobalNoiseBackdrop } from "@/components/ui/noise-background";
import { motion, useScroll, useSpring } from "framer-motion";

function LeftScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed left-0 top-0 bottom-0 z-[60] w-[2px] bg-white/5 pointer-events-none" aria-hidden="true">
      <motion.div
        className="w-full bg-primary origin-top h-full"
        style={{ scaleY }}
      />
    </div>
  );
}

function AppContent() {
  useClarity();
  const { consent } = useCookieConsent();

  return (
    <>
      <GlobalNoiseBackdrop />
      <LeftScrollIndicator />
      <Suspense fallback={<div />}> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkArchive />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogArchive />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/news" element={<NewsArchive />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/tools" element={<ToolsArchive />} />
          <Route path="/ravan-mammadov" element={<RavanMammadovPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
          <Route path="/resources" element={<ResourcesArchive />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />

          {/* 301 Redirects & legacy route alias compatibility */}
          <Route path="/ravanmammadov" element={<Navigate to="/ravan-mammadov" replace />} />
          <Route path="/about" element={<Navigate to="/ravan-mammadov" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CookieConsentBanner />
      <CookiePreferencesModal />

      {consent?.analytics && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <CookieConsentProvider>
      <AppContent />
    </CookieConsentProvider>
  );
}