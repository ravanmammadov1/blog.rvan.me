import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  isThumbnail?: boolean;
}

/**
 * Swiss Editorial Template (Adapted from Typst Modernist Swiss Resume - MIT License)
 * Distinctive Visual System:
 * - Asymmetrical Margin Grid: Left column (25% width) holds all major Section Headings
 * - Right content column (75% width) presents narrative and details
 * - Bold black modernist typography, zero decorative gradients, pure grid discipline
 */
export const SwissEditorialTemplate: React.FC<TemplateProps> = ({ data, theme, isThumbnail = false }) => {
  const { personalInfo, summary, experiences, education, skills, projects, certifications, languages } = data;
  const accent = theme.accentColor || "#111827";

  const renderSwissRow = (sectionTitle: string, content: React.ReactNode) => (
    <div className={`flex items-start border-t border-neutral-900/15 ${isThumbnail ? "pt-1.5 mb-2" : "pt-3.5 mb-4"}`}>
      <div className="w-[26%] pr-3">
        <span className={`font-bold uppercase tracking-widest ${isThumbnail ? "text-[7.5px]" : "text-xs"} text-neutral-900 font-sans`}>
          {sectionTitle}
        </span>
      </div>
      <div className="w-[74%] flex flex-col">{content}</div>
    </div>
  );

  return (
    <div
      className="w-full h-full bg-[#fdfdfd] text-neutral-900 font-sans"
      style={{
        padding: isThumbnail ? "14px 16px" : "36px 42px",
        fontSize: isThumbnail ? "6px" : "10.5px",
        lineHeight: 1.35,
      }}
    >
      {/* ── HEADER ── */}
      <div className={`flex items-baseline justify-between border-b-2 border-neutral-900 ${isThumbnail ? "pb-2 mb-2" : "pb-4 mb-4"}`}>
        <div>
          <h1 className={`${isThumbnail ? "text-[16px]" : "text-3xl"} font-extrabold tracking-tighter text-neutral-950 uppercase`}>
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          {personalInfo.title && (
            <p className={`${isThumbnail ? "text-[7px]" : "text-xs"} font-mono tracking-wider uppercase text-neutral-600 mt-0.5`}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact Links */}
        <div className={`flex flex-col items-end font-mono ${isThumbnail ? "text-[5.5px] gap-0.5" : "text-[9.5px] gap-1"} text-neutral-600`}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* ── PROFILE / SUMMARY ── */}
      {summary && renderSwissRow("PROFILE", <p className="text-neutral-700 leading-relaxed font-sans">{summary}</p>)}

      {/* ── EXPERIENCE ── */}
      {experiences && experiences.length > 0 &&
        renderSwissRow(
          "EXPERIENCE",
          <div className={`flex flex-col ${isThumbnail ? "gap-2" : "gap-3.5"}`}>
            {experiences.map((exp, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-950">{exp.title}</span>
                  <span className="text-neutral-500 font-mono text-[85%]">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <div className="text-neutral-600 font-medium text-[95%] mb-1">
                  {exp.company} {exp.location ? `/ ${exp.location}` : ""}
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className={`list-none ${isThumbnail ? "space-y-0.5 pl-1.5" : "space-y-0.5 pl-2"} text-neutral-700`}>
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5">
                        <span className="text-neutral-400 select-none mt-0.5">—</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

      {/* ── EDUCATION ── */}
      {education && education.length > 0 &&
        renderSwissRow(
          "EDUCATION",
          <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
            {education.map((edu, idx) => (
              <div key={idx} className="flex items-baseline justify-between">
                <div>
                  <span className="font-bold text-neutral-950">{edu.institution}</span>
                  <span className="text-neutral-600 ml-1.5">/ {edu.degree} {edu.field ? `in ${edu.field}` : ""}</span>
                  {edu.gpa && <span className="text-neutral-500 text-[85%] ml-1.5">(GPA: {edu.gpa})</span>}
                </div>
                <span className="text-neutral-500 font-mono text-[85%]">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

      {/* ── SKILLS ── */}
      {skills && skills.length > 0 &&
        renderSwissRow(
          "SKILLS",
          <div className={`flex flex-col ${isThumbnail ? "gap-0.5" : "gap-1.5"}`}>
            {skills.map((cat, idx) => (
              <div key={idx} className="flex items-baseline gap-2 text-[95%]">
                <span className="font-bold text-neutral-900 shrink-0 min-w-[75px]">{cat.name}:</span>
                <span className="text-neutral-600">{cat.items.join("  •  ")}</span>
              </div>
            ))}
          </div>
        )}

      {/* ── PROJECTS ── */}
      {projects && projects.length > 0 &&
        renderSwissRow(
          "PROJECTS",
          <div className={`flex flex-col ${isThumbnail ? "gap-1" : "gap-2"}`}>
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-950">{proj.name}</span>
                  {proj.techStack && (
                    <span className="font-mono text-neutral-500 text-[85%]">{proj.techStack.join(", ")}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-neutral-700 text-[90%] mt-0.5">{proj.description.join(" ")}</p>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
export default SwissEditorialTemplate;
