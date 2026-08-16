import React, { useState, useMemo } from "react";
import {
  ResumeEditorProvider,
  useResumeEditor,
} from "./resumebuilder/context/ResumeEditorContext";
import {
  TECH_CV_PRESET,
  UNIFIED_TEMPLATES,
  TemplateId,
} from "./resumebuilder/resumeTypes";
import { calculateAtsScore } from "./resumebuilder/atsEngine";
import { downloadResumeAsPdf } from "./resumebuilder/converters/pdfExporter";
import {
  exportToRenderCvYaml,
  exportToReactiveResumeJson,
  importUniversalResume,
} from "./resumebuilder/converters/schemaConverters";
import { CanvaLeftToolbar } from "./resumebuilder/editor/CanvaLeftToolbar";
import { FloatingFormatToolbar } from "./resumebuilder/editor/FloatingFormatToolbar";
import { ResumePreview } from "./resumebuilder/templates/ResumePreview";
import { AtsScoreModal } from "./resumebuilder/editor/AtsScoreModal";

import {
  Printer,
  Download,
  Upload,
  Copy,
  Check,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  ChevronDown,
  MousePointerClick,
  FileCheck,
  Loader2,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

/**
 * Inner Canvas Editor Component
 */
const ResumeEditorCanvasInner: React.FC = () => {
  const {
    data,
    theme,
    undo,
    redo,
    canUndo,
    canRedo,
    zoom,
    setZoom,
    setData,
    setTheme,
  } = useResumeEditor();

  const { language } = useLanguage();
  const isAz = language === "az";

  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // ATS Score Calculation
  const atsResult = useMemo(() => calculateAtsScore(data), [data]);

  // Direct PDF Download (< 300KB, visually 1:1)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const cleanName = data.personalInfo.fullName
      ? data.personalInfo.fullName.replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Resume";
    const filename = `${cleanName}_CV.pdf`;

    await downloadResumeAsPdf("printable-resume", filename);
    setIsGeneratingPdf(false);
  };

  // Helper download
  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // Native JSON Backup
  const handleExportJson = () => {
    const jsonStr = JSON.stringify({ resumeData: data, theme }, null, 2);
    downloadFile(
      jsonStr,
      `${data.personalInfo.fullName ? data.personalInfo.fullName.toLowerCase().replace(/\s+/g, "_") : "resume"}_backup.json`,
      "application/json"
    );
  };

  // RenderCV YAML Export
  const handleExportRenderCvYaml = () => {
    const yaml = exportToRenderCvYaml(data);
    downloadFile(
      yaml,
      `${data.personalInfo.fullName ? data.personalInfo.fullName.toLowerCase().replace(/\s+/g, "_") : "resume"}_rendercv.yaml`,
      "text/yaml"
    );
  };

  // Reactive Resume JSON Export
  const handleExportReactiveResumeJson = () => {
    const jsonStr = exportToReactiveResumeJson(data);
    downloadFile(
      jsonStr,
      `${data.personalInfo.fullName ? data.personalInfo.fullName.toLowerCase().replace(/\s+/g, "_") : "resume"}_reactive_resume.json`,
      "application/json"
    );
  };

  // Universal Import
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = importUniversalResume(content);
        if (parsed) {
          setData((prev) => ({ ...prev, ...parsed }));
          alert(isAz ? "CV uğurla yükləndi! Bütün məlumatlar bərpa olundu." : "Resume imported successfully!");
        } else {
          alert(isAz ? "Fayl formatı tanınmadı. Zəhmət olmasa JSON və ya YAML seçin." : "Invalid file format.");
        }
      } catch (err) {
        alert(isAz ? "Xətalı fayl." : "Invalid file.");
      }
    };
    reader.readAsText(file);
  };

  // Copy Plain Text
  const handleCopyPlainText = () => {
    const lines: string[] = [];
    const info = data.personalInfo;
    lines.push(`${info.fullName.toUpperCase()}`);
    lines.push(`${info.title}`);
    lines.push(`Email: ${info.email} | Phone: ${info.phone} | Location: ${info.location}`);
    if (info.linkedin) lines.push(`LinkedIn: ${info.linkedin}`);
    if (info.github) lines.push(`GitHub: ${info.github}`);
    if (info.website) lines.push(`Portfolio: ${info.website}`);
    lines.push("\n----------------------------------------\nSUMMARY");
    lines.push(data.summary);

    lines.push("\n----------------------------------------\nEXPERIENCE");
    for (const exp of data.experiences) {
      lines.push(`\n${exp.title} - ${exp.company} (${exp.location})`);
      lines.push(`${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`);
      for (const b of exp.bullets) {
        if (b.trim()) lines.push(`• ${b}`);
      }
    }

    lines.push("\n----------------------------------------\nEDUCATION");
    for (const edu of data.education) {
      lines.push(`${edu.degree} in ${edu.field} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
    }

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="w-full flex flex-col min-h-[90vh] bg-neutral-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* ── TOP APP HEADER BAR ── */}
      <header className="h-14 bg-neutral-900 border-b border-white/10 px-4 md:px-6 flex items-center justify-between gap-3 text-white shrink-0 z-40">
        {/* Left: Document Title & Undo/Redo */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={data.personalInfo.fullName ? `${data.personalInfo.fullName} - CV` : (isAz ? "Mənim CV-m" : "My Resume")}
            onChange={() => {}}
            className="bg-transparent border border-transparent hover:border-white/20 focus:border-primary px-2 py-1 rounded-lg text-xs font-mono font-bold text-foreground focus:outline-none max-w-[150px] sm:max-w-xs truncate"
            title="Resume Title"
          />

          <div className="h-4 w-px bg-white/15" />

          {/* Undo / Redo */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                canUndo ? "hover:bg-white/10 text-white" : "opacity-30 text-neutral-500 cursor-not-allowed"
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                canRedo ? "hover:bg-white/10 text-white" : "opacity-30 text-neutral-500 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        </div>

        {/* Center: Template Quick Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-2xl text-xs font-mono">
          {UNIFIED_TEMPLATES.slice(0, 5).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme((prev) => ({ ...prev, template: t.id, accentColor: t.defaultColor }))}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                theme.template === t.id
                  ? "bg-primary text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              }`}
            >
              {isAz ? t.name_az : t.name}
            </button>
          ))}
        </div>

        {/* Right: ATS Score, Export & Direct PDF Download */}
        <div className="flex items-center gap-2">
          {/* ATS Score Indicator */}
          <button
            onClick={() => setShowAtsModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-black/40 hover:border-primary/50 transition-all cursor-pointer group"
            title={isAz ? "ATS Analizini Göstər" : "View ATS Compliance Audit"}
          >
            <ShieldCheck size={13} className="text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs font-mono font-bold">
              ATS: <strong className={atsResult.score >= 80 ? "text-emerald-400" : "text-amber-400"}>{atsResult.score}%</strong>
            </span>
          </button>

          {/* Copy Plain Text */}
          <button
            onClick={handleCopyPlainText}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer"
            title={isAz ? "Mətni kopyala" : "Copy plain text"}
          >
            {copiedText ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{copiedText ? (isAz ? "KOPYALANDI" : "COPIED") : (isAz ? "MƏTN" : "TEXT")}</span>
          </button>

          {/* Export Code Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer"
            >
              <Download size={12} />
              <span className="hidden sm:inline">{isAz ? "KOD" : "EXPORT"}</span>
              <ChevronDown size={10} />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-neutral-900 border border-white/15 p-2 shadow-2xl z-50 space-y-1 font-mono text-xs text-foreground">
                <button
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between cursor-pointer"
                >
                  <span>JSON Backup</span>
                  <span className="text-[10px] text-muted-foreground">.json</span>
                </button>
                <button
                  onClick={handleExportRenderCvYaml}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between cursor-pointer text-emerald-400"
                >
                  <span>RenderCV YAML</span>
                  <span className="text-[10px] text-emerald-400">.yaml</span>
                </button>
                <button
                  onClick={handleExportReactiveResumeJson}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 flex items-center justify-between cursor-pointer text-sky-400"
                >
                  <span>Reactive Resume v4</span>
                  <span className="text-[10px] text-sky-400">.json</span>
                </button>
              </div>
            )}
          </div>

          {/* Import Button */}
          <label className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer">
            <Upload size={12} />
            <span className="hidden sm:inline">{isAz ? "İDXAL" : "IMPORT"}</span>
            <input type="file" accept=".json,.yaml,.yml" onChange={handleImportFile} className="hidden" />
          </label>

          {/* Direct PDF Download (< 300KB) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-primary text-black text-xs font-mono font-extrabold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0 disabled:opacity-70"
            title={isAz ? "A4 PDF Kimi Endir (< 300KB)" : "Download A4 PDF (< 300KB)"}
          >
            {isGeneratingPdf ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
            <span>{isGeneratingPdf ? (isAz ? "YÜKLƏNİR..." : "GENERATING...") : (isAz ? "PDF YÜKLƏ" : "DOWNLOAD PDF")}</span>
          </button>
        </div>
      </header>

      {/* ── WORKSPACE BODY (Canva Left Drawer + Center A4 Canvas) ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Canva Tools Strip & Drawer */}
        <CanvaLeftToolbar />

        {/* Center Stage: The Live Editable A4 Canvas */}
        <main
          id="resume-canvas-viewport"
          className="flex-1 bg-neutral-950 overflow-auto p-4 md:p-8 flex flex-col items-center custom-scrollbar relative"
        >
          {/* Floating Text Format Toolbar */}
          <FloatingFormatToolbar />

          {/* Canvas Direct Editing Hint Pill */}
          <div className="mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-mono text-primary flex items-center gap-2 shadow-inner print:hidden">
            <MousePointerClick size={13} className="animate-bounce" />
            <span>
              {isAz
                ? "💡 CV üzərində istənilən mətnə iki dəfə klik edərək birbaşa redaktə edə bilərsiniz!"
                : "💡 Direct Canvas Editor: Double-click any text on the resume to edit in place!"}
            </span>
          </div>

          {/* The A4 Resume Document Sheet Container with Safe Zone Padding */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
              transition: "transform 0.15s ease-out",
            }}
            className="w-full max-w-[850px] shadow-2xl relative print:shadow-none print:transform-none"
          >
            <ResumePreview data={data} theme={theme} onUpdate={setData} />
          </div>

          {/* Floating Zoom & Fit Controls (Bottom-Right) */}
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-neutral-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl text-xs font-mono text-white print:hidden">
            <button
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={13} />
            </button>
            <span className="w-12 text-center font-bold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.1).toFixed(1)))}
              className="p-1 hover:text-primary transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={13} />
            </button>
            <div className="h-3 w-px bg-white/20 mx-0.5" />
            <button
              onClick={() => setZoom(1.0)}
              className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase font-bold cursor-pointer"
            >
              100%
            </button>
          </div>
        </main>
      </div>

      {/* Detailed ATS Score Audit Modal */}
      {showAtsModal && <AtsScoreModal result={atsResult} onClose={() => setShowAtsModal(false)} />}
    </div>
  );
};

/**
 * Flagship Exported ResumeBuilder Component
 */
export default function ResumeBuilder() {
  const [initialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("rvan_ats_resume_data_v4");
      if (saved) return JSON.parse(saved);
    } catch {}
    return TECH_CV_PRESET;
  });

  const [initialTheme] = useState<any>(() => {
    try {
      const savedTheme = localStorage.getItem("rvan_ats_resume_theme_v4");
      if (savedTheme) return JSON.parse(savedTheme);
    } catch {}
    return {
      template: "tech-cv",
      accentColor: "#111827",
      fontFamily: "sans",
      density: "standard",
      paperSize: "a4",
    };
  });

  return (
    <ResumeEditorProvider initialData={initialData} initialTheme={initialTheme}>
      <ResumeEditorCanvasInner />
    </ResumeEditorProvider>
  );
}
