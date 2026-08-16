import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Globe, Linkedin, Award, User } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const DarkSidebarTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, references, languages, certifications } = data;
  const accent = theme.accentColor || "#1e3a8a";
  const sidebarBg = theme.sidebarColor || "#2c2d30"; // Dark Charcoal

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

  const updateSummary = (val: string) => {
    if (!onUpdate) return;
    onUpdate({ ...data, summary: val });
  };

  const updateExpBullet = (expIdx: number, bulletIdx: number, val: string) => {
    if (!onUpdate) return;
    const updatedExp = [...experiences];
    const bullets = [...updatedExp[expIdx].bullets];
    bullets[bulletIdx] = val;
    updatedExp[expIdx] = { ...updatedExp[expIdx], bullets };
    onUpdate({ ...data, experiences: updatedExp });
  };

  const updateExpField = (expIdx: number, field: string, val: string) => {
    if (!onUpdate) return;
    const updatedExp = [...experiences];
    updatedExp[expIdx] = { ...updatedExp[expIdx], [field]: val };
    onUpdate({ ...data, experiences: updatedExp });
  };

  return (
    <div className="grid grid-cols-12 min-h-[1050px] bg-white text-neutral-900 overflow-hidden shadow-sm">
      {/* ── LEFT DARK SIDEBAR (35-40% width) ── */}
      <aside
        className="col-span-4 p-6 text-white flex flex-col justify-between space-y-6"
        style={{ backgroundColor: sidebarBg }}
      >
        <div className="space-y-5">
          {/* Profile Photo */}
          {personalInfo.showPhoto && (
            <div className="flex justify-center pt-2">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-white/40 shadow-xl bg-neutral-800">
                {personalInfo.photoUrl ? (
                  <img
                    src={personalInfo.photoUrl}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    <User size={40} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Name & Title in Sidebar */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-black uppercase tracking-wider text-white leading-tight">
              <InlineEdit
                value={personalInfo.fullName}
                onChange={(val) => updateField("personalInfo", "fullName", val)}
                placeholder="YOUR NAME"
                tag="span"
              />
            </h1>
            <p className="text-xs font-medium text-neutral-300 tracking-wide">
              <InlineEdit
                value={personalInfo.title}
                onChange={(val) => updateField("personalInfo", "title", val)}
                placeholder="Professional Title"
                tag="span"
              />
            </p>
          </div>

          {/* Contact Section */}
          <div className="space-y-2 pt-2 border-t border-white/20">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 pb-1 border-b border-white/10">
              CONTACT
            </h2>
            <div className="space-y-2 text-[10.5px] text-neutral-200">
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone size={10} />
                  </div>
                  <InlineEdit
                    value={personalInfo.phone}
                    onChange={(val) => updateField("personalInfo", "phone", val)}
                    placeholder="Phone"
                  />
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail size={10} />
                  </div>
                  <InlineEdit
                    value={personalInfo.email}
                    onChange={(val) => updateField("personalInfo", "email", val)}
                    placeholder="Email"
                  />
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Globe size={10} />
                  </div>
                  <InlineEdit
                    value={personalInfo.website}
                    onChange={(val) => updateField("personalInfo", "website", val)}
                    placeholder="Website"
                  />
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={10} />
                  </div>
                  <InlineEdit
                    value={personalInfo.location}
                    onChange={(val) => updateField("personalInfo", "location", val)}
                    placeholder="Address / City"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Education in Sidebar */}
          {education.length > 0 && (
            <div className="space-y-2.5 pt-2 border-t border-white/20">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 pb-1 border-b border-white/10">
                EDUCATION
              </h2>
              <div className="space-y-2 text-[10.5px]">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <div className="font-bold text-white leading-tight">
                      <InlineEdit
                        value={`${edu.degree}`}
                        onChange={(val) => {
                          const updated = [...education];
                          updated[idx] = { ...updated[idx], degree: val };
                          onUpdate && onUpdate({ ...data, education: updated });
                        }}
                      />
                    </div>
                    <div className="text-neutral-300">{edu.institution}</div>
                    <div className="text-neutral-400 text-[9.5px]">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills in Sidebar */}
          {skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/20">
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-neutral-300 pb-1 border-b border-white/10">
                SKILLS
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {skills.flatMap((s) => s.items).map((item, idx) => (
                  <div
                    key={idx}
                    className="pb-1 border-b border-white/10 text-neutral-200 font-medium"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── RIGHT MAIN WHITE CONTENT (60-65% width) ── */}
      <main className="col-span-8 p-8 space-y-6 text-neutral-900">
        {/* Career Summary */}
        {summary && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              Career Summary
            </h2>
            <InlineEdit
              value={summary}
              onChange={updateSummary}
              placeholder="Write your career overview..."
              tag="p"
              className="text-xs text-neutral-700 leading-relaxed text-justify"
            />
          </section>
        )}

        {/* Professional Experience with Vertical Timeline */}
        {experiences.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1">
              Professional Experience
            </h2>

            <div className="relative pl-4 space-y-5 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-neutral-300">
              {experiences.map((exp, expIdx) => (
                <div key={exp.id || expIdx} className="relative space-y-1.5 text-xs">
                  {/* Timeline Bullet Node */}
                  <div className="absolute -left-[17.5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-neutral-700 bg-white" />

                  {/* Header: Title & Company + Date */}
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-extrabold text-neutral-950 text-sm">
                        <InlineEdit
                          value={exp.title}
                          onChange={(val) => updateExpField(expIdx, "title", val)}
                          placeholder="Job Title"
                        />
                      </span>
                      <div className="text-[11px] font-semibold text-neutral-600">
                        <InlineEdit
                          value={exp.company}
                          onChange={(val) => updateExpField(expIdx, "company", val)}
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div className="text-[10.5px] font-medium text-neutral-500 italic">
                      <InlineEdit
                        value={`${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`}
                        onChange={(val) => updateExpField(expIdx, "startDate", val)}
                        placeholder="Dates"
                      />
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul className="space-y-1 pl-1 text-xs text-neutral-750">
                    {exp.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-neutral-400 font-bold">•</span>
                        <InlineEdit
                          value={bullet}
                          onChange={(val) => updateExpBullet(expIdx, bIdx, val)}
                          placeholder="Describe achievement..."
                          tag="span"
                          className="flex-1"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References Section (2 Column) */}
        {references && references.length > 0 && (
          <section className="space-y-2 pt-2 border-t border-neutral-300">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1">
              References
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {references.map((ref, idx) => (
                <div key={ref.id || idx} className="space-y-0.5">
                  <div className="font-bold text-neutral-950">{ref.name}</div>
                  <div className="text-[11px] text-neutral-600">
                    {ref.company} / {ref.position}
                  </div>
                  <div className="text-[10px] text-neutral-500">Phone: {ref.phone}</div>
                  <div className="text-[10px] text-neutral-500">Email: {ref.email}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
