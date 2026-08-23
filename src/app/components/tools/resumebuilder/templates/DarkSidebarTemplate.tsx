import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Plus, Trash2 } from "lucide-react";
import { CanvasText } from "../editor/CanvasText";
import { CanvasPhoto } from "../editor/CanvasPhoto";
import { CanvasSectionHeader } from "../editor/CanvasSectionHeader";
import { CanvasAddSectionDivider } from "../editor/CanvasAddSectionDivider";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { DENSITY_CONFIG } from "../themeTokens";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const DarkSidebarTemplate: React.FC<TemplateProps> = () => {
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
    addSkillItem,
    removeSkillItem,
    addReference,
    removeReference,
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, references } = data;
  const accent = theme.accentColor || "#1e3a8a";
  const sidebarBg = theme.sidebarColor || "#2c2d30"; // Dark Charcoal
  const density = DENSITY_CONFIG[theme.density || "standard"];

  return (
    <div className={`grid grid-cols-12 min-h-[1050px] bg-white text-neutral-900 overflow-hidden shadow-sm font-[inherit] ${density.lineHeight} ${density.bodyFontSize}`}>
      {/* ── LEFT DARK SIDEBAR (35-40% width) ── */}
      <aside
        className="col-span-4 p-6 text-white flex flex-col justify-between space-y-6"
        style={{ backgroundColor: sidebarBg }}
      >
        <div className="space-y-5">
          {/* Profile Photo (Click to replace/remove) */}
          <div className="flex justify-center pt-2">
            <CanvasPhoto size={105} shape="circle" />
          </div>

          {/* Name & Title in Sidebar */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black uppercase tracking-wider text-white leading-tight">
              <CanvasText
                id="personalInfo.fullName"
                value={personalInfo.fullName}
                onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
                placeholder="YOUR NAME"
                className="text-white"
              />
            </h1>
            <p className="text-xs font-medium text-neutral-300 tracking-wide">
              <CanvasText
                id="personalInfo.title"
                value={personalInfo.title}
                onChange={(val) => updateFieldByPath("personalInfo.title", val)}
                placeholder="Accounting Executive"
                className="text-neutral-300"
              />
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 pb-1 border-b border-white/10">
              CONTACT
            </h2>
            <div className="space-y-2 text-[10.5px] text-neutral-200">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={10} />
                </div>
                <CanvasText
                  id="personalInfo.phone"
                  value={personalInfo.phone}
                  onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
                  placeholder="Phone"
                  className="text-neutral-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Mail size={10} />
                </div>
                <CanvasText
                  id="personalInfo.email"
                  value={personalInfo.email}
                  onChange={(val) => updateFieldByPath("personalInfo.email", val)}
                  placeholder="Email"
                  className="text-neutral-200"
                />
              </div>

              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Globe size={10} />
                  </div>
                  <CanvasText
                    id="personalInfo.website"
                    value={personalInfo.website}
                    onChange={(val) => updateFieldByPath("personalInfo.website", val)}
                    placeholder="Website"
                    className="text-neutral-200"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MapPin size={10} />
                </div>
                <CanvasText
                  id="personalInfo.location"
                  value={personalInfo.location}
                  onChange={(val) => updateFieldByPath("personalInfo.location", val)}
                  placeholder="Address / City"
                  className="text-neutral-200"
                />
              </div>
            </div>
          </div>

          {/* Education in Sidebar */}
          {education.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-white/20">
              <CanvasSectionHeader
                title="EDUCATION"
                onAddEntry={addEducation}
                className="border-white/10 text-neutral-300"
              />
              <div className="space-y-2 text-[10.5px]">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="group relative space-y-0.5">
                    <div className="font-bold text-white leading-tight">
                      <CanvasText
                        id={`education.${idx}.degree`}
                        value={edu.degree}
                        onChange={(val) => updateFieldByPath(`education.${idx}.degree`, val)}
                        placeholder="Degree Title"
                        className="text-white"
                      />
                    </div>
                    <div className="text-neutral-300">
                      <CanvasText
                        id={`education.${idx}.institution`}
                        value={edu.institution}
                        onChange={(val) => updateFieldByPath(`education.${idx}.institution`, val)}
                        placeholder="University"
                        className="text-neutral-300"
                      />
                    </div>
                    <div className="text-neutral-400 text-[9.5px]">
                      <CanvasText
                        id={`education.${idx}.dates`}
                        value={`${edu.startDate} - ${edu.endDate}`}
                        onChange={(val) => updateFieldByPath(`education.${idx}.endDate`, val)}
                        placeholder="2016 - 2020"
                        className="text-neutral-400"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeEducation(idx)}
                      className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-400 p-0.5 transition-opacity print:hidden cursor-pointer"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/20">
              <CanvasSectionHeader
                title="SKILLS"
                onAddEntry={() => addSkillItem(0, "New Skill")}
                className="border-white/10 text-neutral-300"
              />
              <div className="space-y-1 text-[10.5px]">
                {skills.flatMap((s, catIdx) =>
                  s.items.map((item, itemIdx) => (
                    <div
                      key={`${catIdx}-${itemIdx}`}
                      className="group relative pb-1 border-b border-white/10 text-neutral-200 font-medium flex justify-between items-center"
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
                        className="text-neutral-200"
                      />
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
            </div>
          )}
        </div>
      </aside>

      {/* ── RIGHT MAIN WHITE CONTENT (60-65% width) ── */}
      <main className="col-span-8 p-8 space-y-6 text-neutral-900">
        {/* Career Summary */}
        <section className="space-y-2">
          <CanvasSectionHeader title="Career Summary" className="border-neutral-300 text-neutral-900" />
          <CanvasText
            id="summary"
            value={summary}
            onChange={(val) => updateFieldByPath("summary", val)}
            placeholder="Write your career overview..."
            tag="p"
            multiline
            className="text-xs text-neutral-700 leading-relaxed text-justify"
          />
        </section>

        {/* Professional Experience with Vertical Timeline */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <CanvasSectionHeader
              title="Professional Experience"
              onAddEntry={addExperience}
              className="border-neutral-300 text-neutral-900"
            />

            <div className="relative pl-4 space-y-5 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-neutral-300">
              {experiences.map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="group relative space-y-1 text-xs">
                  {/* Timeline Bullet Node */}
                  <div className="absolute -left-[17.5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-neutral-700 bg-white" />

                  {/* Header: Title & Company + Date */}
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-extrabold text-neutral-950 text-sm">
                        <CanvasText
                          id={`experiences.${expIdx}.title`}
                          value={exp.title}
                          onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                          placeholder="Job Title"
                        />
                      </span>
                      <div className="text-[11px] font-semibold text-neutral-600">
                        <CanvasText
                          id={`experiences.${expIdx}.company`}
                          value={exp.company}
                          onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="text-[10.5px] font-medium text-neutral-500 italic">
                      <CanvasText
                        id={`experiences.${expIdx}.dates`}
                        value={`${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`}
                        onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                        placeholder="Dates"
                      />
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-1 pl-1 text-xs text-neutral-750">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="group/bullet relative flex items-start gap-1.5 leading-snug">
                        <span className="text-neutral-400 font-bold">•</span>
                        <CanvasText
                          id={`experiences.${expIdx}.bullets.${bIdx}`}
                          value={bullet}
                          onChange={(val) => updateExpBullet(expIdx, bIdx, val)}
                          placeholder="Describe achievement..."
                          tag="span"
                          className="flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeExpBullet(expIdx, bIdx)}
                          className="opacity-0 group-hover/bullet:opacity-100 text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                        >
                          <Trash2 size={10} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Add bullet on hover */}
                  <div className="pl-3 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                    <button
                      type="button"
                      onClick={() => addExpBullet(expIdx)}
                      className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                    >
                      <Plus size={10} /> Add Bullet
                    </button>
                  </div>

                  {/* Delete role button */}
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

        {/* References Section (2 Column) */}
        {references && references.length > 0 && (
          <section className="space-y-2 pt-2 border-t border-neutral-300">
            <CanvasSectionHeader
              title="References"
              onAddEntry={addReference}
              className="border-neutral-300 text-neutral-900"
            />
            <div className="grid grid-cols-2 gap-4 text-xs">
              {references.map((ref, idx) => (
                <div key={ref.id || idx} className="group relative space-y-0.5">
                  <div className="font-bold text-neutral-950">
                    <CanvasText
                      id={`references.${idx}.name`}
                      value={ref.name}
                      onChange={(val) => updateFieldByPath(`references.${idx}.name`, val)}
                      placeholder="Referee Name"
                    />
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    <CanvasText
                      id={`references.${idx}.role`}
                      value={`${ref.company} / ${ref.position}`}
                      onChange={(val) => updateFieldByPath(`references.${idx}.company`, val)}
                      placeholder="Company / Role"
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Phone:{" "}
                    <CanvasText
                      id={`references.${idx}.phone`}
                      value={ref.phone}
                      onChange={(val) => updateFieldByPath(`references.${idx}.phone`, val)}
                      placeholder="+123-456-7890"
                    />
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    Email:{" "}
                    <CanvasText
                      id={`references.${idx}.email`}
                      value={ref.email}
                      onChange={(val) => updateFieldByPath(`references.${idx}.email`, val)}
                      placeholder="email@domain.com"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeReference(idx)}
                    className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 text-red-500 p-0.5 transition-opacity print:hidden cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
