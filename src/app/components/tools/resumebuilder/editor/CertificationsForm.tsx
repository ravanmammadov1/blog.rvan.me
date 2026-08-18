import React from "react";
import { ResumeData, CertificationItem, LanguageItem } from "../resumeTypes";
import { Award, Globe, Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const CertificationsForm: React.FC<Props> = ({ data, onChange }) => {
  const certifications = data.certifications;
  const languages = data.languages;

  const handleAddCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: "",
      issuer: "",
      date: "",
    };
    onChange({ ...data, certifications: [...certifications, newCert] });
  };

  const handleRemoveCert = (idx: number) => {
    onChange({ ...data, certifications: certifications.filter((_, i) => i !== idx) });
  };

  const handleUpdateCert = (idx: number, field: keyof CertificationItem, val: string) => {
    const updated = [...certifications];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, certifications: updated });
  };

  const handleAddLang = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: "",
      proficiency: "Professional",
    };
    onChange({ ...data, languages: [...languages, newLang] });
  };

  const handleRemoveLang = (idx: number) => {
    onChange({ ...data, languages: languages.filter((_, i) => i !== idx) });
  };

  const handleUpdateLang = (idx: number, field: keyof LanguageItem, val: any) => {
    const updated = [...languages];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, languages: updated });
  };

  return (
    <div className="space-y-6">
      {/* Certifications */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Award size={16} className="text-primary" />
            <span>Certifications & Honors ({certifications.length})</span>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={13} /> ADD CERTIFICATE
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((c, idx) => (
            <div key={c.id || idx} className="p-3 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-2">
              <input
                id={`cert-name-${idx}`}
                name={`certName_${idx}`}
                type="text"
                value={c.name}
                onChange={(e) => handleUpdateCert(idx, "name", e.target.value)}
                placeholder="Certification Name (e.g. AWS Solutions Architect)"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <input
                id={`cert-issuer-${idx}`}
                name={`certIssuer_${idx}`}
                type="text"
                value={c.issuer}
                onChange={(e) => handleUpdateCert(idx, "issuer", e.target.value)}
                placeholder="Issuer (e.g. Amazon, Google)"
                className="w-36 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <input
                id={`cert-date-${idx}`}
                name={`certDate_${idx}`}
                type="text"
                value={c.date}
                onChange={(e) => handleUpdateCert(idx, "date", e.target.value)}
                placeholder="Year (e.g. 2023)"
                className="w-20 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveCert(idx)}
                className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-3 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Globe size={16} className="text-primary" />
            <span>Spoken Languages ({languages.length})</span>
          </div>
          <button
            type="button"
            onClick={handleAddLang}
            className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Plus size={13} /> ADD LANGUAGE
          </button>
        </div>

        <div className="space-y-3">
          {languages.map((l, idx) => (
            <div key={l.id || idx} className="p-3 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center gap-2">
              <input
                id={`lang-name-${idx}`}
                name={`langName_${idx}`}
                type="text"
                value={l.language}
                onChange={(e) => handleUpdateLang(idx, "language", e.target.value)}
                placeholder="Language (e.g. English, Azerbaijani, German)"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
              />
              <select
                id={`lang-prof-${idx}`}
                name={`langProficiency_${idx}`}
                value={l.proficiency}
                onChange={(e) => handleUpdateLang(idx, "proficiency", e.target.value)}
                className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none cursor-pointer"
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Basic">Basic</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveLang(idx)}
                className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
