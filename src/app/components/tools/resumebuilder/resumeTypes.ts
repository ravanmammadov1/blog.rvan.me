export type TemplateId =
  | "modern-tech"
  | "classic-harvard"
  | "executive"
  | "minimal"
  | "creative";

export type ResumeFont = "sans" | "serif" | "mono";
export type ResumeDensity = "compact" | "standard" | "relaxed";
export type PaperSize = "a4" | "letter";

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  honors?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  techStack: string[];
  link?: string;
  github?: string;
  description: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate" | "Basic";
}

export interface ResumeData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
  };
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
}

export interface ResumeThemeConfig {
  template: TemplateId;
  accentColor: string;
  fontFamily: ResumeFont;
  density: ResumeDensity;
  paperSize: PaperSize;
}

export const TEMPLATE_OPTIONS: { id: TemplateId; name: string; description: string; bestFor: string }[] = [
  {
    id: "modern-tech",
    name: "Modern Tech",
    description: "Silicon Valley standard with tech stack tags, project links, and bold metric-driven bullet points.",
    bestFor: "Software Engineers, DevOps, Data Scientists, Tech Leads",
  },
  {
    id: "classic-harvard",
    name: "Classic Harvard",
    description: "ATS Gold Standard. High-contrast single column with horizontal dividers universally parsed by all ATS.",
    bestFor: "Corporate, Finance, Consulting, Legal, Universal",
  },
  {
    id: "executive",
    name: "Executive Leadership",
    description: "Sophisticated header with executive summary, core leadership competencies, and organizational milestones.",
    bestFor: "C-Level, VP, Directors, Senior Engineering Managers",
  },
  {
    id: "minimal",
    name: "Minimalist Clean",
    description: "Clean airy whitespace, left vertical accent rules, high scanning speed for busy recruiters.",
    bestFor: "Startups, Generalists, Analysts, Operations",
  },
  {
    id: "creative",
    name: "Product & Creative",
    description: "Aesthetic modern grid balancing design sensibilities with full ATS keyword readability.",
    bestFor: "Product Managers, UI/UX Designers, Technical Marketers",
  },
];

export const COLOR_OPTIONS = [
  { label: "Navy Blue", hex: "#1e3a8a" },
  { label: "Slate Charcoal", hex: "#334155" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Royal Indigo", hex: "#4338ca" },
  { label: "Brand Mint", hex: "#61c5ad" },
  { label: "Classic Black", hex: "#111827" },
  { label: "Burgundy", hex: "#881337" },
];

export const FONT_OPTIONS: { id: ResumeFont; label: string; fontFamily: string }[] = [
  { id: "sans", label: "Geist / Inter (Modern Sans)", fontFamily: "'Geist', 'Inter', system-ui, sans-serif" },
  { id: "serif", label: "Merriweather (Classic Serif)", fontFamily: "'Merriweather', 'Georgia', serif" },
  { id: "mono", label: "JetBrains (Tech Mono)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
];

// Sample Presets
export const SOFTWARE_ENGINEER_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    title: "Senior Full-Stack Software Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.com/in/alexrivera-dev",
    github: "https://github.com/alexrivera-dev",
  },
  summary:
    "Performance-driven Senior Software Engineer with 6+ years of experience architecting distributed cloud applications, microservices, and reactive web interfaces. Proven track record scaling systems to 2M+ active users, reducing cloud infrastructure costs by 35%, and leading high-velocity engineering teams.",
  experiences: [
    {
      id: "exp-1",
      title: "Senior Full-Stack Engineer",
      company: "Stripe / FinTech Cloud",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected high-throughput payment reconciliation microservice in Go & Node.js, processing $45M+ in monthly transaction volume with 99.99% uptime.",
        "Engineered real-time dashboard using React, TypeScript, and WebSockets, reducing customer support escalation volume by 42%.",
        "Spearheaded database query optimization across PostgreSQL clusters, cutting average p99 API latency from 450ms to 85ms.",
        "Mentored 5 junior and mid-level engineers, instituted automated CI/CD quality gates, and raised test coverage from 64% to 92%.",
      ],
    },
    {
      id: "exp-2",
      title: "Full-Stack Software Engineer",
      company: "Vercel / Cloud Scale Inc.",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Designed and deployed serverless edge functions on AWS Lambda and Cloudflare Workers, handling 15M+ daily requests.",
        "Integrated automated Stripe subscription billing and self-serve team permission workflows.",
        "Refactored legacy monolith into modular GraphQL services, decreasing deployment cycle time from 3 days to under 20 minutes.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2015-09",
      endDate: "2019-05",
      gpa: "3.85 / 4.00",
      honors: "Dean's Honor List, Magna Cum Laude",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Languages",
      items: ["TypeScript", "JavaScript", "Go", "Python", "SQL", "HTML5/CSS3"],
    },
    {
      id: "sk-2",
      name: "Frameworks & UI",
      items: ["React.js", "Next.js", "Node.js", "Express", "Tailwind CSS", "GraphQL"],
    },
    {
      id: "sk-3",
      name: "Cloud & DevOps",
      items: ["AWS (Lambda, S3, ECS)", "Docker", "Kubernetes", "PostgreSQL", "Redis", "CI/CD"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "HyperScale Analytics Engine",
      role: "Lead Creator",
      techStack: ["React", "TypeScript", "ClickHouse", "Docker"],
      link: "https://hyperscale.demo.dev",
      github: "https://github.com/alexrivera-dev/hyperscale",
      description: [
        "Open-source distributed analytics pipeline indexing 100M+ events with sub-second query latency.",
        "Gained 1,800+ GitHub stars and adopted in production by 12+ tech startups.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
    { id: "lang-2", language: "Spanish", proficiency: "Fluent" },
  ],
};

export const PRODUCT_DESIGNER_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Elena Rostova",
    title: "Lead Product Designer & Design Systems Architect",
    email: "elena.design@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY (Hybrid / Remote)",
    website: "https://elenarostova.design",
    linkedin: "https://linkedin.com/in/elena-design",
    github: "https://github.com/elena-design",
  },
  summary:
    "Product Designer with 7+ years of experience leading UX/UI design, design systems, and user research for high-growth SaaS and fintech products. Specialized in converting complex technical workflows into intuitive, accessible, high-conversion interfaces.",
  experiences: [
    {
      id: "exp-1",
      title: "Lead Product Designer",
      company: "Linear / Modern Workspaces",
      location: "New York, NY",
      startDate: "2021-08",
      endDate: "Present",
      current: true,
      bullets: [
        "Spearheaded redesign of core enterprise onboarding funnel, increasing 30-day user activation rate from 28% to 49%.",
        "Built and maintained company-wide multi-brand Design System in Figma, accelerating feature shipping speed by 35%.",
        "Conducted 60+ user interviews and usability test sessions to identify product friction points and drive roadmap strategy.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "BFA in Interaction Design & HCI",
      field: "Human-Computer Interaction",
      institution: "Rhode Island School of Design (RISD)",
      location: "Providence, RI",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.90 / 4.00",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Design & UX",
      items: ["Design Systems", "UI/UX Design", "Wireframing", "Rapid Prototyping", "User Research", "Information Architecture"],
    },
    {
      id: "sk-2",
      name: "Tools & Code",
      items: ["Figma", "Framer", "HTML/CSS", "Tailwind CSS", "React Basics", "Storybook"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Nexus Design System",
      role: "Lead Architect",
      techStack: ["Figma", "Design Tokens", "Accessibility (WCAG 2.1)"],
      link: "https://nexus-system.design",
      description: [
        "Comprehensive UI library with 120+ accessible components, dark/light mode tokens, and interactive documentation.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Nielsen Norman Group UX Master Certified",
      issuer: "NN/g",
      date: "2022",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native" },
    { id: "lang-2", language: "French", proficiency: "Intermediate" },
  ],
};

export const BLANK_RESUME_DATA: ResumeData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  summary: "",
  experiences: [
    {
      id: "exp-1",
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "",
      field: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Technical Skills",
      items: [],
    },
  ],
  projects: [],
  certifications: [],
  languages: [],
};
