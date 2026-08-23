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
* **Context**: Maintain continuous social syndication of master editorial blog essays to LinkedIn without manual publishing overhead.
* **Decision**: Implement a Vercel Serverless Function (`api/linkedin/pipeline.ts`) triggered via Vercel Cron at `0 12 * * *`. The pipeline selects a queue item, authenticates via OAuth2, formats rich text, attaches cover graphics, and publishes to the LinkedIn UGC API.
* **Consequences**:
  - *Pros*: Autonomous organic distribution, zero server maintenance, rate-limited and idempotent execution.
  - *Cons*: Requires active OAuth refresh token rotation.

---

## ADR-007: Authoritative Single-Source-of-Truth Sitemap Architecture
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Divergence between build-time static sitemap generation and serverless `/api/sitemap.ts` rewrite caused production crawlers to receive incomplete route lists.
* **Decision**:
  1. Remove the serverless `/sitemap.xml` rewrite from `vercel.json`.
  2. Generate a comprehensive static `dist/sitemap.xml` via `scripts/generate-seo-pages.mjs` containing 1,099+ verified, indexable routes with exact `<lastmod>`, `<changefreq>`, `<priority>`, and reciprocal `xhtml:link` hreflang tags.
  3. Ensure serverless `api/sitemap.ts` reads directly from the static file as an API gateway.
* **Consequences**:
  - *Pros*: 100% parity across production builds, staging environments, and edge CDNs; eliminates stale routes and incomplete indexing.
  - *Cons*: None.

---

## ADR-008: Two-Tier Curated Font Indexation Strategy
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: 2,009 Google Font routes created massive sitemap bloat with near-duplicate thin content for obscure font families.
* **Decision**:
  1. Select the top 200 high-utility curated fonts as **Tier 1** (e.g. Inter, Roboto, Playfair Display, Montserrat, Fira Code, Outfit, Space Grotesk). Include only Tier 1 in `sitemap.xml` with priority 0.7.
  2. Mark Tier 2 long-tail fonts (1,809 routes) with `<meta name="robots" content="noindex, follow" />` and exclude them from `sitemap.xml`.
* **Consequences**:
  - *Pros*: Protects platform crawl budget, concentrates domain authority on high-value specimen pages, prevents Google thin-content penalties.
  - *Cons*: Tier 2 fonts are accessible via internal search but will not rank individually in Google SERPs.

---

## ADR-009: Contextual Ecosystem Interlinking Graph (Zero Orphan Content)
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: The 39 master editorial blog essays were isolated endpoints without clear onward paths to interactive tools or curated design resources.
* **Decision**:
  1. Implement a structured semantic relationship graph in `src/lib/ecosystemRelationshipMap.ts`.
  2. Map all 39 essays to 4 topical clusters with curated related articles, tool discovery bridges (`toolBridge`), and resource discovery bridges (`resourceBridge`).
  3. Render contextual bridge cards via `EcosystemBridgeCard.tsx` at the conclusion of every article.
* **Consequences**:
  - *Pros*: 0 orphan articles; improves session depth, topical authority, and internal PageRank flow; guides readers naturally from theory to interactive utilities.
  - *Cons*: New articles must be registered in the relationship graph.

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

---

## ADR-011: APCA 0.98G Deterministic Contrast Solver & Accessibility Matrix
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Traditional WCAG 2.x 4.5:1 luminance ratio math fails to account for human optical physiology, font weight, spatial frequency, and dark mode flare. Designers need a deterministic APCA implementation combined with practical UI matrix tools.
* **Decision**:
  1. Implement deterministic APCA-0.98G algorithm (`src/lib/accessibility/apcaEngine.ts`) by Andrew Somers (W3C AGWG Silver Candidate) with soft flare clamping, normal polarity ($S_{\text{bg}}^{0.56} - S_{\text{txt}}^{0.57}$) and reverse polarity ($S_{\text{bg}}^{0.65} - S_{\text{txt}}^{0.62}$) curves.
  2. Implement side-by-side comparative WCAG 2.1 relative luminance calculator with clear distinction that WCAG 2.1 is the current legal standard while APCA represents perceptual design ergonomics.
  3. Create a 2D typography compliance matrix ($12\text{px}$–$48\text{px}$ across weights $300$–$700$) mapping spatial frequency requirements.
  4. Provide a semantic design system token evaluator (`ApcaTokenMatrix.tsx`) and live UI sandbox (`ApcaLiveUiSpecimen.tsx`).
  5. Deploy on `/tools/contrast-matrix` and `/az/tools/contrast-matrix` with full static pre-rendering, sitemap registration, and ecosystem cross-links.
* **Consequences**:
  - *Pros*: Zero runtime dependencies; 44.67KB code-split bundle; mathematically validated benchmark outputs (+106 for black on white, -107.9 for white on black); establishes platform authority in design accessibility.
  - *Cons*: None.

---

## ADR-012: Deterministic Cognitive Marketing & Persuasion Analysis Engine
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Marketers and product designers need transparent, explainable heuristic analysis for copywriting (headlines, value props, CTAs) without sending private draft copy to external AI APIs or dealing with unpredictable LLM hallucinations.
* **Decision**:
  1. Implement a pure client-side deterministic analysis engine (`src/lib/marketing/persuasionEngine.ts`) evaluating 8 core psychological dimensions: Clarity & Cognitive Load, Specificity & Concreteness, Value & Benefit Orientation, Friction & Risk Reversal, Momentum & Urgency, Social Proof & Authority.
  2. Support 3 distinct copy modes (`headline`, `cta`, `value_prop`) with specialized length, verb potency, and friction weighting.
  3. Detect linguistic and psychological signals: high-impact power verbs, high-friction commitment triggers, vague corporate buzzwords, and customer-centric pronoun ratios (You/Your vs. We/Our).
  4. Provide concrete, actionable rewrite recommendations and exemplar transformation templates.
  5. Connect with master essays on conversion rate optimization, pricing psychology, and cognitive bias.
  6. Deploy on `/tools/persuasion-analyzer` and `/az/tools/persuasion-analyzer` with full static pre-rendering and sitemap inclusion.
* **Consequences**:
  - *Pros*: 100% client-side privacy; zero external AI API costs or latency; fully explainable heuristic scoring; 41.41KB code-split chunk; deepens the **USE** pillar of the platform.
  - *Cons*: None.

---

## ADR-013: Topic Ecosystem Hubs & Client-Side Global Discovery Engine
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: The platform contained high-value editorial essays, interactive tools, and font/icon specimens that functioned as discrete units. Users and search crawlers needed structured semantic topical pillars connecting the entire learning and tooling journey.
* **Decision**:
  1. Create 4 authoritative Topic Hubs (`src/lib/topicHubs.ts`):
     - `/topics/typography`: Modular type scales, fluid clamp math, font pairings, Google Fonts specimens.
     - `/topics/design-psychology`: Visual hierarchy, Gestalt laws, Von Restorff effect, cognitive fluency.
     - `/topics/marketing-psychology`: Conversion copywriting, pricing psychology, loss aversion, persuasion heuristics.
     - `/topics/accessibility`: APCA perceptual contrast, WCAG 2.1 comparative ratios, inclusive tokens.
  2. Implement `TopicHubPage.tsx` and `TopicArchivePage.tsx` rendering foundational principles, interactive tool links, curated essays, and domain resources.
  3. Implement client-side `GlobalSearchModal.tsx` (`Cmd+K`) searching across all articles, tools, topic hubs, and resources with zero backend latency.
  4. Deploy Resource $\rightarrow$ Tool discovery bridges on Font detail pages (`FontDetailPage.tsx` $\rightarrow$ `/tools/typography-scale`).
  5. Fully localize all hubs for English and Azerbaijani (`/topics/*` and `/az/topics/*`), with `CollectionPage` JSON-LD schemas and sitemap entries.
* **Consequences**:
  - *Pros*: Provides natural search acquisition entry points; increases multi-page session depth; interconnects LEARN, USE, and DISCOVER pillars; 100% pre-rendered and indexable.
  - *Cons*: None.

---

## ADR-014: Four Core Pillar Content Architecture & Organic Heuristic Acquisition
* **Date**: 2026-08-18
* **Status**: ACCEPTED & IMPLEMENTED
* **Context**: Following the launch of topic hubs and tools, high-intent search queries required comprehensive, evergreen pillar guides that anchor each of the 4 domains with practical engineering and cognitive depth.
* **Decision**:
  1. Launch 4 flagship organic pillar guides:
     - Typography: `guide-responsive-fluid-typography-css-clamp`
     - Accessibility: `apca-vs-wcag-contrast-accessibility-guide`
     - Marketing Psychology: `guide-cognitive-conversion-copywriting`
     - Design Psychology: `visual-hierarchy-framework-web-interfaces`
  2. Integrate each guide as the primary anchor in its respective topic hub, with bidirectional bridges to flagship interactive workbenches (`/tools/typography-scale`, `/tools/contrast-matrix`, `/tools/persuasion-analyzer`, `/tools/resume-builder`).
  3. Full bilingual EN/AZ localization, static pre-rendering, BlogPosting JSON-LD schemas, and sitemap registration.
* **Consequences**:
  - *Pros*: Complete topical authority across all 4 hubs; zero orphaned categories; delivers practical mathematical, psychophysical, and cognitive clarity.
  - *Cons*: None.


