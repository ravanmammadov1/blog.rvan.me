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
 * Compact ATS Template (Dense, 100% Plain Text Parser Compliant)
 * Optimized for automated Applicant Tracking Systems and high density.
 */
export const CompactAtsTemplate: React.FC<TemplateProps> = () => {
  const { data, theme, updateFieldByPath } = useResumeEditor();
  const { personalInfo, summary, experiences, education, skills, projects } = data;
  const accent = theme.accentColor || "#111827";
  const density = DENSITY_CONFIG[theme.density || "compact"];

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── TOP ATS HEADER ── */}
      <header className="border-b pb-2 text-center space-y-0.5" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950 uppercase">
          <CanvasText
            id="personalInfo.fullName"
            value={personalInfo.fullName}
            onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
            placeholder="FULL NAME"
          />
        </h1>
        {personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-800">
            {personalInfo.title}
          </p>
        )}
        <div className="text-[11px] text-neutral-700 flex flex-wrap justify-center gap-x-2">
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <span>{personalInfo.email}</span>
          <span>•</span>
          <span>{personalInfo.location}</span>
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <span>{personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>
            </>
          )}
        </div>
      </header>

      {/* ── SUMMARY ── */}
      {summary && (
        <section className="space-y-0.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Summary
          </h2>
          <p className="text-xs text-neutral-800 leading-snug">
            {summary}
          </p>
        </section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {experiences.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Experience
          </h2>
          <div className={density.itemGap}>
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-neutral-950">
                    {exp.role} — <span className="font-semibold text-neutral-800">{exp.company}</span>
                  </span>
                  <span className="text-[10px] text-neutral-600 font-mono">
                    {exp.dates}
                  </span>
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

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Skills
          </h2>
          <div className="space-y-0.5 text-xs text-neutral-800">
            {skills.map((s, idx) => (
              <div key={s.id || idx}>
                <strong className="text-neutral-900">{s.category}: </strong>
                <span>{s.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-950 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Education
          </h2>
          <div className="space-y-1 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-950">{edu.institution}</span>
                  {" — "}
                  <span className="text-neutral-800">{edu.degree}</span>
                </div>
                <span className="text-[10px] text-neutral-600 font-mono">{edu.dates}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
