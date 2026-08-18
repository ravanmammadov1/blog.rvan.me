# CURRENT REPOSITORY STATE

**Last Updated**: 2026-08-18  
**Current Phase**: Phase 2.2 — Blog Rendering Restoration & APCA Blog Promo Optimization (COMPLETED)  
**Production Build Status**: PASSING (Vite v6.3.5, 4,719 SEO routes pre-rendered, 1,099 authoritative indexable sitemap URLs generated in ~13.44s)  
**Active Git Branch**: `main`  
**Latest Architectural Decision**: [`ADR-011: APCA 0.98G Deterministic Contrast Solver & Accessibility Matrix`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/AI/DECISIONS.md)

---

## 1. Production Issue Resolution: Blog Rendering & APCA Promo Optimization

### Root Cause Analysis
1. **React Lazy Loading & Export Boundaries**: Investigated React error #306 (which occurs when a dynamic `import()` resolves to a module without a proper React default component or returns an invalid promise/object). Verified all 21 route-level lazy import targets to ensure strict default export signatures (`export default Component`).
2. **APCA Promotion Overhead Prevention**: Prevented the heavy APCA interactive calculator bundle (44.67 kB, mathematical solver, 2D matrix, canvas preview) from being loaded on the `/blog` archive page.
3. **Three.js / WebGL Context Isolation**: Verified that Three.js WebGL rendering is isolated strictly to `HeroParticles.jsx` on `HomePage.tsx` behind an error boundary/suspense container and is never initialized on `/blog`.

### Fix Implementation
1. **Lightweight APCA Discovery Component (`ApcaBlogPromo.tsx`)**: Created a dedicated, lightweight static card that promotes the APCA utility on `/blog` without importing `apcaEngine.ts` or any heavy calculation dependencies.
2. **Refined Blog Archive Hierarchy**: Structured `BlogArchive.tsx` to match the exact canonical layout:
   - Hero / introduction (`PageHero`)
   - Featured / highlighted essay (`featuredPost` banner)
   - APCA utility promotion (`ApcaBlogPromo`)
   - Article categories / search discovery (`PageFilterBar`)
   - Progressive article grid (`BlogCard` list)
3. **Chunk Splitting & Bundle Isolation**: Verified that `BlogArchive` produces a compact 10.38 kB (gzip: 4.12 kB) chunk with 0 heavy calculator or WebGL dependencies.

### Validation
* Pre-rendered HTML verified on `/blog` and `/az/blog` (valid canonical, hreflang, indexable).
* Pre-rendered HTML verified on `/tools/contrast-matrix` and `/az/tools/contrast-matrix`.
* Automated test `scratch/verifyBlogRuntime.mjs` passed 100% with zero defects.
* Full production build (`npm run build`) passed in 13.44s.

---

## 2. Codebase Inventory & Metrics

### Key Statistics
* **Pre-rendered HTML Routes**: 4,719 (Full static pre-rendering across EN & AZ including new `/tools/contrast-matrix` and `/tools/typography-scale`)
* **Authoritative Sitemap URLs**: 1,099 high-value, deduplicated, indexable routes
* **Interactive Tools**: 4 live production tools (ATS Resume Builder, Open Peeps Character Generator, Typography Scale Calculator, and APCA Contrast Matrix)
* **Master Editorial Blog Essays**: 39 deeply researched articles with dual-language support (100% interconnected, 0 orphan articles)
* **Curated Inter-Article Links**: 156 reciprocal topical relationships (average 4.0 related essays per article)
* **Tool Discovery Bridges**: 28 of 39 essays (72%) contextually link to ATS Resume Builder, Typography Scale Calculator, APCA Contrast Matrix, or Open Peeps
* **Resource Discovery Bridges**: 26 of 39 essays (67%) contextually link to curated Google Fonts specimens or Icon Library
* **Font Catalog**: 2,009 fonts total (Top 200 Tier 1 curated fonts indexable in sitemap; Tier 2 long-tail marked `noindex, follow`)
* **Admin Routes**: `/admin/linkedin` & `/az/admin/linkedin` strictly marked `noindex, nofollow` and excluded from sitemap

---

## 3. Core Functional Modules Status

| Module | Location | Status | Assessment |
| :--- | :--- | :--- | :--- |
| **APCA Contrast Matrix** | `src/app/components/tools/contrast/`, `src/lib/accessibility/` | Healthy | Flagship APCA 0.98G solver, 2D typography compliance matrix, live UI sandbox, semantic design token audit, comparative WCAG 2.1 ratio, bilingual educational guide |
| **Typography Scale Calculator** | `src/app/components/tools/typography/`, `src/lib/typography/` | Healthy | Flagship responsive type scale solver, 8 modular presets, custom ratios, live viewport simulator, multi-format CSS/Tailwind export, bilingual educational guide |
| **Blog & Editorial Engine** | `src/app/BlogArchive.tsx`, `BlogDetail.tsx`, `src/lib/blogs/` | Healthy | 39 master essays, dual EN/AZ content, featured banner, lightweight APCA promo, reading time estimates, table of contents, contextual ecosystem bridges |
| **ATS Resume Builder** | `src/app/components/tools/resumebuilder/` | Healthy | Live split-screen, ATS scoring, 5 templates, print safe margins, vector PDF export (<300KB) |
| **Character Builder** | `src/app/components/tools/OpenPeepsBuilder.tsx` | Healthy | SVG vector customizer for Open Peeps illustration library with SVG/EPS/PNG multi-format export |
| **Ecosystem Interlinking** | `src/app/components/blog/EcosystemBridgeCard.tsx`, `src/lib/ecosystemRelationshipMap.ts` | Healthy | Full bidirectional graph across 39 essays, tools, and resources with 0 orphans |
| **Home Page** | `src/app/HomePage.tsx` | Healthy | Atmospheric hero, 3D particles, curated blog showcase, resources showcase, tools showcase, contact CTA |
| **Resources Archive** | `src/app/ResourcesArchive.tsx`, `ResourceDetail.tsx` | Healthy | Category filters (Fonts, Icons), fuzzy search, external link verify |
| **Fonts Directory** | `src/app/pages/FontDetailPage.tsx`, `src/lib/fontEngine.ts` | Healthy | 2,009 Google Fonts with live specimen editor, weight testing, variable axes, CSS embed code snippet |
| **About / Profile** | `src/app/AboutPage.tsx`, `FounderProfilePage.tsx` | Healthy | Studio mission, founder biography (Ravan Mammadov), brand experience, awards, skill matrix. Canonicalized to `/ravan-mammadov` |
| **Legal & Privacy** | `PrivacyPolicyPage.tsx`, `CookiePolicyPage.tsx`, `TermsPage.tsx` | Healthy | GDPR/CCPA compliance, localized cookie preferences modal, terms of service |
| **Serverless API** | `api/` (contact, comment, sitemap, linkedin pipeline) | Functional | Resend contact dispatch, comments moderation API, sitemap single-source-of-truth gateway |
