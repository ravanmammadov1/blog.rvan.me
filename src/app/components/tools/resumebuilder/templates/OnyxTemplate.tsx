import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Trash2 } from "lucide-react";
import { CanvasText } from "../editor/CanvasText";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { useResumeEditor } from "../context/ResumeEditorContext";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const OnyxTemplate: React.FC<TemplateProps> = () => {
  const {
    data,
    theme,
    updateFieldByPath,
    addExperience,
    removeExperience,
    addEducation,
    removeEducation,
    addSkillItem,
    removeSkillItem,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills } = data;
  const accent = theme.accentColor || "#1e3a8a";

  return (
    <div className="text-neutral-900 bg-white min-h-[1050px] leading-relaxed text-left font-sans">
      {/* ── ONYX HEADER BANNER ── */}
      <header className="p-8 text-white space-y-3" style={{ backgroundColor: accent }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              <CanvasText
                id="personalInfo.fullName"
                value={personalInfo.fullName}
                onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
                placeholder="YOUR NAME"
                className="text-white"
              />
            </h1>
            <p className="text-sm font-medium text-white/90 tracking-wide mt-0.5">
              <CanvasText
                id="personalInfo.title"
                value={personalInfo.title}
                onChange={(val) => updateFieldByPath("personalInfo.title", val)}
                placeholder="Job Title / Role"
                className="text-white/90"
              />
            </p>
          </div>

          {/* Contact Badges */}
          <div className="flex flex-wrap gap-2 text-xs text-white/90 font-mono">
            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
              <Mail size={11} />
              <CanvasText
                id="personalInfo.email"
                value={personalInfo.email}
                onChange={(val) => updateFieldByPath("personalInfo.email", val)}
                placeholder="Email"
                className="text-white"
              />
            </span>

            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
              <Phone size={11} />
              <CanvasText
                id="personalInfo.phone"
                value={personalInfo.phone}
                onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
                placeholder="Phone"
                className="text-white"
              />
            </span>

            <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
              <MapPin size={11} />
              <CanvasText
                id="personalInfo.location"
                value={personalInfo.location}
                onChange={(val) => updateFieldByPath("personalInfo.location", val)}
                placeholder="Location"
                className="text-white"
              />
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ── */}
      <div className="p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <section className="space-y-1.5">
            <CanvasSectionHeader title="About" style={{ borderColor: accent }} />
            <CanvasText
              id="summary"
              value={summary}
              onChange={(val) => updateFieldByPath("summary", val)}
              placeholder="Summary..."
              tag="p"
              multiline
              className="text-xs text-neutral-700 leading-relaxed text-justify"
            />
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <CanvasSectionHeader
              title="Experience"
              onAddEntry={addExperience}
              style={{ borderColor: accent }}
            />
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="group relative space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-sm text-neutral-950">
                      <CanvasText
                        id={`experiences.${idx}.title`}
                        value={exp.title}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.title`, val)}
                        placeholder="Job Title"
                      />
                    </span>
                    <span className="text-[11px] font-mono text-neutral-500">
                      <CanvasText
                        id={`experiences.${idx}.dates`}
                        value={`${exp.startDate} — ${exp.current ? "Present" : exp.endDate}`}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.startDate`, val)}
                        placeholder="Dates"
                      />
                    </span>
                  </div>
                  <div className="font-bold text-xs" style={{ color: accent }}>
                    <CanvasText
                      id={`experiences.${idx}.company`}
                      value={`${exp.company} • ${exp.location}`}
                      onChange={(val) => updateFieldByPath(`experiences.${idx}.company`, val)}
                      placeholder="Company"
                    />
                  </div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-neutral-750">
                    {exp.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className="leading-snug">
                        <CanvasText
                          id={`experiences.${idx}.bullets.${bIdx}`}
                          value={b}
                          onChange={(val) => {
                            const updated = [...exp.bullets];
                            updated[bIdx] = val;
                            updateFieldByPath(`experiences.${idx}.bullets`, updated);
                          }}
                          placeholder="Bullet description..."
                          tag="span"
                        />
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2-Column Grid: Education & Skills */}
        <div className="grid grid-cols-12 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <div className="col-span-6 space-y-2">
              <CanvasSectionHeader
                title="Education"
                onAddEntry={addEducation}
                style={{ borderColor: accent }}
              />
              <div className="space-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="group relative">
                    <div className="font-bold text-neutral-950">
                      <CanvasText
                        id={`education.${idx}.degree`}
                        value={`${edu.degree} in ${edu.field}`}
                        onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                        placeholder="Degree"
                      />
                    </div>
                    <div className="text-neutral-600">
                      <CanvasText
                        id={`education.${idx}.institution`}
                        value={`${edu.institution} (${edu.startDate} – ${edu.endDate})`}
                        onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                        placeholder="Institution"
                      />
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
            </div>
          )}

          {/* Skills Badges */}
          {skills.length > 0 && (
            <div className="col-span-6 space-y-2">
              <CanvasSectionHeader
                title="Skills & Stack"
                onAddEntry={() => addSkillItem(0, "New Skill")}
                style={{ borderColor: accent }}
              />
              <div className="flex flex-wrap gap-1.5">
                {skills.flatMap((s, catIdx) =>
                  s.items.map((item, itemIdx) => (
                    <span
                      key={`${catIdx}-${itemIdx}`}
                      className="group/skill relative inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-neutral-100 border border-neutral-300 text-neutral-850"
                    >
                      <CanvasText
                        id={`skills.${catIdx}.${itemIdx}`}
                        value={item}
                        onChange={(val) => {
                          const updated = [...s.items];
                          updated[itemIdx] = val;
                          updateFieldByPath(`skills.${catIdx}.items`, updated);
                        }}
                        placeholder="Skill"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillItem(catIdx, itemIdx)}
                        className="opacity-0 group-hover/skill:opacity-100 text-red-500 hover:text-red-700 transition-opacity print:hidden cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
