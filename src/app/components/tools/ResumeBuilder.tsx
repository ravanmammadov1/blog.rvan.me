import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  saveUserCv,
  getUserCvs,
  generateCvSlug,
} from "../../../lib/cvStorage";

import {
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  MousePointerClick,
  Loader2,
  Share2,
  Cloud,
  Check,
  ExternalLink,
  Sparkles,
  LayoutGrid,
  BarChart3,
  Eye,
  Clock,
  MousePointer,
  X,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";

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
  } = useResumeEditor();

  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";
  const { user, signIn } = useAuth();
  const [searchParams] = useSearchParams();

  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeShareTab, setActiveShareTab] = useState<"link" | "analytics">("link");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Cloud & Public Link State
  const [publicSlug, setPublicSlug] = useState(() =>
    generateCvSlug(data.personalInfo.fullName || "resume")
  );
  const [isPublic, setIsPublic] = useState(true);
  const [isDiscoverable, setIsDiscoverable] = useState(false);

  // ATS Score Calculation
  const atsResult = useMemo(() => calculateAtsScore(data), [data]);

  // Load existing CV if query param cvId exists
  useEffect(() => {
    const cvId = searchParams.get("cvId");
    if (cvId && user?.uid) {
      getUserCvs(user.uid).then((records) => {
        const found = records.find((r) => r.id === cvId);
        if (found) {
          setData(found.resumeData);
          setTheme(found.theme);
          if (found.publicSlug) setPublicSlug(found.publicSlug);
          setIsPublic(Boolean(found.isPublic));
          setIsDiscoverable(Boolean(found.isDiscoverable));
        }
      });
    }
  }, [searchParams, user?.uid, setData, setTheme]);

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

  // Save to Cloud & Generate Public Web Version
  const handleSaveAndPublish = async () => {
    setIsSavingCloud(true);
    try {
      const uid = user?.uid || "guest_user";
      await saveUserCv(uid, data, theme, {
        cvId: searchParams.get("cvId") || undefined,
        title: data.personalInfo.fullName || "My Resume",
        publicSlug,
        isPublic,
        isDiscoverable,
        userDisplayName: user?.displayName || undefined,
        userEmail: user?.email || undefined,
        userPhoto: user?.photoURL || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn("Save CV:", e);
      // Fallback local save
      try {
        localStorage.setItem(`rvan_cv_${publicSlug}`, JSON.stringify({ data, theme }));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } catch (err) {}
    } finally {
      setIsSavingCloud(false);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.rvan.me";
    const url = `${origin}${isAz ? "/az" : ""}/cv/${publicSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full flex flex-col min-h-[90vh] bg-neutral-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative">
      {/* ── TOP APP HEADER BAR ── */}
      <header className="h-14 bg-neutral-900 border-b border-white/10 px-4 md:px-6 flex items-center justify-between gap-3 text-white shrink-0 z-40">
        {/* Left: Document Title, Switch Template & Undo/Redo */}
        <div className="flex items-center gap-3">
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
                  accentColor: t.defaultColor,
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

        {/* Right: ATS Score, Public Web Link & Primary PDF Download */}
        <div className="flex items-center gap-2.5">
          {/* ATS Score Indicator */}
          <button
            onClick={() => setShowAtsModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-black/40 hover:border-primary/50 transition-all cursor-pointer group"
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

          {/* Public Trackable Web CV & Analytics */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer"
            title="Create trackable link & view analytics"
          >
            <Share2 size={13} className="text-primary" />
            <span className="hidden sm:inline">
              {isAz ? "İZLƏMƏ & LİNK" : "TRACKABLE LINK"}
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
      {showAtsModal && (
        <AtsScoreModal result={atsResult} onClose={() => setShowAtsModal(false)} />
      )}

      {/* ── PUBLIC TRACKABLE CV & AUDIENCE ANALYTICS MODAL ── */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl border border-white/20 bg-neutral-900 p-6 md:p-8 shadow-2xl space-y-6 text-foreground relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveShareTab("link")}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      activeShareTab === "link"
                        ? "bg-primary text-black"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {isAz ? "Ağıllı İzləmə Linki" : "Trackable Smart Link"}
                  </button>
                  <button
                    onClick={() => setActiveShareTab("analytics")}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeShareTab === "analytics"
                        ? "bg-primary text-black"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    <BarChart3 size={13} />
                    <span>{isAz ? "Canlı Analitika" : "Live Analytics"}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* TAB 1: TRACKABLE SMART LINK */}
              {activeShareTab === "link" && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground block">
                      {isAz ? "CV-niz üçün Unikal İzləmə URL-i:" : "Your Trackable Public URL:"}
                    </label>
                    <div className="flex items-center rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-mono text-foreground">
                      <span className="text-muted-foreground select-none">https://www.rvan.me/cv/</span>
                      <input
                        type="text"
                        value={publicSlug}
                        onChange={(e) => setPublicSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                        className="flex-1 bg-transparent border-none focus:outline-none text-primary font-bold pl-1"
                      />
                    </div>
                  </div>

                  {/* Discoverability Options */}
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-bold text-foreground">
                          {isAz ? "Axtarış Sistemlərində Kəşf Edilmə" : "Search Engine Discoverability"}
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          {isDiscoverable
                            ? (isAz ? "CV Google və axtarış sistemlərində indekslənəcək." : "CV will be indexable by Google.")
                            : (isAz ? "CV noindex qorunmasındadır (yalnız linki olanlar görəcək)." : "Protected with noindex (only people with link can view).")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDiscoverable(!isDiscoverable)}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                          isDiscoverable
                            ? "bg-emerald-500 text-black"
                            : "bg-white/10 text-muted-foreground"
                        }`}
                      >
                        {isDiscoverable ? "INDEXABLE" : "NOINDEX"}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={handleCopyLink}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 transition-all cursor-pointer"
                    >
                      {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
                      <span>{copiedLink ? (isAz ? "KOPYALANDI" : "COPIED") : (isAz ? "LİNKİ KOPYALA" : "COPY LINK")}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        to={getLocalizedPath(`/cv/${publicSlug}`)}
                        target="_blank"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 text-xs font-mono font-bold text-foreground hover:bg-white/20 transition-all cursor-pointer"
                      >
                        <span>{isAz ? "BAX" : "VIEW"}</span>
                        <ExternalLink size={13} />
                      </Link>

                      <button
                        onClick={handleSaveAndPublish}
                        disabled={isSavingCloud}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-black font-mono font-extrabold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-70 shadow-md shadow-primary/20"
                      >
                        {isSavingCloud ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : savedSuccess ? (
                          <Check size={13} className="text-black" />
                        ) : (
                          <Cloud size={13} />
                        )}
                        <span>
                          {isSavingCloud
                            ? isAz
                              ? "YADDA SAXLANILIR..."
                              : "SAVING..."
                            : savedSuccess
                            ? isAz
                              ? "YADDA SAXLANILDI!"
                              : "SAVED!"
                            : isAz
                            ? "CANLI YAYIMLA"
                            : "PUBLISH LINK"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: LIVE AUDIENCE ANALYTICS */}
              {activeShareTab === "analytics" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-neutral-400 uppercase">
                        {isAz ? "CV Statusu:" : "Resume Status:"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {isAz ? "İzləmə Aktivdir" : "Tracking Active"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <Eye size={16} className="text-primary mx-auto mb-1" />
                        <span className="text-[10px] text-neutral-400 block font-mono uppercase">{isAz ? "Baxış" : "Views"}</span>
                        <span className="text-lg font-bold text-white font-mono">0</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <Clock size={16} className="text-primary mx-auto mb-1" />
                        <span className="text-[10px] text-neutral-400 block font-mono uppercase">{isAz ? "Orta Vaxt" : "Dwell"}</span>
                        <span className="text-lg font-bold text-white font-mono">0s</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                        <MousePointer size={16} className="text-primary mx-auto mb-1" />
                        <span className="text-[10px] text-neutral-400 block font-mono uppercase">{isAz ? "Kliklər" : "Clicks"}</span>
                        <span className="text-lg font-bold text-white font-mono">0</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-neutral-300 space-y-1">
                    <p className="font-bold text-white">
                      {isAz ? "🎯 Bu necə işləyir?" : "🎯 How Tracking Works:"}
                    </p>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {isAz
                        ? "CV linkinizi şirkətlərə və ya HR-a göndərdiyiniz zaman səhifə açıldıqda, oxunma müddəti və kliklənən layihə linkləri real vaxt rejimində burada qeyd olunacaq."
                        : "When recruiters open your trackable web CV link or scan your PDF QR code, reading dwell time and portfolio clicks will be logged in real time."}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
