import React, { useState } from "react";
import {
  UNIFIED_TEMPLATES,
  TemplateId,
  ResumeData,
  ResumeThemeConfig,
} from "../resumeTypes";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";
import { Sparkles, Eye, Check, ShieldCheck, X } from "lucide-react";
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
  const [previewTemplate, setPreviewTemplate] = useState<TemplateId | null>(null);

  // Per-template active accent color selection
  const [templateColors, setTemplateColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    UNIFIED_TEMPLATES.forEach((t) => {
      initial[t.id] = t.defaultAccent;
    });
    return initial;
  });

  const categories = [
    { id: "all", label: isAz ? "Bütün Şablonlar" : "All Templates" },
    { id: "classic", label: isAz ? "Klassik & ATS" : "Classic & ATS" },
    { id: "modern", label: isAz ? "Müasir 2-Sütun" : "Modern 2-Column" },
    { id: "tech", label: isAz ? "Mühəndis & Texniki" : "Tech & Engineering" },
    { id: "creative", label: isAz ? "Kreativ & Liderlik" : "Creative & Executive" },
  ];

  const handleColorChange = (e: React.MouseEvent, templateId: string, color: string) => {
    e.stopPropagation();
    setTemplateColors((prev) => ({ ...prev, [templateId]: color }));
  };

  const filteredTemplates = UNIFIED_TEMPLATES.filter((t) => {
    if (selectedCategory === "all") return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="w-full flex flex-col items-center py-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* ── HERO HEADER ── */}
      <div className="text-center space-y-3 max-w-2xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono">
          <Sparkles size={13} />
          <span>{isAz ? "12 HR TƏSDİQLİ PEŞƏKAR ŞABLON" : "12 HR-APPROVED PRO TEMPLATES"}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          {isAz ? "Peşəkar CV Şablonunuzu Seçin" : "Choose Your Resume Template"}
        </h1>
        <p className="text-sm text-neutral-400">
          {isAz
            ? "Bəyəndiyiniz şablonu və rəngi seçərək birbaşa redaktəyə başlayın. İstənilən vaxt məlumatlarınızı itirmədən şablonu dəyişə bilərsiniz."
            : "Select a design and accent color to start editing directly. You can switch templates anytime without losing your entered data."}
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 w-full">
        {filteredTemplates.map((template) => {
          const activeColor = templateColors[template.id] || template.defaultAccent;

          return (
            <div
              key={template.id}
              className="flex flex-col group cursor-pointer"
              onClick={() => onSelectTemplate(template.id, activeColor)}
            >
              {/* Card Container with A4 Aspect Ratio */}
              <div className="relative w-full aspect-[1/1.38] bg-neutral-900 rounded-2xl border border-white/15 overflow-hidden shadow-xl group-hover:border-primary/60 group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-300 flex flex-col items-center justify-center p-2 bg-white">
                {/* Scaled Live Miniature of the Actual Template */}
                <div className="w-full h-full overflow-hidden select-none pointer-events-none rounded-xl relative transform scale-[0.38] origin-top-left w-[263%] h-[263%] bg-white text-black">
                  <ResumePreview
                    data={template.presetData}
                    theme={{
                      template: template.id,
                      accentColor: activeColor,
                      fontFamily: "sans",
                      density: "standard",
                      paperSize: "a4",
                    }}
                  />
                </div>

                {/* Subtle Hover Overlay with Brand Mint Actions */}
                <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-6 z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template.id);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    <span>{isAz ? "Önizləmə" : "Preview"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectTemplate(template.id, activeColor)}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-black font-mono font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-transform transform active:scale-95 cursor-pointer"
                  >
                    <Check size={14} />
                    <span>{isAz ? "Seç və Redaktə Et" : "Select & Edit"}</span>
                  </button>
                </div>

                {/* Top Badge: ATS Score */}
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-neutral-900/90 border border-white/10 text-[10px] font-mono font-bold text-neutral-300 flex items-center gap-1">
                  <ShieldCheck size={11} className="text-primary" />
                  <span>ATS {template.atsScore}%</span>
                </div>
              </div>

              {/* Supported Colors Dots Row (Only Actual Supported Colors for this template!) */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {template.supportedAccents.map((colHex) => (
                    <button
                      key={colHex}
                      type="button"
                      onClick={(e) => handleColorChange(e, template.id, colHex)}
                      className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all cursor-pointer ${
                        activeColor === colHex
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-neutral-950 scale-125"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: colHex }}
                      title={colHex}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  {template.category}
                </span>
              </div>

              {/* Template Title & Summary */}
              <div className="mt-1.5 px-1">
                <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                  {isAz ? template.name_az : template.name}
                </h3>
                <p className="text-[11px] text-neutral-400 line-clamp-1">
                  {isAz ? template.description_az : template.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── FULL SCREEN PREVIEW MODAL ── */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-950">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white uppercase">
                  {UNIFIED_TEMPLATES.find((t) => t.id === previewTemplate)?.name || previewTemplate}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const col = templateColors[previewTemplate] || "#111827";
                    onSelectTemplate(previewTemplate, col);
                    setPreviewTemplate(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase hover:bg-primary/90 transition-all cursor-pointer shadow-md"
                >
                  {isAz ? "BU ŞABLONU SEÇ" : "USE THIS TEMPLATE"}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body Preview */}
            <div className="flex-1 overflow-auto p-6 md:p-10 flex items-center justify-center bg-neutral-950/80 custom-scrollbar">
              <div className="w-full max-w-[800px] shadow-2xl rounded-xl overflow-hidden">
                <ResumePreview
                  data={
                    UNIFIED_TEMPLATES.find((t) => t.id === previewTemplate)?.presetData ||
                    UNIFIED_TEMPLATES[0].presetData
                  }
                  theme={{
                    template: previewTemplate,
                    accentColor: templateColors[previewTemplate] || "#111827",
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
