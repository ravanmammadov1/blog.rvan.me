import React from "react";
import { ResumeData, ResumeThemeConfig } from "../resumeTypes";
import { Mail, Phone, MapPin, Linkedin, Globe, Calendar, Trophy, Star, Gem, Zap } from "lucide-react";
import { InlineEdit } from "../editor/InlineEdit";

interface TemplateProps {
  data: ResumeData;
  theme: ResumeThemeConfig;
  onUpdate?: (newData: ResumeData) => void;
}

export const Modern2ColTemplate: React.FC<TemplateProps> = ({ data, theme, onUpdate }) => {
  const { personalInfo, summary, experiences, education, skills, strengths, languages } = data;
  const accent = theme.accentColor || "#0284c7";

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

  const getStrengthIcon = (iconName?: string) => {
    switch (iconName) {
      case "star":
        return <Star size={16} style={{ color: accent }} className="shrink-0 mt-0.5 fill-current opacity-90" />;
      case "diamond":
        return <Gem size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />;
      case "trophy":
      default:
        return <Trophy size={16} style={{ color: accent }} className="shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-6 text-neutral-900 bg-white min-h-[1050px] leading-relaxed text-left">
      {/* ── TOP HEADER (NAME, SUBTITLE, CONTACT & TOP-RIGHT PHOTO) ── */}
      <header className="flex justify-between items-start gap-6 border-b-2 border-neutral-900 pb-5">
        <div className="space-y-1.5 flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-neutral-950">
            <InlineEdit
              value={personalInfo.fullName}
              onChange={(val) => updateField("personalInfo", "fullName", val)}
              placeholder="YOUR FULL NAME"
            />
          </h1>
          <p className="text-sm font-bold tracking-wide" style={{ color: accent }}>
            <InlineEdit
              value={personalInfo.title}
              onChange={(val) => updateField("personalInfo", "title", val)}
              placeholder="Experienced Title | Core Skills | Domain"
            />
          </p>

          {/* Contact Icons Bar */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 font-medium pt-2">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} style={{ color: accent }} />
                <InlineEdit
                  value={personalInfo.phone}
                  onChange={(val) => updateField("personalInfo", "phone", val)}
                  placeholder="Phone"
                />
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail size={12} style={{ color: accent }} />
                <InlineEdit
                  value={personalInfo.email}
                  onChange={(val) => updateField("personalInfo", "email", val)}
                  placeholder="Email"
                />
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin size={12} style={{ color: accent }} />
                <InlineEdit
                  value={personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                  onChange={(val) => updateField("personalInfo", "linkedin", val)}
                  placeholder="LinkedIn"
                />
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} style={{ color: accent }} />
                <InlineEdit
                  value={personalInfo.location}
                  onChange={(val) => updateField("personalInfo", "location", val)}
                  placeholder="City, Country"
                />
              </span>
            )}
          </div>
        </div>

        {/* Top-Right Circular Photo */}
        {personalInfo.showPhoto && (
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-neutral-300 shadow-lg shrink-0 bg-neutral-100">
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
      </header>

      {/* ── 2-COLUMN ASYMMETRIC BODY ── */}
      <div className="grid grid-cols-12 gap-8">
        {/* ── LEFT COLUMN (60%): SUMMARY, EXPERIENCE, EDUCATION ── */}
        <div className="col-span-7 space-y-6">
          {/* Summary */}
          {summary && (
            <section className="space-y-1.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                SUMMARY
              </h2>
              <InlineEdit
                value={summary}
                onChange={(val) => onUpdate && onUpdate({ ...data, summary: val })}
                placeholder="Write summary..."
                tag="p"
                className="text-xs text-neutral-700 leading-relaxed text-justify"
              />
            </section>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {experiences.map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="space-y-1.5 text-xs">
                    <div>
                      <div className="font-extrabold text-neutral-950 text-sm">
                        <InlineEdit
                          value={exp.title}
                          onChange={(val) => {
                            const updated = [...experiences];
                            updated[expIdx] = { ...updated[expIdx], title: val };
                            onUpdate && onUpdate({ ...data, experiences: updated });
                          }}
                          placeholder="Job Title"
                        />
                      </div>
                      <div className="font-bold text-xs" style={{ color: accent }}>
                        <InlineEdit
                          value={exp.company}
                          onChange={(val) => {
                            const updated = [...experiences];
                            updated[expIdx] = { ...updated[expIdx], company: val };
                            onUpdate && onUpdate({ ...data, experiences: updated });
                          }}
                          placeholder="Company"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-[10.5px] text-neutral-500 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {exp.location}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-1 pl-1 text-xs text-neutral-750">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-neutral-400 font-bold">•</span>
                          <InlineEdit
                            value={bullet}
                            onChange={(val) => {
                              const updatedExp = [...experiences];
                              const bullets = [...updatedExp[expIdx].bullets];
                              bullets[bIdx] = val;
                              updatedExp[expIdx] = { ...updatedExp[expIdx], bullets };
                              onUpdate && onUpdate({ ...data, experiences: updatedExp });
                            }}
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

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                EDUCATION
              </h2>
              <div className="space-y-2 text-xs">
                {education.map((edu, idx) => (
                  <div key={edu.id || idx}>
                    <div className="font-bold text-neutral-950">{edu.degree} in {edu.field}</div>
                    <div className="text-neutral-600">{edu.institution} ({edu.startDate} - {edu.endDate})</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT COLUMN (40%): SKILLS, STRENGTHS, LANGUAGES ── */}
        <div className="col-span-5 space-y-6">
          {/* Skills Badges Grid */}
          {skills.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                SKILLS
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.flatMap((s) => s.items).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md border border-neutral-300 bg-neutral-50 text-[11px] font-bold text-neutral-850 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Key Strengths with Colored Icons */}
          {strengths && strengths.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                STRENGTHS
              </h2>
              <div className="space-y-3">
                {strengths.map((str, idx) => (
                  <div key={str.id || idx} className="flex items-start gap-2.5 text-xs">
                    {getStrengthIcon(str.icon)}
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-neutral-950">{str.title}</div>
                      <div className="text-[11px] text-neutral-600 leading-snug">{str.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages with 5-Dot Rating Scale */}
          {languages.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-950 border-b-2 border-neutral-900 pb-0.5">
                LANGUAGES
              </h2>
              <div className="space-y-2 text-xs">
                {languages.map((lang, idx) => {
                  const rating = lang.rating || 5;
                  return (
                    <div key={lang.id || idx} className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-neutral-900">{lang.language}</div>
                        <div className="text-[10px] text-neutral-500 font-medium">{lang.proficiency}</div>
                      </div>
                      {/* 5-Dot Rating */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <span
                            key={dot}
                            className={`h-2.5 w-2.5 rounded-full transition-colors ${
                              dot <= rating ? "bg-sky-500" : "bg-neutral-200"
                            }`}
                            style={dot <= rating ? { backgroundColor: accent } : {}}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
