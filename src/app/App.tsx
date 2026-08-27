import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { lazy, Suspense } from "react";

import HomePage from "./HomePage";
import ContactPage from "./ContactPage";
import NotFound from "./NotFound";

const BlogArchive = lazy(() => import("./BlogArchive"));
const BlogDetail = lazy(() => import("./BlogDetail"));
const AboutPage = lazy(() => import("./AboutPage"));
const ProfilePage = lazy(() => import("./ProfilePage"));
const FounderProfilePage = lazy(() => import("./pages/FounderProfilePage"));
const WorkArchive = lazy(() => import("./WorkArchive"));
const PrivacyPolicyPage = lazy(() => import("./PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("./CookiePolicyPage"));
const TermsPage = lazy(() => import("./TermsPage"));
const ResourcesArchive = lazy(() => import("./ResourcesArchive"));
const ResourceDetail = lazy(() => import("./ResourceDetail"));
const ProjectDetail = lazy(() => import("./ProjectDetail"));
const AiToolArchivePage = lazy(() => import("./pages/AiToolArchivePage"));
const OpportunityArchivePage = lazy(() => import("./pages/OpportunityArchivePage"));
const FontDetailPage = lazy(() => import("./pages/FontDetailPage"));
const PublicAuthorProfilePage = lazy(() => import("./pages/PublicAuthorProfilePage"));
const FaqPage = lazy(() => import("./FaqPage"));
const AdminConsolePage = lazy(() => import("./pages/admin/AdminConsolePage"));
const TopicArchivePage = lazy(() => import("./pages/TopicArchivePage"));
const TopicDetailPage = lazy(() => import("./pages/TopicDetailPage"));
const WriteForRvanPage = lazy(() => import("./pages/WriteForRvanPage"));

import { useClarity } from "./hooks/useClarity";
import { CookieConsentProvider, useCookieConsent } from "./context/CookieConsentContext";
import CookieConsentBanner from "./components/CookieConsentBanner";
import CookiePreferencesModal from "./components/CookiePreferencesModal";
import GoogleTagManager from "./components/GoogleTagManager";

import { LanguageProvider } from "../lib/i18n/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider } from "../context/AuthContext";
import { ExperienceProvider } from "../context/ExperienceContext";

function AppRoutes() {
  return (
    <Routes>
      {/* English Default Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<ProfilePage />} />
      <Route path="/contributor" element={<Navigate to="/write" replace />} />
      <Route path="/contributor/dashboard" element={<Navigate to="/write" replace />} />
      {/* Founder & Author Routes */}
      <Route path="/about/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/ravanmammadov" element={<Navigate to="/ravan-mammadov" replace />} />
      <Route path="/author/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/author/:authorSlug" element={<PublicAuthorProfilePage />} />
      <Route path="/work" element={<WorkArchive />} />
      <Route path="/work/:slug" element={<ProjectDetail />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/write" element={<WriteForRvanPage />} />
      <Route path="/blog" element={<BlogArchive />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/topics" element={<TopicArchivePage />} />
      <Route path="/topics/:topicSlug" element={<TopicDetailPage />} />
      <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/cookies" element={<Navigate to="/cookie-policy" replace />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/terms-of-service" element={<Navigate to="/terms" replace />} />
      <Route path="/resources" element={<ResourcesArchive />} />
      <Route path="/resources/:slug" element={<ResourceDetail />} />
      <Route path="/ai-tools" element={<AiToolArchivePage />} />
      <Route path="/opportunities" element={<OpportunityArchivePage />} />
      <Route path="/fonts" element={<Navigate to="/resources?category=fonts" replace />} />
      <Route path="/fonts/:fontSlug" element={<FontDetailPage />} />

      {/* Admin Control Routes */}
      <Route path="/admin" element={<AdminConsolePage />} />
      <Route path="/admin/submissions" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/applications" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/contributors" element={<Navigate to="/admin" replace />} />
      <Route path="/admin/articles" element={<AdminConsolePage />} />
      <Route path="/admin/linkedin" element={<Navigate to="/admin" replace />} />

      {/* Azerbaijani (/az) Parallel Routes */}
      <Route path="/az" element={<HomePage />} />
      <Route path="/az/about" element={<AboutPage />} />
      <Route path="/az/faq" element={<FaqPage />} />
      <Route path="/az/profile" element={<ProfilePage />} />
      <Route path="/az/settings" element={<ProfilePage />} />
      <Route path="/az/contributor" element={<Navigate to="/az/write" replace />} />
      <Route path="/az/contributor/dashboard" element={<Navigate to="/az/write" replace />} />
      <Route path="/az/about/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/az/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/az/ravanmammadov" element={<Navigate to="/az/ravan-mammadov" replace />} />
      <Route path="/az/author/ravan-mammadov" element={<FounderProfilePage />} />
      <Route path="/az/author/:authorSlug" element={<PublicAuthorProfilePage />} />
      <Route path="/az/work" element={<WorkArchive />} />
      <Route path="/az/work/:slug" element={<ProjectDetail />} />
      <Route path="/az/contact" element={<ContactPage />} />
      <Route path="/az/write" element={<WriteForRvanPage />} />
      <Route path="/az/blog" element={<BlogArchive />} />
      <Route path="/az/blog/:slug" element={<BlogDetail />} />
      <Route path="/az/topics" element={<TopicArchivePage />} />
      <Route path="/az/topics/:topicSlug" element={<TopicDetailPage />} />
      <Route path="/az/privacy" element={<Navigate to="/az/privacy-policy" replace />} />
      <Route path="/az/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/az/cookies" element={<Navigate to="/az/cookie-policy" replace />} />
      <Route path="/az/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/az/terms" element={<TermsPage />} />
      <Route path="/az/terms-of-service" element={<Navigate to="/az/terms" replace />} />
      <Route path="/az/resources" element={<ResourcesArchive />} />
      <Route path="/az/resources/:slug" element={<ResourceDetail />} />
      <Route path="/az/ai-tools" element={<AiToolArchivePage />} />
      <Route path="/az/opportunities" element={<OpportunityArchivePage />} />
      <Route path="/az/fonts" element={<Navigate to="/az/resources?category=fonts" replace />} />
      <Route path="/az/fonts/:fontSlug" element={<FontDetailPage />} />
      <Route path="/az/admin" element={<AdminConsolePage />} />
      <Route path="/az/admin/submissions" element={<Navigate to="/az/admin" replace />} />
      <Route path="/az/admin/applications" element={<Navigate to="/az/admin" replace />} />
      <Route path="/az/admin/contributors" element={<Navigate to="/az/admin" replace />} />
      <Route path="/az/admin/articles" element={<AdminConsolePage />} />
      <Route path="/az/admin/linkedin" element={<Navigate to="/az/admin" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  useClarity();
  const { consent } = useCookieConsent();

  return (
    <>
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

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <ExperienceProvider>
            <CookieConsentProvider>
              <AppContent />
            </CookieConsentProvider>
          </ExperienceProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
