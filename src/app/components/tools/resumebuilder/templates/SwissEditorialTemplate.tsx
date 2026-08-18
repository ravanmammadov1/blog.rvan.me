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
 * Swiss Editorial Modernist Template
 * Strict grid hierarchy, bold minimalist typography, high white-space discipline.
 */
export const SwissEditorialTemplate: React.FC<TemplateProps> = () => {
  const { data, theme, updateFieldByPath } = useResumeEditor();
  const { personalInfo, summary, experiences, education, skills } = data;
  const accent = theme.accentColor || "#111827";
  const density = DENSITY_CONFIG[theme.density || "standard"];

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── SWISS HERO ── */}
      <header className="space-y-2 border-b-4 border-neutral-950 pb-5">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-neutral-950 leading-none">
          <CanvasText
            id="personalInfo.fullName"
            value={personalInfo.fullName}
            onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
            placeholder="FULL NAME"
          />
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-mono gap-1 pt-1">
          <p className="font-bold tracking-widest uppercase text-neutral-800" style={{ color: accent }}>
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="TITLE / SPECIALIZATION"
            />
          </p>
          <div className="text-neutral-500 flex gap-2">
            <span>{personalInfo.email}</span>
            <span>/</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>
      </header>

      {/* ── EDITORIAL SUMMARY ── */}
      {summary && (
        <section className="grid grid-cols-12 gap-6 pt-2">
          <div className="col-span-3 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            About
          </div>
          <div className="col-span-9 text-xs leading-relaxed text-neutral-800 font-medium">
            <CanvasText
              id="summary"
              value={summary}
              onChange={(val) => updateFieldByPath("summary", val)}
              placeholder="Professional summary..."
              multiline
            />
          </div>
        </section>
      )}

      {/* ── EXPERIENCE (GRID 3:9) ── */}
      {experiences.length > 0 && (
        <section className="grid grid-cols-12 gap-6 border-t pt-4 border-neutral-200">
          <div className="col-span-3 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Experience
          </div>
          <div className={`col-span-9 ${density.itemGap}`}>
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-xs text-neutral-950">
                    <CanvasText
                      id={`experiences.${idx}.role`}
                      value={exp.role}
                      onChange={(val) => updateFieldByPath(`experiences.${idx}.role`, val)}
                      placeholder="Role"
                    />
                    {" — "}
                    <span className="font-normal text-neutral-700">
                      <CanvasText
                        id={`experiences.${idx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.company`, val)}
                        placeholder="Company"
                      />
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {exp.dates}
                  </span>
                </div>

                {exp.bullets && (
                  <ul className={`list-square list-outside ml-4 text-xs text-neutral-700 ${density.bulletGap}`}>
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

      {/* ── SKILLS (GRID 3:9) ── */}
      {skills.length > 0 && (
        <section className="grid grid-cols-12 gap-6 border-t pt-4 border-neutral-200">
          <div className="col-span-3 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Expertise
          </div>
          <div className="col-span-9 grid grid-cols-2 gap-4 text-xs">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx}>
                <div className="font-bold text-[11px] font-mono uppercase text-neutral-900 mb-0.5">
                  {cat.category}
                </div>
                <div className="text-neutral-600 leading-snug">
                  {cat.items.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION (GRID 3:9) ── */}
      {education.length > 0 && (
        <section className="grid grid-cols-12 gap-6 border-t pt-4 border-neutral-200">
          <div className="col-span-3 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-500">
            Education
          </div>
          <div className="col-span-9 space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-950">{edu.institution}</span>
                  {" / "}
                  <span className="text-neutral-700">{edu.degree}</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400">{edu.dates}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
