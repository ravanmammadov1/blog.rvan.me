import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import HomePage from "./HomePage";
import ExpertisePage from "./ExpertisePage";
import ContactPage from "./ContactPage";
import NotFound from "./NotFound";
import { lazy, Suspense } from "react";

const WorkArchive = lazy(() => import("./WorkArchive"));
const WorkDetail = lazy(() => import("./WorkDetail"));
const BlogArchive = lazy(() => import("./BlogArchive"));
const BlogDetail = lazy(() => import("./BlogDetail"));
const NewsArchive = lazy(() => import("./NewsArchive"));
const NewsDetail = lazy(() => import("./NewsDetail"));
const ToolsArchive = lazy(() => import("./ToolsArchive"));
const RavanMammadovPage = lazy(() => import("./RavanMammadovPage"));

import { useGA4Tracker } from "./hooks/useGA4Tracker";
import { useClarity } from "./hooks/useClarity";

export default function App() {
  useGA4Tracker();
  useClarity();

  return (
    <>
      <Suspense fallback={<div />}> 
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkArchive />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogArchive />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/news" element={<NewsArchive />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/tools" element={<ToolsArchive />} />
          <Route path="/ravan-mammadov" element={<RavanMammadovPage />} />

        {/* 301 Redirects & legacy route alias compatibility */}
        <Route path="/ravanmammadov" element={<Navigate to="/ravan-mammadov" replace />} />
        <Route path="/about" element={<Navigate to="/ravan-mammadov" replace />} />

        <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </>
  );
}