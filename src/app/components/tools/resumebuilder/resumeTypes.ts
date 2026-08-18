export type TemplateId =
  | "tech-cv"
  | "minimal-cv"
  | "modern-cv"
  | "professional-cv"
  | "developer-cv"
  | "quotation-cv"
  | "editorial-cv"
  | "corporate-cv"
  | "executive-cv"
  | "creative-cv"
  | "nordic-cv"
  | "compact-ats-cv"
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
  category: "classic" | "modern" | "tech" | "creative";
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
];

export const FONT_OPTIONS: { id: ResumeFont; label: string; fontFamily: string }[] = [
  { id: "sans", label: "Geist / Inter (Modern Sans)", fontFamily: "'Geist', 'Inter', system-ui, sans-serif" },
  { id: "serif", label: "Merriweather (Classic Serif)", fontFamily: "'Merriweather', 'Georgia', serif" },
  { id: "mono", label: "JetBrains (Tech Mono)", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" },
];

// 1. Tech CV Preset (RenderCV sb2nov)
export const TECH_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    title: "Senior Software Engineer | Cloud Architecture",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 342-8921",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.com/in/alexrivera-eng",
    github: "https://github.com/alexrivera-dev",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    showPhoto: false,
  },
  summary:
    "Performance-driven Senior Software Engineer with 6+ years of experience architecting high-throughput microservices, real-time web apps, and distributed cloud infrastructure. Spearheaded zero-downtime database migrations serving 10M+ daily active users while reducing AWS cloud compute costs by 34%.",
  experiences: [
    {
      id: "exp-1",
      title: "Senior Full-Stack Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected an event-driven payment ledger processing over $450M in monthly volume with 99.999% uptime SLA.",
        "Scaled distributed Redis caching layer, reducing p99 API response latencies from 320ms to 48ms.",
        "Spearheaded migration of monolithic endpoints to Go microservices deployed via Kubernetes on AWS EKS.",
      ],
    },
    {
      id: "exp-2",
      title: "Software Engineer II",
      company: "Vercel",
      location: "Remote",
      startDate: "2019",
      endDate: "2022",
      current: false,
      bullets: [
        "Engineered edge routing functions in TypeScript and Rust, improving static asset delivery speeds by 28%.",
        "Optimized client-side bundle footprints by 42% through automated tree-shaking algorithms.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      field: "Distributed Systems & Machine Learning",
      institution: "UC Berkeley",
      location: "Berkeley, CA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.88",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Languages",
      items: ["TypeScript", "JavaScript", "Go", "Python", "Rust", "SQL"],
    },
    {
      id: "sk-2",
      name: "Technologies",
      items: ["React", "Next.js", "Node.js", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
    },
  ],
  strengths: [],
  projects: [
    {
      id: "proj-1",
      name: "HyperScale Analytics",
      role: "Lead Creator",
      techStack: ["Go", "ClickHouse", "React", "Docker"],
      link: "https://hyperscale.dev",
      github: "https://github.com/alexrivera-dev/hyperscale",
      description: ["Open-source distributed analytics pipeline capable of indexing 100M+ web events daily."],
    },
  ],
  certifications: [
    { id: "cert-1", name: "AWS Certified Solutions Architect", issuer: "Amazon", date: "2023" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
  ],
  references: [],
};

// 2. Professional CV Preset (Dark Sidebar Executive)
export const PROFESSIONAL_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Richard Sanchez",
    title: "Accounting Executive",
    email: "henrysilly@gmail.com",
    phone: "+012 345 678 902",
    location: "Sydney, Australia",
    website: "https://www.henrysilly.com",
    linkedin: "https://linkedin.com/in/richardsanchez",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Highly motivated and detail-oriented Accounting Professional with strong experience in financial reporting, bookkeeping, and data analysis. Skilled in preparing financial statements, managing accounts payable/receivable, and performing reconciliations with a high level of accuracy.",
  experiences: [
    {
      id: "exp-1",
      title: "Accounting Executive",
      company: "Arowwai Industries",
      location: "Sydney, Australia",
      startDate: "Jan 2024",
      endDate: "Present",
      current: true,
      bullets: [
        "Implemented cost-control measures resulting in a 15% reduction in operational expenses.",
        "Streamlined financial reporting processes, enhancing overall efficiency by 20%.",
        "Led a team in successfully navigating a complex audit, ensuring compliance with industry regulations.",
      ],
    },
    {
      id: "exp-2",
      title: "Accountant",
      company: "Arowwai Industries",
      location: "Melbourne, Australia",
      startDate: "Jun 2022",
      endDate: "Jan 2024",
      current: false,
      bullets: [
        "Prepared quarterly financial reports and automated reconciliation workflows.",
        "Managed account payable cycles, achieving 99.8% timely supplier payments.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Business Management",
      field: "Finance & Accounting",
      institution: "Borcelle University",
      location: "Melbourne, Australia",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Core Skills",
      items: [
        "Financial Reporting",
        "Cost Control",
        "Audit Compliance",
        "B2B Negotiation",
        "Tax Planning",
        "Market Analysis",
        "QuickBooks",
        "Excel Modeling",
      ],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [
    { id: "cert-1", name: "Certified Public Accountant (CPA)", issuer: "CPA Australia", date: "2021" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "Spanish", proficiency: "Professional", rating: 4 },
  ],
  references: [
    {
      id: "ref-1",
      name: "Estelle Darcy",
      position: "CEO",
      company: "Wardiere Inc.",
      phone: "+123-456-7890",
      email: "Darcy@mail.com",
    },
  ],
};

// 3. Modern CV Preset (Enhancv 2-Col)
export const MODERN_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Andrew Clark",
    title: "Experienced Project Manager | IT | Leadership | Cost Management",
    email: "help@enhancv.com",
    phone: "+1-541-754-3010",
    location: "New York, NY, USA",
    website: "https://andrewclark.pm",
    linkedin: "https://linkedin.com/in/andrew-clark",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "With over 12 years of experience in project management, Andrew Clark brings a wealth of expertise in managing complex IT projects, particularly in cloud technology. Managed a $2M project portfolio, resulting in significant cost reductions.",
  experiences: [
    {
      id: "exp-1",
      title: "Senior IT Project Manager",
      company: "IBM",
      location: "New York, NY",
      startDate: "2018",
      endDate: "2023",
      current: true,
      bullets: [
        "Managed complex IT projects with a focus on timing, functionality, and cost efficiency.",
        "Oversaw a $2M project portfolio resulting in a 15% reduction in costs through strategic resource allocation.",
        "Implemented refined agile processes leading to a 20% increase in delivery efficiency.",
      ],
    },
    {
      id: "exp-2",
      title: "IT Project Manager",
      company: "Microsoft",
      location: "Redmond, WA",
      startDate: "2014",
      endDate: "2018",
      current: false,
      bullets: [
        "Managed a range of IT projects with budgets up to $1.5M within budget constraints.",
        "Enhanced communication efficiency by 30% by implementing advanced PM software.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      field: "Information Systems",
      institution: "Columbia University",
      location: "New York, NY",
      startDate: "2007",
      endDate: "2011",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Skills",
      items: ["Project Management", "Leadership", "Cost Management", "Cloud Knowledge", "Agile & Scrum", "PowerBI", "Risk Assessment"],
    },
  ],
  strengths: [
    {
      id: "str-1",
      title: "Creative Problem Solving",
      description: "Utilize creative solutions to tackle challenges, evident in 20% delivery speed increase.",
      icon: "trophy",
    },
    {
      id: "str-2",
      title: "Strong Leadership",
      description: "Experienced in leading cross-functional teams of 15+ professionals.",
      icon: "star",
    },
  ],
  projects: [],
  certifications: [
    { id: "cert-1", name: "PMP – Project Management Professional", issuer: "PMI", date: "2016" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "Spanish", proficiency: "Fluent", rating: 4 },
  ],
  references: [],
};

// 4. Nordic CV Preset
export const NORDIC_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Emily Carter",
    title: "Registered Nurse & Clinical Care Specialist",
    email: "hello@e-mail.com",
    phone: "123 4567890",
    location: "London, UK",
    website: "",
    linkedin: "www.linkedin.com/username",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1594824813590-78a08d3c52e6?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Experienced Registered Nurse with over 5 years of providing high-quality patient care in hospital settings. Skilled in patient assessment, medication administration, and care planning.",
  experiences: [
    {
      id: "exp-1",
      title: "Registered Nurse",
      company: "St. Mary's Hospital",
      location: "London, UK",
      startDate: "2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Provide patient care in emergency department, administering medications and diagnostic tests.",
        "Collaborate with medical teams to develop care plans, ensuring high satisfaction.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "BSc in Clinical Nursing",
      field: "Nursing Science",
      institution: "University of Manchester",
      location: "Manchester, UK",
      startDate: "2014",
      endDate: "2017",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Clinical Skills",
      items: ["Patient Assessment", "Emergency Care", "Empathy & Compassion", "Attention to Detail", "Team Coordination"],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [
    { id: "cert-1", name: "Certified Professional Nurse", issuer: "NMC UK", date: "2018" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "French", proficiency: "Fluent", rating: 4 },
  ],
  references: [],
};

// 5. Blank CV Preset
export const BLANK_CV_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Your Name",
    title: "Your Professional Title",
    email: "your.email@example.com",
    phone: "+1 (555) 000-0000",
    location: "City, Country",
    website: "",
    linkedin: "",
    github: "",
    photoUrl: "",
    showPhoto: false,
  },
  summary: "Brief professional summary highlighting your core expertise, career goals, and key achievements.",
  experiences: [
    {
      id: "exp-1",
      title: "Job Title",
      company: "Company Name",
      location: "Location",
      startDate: "2023",
      endDate: "Present",
      current: true,
      bullets: ["Describe your main responsibilities and achievements with measurable metrics."],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science",
      field: "Major / Field",
      institution: "University Name",
      location: "Location",
      startDate: "2019",
      endDate: "2023",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Core Skills",
      items: ["Skill 1", "Skill 2", "Skill 3"],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
  ],
  references: [],
};

// Unified Templates Definition (12 distinct professional templates with exact supported accents)
export const UNIFIED_TEMPLATES: TemplateDefinition[] = [
  {
    id: "tech-cv",
    name: "Modern Tech",
    name_az: "Müasir Texniki",
    category: "tech",
    description: "ATS gold standard engineering layout (LaTeX sb2nov style).",
    description_az: "FAANG və mühəndislər üçün ATS uyğun qızıl standart (sb2nov).",
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
    description: "Clean single-column Harvard ATS standard format.",
    description_az: "Təmiz 1 sütunlu klassik Harvard ATS formatı.",
    supportedAccents: ["#111827", "#1e3a8a", "#881337", "#2c2d30"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "modern-cv",
    name: "Modern 2-Column",
    name_az: "Müasir 2-Sütun",
    category: "modern",
    description: "2-Column layout with skill badges, strengths, and rating dots.",
    description_az: "Bacarıq nişanları, güclü tərəflər və dil reytinqi olan 2 sütunlu format.",
    supportedAccents: ["#0284c7", "#1e3a8a", "#059669", "#4338ca", "#d97706"],
    defaultAccent: "#0284c7",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 95,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "professional-cv",
    name: "Executive Sidebar",
    name_az: "Rəhbər Yan Sütun",
    category: "classic",
    description: "Executive split layout with dark sidebar, photo, and timeline.",
    description_az: "Qaranlıq yan sütun, şəkil və zaman xətti olan rəhbər formatı.",
    supportedAccents: ["#1e3a8a", "#059669", "#2c2d30", "#881337", "#0284c7"],
    defaultAccent: "#1e3a8a",
    layoutType: "sidebar",
    supportsProfileImage: true,
    atsScore: 92,
    presetData: PROFESSIONAL_CV_PRESET,
  },
  {
    id: "developer-cv",
    name: "Developer Compact",
    name_az: "Proqramçı Sıx",
    category: "tech",
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
    id: "quotation-cv",
    name: "Quotation & Lead",
    name_az: "Sitat və Liderlik",
    category: "creative",
    description: "Executive quotation hero block with 2-column asymmetric layout (Resumify).",
    description_az: "Böyük sitat bloku və 2 sütunlu asimmetrik liderlik formatı.",
    supportedAccents: ["#d97706", "#1e3a8a", "#059669", "#881337"],
    defaultAccent: "#d97706",
    layoutType: "two-column",
    supportsProfileImage: true,
    atsScore: 94,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "editorial-cv",
    name: "Swiss Editorial",
    name_az: "İsveçrə Redaksiyası",
    category: "modern",
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
    id: "corporate-cv",
    name: "Clean Corporate",
    name_az: "Təmiz Korporativ",
    category: "classic",
    description: "Traditional executive divider structure with core competency grid.",
    description_az: "Əsas bacarıqlar şəbəkəsi olan ənənəvi korporativ format.",
    supportedAccents: ["#1e3a8a", "#111827", "#059669", "#881337"],
    defaultAccent: "#1e3a8a",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 99,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "executive-cv",
    name: "Moderncv Timeline",
    name_az: "Moderncv Zaman Xətti",
    category: "classic",
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
    id: "creative-cv",
    name: "Onyx Creative",
    name_az: "Onyx Kreativ",
    category: "creative",
    description: "Reactive Resume Onyx style with bold colored header banner.",
    description_az: "Müasir rəngli başlıq və texnologiya kartları olan Onyx formatı.",
    supportedAccents: ["#1e3a8a", "#4338ca", "#059669", "#d97706"],
    defaultAccent: "#1e3a8a",
    layoutType: "banner",
    supportsProfileImage: true,
    atsScore: 90,
    presetData: MODERN_CV_PRESET,
  },
  {
    id: "nordic-cv",
    name: "Nordic Soft Banner",
    name_az: "Nordik Pastel",
    category: "creative",
    description: "Pastel header banner with career quote & 2-column split.",
    description_az: "Pastel göy başlıq zolağı və 2 sütunlu zərif format.",
    supportedAccents: ["#3b82f6", "#0284c7", "#059669", "#4338ca"],
    defaultAccent: "#3b82f6",
    layoutType: "banner",
    supportsProfileImage: true,
    atsScore: 92,
    presetData: NORDIC_CV_PRESET,
  },
  {
    id: "compact-ats-cv",
    name: "Compact Plain ATS",
    name_az: "Sıx Sadə ATS",
    category: "tech",
    description: "Dense, plain-text parser compliant single-page format.",
    description_az: "Maksimum sıx və avtomatlaşdırılmış oxucular üçün tam uyğun format.",
    supportedAccents: ["#111827", "#1e3a8a", "#2c2d30"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 100,
    presetData: TECH_CV_PRESET,
  },
  {
    id: "blank-cv",
    name: "Clean Canvas",
    name_az: "Təmiz Kətan",
    category: "classic",
    description: "Fresh blank canvas to create your custom resume.",
    description_az: "Öz CV-nizi sıfırdan yaratmaq üçün təmiz kətan.",
    supportedAccents: ["#111827", "#1e3a8a", "#0284c7"],
    defaultAccent: "#111827",
    layoutType: "single-column",
    supportsProfileImage: false,
    atsScore: 95,
    presetData: BLANK_CV_PRESET,
  },
];
