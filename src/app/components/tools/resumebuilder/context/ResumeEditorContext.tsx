import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ResumeData, ResumeThemeConfig, TemplateId, ResumeFont, ResumeDensity, PaperSize, ExperienceItem, EducationItem, SkillCategory, ProjectItem, ReferenceItem } from "../resumeTypes";

export interface SelectedElementMeta {
  id: string;
  type: "text" | "photo" | "section" | "bullet" | "skill";
  sectionKey?: string;
  rect?: DOMRect;
  value?: string;
  path?: string;
}

export interface ResumeEditorContextType {
  data: ResumeData;
  theme: ResumeThemeConfig;
  setData: (newData: ResumeData | ((prev: ResumeData) => ResumeData)) => void;
  setTheme: (newTheme: ResumeThemeConfig | ((prev: ResumeThemeConfig) => ResumeThemeConfig)) => void;

  // History / Undo / Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Selection & Active Element
  selectedElement: SelectedElementMeta | null;
  selectElement: (meta: SelectedElementMeta | null) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;

  // Direct In-Place Actions
  updateFieldByPath: (path: string, value: any) => void;

  // Experience Actions
  addExperience: () => void;
  removeExperience: (index: number) => void;
  addExpBullet: (expIndex: number) => void;
  removeExpBullet: (expIndex: number, bulletIndex: number) => void;
  updateExpBullet: (expIndex: number, bulletIndex: number, value: string) => void;

  // Education Actions
  addEducation: () => void;
  removeEducation: (index: number) => void;

  // Skills Actions
  addSkillCategory: () => void;
  removeSkillCategory: (catIndex: number) => void;
  addSkillItem: (catIndex: number, skillName?: string) => void;
  removeSkillItem: (catIndex: number, skillIndex: number) => void;
  updateSkillItem: (catIndex: number, skillIndex: number, value: string) => void;

  // Projects Actions
  addProject: () => void;
  removeProject: (index: number) => void;

  // References Actions
  addReference: () => void;
  removeReference: (index: number) => void;

  // Photo Actions
  updatePhoto: (url: string) => void;
  removePhoto: () => void;
  togglePhoto: () => void;

  // Zoom & View
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;

  // Active Left Drawer Tab
  activeDrawer: "design" | "content" | "style" | "templates" | "elements" | "styles" | null;
  setActiveDrawer: (tab: "design" | "content" | "style" | "templates" | "elements" | "styles" | null) => void;
}

const ResumeEditorContext = createContext<ResumeEditorContextType | null>(null);

export const useResumeEditor = () => {
  const context = useContext(ResumeEditorContext);
  if (!context) {
    throw new Error("useResumeEditor must be used within a ResumeEditorProvider");
  }
  return context;
};

interface ProviderProps {
  initialData: ResumeData;
  initialTheme: ResumeThemeConfig;
  children: React.ReactNode;
}

export const ResumeEditorProvider: React.FC<ProviderProps> = ({ initialData, initialTheme, children }) => {
  const [data, setDataInternal] = useState<ResumeData>(initialData);
  const [theme, setTheme] = useState<ResumeThemeConfig>(initialTheme);

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  // Undo / Redo Stacks
  const [history, setHistory] = useState<ResumeData[]>([initialData]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isUndoRedoAction = useRef(false);

  // Selection & Editing
  const [selectedElement, setSelectedElement] = useState<SelectedElementMeta | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Zoom & Drawer
  const [zoom, setZoom] = useState<number>(1.0);
  const [activeDrawer, setActiveDrawer] = useState<"design" | "content" | "style" | "templates" | "elements" | "styles" | null>(null);

  // Wrapper for updating data with history tracking
  const setData = useCallback((newDataOrUpdater: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    setDataInternal((prev) => {
      const next = typeof newDataOrUpdater === "function" ? newDataOrUpdater(prev) : newDataOrUpdater;
      if (!isUndoRedoAction.current) {
        setHistory((hist) => {
          const trimmed = hist.slice(0, historyIndex + 1);
          return [...trimmed, next];
        });
        setHistoryIndex((idx) => idx + 1);
      }
      isUndoRedoAction.current = false;
      return next;
    });
  }, [historyIndex]);

  // Undo / Redo Implementation
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const prevData = history[historyIndex - 1];
      setHistoryIndex((idx) => idx - 1);
      setDataInternal(prevData);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextData = history[historyIndex + 1];
      setHistoryIndex((idx) => idx + 1);
      setDataInternal(nextData);
    }
  }, [history, historyIndex]);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Shift+Z, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if (e.key === "Escape") {
        setSelectedElement(null);
        setEditingId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Update Field by Path (e.g. "personalInfo.fullName" or "experiences.0.title")
  const updateFieldByPath = useCallback((path: string, value: any) => {
    setData((prev) => {
      const clone = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let curr = clone;
      for (let i = 0; i < parts.length - 1; i++) {
        curr = curr[parts[i]];
      }
      curr[parts[parts.length - 1]] = value;
      return clone;
    });
  }, [setData]);

  // Experience Actions
  const addExperience = useCallback(() => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      title: "New Role Title",
      company: "Company Name",
      location: "Location",
      startDate: "2024",
      endDate: "Present",
      current: true,
      bullets: ["Led key initiatives resulting in quantifiable impact."],
    };
    setData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences],
    }));
    setEditingId(`${newExp.id}-title`);
  }, [setData]);

  const removeExperience = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
    setSelectedElement(null);
  }, [setData]);

  const addExpBullet = useCallback((expIndex: number) => {
    setData((prev) => {
      const exps = [...prev.experiences];
      if (exps[expIndex]) {
        exps[expIndex] = {
          ...exps[expIndex],
          bullets: [...exps[expIndex].bullets, "New achievement or responsibility."],
        };
      }
      return { ...prev, experiences: exps };
    });
  }, [setData]);

  const removeExpBullet = useCallback((expIndex: number, bulletIndex: number) => {
    setData((prev) => {
      const exps = [...prev.experiences];
      if (exps[expIndex]) {
        exps[expIndex] = {
          ...exps[expIndex],
          bullets: exps[expIndex].bullets.filter((_, i) => i !== bulletIndex),
        };
      }
      return { ...prev, experiences: exps };
    });
  }, [setData]);

  const updateExpBullet = useCallback((expIndex: number, bulletIndex: number, value: string) => {
    setData((prev) => {
      const exps = [...prev.experiences];
      if (exps[expIndex]) {
        const bullets = [...exps[expIndex].bullets];
        bullets[bulletIndex] = value;
        exps[expIndex] = { ...exps[expIndex], bullets };
      }
      return { ...prev, experiences: exps };
    });
  }, [setData]);

  // Education Actions
  const addEducation = useCallback(() => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Science",
      field: "Your Field of Study",
      institution: "University / Institution",
      location: "City, Country",
      startDate: "2020",
      endDate: "2024",
    };
    setData((prev) => ({
      ...prev,
      education: [newEdu, ...prev.education],
    }));
  }, [setData]);

  const removeEducation = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
    setSelectedElement(null);
  }, [setData]);

  // Skill Actions
  const addSkillCategory = useCallback(() => {
    const newCat: SkillCategory = {
      id: `sk-${Date.now()}`,
      name: "New Skills Group",
      items: ["Skill 1", "Skill 2"],
    };
    setData((prev) => ({
      ...prev,
      skills: [...prev.skills, newCat],
    }));
  }, [setData]);

  const removeSkillCategory = useCallback((catIndex: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== catIndex),
    }));
    setSelectedElement(null);
  }, [setData]);

  const addSkillItem = useCallback((catIndex: number, skillName: string = "New Skill") => {
    setData((prev) => {
      const skills = [...prev.skills];
      if (skills[catIndex]) {
        skills[catIndex] = {
          ...skills[catIndex],
          items: [...skills[catIndex].items, skillName],
        };
      }
      return { ...prev, skills };
    });
  }, [setData]);

  const removeSkillItem = useCallback((catIndex: number, skillIndex: number) => {
    setData((prev) => {
      const skills = [...prev.skills];
      if (skills[catIndex]) {
        skills[catIndex] = {
          ...skills[catIndex],
          items: skills[catIndex].items.filter((_, i) => i !== skillIndex),
        };
      }
      return { ...prev, skills };
    });
  }, [setData]);

  const updateSkillItem = useCallback((catIndex: number, skillIndex: number, value: string) => {
    setData((prev) => {
      const skills = [...prev.skills];
      if (skills[catIndex]) {
        const items = [...skills[catIndex].items];
        items[skillIndex] = value;
        skills[catIndex] = { ...skills[catIndex], items };
      }
      return { ...prev, skills };
    });
  }, [setData]);

  // Project Actions
  const addProject = useCallback(() => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "New Project Name",
      role: "Lead Creator",
      techStack: ["React", "TypeScript", "Node.js"],
      link: "https://project.dev",
      description: ["Designed and launched high-impact application."],
    };
    setData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj],
    }));
  }, [setData]);

  const removeProject = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }));
    setSelectedElement(null);
  }, [setData]);

  // Reference Actions
  const addReference = useCallback(() => {
    const newRef: ReferenceItem = {
      id: `ref-${Date.now()}`,
      name: "Reference Name",
      position: "Director / Manager",
      company: "Company Name",
      phone: "+1 (555) 000-0000",
      email: "reference@company.com",
    };
    setData((prev) => ({
      ...prev,
      references: [...(prev.references || []), newRef],
    }));
  }, [setData]);

  const removeReference = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      references: (prev.references || []).filter((_, i) => i !== index),
    }));
    setSelectedElement(null);
  }, [setData]);

  // Photo Actions
  const updatePhoto = useCallback((url: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photoUrl: url,
        showPhoto: true,
      },
    }));
  }, [setData]);

  const removePhoto = useCallback(() => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photoUrl: "",
        showPhoto: false,
      },
    }));
  }, [setData]);

  const togglePhoto = useCallback(() => {
    setData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        showPhoto: !prev.personalInfo.showPhoto,
      },
    }));
  }, [setData]);

  return (
    <ResumeEditorContext.Provider
      value={{
        data,
        theme,
        setData,
        setTheme,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        selectedElement,
        selectElement: setSelectedElement,
        editingId,
        setEditingId,
        updateFieldByPath,
        addExperience,
        removeExperience,
        addExpBullet,
        removeExpBullet,
        updateExpBullet,
        addEducation,
        removeEducation,
        addSkillCategory,
        removeSkillCategory,
        addSkillItem,
        removeSkillItem,
        updateSkillItem,
        addProject,
        removeProject,
        addReference,
        removeReference,
        updatePhoto,
        removePhoto,
        togglePhoto,
        zoom,
        setZoom,
        activeDrawer,
        setActiveDrawer,
      }}
    >
      {children}
    </ResumeEditorContext.Provider>
  );
};
