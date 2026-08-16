import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const ClassicHarvardTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor;

  const contactItems: string[] = [];
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.email) contactItems.push(personalInfo.email);
  if (personalInfo.location) contactItems.push(personalInfo.location);
  if (personalInfo.linkedin) contactItems.push(personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
  if (personalInfo.website) contactItems.push(personalInfo.website.replace(/^https?:\/\//, ""));
  if (personalInfo.github) contactItems.push(personalInfo.github.replace(/^https?:\/\/(www\.)?/, ""));

  return (
    <div className="space-y-3.5 text-neutral-950 leading-relaxed text-left">
      {/* Centered Classic Header */}
      <header className="text-center pb-2 border-b-2 border-neutral-900">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase" style={{ color: accent }}>
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-700 tracking-wider uppercase mt-0.5">
            {personalInfo.title}
          </p>
        )}
        <div className="text-[11px] text-neutral-700 font-medium mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-0.5">
          {contactItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < contactItems.length - 1 && <span>•</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-400 pb-0.5 mb-1 text-neutral-900">
            Professional Summary
          </h2>
          <p className="text-xs text-neutral-850 leading-normal">{summary}</p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-400 pb-0.5 mb-1.5 text-neutral-900">
            Education
          </h2>
          <div className="space-y-1.5 text-xs">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>{edu.institution}</span>
                  <span className="text-[11px] font-medium text-neutral-700">{edu.location}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-[11.5px]">
                  <span>{edu.degree} in {edu.field}</span>
                  <span className="text-[11px] font-normal not-italic text-neutral-700">{edu.startDate} – {edu.endDate}</span>
                </div>
                {edu.honors && <div className="text-[11px] text-neutral-600 font-normal">{edu.honors} {edu.gpa && `| GPA: ${edu.gpa}`}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-400 pb-0.5 mb-1.5 text-neutral-900">
            Professional Experience
          </h2>
          <div className="space-y-2.5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-neutral-950 text-xs">
                  <span>{exp.company}</span>
                  <span className="text-[11px] font-medium text-neutral-700">{exp.location}</span>
                </div>
                <div className="flex justify-between items-baseline italic text-neutral-800 text-[11.5px]">
                  <span>{exp.title}</span>
                  <span className="text-[11px] font-normal not-italic text-neutral-700">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs text-neutral-850">
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
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-400 pb-0.5 mb-1.5 text-neutral-900">
            Selected Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>
                    {proj.name} {proj.role && <span className="font-normal italic text-neutral-700">({proj.role})</span>}
                  </span>
                  {proj.link && (
                    <span className="text-[11px] font-normal text-neutral-600">{proj.link.replace(/^https?:\/\//, "")}</span>
                  )}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="text-[11px] text-neutral-700 italic">
                    Technologies: {proj.techStack.join(", ")}
                  </div>
                )}
                {proj.description && proj.description.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5 text-xs text-neutral-850">
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

      {/* Skills & Additional Info */}
      {(skills.length > 0 || certifications.length > 0 || languages.length > 0) && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest border-b border-neutral-400 pb-0.5 mb-1.5 text-neutral-900">
            Skills & Certifications
          </h2>
          <div className="space-y-1 text-xs text-neutral-850">
            {skills.map((cat) => (
              <div key={cat.id || cat.name} className="flex items-baseline gap-1">
                <span className="font-bold text-neutral-950">{cat.name}:</span>
                <span>{cat.items.join(", ")}</span>
              </div>
            ))}
            {certifications.length > 0 && (
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-neutral-950">Certifications:</span>
                <span>{certifications.map((c) => `${c.name} (${c.issuer})`).join("; ")}</span>
              </div>
            )}
            {languages.length > 0 && (
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-neutral-950">Languages:</span>
                <span>{languages.map((l) => `${l.language} (${l.proficiency})`).join(", ")}</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
