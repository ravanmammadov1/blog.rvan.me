import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Calendar, Trophy, Star, Gem, Plus, Trash2 } from "lucide-react";
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

export const Modern2ColTemplate: React.FC<TemplateProps> = () => {
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
  } = useResumeEditor();

  const { personalInfo, summary, experiences, education, skills, strengths, languages } = data;
  const accent = theme.accentColor || "#0284c7";
  const density = DENSITY_CONFIG[theme.density || "standard"];

  const getStrengthIcon = (iconName?: string) => {
    switch (iconName) {
      case "star":
        return <Star size={16} style={{ color: accent }} className="shrink-0 mt-0.5 fill-current opacity-90" />;
      case "diamond":
        return <Gem size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />;
      case "trophy":
      default:
        return <Trophy size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className={`${density.containerPadding} ${density.sectionGap} ${density.lineHeight} ${density.bodyFontSize} text-neutral-900 bg-white min-h-[1050px] text-left font-[inherit]`}>
      {/* ── TOP HEADER (NAME, SUBTITLE, CONTACT & TOP-RIGHT PHOTO) ── */}
      <header className="flex justify-between items-start gap-6 border-b-2 border-neutral-900 pb-5">
        <div className="space-y-1.5 flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-neutral-950">
            <CanvasText
              id="personalInfo.fullName"
              value={personalInfo.fullName}
              onChange={(val) => updateFieldByPath("personalInfo.fullName", val)}
              placeholder="YOUR FULL NAME"
            />
          </h1>
          <p className="text-sm font-bold tracking-wide" style={{ color: accent }}>
            <CanvasText
              id="personalInfo.title"
              value={personalInfo.title}
              onChange={(val) => updateFieldByPath("personalInfo.title", val)}
              placeholder="Experienced Project Manager | IT | Leadership | Cost Management"
            />
          </p>

          {/* Contact Icons Bar */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium pt-2">
            <span className="flex items-center gap-1">
              <Phone size={12} style={{ color: accent }} />
              <CanvasText
                id="personalInfo.phone"
                value={personalInfo.phone}
                onChange={(val) => updateFieldByPath("personalInfo.phone", val)}
                placeholder="Phone"
              />
            </span>

            <span className="flex items-center gap-1">
              <Mail size={12} style={{ color: accent }} />
              <CanvasText
                id="personalInfo.email"
                value={personalInfo.email}
                onChange={(val) => updateFieldByPath("personalInfo.email", val)}
                placeholder="Email"
              />
            </span>

            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin size={12} style={{ color: accent }} />
                <CanvasText
                  id="personalInfo.linkedin"
                  value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                  onChange={(val) => updateFieldByPath("personalInfo.linkedin", val)}
                  placeholder="LinkedIn"
                />
              </span>
            )}

            <span className="flex items-center gap-1">
              <MapPin size={12} style={{ color: accent }} />
              <CanvasText
                id="personalInfo.location"
                value={personalInfo.location}
                onChange={(val) => updateFieldByPath("personalInfo.location", val)}
                placeholder="City, Country"
              />
            </span>
          </div>
        </div>

        {/* Top-Right Circular Photo */}
        <CanvasPhoto size={105} shape="circle" />
      </header>

      {/* ── 2-COLUMN ASYMMETRIC BODY ── */}
      <div className="grid grid-cols-12 gap-8">
        {/* ── LEFT COLUMN (60%): SUMMARY, EXPERIENCE, EDUCATION ── */}
        <div className="col-span-7 space-y-6">
          {/* Summary */}
          <section className="space-y-1.5">
            <CanvasSectionHeader title="SUMMARY" className="border-neutral-900" />
            <CanvasText
              id="summary"
              value={summary}
              onChange={(val) => updateFieldByPath("summary", val)}
              placeholder="Write summary..."
              tag="p"
              multiline
              className="text-xs text-neutral-700 leading-relaxed text-justify"
            />
          </section>

          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="space-y-4">
              <CanvasSectionHeader
                title="EXPERIENCE"
                onAddEntry={addExperience}
                className="border-neutral-900"
              />
              <div className="space-y-4">
                {experiences.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="group relative space-y-1.5 text-xs">
                    <div>
                      <div className="font-extrabold text-neutral-950 text-sm">
                        <CanvasText
                          id={`experiences.${expIdx}.title`}
                          value={exp.title}
                          onChange={(val) => updateFieldByPath(`experiences.${expIdx}.title`, val)}
                          placeholder="Job Title"
                        />
                      </div>
                      <div className="font-bold text-xs" style={{ color: accent }}>
                        <CanvasText
                          id={`experiences.${expIdx}.company`}
                          value={exp.company}
                          onChange={(val) => updateFieldByPath(`experiences.${expIdx}.company`, val)}
                          placeholder="Company"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[10.5px] text-neutral-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          <CanvasText
                            id={`experiences.${expIdx}.dates`}
                            value={`${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`}
                            onChange={(val) => updateFieldByPath(`experiences.${expIdx}.startDate`, val)}
                            placeholder="Dates"
                          />
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          <CanvasText
                            id={`experiences.${expIdx}.location`}
                            value={exp.location}
                            onChange={(val) => updateFieldByPath(`experiences.${expIdx}.location`, val)}
                            placeholder="Location"
                          />
                        </span>
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

                    {/* Add bullet button */}
                    <div className="pl-3 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                      <button
                        type="button"
                        onClick={() => addExpBullet(expIdx)}
                        className="text-[10px] font-mono text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                      >
                        <Plus size={10} /> Add Bullet
                      </button>
                    </div>

                    {/* Delete Role */}
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
            <section className="space-y-2">
              <CanvasSectionHeader
                title="EDUCATION"
                onAddEntry={addEducation}
                className="border-neutral-900"
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
                        value={`${edu.institution} (${edu.startDate} - ${edu.endDate})`}
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
            </section>
          )}
        </div>

        {/* ── RIGHT COLUMN (40%): SKILLS, STRENGTHS, LANGUAGES ── */}
        <div className="col-span-5 space-y-6">
          {/* Skills Badges Grid */}
          {skills.length > 0 && (
            <section className="space-y-2.5">
              <CanvasSectionHeader
                title="SKILLS"
                onAddEntry={() => addSkillItem(0, "New Skill")}
                className="border-neutral-900"
              />
              <div className="flex flex-wrap gap-1.5">
                {skills.flatMap((s, catIdx) =>
                  s.items.map((skill, skillIdx) => (
                    <span
                      key={`${catIdx}-${skillIdx}`}
                      className="group/skill relative inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-neutral-300 bg-neutral-50 text-[11px] font-bold text-neutral-850 shadow-sm"
                    >
                      <CanvasText
                        id={`skills.${catIdx}.${skillIdx}`}
                        value={skill}
                        onChange={(val) => {
                          const updated = [...s.items];
                          updated[skillIdx] = val;
                          updateFieldByPath(`skills.${catIdx}.items`, updated);
                        }}
                        placeholder="Skill"
                      />
                      <button
                        type="button"
                        onClick={() => removeSkillItem(catIdx, skillIdx)}
                        className="opacity-0 group-hover/skill:opacity-100 text-red-500 hover:text-red-700 transition-opacity print:hidden cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Key Strengths with Colored Icons */}
          {strengths && strengths.length > 0 && (
            <section className="space-y-3">
              <CanvasSectionHeader title="STRENGTHS" className="border-neutral-900" />
              <div className="space-y-3">
                {strengths.map((str, idx) => (
                  <div key={str.id || idx} className="flex items-start gap-2.5 text-xs">
                    {getStrengthIcon(str.icon)}
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-neutral-950">
                        <CanvasText
                          id={`strengths.${idx}.title`}
                          value={str.title}
                          onChange={(val) => updateFieldByPath(`strengths.${idx}.title`, val)}
                          placeholder="Strength Title"
                        />
                      </div>
                      <div className="text-[11px] text-neutral-600 leading-snug">
                        <CanvasText
                          id={`strengths.${idx}.description`}
                          value={str.description}
                          onChange={(val) => updateFieldByPath(`strengths.${idx}.description`, val)}
                          placeholder="Description..."
                          multiline
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages with 5-Dot Rating Scale */}
          {languages.length > 0 && (
            <section className="space-y-2.5">
              <CanvasSectionHeader title="LANGUAGES" className="border-neutral-900" />
              <div className="space-y-2 text-xs">
                {languages.map((lang, idx) => {
                  const rating = lang.rating || 5;
                  return (
                    <div key={lang.id || idx} className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">
                          <CanvasText
                            id={`languages.${idx}.language`}
                            value={lang.language}
                            onChange={(val) => updateFieldByPath(`languages.${idx}.language`, val)}
                            placeholder="Language"
                          />
                        </div>
                        <div className="text-[10px] text-neutral-500 font-medium">{lang.proficiency}</div>
                      </div>
                      {/* 5-Dot Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <button
                            key={dot}
                            type="button"
                            onClick={() => updateFieldByPath(`languages.${idx}.rating`, dot)}
                            className={`h-2.5 w-2.5 rounded-full transition-all cursor-pointer ${
                              dot <= rating ? "bg-sky-500 scale-110" : "bg-neutral-200 hover:bg-neutral-300"
                            }`}
                            style={dot <= rating ? { backgroundColor: accent } : {}}
                            title={`Set rating: ${dot}/5`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
