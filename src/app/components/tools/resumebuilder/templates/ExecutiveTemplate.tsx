import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor;

  return (
    <div className="space-y-4 text-neutral-900 leading-relaxed text-left">
      {/* Executive Header with Accent Bar */}
      <header className="p-4 rounded-lg bg-neutral-50 border-l-4" style={{ borderColor: accent }}>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-sm font-bold text-neutral-700 uppercase tracking-widest mt-0.5">
          {personalInfo.title || "Executive Leadership"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium mt-2">
          {personalInfo.email && <span className="flex items-center gap-1"><Mail size={12} style={{ color: accent }} /> {personalInfo.email}</span>}
          {personalInfo.phone && <span className="flex items-center gap-1"><Phone size={12} style={{ color: accent }} /> {personalInfo.phone}</span>}
          {personalInfo.location && <span className="flex items-center gap-1"><MapPin size={12} style={{ color: accent }} /> {personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin size={12} style={{ color: accent }} /> {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}</span>}
          {personalInfo.website && <span className="flex items-center gap-1"><Globe size={12} style={{ color: accent }} /> {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
        </div>
      </header>

      {/* Executive Summary */}
      {summary && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-1.5" style={{ color: accent, borderColor: accent }}>
            Executive Profile
          </h2>
          <p className="text-xs text-neutral-800 leading-normal font-normal">{summary}</p>
        </section>
      )}

      {/* Core Competencies & Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-2" style={{ color: accent, borderColor: accent }}>
            Core Leadership & Strategic Competencies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 text-xs">
            {skills.flatMap((s) => s.items).slice(0, 12).map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-neutral-800 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Career History & Milestones */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-2" style={{ color: accent, borderColor: accent }}>
            Professional Progression & Key Milestones
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-extrabold text-neutral-900 text-sm">{exp.title}</span>
                    <span className="font-bold text-neutral-700"> | {exp.company}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"} {exp.location && `(${exp.location})`}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-800">
                    {exp.bullets.filter(Boolean).map((bullet, idx) => (
                      <li key={idx} className="leading-snug">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects / Organizational Initiatives */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-2" style={{ color: accent, borderColor: accent }}>
            Strategic Initiatives & Impact
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{proj.name} {proj.role && <span className="font-normal text-neutral-600">({proj.role})</span>}</span>
                  {proj.link && <span className="text-[11px] font-medium hover:underline" style={{ color: accent }}>{proj.link.replace(/^https?:\/\//, "")}</span>}
                </div>
                {proj.description && proj.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-neutral-800">
                    {proj.description.filter(Boolean).map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Credentials */}
      {(education.length > 0 || certifications.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-1.5" style={{ color: accent, borderColor: accent }}>
                Academic Background
              </h2>
              <div className="space-y-1.5 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-neutral-900">{edu.degree}, {edu.field}</div>
                    <div className="text-neutral-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest border-b pb-1 mb-1.5" style={{ color: accent, borderColor: accent }}>
                Executive Credentials
              </h2>
              <ul className="text-xs space-y-1 text-neutral-800">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> – {c.issuer}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
