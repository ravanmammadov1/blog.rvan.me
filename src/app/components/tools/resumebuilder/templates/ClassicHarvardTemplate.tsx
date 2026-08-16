import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { CanvasText } from "../editor/CanvasText";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { CanvasAddSectionDivider } from "../editor/CanvasAddSectionDivider";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { Trash2 } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const ClassicHarvardTemplate: React.FC<TemplateProps> = () => {
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
    addSkillCategory,
    removeSkillCategory,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, projects, certifications } = data;
  const accent = theme.accentColor || "#111827";

  return (
    <div className="p-8 md:p-10 text-neutral-950 bg-white min-h-[1050px] leading-relaxed text-left space-y-4 font-serif">
      {/* Centered Classic Harvard Header */}
      <header className="text-center pb-2 border-b-2 border-neutral-900 space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-neutral-950">
          <CanvasText
            id="personalInfo.fullName"
            value={personalInfo.fullName}
            onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
            placeholder="YOUR FULL NAME"
          />
        </h1>
        {personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-700 tracking-wider uppercase font-sans">
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="Professional Title"
            />
          </p>
        )}
        <div className="text-[11px] text-neutral-700 font-medium font-sans flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          <CanvasText
            id="personalInfo.phone"
            value={personalInfo.phone}
            onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
            placeholder="Phone"
          />
          <span>•</span>
          <CanvasText
            id="personalInfo.email"
            value={personalInfo.email}
            onChange={(val) => updateFieldByPath("personalInfo.email", val)}
            placeholder="Email"
          />
          <span>•</span>
          <CanvasText
            id="personalInfo.location"
            value={personalInfo.location}
            onChange={(val) => updateFieldByPath("personalInfo.location", val)}
            placeholder="Location"
          />
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="space-y-1">
          <CanvasSectionHeader title="Professional Summary" className="border-neutral-400" />
          <CanvasText
            id="summary"
            value={summary}
            onChange={(val) => updateFieldByPath("summary", val)}
            placeholder="Write summary..."
            tag="p"
            multiline
            className="text-xs text-neutral-850 leading-normal text-justify"
          />
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <CanvasSectionHeader
            title="Education"
            onAddEntry={addEducation}
            className="border-neutral-400"
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
                      placeholder="University"
                    />
                    <span className="font-normal text-neutral-700">, </span>
                    <CanvasText
                      id={`education.${idx}.location`}
                      value={edu.location}
                      onChange={(val) => updateFieldByPath(`education.${idx}.location`, val)}
                      placeholder="Location"
                      className="font-normal text-neutral-700"
                    />
                  </span>
                  <span className="text-[11px] font-normal text-neutral-700">
                    <CanvasText
                      id={`education.${idx}.dates`}
                      value={`${edu.startDate} – ${edu.endDate}`}
                      onChange={(val) => updateFieldByPath(`education.${idx}.endDate`, val)}
                      placeholder="Dates"
                    />
                  </span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-[11.5px]">
                  <span>
                    <CanvasText
                      id={`education.${idx}.degree`}
                      value={`${edu.degree} in ${edu.field}`}
                      onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                      placeholder="Degree"
                    />
                  </span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>

                <button
                  type="button"
                  onClick={() => removeEducation(idx)}
                  className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <CanvasAddSectionDivider />

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="space-y-2">
          <CanvasSectionHeader
            title="Experience"
            onAddEntry={addExperience}
            className="border-neutral-400"
          />
          <div className="space-y-3 text-xs">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="group relative space-y-1">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <div>
                    <span className="text-sm">
                      <CanvasText
                        id={`experiences.${expIdx}.title`}
                        value={exp.title}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                        placeholder="Title"
                      />
                    </span>
                    <span className="font-normal text-neutral-700">, </span>
                    <span className="font-semibold text-neutral-850">
                      <CanvasText
                        id={`experiences.${expIdx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                        placeholder="Company"
                      />
                    </span>
                  </div>
                  <span className="text-[11px] font-normal text-neutral-700">
                    <CanvasText
                      id={`experiences.${expIdx}.dates`}
                      value={`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`}
                      onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                      placeholder="Dates"
                    />
                  </span>
                </div>

                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-850 font-sans">
                  {exp.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      <CanvasText
                        id={`experiences.${expIdx}.bullets.${bIdx}`}
                        value={b}
                        onChange={(val) => updateExpBullet(expIdx, bIdx, val)}
                        placeholder="Bullet..."
                        tag="span"
                      />
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => removeExperience(expIdx)}
                  className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <CanvasAddSectionDivider />

      {/* Skills */}
      {skills.length > 0 && (
        <section className="space-y-1">
          <CanvasSectionHeader
            title="Skills & Interests"
            onAddEntry={addSkillCategory}
            className="border-neutral-400"
          />
          <div className="space-y-1 text-xs text-neutral-850 font-sans">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx}>
                <strong>{cat.name}: </strong>
                <span>{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
