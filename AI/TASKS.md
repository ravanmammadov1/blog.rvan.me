# PROJECT TASK MANAGEMENT

## Active Phase: Phase 1 — SEO Architecture, Sitemap & Interlinking

---

## 1. Phase 1 Sprint Tasks (Immediate Execution)

| Task ID | Description | Category | Priority | Status | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SITEMAP-01` | Unify `api/sitemap.ts` and `generate-seo-pages.mjs` to serve all 39 EN/AZ essays, tools, and curated resources with hreflang | SEO | P0 | Ready | Primary Agent |
| `CANONICAL-01` | Canonicalize duplicate profile routes (`/profile`, `/ravanmammadov` → `/ravan-mammadov`) & add noindex to `/admin/linkedin` | SEO / Security | P0 | Ready | Primary Agent |
| `INTERLINK-01` | Build `EcosystemBridgeCard.tsx` and inject contextual tool & resource links into all 39 master essays | UX / SEO | P1 | Ready | Primary Agent |
| `FONT-TIER-01` | Implement 2-tier font indexation (Top 200 curated in sitemap; long-tail rendered dynamically via SPA) | SEO / Perf | P1 | Ready | Primary Agent |
| `BUNDLE-OPT-01` | Split root `index.js` bundle to improve mobile LCP Core Web Vitals | Performance | P2 | Ready | Primary Agent |

---

## 2. Phase 2 Backlog: High-Utility Creative Tools Suite

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TOOL-TYPE-01` | Build **Fluid Typography Scale & Clamp Calculator** (`/tools/typography-scale`) | Interactive Tool | P1 | Backlog |
| `TOOL-APCA-01` | Build **Color Contrast & APCA Matrix Evaluator** (`/tools/contrast-matrix`) | Interactive Tool | P1 | Backlog |
| `TOOL-CTA-01` | Build **Marketing Headline & CTA Impact Analyzer** (`/tools/headline-analyzer`) | Interactive Tool | P2 | Backlog |
| `TOOL-RESUME-01` | Add section drag-and-drop reordering & JSON backup to **ATS Resume Builder** | Tool Upgrade | P2 | Backlog |

---

## 3. Phase 3 Backlog: Resource Discovery & Specimen Engines

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `DISCOVERY-01` | Global command palette / fuzzy search (`Cmd/Ctrl + K`) across all tools, articles, and fonts | Discovery | P1 | Backlog |
| `SPECIMEN-01` | Variable font axis sliders (Weight, Width, Slant, Optical Size) & font pairing engine on font detail pages | Specimen Engine | P2 | Backlog |
| `ICON-01` | Direct one-click code copy (SVG, React JSX snippet, Tailwind class) on Lucide icon cards | Asset Tool | P2 | Backlog |

---

## 4. Phase 4 Backlog: User Accounts & Creative Workbench

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `AUTH-01` | Bookmarking essays, saving font pairings, and reading history linked to Firebase Google Auth | Auth Utility | P2 | Backlog |
| `AUTH-02` | Cloud resume synchronization for ATS Resume Builder drafts with local storage sync | User Storage | P2 | Backlog |
| `AUTH-03` | "My Creative Workbench" profile dashboard | User Dashboard | P3 | Backlog |

---

## 5. Phase 5 Backlog: Editorial Content & Sanity CMS

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `CMS-01` | Upgrade Sanity schemas with formal references for Authors, Related Tools, and Topic Clusters | CMS Schema | P3 | Backlog |
| `AUTO-01` | Automate LinkedIn publishing queue via scheduled Vercel cron endpoints | Automation | P3 | Backlog |

---

## Task Completion Protocol
When completing a task:
1. Ensure the deliverable satisfies the **Definition of Done** in `AI/RULES.md`.
2. Run `npm run build` to verify production compilation and route generation.
3. Mark task as `Done` in `AI/TASKS.md`.
4. Update `AI/CURRENT_STATE.md`.
5. Create a descriptive Git checkpoint commit.
