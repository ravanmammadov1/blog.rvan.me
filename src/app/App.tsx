import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import BlogArchive from "./BlogArchive";
import BlogDetail from "./BlogDetail";
import NewsArchive from "./NewsArchive";
import NewsDetail from "./NewsDetail";
import ToolsArchive from "./ToolsArchive";
import WorkDetail from "./WorkDetail";
import NotFound from "./NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogArchive />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/news" element={<NewsArchive />} />
      <Route path="/news/:slug" element={<NewsDetail />} />
      <Route path="/tools" element={<ToolsArchive />} />
      <Route path="/work/:slug" element={<WorkDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}