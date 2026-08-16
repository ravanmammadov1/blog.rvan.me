import React from "react";
import { AlertTriangle, Save, Trash2, X } from "lucide-react";

interface UnsavedDialogProps {
  isOpen: boolean;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
  language: string;
}

export const UnsavedDialog: React.FC<UnsavedDialogProps> = ({
  isOpen,
  onSave,
  onDiscard,
  onCancel,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#121214] border border-amber-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4 text-amber-400">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {language === "az" ? "Yadda saxlanılmamış dəyişikliklər" : "Unsaved Changes"}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {language === "az" ? "Cari layihənizdə dəyişikliklər mövcuddur" : "You have unsaved changes in current canvas"}
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
          {language === "az"
            ? "Yeni layihəyə keçməzdən əvvəl cari layihəni saxlamaq istəyirsiniz, yoxsa dəyişiklikləri ləğv edəcəksiniz?"
            : "Would you like to save your work before proceeding, or discard recent changes?"}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-muted-foreground hover:text-white transition"
          >
            {language === "az" ? "Ləğv et" : "Cancel"}
          </button>
          <button
            onClick={onDiscard}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>{language === "az" ? "Ləğv et" : "Discard"}</span>
          </button>
          <button
            onClick={onSave}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary text-black text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 hover:scale-105"
          >
            <Save size={13} />
            <span>{language === "az" ? "Yadda Saxla" : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
