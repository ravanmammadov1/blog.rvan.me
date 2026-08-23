import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { CanvasText } from "../editor/CanvasText";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { DENSITY_CONFIG } from "../themeTokens";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Clean Corporate Template (ATS-Optimized Executive Format)
 * Elegant centered header, horizontal dividing lines, high-legibility layout.
 */
export const CorporateCleanTemplate: React.FC<TemplateProps> = () => {
  const { data, theme, updateFieldByPath } = useResumeEditor();
  const { personalInfo, summary, experiences, education, skills, certifications } = data;
  const accent = theme.accentColor || "#1e3a8a";
  const density = DENSITY_CONFIG[theme.density || "standard"];

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── CORPORATE HEADER ── */}
      <header className="text-center space-y-1 pb-3 border-b-2" style={{ borderColor: accent }}>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-neutral-950">
          <CanvasText
            id="personalInfo.fullName"
            value={personalInfo.fullName}
            onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
            placeholder="FULL NAME"
          />
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-700">
          <CanvasText
            id="personalInfo.title"
            value={personalInfo.title}
            onChange={(val) => updateFieldByPath("personalInfo.title", val)}
            placeholder="EXECUTIVE TITLE"
          />
        </p>
        <div className="text-[11px] text-neutral-600 flex flex-wrap justify-center gap-x-2.5 pt-0.5">
          <span>{personalInfo.location}</span>
          <span>|</span>
          <span>{personalInfo.phone}</span>
          <span>|</span>
          <span>{personalInfo.email}</span>
          {personalInfo.linkedin && (
            <>
              <span>|</span>
              <span>{personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>
            </>
          )}
        </div>
      </header>

      {/* ── EXECUTIVE SUMMARY ── */}
      {summary && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b pb-0.5" style={{ borderColor: `${accent}40`, color: accent }}>
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-800 text-justify">
            <CanvasText
              id="summary"
              value={summary}
              onChange={(val) => updateFieldByPath("summary", val)}
              placeholder="Career narrative..."
              multiline
            />
          </p>
        </section>
      )}

      {/* ── CORE COMPETENCIES ── */}
      {skills.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ borderColor: `${accent}40`, color: accent }}>
            Core Competencies & Leadership
          </h2>
          <div className="grid grid-cols-3 gap-2 text-xs pt-0.5">
            {skills.flatMap((s) => s.items).slice(0, 9).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                <span className="font-medium truncate">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROFESSIONAL EXPERIENCE ── */}
      {experiences.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ borderColor: `${accent}40`, color: accent }}>
            Professional Experience
          </h2>
          <div className={density.itemGap}>
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-neutral-950 uppercase tracking-wide">
                    {exp.role}
                  </span>
                  <span className="text-[10px] font-semibold text-neutral-500 font-mono">
                    {exp.dates}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-neutral-700 italic">
                  {exp.company} {exp.location ? `— ${exp.location}` : ""}
                </div>

                {exp.bullets && (
                  <ul className={`list-disc list-outside ml-4 text-xs text-neutral-800 ${density.bulletGap}`}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION & CREDENTIALS ── */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-0.5" style={{ borderColor: `${accent}40`, color: accent }}>
            Education & Professional Development
          </h2>
          <div className="space-y-1 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-950">{edu.degree}</span>
                  {" — "}
                  <span className="text-neutral-700">{edu.institution}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">{edu.dates}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
