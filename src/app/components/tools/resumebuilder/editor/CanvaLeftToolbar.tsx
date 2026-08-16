import React from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";
import {
  UNIFIED_TEMPLATES,
  COLOR_OPTIONS,
  FONT_OPTIONS,
  TemplateId,
  ResumeFont,
  ResumeDensity,
} from "../resumeTypes";
import {
  LayoutTemplate,
  Layers,
  Camera,
  Sliders,
  X,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Users,
  Plus,
  Check,
  RotateCcw,
} from "lucide-react";
import { useLanguage } from "../../../../../lib/i18n/LanguageContext";

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

  const handleSelectTemplate = (templateId: TemplateId, presetData?: any, defaultColor?: string) => {
    setTheme((prev) => ({
      ...prev,
      template: templateId,
      accentColor: defaultColor || prev.accentColor,
    }));
  };

  return (
    <div className="flex h-full print:hidden">
      {/* ── NARROW ICON STRIP ── */}
      <aside className="w-16 bg-neutral-900 border-r border-white/10 flex flex-col items-center py-4 space-y-4 shrink-0 z-30">
        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "templates" ? null : "templates")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "templates"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Şablonlar" : "Templates"}
        >
          <LayoutTemplate size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            {isAz ? "Şablon" : "Themes"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "elements" ? null : "elements")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "elements"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Bölmələr" : "Sections"}
        >
          <Layers size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            {isAz ? "Bölmə" : "Sections"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "styles" ? null : "styles")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "styles"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title={isAz ? "Dizayn və Şriftlər" : "Styles"}
        >
          <Sliders size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">
            {isAz ? "Dizayn" : "Styles"}
          </span>
        </button>
      </aside>

      {/* ── EXPANDABLE SLIM DRAWER ── */}
      {activeDrawer && (
        <div className="w-80 bg-neutral-900/98 backdrop-blur-2xl border-r border-white/10 p-5 overflow-y-auto z-20 space-y-5 text-foreground shadow-2xl animate-in slide-in-from-left duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              {activeDrawer === "templates" && (isAz ? "CV Şablonları" : "Templates")}
              {activeDrawer === "elements" && (isAz ? "Bölmələr və Şəkillər" : "Sections & Elements")}
              {activeDrawer === "styles" && (isAz ? "Dizayn və Şriftlər" : "Document Styles")}
            </h3>
            <button
              onClick={() => setActiveDrawer(null)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* 1. TEMPLATES (Merged Themes & Presets) */}
          {activeDrawer === "templates" && (
            <div className="space-y-3">
              <p className="text-[11px] text-muted-foreground">
                {isAz
                  ? "İstənilən şablonu seçin. Mətnləriniz və dəyişiklikləriniz saxlanılır."
                  : "Switch template layout anytime. Your content stays 100% intact."}
              </p>
              <div className="space-y-2">
                {UNIFIED_TEMPLATES.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      theme.template === t.id
                        ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                        : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleSelectTemplate(t.id, t.presetData, t.defaultColor)}
                        className="text-xs font-bold text-foreground hover:text-primary transition-colors text-left cursor-pointer flex-1"
                      >
                        {isAz ? t.name_az : t.name}
                      </button>
                      {theme.template === t.id && (
                        <span className="text-primary text-xs font-bold">✓</span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {isAz ? t.description_az : t.description}
                    </p>
                    <div className="flex gap-2 pt-1 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => handleSelectTemplate(t.id, t.presetData, t.defaultColor)}
                        className="flex-1 py-1 rounded-lg bg-white/10 hover:bg-primary hover:text-black text-[10px] font-mono font-bold transition-all cursor-pointer text-center"
                      >
                        {isAz ? "Stili Tətbiq Et" : "Apply Style"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setData(t.presetData);
                          handleSelectTemplate(t.id, t.presetData, t.defaultColor);
                        }}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[10px] font-mono text-muted-foreground hover:text-white transition-all cursor-pointer"
                        title={isAz ? "Nümunə məlumatları yüklə" : "Load sample data"}
                      >
                        {isAz ? "Nümunə" : "Load Sample"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SECTIONS & ELEMENTS */}
          {activeDrawer === "elements" && (
            <div className="space-y-4">
              {/* Photo Management */}
              <div className="p-3 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>{isAz ? "Profil Şəkli" : "Profile Photo"}</span>
                  <button
                    type="button"
                    onClick={togglePhoto}
                    className="text-[10px] font-mono text-primary hover:underline cursor-pointer"
                  >
                    {data.personalInfo.showPhoto ? (isAz ? "Gizlət" : "Hide") : (isAz ? "Göstər" : "Show")}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 rounded-xl bg-primary text-black font-mono font-bold text-xs flex items-center justify-center gap-1 hover:bg-primary/90 transition-all cursor-pointer">
                    <Camera size={12} />
                    <span>{isAz ? "Şəkil Yüklə" : "Upload Photo"}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {data.personalInfo.photoUrl && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono cursor-pointer"
                    >
                      {isAz ? "Sil" : "Remove"}
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Section Adders */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase size={14} className="text-primary" /> {isAz ? "İş Təcrübəsi Əlavə Et" : "Add Work Experience"}
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" /> {isAz ? "Təhsil Əlavə Et" : "Add Education"}
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addSkillCategory}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Code size={14} className="text-primary" /> {isAz ? "Bacarıq Qrupu Əlavə Et" : "Add Skill Group"}
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addProject}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 size={14} className="text-primary" /> {isAz ? "Layihə Əlavə Et" : "Add Project"}
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addReference}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-primary" /> {isAz ? "Referans Əlavə Et" : "Add Reference"}
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* 3. STYLES & TYPOGRAPHY */}
          {activeDrawer === "styles" && (
            <div className="space-y-4 text-xs font-mono">
              {/* Accent Color */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  {isAz ? "Əsas Rəng" : "Accent Theme Color"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setTheme((prev) => ({ ...prev, accentColor: c.hex }))}
                      className={`h-7 w-7 rounded-xl transition-all cursor-pointer ${
                        theme.accentColor === c.hex
                          ? "ring-2 ring-white ring-offset-2 ring-offset-neutral-900 scale-110"
                          : "opacity-75 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  {isAz ? "Şrift Qarnituru" : "Typography Font"}
                </label>
                <div className="space-y-1.5">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setTheme((prev) => ({ ...prev, fontFamily: f.id }))}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        theme.fontFamily === f.id
                          ? "bg-primary text-black font-bold border-primary"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
                      }`}
                    >
                      <span>{f.label}</span>
                      {theme.fontFamily === f.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing Density */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">
                  {isAz ? "Səhifə Sıxlığı" : "Page Spacing Density"}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["compact", "standard", "relaxed"] as ResumeDensity[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setTheme((prev) => ({ ...prev, density: d }))}
                      className={`py-1.5 rounded-xl border text-center uppercase transition-all cursor-pointer ${
                        theme.density === d
                          ? "bg-primary text-black font-bold border-primary"
                          : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10"
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
      )}
    </div>
  );
};
