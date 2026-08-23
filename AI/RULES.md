# MASTER ENGINEERING & PRODUCT RULES

These rules are authoritative and non-negotiable across all development phases.

---

## 1. Quality Over Quantity
* **Absolute Rule**: A smaller number of polished, high-utility features is exponentially better than many half-implemented or cosmetic features.
* **Prohibited Deliverables**:
  - Never ship placeholder text (e.g. "Lorem ipsum", "Feature coming soon").
  - Never ship fake testimonials, mock metrics, or fabricated user reviews.
  - Never ship fake AI features (e.g. simulated delay bars that return hardcoded static strings).
  - Never ship non-functional buttons or dead-end navigation links.
  - If a feature cannot be completed to production-grade quality, do not ship it.

---

## 2. Repository as Long-Term Memory
* The repository `AI/` directory is the single source of truth.
* Never rely on previous chat conversations or ephemeral LLM memories.
* Before starting any task:
  1. Read `AI/PROJECT_CONTEXT.md` & `AI/CURRENT_STATE.md`.
  2. Read `AI/TASKS.md` & `AI/RULES.md`.
  3. Work within the designated phase.
* After completing any major phase or task:
  1. Update `AI/CURRENT_STATE.md` and `AI/TASKS.md`.
  2. Document new architecture decisions in `AI/DECISIONS.md`.
  3. Create a clean Git checkpoint commit.

---

## 3. Technology Discipline
* Respect the existing technology stack (React 18, TypeScript, Vite, Tailwind v4, Sanity CMS, Firebase Auth).
* Do not introduce new frameworks or heavy third-party dependencies casually.
* Before adding any dependency:
  1. Can the existing stack or native browser API solve this?
  2. Is the dependency actively maintained and secure?
  3. What is its impact on the client bundle size?
  4. Does it introduce unnecessary architectural complexity?

---

## 4. 8-Step Development Workflow
Every non-trivial task must follow this deterministic progression:
```
1. REQUIREMENTS  → Identify the exact user value & SEO utility
2. PLAN          → Outline component hierarchy, state, and routes
3. IMPLEMENT     → Write clean, modular, typed code
4. VALIDATE      → Check desktop, tablet, and mobile responsiveness
5. TEST          → Run `npm run build` and automated scripts
6. AUDIT         → Verify SEO metadata, accessibility, and performance
7. DOCUMENT      → Update `AI/` documentation files
8. COMMIT        → Create a descriptive Git checkpoint commit
```

---

## 5. Definition of Done (DoD)
A task or feature is considered DONE only when all criteria are satisfied:
1. **Functional**: Works end-to-end without errors; handles empty, loading, and error states gracefully.
2. **Responsive UX**: Flawless layout across Mobile (<640px), Tablet (640-1024px), and Desktop (>1024px).
3. **Technical**: `npm run build` succeeds with zero TypeScript errors or broken routes.
4. **SEO**: Valid `<title>`, meta description, OpenGraph tags, JSON-LD schema, canonical link, and sitemap entry.
5. **Performance**: Optimized assets (WebP/AVIF), no unnecessary re-renders, lazy loading applied to heavy chunks.
6. **Accessibility**: Keyboard navigable, valid ARIA labels on interactive elements, sufficient color contrast.
7. **Content**: Zero placeholder or filler copy; genuine, author-level text in both English and Azerbaijani.

---

## 6. Internationalization Parity
* Azerbaijani (`/az`) is a first-class citizen with 100% feature and content parity with English (`/`).
* Never machine-generate low-quality translations merely to inflate page counts.
* Maintain bidirectional `hreflang` alternate tags on all pre-rendered HTML routes.

---

## 7. Git Safety & Checkpoint Protocol
* Always verify working tree status before and after modifications.
* Write structured, meaningful commit messages:
  - `chore: establish ai project control system`
  - `feat: implement typography scale calculator tool`
  - `fix: resolve mobile navigation backdrop blur`
  - `perf: split vendor chunks in rollup configuration`
* Never perform destructive repository-wide git operations without safety validation.
