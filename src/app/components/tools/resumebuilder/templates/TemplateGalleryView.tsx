import React, { useState } from "react";
import {
  UNIFIED_TEMPLATES,
  TemplateId,
  ResumeThemeConfig,
} from "../resumeTypes";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";
import { Eye, Check, X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ResumePreview } from "./ResumePreview";

interface TemplateGalleryViewProps {
  onSelectTemplate: (templateId: TemplateId, accentColor?: string) => void;
  activeTemplateId?: TemplateId;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({
  onSelectTemplate,
  activeTemplateId = "tech-cv",
}) => {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);

  // Per-template active accent color selection
  const [templateColors, setTemplateColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    UNIFIED_TEMPLATES.forEach((t) => {
      initial[t.id] = t.defaultAccent;
    });
    return initial;
  });

  const handleColorChange = (e: React.MouseEvent, templateId: string, color: string) => {
    e.stopPropagation();
    setTemplateColors((prev) => ({ ...prev, [templateId]: color }));
  };

  // Modal navigation
  const currentPreviewIdx = UNIFIED_TEMPLATES.findIndex((t) => t.id === previewTemplateId);
  const currentPreviewTemplate = currentPreviewIdx !== -1 ? UNIFIED_TEMPLATES[currentPreviewIdx] : null;

  const handlePrevTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPreviewIdx > 0) {
      setPreviewTemplateId(UNIFIED_TEMPLATES[currentPreviewIdx - 1].id);
    } else {
      setPreviewTemplateId(UNIFIED_TEMPLATES[UNIFIED_TEMPLATES.length - 1].id);
    }
  };

  const handleNextTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentPreviewIdx < UNIFIED_TEMPLATES.length - 1) {
      setPreviewTemplateId(UNIFIED_TEMPLATES[currentPreviewIdx + 1].id);
    } else {
      setPreviewTemplateId(UNIFIED_TEMPLATES[0].id);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-4 md:px-8 max-w-7xl mx-auto selection:bg-primary selection:text-black">
      {/* ── QUIET EDITORIAL HERO ── */}
      <div className="text-center space-y-2.5 max-w-xl mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
          {isAz ? "CV şablonu seçin." : "Select a resume template."}
        </h1>
        <p className="text-sm md:text-base text-neutral-400 font-medium">
          {isAz
            ? "İşinizə uyğun şablon seçin. İstənilən vaxt dəyişə bilərsiniz."
            : "Choose a layout that fits your work. You can change it anytime."}
        </p>
      </div>

      {/* ── TEMPLATES GALLERY GRID (3-Column Desktop / 2-Column Tablet / 1-Column Mobile) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 w-full">
        {UNIFIED_TEMPLATES.map((template) => {
          const activeColor = templateColors[template.id] || template.defaultAccent;
          const isSelected = activeTemplateId === template.id;

          const previewTheme: ResumeThemeConfig = {
            template: template.id,
            accentColor: activeColor,
            fontFamily: "sans",
            density: "standard",
            paperSize: "a4",
          };

          return (
            <div
              key={template.id}
              data-template-id={template.id}
              onClick={() => onSelectTemplate(template.id, activeColor)}
              className={`group relative flex flex-col rounded-2xl bg-neutral-900/90 border transition-all duration-200 cursor-pointer overflow-hidden ${
                isSelected
                  ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary"
                  : "border-white/10 hover:border-white/25 hover:shadow-2xl hover:-translate-y-1"
              }`}
            >
              {/* ── A4 LIVE MINIATURE PREVIEW (Full Realistic Data Fill) ── */}
              <div className="relative w-full aspect-[210/297] bg-white overflow-hidden select-none">
                <div
                  className="absolute inset-0 origin-top-left pointer-events-none"
                  style={{
                    width: "210mm",
                    height: "297mm",
                    transform: "scale(0.48)", // Clean sharp scale to fill container
                  }}
                >
                  <ResumePreview
                    data={template.presetData}
                    theme={previewTheme}
                  />
                </div>

                {/* Subtle Hover Action Overlay */}
                <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-3 p-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplateId(template.id);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 text-white border border-white/15 text-xs font-mono font-bold transition-all shadow-lg cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{isAz ? "Bax" : "Preview"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template.id, activeColor);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-xs font-mono transition-all shadow-lg cursor-pointer"
                  >
                    <span>{isAz ? "Bu Şablonu Seç" : "Use Template"}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* ── CARD FOOTER: NAME & ACCENT SWATCHES ── */}
              <div className="p-4 bg-neutral-900 border-t border-white/10 flex items-center justify-between gap-3">
                <span className="font-bold text-sm text-neutral-200 tracking-tight font-sans">
                  {isAz ? template.name_az || template.name : template.name}
                </span>

                {/* Exact Supported Accent Dots */}
                <div className="flex items-center gap-1.5">
                  {template.supportedAccents.map((hex) => {
                    const isColorActive = activeColor === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={(e) => handleColorChange(e, template.id, hex)}
                        title={hex}
                        className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                          isColorActive ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110" : "hover:scale-125 opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FULLSCREEN PREVIEW MODAL ── */}
      {previewTemplateId && currentPreviewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setPreviewTemplateId(null)}
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-4xl max-h-[95vh] bg-neutral-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="h-14 bg-neutral-950 border-b border-white/10 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-bold text-white text-base font-sans">
                  {isAz ? currentPreviewTemplate.name_az || currentPreviewTemplate.name : currentPreviewTemplate.name}
                </span>

                {/* Accent Color Selector inside Modal */}
                <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-white/15">
                  {currentPreviewTemplate.supportedAccents.map((hex) => {
                    const activeColor = templateColors[currentPreviewTemplate.id] || currentPreviewTemplate.defaultAccent;
                    const isColorActive = activeColor === hex;
                    return (
                      <button
                        key={hex}
                        type="button"
                        onClick={(e) => handleColorChange(e, currentPreviewTemplate.id, hex)}
                        className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                          isColorActive ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-110" : "hover:scale-125 opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons & Close */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const activeColor = templateColors[currentPreviewTemplate.id] || currentPreviewTemplate.defaultAccent;
                    onSelectTemplate(currentPreviewTemplate.id, activeColor);
                    setPreviewTemplateId(null);
                  }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-black font-bold text-xs font-mono transition-all cursor-pointer"
                >
                  <Check size={14} />
                  <span>{isAz ? "Bu Şablonu Seç" : "Use This Template"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewTemplateId(null)}
                  className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Scrollable Viewport */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex justify-center bg-neutral-950/60">
              <div className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 shadow-2xl rounded-sm overflow-hidden">
                <ResumePreview
                  data={currentPreviewTemplate.presetData}
                  theme={{
                    template: currentPreviewTemplate.id,
                    accentColor: templateColors[currentPreviewTemplate.id] || currentPreviewTemplate.defaultAccent,
                    fontFamily: "sans",
                    density: "standard",
                    paperSize: "a4",
                  }}
                />
              </div>
            </div>

            {/* Modal Footer Navigation */}
            <div className="h-12 bg-neutral-950 border-t border-white/10 px-6 flex items-center justify-between text-neutral-400 text-xs font-mono shrink-0">
              <button
                type="button"
                onClick={handlePrevTemplate}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>{isAz ? "Əvvəlki" : "Previous"}</span>
              </button>

              <span>
                {currentPreviewIdx + 1} / {UNIFIED_TEMPLATES.length}
              </span>

              <button
                type="button"
                onClick={handleNextTemplate}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <span>{isAz ? "Növbəti" : "Next"}</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default TemplateGalleryView;
