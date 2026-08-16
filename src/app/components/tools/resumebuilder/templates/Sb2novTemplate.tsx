import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

/**
 * Sb2nov Template (RenderCV / r/EngineeringResumes LaTeX Standard)
 * The most popular and parser-friendly software engineering resume format in the world.
 */
export const Sb2novTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications } = data;
  const accent = theme.accentColor || "#111827";

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

  const updateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    if (!onUpdate) return;
    const updatedExp = [...experiences];
    const bullets = [...updatedExp[expIdx].bullets];
    bullets[bulletIdx] = val;
    updatedExp[expIdx] = { ...updatedExp[expIdx], bullets };
    onUpdate({ ...data, experiences: updatedExp });
  };

  return (
    <div className="p-8 md:p-10 text-neutral-900 bg-white min-h-[1050px] leading-snug text-left space-y-4">
      {/* ── SB2NOV HEADER: CENTERED NAME & COMPACT CONTACT BAR ── */}
      <header className="text-center space-y-1 pb-1">
        <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-neutral-950 font-serif">
          <InlineEdit
            value={personalInfo.fullName}
            onChange={(val) => updateField("personalInfo", "fullName", val)}
            placeholder="YOUR FULL NAME"
          />
        </h1>
        {personalInfo.title && (
          <p className="text-xs font-semibold text-neutral-700">
            <InlineEdit
              value={personalInfo.title}
              onChange={(val) => updateField("personalInfo", "title", val)}
              placeholder="Target Role / Domain"
            />
          </p>
        )}

        {/* Contact Links Row separated by pipes | */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 text-[11px] text-neutral-650 font-mono">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.phone && personalInfo.email && <span>•</span>}
          {personalInfo.email && (
            <a href={`mailto:${personalInfo.email}`} className="text-neutral-900 underline hover:text-primary">
              {personalInfo.email}
            </a>
          )}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-neutral-900 underline hover:text-primary">
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
          {personalInfo.github && <span>•</span>}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-neutral-900 underline hover:text-primary">
              {personalInfo.github.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-neutral-900 underline hover:text-primary">
              {personalInfo.website.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          )}
        </div>
      </header>

      {/* ── EDUCATION SECTION ── */}
      {education.length > 0 && (
        <section className="space-y-1.5">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-0.5"
            style={{ borderColor: accent }}
          >
            Education
          </h2>
          <div className="space-y-1.5 text-xs">
            {education.map((edu, idx) => (
              <div key={edu.id || idx}>
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <span>
                    <InlineEdit
                      value={edu.institution}
                      onChange={(val) => {
                        const updated = [...education];
                        updated[idx] = { ...updated[idx], institution: val };
                        onUpdate && onUpdate({ ...data, education: updated });
                      }}
                      placeholder="University Name"
                    />
                    {edu.location && <span className="font-normal text-neutral-600"> — {edu.location}</span>}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11.5px] text-neutral-750">
                  <span className="italic">
                    {edu.degree} in {edu.field}
                  </span>
                  {edu.gpa && <span className="font-medium text-neutral-600">GPA: {edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EXPERIENCE SECTION ── */}
      {experiences.length > 0 && (
        <section className="space-y-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-0.5"
            style={{ borderColor: accent }}
          >
            Experience
          </h2>
          <div className="space-y-2.5 text-xs">
            {experiences.map((exp, expIdx) => (
              <div key={exp.id || expIdx} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-neutral-950 text-sm">
                      <InlineEdit
                        value={exp.title}
                        onChange={(val) => {
                          const updated = [...experiences];
                          updated[expIdx] = { ...updated[expIdx], title: val };
                          onUpdate && onUpdate({ ...data, experiences: updated });
                        }}
                        placeholder="Job Title"
                      />
                    </span>
                    <span className="text-neutral-700 font-medium"> | </span>
                    <span className="font-semibold text-neutral-850">
                      <InlineEdit
                        value={exp.company}
                        onChange={(val) => {
                          const updated = [...experiences];
                          updated[expIdx] = { ...updated[expIdx], company: val };
                          onUpdate && onUpdate({ ...data, experiences: updated });
                        }}
                        placeholder="Company"
                      />
                    </span>
                    {exp.location && <span className="text-neutral-500 font-normal">, {exp.location}</span>}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-600">
                    {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                {/* Bullets with metric-first hyphen / dot style */}
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-800">
                  {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-snug">
                      <InlineEdit
                        value={bullet}
                        onChange={(val) => updateExpBullet(expIdx, bIdx, val)}
                        placeholder="Describe impact..."
                        tag="span"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROJECTS SECTION ── */}
      {projects && projects.length > 0 && (
        <section className="space-y-2">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-0.5"
            style={{ borderColor: accent }}
          >
            Projects
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj, pIdx) => (
              <div key={proj.id || pIdx} className="space-y-0.5">
                <div className="flex justify-between items-baseline font-bold text-neutral-950">
                  <div>
                    <span>{proj.name}</span>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="font-normal text-neutral-600 italic">
                        {" "}
                        | {proj.techStack.join(", ")}
                      </span>
                    )}
                  </div>
                  {(proj.link || proj.github) && (
                    <a
                      href={proj.link || proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-neutral-700 underline font-mono"
                    >
                      {proj.link ? "Live Demo" : "Code"} ↗
                    </a>
                  )}
                </div>

                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[11.5px] text-neutral-800">
                  {proj.description?.filter(Boolean).map((desc, dIdx) => (
                    <li key={dIdx} className="leading-snug">
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TECHNICAL SKILLS (Compact inline colon format) ── */}
      {skills.length > 0 && (
        <section className="space-y-1">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-0.5"
            style={{ borderColor: accent }}
          >
            Technical Skills
          </h2>
          <div className="space-y-1 text-xs text-neutral-800">
            {skills.map((cat, idx) => (
              <div key={cat.id || idx}>
                <strong className="font-bold text-neutral-950">{cat.name}:</strong>{" "}
                <span className="text-neutral-750">{cat.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CERTIFICATIONS (Optional) ── */}
      {certifications && certifications.length > 0 && (
        <section className="space-y-1">
          <h2
            className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b pb-0.5"
            style={{ borderColor: accent }}
          >
            Certifications
          </h2>
          <div className="text-xs text-neutral-800 space-y-0.5">
            {certifications.map((c) => (
              <div key={c.id} className="flex justify-between items-baseline">
                <span>
                  <strong>{c.name}</strong> — {c.issuer}
                </span>
                <span className="text-[11px] text-neutral-500 font-mono">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
