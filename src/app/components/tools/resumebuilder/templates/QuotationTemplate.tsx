import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { CanvasText } from "../editor/CanvasText";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { Quote } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Quotation / Creative Lead Template (Matching Image 3)
 * Elegant executive quotation hero block with 2-column asymmetric layout.
 */
export const QuotationTemplate: React.FC<TemplateProps> = () => {
  const {
    data,
    theme,
    updateFieldByPath,
    addExperience,
    addEducation,
    addSkillCategory,
    addProject,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, projects } = data;
  const accent = theme.accentColor || "#d97706";

  return (
    <div className="p-8 md:p-10 text-neutral-900 bg-white min-h-[1050px] leading-snug text-left space-y-6">
      {/* ── TOP HEADER WITH MASSIVE QUOTATION ICON ── */}
      <header className="flex items-start justify-between gap-6 border-b pb-6" style={{ borderColor: `${accent}30` }}>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-neutral-950 font-serif">
            <CanvasText
              id="personalInfo.fullName"
              value={personalInfo.fullName}
              onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
              placeholder="YOUR FULL NAME"
            />
          </h1>
          {personalInfo.title && (
            <p className="text-xs font-mono font-bold tracking-widest uppercase" style={{ color: accent }}>
              <CanvasText
                id="personalInfo.title"
                value={personalInfo.title}
                onChange={(val) => updateFieldByPath("personalInfo.title", val)}
                placeholder="PROFESSIONAL TITLE"
              />
            </p>
          )}
        </div>

        {/* Decorative Quote Mark */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
          style={{ backgroundColor: `${accent}18`, color: accent }}
        >
          <Quote size={28} className="rotate-180" />
        </div>
      </header>

      {/* ── 2-COLUMN GRID (LEFT: CONTACT & SKILLS & EDUCATION | RIGHT: SUMMARY & EXPERIENCE) ── */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (4 Cols) */}
        <div className="col-span-4 space-y-6 border-r pr-6" style={{ borderColor: `${accent}20` }}>
          {/* Contact */}
          <section className="space-y-2">
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: accent }}>
              Contact
            </h2>
            <div className="space-y-1.5 text-xs text-neutral-600 font-mono">
              <div>
                <CanvasText
                  id="personalInfo.phone"
                  value={personalInfo.phone}
                  onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
                  placeholder="Phone"
                />
              </div>
              <div className="break-all">
                <CanvasText
                  id="personalInfo.email"
                  value={personalInfo.email}
                  onChange={(val) => updateFieldByPath("personalInfo.email", val)}
                  placeholder="Email"
                />
              </div>
              <div>
                <CanvasText
                  id="personalInfo.location"
                  value={personalInfo.location}
                  onChange={(val) => updateFieldByPath("personalInfo.location", val)}
                  placeholder="Location"
                />
              </div>
              {personalInfo.linkedin && (
                <div>
                  <CanvasText
                    id="personalInfo.linkedin"
                    value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                    onChange={(val) => updateFieldByPath("personalInfo.linkedin", val)}
                    placeholder="LinkedIn"
                  />
                </div>
              )}
              {personalInfo.github && (
                <div>
                  <CanvasText
                    id="personalInfo.github"
                    value={personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                    onChange={(val) => updateFieldByPath("personalInfo.github", val)}
                    placeholder="GitHub"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: accent }}>
                Education
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <div className="font-bold text-neutral-900">
                      <CanvasText
                        id={`education.${idx}.institution`}
                        value={edu.institution}
                        onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                        placeholder="Institution"
                      />
                    </div>
                    <div className="text-neutral-600 text-[11px]">
                      <CanvasText
                        id={`education.${idx}.degree`}
                        value={edu.degree}
                        onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                        placeholder="Degree"
                      />
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400">
                      <CanvasText
                        id={`education.${idx}.dates`}
                        value={edu.dates}
                        onChange={(val) => updateFieldByPath(`education.${idx}.dates`, val)}
                        placeholder="Dates"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: accent }}>
                Skills & Stack
              </h2>
              <div className="space-y-2 text-xs">
                {skills.map((grp, idx) => (
                  <div key={grp.id || idx} className="space-y-0.5">
                    <div className="font-semibold text-neutral-800 text-[11px]">
                      <CanvasText
                        id={`skills.${idx}.category`}
                        value={grp.category}
                        onChange={(val) => updateFieldByPath(`skills.${idx}.category`, val)}
                        placeholder="Category"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-600">
                      <CanvasText
                        id={`skills.${idx}.items`}
                        value={grp.items.join(", ")}
                        onChange={(val) =>
                          updateFieldByPath(
                            `skills.${idx}.items`,
                            val.split(",").map((s) => s.trim())
                          )
                        }
                        placeholder="React, TypeScript..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN (8 Cols) */}
        <div className="col-span-8 space-y-6">
          {/* Summary */}
          {summary && (
            <section className="space-y-1.5">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider" style={{ color: accent }}>
                Professional Summary
              </h2>
              <CanvasText
                id="summary"
                value={summary}
                onChange={(val) => updateFieldByPath("summary", val)}
                placeholder="Career narrative..."
                tag="p"
                multiline
                className="text-xs text-neutral-700 leading-relaxed"
              />
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-between border-b pb-1" style={{ color: accent, borderColor: `${accent}20` }}>
                <span>Work Experience</span>
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, idx) => (
                  <div key={exp.id || idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-neutral-950">
                        <CanvasText
                          id={`experiences.${idx}.role`}
                          value={exp.role}
                          onChange={(val) => updateFieldByPath(`experiences.${idx}.role`, val)}
                          placeholder="Job Title"
                        />
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        <CanvasText
                          id={`experiences.${idx}.dates`}
                          value={exp.dates}
                          onChange={(val) => updateFieldByPath(`experiences.${idx}.dates`, val)}
                          placeholder="Dates"
                        />
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-neutral-700">
                      <CanvasText
                        id={`experiences.${idx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.company`, val)}
                        placeholder="Company"
                      />
                    </div>

                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-neutral-700">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>
                            <CanvasText
                              id={`experiences.${idx}.bullets.${bIdx}`}
                              value={b}
                              onChange={(val) => {
                                const newB = [...exp.bullets];
                                newB[bIdx] = val;
                                updateFieldByPath(`experiences.${idx}.bullets`, newB);
                              }}
                              placeholder="Achievement..."
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
