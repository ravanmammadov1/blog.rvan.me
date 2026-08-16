import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Trash2 } from "lucide-react";
import { CanvasText } from "../editor/CanvasText";
import { CanvasPhoto } from "../editor/CanvasPhoto";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { useResumeEditor } from "../context/ResumeEditorContext";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const LeafishTemplate: React.FC<TemplateProps> = () => {
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

  const { personalInfo, summary, experiences, education, skills, languages, projects } = data;
  const accent = theme.accentColor || "#059669"; // Emerald

  return (
    <div className="grid grid-cols-12 min-h-[1050px] bg-white text-neutral-900 overflow-hidden text-left font-sans">
      {/* ── LEFT SIDEBAR (35%) ── */}
      <aside className="col-span-4 p-6 bg-neutral-50 border-r border-neutral-200 space-y-6">
        {/* Photo & Name */}
        <div className="text-center space-y-3">
          <CanvasPhoto size={96} shape="rounded" />

          <div>
            <h1 className="text-xl font-extrabold tracking-tight uppercase text-neutral-950">
              <CanvasText
                id="personalInfo.fullName"
                value={personalInfo.fullName}
                onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
                placeholder="YOUR NAME"
              />
            </h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>
              <CanvasText
                id="personalInfo.title"
                value={personalInfo.title}
                onChange={(val) => updateFieldByPath("personalInfo.title", val)}
                placeholder="Target Position"
              />
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-neutral-700">
          <CanvasSectionHeader title="Contact" className="border-neutral-300" />
          <div className="flex items-center gap-2">
            <Mail size={12} style={{ color: accent }} />
            <CanvasText
              id="personalInfo.email"
              value={personalInfo.email}
              onChange={(val) => updateFieldByPath("personalInfo.email", val)}
              placeholder="Email"
              className="truncate"
            />
          </div>

          <div className="flex items-center gap-2">
            <Phone size={12} style={{ color: accent }} />
            <CanvasText
              id="personalInfo.phone"
              value={personalInfo.phone}
              onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
              placeholder="Phone"
            />
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: accent }} />
            <CanvasText
              id="personalInfo.location"
              value={personalInfo.location}
              onChange={(val) => updateFieldByPath("personalInfo.location", val)}
              placeholder="Location"
            />
          </div>

          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin size={12} style={{ color: accent }} />
              <CanvasText
                id="personalInfo.linkedin"
                value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                onChange={(val) => updateFieldByPath("personalInfo.linkedin", val)}
                placeholder="LinkedIn"
                className="truncate"
              />
            </div>
          )}
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2.5 text-xs">
            <CanvasSectionHeader
              title="Education"
              onAddEntry={addEducation}
              className="border-neutral-300"
            />
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="group relative space-y-0.5">
                <div className="font-bold text-neutral-950">
                  <CanvasText
                    id={`education.${idx}.degree`}
                    value={edu.degree}
                    onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                    placeholder="Degree"
                  />
                </div>
                <div className="text-neutral-600">
                  <CanvasText
                    id={`education.${idx}.institution`}
                    value={edu.institution}
                    onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                    placeholder="Institution"
                  />
                </div>
                <div className="text-[10px] text-neutral-500">
                  <CanvasText
                    id={`education.${idx}.dates`}
                    value={`${edu.startDate} – ${edu.endDate}`}
                    onChange={(val) => updateFieldByPath(`education.${idx}.endDate`, val)}
                    placeholder="Dates"
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
        )}

        {/* Skills List */}
        {skills.length > 0 && (
          <div className="space-y-2 text-xs">
            <CanvasSectionHeader
              title="Skills"
              onAddEntry={() => addSkillItem(0, "New Skill")}
              className="border-neutral-300"
            />
            <div className="flex flex-wrap gap-1">
              {skills.flatMap((s, catIdx) =>
                s.items.map((item, itemIdx) => (
                  <span
                    key={`${catIdx}-${itemIdx}`}
                    className="group/skill relative inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-neutral-300 text-[10.5px] font-medium text-neutral-800"
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
      </aside>

      {/* ── RIGHT CONTENT (65%) ── */}
      <main className="col-span-8 p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <section className="space-y-1.5">
            <CanvasSectionHeader title="Profile Overview" style={{ borderColor: accent }} />
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
          <section className="space-y-4">
            <CanvasSectionHeader
              title="Professional Experience"
              onAddEntry={addExperience}
              style={{ borderColor: accent }}
            />
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="group relative space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-neutral-950 text-sm">
                      <CanvasText
                        id={`experiences.${idx}.title`}
                        value={exp.title}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.title`, val)}
                        placeholder="Job Title"
                      />
                    </span>
                    <span className="text-[10.5px] font-mono text-neutral-500">
                      <CanvasText
                        id={`experiences.${idx}.dates`}
                        value={`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`}
                        onChange={(val) => updateFieldByPath(`experiences.${idx}.startDate`, val)}
                        placeholder="Dates"
                      />
                    </span>
                  </div>
                  <div className="font-semibold text-xs" style={{ color: accent }}>
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
                          placeholder="Bullet..."
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

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-3">
            <CanvasSectionHeader title="Key Projects" style={{ borderColor: accent }} />
            <div className="space-y-2 text-xs">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline font-bold text-neutral-950">
                    <CanvasText
                      id={`projects.${idx}.name`}
                      value={proj.name}
                      onChange={(val) => updateFieldByPath(`projects.${idx}.name`, val)}
                      placeholder="Project Name"
                    />
                  </div>
                  {proj.description?.map((d, dIdx) => (
                    <p key={dIdx} className="text-neutral-600 text-[11px] mt-0.5">
                      <CanvasText
                        id={`projects.${idx}.description.${dIdx}`}
                        value={d}
                        onChange={(val) => {
                          const updated = [...proj.description];
                          updated[dIdx] = val;
                          updateFieldByPath(`projects.${idx}.description`, updated);
                        }}
                        placeholder="Description..."
                      />
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
