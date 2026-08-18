import React from "react";
import { ResumeData, EducationItem } from "../resumeTypes";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const EducationForm: React.FC<Props> = ({ data, onChange }) => {
  const education = data.education;

  const handleAddEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "",
      field: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
    };
    onChange({ ...data, education: [...education, newItem] });
  };

  const handleRemove = (idx: number) => {
    const updated = education.filter((_, i) => i !== idx);
    onChange({ ...data, education: updated });
  };

  const handleUpdate = (idx: number, field: keyof EducationItem, val: string) => {
    const updated = [...education];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, education: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <GraduationCap size={16} className="text-primary" />
          <span>Education ({education.length})</span>
        </div>
        <button
          type="button"
          onClick={handleAddEducation}
          className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus size={13} /> ADD DEGREE
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, idx) => (
          <div key={edu.id || idx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-primary uppercase">Degree #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor={`edu-inst-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Institution / University *</label>
                <input
                  id={`edu-inst-${idx}`}
                  name={`educationInstitution_${idx}`}
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdate(idx, "institution", e.target.value)}
                  placeholder="e.g. UC Berkeley, Harvard, Baku State University"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={`edu-degree-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Degree *</label>
                <input
                  id={`edu-degree-${idx}`}
                  name={`educationDegree_${idx}`}
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdate(idx, "degree", e.target.value)}
                  placeholder="e.g. Bachelor of Science, Master of Engineering"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={`edu-field-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Major / Field of Study *</label>
                <input
                  id={`edu-field-${idx}`}
                  name={`educationField_${idx}`}
                  type="text"
                  value={edu.field}
                  onChange={(e) => handleUpdate(idx, "field", e.target.value)}
                  placeholder="e.g. Computer Science, Information Technology"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={`edu-location-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Location</label>
                <input
                  id={`edu-location-${idx}`}
                  name={`educationLocation_${idx}`}
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleUpdate(idx, "location", e.target.value)}
                  placeholder="e.g. Berkeley, CA"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={`edu-end-date-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Graduation Year / Date</label>
                <input
                  id={`edu-end-date-${idx}`}
                  name={`educationEndDate_${idx}`}
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => handleUpdate(idx, "endDate", e.target.value)}
                  placeholder="e.g. 2019-05 or May 2019"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor={`edu-gpa-${idx}`} className="text-[11px] font-mono text-muted-foreground uppercase font-bold">GPA / Honors (Optional)</label>
                <input
                  id={`edu-gpa-${idx}`}
                  name={`educationGpa_${idx}`}
                  type="text"
                  value={edu.gpa || ""}
                  onChange={(e) => handleUpdate(idx, "gpa", e.target.value)}
                  placeholder="e.g. 3.85 / 4.00, Magna Cum Laude"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
