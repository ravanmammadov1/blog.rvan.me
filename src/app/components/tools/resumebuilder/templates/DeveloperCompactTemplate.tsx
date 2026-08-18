import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { CanvasText } from "../editor/CanvasText";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { DENSITY_CONFIG } from "../themeTokens";
import { Terminal, Code2, Cpu } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Developer Compact Template (High-Density Engineering Resume)
 * Terminal-styled header badges, compact tech stacks, and quantified bullets.
 */
export const DeveloperCompactTemplate: React.FC<TemplateProps> = () => {
  const { data, theme, updateFieldByPath } = useResumeEditor();
  const { personalInfo, summary, experiences, education, skills, projects, certifications } = data;
  const accent = theme.accentColor || "#059669";
  const density = DENSITY_CONFIG[theme.density || "compact"];

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── DEVELOPER HEADER ── */}
      <header className="border-b-2 pb-3" style={{ borderColor: `${accent}40` }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-950">
              <CanvasText
                id="personalInfo.fullName"
                value={personalInfo.fullName}
                onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
                placeholder="YOUR NAME"
              />
            </h1>
            <p className="text-xs font-mono font-bold mt-0.5" style={{ color: accent }}>
              <CanvasText
                id="personalInfo.title"
                value={personalInfo.title}
                onChange={(val) => updateFieldByPath("personalInfo.title", val)}
                placeholder="Full-Stack / Systems Engineer"
              />
            </p>
          </div>

          <div className="text-[11px] font-mono text-neutral-600 text-left sm:text-right space-y-0.5">
            <div>
              <CanvasText
                id="personalInfo.email"
                value={personalInfo.email}
                onChange={(val) => updateFieldByPath("personalInfo.email", val)}
                placeholder="email@example.com"
              />
              {" • "}
              <CanvasText
                id="personalInfo.phone"
                value={personalInfo.phone}
                onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <CanvasText
                id="personalInfo.location"
                value={personalInfo.location}
                onChange={(val) => updateFieldByPath("personalInfo.location", val)}
                placeholder="San Francisco, CA"
              />
              {personalInfo.github && (
                <>
                  {" • "}
                  <CanvasText
                    id="personalInfo.github"
                    value={personalInfo.github.replace(/^https?:\/\//, "")}
                    onChange={(val) => updateFieldByPath("personalInfo.github", val)}
                    placeholder="github.com/user"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── TECHNICAL SKILLS (TOP PRIORITY FOR ENGINEERS) ── */}
      {skills.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-0.5" style={{ color: accent, borderColor: `${accent}30` }}>
            <Cpu size={12} />
            <span>Technical Skills & Core Stack</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {skills.map((cat, cIdx) => (
              <div key={cat.id || cIdx} className="flex items-baseline gap-1.5">
                <span className="font-bold text-neutral-800 text-[11px] shrink-0 font-mono">
                  <CanvasText
                    id={`skills.${cIdx}.category`}
                    value={`${cat.category}:`}
                    onChange={(val) => updateFieldByPath(`skills.${cIdx}.category`, val.replace(/:$/, ""))}
                    placeholder="Category"
                  />
                </span>
                <span className="text-neutral-700 text-xs">
                  <CanvasText
                    id={`skills.${cIdx}.items`}
                    value={cat.items.join(", ")}
                    onChange={(val) =>
                      updateFieldByPath(
                        `skills.${cIdx}.items`,
                        val.split(",").map((s) => s.trim())
                      )
                    }
                    placeholder="React, TypeScript, Go..."
                  />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {experiences.length > 0 && (
        <section className="space-y-2.5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-0.5" style={{ color: accent, borderColor: `${accent}30` }}>
            <Terminal size={12} />
            <span>Work Experience</span>
          </h2>
          <div className={density.itemGap}>
            {experiences.map((exp, eIdx) => (
              <div key={exp.id || eIdx} className="space-y-0.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-neutral-950">
                    <CanvasText
                      id={`experiences.${eIdx}.role`}
                      value={exp.role}
                      onChange={(val) => updateFieldByPath(`experiences.${eIdx}.role`, val)}
                      placeholder="Role Title"
                    />
                    {" @ "}
                    <span className="text-neutral-800 font-semibold">
                      <CanvasText
                        id={`experiences.${eIdx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${eIdx}.company`, val)}
                        placeholder="Company"
                      />
                    </span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    <CanvasText
                      id={`experiences.${eIdx}.dates`}
                      value={exp.dates}
                      onChange={(val) => updateFieldByPath(`experiences.${eIdx}.dates`, val)}
                      placeholder="2022 - Present"
                    />
                  </span>
                </div>

                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-disc list-outside ml-4 text-neutral-700 ${density.bulletGap}`}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx}>
                        <CanvasText
                          id={`experiences.${eIdx}.bullets.${bIdx}`}
                          value={bullet}
                          onChange={(val) => {
                            const newB = [...exp.bullets];
                            newB[bIdx] = val;
                            updateFieldByPath(`experiences.${eIdx}.bullets`, newB);
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

      {/* ── PROJECTS ── */}
      {projects && projects.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-b pb-0.5" style={{ color: accent, borderColor: `${accent}30` }}>
            <Code2 size={12} />
            <span>Key Projects & Open Source</span>
          </h2>
          <div className={density.itemGap}>
            {projects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="space-y-0.5 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-neutral-900">
                    <CanvasText
                      id={`projects.${pIdx}.title`}
                      value={proj.title}
                      onChange={(val) => updateFieldByPath(`projects.${pIdx}.title`, val)}
                      placeholder="Project Name"
                    />
                    {proj.role && (
                      <span className="text-neutral-500 font-normal text-[11px]">
                        {" ("}
                        <CanvasText
                          id={`projects.${pIdx}.role`}
                          value={proj.role}
                          onChange={(val) => updateFieldByPath(`projects.${pIdx}.role`, val)}
                          placeholder="Role"
                        />
                        {")"}
                      </span>
                    )}
                  </span>
                  {proj.link && (
                    <span className="text-[10px] font-mono text-neutral-500">
                      <CanvasText
                        id={`projects.${pIdx}.link`}
                        value={proj.link.replace(/^https?:\/\//, "")}
                        onChange={(val) => updateFieldByPath(`projects.${pIdx}.link`, val)}
                        placeholder="github.com/link"
                      />
                    </span>
                  )}
                </div>

                {proj.description && (
                  <p className="text-neutral-700 text-xs pl-2 border-l-2 border-neutral-200">
                    <CanvasText
                      id={`projects.${pIdx}.description`}
                      value={proj.description}
                      onChange={(val) => updateFieldByPath(`projects.${pIdx}.description`, val)}
                      placeholder="Description..."
                    />
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <h2 className="text-[11px] font-mono font-bold uppercase tracking-wider border-b pb-0.5" style={{ color: accent, borderColor: `${accent}30` }}>
            Education
          </h2>
          <div className="space-y-1.5 text-xs">
            {education.map((edu, edIdx) => (
              <div key={edu.id || edIdx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-950">
                    <CanvasText
                      id={`education.${edIdx}.institution`}
                      value={edu.institution}
                      onChange={(val) => updateFieldByPath(`education.${edIdx}.institution`, val)}
                      placeholder="University"
                    />
                  </span>
                  {" — "}
                  <span className="text-neutral-700">
                    <CanvasText
                      id={`education.${edIdx}.degree`}
                      value={edu.degree}
                      onChange={(val) => updateFieldByPath(`education.${edIdx}.degree`, val)}
                      placeholder="Degree"
                    />
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">
                  <CanvasText
                    id={`education.${edIdx}.dates`}
                    value={edu.dates}
                    onChange={(val) => updateFieldByPath(`education.${edIdx}.dates`, val)}
                    placeholder="2018 - 2022"
                  />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
