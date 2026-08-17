# CURRENT REPOSITORY STATE

**Last Updated**: 2026-08-18  
**Current Phase**: Phase 0 (AI Project Control & Memory Establishment)  
**Production Build Status**: PASSING (Vite v6.3.5 built in ~33s, 4,719 SEO routes pre-rendered)  
**Active Git Branch**: `main` (clean working tree with untracked local scripts)  

---

## 1. Codebase Inventory & Metrics

### Key Statistics
* **Pre-rendered HTML Routes**: 4,719 (2,359 English + 2,360 Azerbaijani)
* **Master Editorial Blog Essays**: 39 deeply researched articles with dual-language support
* **Indexed Google Fonts**: 1,700+ font families with dedicated detail pages & specimen engines
* **Interactive Tools**: 2 live production tools (ATS Resume Builder & Open Peeps Character Generator)
* **Sanity CMS Project ID**: `0lqwkcmg` (Dataset: `production`, live un-cached client queries)
* **Languages**: English (`/`) and Azerbaijani (`/az`)

---

## 2. Core Functional Modules Status

| Module | Location | Status | Summary & Capabilities |
| :--- | :--- | :--- | :--- |
| **Home Page** | `src/app/HomePage.tsx` | Healthy | Atmospheric hero, 3D particles, curated blog showcase, resources showcase, tools showcase, contact CTA |
| **Blog & Editorial Engine** | `src/app/BlogArchive.tsx`, `BlogDetail.tsx`, `src/lib/blogs/` | Healthy | 39 master essays, Sanity live sync + local TypeScript fallback registry, related articles, reading time, table of contents |
| **ATS Resume Builder** | `src/app/components/tools/resumebuilder/` | Healthy | Real-time ATS parser, score calculator, multi-template selector, print safe margins, client-side vector PDF download (<300KB) |
| **Character Builder** | `src/app/components/tools/OpenPeepsBuilder.tsx` | Healthy | SVG vector customizer for Open Peeps illustration library with SVG/EPS/PNG multi-format export |
| **Resources Archive** | `src/app/ResourcesArchive.tsx`, `ResourceDetail.tsx` | Healthy | Category filters (Fonts, Icons, Software, Student Packs, AI Tools), fuzzy search, external link verify |
| **Fonts Directory** | `src/app/pages/FontDetailPage.tsx`, `src/lib/fontEngine.ts` | Healthy | 1,700+ Google Fonts with live specimen editor, weight testing, variable axes, CSS embed code snippet |
| **About / Profile** | `src/app/AboutPage.tsx`, `FounderProfilePage.tsx` | Healthy | Studio mission, founder biography (Ravan Mammadov), brand experience, awards, skill matrix |
| **Legal & Privacy** | `PrivacyPolicyPage.tsx`, `CookiePolicyPage.tsx`, `TermsPage.tsx` | Healthy | GDPR/CCPA compliance, localized cookie preferences modal, terms of service |
| **Authentication** | `src/context/AuthContext.tsx`, `src/app/components/AuthModal.tsx` | Functional | Firebase Google OAuth sign-in / sign-out |
| **Serverless API** | `api/` (contact, comment, sitemap, linkedin pipeline) | Functional | Resend contact dispatch, comments moderation API, dynamic sitemap, automated LinkedIn publishing |

---

## 3. Build & Deployment Diagnostics

* **Production Command**: `npm run build` (`vite build && node scripts/generate-seo-pages.mjs`)
* **Bundle Sizes**:
  - `dist/index.html`: 5.35 kB (gzip: 1.55 kB)
  - `index.css`: 126.40 kB (gzip: 18.94 kB)
  - `index.js` (main bundle): 1,310.39 kB (gzip: 355.74 kB)
  - `googleFontsCatalog.js`: 1,465.07 kB (gzip: 98.92 kB, lazy-loaded)
  - `three-vendor.js`: 824.13 kB (gzip: 221.74 kB, lazy-loaded)
  - `icons-vendor.js`: 803.43 kB (gzip: 147.11 kB, lazy-loaded)
  - `html2pdf.js`: 984.51 kB (gzip: 285.57 kB, lazy-loaded)

---

## 4. Strengths & Growth Opportunities

### Key Strengths
1. **Exceptional SEO Foundation**: 4,719 static HTML files pre-rendered at build time with rich metadata, OpenGraph cards, JSON-LD schemas, and hreflang tags.
2. **Resilient Data Architecture**: Zero downtime guarantee through two-layer data resolution (Sanity CMS live with in-code fallback registry).
3. **High-Value Tools**: ATS Resume Builder and Open Peeps generator provide real user utility with zero third-party dependencies or privacy risks.
4. **Bilingual Parity**: Genuine Azerbaijani translations for all 39 editorial essays and core UI elements.

### Identified Gaps & Optimization Opportunities
1. **Main Bundle Splitting**: The root `index.js` bundle (355 kB gzip) contains non-critical UI code that can be further split into route-level chunks.
2. **Auth Utility**: Google Auth currently tracks login state but lacks user data persistence (e.g. saving bookmarks or resume drafts).
3. **Tool Breadth**: Expanding from 2 to 5+ high-utility tools (Typography Scale, Contrast Matrix, CTA Analyzer) will significantly increase organic search acquisition.
