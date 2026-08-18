import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { CanvasText } from "../editor/CanvasText";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { CanvasAddSectionDivider } from "../editor/CanvasAddSectionDivider";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { DENSITY_CONFIG } from "../themeTokens";
import { Plus, Trash2 } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * RenderCV sb2nov Template (LaTeX / Typst Engineering Resumes Standard)
 * Full Canva-style direct click-to-edit implementation.
 */
export const Sb2novTemplate: React.FC<TemplateProps> = () => {
  const {
    data,
    theme,
    updateFieldByPath,
    addExperience,
    removeExperience,
    addExpBullet,
    removeExpBullet,
    updateExpBullet,
    addEducation,
    removeEducation,
    addProject,
    removeProject,
    addSkillCategory,
    removeSkillCategory,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, projects, certifications } = data;
  const accent = theme.accentColor || "#111827";
  const density = DENSITY_CONFIG[theme.density || "standard"];

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── SB2NOV HEADER: DIRECT EDITABLE NAME & CONTACT BAR ── */}
      <header className="text-center space-y-1 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-neutral-950 font-serif">
          <CanvasText
            id="personalInfo.fullName"
            value={personalInfo.fullName}
            onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
            placeholder="YOUR FULL NAME"
          />
        </h1>
        {personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-700">
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="Target Role / Domain"
            />
          </p>
        )}

        {/* Contact Links Row separated by dots */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-neutral-650 font-mono">
          <CanvasText
            id="personalInfo.phone"
            value={personalInfo.phone}
            onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
            placeholder="Phone Number"
          />
          <span>•</span>
          <CanvasText
            id="personalInfo.email"
            value={personalInfo.email}
            onChange={(val) => updateFieldByPath("personalInfo.email", val)}
            placeholder="Email Address"
          />
          <span>•</span>
          <CanvasText
            id="personalInfo.location"
            value={personalInfo.location}
            onChange={(val) => updateFieldByPath("personalInfo.location", val)}
            placeholder="City, State"
          />
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <CanvasText
                id="personalInfo.linkedin"
                value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                onChange={(val) => updateFieldByPath("personalInfo.linkedin", val)}
                placeholder="LinkedIn"
              />
            </>
          )}
          {personalInfo.github && (
            <>
              <span>•</span>
              <CanvasText
                id="personalInfo.github"
                value={personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
                onChange={(val) => updateFieldByPath("personalInfo.github", val)}
                placeholder="GitHub"
              />
            </>
          )}
        </div>
      </header>

      {/* ── SUMMARY (Optional) ── */}
      {summary && (
        <section className="space-y-1">
          <CanvasSectionHeader title="Summary" style={{ borderColor: accent }} />
          <CanvasText
            id="summary"
            value={summary}
            onChange={(val) => updateFieldByPath("summary", val)}
            placeholder="Write your career overview..."
            tag="p"
            multiline
            className="text-xs text-neutral-750 leading-relaxed text-justify"
          />
        </section>
      )}

      {/* ── EDUCATION SECTION ── */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <CanvasSectionHeader
            title="Education"
            onAddEntry={addEducation}
            style={{ borderColor: accent }}
          />
          <div className="space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="group relative space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>
                    <CanvasText
                      id={`education.${idx}.institution`}
                      value={edu.institution}
                      onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                      placeholder="University Name"
                    />
                    <span className="font-normal text-neutral-600"> — </span>
                    <CanvasText
                      id={`education.${idx}.location`}
                      value={edu.location}
                      onChange={(val) => updateFieldByPath(`education.${idx}.location`, val)}
                      placeholder="Location"
                      className="font-normal text-neutral-600"
                    />
                  </span>
                  <span className="text-[11px] font-medium text-neutral-600">
                    <CanvasText
                      id={`education.${idx}.endDate`}
                      value={`${edu.startDate} – ${edu.endDate}`}
                      onChange={(val) => updateFieldByPath(`education.${idx}.endDate`, val)}
                      placeholder="Graduation Date"
                    />
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11.5px] text-neutral-750">
                  <span className="italic">
                    <CanvasText
                      id={`education.${idx}.degree`}
                      value={`${edu.degree} in ${edu.field}`}
                      onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                      placeholder="Degree & Major"
                    />
                  </span>
                  {edu.gpa && (
                    <span className="font-medium text-neutral-600">
                      GPA:{" "}
                      <CanvasText
                        id={`education.${idx}.gpa`}
                        value={edu.gpa}
                        onChange={(val) => updateFieldByPath(`education.${idx}.gpa`, val)}
                        placeholder="3.9"
                      />
                    </span>
                  )}
                </div>

                {/* Delete Entry Button on Hover */}
                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute -left-5 top-0 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                  title="Delete Degree"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <CanvasAddSectionDivider />

      {/* ── EXPERIENCE SECTION ── */}
      {experiences.length > 0 && (
        <section className="space-y-2">
          <CanvasSectionHeader
            title="Experience"
            onAddEntry={addExperience}
            style={{ borderColor: accent }}
          />
          <div className="space-y-3 text-xs">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="group relative space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-neutral-950 text-sm">
                      <CanvasText
                        id={`experiences.${expIdx}.title`}
                        value={exp.title}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                        placeholder="Job Title"
                      />
                    </span>
                    <span className="text-neutral-700 font-medium"> | </span>
                    <span className="font-semibold text-neutral-850">
                      <CanvasText
                        id={`experiences.${expIdx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                        placeholder="Company"
                      />
                    </span>
                    <span className="text-neutral-500 font-normal">, </span>
                    <CanvasText
                      id={`experiences.${expIdx}.location`}
                      value={exp.location}
                      onChange={(val) => updateFieldByPath(`experiences.${expIdx}.location`, val)}
                      placeholder="Location"
                      className="text-neutral-500 font-normal"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-neutral-600">
                    <CanvasText
                      id={`experiences.${expIdx}.dates`}
                      value={`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`}
                      onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                      placeholder="Dates"
                    />
                  </span>
                </div>

                {/* Bullets with metric-first syntax */}
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-800">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="group/bullet relative leading-snug">
                      <CanvasText
                        id={`experiences.${expIdx}.bullets.${bIdx}`}
                        value={bullet}
                        onChange={(val) => updateExpBullet(expIdx, bIdx, val)}
                        placeholder="Describe quantifiable achievement..."
                        tag="span"
                      />
                      <button
                        type="button"
                        onClick={() => removeExpBullet(expIdx, bIdx)}
                        className="ml-1 opacity-0 group-hover/bullet:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer inline-flex items-center"
                        title="Delete Bullet"
                      >
                        <Trash2 size={10} />
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Add Bullet Button on Hover */}
                <div className="pl-4 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <button
                    type="button"
                    onClick={() => addExpBullet(expIdx)}
                    className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                  >
                    <Plus size={10} /> Add Bullet
                  </button>
                </div>

                {/* Delete Entire Role on Hover */}
                <button
                  type="button"
                  onClick={() => removeExperience(expIdx)}
                  className="absolute -left-5 top-0 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                  title="Delete Role"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <CanvasAddSectionDivider />

      {/* ── PROJECTS SECTION ── */}
      {projects && projects.length > 0 && (
        <section className="space-y-2">
          <CanvasSectionHeader
            title="Projects"
            onAddEntry={addProject}
            style={{ borderColor: accent }}
          />
          <div className="space-y-2 text-xs">
            {projects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="group relative space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <div>
                    <CanvasText
                      id={`projects.${pIdx}.name`}
                      value={proj.name}
                      onChange={(val) => updateFieldByPath(`projects.${pIdx}.name`, val)}
                      placeholder="Project Name"
                    />
                    <span className="font-normal text-neutral-600 italic"> | </span>
                    <CanvasText
                      id={`projects.${pIdx}.techStack`}
                      value={proj.techStack?.join(", ") || ""}
                      onChange={(val) =>
                        updateFieldByPath(
                          `projects.${pIdx}.techStack`,
                          val.split(",").map((s) => s.trim())
                        )
                      }
                      placeholder="Tech Stack"
                      className="font-normal text-neutral-600 italic"
                    />
                  </div>
                  {(proj.link || proj.github) && (
                    <CanvasText
                      id={`projects.${pIdx}.link`}
                      value={proj.link || proj.github || ""}
                      onChange={(val) => updateFieldByPath(`projects.${pIdx}.link`, val)}
                      placeholder="https://link.com"
                      className="text-[11px] text-neutral-700 underline font-mono"
                    />
                  )}
                </div>

                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-800">
                  {proj.description?.map((desc, dIdx) => (
                    <li key={dIdx} className="leading-snug">
                      <CanvasText
                        id={`projects.${pIdx}.description.${dIdx}`}
                        value={desc}
                        onChange={(val) => {
                          const updated = [...proj.description];
                          updated[dIdx] = val;
                          updateFieldByPath(`projects.${pIdx}.description`, updated);
                        }}
                        placeholder="Project description..."
                        tag="span"
                      />
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => removeProject(pIdx)}
                  className="absolute -left-5 top-0 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <CanvasAddSectionDivider />

      {/* ── TECHNICAL SKILLS ── */}
      {skills.length > 0 && (
        <section className="space-y-1">
          <CanvasSectionHeader
            title="Technical Skills"
            onAddEntry={addSkillCategory}
            style={{ borderColor: accent }}
          />
          <div className="space-y-1 text-xs text-neutral-800">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx} className="group relative">
                <strong className="font-bold text-neutral-950">
                  <CanvasText
                    id={`skills.${idx}.name`}
                    value={cat.name}
                    onChange={(val) => updateFieldByPath(`skills.${idx}.name`, val)}
                    placeholder="Category"
                  />
                  :{" "}
                </strong>
                <CanvasText
                  id={`skills.${idx}.items`}
                  value={cat.items.join(", ")}
                  onChange={(val) =>
                    updateFieldByPath(
                      `skills.${idx}.items`,
                      val.split(",").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  placeholder="TypeScript, React, Python..."
                  className="text-neutral-750"
                />

                <button
                  type="button"
                  onClick={() => removeSkillCategory(idx)}
                  className="ml-2 opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer inline-flex items-center"
                  title="Delete Skill Group"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
