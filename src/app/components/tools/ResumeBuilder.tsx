import React, { useState, useEffect, useMemo } from "react";
import {
  ResumeData,
  ResumeThemeConfig,
  TEMPLATE_OPTIONS,
  COLOR_OPTIONS,
  FONT_OPTIONS,
  SOFTWARE_ENGINEER_PRESET,
  PRODUCT_DESIGNER_PRESET,
  BLANK_RESUME_DATA,
  TemplateId,
  ResumeFont,
  ResumeDensity,
} from "./resumebuilder/resumeTypes";
import { calculateAtsScore } from "./resumebuilder/atsEngine";
import { ResumePreview } from "./resumebuilder/templates/ResumePreview";
import { PersonalInfoForm } from "./resumebuilder/editor/PersonalInfoForm";
import { SummaryForm } from "./resumebuilder/editor/SummaryForm";
import { ExperienceForm } from "./resumebuilder/editor/ExperienceForm";
import { EducationForm } from "./resumebuilder/editor/EducationForm";
import { SkillsForm } from "./resumebuilder/editor/SkillsForm";
import { ProjectsForm } from "./resumebuilder/editor/ProjectsForm";
import { CertificationsForm } from "./resumebuilder/editor/CertificationsForm";
import { AtsScoreModal } from "./resumebuilder/editor/AtsScoreModal";

import {
  Printer,
  Download,
  Upload,
  Copy,
  Check,
  Sparkles,
  Sliders,
  Palette,
  Type,
  Eye,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit2,
  Award,
  Layers,
  ShieldCheck,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

const STORAGE_KEY = "rvan_ats_resume_data_v1";
const THEME_STORAGE_KEY = "rvan_ats_resume_theme_v1";

type ActiveTab = "personal" | "summary" | "experience" | "education" | "skills" | "projects" | "certifications";

export default function ResumeBuilder() {
  const { language } = useLanguage();

  // Resume Data State
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return SOFTWARE_ENGINEER_PRESET;
  });

  // Resume Theme Config State
  const [theme, setTheme] = useState<ResumeThemeConfig>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) return JSON.parse(savedTheme);
    } catch {}
    return {
      template: "modern-tech",
      accentColor: "#1e3a8a",
      fontFamily: "sans",
      density: "standard",
      paperSize: "a4",
    };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [previewZoom, setPreviewZoom] = useState<number>(0.9);
  const [showAtsModal, setShowAtsModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch {}
  }, [resumeData]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  // ATS Score Calculation
  const atsResult = useMemo(() => calculateAtsScore(resumeData), [resumeData]);

  // Preset Loaders
  const loadPreset = (preset: ResumeData, template: TemplateId, color: string) => {
    setResumeData(preset);
    setTheme((prev) => ({ ...prev, template, accentColor: color }));
  };

  // Print / PDF Download
  const handlePrintPdf = () => {
    window.print();
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const jsonStr = JSON.stringify({ resumeData, theme }, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData.personalInfo.fullName ? resumeData.personalInfo.fullName.toLowerCase().replace(/\s+/g, "_") : "resume"}_backup.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.resumeData) {
          setResumeData(parsed.resumeData);
          if (parsed.theme) setTheme(parsed.theme);
        } else {
          setResumeData(parsed);
        }
      } catch (err) {
        alert("Invalid resume JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Copy Plain Text for Application Forms
  const handleCopyPlainText = () => {
    const lines: string[] = [];
    const info = resumeData.personalInfo;
    lines.push(`${info.fullName.toUpperCase()}`);
    lines.push(`${info.title}`);
    lines.push(`Email: ${info.email} | Phone: ${info.phone} | Location: ${info.location}`);
    if (info.linkedin) lines.push(`LinkedIn: ${info.linkedin}`);
    if (info.github) lines.push(`GitHub: ${info.github}`);
    if (info.website) lines.push(`Portfolio: ${info.website}`);
    lines.push("\n----------------------------------------\nPROFESSIONAL SUMMARY");
    lines.push(resumeData.summary);

    lines.push("\n----------------------------------------\nWORK EXPERIENCE");
    for (const exp of resumeData.experiences) {
      lines.push(`\n${exp.title} - ${exp.company} (${exp.location})`);
      lines.push(`${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`);
      for (const b of exp.bullets) {
        if (b.trim()) lines.push(`• ${b}`);
      }
    }

    lines.push("\n----------------------------------------\nEDUCATION");
    for (const edu of resumeData.education) {
      lines.push(`${edu.degree} in ${edu.field} - ${edu.institution} (${edu.startDate} - ${edu.endDate})`);
    }

    lines.push("\n----------------------------------------\nSKILLS");
    for (const s of resumeData.skills) {
      lines.push(`${s.name}: ${s.items.join(", ")}`);
    }

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const navTabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: "personal", label: "Contact Info", icon: <FileText size={13} /> },
    { id: "summary", label: "Summary", icon: <Sparkles size={13} /> },
    { id: "experience", label: `Experience (${resumeData.experiences.length})`, icon: <Briefcase size={13} /> },
    { id: "education", label: `Education (${resumeData.education.length})`, icon: <GraduationCap size={13} /> },
    { id: "skills", label: "Skills & Stack", icon: <Code size={13} /> },
    { id: "projects", label: `Projects (${resumeData.projects.length})`, icon: <FolderGit2 size={13} /> },
    { id: "certifications", label: "Certifications", icon: <Award size={13} /> },
  ];

  return (
    <div className="w-full space-y-6">
      {/* ── TOP ACTION BAR (PRESETS, THEME CONTROLS, EXPORT) ── */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:p-6 glass shadow-2xl space-y-4">
        {/* Row 1: Presets & Primary Export Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              {language === "az" ? "Hazır Nümunələr:" : "Starter Presets:"}
            </span>
            <button
              onClick={() => loadPreset(SOFTWARE_ENGINEER_PRESET, "modern-tech", "#1e3a8a")}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 text-foreground transition-all cursor-pointer"
            >
              💻 Software Engineer
            </button>
            <button
              onClick={() => loadPreset(PRODUCT_DESIGNER_PRESET, "creative", "#059669")}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10 text-foreground transition-all cursor-pointer"
            >
              🎨 Product Designer
            </button>
            <button
              onClick={() => loadPreset(BLANK_RESUME_DATA, "classic-harvard", "#111827")}
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:border-red-400/50 hover:bg-red-500/10 text-muted-foreground hover:text-red-300 transition-all cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={11} /> {language === "az" ? "Təmiz Kətan" : "Blank Canvas"}
            </button>
          </div>

          {/* ATS Score Meter & Primary Export */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* ATS Score Indicator */}
            <button
              onClick={() => setShowAtsModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/15 bg-black/40 hover:border-primary/50 transition-all cursor-pointer group"
              title="Click to view full ATS Compliance Audit"
            >
              <ShieldCheck size={14} className="text-primary group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono font-bold text-foreground">
                ATS Score: <strong className={atsResult.score >= 80 ? "text-emerald-400" : "text-amber-400"}>{atsResult.score}/100</strong>
              </span>
              <span className="text-[10px] font-mono text-primary uppercase underline">Audit</span>
            </button>

            {/* Copy Plain Text */}
            <button
              onClick={handleCopyPlainText}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer"
              title="Copy plain text for job application forms"
            >
              {copiedText ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedText ? "COPIED!" : "COPY TEXT"}</span>
            </button>

            {/* Save / Load JSON */}
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer"
              title="Save resume JSON backup file"
            >
              <Download size={13} />
              <span>SAVE JSON</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/15 bg-white/5 text-xs font-mono font-bold text-foreground hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer">
              <Upload size={13} />
              <span>LOAD JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            {/* Print / Download PDF */}
            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-black text-xs font-mono font-extrabold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all cursor-pointer shrink-0"
              title="Print or Save as Vector ATS-Friendly PDF"
            >
              <Printer size={14} />
              <span>DOWNLOAD PDF</span>
            </button>
          </div>
        </div>

        {/* Row 2: Visual Customizer (Templates, Accent Colors, Fonts, Density) */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Template Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Layers size={11} className="text-primary" /> Template:
            </span>
            <div className="flex flex-wrap gap-1">
              {TEMPLATE_OPTIONS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme({ ...theme, template: t.id })}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    theme.template === t.id
                      ? "bg-primary text-black"
                      : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-white/10"
                  }`}
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors, Fonts, Density */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Colors */}
            <div className="flex items-center gap-1.5">
              <Palette size={12} className="text-primary" />
              <div className="flex items-center gap-1 bg-black/40 border border-white/10 p-1 rounded-xl">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setTheme({ ...theme, accentColor: c.hex })}
                    className={`h-4 w-4 rounded-full transition-transform cursor-pointer ${
                      theme.accentColor === c.hex ? "scale-125 border-2 border-white" : "opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Font Picker */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-muted-foreground">
              <Type size={12} className="text-primary" />
              <select
                value={theme.fontFamily}
                onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value as ResumeFont })}
                className="rounded-xl border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Density Picker */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-muted-foreground">
              <Sliders size={12} className="text-primary" />
              <select
                value={theme.density}
                onChange={(e) => setTheme({ ...theme, density: e.target.value as ResumeDensity })}
                className="rounded-xl border border-white/10 bg-black/50 px-2.5 py-1 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="compact">Compact (1-Page)</option>
                <option value="standard">Standard</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Toggle: Edit Form vs Live Preview */}
      <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white/5 border border-white/10 max-w-xs mx-auto">
        <button
          onClick={() => setMobileView("edit")}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            mobileView === "edit" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
          }`}
        >
          Form Editor
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            mobileView === "preview" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
          }`}
        >
          Live Preview
        </button>
      </div>

      {/* ── MAIN WORKSPACE (SPLIT SCREEN: EDITOR & PREVIEW) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: FORM EDITOR TABS */}
        <div className={`lg:col-span-6 space-y-4 ${mobileView === "preview" ? "hidden lg:block" : "block"}`}>
          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 custom-scrollbar">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-primary text-black shadow-md shadow-primary/20"
                    : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Active Section Form Box */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 glass shadow-xl min-h-[500px]">
            {activeTab === "personal" && <PersonalInfoForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "summary" && <SummaryForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "experience" && <ExperienceForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "education" && <EducationForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "skills" && <SkillsForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "projects" && <ProjectsForm data={resumeData} onChange={setResumeData} />}
            {activeTab === "certifications" && <CertificationsForm data={resumeData} onChange={setResumeData} />}
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE A4 PREVIEW */}
        <div className={`lg:col-span-6 space-y-3 ${mobileView === "edit" ? "hidden lg:block" : "block"}`}>
          {/* Preview Toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye size={13} className="text-primary" />
              <span className="font-bold text-foreground">Live A4 Document Preview</span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewZoom((z) => Math.max(0.6, z - 0.1))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={13} />
              </button>
              <span>{Math.round(previewZoom * 100)}%</span>
              <button
                onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))}
                className="p-1 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Sheet Canvas Container */}
          <div className="p-4 md:p-6 rounded-3xl border border-white/10 bg-neutral-950/80 shadow-2xl overflow-auto max-h-[880px] custom-scrollbar flex justify-center">
            <div
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
              }}
              className="w-full"
            >
              <ResumePreview data={resumeData} theme={theme} />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed ATS Score Audit Modal */}
      {showAtsModal && <AtsScoreModal result={atsResult} onClose={() => setShowAtsModal(false)} />}
    </div>
  );
}
