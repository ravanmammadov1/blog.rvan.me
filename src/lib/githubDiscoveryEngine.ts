import { CURATED_GITHUB_REPOS, SharedResourceItem } from "./resourceEngine";

export interface GitHubCandidateRepo {
  id: string;
  name: string;
  fullName: string;
  url: string;
  description: string;
  starsCount: number;
  language: string;
  license: string;
  updatedAt: string;
  topicCategory: string;
  relevanceScore: number;
  relevanceReason: string;
  isCandidate: boolean;
  rejectReason?: string;
}

export interface GitHubDiscoveryAuditResult {
  totalFound: number;
  rejectedCount: number;
  candidateCount: number;
  queriesUsed: string[];
  candidates: GitHubCandidateRepo[];
  rejectedList: { fullName: string; reason: string }[];
}

const SEARCH_QUERIES = [
  { topicCategory: "UI Components & Design Systems", query: "topic:design-system+stars:>1000+archived:false" },
  { topicCategory: "Icon Libraries", query: "topic:icons+stars:>500+archived:false" },
  { topicCategory: "Animation & Motion", query: "topic:animation+stars:>800+archived:false" },
  { topicCategory: "3D & WebGL", query: "topic:webgl+stars:>1000+archived:false" },
  { topicCategory: "CSS & Frontend", query: "topic:frontend-tools+stars:>1000+archived:false" },
];

const VALID_LICENSES = ["mit", "apache-2.0", "bsd-3-clause", "bsd-2-clause", "isc", "cc0-1.0", "mpl-2.0", "gpl-3.0", "agpl-3.0"];

const RELEVANT_PERSONA_KEYWORDS = [
  "ui", "ux", "design system", "component", "icon", "vector", "svg", "animation",
  "motion", "3d", "webgl", "canvas", "three.js", "shader", "css", "styling",
  "frontend", "react", "vue", "tailwind", "typography", "interactive", "editor"
];

/**
 * Validates a GitHub repository candidate against quality & relevance rules
 */
export function validateGitHubCandidate(repo: any): { isCandidate: boolean; rejectReason?: string; relevanceScore: number; relevanceReason: string } {
  // 1. Must be public and non-fork
  if (repo.private) {
    return { isCandidate: false, rejectReason: "Repository is private", relevanceScore: 0, relevanceReason: "N/A" };
  }
  if (repo.fork) {
    return { isCandidate: false, rejectReason: "Repository is a fork", relevanceScore: 0, relevanceReason: "N/A" };
  }
  if (repo.archived) {
    return { isCandidate: false, rejectReason: "Repository is archived", relevanceScore: 0, relevanceReason: "N/A" };
  }

  // 2. License check
  const licenseKey = (repo.license?.key || "").toLowerCase();
  if (!licenseKey || (!VALID_LICENSES.includes(licenseKey) && !repo.license?.name)) {
    return { isCandidate: false, rejectReason: "Missing or unapproved license", relevanceScore: 0, relevanceReason: "N/A" };
  }

  // 3. Activity check (must be updated within last 180 days)
  const lastUpdatedMs = new Date(repo.updated_at || repo.pushed_at).getTime();
  const daysSinceUpdate = (Date.now() - lastUpdatedMs) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate > 180) {
    return { isCandidate: false, rejectReason: `Abandoned/Inactive (${Math.round(daysSinceUpdate)} days since update)`, relevanceScore: 0, relevanceReason: "N/A" };
  }

  // 4. Stars threshold (>300 stars minimum)
  if ((repo.stargazers_count || 0) < 300) {
    return { isCandidate: false, rejectReason: "Low popularity (< 300 stars)", relevanceScore: 0, relevanceReason: "N/A" };
  }

  // 5. Description quality check
  const desc = (repo.description || "").trim().toLowerCase();
  if (!desc || desc.length < 15) {
    return { isCandidate: false, rejectReason: "Empty or stub repository description", relevanceScore: 0, relevanceReason: "N/A" };
  }

  // 6. Relevance Scoring for Rvan.me Personas
  const text = `${repo.name} ${desc} ${(repo.topics || []).join(" ")}`.toLowerCase();
  let hits = 0;
  RELEVANT_PERSONA_KEYWORDS.forEach((kw) => {
    if (text.includes(kw)) hits++;
  });

  if (hits === 0) {
    return { isCandidate: false, rejectReason: "Unrelated general IT / non-creative repository", relevanceScore: 0, relevanceReason: "N/A" };
  }

  const relevanceScore = Math.min(hits * 20 + 40, 100);
  const relevanceReason = `High alignment with Rvan.me personas (${hits} keyword hits across UI, 3D, animation, & design systems).`;

  return { isCandidate: true, relevanceScore, relevanceReason };
}

let cachedDiscoveryAudit: GitHubDiscoveryAuditResult | null = null;

/**
 * Server-Side GitHub Automatic Discovery Runner
 */
export async function runGitHubDiscoveryAudit(): Promise<GitHubDiscoveryAuditResult> {
  if (cachedDiscoveryAudit) return cachedDiscoveryAudit;

  const existingUrls = new Set(
    CURATED_GITHUB_REPOS.map((r) => r.url.toLowerCase().replace(/\/+$/, ""))
  );

  const rawFound: any[] = [];
  const rejectedList: { fullName: string; reason: string }[] = [];
  const candidates: GitHubCandidateRepo[] = [];
  const queriesUsed: string[] = [];

  for (const qObj of SEARCH_QUERIES) {
    const searchUrl = `https://api.github.com/search/repositories?q=${qObj.query}&sort=updated&order=desc&per_page=15`;
    queriesUsed.push(searchUrl);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(searchUrl, {
        headers: {
          "User-Agent": "RvanMe-DiscoveryEngine/2.0",
          "Accept": "application/vnd.github.v3+json",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data = await res.json();
      const items = data.items || [];

      items.forEach((repo: any) => {
        rawFound.push(repo);

        // Canonical URL deduplication check against existing 125 repos
        const canonicalUrl = (repo.html_url || "").toLowerCase().replace(/\/+$/, "");
        if (existingUrls.has(canonicalUrl)) {
          rejectedList.push({ fullName: repo.full_name, reason: "Already exists in 125 curated repositories dataset" });
          return;
        }

        const validation = validateGitHubCandidate(repo);
        if (!validation.isCandidate) {
          rejectedList.push({ fullName: repo.full_name, reason: validation.rejectReason || "Failed validation" });
          return;
        }

        // Avoid candidate duplicate additions
        if (candidates.some((c) => c.url.toLowerCase() === canonicalUrl)) {
          return;
        }

        candidates.push({
          id: `gh-discovered-${repo.id}`,
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          description: repo.description,
          starsCount: repo.stargazers_count,
          language: repo.language || "TypeScript",
          license: repo.license?.name || repo.license?.key || "MIT",
          updatedAt: new Date(repo.updated_at || repo.pushed_at).toISOString().split("T")[0],
          topicCategory: qObj.topicCategory,
          relevanceScore: validation.relevanceScore,
          relevanceReason: validation.relevanceReason,
          isCandidate: true,
        });
      });
    } catch (err) {
      console.error(`Error searching GitHub query ${qObj.topicCategory}:`, err);
    }
  }

  // Sort candidates by stars & relevance
  candidates.sort((a, b) => b.relevanceScore - a.relevanceScore || b.starsCount - a.starsCount);

  const result: GitHubDiscoveryAuditResult = {
    totalFound: rawFound.length,
    rejectedCount: rejectedList.length,
    candidateCount: candidates.length,
    queriesUsed,
    candidates,
    rejectedList,
  };

  cachedDiscoveryAudit = result;
  return result;
}
