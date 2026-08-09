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

/**
 * 18 Approved Candidates from Real-Time GitHub Discovery Verification
 */
export const APPROVED_DISCOVERY_REPOS: SharedResourceItem[] = [
  {
    id: "gh-disc-shadcn-ui",
    title: "shadcn-ui / ui",
    description: "Beautifully designed components that you can copy and paste into your apps. Accessible, customizable, open source.",
    category: "githubRepos",
    type: "UI Components",
    source: "GitHub",
    url: "https://github.com/shadcn-ui/ui",
    starsCount: 68900,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T07:12:45Z",
    qualityScore: 100,
    trendingScore: 99,
  },
  {
    id: "gh-disc-three-js",
    title: "mrdoob / three.js",
    description: "JavaScript 3D Library for WebGL visual engines.",
    category: "githubRepos",
    type: "3D & WebGL",
    source: "GitHub",
    url: "https://github.com/mrdoob/three.js",
    starsCount: 99500,
    language: "JavaScript",
    license: "MIT",
    publishedAt: "2026-08-09T06:21:00Z",
    qualityScore: 100,
    trendingScore: 99,
  },
  {
    id: "gh-disc-lucide",
    title: "lucide-icons / lucide",
    description: "Beautiful & consistent open-source icon toolkit with 1,500+ vector icons.",
    category: "githubRepos",
    type: "Icon Library",
    source: "GitHub",
    url: "https://github.com/lucide-icons/lucide",
    starsCount: 14200,
    language: "TypeScript",
    license: "ISC",
    publishedAt: "2026-08-09T05:10:00Z",
    qualityScore: 98,
    trendingScore: 95,
  },
  {
    id: "gh-disc-framer-motion",
    title: "framer / motion",
    description: "A modern animation library for React and JavaScript.",
    category: "githubRepos",
    type: "Animation Library",
    source: "GitHub",
    url: "https://github.com/framer/motion",
    starsCount: 26500,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T04:54:00Z",
    qualityScore: 99,
    trendingScore: 98,
  },
  {
    id: "gh-disc-r3f",
    title: "pmndrs / react-three-fiber",
    description: "A React renderer for Three.js 3D graphics.",
    category: "githubRepos",
    type: "3D & WebGL",
    source: "GitHub",
    url: "https://github.com/pmndrs/react-three-fiber",
    starsCount: 31675,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T06:41:00Z",
    qualityScore: 98,
    trendingScore: 96,
  },
  {
    id: "gh-disc-tabler-icons",
    title: "tabler / tabler-icons",
    description: "Over 6,100 free MIT-licensed high-quality SVG icons for web projects.",
    category: "githubRepos",
    type: "Icon Library",
    source: "GitHub",
    url: "https://github.com/tabler/tabler-icons",
    starsCount: 21327,
    language: "JavaScript",
    license: "MIT",
    publishedAt: "2026-08-09T00:07:00Z",
    qualityScore: 96,
    trendingScore: 91,
  },
  {
    id: "gh-disc-unocss",
    title: "unocss / unocss",
    description: "The instant on-demand atomic CSS engine.",
    category: "githubRepos",
    type: "CSS Engine",
    source: "GitHub",
    url: "https://github.com/unocss/unocss",
    starsCount: 18915,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T06:50:00Z",
    qualityScore: 95,
    trendingScore: 92,
  },
  {
    id: "gh-disc-motion-canvas",
    title: "motion-canvas / motion-canvas",
    description: "Visualize Your Ideas With Code (Motion graphics renderer).",
    category: "githubRepos",
    type: "Motion Graphics",
    source: "GitHub",
    url: "https://github.com/motion-canvas/motion-canvas",
    starsCount: 18904,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T07:09:00Z",
    qualityScore: 95,
    trendingScore: 94,
  },
  {
    id: "gh-disc-headlessui",
    title: "tailwindlabs / headlessui",
    description: "Completely unstyled, fully accessible UI components for Tailwind CSS.",
    category: "githubRepos",
    type: "UI Components",
    source: "GitHub",
    url: "https://github.com/tailwindlabs/headlessui",
    starsCount: 28705,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T04:08:00Z",
    qualityScore: 98,
    trendingScore: 95,
  },
  {
    id: "gh-disc-radix-ui",
    title: "radix-ui / primitives",
    description: "Open-source UI component library for building accessible design systems.",
    category: "githubRepos",
    type: "UI Primitives",
    source: "GitHub",
    url: "https://github.com/radix-ui/primitives",
    starsCount: 19149,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-08T21:16:00Z",
    qualityScore: 97,
    trendingScore: 94,
  },
  {
    id: "gh-disc-pixijs",
    title: "pixijs / pixijs",
    description: "The HTML5 Creation Engine: 2D WebGL renderer.",
    category: "githubRepos",
    type: "2D WebGL Engine",
    source: "GitHub",
    url: "https://github.com/pixijs/pixijs",
    starsCount: 47979,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T06:00:00Z",
    qualityScore: 96,
    trendingScore: 93,
  },
  {
    id: "gh-disc-rive-react",
    title: "rive-app / rive-react",
    description: "Official React runtime for Rive vector animations.",
    category: "githubRepos",
    type: "Vector Animation",
    source: "GitHub",
    url: "https://github.com/rive-app/rive-react",
    starsCount: 1148,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-08T08:13:00Z",
    qualityScore: 94,
    trendingScore: 90,
  },
  {
    id: "gh-disc-vaul",
    title: "emilkowalski / vaul",
    description: "An unstyled drawer component for React with smooth touch gestures.",
    category: "githubRepos",
    type: "UI Drawer",
    source: "GitHub",
    url: "https://github.com/emilkowalski/vaul",
    starsCount: 8542,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-08T11:12:00Z",
    qualityScore: 95,
    trendingScore: 91,
  },
  {
    id: "gh-disc-react-grid-layout",
    title: "react-grid-layout / react-grid-layout",
    description: "A draggable and resizable grid layout engine for React design boards.",
    category: "githubRepos",
    type: "Grid Engine",
    source: "GitHub",
    url: "https://github.com/react-grid-layout/react-grid-layout",
    starsCount: 22378,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-08T15:23:00Z",
    qualityScore: 93,
    trendingScore: 89,
  },
  {
    id: "gh-disc-fontsource",
    title: "fontsource / fontsource",
    description: "Self-host Open Source fonts in neatly bundled NPM packages.",
    category: "githubRepos",
    type: "Typography Tools",
    source: "GitHub",
    url: "https://github.com/fontsource/fontsource",
    starsCount: 6061,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-08T17:54:00Z",
    qualityScore: 92,
    trendingScore: 88,
  },
  {
    id: "gh-disc-react-spline",
    title: "splinetool / react-spline",
    description: "Official React component for Spline interactive 3D scenes.",
    category: "githubRepos",
    type: "3D Interactivity",
    source: "GitHub",
    url: "https://github.com/splinetool/react-spline",
    starsCount: 1416,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-07T17:37:00Z",
    qualityScore: 93,
    trendingScore: 90,
  },
  {
    id: "gh-disc-styled-components",
    title: "styled-components / styled-components",
    description: "Fast, expressive styling for React component architecture.",
    category: "githubRepos",
    type: "CSS-in-JS",
    source: "GitHub",
    url: "https://github.com/styled-components/styled-components",
    starsCount: 41126,
    language: "TypeScript",
    license: "MIT",
    publishedAt: "2026-08-09T07:53:00Z",
    qualityScore: 96,
    trendingScore: 92,
  },
  {
    id: "gh-disc-daisyui",
    title: "saadeghi / daisyui",
    description: "The most popular, free and open-source Tailwind CSS component library.",
    category: "githubRepos",
    type: "UI Components",
    source: "GitHub",
    url: "https://github.com/saadeghi/daisyui",
    starsCount: 42009,
    language: "JavaScript",
    license: "MIT",
    publishedAt: "2026-08-09T03:12:00Z",
    qualityScore: 97,
    trendingScore: 95,
  },
];

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
  if (repo.private) {
    return { isCandidate: false, rejectReason: "Repository is private", relevanceScore: 0, relevanceReason: "N/A" };
  }
  if (repo.fork) {
    return { isCandidate: false, rejectReason: "Repository is a fork", relevanceScore: 0, relevanceReason: "N/A" };
  }
  if (repo.archived) {
    return { isCandidate: false, rejectReason: "Repository is archived", relevanceScore: 0, relevanceReason: "N/A" };
  }

  const licenseKey = (repo.license?.key || "").toLowerCase();
  if (!licenseKey || (!VALID_LICENSES.includes(licenseKey) && !repo.license?.name)) {
    return { isCandidate: false, rejectReason: "Missing or unapproved license", relevanceScore: 0, relevanceReason: "N/A" };
  }

  const lastUpdatedMs = new Date(repo.updated_at || repo.pushed_at).getTime();
  const daysSinceUpdate = (Date.now() - lastUpdatedMs) / (1000 * 60 * 60 * 24);
  if (daysSinceUpdate > 180) {
    return { isCandidate: false, rejectReason: `Abandoned/Inactive (${Math.round(daysSinceUpdate)} days since update)`, relevanceScore: 0, relevanceReason: "N/A" };
  }

  if ((repo.stargazers_count || 0) < 300) {
    return { isCandidate: false, rejectReason: "Low popularity (< 300 stars)", relevanceScore: 0, relevanceReason: "N/A" };
  }

  const desc = (repo.description || "").trim().toLowerCase();
  if (!desc || desc.length < 15) {
    return { isCandidate: false, rejectReason: "Empty or stub repository description", relevanceScore: 0, relevanceReason: "N/A" };
  }

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
    [...CURATED_GITHUB_REPOS, ...APPROVED_DISCOVERY_REPOS].map((r) => r.url.toLowerCase().replace(/\/+$/, ""))
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

        const canonicalUrl = (repo.html_url || "").toLowerCase().replace(/\/+$/, "");
        if (existingUrls.has(canonicalUrl)) {
          rejectedList.push({ fullName: repo.full_name, reason: "Already exists in curated repositories dataset" });
          return;
        }

        const validation = validateGitHubCandidate(repo);
        if (!validation.isCandidate) {
          rejectedList.push({ fullName: repo.full_name, reason: validation.rejectReason || "Failed validation" });
          return;
        }

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
