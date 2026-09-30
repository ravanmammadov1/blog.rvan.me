# PROJECT CONTEXT

## 1. Overview
**Platform Name**: Rvan.me  
**Domain**: [https://blog.rvan.me](https://blog.rvan.me)  
**Founder & Creative Lead**: Ravan Mammadov (Senior Creative Designer & Art Director, Baku, Azerbaijan)  
**Core Mission**: To transform from a personal portfolio into a premier, high-utility creative publication, tools suite, and design resource ecosystem.

---

## 2. Product Philosophy & Value Pillars
The platform is organized around three foundational user-value pillars:

### 1. LEARN (Editorial & Insights)
* **Depth & Quality**: 39 deeply researched, long-form publication essays spanning Design, Marketing, Psychology, and Culture.
* **Topics Covered**: Cognitive ergonomics, visual hierarchy, pricing psychology, motion physics, color contrast accessibility, font psychology, conversion rate optimization, and brand storytelling.
* **Dual-Language**: Fully published in English (`/blog/:slug`) and Azerbaijani (`/az/blog/:slug`).

### 2. USE (Practical Interactive Tools)
* **ATS Resume / CV Builder**: Clean, HR-compliant vector resume builder with live preview, real-time ATS scoring, custom typography, print safe zones, and instant client-side PDF generation.
* **Open Peeps Character Builder**: Vector character illustrator supporting custom poses, headwear, facial expressions, accessories, and instant SVG/EPS/PNG vector export.
* **Future Tool Expansion**: Typography hierarchy calculator, contrast checker, CTA analyzer, marketing UTM builder, design token generator.

### 3. DISCOVER (Curated Creative Resources)
* **Google Fonts Catalog**: Over 1,700+ Google Fonts indexed with live interactive specimen testing, variable font axis sliders, category filters, and CSS snippet copy.
* **Lucide Vector Icons Catalog**: Thousands of vector icons with category grouping, fuzzy search, size/stroke customizers, and SVG copy.
* **Open Doodles Vector Illustrations**: Open-source vector illustrations categorized with direct SVG/PNG downloads.
* **AI Tools & Opportunities Directory**: Curated high-utility AI generators, workflow automation tools, remote design jobs, scholarships, and creative design competitions.

---

## 3. Business & Organic Growth Objectives
* **Organic Search Dominance**: Target high-intent, long-tail search queries across design typography, ATS formatting, vector illustration assets, and creative psychology.
* **High Topical Authority**: Interlink editorial essays with practical tools and downloadable assets to maximize session duration and natural backlinks.
* **Ecosystem Retention**: Convert casual search visitors into regular users through interactive utilities, bookmarkable resources, and future account-based collections.
* **Bilingual Market Leadership**: Establish authoritative English international coverage while providing the most comprehensive, high-quality design resource platform in Azerbaijani.

---

## 4. Current Technical Infrastructure
* **Frontend**: React 18.3.1, TypeScript 5.9.3, Vite 6.3.5.
* **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` 4.1.12), CSS Variables (`src/styles/theme.css`).
* **CMS & Content Layer**: Sanity.io (Project ID: `0lqwkcmg`, Dataset: `production`) with in-code fallback registry (`src/lib/editorialBlogRegistry.ts`).
* **Pre-rendering & SEO**: Custom Node.js SSG script (`scripts/generate-seo-pages.mjs`) generating 4,719+ pre-rendered static HTML routes with localized metadata, JSON-LD structured data, and multi-lingual sitemaps.
* **Hosting & CDN**: Vercel with edge rewrites, cache rules, clean URLs, and cron triggers for automated background pipelines.
* **Authentication**: Firebase Auth (Google Sign-In integration).
* **Analytics**: Vercel Analytics, Vercel Speed Insights, Google Tag Manager, Microsoft Clarity.
