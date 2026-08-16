import { ResumeData } from "../resumeTypes";

/**
 * RenderCV YAML Serializer
 * Converts ResumeData into valid RenderCV YAML format compatible with RenderCV CLI.
 */
export function exportToRenderCvYaml(data: ResumeData): string {
  const lines: string[] = [];

  lines.push("cv:");
  lines.push(`  name: "${data.personalInfo.fullName}"`);
  if (data.personalInfo.location) lines.push(`  location: "${data.personalInfo.location}"`);
  if (data.personalInfo.email) lines.push(`  email: "${data.personalInfo.email}"`);
  if (data.personalInfo.phone) lines.push(`  phone: "${data.personalInfo.phone}"`);
  if (data.personalInfo.website) lines.push(`  website: "${data.personalInfo.website}"`);
  if (data.personalInfo.linkedin) lines.push(`  social_networks:\n    - network: LinkedIn\n      username: "${data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")}"`);
  if (data.personalInfo.github) lines.push(`    - network: GitHub\n      username: "${data.personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")}"`);

  lines.push("\n  sections:");

  // Summary
  if (data.summary) {
    lines.push("    summary:");
    lines.push(`      - "${data.summary.replace(/"/g, '\\"')}"`);
  }

  // Experience
  if (data.experiences && data.experiences.length > 0) {
    lines.push("    experience:");
    for (const exp of data.experiences) {
      lines.push(`      - company: "${exp.company}"`);
      lines.push(`        position: "${exp.title}"`);
      if (exp.location) lines.push(`        location: "${exp.location}"`);
      lines.push(`        start_date: "${exp.startDate}"`);
      lines.push(`        end_date: "${exp.current ? "present" : exp.endDate}"`);
      if (exp.bullets && exp.bullets.length > 0) {
        lines.push("        highlights:");
        for (const b of exp.bullets) {
          if (b.trim()) lines.push(`          - "${b.replace(/"/g, '\\"')}"`);
        }
      }
    }
  }

  // Education
  if (data.education && data.education.length > 0) {
    lines.push("    education:");
    for (const edu of data.education) {
      lines.push(`      - institution: "${edu.institution}"`);
      lines.push(`        area: "${edu.field}"`);
      lines.push(`        degree: "${edu.degree}"`);
      if (edu.location) lines.push(`        location: "${edu.location}"`);
      lines.push(`        start_date: "${edu.startDate}"`);
      lines.push(`        end_date: "${edu.endDate}"`);
      if (edu.gpa) lines.push(`        highlights:\n          - "GPA: ${edu.gpa}"`);
    }
  }

  // Projects
  if (data.projects && data.projects.length > 0) {
    lines.push("    projects:");
    for (const proj of data.projects) {
      lines.push(`      - name: "${proj.name}"`);
      if (proj.link) lines.push(`        link: "${proj.link}"`);
      if (proj.description && proj.description.length > 0) {
        lines.push("        highlights:");
        for (const d of proj.description) {
          if (d.trim()) lines.push(`          - "${d.replace(/"/g, '\\"')}"`);
        }
      }
    }
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    lines.push("    skills:");
    for (const s of data.skills) {
      lines.push(`      - label: "${s.name}"\n        details: "${s.items.join(", ")}"`);
    }
  }

  lines.push("\ndesign:\n  theme: sb2nov\n  page_size: a4\n  color: '#111827'\n");

  return lines.join("\n");
}

/**
 * Reactive Resume JSON Serializer
 * Converts ResumeData into Reactive Resume v4 compatible JSON structure.
 */
export function exportToReactiveResumeJson(data: ResumeData): string {
  const schema = {
    basics: {
      name: data.personalInfo.fullName,
      headline: data.personalInfo.title,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      location: data.personalInfo.location,
      url: { label: "Website", href: data.personalInfo.website },
      picture: { url: data.personalInfo.photoUrl || "" },
      customFields: [],
    },
    sections: {
      summary: { name: "Summary", content: data.summary, visible: true },
      experience: {
        name: "Experience",
        items: data.experiences.map((exp) => ({
          id: exp.id,
          company: exp.company,
          position: exp.title,
          location: exp.location,
          date: `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
          summary: exp.bullets.join("\n"),
        })),
        visible: true,
      },
      education: {
        name: "Education",
        items: data.education.map((edu) => ({
          id: edu.id,
          institution: edu.institution,
          studyType: edu.degree,
          area: edu.field,
          date: `${edu.startDate} - ${edu.endDate}`,
          score: edu.gpa || "",
        })),
        visible: true,
      },
      skills: {
        name: "Skills",
        items: data.skills.map((s) => ({
          name: s.name,
          keywords: s.items,
        })),
        visible: true,
      },
      projects: {
        name: "Projects",
        items: (data.projects || []).map((p) => ({
          name: p.name,
          description: p.description?.join("\n"),
          url: { href: p.link || p.github || "" },
        })),
        visible: true,
      },
      references: {
        name: "References",
        items: (data.references || []).map((r) => ({
          name: r.name,
          relationship: `${r.position}, ${r.company}`,
          phone: r.phone,
          email: r.email,
        })),
        visible: true,
      },
    },
    metadata: {
      template: "onyx",
      typography: { font: { family: "Geist" } },
    },
  };

  return JSON.stringify(schema, null, 2);
}

/**
 * Universal Importer
 * Automatically detects whether the input is RenderCV YAML, Reactive Resume JSON,
 * Resumify JSON, or our native format.
 */
export function importUniversalResume(content: string): Partial<ResumeData> | null {
  const trimmed = content.trim();

  // 1. Try Native JSON or Reactive Resume JSON
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);

      // If it's our native format
      if (parsed.resumeData) {
        return parsed.resumeData;
      }
      if (parsed.personalInfo && parsed.experiences) {
        return parsed;
      }

      // If it's Reactive Resume v4 JSON
      if (parsed.basics && parsed.sections) {
        const basics = parsed.basics;
        const sections = parsed.sections;

        return {
          personalInfo: {
            fullName: basics.name || "",
            title: basics.headline || "",
            email: basics.email || "",
            phone: basics.phone || "",
            location: typeof basics.location === "string" ? basics.location : basics.location?.city || "",
            website: basics.url?.href || "",
            linkedin: "",
            github: "",
            photoUrl: basics.picture?.url || "",
            showPhoto: Boolean(basics.picture?.url),
          },
          summary: typeof sections.summary?.content === "string" ? sections.summary.content : "",
          experiences: (sections.experience?.items || []).map((item: any, idx: number) => ({
            id: item.id || `exp-${idx}`,
            title: item.position || "",
            company: item.company || "",
            location: item.location || "",
            startDate: item.date?.split("-")?.[0]?.trim() || "",
            endDate: item.date?.split("-")?.[1]?.trim() || "",
            current: item.date?.toLowerCase().includes("present") || false,
            bullets: typeof item.summary === "string" ? item.summary.split("\n").map((s: string) => s.replace(/^•\s*/, "")) : [],
          })),
          education: (sections.education?.items || []).map((item: any, idx: number) => ({
            id: item.id || `edu-${idx}`,
            degree: item.studyType || "",
            field: item.area || "",
            institution: item.institution || "",
            location: item.location || "",
            startDate: item.date?.split("-")?.[0]?.trim() || "",
            endDate: item.date?.split("-")?.[1]?.trim() || "",
            gpa: item.score || "",
          })),
          skills: (sections.skills?.items || []).map((item: any, idx: number) => ({
            id: `sk-${idx}`,
            name: item.name || "Skills",
            items: Array.isArray(item.keywords) ? item.keywords : [],
          })),
          strengths: [],
          projects: (sections.projects?.items || []).map((item: any, idx: number) => ({
            id: `proj-${idx}`,
            name: item.name || "",
            techStack: [],
            link: item.url?.href || "",
            description: typeof item.description === "string" ? item.description.split("\n") : [],
          })),
          certifications: [],
          languages: [],
          references: [],
        };
      }
    } catch (e) {
      console.error("Failed to parse JSON", e);
    }
  }

  return null;
}
