import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const ModernTechTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor;

  return (
    <div className="space-y-4 text-neutral-900 leading-relaxed text-left">
      {/* Header */}
      <header className="border-b-2 pb-3" style={{ borderColor: accent }}>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-sm font-semibold text-neutral-700 tracking-wide mt-0.5">
              {personalInfo.title || "Professional Title"}
            </p>
          </div>
        </div>

        {/* Contact Links Bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium mt-2">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail size={12} style={{ color: accent }} />
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={12} style={{ color: accent }} />
              <span>{personalInfo.phone}</span>
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} style={{ color: accent }} />
              <span>{personalInfo.location}</span>
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe size={12} style={{ color: accent }} />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <Linkedin size={12} style={{ color: accent }} />
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}
              </a>
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <Github size={12} style={{ color: accent }} />
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
            Professional Summary
          </h2>
          <p className="text-xs text-neutral-800 leading-normal">{summary}</p>
        </section>
      )}

      {/* Technical Skills */}
      {skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: accent }}>
            Technical & Core Skills
          </h2>
          <div className="space-y-1 text-xs">
            {skills.map((cat) => (
              <div key={cat.id || cat.name} className="flex flex-wrap items-baseline gap-1">
                <span className="font-bold text-neutral-900">{cat.name}:</span>
                <span className="text-neutral-700">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Work Experience
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex flex-wrap justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 text-sm">{exp.title}</span>
                    <span className="text-neutral-600 font-semibold"> • {exp.company}</span>
                  </div>
                  <div className="text-neutral-500 font-medium text-[11px]">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"} {exp.location && `| ${exp.location}`}
                  </div>
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

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Featured Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-neutral-900">{proj.name}</span>
                    {proj.role && <span className="text-neutral-500 italic">({proj.role})</span>}
                  </div>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] font-semibold hover:underline flex items-center gap-0.5" style={{ color: accent }}>
                      <span>Live Demo</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <p className="text-[11px] text-neutral-600 font-medium mt-0.5">
                    <strong>Tech:</strong> {proj.techStack.join(", ")}
                  </p>
                )}
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

      {/* Education */}
      {education.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 border-b pb-0.5" style={{ borderColor: accent, color: accent }}>
            Education
          </h2>
          <div className="space-y-1.5 text-xs">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-neutral-900">{edu.degree} in {edu.field}</span>
                  <div className="text-neutral-600">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                  {edu.honors && <div className="text-[11px] text-neutral-500 italic">{edu.honors} {edu.gpa && `(GPA: ${edu.gpa})`}</div>}
                </div>
                <div className="text-neutral-500 text-[11px]">
                  {edu.startDate} – {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {(certifications.length > 0 || languages.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
                Certifications
              </h2>
              <ul className="text-xs space-y-0.5 text-neutral-800">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> – {c.issuer} {c.date && `(${c.date})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
                Languages
              </h2>
              <p className="text-xs text-neutral-800">
                {languages.map((l) => `${l.language} (${l.proficiency})`).join(" • ")}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
