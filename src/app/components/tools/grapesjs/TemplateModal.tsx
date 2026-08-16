import React, { useState } from "react";
import { TEMPLATE_LIBRARY, WebTemplate } from "./templates";
import { Sparkles, Layout, Megaphone, Share2, Search, X, Check } from "lucide-react";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: WebTemplate) => void;
  language: string;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "landing" | "marketing" | "social">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATE_LIBRARY.filter((tmpl) => {
    const matchesCategory = activeCategory === "all" || tmpl.category === activeCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#101012] border border-white/15 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/40">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase flex items-center gap-1.5 mb-1">
              <Sparkles size={13} /> {language === "az" ? "ŞABLON KİTABXANASI" : "TEMPLATE LIBRARY"}
            </span>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {language === "az" ? "Hazır Dizayn Şablonları" : "Starter Templates"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === "az" ? "Şablon axtar..." : "Search templates..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono"
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition shrink-0"
              title="Close modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/20 flex gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition shrink-0 ${
              activeCategory === "all" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            {language === "az" ? "Hamısı" : "All Templates"} ({TEMPLATE_LIBRARY.length})
          </button>
          <button
            onClick={() => setActiveCategory("landing")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeCategory === "landing" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Layout size={13} /> {language === "az" ? "Açılış Səhifələri" : "Landing Pages"}
          </button>
          <button
            onClick={() => setActiveCategory("marketing")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeCategory === "marketing" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Megaphone size={13} /> {language === "az" ? "Marketinq" : "Marketing"}
          </button>
          <button
            onClick={() => setActiveCategory("social")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-1.5 shrink-0 ${
              activeCategory === "social" ? "bg-primary text-black" : "bg-white/5 text-muted-foreground hover:text-white"
            }`}
          >
            <Share2 size={13} /> {language === "az" ? "Sosial & Kontent" : "Social / Content"}
          </button>
        </div>

        {/* Template Cards Grid */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] hover:border-primary/50 hover:bg-white/[0.06] p-5 flex flex-col justify-between transition-all duration-300 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full">
                      {tmpl.categoryLabel}
                    </span>
                    {tmpl.badge && (
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full">
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-primary transition-colors mb-2">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/90 line-clamp-3 leading-relaxed mb-6 font-medium">
                    {tmpl.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectTemplate(tmpl);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                >
                  <Check size={14} />
                  <span>{language === "az" ? "Şablonu Seç" : "Load Template"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
