import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  isThumbnail?: boolean;
}

/**
 * Awesome-CV Template (Adapted from posquit0/Awesome-CV LaTeX Template - MIT License)
 * Distinctive Visual System:
 * - Two-tone bold Name with accent color on first name
 * - Position subtitle and right-aligned compact contact block with colored icon bullets
 * - Section headers with bold accent-colored first 3 letters and gray trailing text, followed by an accent line
 * - 3-tier subheader structure (Role / Organization / Date & Location)
 */
export const AwesomeCvTemplate: React.FC<TemplateProps> = ({ data, theme, isThumbnail = false }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor || "#dc2626";

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length <= 1) return { first: fullName, last: "" };
    return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
  };

  const nameParts = splitName(personalInfo.fullName || "Claudette Leninger");

  const renderSectionTitle = (title: string) => {
    const firstThree = title.substring(0, 3);
    const rest = title.substring(3);
    return (
      <div className={`flex items-center gap-2 ${isThumbnail ? "mb-1.5" : "mb-3"}`}>
        <h2 className={`${isThumbnail ? "text-[8px]" : "text-sm"} font-bold tracking-wider uppercase font-sans`}>
          <span style={{ color: accent }}>{firstThree}</span>
          <span className="text-neutral-700">{rest}</span>
        </h2>
        <div className="flex-1 h-[1.5px]" style={{ backgroundColor: `${accent}40` }} />
      </div>
    );
  };

  return (
    <div
      className="w-full h-full bg-white text-neutral-900 font-sans"
      style={{
        padding: isThumbnail ? "14px 16px" : "36px 40px",
        fontSize: isThumbnail ? "6px" : "11px",
        lineHeight: 1.35,
      }}
    >
      {/* ── AWESOME-CV HEADER ── */}
      <div className={`flex items-start justify-between border-b border-neutral-200 ${isThumbnail ? "pb-2 mb-2" : "pb-4 mb-4"}`}>
        <div>
          <h1 className={`${isThumbnail ? "text-[14px]" : "text-3xl"} font-light tracking-tight`}>
            <span className="font-light text-neutral-800">{nameParts.first} </span>
            <span className="font-bold" style={{ color: accent }}>{nameParts.last}</span>
          </h1>
          {personalInfo.title && (
            <p className={`${isThumbnail ? "text-[7px]" : "text-xs"} font-semibold tracking-widest uppercase mt-0.5`} style={{ color: accent }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact Info Right-Aligned with Icons */}
        <div className={`flex flex-col items-end ${isThumbnail ? "gap-0.5 text-[5.5px]" : "gap-1 text-[10px]"} text-neutral-600`}>
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span>{personalInfo.email}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span>{personalInfo.phone}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <span>{personalInfo.location}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <span>{personalInfo.github.replace(/^https?:\/\//, "")}</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
            </div>
          )}
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {summary && (
        <div className={isThumbnail ? "mb-2" : "mb-4"}>
          {renderSectionTitle("PROFILE")}
          <p className="text-neutral-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* ── EXPERIENCE ── */}
      {experiences && experiences.length > 0 && (
        <div className={isThumbnail ? "mb-2" : "mb-4"}>
          {renderSectionTitle("EXPERIENCE")}
          <div className={`flex flex-col ${isThumbnail ? "gap-1.5" : "gap-3"}`}>
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-neutral-900">{exp.title}</span>
                    <span className="text-neutral-400 font-light">at</span>
                    <span className="font-semibold" style={{ color: accent }}>{exp.company}</span>
                  </div>
                  <span className="text-neutral-500 font-mono text-[90%] shrink-0">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-neutral-500 italic text-[90%] mb-1">{exp.location}</p>
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-none ${isThumbnail ? "space-y-0.5 pl-2" : "space-y-1 pl-3"} text-neutral-700`}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
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

      {/* ── EDUCATION ── */}
      {education && education.length > 0 && (
        <div className={isThumbnail ? "mb-2" : "mb-4"}>
          {renderSectionTitle("EDUCATION")}
          <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex items-baseline justify-between">
                <div>
                  <span className="font-bold text-neutral-900">{edu.institution}</span>
                  <span className="text-neutral-600 ml-1.5">
                    — {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </span>
                  {edu.gpa && <span className="text-neutral-500 text-[90%] ml-1.5">(GPA: {edu.gpa})</span>}
                </div>
                <span className="text-neutral-500 font-mono text-[90%] shrink-0">
                  {edu.startDate} {edu.endDate ? `— ${edu.endDate}` : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── SKILLS ── */}
      {skills && skills.length > 0 && (
        <div className={isThumbnail ? "mb-2" : "mb-3"}>
          {renderSectionTitle("SKILLS")}
          <div className={`flex flex-col ${isThumbnail ? "gap-0.5" : "gap-1.5"}`}>
            {skills.map((cat, idx) => (
              <div key={idx} className="flex items-baseline gap-2">
                <span className="font-bold text-neutral-800 shrink-0 min-w-[70px]">{cat.name}:</span>
                <span className="text-neutral-600">{cat.items.join("  •  ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROJECTS ── */}
      {projects && projects.length > 0 && (
        <div className={isThumbnail ? "mb-1" : "mb-3"}>
          {renderSectionTitle("PROJECTS")}
          <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-900">{proj.name}</span>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <span className="text-[90%] font-mono font-medium" style={{ color: accent }}>
                      {proj.techStack.join(", ")}
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
  );
};
export default AwesomeCvTemplate;
