import React from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";
import {
  TEMPLATE_OPTIONS,
  COLOR_OPTIONS,
  FONT_OPTIONS,
  DARK_SIDEBAR_PRESET,
  MODERN_2COL_PRESET,
  SOFT_BANNER_PRESET,
  SOFTWARE_ENGINEER_PRESET,
  PRODUCT_DESIGNER_PRESET,
  BLANK_RESUME_DATA,
  TemplateId,
  ResumeFont,
  ResumeDensity,
} from "../resumeTypes";
import {
  LayoutTemplate,
  Sparkles,
  Layers,
  Camera,
  Sliders,
  X,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Users,
  Award,
  Plus,
  RotateCcw,
  Check,
} from "lucide-react";

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

  return (
    <div className="flex h-full print:hidden">
      {/* ── NARROW ICON STRIP (Canva Style) ── */}
      <aside className="w-16 bg-neutral-900 border-r border-white/10 flex flex-col items-center py-4 space-y-4 shrink-0 z-30">
        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "templates" ? null : "templates")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "templates"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title="Templates"
        >
          <LayoutTemplate size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "presets" ? null : "presets")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "presets"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title="Presets"
        >
          <Sparkles size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "elements" ? null : "elements")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "elements"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title="Add Sections & Elements"
        >
          <Layers size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Sections</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveDrawer(activeDrawer === "styles" ? null : "styles")}
          className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all cursor-pointer ${
            activeDrawer === "styles"
              ? "bg-primary text-black font-bold shadow-md shadow-primary/20"
              : "text-neutral-400 hover:text-white hover:bg-white/5"
          }`}
          title="Document Design & Styles"
        >
          <Sliders size={18} />
          <span className="text-[9px] font-mono uppercase tracking-wider">Styles</span>
        </button>
      </aside>

      {/* ── EXPANDABLE SLIM DRAWER (Canva Style) ── */}
      {activeDrawer && (
        <div className="w-80 bg-neutral-900/98 backdrop-blur-2xl border-r border-white/10 p-5 overflow-y-auto z-20 space-y-5 text-foreground shadow-2xl animate-in slide-in-from-left duration-200">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              {activeDrawer === "templates" && "Resume Templates (9)"}
              {activeDrawer === "presets" && "Role Presets"}
              {activeDrawer === "elements" && "Add Sections & Content"}
              {activeDrawer === "styles" && "Document Styling & Fonts"}
            </h3>
            <button
              onClick={() => setActiveDrawer(null)}
              className="text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          {/* DRAWER 1: TEMPLATES */}
          {activeDrawer === "templates" && (
            <div className="space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Switch templates anytime. Your content and edits remain 100% preserved.
              </p>
              <div className="space-y-2.5">
                {TEMPLATE_OPTIONS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme((prev) => ({ ...prev, template: t.id }))}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer space-y-1 group ${
                      theme.template === t.id
                        ? "bg-primary/10 border-primary text-foreground shadow-md shadow-primary/10"
                        : "bg-white/5 border-white/10 text-neutral-300 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        {t.name}
                      </span>
                      {t.sourceBadge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-primary">
                          {t.sourceBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                      {t.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DRAWER 2: PRESETS */}
          {activeDrawer === "presets" && (
            <div className="space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Load starter templates with pre-filled professional content.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setData(SOFTWARE_ENGINEER_PRESET);
                    setTheme((prev) => ({ ...prev, template: "sb2nov", accentColor: "#111827" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-primary hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  🚀 RenderCV sb2nov (Software Engineer)
                </button>

                <button
                  onClick={() => {
                    setData(DARK_SIDEBAR_PRESET);
                    setTheme((prev) => ({ ...prev, template: "dark-sidebar", accentColor: "#1e3a8a" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-primary hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  💼 Dark Sidebar Executive (Accounting/Finance)
                </button>

                <button
                  onClick={() => {
                    setData(MODERN_2COL_PRESET);
                    setTheme((prev) => ({ ...prev, template: "modern-2col", accentColor: "#0284c7" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-primary hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  📊 Enhancv 2-Col (Project Manager)
                </button>

                <button
                  onClick={() => {
                    setData(SOFT_BANNER_PRESET);
                    setTheme((prev) => ({ ...prev, template: "soft-banner", accentColor: "#3b82f6" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-primary hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  🩺 Nordic Soft Banner (Healthcare / Nurse)
                </button>

                <button
                  onClick={() => {
                    setData(PRODUCT_DESIGNER_PRESET);
                    setTheme((prev) => ({ ...prev, template: "modern-2col", accentColor: "#059669" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-primary hover:bg-white/10 text-xs font-bold text-foreground transition-all cursor-pointer"
                >
                  🎨 Product Designer & UX Lead
                </button>

                <button
                  onClick={() => {
                    setData(BLANK_RESUME_DATA);
                    setTheme((prev) => ({ ...prev, template: "sb2nov", accentColor: "#111827" }));
                  }}
                  className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:border-red-400 hover:bg-red-500/10 text-xs font-bold text-muted-foreground hover:text-red-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={12} /> Clear & Start Blank
                </button>
              </div>
            </div>
          )}

          {/* DRAWER 3: SECTIONS & ELEMENTS */}
          {activeDrawer === "elements" && (
            <div className="space-y-4">
              <p className="text-[11px] text-muted-foreground">
                Click any section to insert it directly onto your resume.
              </p>

              {/* Photo Management */}
              <div className="p-3 rounded-2xl border border-white/10 bg-white/5 space-y-2">
                <div className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Profile Photo</span>
                  <button
                    type="button"
                    onClick={togglePhoto}
                    className="text-[10px] font-mono text-primary hover:underline cursor-pointer"
                  >
                    {data.personalInfo.showPhoto ? "Hide Photo" : "Show Photo"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex-1 py-1.5 rounded-xl bg-primary text-black font-mono font-bold text-xs flex items-center justify-center gap-1 hover:bg-primary/90 transition-all cursor-pointer">
                    <Camera size={12} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {data.personalInfo.photoUrl && (
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono cursor-pointer"
                    >
                      Delete
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
                    <Briefcase size={14} className="text-primary" /> Add Work Experience
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addEducation}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-primary" /> Add Education
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addSkillCategory}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Code size={14} className="text-primary" /> Add Skill Group
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addProject}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FolderGit2 size={14} className="text-primary" /> Add Project
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>

                <button
                  type="button"
                  onClick={addReference}
                  className="w-full text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 text-xs font-bold text-foreground flex items-center justify-between transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Users size={14} className="text-primary" /> Add Reference
                  </span>
                  <Plus size={12} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* DRAWER 4: STYLES & TYPOGRAPHY */}
          {activeDrawer === "styles" && (
            <div className="space-y-4 text-xs font-mono">
              {/* Accent Color */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Accent Theme Color</label>
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
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Typography Font</label>
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
                <label className="text-[11px] font-bold text-muted-foreground uppercase">Page Spacing Density</label>
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
