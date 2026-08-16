import React, { useState, useRef } from "react";
import {
  GrapesProject,
  formatTimeAgo,
  exportProjectToJson,
  importProjectFromJson,
} from "./projectStorage";
import {
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Edit2,
  Download,
  Upload,
  Check,
  X,
  FileCode,
  AlertCircle,
} from "lucide-react";

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: GrapesProject[];
  activeProjectId: string | null;
  onSelectProject: (project: GrapesProject) => void;
  onCreateNewProject: (name: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onImportProject: (imported: GrapesProject) => void;
  language: string;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateNewProject,
  onRenameProject,
  onDuplicateProject,
  onDeleteProject,
  onImportProject,
  language,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleStartRename = (proj: GrapesProject) => {
    setEditingId(proj.id);
    setEditingName(proj.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      onRenameProject(id, editingName.trim());
    }
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    onCreateNewProject(newProjectName.trim());
    setNewProjectName("");
    setIsCreating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const imported = importProjectFromJson(text);
        onImportProject(imported);
        setErrorMessage("");
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to import JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#101012] border border-white/15 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <FolderKanban size={20} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {language === "az" ? "Layihələrim" : "My Projects"}
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                {language === "az" ? "Bütün saxlanılmış səhifə layihələrini idarə edin" : "Manage and switch between saved visual web projects"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-muted-foreground hover:text-white transition flex items-center gap-1.5"
              title="Import Project JSON"
            >
              <Upload size={13} />
              <span className="hidden sm:inline">{language === "az" ? "İdxal et" : "Import"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono text-rose-400 flex items-center gap-2">
            <AlertCircle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Bar / New Project Trigger */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition hover:scale-[1.02]"
            >
              <Plus size={14} />
              <span>{language === "az" ? "+ Yeni Layihə" : "+ New Project"}</span>
            </button>
          ) : (
            <form onSubmit={handleCreateSubmit} className="flex items-center gap-2 w-full">
              <input
                type="text"
                placeholder={language === "az" ? "Layihənin adı..." : "Project name (e.g. My Landing Page)..."}
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                autoFocus
                className="flex-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase"
              >
                {language === "az" ? "Yarat" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 text-muted-foreground hover:text-white text-xs font-mono"
              >
                {language === "az" ? "Ləğv" : "Cancel"}
              </button>
            </form>
          )}

          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            {projects.length} {language === "az" ? "layihə mövcuddur" : "projects saved"}
          </span>
        </div>

        {/* Project List */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-3">
          {projects.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground font-mono text-xs">
              {language === "az" ? "Hələ heç bir layihə saxlanılmayıb. '+ Yeni Layihə' düyməsinə klikləyin." : "No saved projects yet. Click '+ New Project' to start."}
            </div>
          ) : (
            projects.map((proj) => {
              const isActive = proj.id === activeProjectId;
              const isEditing = editingId === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`group rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 ${
                    isActive
                      ? "border-primary/60 bg-primary/[0.04] shadow-[0_0_20px_rgba(97,197,173,0.1)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Left Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${
                        isActive
                          ? "bg-primary text-black border-primary"
                          : "bg-white/5 text-muted-foreground border-white/10"
                      }`}
                    >
                      <FileCode size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                            className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 text-xs text-white font-mono"
                          />
                          <button
                            onClick={() => handleSaveRename(proj.id)}
                            className="p-1 rounded-md bg-primary text-black"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{proj.name}</h4>
                          {isActive && (
                            <span className="text-[9px] font-mono font-bold uppercase text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full">
                              {language === "az" ? "AKTİV" : "ACTIVE"}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                        {language === "az" ? "Yeniləndi: " : "Updated: "} {formatTimeAgo(proj.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectProject(proj);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-primary text-black font-mono font-bold text-xs uppercase hover:scale-105 transition"
                      >
                        {language === "az" ? "Aç" : "Open"}
                      </button>
                    )}

                    <button
                      onClick={() => handleStartRename(proj)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
                      title="Rename"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
                      title="Duplicate"
                    >
                      <Copy size={13} />
                    </button>

                    <button
                      onClick={() => exportProjectToJson(proj)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
                      title="Export as JSON"
                    >
                      <Download size={13} />
                    </button>

                    {projects.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(language === "az" ? `"${proj.name}" layihəsini silmək istədiyinizdən əminsiniz?` : `Are you sure you want to delete "${proj.name}"?`)) {
                            onDeleteProject(proj.id);
                          }
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-muted-foreground hover:text-rose-400 transition"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
