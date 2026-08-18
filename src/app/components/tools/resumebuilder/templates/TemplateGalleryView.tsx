import React, { useState } from "react";
import {
  UNIFIED_TEMPLATES,
  TemplateId,
  ResumeData,
  ResumeThemeConfig,
} from "../resumeTypes";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";
import { Sparkles, Eye, Check, ShieldCheck, X, ChevronLeft, ChevronRight } from "lucide-react";
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

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplateId, setPreviewTemplateId] = useState<TemplateId | null>(null);

  // Per-template active accent color selection
  const [templateColors, setTemplateColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    UNIFIED_TEMPLATES.forEach((t) => {
      initial[t.id] = t.defaultAccent;
    });
    return initial;
  });

  const categories = [
    { id: "all", label: isAz ? "Bütün Şablonlar (17)" : "All Templates (17)" },
    { id: "classic", label: isAz ? "ATS & Klassik" : "ATS & Classic" },
    { id: "modern", label: isAz ? "Müasir Dizayn" : "Modern Design" },
    { id: "tech", label: isAz ? "Mühəndis & Texniki" : "Tech & Engineering" },
    { id: "executive", label: isAz ? "Rəhbər & Liderlik" : "Executive & Leadership" },
    { id: "creative", label: isAz ? "Kreativ & Portfel" : "Creative & Portfolio" },
  ];

  const handleColorChange = (e: React.MouseEvent, templateId: string, color: string) => {
    e.stopPropagation();
    setTemplateColors((prev) => ({ ...prev, [templateId]: color }));
  };

  const filteredTemplates = UNIFIED_TEMPLATES.filter((t) => {
    if (selectedCategory === "all") return true;
    return t.category === selectedCategory;
  });

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
    <div className="w-full flex flex-col items-center py-8 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ── HERO HEADER ── */}
      <div className="text-center space-y-3 max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
          <Sparkles size={13} />
          <span>{isAz ? "17 PEŞƏKAR CV ŞABLONU • 100% PULSUZ & A4 PDF" : "17 PRO RESUME TEMPLATES • FREE A4 PDF"}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          {isAz ? "Peşəkar CV Şablonunuzu Seçin" : "Select Your Resume Template"}
        </h1>
        <p className="text-sm text-neutral-400">
          {isAz
            ? "Məlumatlarınızı bir dəfə daxil edin və istənilən vaxt şablonlar arasında keçid edin. Real vaxtda redaktə və təmiz vektor PDF ixracı."
            : "Enter your information once and switch seamlessly between templates anytime. Live inline canvas editing with instant vector PDF export."}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-primary text-black shadow-lg shadow-primary/20 scale-105"
                  : "bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TEMPLATES GALLERY GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {filteredTemplates.map((template) => {
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
              className={`group flex flex-col rounded-2xl bg-neutral-900/90 border transition-all duration-200 overflow-hidden ${
                isSelected
                  ? "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary"
                  : "border-white/10 hover:border-white/30 hover:shadow-2xl"
              }`}
            >
              {/* Card Thumbnail Preview Container */}
              <div
                className="relative w-full aspect-[210/297] bg-white overflow-hidden cursor-pointer"
                onClick={() => onSelectTemplate(template.id, activeColor)}
              >
                {/* Scaled Render of Sample Preset Resume */}
                <div
                  className="w-[800px] origin-top-left pointer-events-none select-none"
                  style={{
                    transform: "scale(0.35)",
                    transformOrigin: "0 0",
                  }}
                >
                  <ResumePreview data={template.presetData} theme={previewTheme} />
                </div>

                {/* Subtle Hover Action Overlay */}
                <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplateId(template.id);
                    }}
                    className="w-full max-w-[140px] py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye size={13} />
                    <span>{isAz ? "BÖYÜK BAXIŞ" : "PREVIEW"}</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTemplate(template.id, activeColor);
                    }}
                    className="w-full max-w-[140px] py-2 rounded-xl bg-primary text-black hover:bg-primary/90 text-xs font-mono font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                  >
                    <Sparkles size={13} />
                    <span>{isAz ? "BU ŞABLONU SEÇ" : "USE TEMPLATE"}</span>
                  </button>
                </div>

                {/* ATS Badge in top-right */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold border border-white/15 text-white">
                  <ShieldCheck size={11} className={template.atsScore >= 95 ? "text-emerald-400" : "text-amber-400"} />
                  <span>ATS {template.atsScore}%</span>
                </div>
              </div>

              {/* Card Footer Details */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3 bg-neutral-900 border-t border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {isAz ? template.name_az : template.name}
                    </h3>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground bg-white/5 px-2 py-0.5 rounded">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {isAz ? template.description_az : template.description}
                  </p>
                </div>

                {/* Real Supported Accent Colors Selector */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono uppercase text-neutral-400">
                    {isAz ? "Rənglər" : "Accents"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {template.supportedAccents.map((hex) => {
                      const isHexActive = activeColor.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          onClick={(e) => handleColorChange(e, template.id, hex)}
                          className={`w-4 h-4 rounded-full transition-transform cursor-pointer border ${
                            isHexActive
                              ? "ring-2 ring-primary scale-125 border-white"
                              : "border-black/40 hover:scale-110 opacity-70 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FULL SCREEN PREVIEW MODAL ── */}
      {currentPreviewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevTemplate}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer"
                    title="Previous"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextTemplate}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-all cursor-pointer"
                    title="Next"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>{isAz ? currentPreviewTemplate.name_az : currentPreviewTemplate.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                      ATS {currentPreviewTemplate.atsScore}%
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    {isAz ? currentPreviewTemplate.description_az : currentPreviewTemplate.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const color = templateColors[currentPreviewTemplate.id] || currentPreviewTemplate.defaultAccent;
                    onSelectTemplate(currentPreviewTemplate.id, color);
                    setPreviewTemplateId(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-black font-extrabold text-xs font-mono hover:bg-primary/90 transition-all cursor-pointer shadow-lg shadow-primary/20 flex items-center gap-1.5"
                >
                  <Sparkles size={13} />
                  <span>{isAz ? "BU ŞABLONU İSTİFADƏ ET" : "USE THIS TEMPLATE"}</span>
                </button>

                <button
                  onClick={() => setPreviewTemplateId(null)}
                  className="p-2 rounded-xl bg-white/5 text-neutral-400 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Crisp A4 Preview */}
            <div className="flex-1 overflow-auto py-6 flex justify-center custom-scrollbar">
              <div className="w-full max-w-[800px] shadow-2xl bg-white text-black rounded-lg overflow-hidden">
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
          </div>
        </div>
      )}
    </div>
  );
};
