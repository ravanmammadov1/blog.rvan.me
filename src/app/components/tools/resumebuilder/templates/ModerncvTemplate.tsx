import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Moderncv Template (RenderCV / LaTeX moderncv class)
 * Distinctive left-aligned date/meta column with colored accents and structured sections.
 */
export const ModerncvTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
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
    <div className="p-8 md:p-12 text-neutral-900 bg-white min-h-[1050px] leading-relaxed text-left space-y-6">
      {/* ── MODERNCV HEADER ── */}
      <header className="flex justify-between items-end border-b-2 pb-4" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-950 uppercase">
            <InlineEdit
              value={personalInfo.fullName}
              onChange={(val) => updateField("personalInfo", "fullName", val)}
              placeholder="YOUR FULL NAME"
            />
          </h1>
          <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: accent }}>
            <InlineEdit
              value={personalInfo.title}
              onChange={(val) => updateField("personalInfo", "title", val)}
              placeholder="Professional Role"
            />
          </p>
        </div>

        {/* Contact Metadata Block */}
        <div className="text-[11px] text-neutral-650 space-y-1 text-right font-medium">
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.email && <div className="text-neutral-900 font-semibold">{personalInfo.email}</div>}
          {personalInfo.linkedin && (
            <div>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</div>
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
            <InlineEdit
              value={summary}
              onChange={(val) => onUpdate && onUpdate({ ...data, summary: val })}
              placeholder="Write summary..."
              tag="p"
              className="text-xs text-neutral-750 leading-relaxed text-justify"
            />
          </div>
        </section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {experiences.length > 0 && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              Experience
            </h2>
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-4">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="space-y-1 text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-extrabold text-neutral-950 text-sm">
                    {exp.title}
                  </span>
                  <span className="text-[10.5px] font-mono text-neutral-500">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="font-semibold text-xs" style={{ color: accent }}>
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-750">
                  {exp.bullets.filter(Boolean).map((b, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {education.length > 0 && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              Education
            </h2>
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-2 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>{edu.degree} in {edu.field}</span>
                  <span className="text-[10.5px] font-mono text-neutral-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-neutral-600">{edu.institution} {edu.location && `• ${edu.location}`}</div>
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

      {/* ── LANGUAGES & CERTIFICATES ── */}
      {(languages.length > 0 || certifications.length > 0) && (
        <section className="grid grid-cols-12 gap-4">
          <div className="col-span-3 text-right">
            <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accent }}>
              Languages & Honors
            </h2>
          </div>
          <div className="col-span-9 pl-3 border-l-2 border-neutral-200 space-y-1.5 text-xs text-neutral-800">
            {languages.length > 0 && (
              <div>
                <strong className="font-bold">Languages: </strong>
                <span>{languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}</span>
              </div>
            )}
            {certifications.length > 0 && (
              <div>
                <strong className="font-bold">Certifications: </strong>
                <span>{certifications.map((c) => `${c.name} - ${c.issuer}`).join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
