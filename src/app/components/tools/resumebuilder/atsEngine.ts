import { ResumeData, SkillCategory, ExperienceItem, EducationItem, ProjectItem } from "./resumeTypes";

export type IssueSeverity = "critical" | "warning" | "suggestion" | "good";

export interface AtsCheckItem {
  id: string;
  category: "basics" | "experience" | "education" | "skills" | "formatting";
  severity: IssueSeverity;
  label: string;
  label_az?: string;
  message: string;
  message_az?: string;
  fixTip: string;
  fixTip_az?: string;
}

export interface AtsCheckResult {
  score: number;
  grade: "Needs Work" | "Good" | "Strong" | "Exceptional";
  passedChecks: AtsCheckItem[];
  failedChecks: AtsCheckItem[];
  actionVerbCount: number;
  metricCount: number;
  detectedKeywords: string[];
  templateAtsLevel?: "excellent" | "good" | "creative";
}

export const ACTION_VERBS = [
  "Architected",
  "Engineered",
  "Spearheaded",
  "Optimized",
  "Scaled",
  "Designed",
  "Implemented",
  "Streamlined",
  "Automated",
  "Led",
  "Accelerated",
  "Built",
  "Orchestrated",
  "Pioneered",
  "Resolved",
  "Delivered",
  "Transformed",
  "Decreased",
  "Increased",
  "Launched",
  "Revamped",
  "Consolidated",
  "Mentored",
  "Formulated",
  "Executed",
  "Developed",
  "Authored",
  "Refactored",
  "Modernized",
  "Integrated",
  "Calculated",
  "Standardized",
];

export const ACTION_VERB_CATEGORIES: { category: string; verbs: string[] }[] = [
  {
    category: "Engineering & Architecture",
    verbs: ["Architected", "Engineered", "Implemented", "Scaled", "Automated", "Refactored", "Deployed", "Configured", "Developed"],
  },
  {
    category: "Leadership & Strategy",
    verbs: ["Spearheaded", "Led", "Orchestrated", "Pioneered", "Mentored", "Directed", "Championed", "Mobilized", "Standardized"],
  },
  {
    category: "Optimization & Growth",
    verbs: ["Optimized", "Accelerated", "Streamlined", "Maximized", "Decreased", "Boosted", "Enhanced", "Reduced"],
  },
  {
    category: "Product & Design",
    verbs: ["Designed", "Transformed", "Revamped", "Conceptualized", "Crafted", "Launched", "Validated", "Delivered"],
  },
];

/**
 * Computes an authentic, transparent ATS Compatibility Score (0-100) based on real recruitment screening criteria.
 */
export function calculateAtsScore(data: ResumeData, templateAtsLevel?: "excellent" | "good" | "creative"): AtsCheckResult {
  let score = 0;
  const passedChecks: AtsCheckItem[] = [];
  const failedChecks: AtsCheckItem[] = [];

  // 1. Personal Contact Info Check (20 pts)
  const hasName = Boolean(data.personalInfo.fullName?.trim());
  const hasEmail = Boolean(data.personalInfo.email?.includes("@") && data.personalInfo.email.includes("."));
  const hasPhone = Boolean(data.personalInfo.phone?.trim() && data.personalInfo.phone.replace(/[^0-9]/g, "").length >= 7);
  const hasLocation = Boolean(data.personalInfo.location?.trim());
  const hasTitle = Boolean(data.personalInfo.title?.trim());

  if (hasName && hasEmail && hasPhone && hasLocation && hasTitle) {
    score += 20;
    passedChecks.push({
      id: "contact-complete",
      category: "basics",
      severity: "good",
      label: "Complete Contact & Target Title",
      label_az: "Tam Əlaqə və Hədəf Vəzifəsi",
      message: "Full name, target title, professional email, phone number, and location are fully defined.",
      message_az: "Tam ad, vəzifə, e-poçt, telefon və məkan tam daxil edilmişdir.",
      fixTip: "Good job! Recruiters have clear contact channels.",
      fixTip_az: "Əla! İşəgötürənlər üçün bütün əlaqə vasitələri aydındır.",
    });
  } else {
    const missing: string[] = [];
    if (!hasName) missing.push("Full Name");
    if (!hasTitle) missing.push("Target Job Title");
    if (!hasEmail) missing.push("Valid Email");
    if (!hasPhone) missing.push("Phone Number");
    if (!hasLocation) missing.push("Location");

    failedChecks.push({
      id: "contact-incomplete",
      category: "basics",
      severity: !hasName || !hasEmail ? "critical" : "warning",
      label: "Missing Essential Contact Information",
      label_az: "Vacib Əlaqə Məlumatları Çatışmır",
      message: `Missing: ${missing.join(", ")}.`,
      message_az: `Çatışmayan: ${missing.join(", ")}.`,
      fixTip: "ATS parsers require clear personal headers to index candidates.",
      fixTip_az: "ATS sistemləri namizədi qeydə almaq üçün əsas əlaqə məlumatlarını tələb edir.",
    });
  }

  // 2. Professional Summary Check (15 pts)
  const summaryLength = data.summary?.trim().split(/\s+/).filter(Boolean).length || 0;
  if (summaryLength >= 25 && summaryLength <= 120) {
    score += 15;
    passedChecks.push({
      id: "summary-ideal",
      category: "basics",
      severity: "good",
      label: "Concise Career Summary",
      label_az: "Lakonik Peşəkar Xülasə",
      message: `Summary is ${summaryLength} words (ideal range: 25–100 words).`,
      message_az: `Xülasə ${summaryLength} sözdən ibarətdir (ideal: 25–100 söz).`,
      fixTip: "Well-structured elevator pitch.",
      fixTip_az: "Düzgün formalaşdırılmış təqdimat.",
    });
  } else if (summaryLength > 0) {
    score += 8;
    failedChecks.push({
      id: "summary-suboptimal",
      category: "basics",
      severity: "warning",
      label: "Optimize Summary Length",
      label_az: "Xülasə Həcmini Optimallaşdırın",
      message: summaryLength < 25 ? `Summary is too short (${summaryLength} words).` : `Summary is slightly long (${summaryLength} words).`,
      message_az: summaryLength < 25 ? `Xülasə çox qısadır (${summaryLength} söz).` : `Xülasə bir qədər uzundur (${summaryLength} söz).`,
      fixTip: "Aim for 3–4 impactful sentences summarizing your key domain expertise and value proposition.",
      fixTip_az: "Əsas təcrübənizi və dəyərinizi ifadə edən 3-4 cümləlik xülasə yazın.",
    });
  } else {
    failedChecks.push({
      id: "summary-missing",
      category: "basics",
      severity: "warning",
      label: "Missing Professional Summary",
      label_az: "Peşəkar Xülasə Yoxdur",
      message: "No summary provided.",
      message_az: "Heç bir xülasə qeyd edilməyib.",
      fixTip: "Add a 2–3 sentence executive narrative introducing your strengths.",
      fixTip_az: "Güclü tərəflərinizi tanıdan 2-3 cümləlik xülasə əlavə edin.",
    });
  }

  // 3. Work Experience Quality & Completeness (25 pts)
  const validExperiences = data.experiences.filter((exp) => Boolean(exp.company?.trim() && exp.title?.trim()));
  const allBullets = data.experiences.flatMap((exp) => exp.bullets.filter((b) => Boolean(b.trim())));

  // Missing dates or company names checks
  const missingExpDetails = data.experiences.some((exp) => !exp.company?.trim() || !exp.title?.trim() || !exp.startDate?.trim());

  if (validExperiences.length > 0 && allBullets.length >= 3 && !missingExpDetails) {
    score += 25;
    passedChecks.push({
      id: "exp-complete",
      category: "experience",
      severity: "good",
      label: "Structured Work Experience",
      label_az: "Strukturlaşdırılmış İş Təcrübəsi",
      message: `${validExperiences.length} position(s) with ${allBullets.length} quantified bullet points.`,
      message_az: `${validExperiences.length} vəzifə və ${allBullets.length} ətraflı bənd aşkarlandı.`,
      fixTip: "All positions include job title, company, dates, and achievements.",
      fixTip_az: "Bütün vəzifələrdə ad, şirkət, tarixlər və nailiyyətlər göstərilib.",
    });
  } else if (data.experiences.length > 0) {
    score += 12;
    failedChecks.push({
      id: "exp-incomplete",
      category: "experience",
      severity: "critical",
      label: "Incomplete Work Experience Details",
      label_az: "İş Təcrübəsində Çatışmayan Sahələr",
      message: missingExpDetails
        ? "Some work entries are missing company name, job title, or dates."
        : "Work experience has fewer than 3 bullet points total.",
      message_az: missingExpDetails
        ? "Bəzi iş yerlərində şirkət adı, vəzifə və ya tarixlər qeyd edilməyib."
        : "İş təcrübəsində ümumilikdə 3-dən az bənd var.",
      fixTip: "Ensure each role has: Job Title, Company Name, Start/End Dates, and at least 2 quantified bullet points.",
      fixTip_az: "Hər iş yerində vəzifə, şirkət, tarixlər və ən azı 2 nailiyyət bəndi qeyd edin.",
    });
  } else {
    failedChecks.push({
      id: "exp-none",
      category: "experience",
      severity: "critical",
      label: "No Work Experience Found",
      label_az: "İş Təcrübəsi Əlavə Edilməyib",
      message: "At least 1 professional work experience entry is required.",
      message_az: "Ən azı 1 peşəkar iş təcrübəsi əlavə olunmalıdır.",
      fixTip: "Add your previous work, internships, or freelance experience.",
      fixTip_az: "Əvvəlki iş, təcrübə proqramı və ya frilans təcrübənizi daxil edin.",
    });
  }

  // 4. Action Verbs Usage Check (15 pts)
  let actionVerbCount = 0;
  const fullText = (data.summary + " " + allBullets.join(" ")).toLowerCase();
  const detectedVerbs: string[] = [];

  for (const verb of ACTION_VERBS) {
    if (fullText.includes(verb.toLowerCase())) {
      actionVerbCount++;
      detectedVerbs.push(verb);
    }
  }

  if (actionVerbCount >= 4) {
    score += 15;
    passedChecks.push({
      id: "action-verbs-strong",
      category: "formatting",
      severity: "good",
      label: "Strong Action Verbs",
      label_az: "Güclü Fəaliyyət Felləri",
      message: `Used ${actionVerbCount} high-impact action verbs (${detectedVerbs.slice(0, 4).join(", ")}...).`,
      message_az: `${actionVerbCount} güclü fel istifadə edildi (${detectedVerbs.slice(0, 4).join(", ")}...).`,
      fixTip: "Action verbs demonstrate ownership and active contributions.",
      fixTip_az: "Fəaliyyət felləri şəxsi töhfələrinizi aydın nümayiş etdirir.",
    });
  } else if (actionVerbCount >= 1) {
    score += 8;
    failedChecks.push({
      id: "action-verbs-low",
      category: "formatting",
      severity: "suggestion",
      label: "Include More Power Action Verbs",
      label_az: "Daha Çox Fəaliyyət Feli Əlavə Edin",
      message: `Found ${actionVerbCount} action verbs.`,
      message_az: `${actionVerbCount} fəaliyyət feli tapıldı.`,
      fixTip: "Start bullets with powerful verbs: 'Architected', 'Spearheaded', 'Optimized', 'Scaled'.",
      fixTip_az: "Bəndləri 'Architected', 'Spearheaded', 'Optimized', 'Scaled' kimi fellərlə başladın.",
    });
  } else {
    failedChecks.push({
      id: "action-verbs-none",
      category: "formatting",
      severity: "warning",
      label: "Missing Power Verbs",
      label_az: "Fəaliyyət Felləri Yoxdur",
      message: "No recognized action verbs detected at start of bullets.",
      message_az: "Bəndlərin əvvəlində fəaliyyət felləri aşkar edilmədi.",
      fixTip: "Replace passive phrases like 'Responsible for' with active verbs like 'Led', 'Delivered', 'Built'.",
      fixTip_az: "'Məsuliyyət daşıyırdım' əvəzinə 'Rəhbərlik etdim', 'Tətbiq etdim' tipli aktiv fellər yazın.",
    });
  }

  // 5. Quantifiable Impact & Metrics Check (15 pts)
  const metricRegex = /([0-9]+%|\$[0-9]+|[0-9]+(\.[0-9]+)?[kmbKMB]\b|[0-9]+\+|[0-9]+x\b|[0-9]+ (users|clients|engineers|projects|days|months|hours|ms|seconds|nodes|queries|requests))/i;
  let metricCount = 0;
  for (const b of allBullets) {
    if (metricRegex.test(b)) metricCount++;
  }

  if (metricCount >= 3) {
    score += 15;
    passedChecks.push({
      id: "metrics-strong",
      category: "experience",
      severity: "good",
      label: "Quantifiable Impact Metrics",
      label_az: "Ölçülə Bilən Nəticələr və Rəqəmlər",
      message: `Found ${metricCount} bullets containing concrete metrics (%, $, scale, velocity).`,
      message_az: `${metricCount} bənddə ölçülə bilən rəqəmlər (faiz, büdcə, sürət) aşkarlandı.`,
      fixTip: "Numbers immediately prove impact to hiring managers.",
      fixTip_az: "Rəqəmlər nailiyyətlərinizi dərhal sübut edir.",
    });
  } else if (metricCount >= 1) {
    score += 8;
    failedChecks.push({
      id: "metrics-low",
      category: "experience",
      severity: "suggestion",
      label: "Add More Quantifiable Results",
      label_az: "Daha Çox Rəqəm və Nəticə Göstərin",
      message: `Found ${metricCount} bullet point with quantifiable data.`,
      message_az: `Yalnız ${metricCount} bənddə ölçülə bilən rəqəm var.`,
      fixTip: "Add numbers where possible: 'reduced latency by 35%', 'managed $500k budget', 'scaled to 20k users'.",
      fixTip_az: "Mümkün olan yerlərdə rəqəm əlavə edin: 'gecikməni 35% azaltdım', '20k istifadəçiyə çatdırdım'.",
    });
  } else {
    failedChecks.push({
      id: "metrics-none",
      category: "experience",
      severity: "warning",
      label: "No Measurable Metrics Detected",
      label_az: "Ölçülə Bilən Nəticə Aşkar Edilmədi",
      message: "No percentage, dollar amount, or scaling statistics found in achievements.",
      message_az: "Nailiyyətlərdə heç bir faiz, məbləğ və ya artım statistikası tapılmadı.",
      fixTip: "Quantify your work with tangible metrics to increase interview callback rates.",
      fixTip_az: "Müsahibəyə çağırılma şansını artırmaq üçün nəticələrinizi rəqəmlərlə ifadə edin.",
    });
  }

  // 6. Skills & Education Completeness (10 pts)
  const allSkills = data.skills.flatMap((s) => s.items.filter((item) => Boolean(item.trim())));
  const validEducation = data.education.filter((edu) => Boolean(edu.institution?.trim() || edu.degree?.trim()));

  if (allSkills.length >= 6 && validEducation.length > 0) {
    score += 10;
    passedChecks.push({
      id: "skills-edu-complete",
      category: "skills",
      severity: "good",
      label: "Skills & Education Background",
      label_az: "Bacarıqlar və Təhsil Məlumatları",
      message: `${allSkills.length} key skill keywords and ${validEducation.length} education entry listed.`,
      message_az: `${allSkills.length} əsas bacarıq və ${validEducation.length} təhsil qeydi var.`,
      fixTip: "Categorized skills help automated ATS index candidate keywords accurately.",
      fixTip_az: "Kateqoriyalara bölünmüş bacarıqlar açar sözlərin düzgün oxunmasını təmin edir.",
    });
  } else {
    failedChecks.push({
      id: "skills-edu-incomplete",
      category: "skills",
      severity: allSkills.length < 3 ? "critical" : "warning",
      label: "Expand Skills or Education",
      label_az: "Bacarıq və ya Təhsili Genişləndirin",
      message: allSkills.length < 6 ? `Only ${allSkills.length} skills listed (recommended: 6+).` : "No education entries listed.",
      message_az: allSkills.length < 6 ? `Yalnız ${allSkills.length} bacarıq qeyd edilib (tövsiyə: 6+).` : "Təhsil qeydi yoxdur.",
      fixTip: "Add categorized technical & core competencies relevant to your target job posting.",
      fixTip_az: "Müraciət etdiyiniz vakansiyaya uyğun əsas texniki və peşəkar bacarıqları əlavə edin.",
    });
  }

  // 7. Template ATS Optimization Bonus/Penalty
  if (templateAtsLevel === "excellent") {
    // 100% compliant text-first ATS layout
  } else if (templateAtsLevel === "creative") {
    if (score > 92) score = 92; // Creative multi-column templates capped realistically
  }

  let grade: AtsCheckResult["grade"] = "Needs Work";
  if (score >= 88) grade = "Exceptional";
  else if (score >= 75) grade = "Strong";
  else if (score >= 50) grade = "Good";

  return {
    score: Math.min(100, Math.max(0, score)),
    grade,
    passedChecks,
    failedChecks,
    actionVerbCount,
    metricCount,
    detectedKeywords: detectedVerbs,
    templateAtsLevel,
  };
}

/**
 * Standard JSON Resume Schema Exporter
 * Reference: https://jsonresume.org/schema/
 */
export function exportToJsonResume(data: ResumeData) {
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: data.personalInfo.fullName,
      label: data.personalInfo.title,
      image: data.personalInfo.showPhoto ? data.personalInfo.photoUrl : undefined,
      email: data.personalInfo.email,
      phone: data.personalInfo.phone,
      url: data.personalInfo.website,
      summary: data.summary,
      location: {
        address: data.personalInfo.location,
      },
      profiles: [
        ...(data.personalInfo.linkedin ? [{ network: "LinkedIn", url: data.personalInfo.linkedin }] : []),
        ...(data.personalInfo.github ? [{ network: "GitHub", url: data.personalInfo.github }] : []),
      ],
    },
    work: data.experiences.map((exp) => ({
      name: exp.company,
      position: exp.title,
      startDate: exp.startDate,
      endDate: exp.endDate || (exp.current ? "Present" : ""),
      highlights: exp.bullets,
    })),
    education: data.education.map((edu) => ({
      institution: edu.institution,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      score: edu.gpa,
      courses: edu.honors ? [edu.honors] : [],
    })),
    skills: data.skills.map((skill) => ({
      name: skill.name,
      keywords: skill.items,
    })),
    projects: data.projects.map((proj) => ({
      name: proj.name,
      description: proj.description?.join(" ") || "",
      roles: proj.role ? [proj.role] : [],
      keywords: proj.techStack,
      url: proj.link,
    })),
    certificates: data.certifications.map((cert) => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      url: cert.url,
    })),
    languages: data.languages.map((lang) => ({
      language: lang.language,
      fluency: lang.proficiency,
    })),
    references: data.references.map((ref) => ({
      name: ref.name,
      reference: `${ref.position} at ${ref.company}`,
      phone: ref.phone,
      email: ref.email,
    })),
  };
}

/**
 * Standard JSON Resume Schema Importer
 */
export function importFromJsonResume(json: any): ResumeData {
  const basics = json.basics || {};
  return {
    personalInfo: {
      fullName: basics.name || "",
      title: basics.label || "",
      email: basics.email || "",
      phone: basics.phone || "",
      location: basics.location?.address || basics.location?.city || "",
      website: basics.url || "",
      linkedin: basics.profiles?.find((p: any) => p.network?.toLowerCase().includes("linkedin"))?.url || "",
      github: basics.profiles?.find((p: any) => p.network?.toLowerCase().includes("github"))?.url || "",
      photoUrl: basics.image || "",
      showPhoto: Boolean(basics.image),
    },
    summary: basics.summary || "",
    experiences: (json.work || []).map((w: any, idx: number): ExperienceItem => ({
      id: `exp_${idx}_${Date.now()}`,
      company: w.name || "",
      title: w.position || "",
      location: w.location || "",
      startDate: w.startDate || "",
      endDate: w.endDate === "Present" ? "" : w.endDate || "",
      current: w.endDate === "Present" || !w.endDate,
      bullets: Array.isArray(w.highlights) ? w.highlights : w.summary ? [w.summary] : [],
    })),
    education: (json.education || []).map((edu: any, idx: number): EducationItem => ({
      id: `edu_${idx}_${Date.now()}`,
      institution: edu.institution || "",
      degree: edu.studyType || "",
      field: edu.area || "",
      location: edu.location || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      gpa: edu.score || "",
      honors: Array.isArray(edu.courses) ? edu.courses.join(", ") : "",
    })),
    skills: (json.skills || []).map((s: any, idx: number): SkillCategory => ({
      id: `skill_${idx}_${Date.now()}`,
      name: s.name || "Technical Skills",
      items: Array.isArray(s.keywords) ? s.keywords : [],
    })),
    strengths: [],
    projects: (json.projects || []).map((p: any, idx: number): ProjectItem => ({
      id: `proj_${idx}_${Date.now()}`,
      name: p.name || "",
      role: Array.isArray(p.roles) ? p.roles[0] : "",
      techStack: Array.isArray(p.keywords) ? p.keywords : [],
      link: p.url || "",
      description: Array.isArray(p.highlights) ? p.highlights : p.description ? [p.description] : [],
    })),
    certifications: (json.certificates || []).map((c: any, idx: number) => ({
      id: `cert_${idx}_${Date.now()}`,
      name: c.name || "",
      issuer: c.issuer || "",
      date: c.date || "",
      url: c.url || "",
    })),
    languages: (json.languages || []).map((l: any, idx: number) => ({
      id: `lang_${idx}_${Date.now()}`,
      language: l.language || "",
      proficiency: l.fluency || "Professional",
    })),
    references: (json.references || []).map((r: any, idx: number) => ({
      id: `ref_${idx}_${Date.now()}`,
      name: r.name || "",
      position: r.reference || "",
      company: "",
      phone: r.phone || "",
      email: r.email || "",
    })),
  };
}
