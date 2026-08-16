import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Quote, CheckCircle2, Trash2 } from "lucide-react";
import { CanvasText } from "../editor/CanvasText";
import { CanvasPhoto } from "../editor/CanvasPhoto";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { CanvasAddSectionDivider } from "../editor/CanvasAddSectionDivider";
import { useResumeEditor } from "../context/ResumeEditorContext";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const SoftBannerTemplate: React.FC<TemplateProps> = () => {
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

  const { personalInfo, summary, experiences, education, skills, certifications, languages } = data;
  const accent = theme.accentColor || "#3b82f6";
  const bannerBg = "#dbeafe"; // Light soft pastel blue

  return (
    <div className="bg-white text-neutral-900 min-h-[1050px] leading-relaxed text-left font-sans">
      {/* ── TOP SOFT PASTEL BANNER ── */}
      <header className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6" style={{ backgroundColor: bannerBg }}>
        {/* Left: Avatar Photo */}
        <CanvasPhoto size={115} shape="circle" />

        {/* Center/Right: Name, Title & Contact Information */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-neutral-900">
            <CanvasText
              id="personalInfo.fullName"
              value={personalInfo.fullName}
              onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
              placeholder="EMILY CARTER"
            />
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-600">
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="Registered Nurse & Clinical Care Specialist"
            />
          </p>
        </div>

        {/* Right Contact Details */}
        <div className="text-xs text-neutral-700 font-medium space-y-1.5 shrink-0 text-left">
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
            <Mail size={12} style={{ color: accent }} />
            <CanvasText
              id="personalInfo.email"
              value={personalInfo.email}
              onChange={(val) => updateFieldByPath("personalInfo.email", val)}
              placeholder="Email"
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
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <MapPin size={12} style={{ color: accent }} />
            <CanvasText
              id="personalInfo.location"
              value={personalInfo.location}
              onChange={(val) => updateFieldByPath("personalInfo.location", val)}
              placeholder="Location"
            />
          </div>
        </div>
      </header>

      {/* ── 2-COLUMN BODY ── */}
      <div className="p-8 md:p-10 grid grid-cols-12 gap-8">
        {/* Left Column (40%) */}
        <div className="col-span-5 space-y-6">
          {/* Career Overview with Quote */}
          <section className="space-y-2">
            <CanvasSectionHeader title="Career Overview" className="border-b-2" style={{ borderColor: bannerBg }} />
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
              <Quote size={18} className="text-blue-400 shrink-0 mt-0.5 fill-current opacity-70" />
              <CanvasText
                id="summary"
                value={summary}
                onChange={(val) => updateFieldByPath("summary", val)}
                placeholder="Career overview statement..."
                tag="p"
                multiline
                className="text-xs text-neutral-750 leading-relaxed text-justify"
              />
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section className="space-y-2.5">
              <CanvasSectionHeader
                title="Skills"
                onAddEntry={() => addSkillItem(0, "New Skill")}
                className="border-b-2"
                style={{ borderColor: bannerBg }}
              />
              <div className="space-y-1.5 text-xs text-neutral-800">
                {skills.flatMap((s, catIdx) =>
                  s.items.map((skill, itemIdx) => (
                    <div key={`${catIdx}-${itemIdx}`} className="group relative flex items-center justify-between font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500 font-bold">✦</span>
                        <CanvasText
                          id={`skills.${catIdx}.${itemIdx}`}
                          value={skill}
                          onChange={(val) => {
                            const updated = [...s.items];
                            updated[itemIdx] = val;
                            updateFieldByPath(`skills.${catIdx}.items`, updated);
                          }}
                          placeholder="Skill"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkillItem(catIdx, itemIdx)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 p-0.5 transition-opacity print:hidden cursor-pointer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="space-y-2.5">
              <CanvasSectionHeader title="Languages" className="border-b-2" style={{ borderColor: bannerBg }} />
              <div className="space-y-2.5 text-xs">
                {languages.map((lang, idx) => {
                  const rating = lang.rating || 5;
                  return (
                    <div key={lang.id || idx} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-neutral-900">
                        <CanvasText
                          id={`languages.${idx}.language`}
                          value={lang.language}
                          onChange={(val) => updateFieldByPath(`languages.${idx}.language`, val)}
                          placeholder="Language"
                        />
                        <span className="text-[11px] text-neutral-500 font-normal">{rating * 2}/10</span>
                      </div>
                      {/* 10-Dot Progress Indicator */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                          <button
                            key={dot}
                            type="button"
                            onClick={() => updateFieldByPath(`languages.${idx}.rating`, Math.round(dot / 2))}
                            className={`h-2 w-2 rounded-full cursor-pointer transition-all ${
                              dot <= rating * 2 ? "bg-blue-500" : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="space-y-2">
              <CanvasSectionHeader title="Certifications" className="border-b-2" style={{ borderColor: bannerBg }} />
              <ul className="space-y-1.5 text-xs text-neutral-800">
                {certifications.map((c, idx) => (
                  <li key={c.id || idx} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">
                        <CanvasText
                          id={`certifications.${idx}.name`}
                          value={c.name}
                          onChange={(val) => updateFieldByPath(`certifications.${idx}.name`, val)}
                          placeholder="Certificate Name"
                        />
                      </span>
                      {c.issuer && (
                        <span className="text-neutral-500 text-[11px]">
                          {" "}
                          (
                          <CanvasText
                            id={`certifications.${idx}.issuer`}
                            value={c.issuer}
                            onChange={(val) => updateFieldByPath(`certifications.${idx}.issuer`, val)}
                            placeholder="Issuer"
                          />
                          )
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (60%) */}
        <div className="col-span-7 space-y-6">
          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="space-y-4">
              <CanvasSectionHeader
                title="Work Experience"
                onAddEntry={addExperience}
                className="border-b-2"
                style={{ borderColor: bannerBg }}
              />
              <div className="space-y-4">
                {experiences.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="group relative space-y-1 text-xs">
                    <div className="font-extrabold text-neutral-950 text-sm">
                      <CanvasText
                        id={`experiences.${expIdx}.title`}
                        value={exp.title}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="text-neutral-600 font-semibold">
                      <CanvasText
                        id={`experiences.${expIdx}.company`}
                        value={exp.company}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                        placeholder="Company"
                      />
                      {" • "}
                      <CanvasText
                        id={`experiences.${expIdx}.location`}
                        value={exp.location}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.location`, val)}
                        placeholder="Location"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium italic">
                      <CanvasText
                        id={`experiences.${expIdx}.dates`}
                        value={`${exp.startDate} – ${exp.current ? "Present" : exp.endDate}`}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                        placeholder="Dates"
                      />
                    </div>
                    <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-neutral-750">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          <CanvasText
                            id={`experiences.${expIdx}.bullets.${bIdx}`}
                            value={bullet}
                            onChange={(val) => {
                              const updated = [...exp.bullets];
                              updated[bIdx] = val;
                              updateFieldByPath(`experiences.${expIdx}.bullets`, updated);
                            }}
                            placeholder="Describe experience..."
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

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-3">
              <CanvasSectionHeader
                title="Education"
                onAddEntry={addEducation}
                className="border-b-2"
                style={{ borderColor: bannerBg }}
              />
              <div className="space-y-2.5 text-xs">
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
                        value={`${edu.institution} • ${edu.location}`}
                        onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                        placeholder="Institution"
                      />
                    </div>
                    <div className="text-[11px] text-neutral-500">
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
                      <Trash2 size={12} />
                    </button>
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
