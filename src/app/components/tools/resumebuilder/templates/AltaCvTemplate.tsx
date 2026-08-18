import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  isThumbnail?: boolean;
}

/**
 * AltaCV Template (Adapted from liantze/AltaCV LaTeX Template - LPPL/MIT License)
 * Distinctive Visual System:
 * - Circular avatar header with bold two-tone name and contact pills
 * - 60/40 Asymmetric split body layout
 * - Solid accent colored rounded section headings
 * - Skill pill cloud with subtle filled background tags
 */
export const AltaCvTemplate: React.FC<TemplateProps> = ({ data, theme, isThumbnail = false }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor || "#059669";

  const renderAltaHeading = (title: string) => (
    <div className={`flex items-center gap-2 ${isThumbnail ? "mb-1.5" : "mb-2.5"}`}>
      <span
        className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${isThumbnail ? "text-[7px]" : "text-xs"} text-white font-sans`}
        style={{ backgroundColor: accent }}
      >
        {title}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: `${accent}30` }} />
    </div>
  );

  return (
    <div
      className="w-full h-full bg-white text-neutral-900 font-sans"
      style={{
        padding: isThumbnail ? "12px 14px" : "32px 36px",
        fontSize: isThumbnail ? "6px" : "10.5px",
        lineHeight: 1.35,
      }}
    >
      {/* ── ALTACV HEADER ── */}
      <div className={`flex items-center gap-4 border-b border-neutral-200 ${isThumbnail ? "pb-2 mb-2" : "pb-4 mb-4"}`}>
        {personalInfo.showPhoto && personalInfo.photoUrl && (
          <div className={`${isThumbnail ? "w-8 h-8" : "w-16 h-16"} rounded-full overflow-hidden border-2 shrink-0`} style={{ borderColor: accent }}>
            <img src={personalInfo.photoUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className={`${isThumbnail ? "text-[14px]" : "text-2xl"} font-bold text-neutral-900 tracking-tight`}>
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.title && (
            <p className={`${isThumbnail ? "text-[7px]" : "text-xs"} font-semibold tracking-wider uppercase mt-0.5`} style={{ color: accent }}>
              {personalInfo.title}
            </p>
          )}

          {/* Contact Row */}
          <div className={`flex flex-wrap items-center gap-x-3 gap-y-0.5 ${isThumbnail ? "mt-1 text-[5px]" : "mt-2 text-[9.5px]"} text-neutral-600`}>
            {personalInfo.email && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.github && <span>🔗 {personalInfo.github.replace(/^https?:\/\//, "")}</span>}
          </div>
        </div>
      </div>

      {/* ── SUMMARY ── */}
      {summary && (
        <div className={isThumbnail ? "mb-2" : "mb-3"}>
          <p className="text-neutral-700 leading-relaxed italic border-l-2 pl-2" style={{ borderColor: accent }}>
            {summary}
          </p>
        </div>
      )}

      {/* ── 60/40 BODY GRID ── */}
      <div className="flex gap-4">
        {/* Left Main Body (60%) */}
        <div className="w-[60%] flex flex-col gap-3">
          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <div>
              {renderAltaHeading("EXPERIENCE")}
              <div className={`flex flex-col ${isThumbnail ? "gap-1.5" : "gap-2.5"}`}>
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-neutral-900">{exp.title}</span>
                      <span className="text-neutral-500 font-mono text-[85%] shrink-0">
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="font-semibold text-[95%]" style={{ color: accent }}>
                      {exp.company} {exp.location ? `• ${exp.location}` : ""}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className={`list-none ${isThumbnail ? "space-y-0.5 pl-1.5" : "space-y-0.5 pl-2"} text-neutral-700 mt-1`}>
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1 text-[95%]">
                            <span className="text-neutral-400 select-none mt-0.5">›</span>
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
              {renderAltaHeading("PROJECTS")}
              <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <span className="font-bold text-neutral-900">{proj.name}</span>
                    {proj.description && (
                      <p className="text-neutral-700 text-[90%] mt-0.5">{proj.description.join(" ")}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (40%) */}
        <div className="w-[40%] flex flex-col gap-3">
          {/* Skills Pill Cloud */}
          {skills && skills.length > 0 && (
            <div>
              {renderAltaHeading("SKILLS")}
              <div className="flex flex-col gap-2">
                {skills.map((cat, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-neutral-800 text-[85%] uppercase mb-1">{cat.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map((item, iIdx) => (
                        <span
                          key={iIdx}
                          className="px-1.5 py-0.5 rounded text-[85%] font-medium bg-neutral-100 text-neutral-800 border border-neutral-200"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              {renderAltaHeading("EDUCATION")}
              <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-neutral-900 leading-tight">{edu.institution}</div>
                    <div className="text-neutral-700 italic text-[90%]">{edu.degree}</div>
                    <div className="text-neutral-500 font-mono text-[80%]">{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              {renderAltaHeading("LANGUAGES")}
              <div className="flex flex-col gap-1 text-[90%]">
                {languages.map((l, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="font-medium text-neutral-800">{l.language}</span>
                    <span className="text-neutral-500 italic text-[85%]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AltaCvTemplate;
