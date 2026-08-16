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

export const ModerncvTemplate: React.FC<TemplateProps> = () => {
  const {
    data,
    theme,
    updateFieldByPath,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkillCategory,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, certifications, languages } = data;
  const accent = theme.accentColor || "#1e3a8a";

  return (
    <div className="p-8 md:p-12 text-neutral-900 bg-white min-h-[1050px] leading-relaxed text-left space-y-6 font-sans">
      {/* ── MODERNCV HEADER ── */}
      <header className="flex justify-between items-end border-b-2 pb-4" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 uppercase">
            <CanvasText
              id="personalInfo.fullName"
              value={personalInfo.fullName}
              onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
              placeholder="YOUR FULL NAME"
            />
          </h1>
          <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: accent }}>
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="Professional Role"
            />
          </p>
        </div>

        {/* Contact Metadata Block */}
        <div className="text-[11px] text-neutral-650 space-y-1 text-right font-medium">
          <CanvasText
            id="personalInfo.location"
            value={personalInfo.location}
            onChange={(val) => updateFieldByPath("personalInfo.location", val)}
            placeholder="Location"
            tag="div"
          />
          <CanvasText
            id="personalInfo.phone"
            value={personalInfo.phone}
            onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
            placeholder="Phone"
            tag="div"
          />
          <CanvasText
            id="personalInfo.email"
            value={personalInfo.email}
            onChange={(val) => updateFieldByPath("personalInfo.email", val)}
            placeholder="Email"
            tag="div"
            className="text-neutral-900 font-semibold"
          />
          {personalInfo.linkedin && (
            <CanvasText
              id="personalInfo.linkedin"
              value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
              onChange={(val) => updateFieldByPath("personalInfo.linkedin", val)}
              placeholder="LinkedIn"
              tag="div"
            />
          )}
        </div>
      </header>

      {/* ── CAREER SUMMARY ── */}
      {summary && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              Summary
            </h2>
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200">
            <CanvasText
              id="summary"
              value={summary}
              onChange={(val) => updateFieldByPath("summary", val)}
              placeholder="Write summary..."
              tag="p"
              multiline
              className="text-xs text-neutral-750 leading-relaxed text-justify"
            />
          </div>
        </section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {experiences.length > 0 && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <CanvasSectionHeader
              title="Experience"
              onAddEntry={addExperience}
              style={{ color: accent, border: "none" }}
            />
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-4">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="group relative space-y-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-extrabold text-neutral-950 text-sm">
                    <CanvasText
                      id={`experiences.${expIdx}.title`}
                      value={exp.title}
                      onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                      placeholder="Job Title"
                    />
                  </span>
                  <span className="text-[10.5px] font-mono text-neutral-500">
                    <CanvasText
                      id={`experiences.${expIdx}.dates`}
                      value={`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`}
                      onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                      placeholder="Dates"
                    />
                  </span>
                </div>
                <div className="font-semibold text-xs" style={{ color: accent }}>
                  <CanvasText
                    id={`experiences.${expIdx}.company`}
                    value={`${exp.company} • ${exp.location}`}
                    onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                    placeholder="Company"
                  />
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-750">
                  {exp.bullets.filter(Boolean).map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      <CanvasText
                        id={`experiences.${expIdx}.bullets.${bIdx}`}
                        value={b}
                        onChange={(val) => {
                          const updated = [...exp.bullets];
                          updated[bIdx] = val;
                          updateFieldByPath(`experiences.${expIdx}.bullets`, updated);
                        }}
                        placeholder="Bullet point..."
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

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <CanvasSectionHeader
              title="Education"
              onAddEntry={addEducation}
              style={{ color: accent, border: "none" }}
            />
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="group relative">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <CanvasText
                    id={`education.${idx}.degree`}
                    value={`${edu.degree} in ${edu.field}`}
                    onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                    placeholder="Degree"
                  />
                  <span className="text-[10.5px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-neutral-600">{edu.institution} {edu.location && `• ${edu.location}`}</div>

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

      {/* ── SKILLS ── */}
      {skills.length > 0 && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              Skills
            </h2>
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-1.5 text-xs">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx}>
                <span className="font-bold text-neutral-900">{cat.name}: </span>
                <span className="text-neutral-700">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
