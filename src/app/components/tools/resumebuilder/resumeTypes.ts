export type TemplateId =
  | "awesome-cv"
  | "deedy-cv"
  | "altacv"
  | "tech-cv"
  | "minimal-cv"
  | "classic-ats-cv"
  | "corporate-cv"
  | "compact-ats-cv"
  | "modern-cv"
  | "modern-minimal-cv"
  | "editorial-cv"
  | "nordic-cv"
  | "clean-modern-cv"
  | "developer-cv"
  | "engineering-cv"
  | "academic-cv"
  | "professional-cv"
  | "executive-cv"
  | "quotation-cv"
  | "creative-cv"
  | "blank-cv";

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

export interface StrengthItem {
  id: string;
  title: string;
  description: string;
  icon?: "trophy" | "star" | "diamond" | "zap" | "target";
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
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
  rating?: number;
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
    photoUrl?: string;
    showPhoto: boolean;
  };
  summary: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  strengths: StrengthItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  references: ReferenceItem[];
}

export interface ResumeThemeConfig {
  template: TemplateId;
  accentColor: string;
  fontFamily: ResumeFont;
  density: ResumeDensity;
  paperSize: PaperSize;
  sidebarColor?: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  name_az: string;
  category: "classic" | "modern" | "tech" | "executive" | "creative";
  atsLevel: "excellent" | "good" | "creative";
  description: string;
  description_az: string;
  supportedAccents: string[];
  defaultAccent: string;
  layoutType: "single-column" | "two-column" | "sidebar" | "banner";
  supportsProfileImage: boolean;
  atsScore: number;
  presetData: ResumeData;
}

export const COLOR_OPTIONS = [
  { label: "Navy Blue", hex: "#1e3a8a" },
  { label: "Slate Charcoal", hex: "#2c2d30" },
  { label: "Ocean Blue", hex: "#0284c7" },
  { label: "Emerald Green", hex: "#059669" },
  { label: "Royal Indigo", hex: "#4338ca" },
  { label: "Pastel Teal", hex: "#3b82f6" },
  { label: "Classic Black", hex: "#111827" },
  { label: "Burgundy", hex: "#881337" },
  { label: "Amber Gold", hex: "#d97706" },
];

export const FONT_OPTIONS: { id: ResumeFont; label: string; fontFamily: string }[] = [
  { id: "sans", label: "Geist / Inter (Modern Clean)", fontFamily: "'Geist', 'Inter', system-ui, sans-serif" },
  { id: "serif", label: "Merriweather (Classic Serif)", fontFamily: "'Merriweather', 'Georgia', serif" },
  { id: "mono", label: "JetBrains (Tech Mono)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
];

// Rich Sample Data Preset for Tech & Engineering
export const TECH_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Alex Chen",
    title: "Senior Full-Stack & Distributed Systems Engineer",
    email: "alex.chen@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexchen.dev",
    linkedin: "https://linkedin.com/in/alexchen-eng",
    github: "https://github.com/alexchen",
    photoUrl: "",
    showPhoto: false,
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
      name: "Cloud & Distributed Systems",
      items: ["Kubernetes", "Docker", "AWS", "Google Cloud", "Kafka", "PostgreSQL", "Redis", "gRPC", "Terraform"],
    },
    {
      id: "skill_3",
      name: "Frontend & Web Architecture",
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

// Rich Sample Data Preset for Executive / Modern 2-Col
export const MODERN_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Elena Rostova",
    title: "Senior Technical Product & Engineering Director",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 432-8765",
    location: "New York, NY",
    website: "https://elenarostova.com",
    linkedin: "https://linkedin.com/in/elena-rostova",
    github: "https://github.com/elena-rostova",
    photoUrl: "",
    showPhoto: true,
  },
  summary:
    "Visionary Engineering Director with 10+ years of enterprise experience leading cross-functional teams of 45+ software engineers and product designers. Delivered $40M+ in annual recurring revenue growth across fintech and consumer software verticals while maintaining world-class operational excellence.",
  experiences: [
    {
      id: "exp_1",
      title: "Director of Product Engineering",
      company: "FinTech Global Innovations",
      location: "New York, NY",
      startDate: "2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Directed a 50-person product and platform engineering organization, launching next-gen investment portal scaling to $2.4B in AUM.",
        "Reduced customer onboarding drop-off rate from 34% to 8% via AI-powered identity verification and UX redesign.",
        "Formulated engineering KPIs and hiring roadmap, achieving 94% annualized team retention.",
      ],
    },
    {
      id: "exp_2",
      title: "Principal Engineering Manager",
      company: "Datadog Cloud Analytics",
      location: "New York, NY",
      startDate: "2016",
      endDate: "2020",
      current: false,
      bullets: [
        "Led 3 engineering squads building high-throughput log analytics dashboards handling 20TB+ daily log telemetry.",
        "Spearheaded cloud cost optimization program that decreased infrastructure spend by $1.8M per year.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "M.S. in Computer Science & Management",
      field: "Information Systems & Product Strategy",
      institution: "Columbia University",
      location: "New York, NY",
      startDate: "2014",
      endDate: "2016",
      gpa: "3.95 / 4.0",
    },
  ],
  skills: [
    {
      id: "skill_1",
      name: "Strategic Leadership",
      items: ["Engineering Leadership", "Product Roadmap Strategy", "P&L Management ($30M+)", "Agile / OKRs", "Cross-Functional Scale"],
    },
    {
      id: "skill_2",
      name: "Technical Architecture",
      items: ["Enterprise SaaS", "Cloud Security", "Microservices", "React & TypeScript", "PostgreSQL", "System Scalability"],
    },
  ],
  strengths: [
    { id: "st_1", title: "Scale & Execution", description: "Built engineering organizations from 5 to 50+ members.", icon: "trophy" },
    { id: "st_2", title: "Cost Optimization", description: "Delivered $1.8M in annual infrastructure savings.", icon: "diamond" },
  ],
  projects: [
    {
      id: "proj_1",
      name: "Open-Source FinTech Compliance Protocol",
      role: "Lead Author",
      techStack: ["TypeScript", "Zero-Knowledge", "Node.js"],
      link: "https://github.com/elena/compliance-protocol",
      description: ["Enterprise cryptographic compliance protocol adopted by 15 financial institutions."],
    },
  ],
  certifications: [
    { id: "cert_1", name: "Certified Scrum Master (CSM)", issuer: "Scrum Alliance", date: "2022" },
  ],
  languages: [
    { id: "lang_1", language: "English", proficiency: "Native" },
    { id: "lang_2", language: "French", proficiency: "Fluent" },
  ],
  references: [],
};

// Unified Templates Definition (Distinct Open-Source Adapted Templates)
export const UNIFIED_TEMPLATES: TemplateDefinition[] = [
  {
    id: "awesome-cv",
    name: "Awesome-CV",
    name_az: "Awesome-CV",
    category: "tech",
    atsLevel: "excellent",
    description: "Iconic Posquit0 Awesome-CV LaTeX layout with 2-tone name and accent divider rules.",
    description_az: "Məşhur Posquit0 Awesome-CV LaTeX dizaynı və ikirəngli başlıq.",
    supportedAccents: ["#dc2626", "#1e3a8a", "#059669", "#7c3aed", "#111827"],
    defaultAccent: "#dc2626",
    layoutType: "single-column",
    supportsProfileImage: true,
    atsScore: 98,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "deedy-cv",
    name: "Deedy 2-Column",
    name_az: "Deedy 2-Sütun",
    category: "tech",
    atsLevel: "good",
    description: "World-famous Debarghya Das asymmetric 2-column LaTeX resume layout.",
    description_az: "Dünyaca məşhur Debarghya Das asimmetrik 2-sütunlu LaTeX CV formatı.",
    supportedAccents: ["#2563eb", "#dc2626", "#059669", "#111827", "#7c3aed"],
    defaultAccent: "#2563eb",
    layoutType: "two-column",
    supportsProfileImage: false,
    atsScore: 95,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "altacv",
    name: "AltaCV",
    name_az: "AltaCV",
    category: "modern",
    atsLevel: "good",
    description: "LianTze Lim AltaCV layout with circular avatar, colored section badges, and skill pills.",
    description_az: "LianTze Lim AltaCV formatı: dairəvi profil şəkli və rəngli bölmə nişanları.",
    supportedAccents: ["#059669", "#1e3a8a", "#2563eb", "#d97706", "#7c3aed"],
    defaultAccent: "#059669",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 94,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "tech-cv",
    name: "RenderCV sb2nov",
    name_az: "RenderCV sb2nov",
    category: "classic",
    atsLevel: "excellent",
    description: "RenderCV sb2nov engineering standard with high-density quantified bullets.",
    description_az: "RenderCV sb2nov mühəndislik standartı və sıx mətn iyerarxiyası.",
    supportedAccents: ["#111827", "#1e3a8a", "#059669", "#0284c7", "#4338ca"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "minimal-cv",
    name: "Harvard Classic",
    name_az: "Harvard Klassik",
    category: "classic",
    atsLevel: "excellent",
    description: "Traditional single-column serif academic and executive ATS standard.",
    description_az: "Klassik 1 sütunlu serif akademik və rəhbər ATS standartı.",
    supportedAccents: ["#111827", "#1e3a8a", "#881337", "#2c2d30"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "classic-ats-cv",
    name: "Classic ATS",
    name_az: "Klassik ATS",
    category: "classic",
    atsLevel: "excellent",
    description: "Ultra-clean single-column with horizontal divider rules for ATS scanners.",
    description_az: "ATS skanerləri üçün üfüqi ayırıcı xətləri olan təmiz klassik format.",
    supportedAccents: ["#111827", "#1e3a8a", "#2c2d30", "#059669"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "corporate-cv",
    name: "Corporate ATS",
    name_az: "Korporativ ATS",
    category: "classic",
    atsLevel: "excellent",
    description: "Executive divider structure with core competency grid and clean hierarchy.",
    description_az: "Əsas bacarıqlar şəbəkəsi olan ənənəvi korporativ format.",
    supportedAccents: ["#1e3a8a", "#111827", "#059669", "#881337"],
    defaultAccent: "#1e3a8a",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 99,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "compact-ats-cv",
    name: "Compact Plain ATS",
    name_az: "Sıx Sadə ATS",
    category: "classic",
    atsLevel: "excellent",
    description: "Dense, plain-text parser compliant single-page format for high-volume jobs.",
    description_az: "Maksimum sıx və avtomatlaşdırılmış oxucular üçün tam uyğun 1 səhifəlik format.",
    supportedAccents: ["#111827", "#1e3a8a", "#2c2d30"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },

  // ── 2. MODERN ──
  {
    id: "modern-cv",
    name: "Modern 2-Column",
    name_az: "Müasir 2-Sütun",
    category: "modern",
    atsLevel: "good",
    description: "Reactive Resume Kakuna layout with left contact/skills sidebar and right timeline.",
    description_az: "Sol tərəfdə əlaqə və bacarıqlar, sağda isə zaman xətti olan müasir format.",
    supportedAccents: ["#0284c7", "#1e3a8a", "#059669", "#4338ca", "#d97706"],
    defaultAccent: "#0284c7",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 95,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "modern-minimal-cv",
    name: "Modern Minimal",
    name_az: "Müasir Minimalist",
    category: "modern",
    atsLevel: "good",
    description: "Clean sans-serif modern typography with spacious section breaks.",
    description_az: "Geniş bölmə aralıqları olan təmiz müasir tipoqrafik format.",
    supportedAccents: ["#111827", "#0284c7", "#059669", "#4338ca"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: true,
    atsScore: 96,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "editorial-cv",
    name: "Swiss Editorial",
    name_az: "İsveçrə Redaksiyası",
    category: "modern",
    atsLevel: "good",
    description: "High-typography modernist Swiss grid layout with disciplined hierarchy.",
    description_az: "Yüksək tipoqrafiyalı İsveçrə modernist şəbəkə formatı.",
    supportedAccents: ["#111827", "#1e3a8a", "#881337", "#0284c7"],
    defaultAccent: "#111827",
    layoutType: "two-column",
    supportsProfileImage: false,
    atsScore: 95,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "nordic-cv",
    name: "Nordic Soft Banner",
    name_az: "Nordik Pastel",
    category: "modern",
    atsLevel: "good",
    description: "Pastel header banner with career quote & 2-column split.",
    description_az: "Pastel göy başlıq zolağı və 2 sütunlu zərif format.",
    supportedAccents: ["#3b82f6", "#0284c7", "#059669", "#4338ca"],
    defaultAccent: "#3b82f6",
    layoutType: "banner",
    supportsProfileImage: true,
    atsScore: 92,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "clean-modern-cv",
    name: "Clean Modern",
    name_az: "Təmiz Müasir",
    category: "modern",
    atsLevel: "good",
    description: "Balanced contemporary single-column layout with left date column.",
    description_az: "Sol tərəfdə tarix sütunu olan balanslaşdırılmış müasir format.",
    supportedAccents: ["#1e3a8a", "#0284c7", "#059669", "#111827"],
    defaultAccent: "#1e3a8a",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 97,
    presetData: TECH_CV_PRESET,
  },

  // ── 3. TECH & ENGINEERING ──
  {
    id: "developer-cv",
    name: "Developer Compact",
    name_az: "Proqramçı Sıx",
    category: "tech",
    atsLevel: "good",
    description: "Terminal-styled dense engineering layout with tech stack badges.",
    description_az: "Terminal üslublu sıx mühəndislik formatı və texnoloji nişanlar.",
    supportedAccents: ["#059669", "#0284c7", "#111827", "#4338ca"],
    defaultAccent: "#059669",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 98,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "engineering-cv",
    name: "Engineering Terminal",
    name_az: "Mühəndis Terminalı",
    category: "tech",
    atsLevel: "good",
    description: "Monospace technical hierarchy with quantified impacts and GitHub badges.",
    description_az: "Ölçülən nəticələr və GitHub nişanları olan monospaced mühəndis formatı.",
    supportedAccents: ["#111827", "#059669", "#0284c7", "#4338ca"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 98,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "academic-cv",
    name: "Academic Research",
    name_az: "Akademik Tədqiqat",
    category: "tech",
    atsLevel: "excellent",
    description: "LaTeX-inspired curriculum vitae for researchers, professors, and scientists.",
    description_az: "Tədqiqatçılar və alimlər üçün LaTeX üslublu akademik CV formatı.",
    supportedAccents: ["#111827", "#1e3a8a", "#881337"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },

  // ── 4. EXECUTIVE ──
  {
    id: "professional-cv",
    name: "Executive Sidebar",
    name_az: "Rəhbər Yan Sütun",
    category: "executive",
    atsLevel: "good",
    description: "Executive split layout with dark sidebar, photo, and leadership timeline.",
    description_az: "Qaranlıq yan sütun, şəkil və zaman xətti olan rəhbər formatı.",
    supportedAccents: ["#1e3a8a", "#059669", "#2c2d30", "#881337", "#0284c7"],
    defaultAccent: "#1e3a8a",
    layoutType: "sidebar",
    supportsProfileImage: true,
    atsScore: 92,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "executive-cv",
    name: "Executive Timeline",
    name_az: "Rəhbər Zaman Xətti",
    category: "executive",
    atsLevel: "good",
    description: "LaTeX moderncv layout with left date metadata columns.",
    description_az: "Sol tərəfdə tarix sütunları olan LaTeX moderncv formatı.",
    supportedAccents: ["#1e3a8a", "#0284c7", "#111827", "#059669"],
    defaultAccent: "#1e3a8a",
    layoutType: "two-column",
    supportsProfileImage: false,
    atsScore: 96,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "quotation-cv",
    name: "Quotation & Lead",
    name_az: "Sitat və Liderlik",
    category: "executive",
    atsLevel: "creative",
    description: "Executive quotation hero block with 2-column asymmetric layout (Resumify).",
    description_az: "Böyük sitat bloku və 2 sütunlu asimmetrik liderlik formatı.",
    supportedAccents: ["#d97706", "#1e3a8a", "#059669", "#881337"],
    defaultAccent: "#d97706",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 94,
    presetData: MODERN_CV_PRESET,
  },

  // ── 5. CREATIVE ──
  {
    id: "creative-cv",
    name: "Onyx Creative",
    name_az: "Onyx Kreativ",
    category: "creative",
    atsLevel: "creative",
    description: "Reactive Resume Onyx style with bold colored header banner and skill badges.",
    description_az: "Müasir rəngli başlıq və texnologiya kartları olan Onyx formatı.",
    supportedAccents: ["#1e3a8a", "#4338ca", "#059669", "#d97706"],
    defaultAccent: "#1e3a8a",
    layoutType: "banner",
    supportsProfileImage: true,
    atsScore: 90,
    presetData: MODERN_CV_PRESET,
  },

  // ── 6. CLEAN CANVAS ──
  {
    id: "blank-cv",
    name: "Clean Canvas",
    name_az: "Təmiz Kətan",
    category: "classic",
    atsLevel: "good",
    description: "Fresh blank canvas to create your custom resume from scratch.",
    description_az: "Öz CV-nizi sıfırdan yaratmaq üçün təmiz kətan.",
    supportedAccents: ["#111827", "#1e3a8a", "#0284c7"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 95,
    presetData: TECH_CV_PRESET,
  },
];
