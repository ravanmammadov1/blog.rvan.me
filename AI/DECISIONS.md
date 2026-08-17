# ARCHITECTURAL DECISION RECORDS (ADRs)

## ADR-001: Vite SPA with Static Post-Build SEO Pre-rendering (SSG Hybrid)
* **Date**: 2026-08
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: The project requires extensive SEO indexing across 4,700+ routes (blog essays, font detail pages, resource catalogs, bilingual URLs) while preserving fast client-side transitions and interactive tool states.
* **Decision**: Maintain Vite + React Router v7 SPA architecture combined with a custom post-build Node.js crawler script (`scripts/generate-seo-pages.mjs`). The script injects pre-rendered static HTML with full meta tags, OpenGraph cards, JSON-LD schemas, and hreflang tags into `dist/`.
* **Consequences**:
  - *Pros*: Zero server hosting costs, instant edge caching on Vercel, perfect SEO crawlability, lightning-fast development cycle with Vite HMR.
  - *Cons*: Build time takes ~30-40 seconds to write 4,700+ files to disk.

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
