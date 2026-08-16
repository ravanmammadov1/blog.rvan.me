import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, CheckCircle, Award, User } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Leafish Template (Inspired by Reactive Resume Leafish)
 * Clean 2-column sidebar with soft accent container, icon bullet points, and high contrast readability.
 */
export const LeafishTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, certifications, languages, projects } = data;
  const accent = theme.accentColor || "#059669"; // Emerald

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
    <div className="grid grid-cols-12 min-h-[1050px] bg-white text-neutral-900 overflow-hidden text-left">
      {/* ── LEFT SIDEBAR (35%) ── */}
      <aside className="col-span-4 p-6 bg-neutral-50 border-r border-neutral-200 space-y-6">
        {/* Photo & Name */}
        <div className="text-center space-y-3">
          {personalInfo.showPhoto && (
            <div className="relative w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 shadow-md bg-neutral-200" style={{ borderColor: accent }}>
              {personalInfo.photoUrl ? (
                <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400">
                  <User size={36} />
                </div>
              )}
            </div>
          )}

          <div>
            <h1 className="text-xl font-extrabold tracking-tight uppercase text-neutral-950">
              <InlineEdit
                value={personalInfo.fullName}
                onChange={(val) => updateField("personalInfo", "fullName", val)}
                placeholder="YOUR NAME"
              />
            </h1>
            <p className="text-xs font-bold mt-0.5" style={{ color: accent }}>
              <InlineEdit
                value={personalInfo.title}
                onChange={(val) => updateField("personalInfo", "title", val)}
                placeholder="Target Position"
              />
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-xs text-neutral-700">
          <h2 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
            Contact
          </h2>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={12} style={{ color: accent }} />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={12} style={{ color: accent }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin size={12} style={{ color: accent }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin size={12} style={{ color: accent }} />
              <span className="truncate">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2.5 text-xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="space-y-0.5">
                <div className="font-bold text-neutral-950">{edu.degree}</div>
                <div className="text-neutral-600">{edu.institution}</div>
                <div className="text-[10px] text-neutral-500">{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills List */}
        {skills.length > 0 && (
          <div className="space-y-2 text-xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {skills.flatMap((s) => s.items).map((item, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-white border border-neutral-300 text-[10.5px] font-medium text-neutral-800">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="space-y-2 text-xs">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              Languages
            </h2>
            {languages.map((l, idx) => (
              <div key={l.id || idx} className="flex justify-between items-center text-neutral-800">
                <span className="font-semibold">{l.language}</span>
                <span className="text-[10px] text-neutral-500">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── RIGHT CONTENT (65%) ── */}
      <main className="col-span-8 p-8 space-y-6">
        {/* Summary */}
        {summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 pb-0.5" style={{ borderColor: accent }}>
              Profile Overview
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
          <section className="space-y-4">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 pb-0.5" style={{ borderColor: accent }}>
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-neutral-950 text-sm">{exp.title}</span>
                    <span className="text-[10.5px] font-mono text-neutral-500">{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <div className="font-semibold text-xs" style={{ color: accent }}>{exp.company} • {exp.location}</div>
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

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 pb-0.5" style={{ borderColor: accent }}>
              Key Projects
            </h2>
            <div className="space-y-2 text-xs">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx}>
                  <div className="flex justify-between items-baseline font-bold text-neutral-950">
                    <span>{proj.name}</span>
                    {proj.link && <span className="text-neutral-500 text-[10px] underline">{proj.link}</span>}
                  </div>
                  {proj.description?.map((d, dIdx) => (
                    <p key={dIdx} className="text-neutral-600 text-[11px] mt-0.5">{d}</p>
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
