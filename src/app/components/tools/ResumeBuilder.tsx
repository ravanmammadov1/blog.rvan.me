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
import {
  saveUserCv,
  getUserCvs,
  generateCvSlug,
  SavedCvRecord,
} from "../../../lib/cvStorage";

import {
  Printer,
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
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { useAuth } from "../../../hooks/useAuth";
import { Button } from "../ui/Button";

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

  const { language, getLocalizedPath } = useLanguage();
  const isAz = language === "az";
  const { user, signIn } = useAuth();
  const [searchParams] = useSearchParams();

  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
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

    await downloadResumeAsPdf("printable-resume", filename);
    setIsGeneratingPdf(false);
  };

  // Save to Cloud & Generate Public Web Version
  const handleSaveAndPublish = async () => {
    if (!user?.uid) return;
    setIsSavingCloud(true);
    try {
      await saveUserCv(user.uid, data, theme, {
        cvId: searchParams.get("cvId") || undefined,
        title: data.personalInfo.fullName || "My Resume",
        publicSlug,
        isPublic,
        isDiscoverable,
        userDisplayName: user.displayName || undefined,
        userEmail: user.email || undefined,
        userPhoto: user.photoURL || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.warn("Save CV failed:", e);
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
        {/* Left: Document Title & Undo/Redo */}
        <div className="flex items-center gap-3">
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
          {UNIFIED_TEMPLATES.slice(0, 5).map((t) => (
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

          {/* Public Web CV & Cloud Sync Action */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 text-xs font-mono font-bold text-foreground hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer"
            title="Create or manage public web link"
          >
            <Share2 size={13} className="text-primary" />
            <span className="hidden sm:inline">
              {user ? (isAz ? "BULUD & LİNK" : "SHARE / CLOUD") : (isAz ? "LİNK YARAT" : "PUBLIC LINK")}
            </span>
          </button>

          {/* Direct PDF Download (The ONLY export action) */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary text-black text-xs font-mono font-extrabold hover:bg-primary/90 shadow-md shadow-primary/20 transition-all cursor-pointer shrink-0 disabled:opacity-70"
            title={isAz ? "A4 PDF Kimi Endir (< 300KB)" : "Download A4 PDF (< 300KB)"}
          >
            {isGeneratingPdf ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Printer size={13} />
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

      {/* Share Public Web CV & Cloud Sync Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/15 bg-neutral-900 p-6 sm:p-8 shadow-2xl text-foreground space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-primary font-mono text-sm font-bold">
                  <Globe size={18} />
                  <span>{isAz ? "İctimai Web CV və Bulud Yaddaşı" : "Public Web CV & Cloud Sync"}</span>
                </div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 rounded-full text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {!user ? (
                // Guest Prompt
                <div className="space-y-4 text-center py-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {isAz ? "Öz Şəxsi /cv/ Linkini Əldə Et" : "Get Your Personalized /cv/ Link"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {isAz
                      ? "Google hesabınızla daxil olaraq CV-nizi buludda saxlayın, ictimai /cv/ linki yaradın və real vaxt baxış analitikasını izləyin."
                      : "Sign in with Google to save your CV to the cloud, generate a permanent shareable /cv/ link, and track audience analytics."}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={signIn}
                      className="px-6 py-3 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 mx-auto hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{isAz ? "Google ilə Daxil Ol" : "Sign in with Google"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-2">
                    {isAz
                      ? "Qeyd: PDF yükləmək üçün daxil olmaq məcburi deyil."
                      : "Note: PDF download is 100% free and requires no login."}
                  </p>
                </div>
              ) : (
                // Authenticated User Controls
                <div className="space-y-5">
                  {/* Public Slug Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground block">
                      {isAz ? "Şəxsi URL Ünvanı:" : "Custom Public Slug:"}
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
                            ? "BULUDDA YADDA SAXLA"
                            : "SAVE TO CLOUD"}
                        </span>
                      </button>
                    </div>
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
