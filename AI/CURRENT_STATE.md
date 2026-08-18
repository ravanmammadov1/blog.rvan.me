# CURRENT REPOSITORY STATE

**Last Updated**: 2026-08-18  
**Current Phase**: Focused Security & CSP Resolution (COMPLETED)  
**Production Build Status**: PASSING (Vite v6.3.5, 4,719 SEO routes pre-rendered, 1,099 authoritative indexable sitemap URLs generated in ~13.41s)  
**Active Git Branch**: `main`  
**Latest Architectural Decision**: [`ADR-011: APCA 0.98G Deterministic Contrast Solver & Accessibility Matrix`](file:///C:/Project/ReplicateGitHubPortfolioSite-main/AI/DECISIONS.md)

---

## 1. Content Security Policy (CSP) & Clarity Resolution

* **CSP Source**: Authoritative HTTP header configured in `vercel.json` under `headers` for `"source": "/(.*)"`.
* **Clarity Decision**: Microsoft Clarity is intentionally enabled for user session analytics when consent is granted. The minimal required origins (`https://www.clarity.ms https://*.clarity.ms` in `script-src` and `https://*.clarity.ms https://c.clarity.ms` in `connect-src`) were added to `vercel.json`.
* **Eval Source & Cause**: No first-party application code uses `eval()`. Third-party tag managers (GTM) or external tools that attempt string evaluation remain intentionally blocked by strict CSP without `'unsafe-eval'`. React does not crash and the policy is not weakened.
* **Final CSP Header**:
  ```text
  default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https: http:; media-src 'self' blob: https:; connect-src 'self' https: wss: https://*.clarity.ms https://c.clarity.ms; frame-src 'self' https:; object-src 'none'; base-uri 'self'
  ```

---

## 2. Codebase Inventory & Metrics

### Key Statistics
* **Pre-rendered HTML Routes**: 4,719 (Full static pre-rendering across EN & AZ including `/tools/contrast-matrix` and `/tools/typography-scale`)
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
