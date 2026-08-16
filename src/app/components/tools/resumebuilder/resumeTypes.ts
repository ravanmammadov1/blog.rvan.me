export type TemplateId =
  | "sb2nov"
  | "moderncv"
  | "onyx"
  | "leafish"
  | "dark-sidebar"
  | "modern-2col"
  | "soft-banner"
  | "classic-harvard"
  | "modern-tech";

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
  rating?: number; // 1 to 5 dots
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

export const TEMPLATE_OPTIONS: { id: TemplateId; name: string; description: string; bestFor: string; sourceBadge?: string }[] = [
  {
    id: "sb2nov",
    name: "RenderCV sb2nov (r/EngineeringResumes)",
    description: "The world's most widely used LaTeX engineering resume template. Full-width clean section lines and metric-dense typography.",
    bestFor: "Software Engineers, FAANG/Big Tech, AI Researchers",
    sourceBadge: "RenderCV",
  },
  {
    id: "moderncv",
    name: "RenderCV ModernCV (LaTeX Class)",
    description: "Iconic LaTeX ModernCV document class with left date metadata columns and accent bullet highlights.",
    bestFor: "Academics, Scientists, Senior Engineers",
    sourceBadge: "RenderCV",
  },
  {
    id: "onyx",
    name: "Reactive Resume Onyx",
    description: "Sleek modern header badge with clean 2-column card grid and high-contrast typography.",
    bestFor: "Tech Leads, Architects, Designers",
    sourceBadge: "Reactive Resume",
  },
  {
    id: "leafish",
    name: "Reactive Resume Leafish",
    description: "Modern sidebar layout with soft accent container, icon bullet points, and high contrast readability.",
    bestFor: "Product Managers, Growth, Marketing",
    sourceBadge: "Reactive Resume",
  },
  {
    id: "dark-sidebar",
    name: "Dark Sidebar Executive",
    description: "Contrast split layout with dark left sidebar, circular photo, timeline experience, and references.",
    bestFor: "Executives, Accountants, Consultants, Operations",
    sourceBadge: "Executive",
  },
  {
    id: "modern-2col",
    name: "Enhancv 2-Column Grid",
    description: "2-Column layout with top photo, skill badges, key strengths with icons, and language rating dots.",
    bestFor: "Project Managers, Tech Leads, Developers, Analysts",
    sourceBadge: "Enhancv",
  },
  {
    id: "soft-banner",
    name: "Nordic Soft Banner",
    description: "Clean pastel header banner with overlapping portrait, career overview quote, and modern 2-column split.",
    bestFor: "Healthcare, Education, Design, Communications",
    sourceBadge: "Nordic",
  },
  {
    id: "classic-harvard",
    name: "Classic Harvard (ATS Gold)",
    description: "Universal single-column standard with horizontal dividers, 100% accepted by all ATS software.",
    bestFor: "Universal, Big Tech, Finance, Legal, Law",
    sourceBadge: "Harvard",
  },
  {
    id: "modern-tech",
    name: "Silicon Valley Tech Stack",
    description: "High-impact developer format with tech stack pills, live project links, and metric-driven achievements.",
    bestFor: "Software Engineers, DevOps, Full-Stack Developers",
    sourceBadge: "Silicon Valley",
  },
];

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

// Rich Preset: Dark Sidebar Executive (Matching Image 1)
export const DARK_SIDEBAR_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Richard Sanchez",
    title: "Accounting Executive",
    email: "henrysilly@gmail.com",
    phone: "+012 345 678 902",
    location: "12th Avenue Street, Australia 40000",
    website: "https://www.henrysilly.com",
    linkedin: "https://linkedin.com/in/richardsanchez",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Highly motivated and detail-oriented Accounting Professional with strong experience in financial reporting, bookkeeping, and data analysis. Skilled in preparing financial statements, managing accounts payable/receivable, and performing reconciliations with a high level of accuracy. Known for strong analytical thinking, problem-solving abilities, and maintaining compliance with accounting standards.",
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
        "Implemented cost-control measures resulting in a 15% reduction in operational expenses.",
        "Streamlined financial reporting processes, enhancing overall efficiency by 20%.",
        "Led a team in successfully navigating a complex audit, ensuring compliance with industry regulations.",
      ],
    },
    {
      id: "exp-3",
      title: "Junior Accountant",
      company: "Arowwai Industries",
      location: "Brisbane, Australia",
      startDate: "Jan 2020",
      endDate: "Jun 2022",
      current: false,
      bullets: [
        "Implemented cost-control measures resulting in a 15% reduction in operational expenses.",
        "Streamlined financial reporting processes, enhancing overall efficiency by 20%.",
        "Led a team in successfully navigating a complex audit, ensuring compliance with industry regulations.",
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
    {
      id: "edu-2",
      degree: "Bachelor of Business Management",
      field: "Economics",
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
        "Client Acquisition",
        "B2B Sales",
        "Negotiation",
        "Relationship Management",
        "Market Analysis",
        "Sales Strategies",
        "Negotiation Skills",
        "Problem-Solving",
        "Time Management",
        "Presentation Skills",
        "Networking",
        "Market Research",
      ],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [
    {
      id: "cert-1",
      name: "Certified Public Accountant (CPA)",
      issuer: "CPA Australia",
      date: "2021",
    },
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
    {
      id: "ref-2",
      name: "Harper Russo",
      position: "CEO",
      company: "Wardiere Inc.",
      phone: "+123-456-7890",
      email: "Russ@mail.com",
    },
  ],
};

// Rich Preset: Modern 2-Column (Matching Image 2)
export const MODERN_2COL_PRESET: ResumeData = {
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
    "With over 12 years of experience in project management, William Davis brings a wealth of expertise in managing complex IT projects, particularly in cloud technology. He has a proven ability to enhance efficiency, having managed a $2M project portfolio, resulting in significant cost reductions. His proficiency in project management software tools and data analysis complements his strong leadership and creative problem-solving skills.",
  experiences: [
    {
      id: "exp-1",
      title: "Senior IT Project Manager",
      company: "IBM",
      location: "New York, NY, USA",
      startDate: "2018",
      endDate: "2023",
      current: true,
      bullets: [
        "Managed complex IT projects with a focus on timing, functionality, and cost efficiency.",
        "Oversaw a $2M project portfolio resulting in a 15% reduction in costs through strategic resource allocation.",
        "Initiated and successfully implemented refined processes leading to a 20% increase in project delivery efficiency.",
        "Managed a cross-functional team of 15 professionals across diverse areas for effective project execution.",
      ],
    },
    {
      id: "exp-2",
      title: "IT Project Manager",
      company: "Microsoft",
      location: "Redmond, WA, USA",
      startDate: "2014",
      endDate: "2018",
      current: false,
      bullets: [
        "Directed project planning and execution ensuring project goals and requirements were met.",
        "Managed a range of IT projects with budgets up to $1.5M, meeting all project requirements within budget constraints.",
        "Enhanced communication efficiency by 30% by implementing an advanced project management software tool.",
        "Executed full project lifecycle management, increasing project completion rate by 25%.",
      ],
    },
    {
      id: "exp-3",
      title: "Associate Project Manager",
      company: "Apple Inc.",
      location: "Cupertino, CA, USA",
      startDate: "2011",
      endDate: "2014",
      current: false,
      bullets: [
        "Assisted in project management tasks, including planning, execution, and status updates communication.",
        "Assisted in managing IT projects leading to a 10% reduction in project delivery timeline.",
        "Implemented a new data analysis methodology leading to a 15% improvement in project tracking accuracy.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science & Information Systems",
      field: "Information Technology",
      institution: "Columbia University",
      location: "New York, NY",
      startDate: "2007",
      endDate: "2011",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Management & Tech",
      items: [
        "Project Management",
        "Leadership",
        "Cost Management",
        "Cloud Knowledge",
        "Problem Solving",
        "Excel",
        "Access",
        "Word",
        "PowerPoint",
        "PowerBI",
        "Mentorship",
        "Organizational Skills",
      ],
    },
  ],
  strengths: [
    {
      id: "str-1",
      title: "Creative Problem Solving",
      description: "Utilize creative solutions to tackle challenges, evident in the 20% increase in project delivery efficiency at IBM.",
      icon: "trophy",
    },
    {
      id: "str-2",
      title: "Strong Leadership",
      description: "Experienced in leading and mentoring teams, resulting in highly efficient project execution.",
      icon: "star",
    },
    {
      id: "str-3",
      title: "Efficient Resource Allocation",
      description: "Spearheaded the reorganization of resource allocation in projects, resulting in a 15% cost reduction.",
      icon: "diamond",
    },
  ],
  projects: [],
  certifications: [
    {
      id: "cert-1",
      name: "Project Management Professional (PMP)",
      issuer: "PMI",
      date: "2016",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "Spanish", proficiency: "Fluent", rating: 4 },
    { id: "lang-3", language: "Arabic", proficiency: "Basic", rating: 1 },
  ],
  references: [],
};

// Rich Preset: Nordic Soft Banner (Matching Image 3)
export const SOFT_BANNER_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Emily Carter",
    title: "Registered Nurse & Clinical Care Specialist",
    email: "hello@e-mail.com",
    phone: "123 4567890",
    location: "123 High Street - London, UK",
    website: "",
    linkedin: "www.linkedin.com/username",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1594824813590-78a08d3c52e6?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Experienced Registered Nurse with over 5 years of providing high-quality patient care in hospital settings. Skilled in patient assessment, medication administration, and care planning. Committed to delivering optimal outcomes and continuous professional development.",
  experiences: [
    {
      id: "exp-1",
      title: "Registered Nurse",
      company: "St. Mary's Hospital, London",
      location: "London, UK",
      startDate: "January 2020",
      endDate: "Present",
      current: true,
      bullets: [
        "Provide patient care in the emergency department, administering medications and performing diagnostic tests.",
        "Collaborate with medical teams to develop care plans, ensuring high patient satisfaction.",
      ],
    },
    {
      id: "exp-2",
      title: "Nurse – Medical-Surgical Unit",
      company: "Royal Infirmary, Manchester",
      location: "Manchester, UK",
      startDate: "June 2017",
      endDate: "December 2019",
      current: false,
      bullets: [
        "Delivered post-surgery care, monitored vital signs, and provided patient education.",
        "Assisted in training junior staff and reduced readmission rates through effective care.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Nursing (BSc Nursing)",
      field: "Clinical Nursing",
      institution: "University of Manchester",
      location: "Manchester, UK",
      startDate: "September 2014",
      endDate: "June 2017",
      honors: "Grade: 2:1 (Upper Second Class)",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Clinical Skills",
      items: [
        "Patience",
        "Good communication",
        "Empathy and compassion",
        "Strong attention to detail",
        "Stamina & Strength",
        "Strong work ethic",
        "Flexibility",
      ],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [
    { id: "cert-1", name: "Certified professional nurse", issuer: "NMC UK", date: "2018" },
    { id: "cert-2", name: "Certified Newborn baby care", issuer: "NHS Trust", date: "2019" },
    { id: "cert-3", name: "End of life and Palliative care", issuer: "NHS Trust", date: "2021" },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "French", proficiency: "Fluent", rating: 4 },
    { id: "lang-3", language: "Spanish", proficiency: "Professional", rating: 3 },
  ],
  references: [],
};

export const SOFTWARE_ENGINEER_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    title: "Senior Full-Stack Engineer | Distributed Systems & Cloud Architecture",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 342-8921",
    location: "San Francisco, CA",
    website: "https://alexrivera.dev",
    linkedin: "https://linkedin.com/in/alexrivera-eng",
    github: "https://github.com/alexrivera-dev",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Performance-driven Senior Software Engineer with 6+ years of experience architecting high-throughput microservices, real-time web apps, and distributed cloud infrastructure. Spearheaded zero-downtime database migrations serving 10M+ daily active users while reducing AWS cloud compute costs by 34%.",
  experiences: [
    {
      id: "exp-1",
      title: "Senior Full-Stack Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected an event-driven payment ledger processing over $450M in monthly volume with 99.999% uptime SLA.",
        "Scaled distributed Redis caching layer, reducing p99 API response latencies from 320ms to 48ms.",
        "Spearheaded end-to-end migration of legacy monolithic endpoints to Go microservices deployed via Kubernetes on AWS EKS.",
      ],
    },
    {
      id: "exp-2",
      title: "Software Engineer II",
      company: "Vercel",
      location: "Remote",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      bullets: [
        "Engineered edge routing functions in TypeScript and Rust, improving static asset delivery speeds across 180+ global PoPs by 28%.",
        "Optimized client-side bundle footprints by 42% through automated tree-shaking algorithms and modern code splitting.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      field: "Distributed Systems & Machine Learning",
      institution: "University of California, Berkeley",
      location: "Berkeley, CA",
      startDate: "2015",
      endDate: "2019",
      gpa: "3.88 / 4.00",
      honors: "Magna Cum Laude",
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
      name: "Frameworks & Cloud",
      items: ["React", "Next.js", "Node.js", "TailwindCSS", "PostgreSQL", "Docker", "Kubernetes", "AWS"],
    },
  ],
  strengths: [
    {
      id: "str-1",
      title: "High-Throughput Architecture",
      description: "Proven record handling 10M+ daily events and sub-50ms API latencies.",
      icon: "zap",
    },
    {
      id: "str-2",
      title: "Cost Optimization",
      description: "Reduced AWS infrastructure cloud footprint by 34% through container rightsizing.",
      icon: "diamond",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "HyperScale Analytics Engine",
      role: "Lead Creator",
      techStack: ["Go", "ClickHouse", "React", "Docker"],
      link: "https://hyperscale.dev",
      github: "https://github.com/alexrivera-dev/hyperscale",
      description: [
        "Open-source distributed analytics pipeline capable of indexing 100M+ web telemetry events daily.",
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "Spanish", proficiency: "Professional", rating: 4 },
  ],
  references: [],
};

export const PRODUCT_DESIGNER_PRESET: ResumeData = {
  personalInfo: {
    fullName: "Elena Rostova",
    title: "Lead Product Designer & Design Systems Architect",
    email: "elena.rostova@design.co",
    phone: "+1 (555) 890-1234",
    location: "New York, NY",
    website: "https://elenarostova.design",
    linkedin: "https://linkedin.com/in/elenarostova",
    github: "",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    showPhoto: true,
  },
  summary:
    "Product Designer with 7+ years of experience leading UX/UI design, design token systems, and user research for high-growth enterprise SaaS platforms. Increased conversion rates by 46% through iterative user journey mapping and accessible design practices.",
  experiences: [
    {
      id: "exp-1",
      title: "Lead Product Designer",
      company: "Figma Ecosystems",
      location: "New York, NY",
      startDate: "2021-08",
      endDate: "Present",
      current: true,
      bullets: [
        "Spearheaded multi-brand Design System adopted by 120+ engineers and 35 designers, reducing UI sprint cycle times by 55%.",
        "Conducted 80+ qualitative user interviews, translating user pain points into seamless workflows that boosted retention by 24%.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.F.A. in Interaction Design",
      field: "Human-Computer Interaction",
      institution: "Rhode Island School of Design (RISD)",
      location: "Providence, RI",
      startDate: "2013",
      endDate: "2017",
    },
  ],
  skills: [
    {
      id: "sk-1",
      name: "Design & Systems",
      items: ["Design Systems", "Figma", "Interaction Design", "Prototyping", "User Research", "Wireframing"],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [],
  languages: [
    { id: "lang-1", language: "English", proficiency: "Native", rating: 5 },
    { id: "lang-2", language: "French", proficiency: "Fluent", rating: 4 },
  ],
  references: [],
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
    photoUrl: "",
    showPhoto: false,
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
      name: "Key Skills",
      items: [],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
};
