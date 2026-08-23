import React, { useState } from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { useAuth } from "../../../../../hooks/useAuth";
import {
  FONT_OPTIONS,
  TemplateId,
  ResumeDensity,
} from "../resumeTypes";
import {
  TEMPLATE_LIST,
  TEMPLATE_REGISTRY,
} from "../resumeTemplates";
import {
  LayoutTemplate,
  FileText,
  Palette,
  Camera,
  X,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Users,
  Plus,
  Check,
  Sparkles,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Award,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";
import { TemplateGalleryView } from "../templates/TemplateGalleryView";

export const CanvaLeftToolbar: React.FC = () => {
  const {
    data,
    theme,
    setTheme,
    setData,
    activeDrawer,
    setActiveDrawer,
    addExperience,
    addEducation,
    addSkillCategory,
    addProject,
    addReference,
    updatePhoto,
    removePhoto,
    togglePhoto,
  } = useResumeEditor();

  const { language } = useLanguage();
  const isAz = language === "az";
  const { randomizeAvatar, avatarSvgUri } = useAuth();
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        updatePhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCharacter = () => {
    if (avatarSvgUri) {
      updatePhoto(avatarSvgUri);
    }
  };

  const handleRegenerateCharacter = () => {
    randomizeAvatar();
    if (avatarSvgUri) {
      updatePhoto(avatarSvgUri);
    }
  };

  const handleSelectTemplate = (templateId: TemplateId, defaultColor?: string) => {
    setTheme((prev) => ({
      ...prev,
      template: templateId,
      accentColor: defaultColor || prev.accentColor,
    }));
  };

  // Find currently active template definition from single registry
  const currentTemplateDef = TEMPLATE_REGISTRY[theme.template] || TEMPLATE_REGISTRY["tech-cv"];

  return (
    <div className="flex h-full print:hidden relative">
      {/* ── NARROW ICON STRIP (DESIGN, CONTENT, STYLE) ── */}
      <aside className="w-16 bg-neutral-900 border-r border-white/10 flex flex-col items-center py-4 space-y-4 shrink-0 z-30">
        {/* 1. DESIGN */}
        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "design" ? null : "design")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "design"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Dizayn" : "Design"}
        >
          <LayoutTemplate size={20} />
          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">
            {isAz ? "Dizayn" : "Design"}
          </span>
        </button>

        {/* 2. CONTENT */}
        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "content" ? null : "content")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "content"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Məzmun" : "Content"}
        >
          <FileText size={20} />
          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">
            {isAz ? "Məzmun" : "Content"}
          </span>
        </button>

        {/* 3. STYLE */}
        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "style" ? null : "style")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "style"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Üslub" : "Style"}
        >
          <Palette size={20} />
          <span className="text-[9px] font-mono uppercase tracking-wider font-bold">
            {isAz ? "Üslub" : "Style"}
          </span>
        </button>
      </aside>

      {/* ── EXPANDABLE DRAWER PANEL (Clean Canva-like flyout) ── */}
      {activeDrawer && (
        <div className="w-80 bg-neutral-900/98 border-r border-white/10 flex flex-col h-full z-20 shadow-2xl animate-in slide-in-from-left-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase">
              {activeDrawer === "design"
                ? isAz ? "Dizayn & Şablon" : "Design & Layout"
                : activeDrawer === "content"
                ? isAz ? "Məzmun Bölmələri" : "Resume Content"
                : isAz ? "Üslub & Rənglər" : "Styles & Colors"}
            </h3>
            <button
              onClick={() => setActiveDrawer(null)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar text-xs">
            {/* ────────────── TAB 1: DESIGN ────────────── */}
            {activeDrawer === "design" && (
              <div className="space-y-4">
                {/* Active Template Card */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                      {isAz ? "Aktiv Şablon" : "Active Template"}
                    </span>
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {currentTemplateDef.source}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">
                      {isAz ? currentTemplateDef.name_az : currentTemplateDef.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {currentTemplateDef.supportedAccents.map((hex) => (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setTheme((prev) => ({ ...prev, accentColor: hex }))}
                          className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                            theme.accentColor.toLowerCase() === hex.toLowerCase()
                              ? "ring-2 ring-white scale-110"
                              : "opacity-70 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Button to Open Single Universal Template Gallery */}
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-black font-bold text-xs font-mono transition-all hover:bg-primary/90 shadow-lg cursor-pointer"
                >
                  <LayoutGrid size={15} />
                  <span>{isAz ? "Bütün Şablonlara Bax" : "Browse All Templates"}</span>
                </button>
              </div>
            )}

            {/* ────────────── TAB 2: CONTENT ────────────── */}
            {activeDrawer === "content" && (
              <div className="space-y-6">
                {/* Profile Photo / Avatar System */}
                <div className="space-y-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Camera size={14} className="text-primary" />
                      <span>{isAz ? "Profil Şəkli / Karakter" : "Profile Photo / Character"}</span>
                    </span>
                    <button
                      type="button"
                      onClick={togglePhoto}
                      className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                      title={data.personalInfo.showPhoto ? "Hide Photo" : "Show Photo"}
                    >
                      {data.personalInfo.showPhoto ? <Eye size={14} className="text-primary" /> : <EyeOff size={14} />}
                    </button>
                  </div>

                  {/* Character Avatar Preview & Controls */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="relative w-14 h-14 rounded-xl border border-white/20 bg-black/40 overflow-hidden flex items-center justify-center shrink-0">
                      {data.personalInfo.photoUrl ? (
                        <img
                          src={data.personalInfo.photoUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={20} className="text-neutral-500" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleApplyCharacter}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Sparkles size={11} />
                          <span>{isAz ? "Karakter Seç" : "Use Character"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRegenerateCharacter}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/15 cursor-pointer"
                          title={isAz ? "Yeni Karakter Yarat 🎲" : "Regenerate Character 🎲"}
                        >
                          <RefreshCw size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 text-[10px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer">
                          <Camera size={11} />
                          <span>{isAz ? "Şəkil Yüklə" : "Upload Photo"}</span>
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>

                        {data.personalInfo.photoUrl && (
                          <button
                            type="button"
                            onClick={removePhoto}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add New Sections */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider font-bold">
                    {isAz ? "Yeni Bölmə Əlavə Et" : "Add Content Item"}
                  </span>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={addExperience}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Briefcase size={14} className="text-primary" />
                        <span>{isAz ? "İş Təcrübəsi" : "Work Experience"}</span>
                      </span>
                      <Plus size={14} className="text-neutral-500" />
                    </button>

                    <button
                      type="button"
                      onClick={addEducation}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <GraduationCap size={14} className="text-blue-400" />
                        <span>{isAz ? "Təhsil & Dərəcə" : "Education & Degree"}</span>
                      </span>
                      <Plus size={14} className="text-neutral-500" />
                    </button>

                    <button
                      type="button"
                      onClick={addSkillCategory}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Code size={14} className="text-emerald-400" />
                        <span>{isAz ? "Bacarıqlar Qrupu" : "Skill Category"}</span>
                      </span>
                      <Plus size={14} className="text-neutral-500" />
                    </button>

                    <button
                      type="button"
                      onClick={addProject}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <FolderGit2 size={14} className="text-amber-400" />
                        <span>{isAz ? "Texnoloji Layihə" : "Key Project"}</span>
                      </span>
                      <Plus size={14} className="text-neutral-500" />
                    </button>

                    <button
                      type="button"
                      onClick={addReference}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all text-neutral-300 hover:text-white cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-bold">
                        <Users size={14} className="text-purple-400" />
                        <span>{isAz ? "Tövsiyəçi / Zamin" : "Professional Reference"}</span>
                      </span>
                      <Plus size={14} className="text-neutral-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ────────────── TAB 3: STYLE ────────────── */}
            {activeDrawer === "style" && (
              <div className="space-y-6">
                {/* Accent Colors */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                      {isAz ? "Vurğu Rəngi" : "Accent Color"}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{theme.accentColor}</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {currentTemplateDef.supportedAccents.map((hex) => {
                      const isActive = theme.accentColor.toLowerCase() === hex.toLowerCase();
                      return (
                        <button
                          key={hex}
                          type="button"
                          onClick={() => setTheme((prev) => ({ ...prev, accentColor: hex }))}
                          className={`w-7 h-7 rounded-full transition-transform cursor-pointer border flex items-center justify-center ${
                            isActive ? "ring-2 ring-primary scale-110 border-white" : "border-white/20 hover:scale-105"
                          }`}
                          style={{ backgroundColor: hex }}
                          title={hex}
                        >
                          {isActive && <Check size={12} className="text-white drop-shadow" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Typography Selection */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    {isAz ? "Şrift Ailəsi" : "Typography"}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {FONT_OPTIONS.map((f) => {
                      const isSelected = theme.fontFamily === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setTheme((prev) => ({ ...prev, fontFamily: f.id }))}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-white font-bold"
                              : "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span style={{ fontFamily: f.fontFamily }}>{f.label}</span>
                          {isSelected && <Check size={14} className="text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Density Selection */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">
                    {isAz ? "Səhifə Sıxlığı" : "Information Density"}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["compact", "standard", "relaxed"] as ResumeDensity[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setTheme((prev) => ({ ...prev, density: d }))}
                        className={`py-2 text-center rounded-xl border text-[11px] font-mono capitalize transition-all cursor-pointer ${
                          theme.density === d
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : "border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SINGLE UNIVERSAL TEMPLATE PICKER MODAL (ZERO DUPLICATION) ── */}
      {showGalleryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setShowGalleryModal(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-neutral-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <TemplateGalleryView
              isModal={true}
              onCloseModal={() => setShowGalleryModal(false)}
              onSelectTemplate={(templateId, color) => {
                handleSelectTemplate(templateId, color);
                setShowGalleryModal(false);
              }}
              activeTemplateId={theme.template}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default CanvaLeftToolbar;
