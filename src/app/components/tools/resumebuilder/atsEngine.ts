import { ResumeData } from "./resumeTypes";

export interface AtsCheckResult {
  score: number;
  grade: "Needs Work" | "Good" | "Strong" | "Exceptional";
  passedChecks: { id: string; label: string; tip: string }[];
  failedChecks: { id: string; label: string; tip: string }[];
  actionVerbCount: number;
  metricCount: number;
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
];

export const ACTION_VERB_CATEGORIES: { category: string; verbs: string[] }[] = [
  {
    category: "Engineering & Architecture",
    verbs: ["Architected", "Engineered", "Implemented", "Scaled", "Automated", "Refactored", "Deployed", "Configured"],
  },
  {
    category: "Leadership & Strategy",
    verbs: ["Spearheaded", "Led", "Orchestrated", "Pioneered", "Mentored", "Directed", "Championed", "Mobilized"],
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
 * Computes an ATS Compatibility Score (0-100) based on proven HR screening criteria.
 */
export function calculateAtsScore(data: ResumeData): AtsCheckResult {
  let score = 0;
  const passedChecks: { id: string; label: string; tip: string }[] = [];
  const failedChecks: { id: string; label: string; tip: string }[] = [];

  // 1. Personal Contact Info Check (20 pts)
  const hasName = Boolean(data.personalInfo.fullName?.trim());
  const hasEmail = Boolean(data.personalInfo.email?.includes("@"));
  const hasPhone = Boolean(data.personalInfo.phone?.trim());
  const hasLocation = Boolean(data.personalInfo.location?.trim());

  if (hasName && hasEmail && hasPhone && hasLocation) {
    score += 20;
    passedChecks.push({
      id: "contact-complete",
      label: "Complete Contact Information",
      tip: "Full name, email, phone, and location are clearly provided.",
    });
  } else {
    failedChecks.push({
      id: "contact-incomplete",
      label: "Missing Contact Details",
      tip: "Ensure your Name, Email, Phone, and City/State are filled.",
    });
  }

  // 2. Professional Summary Check (15 pts)
  const summaryLength = data.summary?.trim().split(/\s+/).length || 0;
  if (summaryLength >= 25 && summaryLength <= 120) {
    score += 15;
    passedChecks.push({
      id: "summary-ideal",
      label: "Concise Professional Summary",
      tip: `Summary is ${summaryLength} words (ideal length is 25–100 words).`,
    });
  } else if (summaryLength > 0) {
    score += 8;
    failedChecks.push({
      id: "summary-suboptimal",
      label: "Summary Length Optimization",
      tip: summaryLength < 25 ? "Summary is too short. Add 2-3 sentences highlighting your core achievements." : "Summary is slightly long. Keep it under 100 words.",
    });
  } else {
    failedChecks.push({
      id: "summary-missing",
      label: "Add a Professional Summary",
      tip: "Include a 2-3 sentence executive summary introducing your strengths.",
    });
  }

  // 3. Work Experience & Bullet Points (25 pts)
  const allBullets = data.experiences.flatMap((exp) => exp.bullets.filter((b) => Boolean(b.trim())));
  if (data.experiences.length > 0 && allBullets.length >= 3) {
    score += 25;
    passedChecks.push({
      id: "exp-present",
      label: "Structured Work Experience",
      tip: `${data.experiences.length} positions with ${allBullets.length} bullet points found.`,
    });
  } else {
    failedChecks.push({
      id: "exp-insufficient",
      label: "Expand Work Experience",
      tip: "Include at least 1-2 positions with 3+ descriptive bullet points each.",
    });
  }

  // 4. Action Verbs Usage Check (15 pts)
  let actionVerbCount = 0;
  const fullText = (data.summary + " " + allBullets.join(" ")).toLowerCase();
  for (const verb of ACTION_VERBS) {
    if (fullText.includes(verb.toLowerCase())) {
      actionVerbCount++;
    }
  }

  if (actionVerbCount >= 4) {
    score += 15;
    passedChecks.push({
      id: "action-verbs-strong",
      label: "Strong Action Verbs",
      tip: `Used ${actionVerbCount} high-impact action verbs (e.g. Architected, Scaled, Led).`,
    });
  } else if (actionVerbCount >= 1) {
    score += 8;
    failedChecks.push({
      id: "action-verbs-low",
      label: "Include More Action Verbs",
      tip: `Found ${actionVerbCount} action verbs. Start bullets with words like 'Spearheaded', 'Engineered', 'Optimized'.`,
    });
  } else {
    failedChecks.push({
      id: "action-verbs-none",
      label: "Missing Power Verbs",
      tip: "Start every achievement bullet with an active verb (e.g. 'Delivered', 'Built', 'Reduced').",
    });
  }

  // 5. Quantifiable Metrics Check (15 pts)
  const metricRegex = /([0-9]+%|\$[0-9]+|[0-9]+(\.[0-9]+)?[kmbKMB]\b|[0-9]+\+|[0-9]+x\b|[0-9]+ (users|clients|engineers|projects|days|months|hours|ms|seconds))/i;
  let metricCount = 0;
  for (const b of allBullets) {
    if (metricRegex.test(b)) metricCount++;
  }

  if (metricCount >= 3) {
    score += 15;
    passedChecks.push({
      id: "metrics-strong",
      label: "Quantifiable Impact Metrics",
      tip: `Found ${metricCount} bullets with quantifiable metrics (%, $, scale, velocity).`,
    });
  } else if (metricCount >= 1) {
    score += 8;
    failedChecks.push({
      id: "metrics-low",
      label: "Add More Quantifiable Results",
      tip: "HRs love numbers. E.g., 'increased speed by 40%', 'managed $2M budget', 'scaled to 50k users'.",
    });
  } else {
    failedChecks.push({
      id: "metrics-none",
      label: "No Measurable Metrics Detected",
      tip: "Add tangible results (% growth, cost savings, response times) to stand out.",
    });
  }

  // 6. Skills & Education Check (10 pts)
  const allSkills = data.skills.flatMap((s) => s.items.filter((item) => Boolean(item.trim())));
  const hasEducation = data.education.some((edu) => Boolean(edu.institution?.trim() || edu.degree?.trim()));

  if (allSkills.length >= 6 && hasEducation) {
    score += 10;
    passedChecks.push({
      id: "skills-edu-complete",
      label: "Skills & Education Defined",
      tip: `${allSkills.length} key skills listed with educational background.`,
    });
  } else {
    failedChecks.push({
      id: "skills-edu-incomplete",
      label: "Skills & Education Incomplete",
      tip: "Ensure your university/school and at least 6 relevant technical skills are listed.",
    });
  }

  let grade: AtsCheckResult["grade"] = "Needs Work";
  if (score >= 90) grade = "Exceptional";
  else if (score >= 75) grade = "Strong";
  else if (score >= 50) grade = "Good";

  return {
    score,
    grade,
    passedChecks,
    failedChecks,
    actionVerbCount,
    metricCount,
  };
}
