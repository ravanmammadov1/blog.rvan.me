import { Routes, Route, Navigate } from "react-router-dom";
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
const AboutPage = lazy(() => import("./AboutPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const PrivacyPolicyPage = lazy(() => import("./PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./CookiePolicyPage"));
const TermsPage = lazy(() => import("./TermsPage"));
const ResourcesArchive = lazy(() => import("./ResourcesArchive"));
const ResourceDetail = lazy(() => import("./ResourceDetail"));
const ProjectDetail = lazy(() => import("./ProjectDetail"));
const AiToolArchivePage = lazy(() => import("./pages/AiToolArchivePage"));
const OpportunityArchivePage = lazy(() => import("./pages/OpportunityArchivePage"));
const ToolDetailPage = lazy(() => import("./pages/ToolDetailPage"));
const FontDetailPage = lazy(() => import("./pages/FontDetailPage"));
const LinkedInAdmin = lazy(() => import("./LinkedInAdmin"));

import { useClarity } from "./hooks/useClarity";
import { CookieConsentProvider, useCookieConsent } from "./context/CookieConsentContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import CookiePreferencesModal from "./components/CookiePreferencesModal";
import GoogleTagManager from "./components/GoogleTagManager";
import { GlobalNoiseBackdrop } from "@/components/ui/noise-background";

import { LanguageProvider } from "../lib/i18n/LanguageContext";

function AppRoutes() {
  return (
    <Routes>
      {/* English Default Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/ravan-mammadov" element={<ProfilePage />} />
      <Route path="/work" element={<Navigate to="/profile" replace />} />
      <Route path="/work/:slug" element={<ProjectDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogArchive />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/news" element={<NewsArchive />} />
      <Route path="/news/:slug" element={<NewsDetail />} />
      <Route path="/tools" element={<ToolsArchive />} />
      <Route path="/tools/:toolId" element={<ToolDetailPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/resources" element={<ResourcesArchive />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/ai-tools" element={<AiToolArchivePage />} />
      <Route path="/opportunities" element={<OpportunityArchivePage />} />
      <Route path="/fonts" element={<Navigate to="/resources?category=fonts" replace />} />
      <Route path="/fonts/:fontSlug" element={<FontDetailPage />} />

      {/* Admin Control Routes */}
      <Route path="/admin/linkedin" element={<LinkedInAdmin />} />

      {/* Azerbaijani (/az) Parallel Routes */}
      <Route path="/az" element={<HomePage />} />
      <Route path="/az/about" element={<AboutPage />} />
      <Route path="/az/profile" element={<ProfilePage />} />
      <Route path="/az/ravan-mammadov" element={<ProfilePage />} />
      <Route path="/az/work" element={<Navigate to="/az/profile" replace />} />
      <Route path="/az/work/:slug" element={<ProjectDetail />} />
      <Route path="/az/contact" element={<ContactPage />} />
      <Route path="/az/blog" element={<BlogArchive />} />
      <Route path="/az/blog/:slug" element={<BlogDetail />} />
      <Route path="/az/news" element={<NewsArchive />} />
      <Route path="/az/news/:slug" element={<NewsDetail />} />
      <Route path="/az/tools" element={<ToolsArchive />} />
      <Route path="/az/tools/:toolId" element={<ToolDetailPage />} />
      <Route path="/az/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/az/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/az/terms" element={<TermsPage />} />
      <Route path="/az/resources" element={<ResourcesArchive />} />
      <Route path="/az/resources/:slug" element={<ResourceDetail />} />
      <Route path="/az/ai-tools" element={<AiToolArchivePage />} />
      <Route path="/az/opportunities" element={<OpportunityArchivePage />} />
      <Route path="/az/fonts" element={<Navigate to="/az/resources?category=fonts" replace />} />
      <Route path="/az/fonts/:fontSlug" element={<FontDetailPage />} />
      <Route path="/az/admin/linkedin" element={<LinkedInAdmin />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  useClarity();
  const { consent } = useCookieConsent();

  return (
    <>
      <GlobalNoiseBackdrop />
      <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>}> 
        <AppRoutes />
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

import { AuthProvider } from "../context/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

export default function App() {
  return (
    <AuthProvider>
      <CookieConsentProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </CookieConsentProvider>
    </AuthProvider>
  );
}

