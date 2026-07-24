import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import HomePage from "./HomePage";
import WorkArchive from "./WorkArchive";
import WorkDetail from "./WorkDetail";
import BlogArchive from "./BlogArchive";
import BlogDetail from "./BlogDetail";
import NewsArchive from "./NewsArchive";
import NewsDetail from "./NewsDetail";
import ToolsArchive from "./ToolsArchive";
import RavanMammadovPage from "./RavanMammadovPage";
import NotFound from "./NotFound";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkArchive />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/blog" element={<BlogArchive />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/news" element={<NewsArchive />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
        <Route path="/tools" element={<ToolsArchive />} />
        <Route path="/ravanmammadov" element={<RavanMammadovPage />} />
        <Route path="/about" element={<RavanMammadovPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
      <SpeedInsights />
    </>
  );
}