import React, { useState, useMemo, useEffect } from "react";
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
import { CanvaLeftToolbar } from "./resumebuilder/editor/CanvaLeftToolbar";
import { FloatingFormatToolbar } from "./resumebuilder/editor/FloatingFormatToolbar";
import { ResumePreview } from "./resumebuilder/templates/ResumePreview";
import { AtsScoreModal } from "./resumebuilder/editor/AtsScoreModal";
import { TemplateGalleryView } from "./resumebuilder/templates/TemplateGalleryView";
import { useAuth } from "../../../hooks/useAuth";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

import {
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  MousePointerClick,
  Loader2,
  LayoutGrid,
} from "lucide-react";

/**
 * Inner Canvas Editor Component
 */
const ResumeEditorCanvasInner: React.FC<{
  onOpenGallery: () => void;
}> = ({ onOpenGallery }) => {
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
    updatePhoto,
  } = useResumeEditor();

  const { language } = useLanguage();
  const isAz = language === "az";
  const { avatarSvgUri } = useAuth();

  const [showAtsModal, setShowAtsModal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Automatically assign character avatar if photo is missing and template supports it
  useEffect(() => {
    if (!data.personalInfo.photoUrl && avatarSvgUri) {
      updatePhoto(avatarSvgUri);
    }
  }, [avatarSvgUri]);

  // ATS Score Calculation
  const atsResult = useMemo(() => calculateAtsScore(data), [data]);

  // Direct PDF Download (< 300KB, visually 1:1, selectable text)
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    const cleanName = data.personalInfo.fullName
      ? data.personalInfo.fullName.replace(/[^a-zA-Z0-9_-]/g, "_")
      : "Resume";
    const filename = `${cleanName}_CV.pdf`;

    try {
      await downloadResumeAsPdf("printable-resume", filename);
    } catch (e) {
      console.error("PDF export error:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[90vh] bg-neutral-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* ── TOP APP HEADER BAR ── */}
      <header className="h-14 bg-neutral-900 border-b border-white/10 px-4 md:px-6 flex items-center justify-between gap-3 text-white shrink-0 z-40">
        {/* Left: Document Title, Switch Template & Undo/Redo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-primary hover:text-black transition-all text-xs font-mono font-bold cursor-pointer"
            title={isAz ? "Şablonlar Qalereyasına Qayıt" : "Switch Template"}
          >
            <LayoutGrid size={13} />
            <span className="hidden sm:inline">{isAz ? "ŞABLONLAR" : "TEMPLATES"}</span>
          </button>

          <div className="h-4 w-px bg-white/15 hidden sm:block" />

          <input
            id="resume-header-title"
            name="resumeTitle"
            type="text"
            value={
              data.personalInfo.fullName
                ? `${data.personalInfo.fullName} - CV`
                : isAz
                ? "Mənim CV-m"
                : "My Resume"
            }
            onChange={() => {}}
            className="bg-transparent border border-transparent hover:border-white/20 focus:border-primary px-2 py-1 rounded-lg text-xs font-mono font-bold text-foreground focus:outline-none max-w-[130px] sm:max-w-xs truncate"
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
                canUndo
                  ? "hover:bg-white/10 text-white"
                  : "opacity-30 text-neutral-500 cursor-not-allowed"
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
                canRedo
                  ? "hover:bg-white/10 text-white"
                  : "opacity-30 text-neutral-500 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={14} />
            </button>
          </div>
        </div>

        {/* Center: Template Quick Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-2xl text-xs font-mono">
          {UNIFIED_TEMPLATES.slice(0, 6).map((t) => (
            <button
              key={t.id}
              onClick={() =>
                setTheme((prev) => ({
                  ...prev,
                  template: t.id,
                  accentColor: t.defaultAccent,
                }))
              }
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

        {/* Right: ATS Score & Primary PDF Download */}
        <div className="flex items-center gap-2.5">
          {/* ATS Score Indicator */}
          <button
            onClick={() => setShowAtsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-black/40 hover:border-primary/50 transition-all cursor-pointer group"
            title={isAz ? "ATS Analizini Göstər" : "View ATS Compliance Audit"}
          >
            <ShieldCheck
              size={13}
              className="text-primary group-hover:scale-110 transition-transform"
            />
            <span className="text-xs font-mono font-bold">
              ATS:{" "}
              <strong
                className={
                  atsResult.score >= 80 ? "text-emerald-400" : "text-amber-400"
                }
              >
                {atsResult.score}%
              </strong>
            </span>
          </button>

          {/* Direct PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-black text-xs font-mono font-extrabold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0 disabled:opacity-70"
            title={isAz ? "A4 PDF Kimi Endir (< 300KB)" : "Download A4 PDF (< 300KB)"}
          >
            {isGeneratingPdf ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            <span>
              {isGeneratingPdf
                ? isAz
                  ? "YÜKLƏNİR..."
                  : "GENERATING..."
                : isAz
                ? "PDF YÜKLƏ"
                : "DOWNLOAD PDF"}
            </span>
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
          <div className="mb-3 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-mono text-primary flex items-center gap-2 shadow-inner print:hidden">
            <MousePointerClick size={13} className="animate-bounce" />
            <span>
              {isAz
                ? "💡 CV üzərində istənilən mətnə iki dəfə klik edərək birbaşa redaktə edə bilərsiniz!"
                : "💡 Direct Canvas Editor: Double-click any text on the resume to edit in place!"}
            </span>
          </div>

          {/* ATS-First Template Image Recommendation */}
          {(theme.template === "tech-cv" ||
            theme.template === "minimal-cv" ||
            theme.template === "compact-ats-cv" ||
            theme.template === "corporate-cv") &&
            data.personalInfo.showPhoto && (
              <div className="mb-3 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300 flex items-center gap-1.5 print:hidden">
                <span>
                  {isAz
                    ? "💡 Profil şəkli seçimə bağlıdır. ATS sistemləri üçün təmiz mətn formatı tövsiyə olunur."
                    : "💡 Profile images are optional. For ATS-focused applications, a text-first layout is recommended."}
                </span>
              </div>
            )}

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
      {showAtsModal && (
        <AtsScoreModal result={atsResult} onClose={() => setShowAtsModal(false)} />
      )}
    </div>
  );
};

/**
 * Flagship Exported ResumeBuilder Component
 */
export default function ResumeBuilder() {
  const [viewMode, setViewMode] = useState<"gallery" | "editor">("gallery");

  const [initialData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("rvan_ats_resume_data_v4");
      if (saved) return JSON.parse(saved);
    } catch {}
    return TECH_CV_PRESET;
  });

  const [initialTheme, setInitialTheme] = useState<any>(() => {
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

  const handleSelectTemplateFromGallery = (templateId: TemplateId, accentColor?: string) => {
    setInitialTheme((prev: any) => ({
      ...prev,
      template: templateId,
      accentColor: accentColor || prev.accentColor,
    }));
    setViewMode("editor");
  };

  return (
    <ResumeEditorProvider initialData={initialData} initialTheme={initialTheme}>
      {viewMode === "gallery" ? (
        <TemplateGalleryView
          onSelectTemplate={handleSelectTemplateFromGallery}
          activeTemplateId={initialTheme.template}
        />
      ) : (
        <ResumeEditorCanvasInner onOpenGallery={() => setViewMode("gallery")} />
      )}
    </ResumeEditorProvider>
  );
}
