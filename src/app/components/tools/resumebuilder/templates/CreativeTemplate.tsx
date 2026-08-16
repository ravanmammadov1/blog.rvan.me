import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor;

  return (
    <div className="space-y-4 text-neutral-900 leading-relaxed text-left">
      {/* Creative Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-3 border-b-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-700 mt-0.5">
            {personalInfo.title || "Product & Creative Specialist"}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 font-medium mt-2 md:mt-0 md:text-right">
          {personalInfo.email && <div className="flex items-center gap-1"><Mail size={11} style={{ color: accent }} /> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={11} style={{ color: accent }} /> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center gap-1"><MapPin size={11} style={{ color: accent }} /> {personalInfo.location}</div>}
          {personalInfo.website && <div className="flex items-center gap-1"><Globe size={11} style={{ color: accent }} /> {personalInfo.website.replace(/^https?:\/\//, "")}</div>}
        </div>
      </header>

      {/* Profile */}
      {summary && (
        <section className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
          <p className="text-xs text-neutral-800 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accent }}>
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: accent }} />
            Experience & Impact
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 text-sm">{exp.title}</span>
                    <span className="text-neutral-600 font-medium"> @ {exp.company}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Present"}
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

      {/* Projects Grid */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: accent }}>
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: accent }} />
            Key Projects & Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {projects.map((proj) => (
              <div key={proj.id} className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-neutral-900">{proj.name}</div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[10.5px] font-medium text-neutral-500 my-0.5">{proj.techStack.join(", ")}</div>
                  )}
                  {proj.description && proj.description.length > 0 && (
                    <p className="text-[11px] text-neutral-700 mt-1">{proj.description[0]}</p>
                  )}
                </div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10.5px] font-bold mt-2 hover:underline" style={{ color: accent }}>
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills & Education */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: accent }}>
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: accent }} />
              Expertise & Toolkit
            </h2>
            <div className="space-y-1 text-xs">
              {skills.map((cat) => (
                <div key={cat.id || cat.name}>
                  <strong className="text-neutral-900">{cat.name}: </strong>
                  <span className="text-neutral-700">{cat.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider mb-1.5 flex items-center gap-1.5" style={{ color: accent }}>
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: accent }} />
              Education
            </h2>
            <div className="space-y-1 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-neutral-900">{edu.degree}</div>
                  <div className="text-neutral-600">{edu.institution} ({edu.startDate} – {edu.endDate})</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
