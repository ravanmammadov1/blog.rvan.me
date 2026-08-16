import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Onyx Template (Inspired by Reactive Resume Onyx)
 * Sleek modern header card, crisp badges, and modern grid cards.
 */
export const OnyxTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor || "#1e3a8a";

  const updateField = (section: keyof ResumeData, field: string, value: any) => {
    if (!onUpdate) return;
    onUpdate({
      ...data,
      [section]: {
        ...(data[section] as any),
        [field]: value,
      },
    });
  };

  return (
    <div className="text-neutral-900 bg-white min-h-[1050px] leading-relaxed text-left">
      {/* ── ONYX HEADER BANNER ── */}
      <header className="p-8 text-white space-y-3" style={{ backgroundColor: accent }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              <InlineEdit
                value={personalInfo.fullName}
                onChange={(val) => updateField("personalInfo", "fullName", val)}
                placeholder="YOUR NAME"
              />
            </h1>
            <p className="text-sm font-medium text-white/90 tracking-wide mt-0.5">
              <InlineEdit
                value={personalInfo.title}
                onChange={(val) => updateField("personalInfo", "title", val)}
                placeholder="Job Title / Role"
              />
            </p>
          </div>

          {/* Contact Badges */}
          <div className="flex flex-wrap gap-2 text-xs text-white/90 font-mono">
            {personalInfo.email && (
              <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                <Mail size={11} /> {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                <Phone size={11} /> {personalInfo.phone}
              </span>
            )}
            {personalInfo.location && (
              <span className="bg-black/25 px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-white/10">
                <MapPin size={11} /> {personalInfo.location}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── MAIN BODY ── */}
      <div className="p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 pb-1 border-b-2" style={{ borderColor: accent }}>
              About
            </h2>
            <InlineEdit
              value={summary}
              onChange={(val) => onUpdate && onUpdate({ ...data, summary: val })}
              placeholder="Summary..."
              tag="p"
              className="text-xs text-neutral-700 leading-relaxed text-justify"
            />
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 pb-1 border-b-2" style={{ borderColor: accent }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-sm text-neutral-950">{exp.title}</span>
                    <span className="text-[11px] font-mono text-neutral-500">{exp.startDate} — {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <div className="font-bold text-xs" style={{ color: accent }}>{exp.company} {exp.location && `• ${exp.location}`}</div>
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-neutral-750">
                    {exp.bullets.filter(Boolean).map((b, bIdx) => (
                      <li key={bIdx} className="leading-snug">{b}</li>
                    ))}
                  </ul>
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
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 pb-1 border-b-2" style={{ borderColor: accent }}>
                Education
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx}>
                    <div className="font-bold text-neutral-950">{edu.degree} in {edu.field}</div>
                    <div className="text-neutral-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Badges */}
          {skills.length > 0 && (
            <div className="col-span-6 space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 pb-1 border-b-2" style={{ borderColor: accent }}>
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.flatMap((s) => s.items).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-neutral-100 border border-neutral-300 text-neutral-850"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
