# PROJECT TASK MANAGEMENT

## Active Phase: Phase 0 — AI Project Control & Baseline Memory

---

## 1. Current Sprint Tasks

| Task ID | Description | Category | Priority | Status | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TASK-001` | Establish AI Project Control Suite in `AI/` directory | Architecture | P0 | Done | Primary Agent |
| `TASK-002` | Audit existing repository, routes, CMS schemas, and dependencies | Audit | P0 | Done | Primary Agent |
| `TASK-003` | Verify production build baseline (`npm run build`) | QA / Build | P0 | Done | Primary Agent |
| `TASK-004` | Create Git checkpoint commit for AI memory system | Git | P0 | Pending | Primary Agent |

---

## 2. Phase 1 Backlog: Core UX, SEO Architecture & Performance Hardening

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-101` | Optimize `index.js` main bundle by moving heavy UI utilities to route-level lazy chunks | Performance | P1 | Ready |
| `TASK-102` | Audit mobile touch targets and navigation drawer on iOS/Android viewports | UX / Mobile | P1 | Ready |
| `TASK-103` | Validate OpenGraph and Twitter card generation across all 4,700+ routes | SEO | P1 | Ready |
| `TASK-104` | Audit Azerbaijani string translations in `src/lib/i18n/translations.ts` for 100% UI coverage | i18n | P1 | Ready |
| `TASK-105` | Enhance structured JSON-LD schemas on Tools and Font detail pages (`SoftwareApplication`, `ItemPage`) | SEO | P2 | Ready |

---

## 3. Phase 2 Backlog: High-Utility Creative Tools Suite

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-201` | Build **Fluid Typography Scale & Clamp Generator** (`/tools/typography-scale`) | Interactive Tool | P1 | Backlog |
| `TASK-202` | Build **Color Contrast & APCA Matrix Evaluator** (`/tools/contrast-matrix`) | Interactive Tool | P1 | Backlog |
| `TASK-203` | Build **Marketing Headline & CTA Impact Analyzer** (`/tools/headline-analyzer`) | Interactive Tool | P2 | Backlog |
| `TASK-204` | Add drag-and-drop section reordering & JSON backup to **ATS Resume Builder** | Tool Upgrade | P2 | Backlog |

---

## 4. Phase 3 Backlog: Resource Discovery & Search Engine Deepening

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-301` | Implement global command palette / fuzzy search (`Cmd/Ctrl + K`) across all tools & essays | Discovery | P1 | Backlog |
| `TASK-302` | Add variable font axis playground (Weight, Width, Slant, Optical Size) on font detail pages | Specimen Engine | P2 | Backlog |
| `TASK-303` | Implement direct one-click code copy (SVG, React JSX, Tailwind) on Lucide icon specimen cards | Asset Tool | P2 | Backlog |

---

## 5. Phase 4 Backlog: User Accounts & Saved Collections

| Task ID | Description | Category | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `TASK-401` | Implement user bookmarking / saved articles and tools via Firebase Auth | Auth Utility | P2 | Backlog |
| `TASK-402` | Enable resume draft cloud synchronization linked to user Google account | User Storage | P2 | Backlog |

---

## Task Completion Protocol
When completing a task:
1. Ensure the feature satisfies the **Definition of Done** in `AI/RULES.md`.
2. Run `npm run build` to verify production compilation.
3. Mark task as `Done` in `AI/TASKS.md`.
4. Update `AI/CURRENT_STATE.md`.
5. Create a descriptive Git commit.
