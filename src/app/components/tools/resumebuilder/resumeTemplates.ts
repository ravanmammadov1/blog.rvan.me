import React from "react";
import { ResumeData, ResumeThemeConfig, TemplateId } from "./resumeTypes";

// Direct static component imports (100% reliable, zero lazy loading resolution failures)
import { AwesomeCvTemplate } from "./templates/AwesomeCvTemplate";
import { DeedyResumeTemplate } from "./templates/DeedyResumeTemplate";
import { AltaCvTemplate } from "./templates/AltaCvTemplate";
import { Sb2novTemplate } from "./templates/Sb2novTemplate";
import { ClassicHarvardTemplate } from "./templates/ClassicHarvardTemplate";
import { DarkSidebarTemplate } from "./templates/DarkSidebarTemplate";
import { SwissEditorialTemplate } from "./templates/SwissEditorialTemplate";
import { Modern2ColTemplate } from "./templates/Modern2ColTemplate";
import { OnyxTemplate } from "./templates/OnyxTemplate";
import { DeveloperCompactTemplate } from "./templates/DeveloperCompactTemplate";
import { ModerncvTemplate } from "./templates/ModerncvTemplate";
import { QuotationTemplate } from "./templates/QuotationTemplate";
import { SoftBannerTemplate } from "./templates/SoftBannerTemplate";
import { CompactAtsTemplate } from "./templates/CompactAtsTemplate";
import { CorporateCleanTemplate } from "./templates/CorporateCleanTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ModernTechTemplate } from "./templates/ModernTechTemplate";
import { LeafishTemplate } from "./templates/LeafishTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  name_az: string;
  component: React.ComponentType<{
    data: ResumeData;
    theme: ResumeThemeConfig;
    isThumbnail?: boolean;
    onUpdate?: (newData: ResumeData) => void;
  }>;
  category: "tech" | "modern" | "classic" | "executive" | "creative";
  supportedAccents: string[];
  defaultAccent: string;
  supportsAvatar: boolean;
  source: string;
  license: string;
  atsScore: number;
}

// Universal High-Quality Sample Resume Data with Built-in Avatar SVG
export const DEFAULT_AVATAR_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <rect width="200" height="200" rx="100" fill="#e0e7ff"/>
    <circle cx="100" cy="78" r="38" fill="#4f46e5"/>
    <circle cx="100" cy="74" r="32" fill="#fed7aa"/>
    <path d="M72,66 C72,48 128,48 128,66 C128,54 116,42 100,42 C84,42 72,54 72,66 Z" fill="#1e1b4b"/>
    <circle cx="88" cy="72" r="3" fill="#1e1b4b"/>
    <circle cx="112" cy="72" r="3" fill="#1e1b4b"/>
    <path d="M92,86 C96,90 104,90 108,86" stroke="#1e1b4b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M48,175 C48,135 72,122 100,122 C128,122 152,135 152,175 Z" fill="#4338ca"/>
  </svg>
`);

export const MASTER_SAMPLE_RESUME: ResumeData = {
  personalInfo: {
    fullName: "Alex Chen",
    title: "Senior Full-Stack & Distributed Systems Engineer",
    email: "alex.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    linkedin: "https://linkedin.com/in/alexchen-eng",
    github: "https://github.com/alexchen",
    photoUrl: DEFAULT_AVATAR_SVG,
    showPhoto: true,
  },
  summary:
    "High-impact Senior Software Engineer with 7+ years of experience architecting distributed cloud infrastructure, low-latency microservices, and modern React/TypeScript platforms. Proven track record in scaling systems from 10k to 5M+ daily active users while reducing cloud operating costs.",
  experiences: [
    {
      id: "exp_1",
      title: "Lead Platform Architect",
      company: "Stripe Technologies",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected high-throughput payment ingestion pipeline in Go and Kafka, processing 15M+ daily transactions with 99.999% availability.",
        "Spearheaded multi-region Kubernetes migration across AWS and GCP, decreasing p99 latency by 45% and saving $380k in annual compute costs.",
        "Mentored a distributed engineering team of 9, established automated CI/CD benchmarks, and cut release cycle times by 60%.",
      ],
    },
    {
      id: "exp_2",
      title: "Senior Full-Stack Engineer",
      company: "Uber Technologies",
      location: "San Francisco, CA",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Engineered real-time driver dispatch matching algorithms serving 250k concurrent requests per second.",
        "Refactored legacy monolithic services into resilient Go microservices, improving system throughput by 70%.",
        "Designed and published high-performance internal React component design system adopted by 40+ product teams.",
      ],
    },
    {
      id: "exp_3",
      title: "Software Engineer",
      company: "Dropbox Inc.",
      location: "San Francisco, CA",
      startDate: "2016",
      endDate: "2018",
      current: false,
      bullets: [
        "Built core desktop synchronization sync client in Rust & Python, reducing file conflict rates by 38%.",
        "Automated continuous integration integration test suites, reducing regression defects by 52%.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "B.S. in Computer Science & Engineering",
      field: "Distributed Systems & Machine Learning",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.91 / 4.0",
      honors: "Dean's Honor List, Magna Cum Laude",
    },
  ],
  skills: [
    {
      id: "skill_1",
      name: "Programming Languages",
      items: ["TypeScript", "Go (Golang)", "Rust", "Python", "SQL", "C++"],
    },
    {
      id: "skill_2",
      name: "Cloud & Infrastructure",
      items: ["Kubernetes", "Docker", "AWS", "Google Cloud", "Kafka", "PostgreSQL", "Redis", "gRPC", "Terraform"],
    },
    {
      id: "skill_3",
      name: "Frontend & Web",
      items: ["React", "Next.js", "Tailwind CSS", "GraphQL", "WebSockets", "Node.js"],
    },
  ],
  strengths: [],
  projects: [
    {
      id: "proj_1",
      name: "RaftKv Distributed Consensus Engine",
      role: "Creator & Lead Maintainer",
      techStack: ["Go", "Raft Consensus", "gRPC", "Protobuf"],
      link: "https://github.com/alexchen/raft-kv",
      description: [
        "Open-source distributed key-value store with leader election and linearizable read/write semantics (3.8k+ GitHub Stars).",
      ],
    },
    {
      id: "proj_2",
      name: "HyperSync Real-Time Data Pipeline",
      role: "Architect",
      techStack: ["Rust", "Tokio", "WebSockets", "Redis"],
      link: "https://github.com/alexchen/hypersync",
      description: [
        "Ultra-low latency asynchronous synchronization proxy handling 100k+ concurrent connections with sub-5ms latency.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert_1",
      name: "AWS Certified Solutions Architect — Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    { id: "lang_1", language: "English", proficiency: "Native" },
    { id: "lang_2", language: "German", proficiency: "Professional" },
  ],
  references: [],
};

// ── THE SINGLE SOURCE OF TRUTH: TEMPLATE REGISTRY ──
export const TEMPLATE_REGISTRY: Record<TemplateId, TemplateDefinition> = {
  "awesome-cv": {
    id: "awesome-cv",
    name: "Awesome-CV",
    name_az: "Awesome-CV",
    component: AwesomeCvTemplate,
    category: "tech",
    supportedAccents: ["#dc2626", "#1e3a8a", "#059669", "#7c3aed", "#111827"],
    defaultAccent: "#dc2626",
    supportsAvatar: true,
    source: "posquit0/Awesome-CV",
    license: "MIT",
    atsScore: 98,
  },
  "deedy-cv": {
    id: "deedy-cv",
    name: "Deedy 2-Column",
    name_az: "Deedy 2-Sütun",
    component: DeedyResumeTemplate,
    category: "tech",
    supportedAccents: ["#2563eb", "#dc2626", "#059669", "#111827", "#7c3aed"],
    defaultAccent: "#2563eb",
    supportsAvatar: false,
    source: "deedy/Deedy-Resume",
    license: "Apache 2.0",
    atsScore: 95,
  },
  "altacv": {
    id: "altacv",
    name: "AltaCV",
    name_az: "AltaCV",
    component: AltaCvTemplate,
    category: "modern",
    supportedAccents: ["#059669", "#1e3a8a", "#2563eb", "#d97706", "#7c3aed"],
    defaultAccent: "#059669",
    supportsAvatar: true,
    source: "liantze/AltaCV",
    license: "LPPL / MIT-compatible",
    atsScore: 94,
  },
  "tech-cv": {
    id: "tech-cv",
    name: "RenderCV sb2nov",
    name_az: "RenderCV sb2nov",
    component: Sb2novTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#059669", "#0284c7", "#4338ca"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "rendercv/rendercv",
    license: "MIT",
    atsScore: 100,
  },
  "minimal-cv": {
    id: "minimal-cv",
    name: "Harvard Classic",
    name_az: "Harvard Klassik",
    component: ClassicHarvardTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#881337", "#2c2d30"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "Harvard FAS Career Services",
    license: "Public Domain",
    atsScore: 100,
  },
  "professional-cv": {
    id: "professional-cv",
    name: "Executive Dark Sidebar",
    name_az: "Rəhbər Qaranlıq Yan Sütun",
    component: DarkSidebarTemplate,
    category: "executive",
    supportedAccents: ["#1e3a8a", "#059669", "#2c2d30", "#881337", "#0284c7"],
    defaultAccent: "#1e3a8a",
    supportsAvatar: true,
    source: "Reactive Resume Gengar",
    license: "MIT",
    atsScore: 92,
  },
  "editorial-cv": {
    id: "editorial-cv",
    name: "Swiss Editorial",
    name_az: "İsveçrə Redaksiyası",
    component: SwissEditorialTemplate,
    category: "modern",
    supportedAccents: ["#111827", "#1e3a8a", "#881337", "#0284c7"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "Typst Modernist Swiss",
    license: "MIT",
    atsScore: 95,
  },
  "modern-cv": {
    id: "modern-cv",
    name: "Modern 2-Column",
    name_az: "Müasir 2-Sütun",
    component: Modern2ColTemplate,
    category: "modern",
    supportedAccents: ["#0284c7", "#1e3a8a", "#059669", "#4338ca", "#d97706"],
    defaultAccent: "#0284c7",
    supportsAvatar: true,
    source: "Reactive Resume Kakuna",
    license: "MIT",
    atsScore: 95,
  },
  "creative-cv": {
    id: "creative-cv",
    name: "Onyx Creative",
    name_az: "Onyx Kreativ",
    component: OnyxTemplate,
    category: "creative",
    supportedAccents: ["#1e3a8a", "#4338ca", "#059669", "#d97706"],
    defaultAccent: "#1e3a8a",
    supportsAvatar: true,
    source: "Reactive Resume Onyx",
    license: "MIT",
    atsScore: 90,
  },
  "developer-cv": {
    id: "developer-cv",
    name: "Developer Compact",
    name_az: "Proqramçı Sıx",
    component: DeveloperCompactTemplate,
    category: "tech",
    supportedAccents: ["#059669", "#0284c7", "#111827", "#4338ca"],
    defaultAccent: "#059669",
    supportsAvatar: false,
    source: "Open-Resume Dev Theme",
    license: "MIT",
    atsScore: 98,
  },
  "executive-cv": {
    id: "executive-cv",
    name: "Executive Timeline",
    name_az: "Rəhbər Zaman Xətti",
    component: ModerncvTemplate,
    category: "executive",
    supportedAccents: ["#1e3a8a", "#0284c7", "#111827", "#059669"],
    defaultAccent: "#1e3a8a",
    supportsAvatar: false,
    source: "moderncv/moderncv",
    license: "LPPL",
    atsScore: 96,
  },
  "quotation-cv": {
    id: "quotation-cv",
    name: "Quotation & Lead",
    name_az: "Sitat və Liderlik",
    component: QuotationTemplate,
    category: "executive",
    supportedAccents: ["#d97706", "#1e3a8a", "#059669", "#881337"],
    defaultAccent: "#d97706",
    supportsAvatar: true,
    source: "RenderCV Executive",
    license: "MIT",
    atsScore: 94,
  },
  "nordic-cv": {
    id: "nordic-cv",
    name: "Nordic Soft Banner",
    name_az: "Nordik Pastel",
    component: SoftBannerTemplate,
    category: "modern",
    supportedAccents: ["#3b82f6", "#0284c7", "#059669", "#4338ca"],
    defaultAccent: "#3b82f6",
    supportsAvatar: true,
    source: "Reactive Resume Leafish",
    license: "MIT",
    atsScore: 92,
  },
  "compact-ats-cv": {
    id: "compact-ats-cv",
    name: "Compact Plain ATS",
    name_az: "Sıx Sadə ATS",
    component: CompactAtsTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#2c2d30"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "EngineeringResumes standard",
    license: "Public Domain",
    atsScore: 100,
  },
  "corporate-cv": {
    id: "corporate-cv",
    name: "Corporate ATS",
    name_az: "Korporativ ATS",
    component: CorporateCleanTemplate,
    category: "classic",
    supportedAccents: ["#1e3a8a", "#111827", "#059669", "#881337"],
    defaultAccent: "#1e3a8a",
    supportsAvatar: false,
    source: "JSON Resume Corporate",
    license: "MIT",
    atsScore: 99,
  },
  "classic-ats-cv": {
    id: "classic-ats-cv",
    name: "Classic ATS",
    name_az: "Klassik ATS",
    component: MinimalTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#2c2d30", "#059669"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "JSON Resume Standard",
    license: "MIT",
    atsScore: 100,
  },
  "clean-modern-cv": {
    id: "clean-modern-cv",
    name: "Clean Modern",
    name_az: "Təmiz Müasir",
    component: LeafishTemplate,
    category: "modern",
    supportedAccents: ["#1e3a8a", "#0284c7", "#059669", "#111827"],
    defaultAccent: "#1e3a8a",
    supportsAvatar: true,
    source: "Reactive Resume Modern",
    license: "MIT",
    atsScore: 97,
  },
  "modern-minimal-cv": {
    id: "modern-minimal-cv",
    name: "Modern Minimal",
    name_az: "Müasir Minimalist",
    component: ModernTechTemplate,
    category: "modern",
    supportedAccents: ["#111827", "#0284c7", "#059669", "#4338ca"],
    defaultAccent: "#111827",
    supportsAvatar: true,
    source: "RenderCV Minimal",
    license: "MIT",
    atsScore: 96,
  },
  "engineering-cv": {
    id: "engineering-cv",
    name: "Engineering Terminal",
    name_az: "Mühəndis Terminalı",
    component: ExecutiveTemplate,
    category: "tech",
    supportedAccents: ["#111827", "#059669", "#0284c7", "#4338ca"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "RenderCV Engineering",
    license: "MIT",
    atsScore: 98,
  },
  "academic-cv": {
    id: "academic-cv",
    name: "Academic Research",
    name_az: "Akademik Tədqiqat",
    component: ClassicHarvardTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#881337"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "LaTeX Academic CV",
    license: "BSD",
    atsScore: 100,
  },
  "blank-cv": {
    id: "blank-cv",
    name: "Clean Canvas",
    name_az: "Təmiz Kətan",
    component: Sb2novTemplate,
    category: "classic",
    supportedAccents: ["#111827", "#1e3a8a", "#0284c7"],
    defaultAccent: "#111827",
    supportsAvatar: false,
    source: "Custom",
    license: "MIT",
    atsScore: 95,
  },
};

export const TEMPLATE_LIST: TemplateDefinition[] = Object.values(TEMPLATE_REGISTRY);
