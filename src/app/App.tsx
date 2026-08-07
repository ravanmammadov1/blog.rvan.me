import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense } from "react";

import HomePage from "./HomePage";
import ContactPage from "./ContactPage";
import NotFound from "./NotFound";

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
const WorkArchive = lazy(() => import("./WorkArchive"));
const ProjectDetail = lazy(() => import("./ProjectDetail"));
const AiToolArchivePage = lazy(() => import("./pages/AiToolArchivePage"));
const OpportunityArchivePage = lazy(() => import("./pages/OpportunityArchivePage"));

import { useClarity } from "./hooks/useClarity";
import { CookieConsentProvider, useCookieConsent } from "./context/CookieConsentContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import CookiePreferencesModal from "./components/CookiePreferencesModal";
import GoogleTagManager from "./components/GoogleTagManager";
import { GlobalNoiseBackdrop } from "@/components/ui/noise-background";

function AppContent() {
  useClarity();
  const { consent } = useCookieConsent();

  return (
    <>
      <GlobalNoiseBackdrop />
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkArchive />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
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
          <Route path="/resources" element={<ResourcesArchive />} />
          <Route path="/resources/:slug" element={<ResourceDetail />} />
          <Route path="/ai-tools" element={<AiToolArchivePage />} />
          <Route path="/opportunities" element={<OpportunityArchivePage />} />


          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <CookieConsentBanner />
      <CookiePreferencesModal />
      <GoogleTagManager />

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
