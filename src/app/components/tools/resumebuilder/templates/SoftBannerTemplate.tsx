import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Quote, CheckCircle2 } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const SoftBannerTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, certifications, languages } = data;
  const accent = theme.accentColor || "#3b82f6";
  const bannerBg = "#dbeafe"; // Light soft pastel blue

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

  return (
    <div className="bg-white text-neutral-900 min-h-[1050px] leading-relaxed text-left">
      {/* ── TOP SOFT PASTEL BANNER ── */}
      <header className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6" style={{ backgroundColor: bannerBg }}>
        {/* Left: Avatar Photo */}
        {personalInfo.showPhoto && (
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0 bg-white">
            {personalInfo.photoUrl ? (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <span className="text-xs font-mono">No Photo</span>
              </div>
            )}
          </div>
        )}

        {/* Center/Right: Name, Title & Contact Information */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide text-neutral-900">
            <InlineEdit
              value={personalInfo.fullName}
              onChange={(val) => updateField("personalInfo", "fullName", val)}
              placeholder="EMILY CARTER"
            />
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-neutral-600">
            <InlineEdit
              value={personalInfo.title}
              onChange={(val) => updateField("personalInfo", "title", val)}
              placeholder="Professional Title"
            />
          </p>
        </div>

        {/* Right Contact Details */}
        <div className="text-xs text-neutral-700 font-medium space-y-1.5 shrink-0 text-left">
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={12} style={{ color: accent }} />
              <InlineEdit
                value={personalInfo.phone}
                onChange={(val) => updateField("personalInfo", "phone", val)}
                placeholder="Phone"
              />
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={12} style={{ color: accent }} />
              <InlineEdit
                value={personalInfo.email}
                onChange={(val) => updateField("personalInfo", "email", val)}
                placeholder="Email"
              />
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2">
              <Linkedin size={12} style={{ color: accent }} />
              <InlineEdit
                value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                onChange={(val) => updateField("personalInfo", "linkedin", val)}
                placeholder="LinkedIn"
              />
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin size={12} style={{ color: accent }} />
              <InlineEdit
                value={personalInfo.location}
                onChange={(val) => updateField("personalInfo", "location", val)}
                placeholder="Location"
              />
            </div>
          )}
        </div>
      </header>

      {/* ── 2-COLUMN BODY ── */}
      <div className="p-8 md:p-10 grid grid-cols-12 gap-8">
        {/* Left Column (40%) */}
        <div className="col-span-5 space-y-6">
          {/* Career Overview with Quote */}
          {summary && (
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Career Overview
              </h2>
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-2.5">
                <Quote size={18} className="text-blue-400 shrink-0 mt-0.5 fill-current opacity-70" />
                <InlineEdit
                  value={summary}
                  onChange={(val) => onUpdate && onUpdate({ ...data, summary: val })}
                  placeholder="Career overview statement..."
                  tag="p"
                  className="text-xs text-neutral-750 leading-relaxed text-justify"
                />
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Skills
              </h2>
              <div className="space-y-1.5 text-xs text-neutral-800">
                {skills.flatMap((s) => s.items).map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-medium">
                    <span className="text-blue-500 font-bold">✦</span>
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Languages
              </h2>
              <div className="space-y-2.5 text-xs">
                {languages.map((lang, idx) => {
                  const rating = lang.rating || 5;
                  return (
                    <div key={lang.id || idx} className="space-y-1">
                      <div className="flex justify-between items-baseline font-bold text-neutral-900">
                        <span>{lang.language}</span>
                        <span className="text-[11px] text-neutral-500 font-normal">{rating * 2}/10</span>
                      </div>
                      {/* 10-Dot Progress Indicator */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((dot) => (
                          <span
                            key={dot}
                            className={`h-2 w-2 rounded-full ${
                              dot <= rating * 2 ? "bg-blue-500" : "bg-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Certifications
              </h2>
              <ul className="space-y-1.5 text-xs text-neutral-800">
                {certifications.map((c) => (
                  <li key={c.id} className="flex items-start gap-1.5">
                    <CheckCircle2 size={13} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{c.name}</span>
                      {c.issuer && <span className="text-neutral-500 text-[11px]"> ({c.issuer})</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column (60%) */}
        <div className="col-span-7 space-y-6">
          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Work Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="space-y-1 text-xs">
                    <div className="font-extrabold text-neutral-950 text-sm">{exp.title}</div>
                    <div className="text-neutral-600 font-semibold">{exp.company} • {exp.location}</div>
                    <div className="text-[11px] text-neutral-500 font-medium italic">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1.5 space-y-1 text-xs text-neutral-750">
                        {exp.bullets.filter(Boolean).map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-snug">{bullet}</li>
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
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 pb-1 border-b-2" style={{ borderColor: bannerBg }}>
                Education
              </h2>
              <div className="space-y-2.5 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-0.5">
                    <div className="font-bold text-neutral-950">{edu.degree}</div>
                    <div className="text-neutral-600">{edu.institution} • {edu.location}</div>
                    <div className="text-[11px] text-neutral-500">{edu.startDate} – {edu.endDate} {edu.honors && `(${edu.honors})`}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
