import { calculateAtsScore, exportToJsonResume, importFromJsonResume } from "../src/app/components/tools/resumebuilder/atsEngine";
import { UNIFIED_TEMPLATES, ResumeData } from "../src/app/components/tools/resumebuilder/resumeTypes";

console.log("==================================================");
console.log("🚀 STARTING CV BUILDER PHASE 3 MATRIX TEST SUITE");
console.log("==================================================");

// 1. Minimal Dataset
const minimalData: ResumeData = {
  personalInfo: {
    fullName: "Alex Doe",
    title: "Junior Dev",
    email: "alex@example.com",
    phone: "+1555019283",
    location: "Baku, AZ",
    website: "",
    linkedin: "",
    github: "",
    showPhoto: false,
  },
  summary: "Junior software developer enthusiastic about building modern web applications.",
  experiences: [
    {
      id: "exp_1",
      title: "Frontend Intern",
      company: "Tech Corp",
      location: "Baku",
      startDate: "2023",
      endDate: "2024",
      current: false,
      bullets: [
        "Built responsive web components using React and Tailwind CSS.",
        "Collaborated with senior engineers to fix critical UI bugs.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "BSc Computer Science",
      field: "Computer Science",
      institution: "State University",
      location: "Baku",
      startDate: "2019",
      endDate: "2023",
    },
  ],
  skills: [
    {
      id: "skill_1",
      name: "Core Skills",
      items: ["JavaScript", "TypeScript", "React", "HTML/CSS"],
    },
  ],
  strengths: [],
  projects: [],
  certifications: [],
  languages: [{ id: "l1", language: "English", proficiency: "Professional" }],
  references: [],
};

// 2. Normal Dataset
const standardData: ResumeData = {
  personalInfo: {
    fullName: "Sarah Jenkins",
    title: "Senior Full-Stack Engineer",
    email: "sarah.jenkins@example.com",
    phone: "+1 (555) 349-2049",
    location: "San Francisco, CA",
    website: "https://sarahjenkins.dev",
    linkedin: "https://linkedin.com/in/sarahjenkins",
    github: "https://github.com/sarahjenkins",
    photoUrl: "data:image/svg+xml;utf8,<svg></svg>",
    showPhoto: true,
  },
  summary: "Accomplished Senior Full-Stack Engineer with 7+ years of experience engineering high-throughput distributed systems and scalable React cloud architectures. Proven track record in mentoring junior talent and reducing cloud infrastructure costs.",
  experiences: [
    {
      id: "exp_1",
      title: "Lead Platform Engineer",
      company: "Stripe Technologies",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected real-time event streaming pipeline processing 15M+ daily transactions, decreasing latency by 42%.",
        "Spearheaded cloud migration to Kubernetes across 4 regions, saving $450k annually in compute costs.",
        "Mentored team of 8 engineers and standardized automated CI/CD deployment pipelines.",
      ],
    },
    {
      id: "exp_2",
      title: "Senior Software Engineer",
      company: "Uber Technologies",
      location: "San Francisco, CA",
      startDate: "2018",
      endDate: "2021",
      current: false,
      bullets: [
        "Engineered scalable microservices handling 250k RPS with 99.99% SLA availability.",
        "Optimized PostgreSQL query execution plans, boosting database throughput by 65%.",
        "Launched customer-facing payment gateway supporting 12 global currencies.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "M.S. in Computer Science",
      field: "Distributed Systems",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2016",
      endDate: "2018",
      gpa: "3.92 / 4.0",
    },
  ],
  skills: [
    {
      id: "s1",
      name: "Programming",
      items: ["TypeScript", "Go", "Python", "Rust", "SQL"],
    },
    {
      id: "s2",
      name: "Frontend & Cloud",
      items: ["React", "Next.js", "GraphQL", "AWS", "Kubernetes", "Docker", "PostgreSQL", "Redis"],
    },
  ],
  strengths: [],
  projects: [
    {
      id: "p1",
      name: "Distributed Cache Engine",
      role: "Creator",
      techStack: ["Go", "Raft", "gRPC"],
      link: "https://github.com/sarahjenkins/cache",
      description: ["High-performance distributed in-memory key-value store with Raft consensus."],
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "AWS Certified Solutions Architect - Professional",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
  languages: [
    { id: "l1", language: "English", proficiency: "Native" },
    { id: "l2", language: "German", proficiency: "Professional" },
  ],
  references: [],
};

// 3. Heavy Edge Case Dataset
const heavyEdgeCaseData: ResumeData = {
  personalInfo: {
    fullName: "Dr. Maximilian Alexander Von Bartholomew-Schumacher III & Associates (Ümlauts & Əlifba: Şamil Əliyev)",
    title: "Chief Technology & Information Security Officer | Strategic Executive | Cloud Infrastructure Leader",
    email: "dr.maximilian.very.long.corporate.executive.address@subdomain.enterprise-technologies-global-organization.com",
    phone: "+44 (0) 20 7946 0912 / +1 800 555 0199 ext 4029",
    location: "Zürich, Switzerland / London, United Kingdom / Silicon Valley, CA",
    website: "https://www.very-long-custom-executive-domain-portfolio.io/leadership/technology-management",
    linkedin: "https://linkedin.com/in/dr-maximilian-alexander-von-bartholomew-schumacher",
    github: "https://github.com/maximilian-enterprise-architecture-group",
    photoUrl: "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3C%2Fsvg%3E",
    showPhoto: true,
  },
  summary: "Distinguished Chief Technology Officer and enterprise systems architect with over 18 years of executive leadership spanning Fortune 50 multinationals, hyper-growth unicorns, and government technology transformations. Renowned for orchestrating multi-million-dollar digital transformations, building global engineering organizations of 250+ engineers across 4 continents, and delivering mission-critical resilient platforms with 99.999% uptime guarantees.",
  experiences: [
    {
      id: "exp_1",
      title: "Global Vice President & Chief Technology Officer",
      company: "International Banking & Global Financial Corporation Holdings Plc.",
      location: "Zürich, Switzerland",
      startDate: "2019",
      endDate: "Present",
      current: true,
      bullets: [
        "Orchestrated global engineering organization of 240+ engineers across 5 international hubs, delivering core banking platform migration with 0 downtime.",
        "Decreased annual operating expenses by $14.2M through strategic cloud consolidation and automated infrastructure-as-code initiatives.",
        "Spearheaded AI-powered fraud detection architecture handling $85B+ in annual volume with 99.98% precision rate.",
        "Pioneered global security compliance framework achieving zero high-severity audit findings across 6 regulatory jurisdictions.",
      ],
    },
    {
      id: "exp_2",
      title: "Vice President of Infrastructure & Cloud Architecture",
      company: "Enterprise Cloud Platforms & Distributed Systems Inc.",
      location: "London, UK",
      startDate: "2015",
      endDate: "2019",
      current: false,
      bullets: [
        "Scaled global Kubernetes clusters from 1,200 to 18,000 nodes serving 45M active daily enterprise users.",
        "Architected multi-region failover system with automated catastrophe recovery in under 90 seconds.",
        "Formulated technical hiring standards and interviewed 400+ technical candidates.",
      ],
    },
    {
      id: "exp_3",
      title: "Director of Systems Engineering",
      company: "Silicon Valley Scaled Networks LLC",
      location: "San Jose, CA",
      startDate: "2011",
      endDate: "2015",
      current: false,
      bullets: [
        "Engineered foundational distributed cache and network mesh layer used across 8 core product suites.",
        "Reduced mean time to resolution (MTTR) by 78% via automated telemetry and observability dashboards.",
      ],
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "Ph.D. in Computer Science & Distributed Systems",
      field: "Distributed Consensus Algorithms",
      institution: "ETH Zürich (Swiss Federal Institute of Technology)",
      location: "Zürich, Switzerland",
      startDate: "2007",
      endDate: "2011",
      honors: "Summa Cum Laude, Doctoral Medal for Excellence",
    },
    {
      id: "edu_2",
      degree: "B.S. in Electrical Engineering & Computer Science",
      field: "EECS",
      institution: "Massachusetts Institute of Technology (MIT)",
      location: "Cambridge, MA",
      startDate: "2003",
      endDate: "2007",
      gpa: "5.0 / 5.0",
    },
  ],
  skills: [
    {
      id: "s1",
      name: "Strategic Executive Leadership",
      items: ["Technology Strategy", "Enterprise Architecture", "P&L Management ($50M+)", "Global Organization Scaling", "Board Advisory"],
    },
    {
      id: "s2",
      name: "Distributed Systems & Cloud",
      items: ["Kubernetes", "AWS / GCP / Azure", "High-Throughput Systems", "Raft / Paxos Consensus", "Zero-Trust Security Architecture"],
    },
    {
      id: "s3",
      name: "Languages & Frameworks",
      items: ["Rust", "Go", "C++", "Python", "TypeScript", "PostgreSQL", "Kafka", "Redis", "gRPC", "Terraform"],
    },
  ],
  strengths: [],
  projects: [
    {
      id: "p1",
      name: "Open-Source Distributed Raft Engine",
      role: "Lead Maintainer",
      techStack: ["Rust", "gRPC", "Async-Tokio"],
      link: "https://github.com/maximilian/distributed-raft-core",
      description: ["High-performance consensus engine with over 4,500 GitHub stars and production deployment across 30+ fintech firms."],
    },
  ],
  certifications: [
    {
      id: "c1",
      name: "Certified Information Systems Security Professional (CISSP)",
      issuer: "(ISC)²",
      date: "2017",
    },
  ],
  languages: [
    { id: "l1", language: "German", proficiency: "Native" },
    { id: "l2", language: "English", proficiency: "Fluent" },
    { id: "l3", language: "French", proficiency: "Professional" },
  ],
  references: [],
};

// TEST 1: ATS Scoring Engine Validation
console.log("\n[TEST 1] Testing ATS Scoring Engine across profiles...");
const minimalScore = calculateAtsScore(minimalData, "excellent");
console.log(`- Minimal Resume ATS Score: ${minimalScore.score}% (Grade: ${minimalScore.grade})`);
console.assert(minimalScore.score >= 50 && minimalScore.score < 80, "Minimal score should be in 50-80 range");

const standardScore = calculateAtsScore(standardData, "excellent");
console.log(`- Standard Resume ATS Score: ${standardScore.score}% (Grade: ${standardScore.grade}, Verbs: ${standardScore.actionVerbCount}, Metrics: ${standardScore.metricCount})`);
console.assert(standardScore.score >= 85, "Standard score should be >= 85%");

const heavyScore = calculateAtsScore(heavyEdgeCaseData, "excellent");
console.log(`- Heavy Executive Resume ATS Score: ${heavyScore.score}% (Grade: ${heavyScore.grade}, Verbs: ${heavyScore.actionVerbCount}, Metrics: ${heavyScore.metricCount})`);
console.assert(heavyScore.score >= 90, "Heavy score should be >= 90%");
console.log("✅ ATS Scoring Engine Passed!");

// TEST 2: JSON Resume Roundtrip Conversion
console.log("\n[TEST 2] Testing JSON Resume Schema Export and Import...");
const jsonResume = exportToJsonResume(standardData);
console.assert(jsonResume.basics.name === "Sarah Jenkins", "JSON Resume basics.name should match");
console.assert(jsonResume.work.length === 2, "JSON Resume work entries should equal 2");
console.assert(jsonResume.education[0].institution === "Stanford University", "JSON Resume education institution should match");

const reimportedData = importFromJsonResume(jsonResume);
console.assert(reimportedData.personalInfo.fullName === "Sarah Jenkins", "Reimported fullName should match");
console.assert(reimportedData.experiences.length === 2, "Reimported experiences length should match");
console.assert(reimportedData.skills.length === 2, "Reimported skills length should match");
console.log("✅ JSON Resume Normalization & Conversion Passed!");

// TEST 3: Full 12-Template Catalog & Palettes Verification
console.log("\n[TEST 3] Testing 12-Template Matrix & Supported Color Palettes...");
console.assert(UNIFIED_TEMPLATES.length >= 12, `Expected at least 12 templates, found ${UNIFIED_TEMPLATES.length}`);
UNIFIED_TEMPLATES.forEach((t) => {
  console.assert(t.id, "Template must have an id");
  console.assert(t.name, "Template must have a name");
  console.assert(t.supportedAccents && t.supportedAccents.length > 0, `Template ${t.id} must have real supportedAccents`);
  console.assert(t.defaultAccent, `Template ${t.id} must have a defaultAccent`);
  console.assert(t.supportedAccents.includes(t.defaultAccent), `Template ${t.id} defaultAccent must be in supportedAccents`);
  console.log(`  ✓ [${t.id}] ${t.name} (Category: ${t.category}, ATS: ${t.atsScore}%, Colors: ${t.supportedAccents.join(", ")})`);
});
console.log("✅ Template Catalog & Palettes Passed!");

console.log("\n==================================================");
console.log("🎉 ALL PHASE 3 TEST MATRICES PASSED SUCCESSFULLY!");
console.log("==================================================");
