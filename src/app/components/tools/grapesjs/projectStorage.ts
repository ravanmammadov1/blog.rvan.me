export interface GrapesProject {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  grapesData?: any;
  html?: string;
  css?: string;
}

const STORAGE_KEY_PROJECTS = "rvan_grapes_projects_v2";
const STORAGE_KEY_ACTIVE_ID = "rvan_grapes_active_project_id_v2";

export function getAllProjects(): GrapesProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading GrapesJS projects from localStorage:", err);
    return [];
  }
}

export function saveAllProjects(projects: GrapesProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error("Error saving GrapesJS projects to localStorage:", err);
  }
}

export function getActiveProjectId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
}

export function setActiveProjectId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch (err) {
    console.error("Error setting active project ID:", err);
  }
}

export function createNewProject(name: string, initialHtml: string = "", initialCss: string = ""): GrapesProject {
  const newProj: GrapesProject = {
    id: "proj_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: name.trim() || "Untitled Project",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    html: initialHtml,
    css: initialCss,
    grapesData: null,
  };

  const projects = getAllProjects();
  projects.unshift(newProj);
  saveAllProjects(projects);
  setActiveProjectId(newProj.id);
  return newProj;
}

export function updateProject(id: string, updates: Partial<GrapesProject>): GrapesProject | null {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const updated: GrapesProject = {
    ...projects[index],
    ...updates,
    updatedAt: Date.now(),
  };

  projects[index] = updated;
  saveAllProjects(projects);
  return updated;
}

export function duplicateProject(id: string): GrapesProject | null {
  const projects = getAllProjects();
  const target = projects.find((p) => p.id === id);
  if (!target) return null;

  const copy: GrapesProject = {
    ...target,
    id: "proj_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: `${target.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  projects.unshift(copy);
  saveAllProjects(projects);
  setActiveProjectId(copy.id);
  return copy;
}

export function deleteProject(id: string): boolean {
  let projects = getAllProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;

  saveAllProjects(filtered);
  if (getActiveProjectId() === id) {
    setActiveProjectId(filtered.length > 0 ? filtered[0].id : null);
  }
  return true;
}

export function exportProjectToJson(project: GrapesProject): void {
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/[^a-z0-9_-]+/gi, "-")}-project.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importProjectFromJson(jsonString: string): GrapesProject {
  const parsed = JSON.parse(jsonString);
  if (!parsed.name) {
    throw new Error("Invalid project file: missing name property");
  }

  const imported: GrapesProject = {
    id: "proj_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    name: parsed.name + " (Imported)",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    html: parsed.html || "",
    css: parsed.css || "",
    grapesData: parsed.grapesData || null,
  };

  const projects = getAllProjects();
  projects.unshift(imported);
  saveAllProjects(projects);
  setActiveProjectId(imported.id);
  return imported;
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;

  return new Date(timestamp).toLocaleDateString();
}
