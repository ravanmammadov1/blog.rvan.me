import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor;

  return (
    <div className="space-y-4 text-neutral-900 leading-relaxed text-left">
      {/* Minimal Header */}
      <header className="pb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-950">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: accent }}>
          {personalInfo.title || "Professional Title"}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-600 font-medium mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>}
          {personalInfo.website && <span>• {personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.github && <span>• {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="pl-3 border-l-2" style={{ borderColor: accent }}>
          <p className="text-xs text-neutral-800 leading-normal">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="pl-3 border-l-2 border-neutral-200">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-neutral-950">{exp.title}</span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-neutral-600 mb-1">
                  {exp.company} {exp.location && `• ${exp.location}`}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-3 space-y-0.5 text-xs text-neutral-800">
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

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2">
            Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="pl-3 border-l-2 border-neutral-200 text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>{proj.name} {proj.role && <span className="font-normal text-neutral-600">({proj.role})</span>}</span>
                  {proj.link && <span className="text-[11px] font-medium" style={{ color: accent }}>{proj.link.replace(/^https?:\/\//, "")}</span>}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[11px] text-neutral-600 font-medium">Stack: {proj.techStack.join(", ")}</div>
                )}
                {proj.description && proj.description.length > 0 && (
                  <ul className="list-disc list-outside ml-3 mt-0.5 space-y-0.5 text-xs text-neutral-800">
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

      {/* Education & Skills Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
              Education
            </h2>
            <div className="space-y-1.5 text-xs pl-3 border-l-2 border-neutral-200">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-neutral-950">{edu.degree} in {edu.field}</div>
                  <div className="text-neutral-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-neutral-400 mb-1.5">
              Skills
            </h2>
            <div className="space-y-1 text-xs pl-3 border-l-2 border-neutral-200">
              {skills.map((cat) => (
                <div key={cat.id || cat.name}>
                  <span className="font-bold text-neutral-900">{cat.name}: </span>
                  <span className="text-neutral-700">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
