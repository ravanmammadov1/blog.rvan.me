import React, { useState } from "react";
import {
  formatHtmlDocument,
  convertToReactJsx,
  generateTailwindPreview,
  downloadZipBundle,
} from "./exportHelpers";
import {
  FileCode,
  FileText,
  Atom,
  Wind,
  Archive,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  html: string;
  css: string;
  language: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  html,
  css,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<"html" | "css" | "jsx" | "tailwind" | "zip">("html");
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const fullHtml = formatHtmlDocument(html, css, projectName);
  const reactJsx = convertToReactJsx(html, css, projectName.replace(/[^a-zA-Z0-9]/g, "") || "ExportedPage");
  const tailwindPreview = generateTailwindPreview(html);

  const getCurrentCode = () => {
    switch (activeTab) {
      case "html":
        return fullHtml;
      case "css":
        return css || "/* No custom CSS generated */";
      case "jsx":
        return reactJsx;
      case "tailwind":
        return tailwindPreview;
      default:
        return fullHtml;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    let filename = `${projectName.toLowerCase().replace(/[^a-z0-9_-]+/gi, "-")}`;
    let mimeType = "text/plain";
    let content = getCurrentCode();

    if (activeTab === "html") {
      filename += ".html";
      mimeType = "text/html";
    } else if (activeTab === "css") {
      filename += ".css";
      mimeType = "text/css";
    } else if (activeTab === "jsx") {
      filename += ".jsx";
      mimeType = "text/javascript";
    } else if (activeTab === "tailwind") {
      filename += "-tailwind.html";
      mimeType = "text/html";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      await downloadZipBundle(projectName, html, css);
    } catch (err) {
      console.error("Error creating ZIP bundle:", err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#101012] border border-white/15 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <FileCode size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {language === "az" ? "Layihəni İxrac Et" : "Export Project Code"}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                {projectName} • {language === "az" ? "İstədiyiniz formatda ixrac edin" : "Multi-format clean code generation"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Export Tabs Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/20 flex gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab("html")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "html" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <FileText size={13} /> HTML
          </button>
          <button
            onClick={() => setActiveTab("css")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "css" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <FileCode size={13} /> CSS
          </button>
          <button
            onClick={() => setActiveTab("jsx")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "jsx" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Atom size={13} /> React JSX
          </button>
          <button
            onClick={() => setActiveTab("tailwind")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "tailwind" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Wind size={13} /> Tailwind Preview
          </button>
          <button
            onClick={() => setActiveTab("zip")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeTab === "zip" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Archive size={13} /> ZIP Bundle
          </button>
        </div>

        {/* Content Body */}
        {activeTab === "zip" ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-3xl bg-primary/10 border border-primary/30 text-primary mb-4">
              <Archive size={40} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {language === "az" ? "Tam Sayt Arxivi (ZIP)" : "Complete Standalone Web Package"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              {language === "az"
                ? "Bütün index.html, styles.css və README təlimat fayllarını bir paketdə yükləyin və istənilən hostinqdə dərhal işə salın."
                : "Downloads a clean package with index.html, styles.css, and README ready to deploy to Vercel, Netlify, or GitHub Pages."}
            </p>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-6 py-3 rounded-full bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition disabled:opacity-50"
            >
              <Download size={14} />
              <span>{isZipping ? (language === "az" ? "Paketlənir..." : "Creating ZIP...") : (language === "az" ? "ZIP Paketini Yüklə" : "Download ZIP Archive")}</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Action buttons bar */}
            <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between">
              <span className="text-[11px] font-mono text-muted-foreground">
                {activeTab === "tailwind" ? "Generated Tailwind Preview" : `File preview (${activeTab.toUpperCase()})`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-white transition flex items-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? (language === "az" ? "KOPYALANDI" : "COPIED") : (language === "az" ? "KOPYALA" : "COPY CODE")}</span>
                </button>
                <button
                  onClick={handleDownloadFile}
                  className="px-3 py-1.5 rounded-lg bg-primary text-black text-xs font-mono font-bold transition flex items-center gap-1.5 hover:scale-105"
                >
                  <Download size={13} />
                  <span>{language === "az" ? "FAYLI YÜKLƏ" : "DOWNLOAD FILE"}</span>
                </button>
              </div>
            </div>

            {/* Code container */}
            <div className="flex-1 overflow-auto p-4 bg-black/80 font-mono text-xs text-zinc-300 leading-relaxed custom-scrollbar">
              <pre className="whitespace-pre-wrap">{getCurrentCode()}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
