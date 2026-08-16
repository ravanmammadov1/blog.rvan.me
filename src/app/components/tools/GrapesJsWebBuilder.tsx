import React, { useEffect, useRef, useState, useCallback } from "react";
import grapesjs, { Editor } from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Eye,
  Edit3,
  Code2,
  Download,
  Trash2,
  Layers,
  Palette,
  LayoutGrid,
  Settings2,
  FolderKanban,
  Sparkles,
  Maximize2,
  Minimize2,
  Save,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  Archive,
} from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import {
  GrapesProject,
  getAllProjects,
  getActiveProjectId,
  createNewProject,
  updateProject,
  duplicateProject,
  deleteProject,
  setActiveProjectId,
} from "./grapesjs/projectStorage";
import { registerCustomBlocks } from "./grapesjs/blocks";
import { TEMPLATE_LIBRARY, WebTemplate } from "./grapesjs/templates";
import { TemplateModal } from "./grapesjs/TemplateModal";
import { ProjectManagerModal } from "./grapesjs/ProjectManagerModal";
import { ExportModal } from "./grapesjs/ExportModal";
import { UnsavedDialog } from "./grapesjs/UnsavedDialog";
import { downloadZipBundle } from "./grapesjs/exportHelpers";

export default function GrapesJsWebBuilder() {
  const { language } = useLanguage();
  const editorRef = useRef<Editor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Active Project & State
  const [projects, setProjects] = useState<GrapesProject[]>([]);
  const [activeProject, setActiveProject] = useState<GrapesProject | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  // UI Panels & Modes
  const [activeTab, setActiveTab] = useState<"blocks" | "styles" | "layers" | "traits">("blocks");
  const [activeDevice, setActiveDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isEditMode, setIsEditMode] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blockSearch, setBlockSearch] = useState("");

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [unsavedAction, setUnsavedAction] = useState<(() => void) | null>(null);

  // Initialize Projects from LocalStorage
  useEffect(() => {
    let projs = getAllProjects();
    const activeId = getActiveProjectId();

    if (projs.length === 0) {
      // Create initial starter project with default SaaS template
      const starter = TEMPLATE_LIBRARY[0];
      const initial = createNewProject(
        language === "az" ? "Mənim İlk Veb Səhifəm" : "My Landing Page",
        starter.html,
        starter.css
      );
      projs = [initial];
      setActiveProject(initial);
    } else {
      const current = projs.find((p) => p.id === activeId) || projs[0];
      setActiveProject(current);
      setActiveProjectId(current.id);
    }
    setProjects(projs);
  }, []);

  // Save current canvas state to active project
  const saveCurrentState = useCallback(() => {
    if (!editorRef.current || !activeProject) return;

    setSaveStatus("saving");
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss() || "";
    const grapesData = editorRef.current.getProjectData();

    const updated = updateProject(activeProject.id, {
      html,
      css,
      grapesData,
    });

    if (updated) {
      setActiveProject(updated);
      setProjects(getAllProjects());
      setHasUnsavedChanges(false);
      setSaveStatus("saved");
    }
  }, [activeProject]);

  // Initialize GrapesJS Editor once activeProject is loaded
  useEffect(() => {
    if (!containerRef.current || editorRef.current || !activeProject) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: "100%",
      width: "auto",
      storageManager: false, // We handle project management via our custom projectStorage system
      deviceManager: {
        devices: [
          { name: "desktop", width: "" },
          { name: "tablet", width: "768px", widthMedia: "992px" },
          { name: "mobile", width: "375px", widthMedia: "480px" },
        ],
      },
      panels: { defaults: [] },
      blockManager: {
        appendTo: "#gjs-blocks-container",
      },
      styleManager: {
        appendTo: "#gjs-styles-container",
        sectors: [
          {
            name: "Dimensions & Spacing",
            open: true,
            buildProps: ["width", "min-width", "max-width", "height", "min-height", "margin", "padding"],
          },
          {
            name: "Typography",
            open: false,
            buildProps: ["font-family", "font-size", "font-weight", "letter-spacing", "color", "line-height", "text-align", "text-decoration"],
          },
          {
            name: "Layout & Flexbox",
            open: false,
            buildProps: ["display", "flex-direction", "justify-content", "align-items", "flex-wrap", "gap"],
          },
          {
            name: "Decorations & Borders",
            open: false,
            buildProps: ["background-color", "border-radius", "border", "box-shadow", "opacity"],
          },
          {
            name: "Transforms & Transitions",
            open: false,
            buildProps: ["transition", "transform", "cursor"],
          },
        ],
      },
      layerManager: {
        appendTo: "#gjs-layers-container",
      },
      traitManager: {
        appendTo: "#gjs-traits-container",
      },
    });

    // Register all rich design blocks
    registerCustomBlocks(editor.BlockManager);

    // Load initial project data or starter HTML/CSS
    if (activeProject.grapesData) {
      editor.loadProjectData(activeProject.grapesData);
    } else if (activeProject.html || activeProject.css) {
      editor.setComponents(activeProject.html || "");
      editor.setStyle(activeProject.css || "");
    }

    // Change listeners for autosave tracking
    editor.on("component:update style:update block:drag:stop component:remove", () => {
      setHasUnsavedChanges(true);
      setSaveStatus("unsaved");
    });

    // Keyboard shortcuts inside editor iframe
    editor.on("load", () => {
      const doc = editor.Canvas.getDocument();
      if (doc) {
        doc.addEventListener("keydown", (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            saveCurrentState();
          }
          if ((e.ctrlKey || e.metaKey) && e.key === "d") {
            e.preventDefault();
            const selected = editor.getSelected();
            if (selected) {
              const clone = selected.clone();
              selected.parent()?.append(clone);
            }
          }
        });
      }
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, [activeProject?.id]);

  // Global Keyboard Shortcuts (Ctrl+S, Ctrl+Z, Ctrl+Shift+Z)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveCurrentState();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [saveCurrentState]);

  // Device & Viewport Switcher
  const handleSetDevice = (device: "desktop" | "tablet" | "mobile") => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(device);
    setActiveDevice(device);
  };

  // Canvas Zoom Controls
  const handleZoom = (delta: number) => {
    if (!editorRef.current) return;
    const newZoom = Math.min(Math.max(zoomLevel + delta, 50), 150);
    setZoomLevel(newZoom);
    editorRef.current.Canvas.setZoom(newZoom);
  };

  const handleResetZoom = () => {
    if (!editorRef.current) return;
    setZoomLevel(100);
    editorRef.current.Canvas.setZoom(100);
  };

  // Toggle Edit / Preview Mode
  const handleTogglePreview = () => {
    if (!editorRef.current) return;
    const isPreview = editorRef.current.Commands.isActive("preview");
    if (isPreview) {
      editorRef.current.stopCommand("preview");
      setIsEditMode(true);
    } else {
      editorRef.current.runCommand("preview");
      setIsEditMode(false);
    }
  };

  // Template Insertion
  const handleSelectTemplate = (template: WebTemplate) => {
    if (!editorRef.current) return;
    editorRef.current.setComponents(template.html);
    editorRef.current.setStyle(template.css);
    setHasUnsavedChanges(true);
    setSaveStatus("unsaved");
  };

  // Safe Project Switching with Unsaved Changes Guard
  const handleSwitchProject = (targetProject: GrapesProject) => {
    if (hasUnsavedChanges) {
      setUnsavedAction(() => () => {
        setActiveProjectId(targetProject.id);
        setActiveProject(targetProject);
        setHasUnsavedChanges(false);
        setSaveStatus("saved");
      });
      return;
    }

    setActiveProjectId(targetProject.id);
    setActiveProject(targetProject);
    setHasUnsavedChanges(false);
    setSaveStatus("saved");
  };

  const handleCreateNewProject = (name: string) => {
    const starter = TEMPLATE_LIBRARY[0];
    const newProj = createNewProject(name, starter.html, starter.css);
    setProjects(getAllProjects());
    setActiveProject(newProj);
    setHasUnsavedChanges(false);
    setSaveStatus("saved");
  };

  const handleRenameProject = (id: string, newName: string) => {
    const updated = updateProject(id, { name: newName });
    if (updated) {
      setProjects(getAllProjects());
      if (activeProject?.id === id) {
        setActiveProject(updated);
      }
    }
  };

  const handleDuplicateProject = (id: string) => {
    const copy = duplicateProject(id);
    if (copy) {
      setProjects(getAllProjects());
      setActiveProject(copy);
    }
  };

  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    const updatedList = getAllProjects();
    setProjects(updatedList);
    if (activeProject?.id === id) {
      setActiveProject(updatedList.length > 0 ? updatedList[0] : null);
    }
  };

  const handleImportProject = (imported: GrapesProject) => {
    setProjects(getAllProjects());
    setActiveProject(imported);
  };

  // Clear Canvas
  const handleClearCanvas = () => {
    if (window.confirm(language === "az" ? "Bütün kətanı təmizləmək istədiyinizdən əminsiniz?" : "Are you sure you want to clear the entire canvas?")) {
      editorRef.current?.setComponents("");
      editorRef.current?.setStyle("");
      setHasUnsavedChanges(true);
      setSaveStatus("unsaved");
    }
  };

  // Quick ZIP Export
  const handleQuickZip = async () => {
    if (!editorRef.current || !activeProject) return;
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss() || "";
    await downloadZipBundle(activeProject.name, html, css);
  };

  return (
    <div
      className={`flex flex-col bg-[#0b0b0d] text-[#ededed] border border-white/15 rounded-3xl overflow-hidden shadow-2xl transition-all font-sans ${
        isFullscreen ? "fixed inset-2 md:inset-4 z-50 rounded-2xl" : "h-[880px] w-full"
      }`}
    >
      {/* ── TOP CONTROL TOOLBAR ── */}
      <header className="h-16 border-b border-white/10 bg-black/70 backdrop-blur-2xl px-4 md:px-6 flex items-center justify-between gap-3 shrink-0 select-none">
        {/* Left: Project Branding, Name & Projects Drawer */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-primary transition flex items-center gap-2 shrink-0 group"
            title="Open Project Manager"
          >
            <FolderKanban size={15} className="group-hover:scale-110 transition-transform" />
            <span className="font-mono text-xs font-bold uppercase hidden sm:inline">
              {language === "az" ? "LAYİHƏLƏR" : "PROJECTS"}
            </span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block shrink-0" />

          {/* Active Project Name & Status */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-white truncate max-w-[140px] md:max-w-[200px]">
              {activeProject?.name || "Untitled Project"}
            </span>

            {/* Save Status Indicator */}
            {saveStatus === "saved" ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                <CheckCircle2 size={10} /> {language === "az" ? "Saxlanıldı" : "Saved"}
              </span>
            ) : saveStatus === "saving" ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                <Clock size={10} className="animate-spin" /> {language === "az" ? "Yazılır..." : "Saving..."}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0">
                ● {language === "az" ? "Dəyişikliklər var" : "Unsaved"}
              </span>
            )}
          </div>

          {/* Templates Trigger */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-muted-foreground hover:text-white transition flex items-center gap-1.5 shrink-0"
            title="Browse Templates"
          >
            <Sparkles size={13} className="text-primary" />
            <span className="hidden md:inline">{language === "az" ? "Şablonlar" : "Templates"}</span>
          </button>
        </div>

        {/* Center: Device Viewport & Zoom Controls */}
        <div className="flex items-center gap-3">
          {/* Device Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
            <button
              onClick={() => handleSetDevice("desktop")}
              className={`p-1.5 rounded-lg transition ${
                activeDevice === "desktop" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white"
              }`}
              title="Desktop View (100%)"
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => handleSetDevice("tablet")}
              className={`p-1.5 rounded-lg transition ${
                activeDevice === "tablet" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white"
              }`}
              title="Tablet View (768px)"
            >
              <Tablet size={14} />
            </button>
            <button
              onClick={() => handleSetDevice("mobile")}
              className={`p-1.5 rounded-lg transition ${
                activeDevice === "mobile" ? "bg-primary text-black font-bold" : "text-muted-foreground hover:text-white"
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone size={14} />
            </button>
          </div>

          {/* Viewport Dimension Tag */}
          <span className="text-[10px] font-mono text-muted-foreground/80 hidden lg:inline border border-white/5 bg-white/[0.02] px-2.5 py-1 rounded-lg">
            {activeDevice === "desktop" ? "Desktop • 100%" : activeDevice === "tablet" ? "Tablet • 768px" : "Mobile • 375px"}
          </span>

          {/* Zoom controls */}
          <div className="hidden xl:flex items-center gap-1 bg-white/5 border border-white/10 p-0.5 rounded-xl text-xs font-mono">
            <button onClick={() => handleZoom(-10)} className="p-1 text-muted-foreground hover:text-white" title="Zoom Out">
              <ZoomOut size={12} />
            </button>
            <button onClick={handleResetZoom} className="px-1.5 text-[10px] text-muted-foreground hover:text-white" title="Reset Zoom">
              {zoomLevel}%
            </button>
            <button onClick={() => handleZoom(10)} className="p-1 text-muted-foreground hover:text-white" title="Zoom In">
              <ZoomIn size={12} />
            </button>
          </div>
        </div>

        {/* Right: Mode Toggle (Edit/Preview), Undo/Redo, Save & Export */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => editorRef.current?.UndoManager.undo()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo size={13} />
          </button>
          <button
            onClick={() => editorRef.current?.UndoManager.redo()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo size={13} />
          </button>

          {/* Edit / Preview Toggle */}
          <button
            onClick={handleTogglePreview}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center gap-1.5 ${
              !isEditMode
                ? "bg-amber-400 text-black border-amber-400"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
            }`}
            title="Switch Edit / Preview"
          >
            {!isEditMode ? <Edit3 size={13} /> : <Eye size={13} />}
            <span className="hidden sm:inline">{!isEditMode ? "EDIT" : "PREVIEW"}</span>
          </button>

          {/* Save Button */}
          <button
            onClick={saveCurrentState}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs transition flex items-center gap-1.5"
            title="Save Project (Ctrl+S)"
          >
            <Save size={13} className="text-primary" />
            <span className="hidden sm:inline">{language === "az" ? "YADDA SAXLA" : "SAVE"}</span>
          </button>

          {/* Export Code Modal Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-primary text-black font-bold text-xs font-mono transition flex items-center gap-1.5 hover:scale-105"
            title="Export HTML, CSS, React JSX, Tailwind, ZIP"
          >
            <Code2 size={13} />
            <span className="hidden md:inline">{language === "az" ? "İXRAC ET" : "EXPORT"}</span>
          </button>

          {/* Quick ZIP download */}
          <button
            onClick={handleQuickZip}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition hidden lg:flex"
            title="Quick Download ZIP Archive"
          >
            <Archive size={14} />
          </button>

          {/* Clear canvas */}
          <button
            onClick={handleClearCanvas}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-muted-foreground hover:text-rose-400 transition"
            title="Clear Canvas"
          >
            <Trash2 size={13} />
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </header>

      {/* ── WORKSPACE BODY: CANVAS + SIDEBAR ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canvas Area */}
        <div className="flex-1 h-full bg-[#050505] overflow-hidden relative flex flex-col justify-center items-center">
          <div ref={containerRef} className="h-full w-full" />
        </div>

        {/* Sidebar Manager: Blocks, Styles, Layers, Traits (hidden in Preview mode) */}
        {isEditMode && (
          <aside className="w-80 md:w-88 border-l border-white/10 bg-[#0f0f12] flex flex-col shrink-0">
            {/* Tab Selector */}
            <div className="grid grid-cols-4 border-b border-white/10 bg-black/40 p-1">
              <button
                onClick={() => setActiveTab("blocks")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                  activeTab === "blocks" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Components & Blocks"
              >
                <LayoutGrid size={13} />
                <span>Blocks</span>
              </button>
              <button
                onClick={() => setActiveTab("styles")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                  activeTab === "styles" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Style properties"
              >
                <Palette size={13} />
                <span>Styles</span>
              </button>
              <button
                onClick={() => setActiveTab("layers")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                  activeTab === "layers" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="DOM Layers"
              >
                <Layers size={13} />
                <span>Layers</span>
              </button>
              <button
                onClick={() => setActiveTab("traits")}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-mono font-bold uppercase transition ${
                  activeTab === "traits" ? "bg-primary text-black" : "text-muted-foreground hover:text-white"
                }`}
                title="Component settings"
              >
                <Settings2 size={13} />
                <span>Traits</span>
              </button>
            </div>

            {/* Block Search Bar (shown when Blocks tab active) */}
            {activeTab === "blocks" && (
              <div className="p-3 border-b border-white/10 bg-black/20">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={language === "az" ? "Blok axtar..." : "Filter blocks..."}
                    value={blockSearch}
                    onChange={(e) => {
                      setBlockSearch(e.target.value);
                      if (editorRef.current) {
                        const blocks = editorRef.current.BlockManager.getAll();
                        const query = e.target.value.toLowerCase();
                        blocks.forEach((block: any) => {
                          const label = (block.get("label") || "").toString().toLowerCase();
                          const category = (block.get("category")?.id || block.get("category") || "").toString().toLowerCase();
                          const matches = label.includes(query) || category.includes(query);
                          const el = document.getElementById(block.getId());
                          if (el) el.style.display = matches ? "block" : "none";
                        });
                      }
                    }}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Tab Content Containers */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div id="gjs-blocks-container" className={activeTab === "blocks" ? "block" : "hidden"} />
              <div id="gjs-styles-container" className={activeTab === "styles" ? "block" : "hidden"} />
              <div id="gjs-layers-container" className={activeTab === "layers" ? "block" : "hidden"} />
              <div id="gjs-traits-container" className={activeTab === "traits" ? "block" : "hidden"} />
            </div>
          </aside>
        )}
      </div>

      {/* ── MODALS ── */}
      {/* 1. Template Library Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        language={language}
      />

      {/* 2. Project Manager Modal */}
      <ProjectManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        activeProjectId={activeProject?.id || null}
        onSelectProject={handleSwitchProject}
        onCreateNewProject={handleCreateNewProject}
        onRenameProject={handleRenameProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onImportProject={handleImportProject}
        language={language}
      />

      {/* 3. Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        projectName={activeProject?.name || "My Project"}
        html={editorRef.current?.getHtml() || ""}
        css={editorRef.current?.getCss() || ""}
        language={language}
      />

      {/* 4. Unsaved Changes Guard Dialog */}
      <UnsavedDialog
        isOpen={!!unsavedAction}
        onSave={() => {
          saveCurrentState();
          if (unsavedAction) unsavedAction();
          setUnsavedAction(null);
        }}
        onDiscard={() => {
          if (unsavedAction) unsavedAction();
          setUnsavedAction(null);
        }}
        onCancel={() => setUnsavedAction(null)}
        language={language}
      />
    </div>
  );
}
