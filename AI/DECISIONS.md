# ARCHITECTURAL DECISION RECORDS (ADRs)

## ADR-001: Vite SPA with Static Post-Build SEO Pre-rendering (SSG Hybrid)
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: The project requires extensive SEO indexing across 4,700+ routes (blog essays, font detail pages, resource catalogs, bilingual URLs) while preserving fast client-side transitions and interactive tool states.
* **Decision**: Maintain Vite + React Router v7 SPA architecture combined with a custom post-build Node.js crawler script (`scripts/generate-seo-pages.mjs`). The script injects pre-rendered static HTML with full meta tags, OpenGraph cards, JSON-LD schemas, and hreflang tags into `dist/`.
* **Consequences**:
  - *Pros*: Zero server hosting costs, instant edge caching on Vercel, perfect SEO crawlability, lightning-fast development cycle with Vite HMR.
  - *Cons*: Build time takes ~20-30 seconds to write pre-rendered files to disk.

---

## ADR-002: Two-Tier Data Resilience (Sanity CMS + In-Memory Fallback)
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Network latency, Sanity rate limits, or API downtime must never break the user experience or leave blank pages.
* **Decision**: Implement a two-tier content resolution layer:
  1. Primary: Un-cached live queries to Sanity CMS (`@sanity/client` with `useCdn: false`).
  2. Fallback: Synchronized local TypeScript registries (`src/lib/editorialBlogRegistry.ts`, `googleFontsCatalog.json`, `portfolioFallback.ts`).
* **Consequences**:
  - *Pros*: 100% uptime resilience, zero broken links during CMS maintenance, instantaneous fallback rendering.
  - *Cons*: Two-way sync scripts (`scripts/syncAllBlogsToSanity.mjs`) must be maintained.

---

## ADR-003: Tailwind CSS v4 Native Theme Variable Integration
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Need a lightweight, flexible design token system supporting dark/light mode toggles with zero runtime overhead and minimal CSS bundle weight.
* **Decision**: Use Tailwind CSS v4 (`@tailwindcss/vite`) with `@theme inline` binding directly to CSS custom properties defined in `src/styles/theme.css`.
* **Consequences**:
  - *Pros*: Seamless class switching via `.dark` / `.light` class on root document, zero JavaScript runtime for theme calculations, full design token autocomplete.
  - *Cons*: Adheres strictly to CSS custom properties rather than Tailwind v3 JavaScript config object.

---

## ADR-004: Client-Side Vector PDF Engine for ATS Resume Builder
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Resume builder users require instant PDF generation without exposing sensitive personal resume information to third-party backend rendering servers.
* **Decision**: Implement client-side PDF rendering via canvas/vector pipeline with strict print-safe CSS margins and sub-300KB file output.
* **Consequences**:
  - *Pros*: 100% user privacy, zero backend server load, instantaneous downloads, offline capability.
  - *Cons*: Relies on client browser rendering capabilities.

---

## ADR-005: Dual Sub-Path Internationalization (`/` for EN, `/az` for Azerbaijani)
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: English and Azerbaijani are first-class platform languages requiring distinct, indexable search URLs.
* **Decision**: Standard routes represent English (`/blog`, `/tools`, `/resources`), while `/az/*` routes provide direct Azerbaijani equivalents with reciprocal `hreflang` alternates and localized JSON-LD schemas.
* **Consequences**:
  - *Pros*: Clean URL structure, distinct Google search rankings per locale, clear language context.
  - *Cons*: Route manifests must maintain 1:1 mapping between language trees.

---

## ADR-006: Serverless LinkedIn Content Publishing Pipeline
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Automate organic social distribution of editorial essays to LinkedIn without external third-party scheduling SaaS.
* **Decision**: Implement native Vercel Serverless endpoints (`api/linkedin/*`) with OAuth token handling, automated cron dispatchers, and state management.
* **Consequences**:
  - *Pros*: Native integration, zero monthly SaaS costs, complete control over publication scheduling.
  - *Cons*: Requires active LinkedIn OAuth refresh tokens.

---

## ADR-007: AI Project Control Suite in Repository Memory
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: AI context windows are finite. Relying on conversation history causes architectural drift and hallucinations across multi-turn sessions.
* **Decision**: Maintain authoritative documentation in the `AI/` directory (`PROJECT_CONTEXT.md`, `PRODUCT_VISION.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `ROADMAP.md`, `CURRENT_STATE.md`, `DECISIONS.md`, `RULES.md`, `TASKS.md`, `AUDITS/`). Every session reads and updates these files.
* **Consequences**:
  - *Pros*: Complete continuity across agent sessions, zero reliance on transient chat logs, single source of truth.
  - *Cons*: Requires disciplined maintenance at the end of every feature phase.

---

## ADR-008: Authoritative Unified Sitemap & Two-Tier Font Indexation Model
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**:
  1. `vercel.json` rewrote `/sitemap.xml` to `api/sitemap.ts`, which truncated the sitemap to ~10 URLs and omitted all Azerbaijani routes, tools, and font pages.
  2. Generating 4,600 thin font specimen pages in the primary sitemap risked Google "thin programmatic content" penalties and crawl budget exhaustion.
  3. Duplicate URLs existed for founder profile (`/profile`, `/ravanmammadov`, `/ravan-mammadov`), and admin consoles (`/admin/linkedin`) were exposed in search results.
* **Decision**:
  1. Remove `/sitemap.xml` rewrite from `vercel.json`, allowing Vercel edge to serve the pre-rendered `dist/sitemap.xml` directly as a static file.
  2. Implement 301 permanent redirects from `/profile` and `/ravanmammadov` to canonical `/ravan-mammadov` (and `/az` equivalents).
  3. Mark `/admin/linkedin` with `<meta name="robots" content="noindex, nofollow" />` and exclude from sitemaps.
  4. Implement a Two-Tier Font strategy:
     - **Tier 1 (Top 200 Curated Fonts)**: Fully indexable, rich localized titles/descriptions, included in `sitemap.xml` (~400 URLs with EN/AZ pairs).
     - **Tier 2 (Long-Tail ~1,800 Fonts)**: Pre-rendered with `<meta name="robots" content="noindex, follow" />`, excluded from `sitemap.xml`, fully accessible to users in the client application.
* **Consequences**:
  - *Pros*: Completely unified single source of truth for sitemap; protects domain authority from thin content penalties; ensures 100% crawl coverage for 39 master essays, tools, and top fonts; eliminates duplicate content issues.
  - *Cons*: Long-tail fonts do not compete individually in search rankings, but are discovered through the high-ranking curated catalog.

---

## ADR-009: Ecosystem Relationship Graph & Contextual Interlinking Engine
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Editorial essays previously ended with arbitrary slice-based related posts, resulting in isolated content silos with zero contextual discovery of interactive tools (ATS Resume Builder, Open Peeps) and curated typography resources.
* **Decision**:
  1. Create a structured semantic relationship graph in `src/lib/ecosystemRelationshipMap.ts` mapping all 39 master essays to topic clusters, contextual interactive tool bridges, curated resource bridges, and 4 reciprocal related essays.
  2. Implement `EcosystemBridgeCard.tsx` rendering non-intrusive, editorial callouts for tools, typography specimens, and case studies.
  3. Upgrade `RelatedPosts.tsx` to pull curated semantic relationships rather than arbitrary array slices.
  4. Support full bilingual routing and localized copy across English and Azerbaijani.
* **Consequences**:
  - *Pros*: Eliminates all orphan content (0 orphan essays); distributes PageRank deeply into tools and resources; dramatically increases session duration and utility discovery; 100% build-time resolution with zero runtime overhead.
  - *Cons*: Adding new articles in future requires adding a corresponding entry to `ecosystemRelationshipMap.ts`.

---

## ADR-010: Flagship Responsive Typography Scale & Clamp Calculator
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: The platform required a flagship utility for the **USE** pillar targeting high-intent organic search queries around fluid typography, CSS clamp calculation, and responsive design systems.
* **Decision**:
  1. Build a pure client-side mathematical solver (`src/lib/typography/typeScaleEngine.ts`) calculating modular harmonic ratios and linear interpolation equations ($y = mx + b$) to generate exact rem-based CSS `clamp()` tokens.
  2. Implement interactive controls (`TypeScaleControls.tsx`) supporting 8 modular scale presets (Minor Second to Golden Ratio) plus custom ratios, mobile/desktop base font sizes, and font family preview switching.
  3. Provide a real-time viewport simulator (`TypeScaleViewportSimulator.tsx`) with 320px–1600px slider and breakpoint buttons, coupled with an editable live specimen canvas (`TypeScaleHierarchyPreview.tsx`).
  4. Implement a multi-tab exporter (`TypeScaleCodeExporter.tsx`) generating CSS Variables (`:root`), utility classes, and Tailwind config with one-click copy and file download.
  5. Deploy on canonical indexable routes `/tools/typography-scale` and `/az/tools/typography-scale`, including JSON-LD `WebApplication` schema, sitemap registration, and bi-directional links with editorial typography essays.
* **Consequences**:
  - *Pros*: Zero runtime dependencies; 36.45KB code-split bundle; fully accessible (keyboard, dark/light, screen-readers); captures key high-volume organic search queries; deepens product utility.
  - *Cons*: None.
