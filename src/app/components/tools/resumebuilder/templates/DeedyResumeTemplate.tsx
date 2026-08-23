import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  isThumbnail?: boolean;
}

/**
 * Deedy Resume Template (Adapted from deedy/Deedy-Resume LaTeX Template - Apache 2.0 License)
 * Distinctive Visual System:
 * - Asymmetric 2-Column Grid (30% Left Sidebar / 70% Main Body)
 * - Light gray sidebar tint for credentials, coursework, links, and skill list
 * - High-contrast uppercase section titles with clean lines
 * - Right column dedicated to Experience & Projects
 */
export const DeedyResumeTemplate: React.FC<TemplateProps> = ({ data, theme, isThumbnail = false }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor || "#2563eb";

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length <= 1) return { first: fullName, last: "" };
    return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
  };

  const nameParts = splitName(personalInfo.fullName || "Debarghya Das");

  const renderDeedySectionTitle = (title: string) => (
    <h2
      className={`${isThumbnail ? "text-[8px] mb-1" : "text-sm mb-2"} font-bold tracking-widest uppercase font-sans`}
      style={{ color: accent, borderBottom: `1.5px solid ${accent}40`, paddingBottom: "2px" }}
    >
      {title}
    </h2>
  );

  return (
    <div
      className="w-full h-full bg-white text-neutral-900 font-sans flex"
      style={{
        padding: isThumbnail ? "12px" : "32px",
        fontSize: isThumbnail ? "6px" : "10.5px",
        lineHeight: 1.35,
      }}
    >
      {/* ── LEFT COLUMN (32% Width) ── */}
      <div className={`w-[32%] pr-3 border-r border-neutral-200 flex flex-col ${isThumbnail ? "gap-2" : "gap-4"}`}>
        {/* Contact Links */}
        <div>
          {renderDeedySectionTitle("LINKS")}
          <div className={`flex flex-col ${isThumbnail ? "gap-0.5" : "gap-1 text-[90%]"} text-neutral-600`}>
            {personalInfo.email && <span className="truncate">{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.github && <span>github://{personalInfo.github.replace(/^https?:\/\//, "")}</span>}
            {personalInfo.linkedin && <span>linkedin://{personalInfo.linkedin.replace(/^https?:\/\//, "")}</span>}
            {personalInfo.website && <span>web://{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          </div>
        </div>

        {/* Education in Left Sidebar */}
        {education && education.length > 0 && (
          <div>
            {renderDeedySectionTitle("EDUCATION")}
            <div className={`flex flex-col ${isThumbnail ? "gap-1.5" : "gap-3"}`}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <div className="font-bold text-neutral-900 leading-tight">{edu.institution}</div>
                  <div className="text-neutral-700 italic text-[95%]">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </div>
                  <div className="text-neutral-500 font-mono text-[85%] mt-0.5">
                    {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}
                  </div>
                  {edu.gpa && <div className="text-neutral-600 text-[85%] font-medium">Cum. GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills in Left Sidebar */}
        {skills && skills.length > 0 && (
          <div>
            {renderDeedySectionTitle("SKILLS")}
            <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2 text-[95%]"}`}>
              {skills.map((cat, idx) => (
                <div key={idx}>
                  <div className="font-bold text-neutral-800 uppercase tracking-wider text-[85%]">{cat.name}</div>
                  <div className="text-neutral-600 leading-snug">{cat.items.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Left Sidebar */}
        {languages && languages.length > 0 && (
          <div>
            {renderDeedySectionTitle("LANGUAGES")}
            <div className={`flex flex-col ${isThumbnail ? "gap-0.5" : "gap-1 text-[90%]"} text-neutral-600`}>
              {languages.map((lang, idx) => (
                <div key={idx} className="flex justify-between">
                  <span className="font-medium text-neutral-800">{lang.language}</span>
                  <span className="italic">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT COLUMN (68% Width) ── */}
      <div className={`w-[68%] pl-4 flex flex-col ${isThumbnail ? "gap-2" : "gap-4"}`}>
        {/* Name Header */}
        <div className={`border-b border-neutral-200 ${isThumbnail ? "pb-1" : "pb-3"}`}>
          <h1 className={`${isThumbnail ? "text-[16px]" : "text-3xl"} font-light tracking-tight`}>
            <span className="font-bold" style={{ color: accent }}>{nameParts.first.toUpperCase()} </span>
            <span className="font-light text-neutral-800">{nameParts.last.toUpperCase()}</span>
          </h1>
          {personalInfo.title && (
            <p className={`${isThumbnail ? "text-[7px]" : "text-xs"} font-medium tracking-widest text-neutral-600 uppercase mt-0.5`}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Profile Summary */}
        {summary && (
          <div>
            {renderDeedySectionTitle("PROFILE")}
            <p className="text-neutral-700 leading-relaxed text-[95%]">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div>
            {renderDeedySectionTitle("EXPERIENCE")}
            <div className={`flex flex-col ${isThumbnail ? "gap-1.5" : "gap-3"}`}>
              {experiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{exp.company}</span>
                      <span className="text-neutral-600 ml-1.5 font-medium">| {exp.title}</span>
                    </div>
                    <span className="text-neutral-500 font-mono text-[85%] shrink-0">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className={`list-none ${isThumbnail ? "space-y-0.5 pl-1.5" : "space-y-1 pl-2"} text-neutral-700 mt-1`}>
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5 text-[95%]">
                          <span className="text-neutral-400 select-none mt-0.5">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div>
            {renderDeedySectionTitle("SELECTED PROJECTS")}
            <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-neutral-900">{proj.name}</span>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <span className="text-[85%] font-mono font-medium" style={{ color: accent }}>
                        {proj.techStack.join(" / ")}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-neutral-700 text-[90%] mt-0.5">{proj.description.join(" ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DeedyResumeTemplate;
