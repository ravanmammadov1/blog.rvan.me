import React from "react";
import { ResumeData, ReferenceItem } from "../resumeTypes";
import { Users, Plus, Trash2 } from "lucide-react";

interface Props {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
}

export const ReferencesForm: React.FC<Props> = ({ data, onChange }) => {
  const references = data.references || [];

  const handleAdd = () => {
    const newRef: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: "",
      position: "CEO / Director",
      company: "",
      phone: "",
      email: "",
    };
    onChange({ ...data, references: [...references, newRef] });
  };

  const handleRemove = (idx: number) => {
    onChange({ ...data, references: references.filter((_, i) => i !== idx) });
  };

  const handleUpdate = (idx: number, field: keyof ReferenceItem, val: string) => {
    const updated = [...references];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, references: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Users size={16} className="text-primary" />
          <span>Professional References ({references.length})</span>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-xs font-mono font-bold text-primary hover:text-white bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
        >
          <Plus size={13} /> ADD REFERENCE
        </button>
      </div>

      <div className="space-y-4">
        {references.map((ref, idx) => (
          <div key={ref.id || idx} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono font-bold text-primary uppercase">Reference #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-red-400 hover:text-red-300 p-1 cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Referee Name *</label>
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => handleUpdate(idx, "name", e.target.value)}
                  placeholder="e.g. Estelle Darcy"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Company / Organization *</label>
                <input
                  type="text"
                  value={ref.company}
                  onChange={(e) => handleUpdate(idx, "company", e.target.value)}
                  placeholder="e.g. Wardiere Inc."
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Position / Title</label>
                <input
                  type="text"
                  value={ref.position}
                  onChange={(e) => handleUpdate(idx, "position", e.target.value)}
                  placeholder="e.g. Chief Executive Officer"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-muted-foreground uppercase font-bold">Contact Phone & Email</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={ref.phone}
                    onChange={(e) => handleUpdate(idx, "phone", e.target.value)}
                    placeholder="Phone"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => handleUpdate(idx, "email", e.target.value)}
                    placeholder="Email"
                    className="w-1/2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
