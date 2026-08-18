# CURRENT REPOSITORY STATE

**Last Updated**: 2026-08-18  
**Current Phase**: Phase 4 — Organic Discovery Engine (COMPLETED)  
**Production Build Status**: PASSING (Vite v6.3.5, 4,731 SEO routes pre-rendered, 1,111 authoritative indexable sitemap URLs generated in ~33.37s)  
**Active Git Branch**: `main`  
**Latest Architectural Decision**: [`ADR-013: Topic Ecosystem Hubs & Client-Side Global Discovery Engine`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/AI/DECISIONS.md)

---

## 1. Codebase Inventory & Metrics

### Key Statistics
* **Pre-rendered HTML Routes**: 4,731 (Full static pre-rendering across EN & AZ including 4 Topic Hubs, 5 Interactive Tools, 39 Blog Essays, and Font Catalogs)
* **Authoritative Sitemap URLs**: 1,111 high-value, deduplicated, indexable routes
* **Topic Ecosystem Hubs**: 4 flagship domain pillars (`/topics/typography`, `/topics/design-psychology`, `/topics/marketing-psychology`, `/topics/accessibility`) + master topic directory (`/topics`)
* **Interactive Tools**: 5 live production tools (Marketing & Persuasion Analyzer, APCA Contrast Matrix, Typography Scale Calculator, ATS Resume Builder, and Open Peeps Character Generator)
* **Master Editorial Blog Essays**: 39 deeply researched articles with dual-language support (100% interconnected, 0 orphan articles)
* **Global Search**: Client-side instant command search (`GlobalSearchModal.tsx`, `Cmd+K`) across articles, tools, topic hubs, and resources
* **Resource-to-Tool Bridges**: Font detail pages directly link to `/tools/typography-scale` with fluid clamp() calculations
* **Curated Inter-Article Links**: 156 reciprocal topical relationships (average 4.0 related essays per article)
* **Font Catalog**: 2,009 fonts total (Top 200 Tier 1 curated fonts indexable in sitemap; Tier 2 long-tail marked `noindex, follow`)
* **Admin Routes**: `/admin/linkedin` & `/az/admin/linkedin` strictly marked `noindex, nofollow` and excluded from sitemap

---

## 2. Core Functional Modules Status

| Module | Location | Status | Assessment |
| :--- | :--- | :--- | :--- |
| **Topic Hubs Engine** | `src/app/pages/TopicHubPage.tsx`, `TopicArchivePage.tsx`, `src/lib/topicHubs.ts` | Healthy | 4 domain pillars, scientific principles, domain tool links, curated essays, font/icon specimens, full EN/AZ localization and CollectionPage schema |
| **Global Ecosystem Search** | `src/app/components/GlobalSearchModal.tsx`, `SiteHeader.tsx` | Healthy | Instant client-side index across 39 essays, 5 tools, 4 hubs, and resources with keyboard navigation (Cmd+K) and content badges |
| **Marketing & Persuasion Analyzer** | `src/app/components/tools/persuasion/`, `src/lib/marketing/` | Healthy | Deterministic cognitive psychology engine, 8 persuasion dimensions, headline/CTA/value prop modes, empirical specificity audit, risk reversal scoring |
| **APCA Contrast Matrix** | `src/app/components/tools/contrast/`, `src/lib/accessibility/` | Healthy | Flagship APCA 0.98G solver, 2D typography compliance matrix, live UI sandbox, semantic design token audit, comparative WCAG 2.1 ratio |
| **Typography Scale Calculator** | `src/app/components/tools/typography/`, `src/lib/typography/` | Healthy | Flagship responsive type scale solver, 8 modular presets, custom ratios, live viewport simulator, multi-format CSS/Tailwind export |
| **Blog & Editorial Engine** | `src/app/BlogArchive.tsx`, `BlogDetail.tsx`, `src/lib/blogs/` | Healthy | 39 master essays, dual EN/AZ content, featured banner, lightweight APCA promo, reading time estimates, table of contents, contextual ecosystem bridges |
| **ATS Resume Builder** | `src/app/components/tools/resumebuilder/` | Healthy | Live split-screen, ATS scoring, 5 templates, print safe margins, vector PDF export (<300KB) |
| **Character Builder** | `src/app/components/tools/OpenPeepsBuilder.tsx` | Healthy | SVG vector customizer for Open Peeps illustration library with SVG/EPS/PNG multi-format export |
| **Ecosystem Interlinking** | `src/app/components/blog/EcosystemBridgeCard.tsx`, `src/lib/ecosystemRelationshipMap.ts` | Healthy | Full bidirectional graph across 39 essays, tools, and resources with 0 orphans |
| **Home Page** | `src/app/HomePage.tsx` | Healthy | Atmospheric hero, 3D particles, curated blog showcase, resources showcase, tools showcase, contact CTA |
| **Resources Archive** | `src/app/ResourcesArchive.tsx`, `ResourceDetail.tsx` | Healthy | Category filters (Fonts, Icons), fuzzy search, external link verify |
| **Fonts Directory** | `src/app/pages/FontDetailPage.tsx`, `src/lib/fontEngine.ts` | Healthy | 2,009 Google Fonts with live specimen editor, weight testing, variable axes, CSS embed code snippet, and direct clamp() scale tool bridge |
| **About / Profile** | `src/app/AboutPage.tsx`, `FounderProfilePage.tsx` | Healthy | Studio mission, founder biography (Ravan Mammadov), brand experience, awards, skill matrix. Canonicalized to `/ravan-mammadov` |
| **Legal & Privacy** | `PrivacyPolicyPage.tsx`, `CookiePolicyPage.tsx`, `TermsPage.tsx` | Healthy | GDPR/CCPA compliance, localized cookie preferences modal, terms of service |
| **Serverless API** | `api/` (contact, comment, sitemap, linkedin pipeline) | Functional | Resend contact dispatch, comments moderation API, sitemap single-source-of-truth gateway |
