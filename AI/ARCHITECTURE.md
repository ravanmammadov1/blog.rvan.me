# SYSTEM ARCHITECTURE

## 1. Technology Stack Overview

| Layer | Technologies | Key Packages / Versions | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework & Core** | React 18, TypeScript, Vite | `react@18.3.1`, `typescript@5.9.3`, `vite@6.3.5` | Fast compilation, modern standard client SPA |
| **Routing** | React Router DOM | `react-router-dom@^7.18.1` | SPA navigation with sub-path i18n support (`/` & `/az`) |
| **Styling & Design System** | Tailwind CSS v4, Vanilla CSS Tokens | `@tailwindcss/vite@4.1.12`, `tailwindcss@4.1.12` | CSS custom properties, zero-runtime tokens |
| **Animation & 3D** | Framer Motion, Three.js, R3F | `motion@12.23.24`, `three@^0.170.0`, `@react-three/fiber@^8.18.0` | Atmospheric particle fields, hero visual portrait |
| **CMS & Data Layer** | Sanity.io Headless CMS | `@sanity/client@^7.23.2`, `@sanity/image-url@^2.1.1` | Project ID `0lqwkcmg`, Dataset `production` |
| **Auth & Services** | Firebase Auth, Serverless API | `firebase@^12.17.1`, `@vercel/node@^5.8.27`, `resend@^6.18.1` | Google OAuth, contact submissions, LinkedIn pipeline |
| **PDF & Export Engines** | html2canvas / jspdf / html2pdf | `html2pdf.js`, `jszip@^3.10.1` | Client-side ATS resume PDF and EPS/SVG bundle exports |
| **SEO & Pre-rendering** | Node.js Post-Build SSG | `scripts/generate-seo-pages.mjs` | Multi-route static HTML pre-rendering (4,719+ routes) |
| **Analytics & Privacy** | Vercel Analytics, Speed Insights, GTM, Clarity | `@vercel/analytics`, `@vercel/speed-insights` | Core Web Vitals tracking, heatmaps, GDPR cookie banner |

---

## 2. Directory Structure & Organization

```
ReplicateGitHubPortfolioSite-main/
├── .github/                     # GitHub Actions CI/CD workflows
├── .vercel/                     # Vercel project linkage
├── api/                         # Vercel Serverless Functions
│   ├── comment.ts               # Comment submission & moderation API
│   ├── contact.ts               # Contact form email dispatcher (Resend)
│   ├── sitemap.ts               # Dynamic XML sitemap handler
│   └── linkedin/                # Automated LinkedIn publishing pipeline
│       ├── auth.ts              # OAuth handshake
│       ├── callback.ts          # Token exchange
│       ├── pipeline.ts          # Editorial post queue processor
│       ├── publish.ts           # Direct post transmitter
│       └── status.ts            # Health check & queue status
├── AI/                          # AI Project Control System (Long-term memory)
├── dist/                        # Production build output & pre-rendered HTML
├── public/                      # Static assets (favicons, manifests, robots.txt)
├── scripts/                     # Build, migration, translation, and SEO tooling
│   ├── generate-seo-pages.mjs   # SSG pre-rendering pipeline (4,719+ static HTMLs)
│   ├── buildFontDatabase.mjs    # Google Fonts indexer & metadata compiler
│   ├── syncAllBlogsToSanity.mjs # Two-way synchronization with Sanity CMS
│   ├── uploadAllCoverImagesToSanity.mjs # Asset uploader to Sanity CDN
│   └── translate-all-blogs.mjs  # Azerbaijani localization engine
├── src/
│   ├── app/                     # Application UI layer
│   │   ├── components/          # Reusable UI widgets, headers, footers, tools
│   │   │   ├── blog/            # Blog-specific cards & reading UI
│   │   │   ├── home/            # Modular Home sections (Blog, Tools, Resources)
│   │   │   ├── tools/           # Complex tools (ResumeBuilder, OpenPeepsBuilder)
│   │   │   └── ui/              # Atom components (Button, Modal, Badges)
│   │   ├── context/             # React Contexts (Auth, Theme, Experience, Cookies)
│   │   ├── hooks/               # Custom React hooks (useClarity, useDebounce)
│   │   ├── pages/               # Specific detail pages (FontDetail, ToolDetail, etc.)
│   │   └── App.tsx              # Master routing definition & provider tree
│   ├── lib/                     # Data engines, API clients, and registries
│   │   ├── blogs/               # Local master fallback articles (01-39)
│   │   ├── i18n/                # Language context and translations dictionary
│   │   ├── contentEngine.ts     # Content parsing, dates, reading estimates
│   │   ├── editorialBlogRegistry.ts # O(1) in-memory registry of 39 essays
│   │   ├── fontEngine.ts        # Google Fonts loader and search indexer
│   │   ├── iconEngine.ts        # Lucide icon resolver and metadata engine
│   │   ├── resourceEngine.ts    # Curated resource catalog and filters
│   │   ├── sanityClient.ts      # Live Sanity CMS client & image builder
│   │   └── sanityQueries.ts     # GROQ queries with local fallback resolution
│   ├── services/                # External service wrappers (auth, comments)
│   ├── styles/                  # Global CSS, theme variables, Tailwind layers
│   └── types/                   # TypeScript interfaces (CMS, Blog, Comments)
├── package.json                 # Project configuration and script commands
├── vercel.json                  # Edge routing, clean URLs, redirects, cron jobs
└── vite.config.ts               # Vite build settings, chunking strategy, plugins
```

---

## 3. Data Flow & Rendering Architecture

### Build-Time Pre-rendering (SSG Hybrid)
1. Vite bundles the React single-page application into `dist/`.
2. Post-build script `scripts/generate-seo-pages.mjs` triggers.
3. The script crawls:
   - Static pages (Home, About, Contact, Work, Blog, Tools, Resources, Legal).
   - 39 Editorial Blog essays in both English and Azerbaijani.
   - 1,700+ Google Font detail pages.
   - Resource and Tool detail pages.
4. Generates static `index.html` files for every route containing pre-filled `<title>`, `<meta name="description">`, OpenGraph images, Twitter cards, Canonical tags, alternate `hreflang` links, and JSON-LD structured schemas (`Article`, `BreadcrumbList`, `Organization`).
5. Generates a valid XML `sitemap.xml` with exact `lastmod` timestamps and `xhtml:link` alternates.

### Runtime Hydration & Content Resolution
1. Client browser loads pre-rendered HTML with zero flash of missing metadata.
2. React hydrates the SPA via `react-router-dom`.
3. If Sanity CMS is accessible:
   - Dynamic data (latest articles, site settings, dynamic comments) is fetched live via un-cached GROQ queries (`useCdn: false`).
4. If network or Sanity is unreachable:
   - Queries gracefully fall back to local in-memory registries (`MASTER_EDITORIAL_BLOGS`, `googleFontsCatalog.json`, `portfolioFallback.ts`), ensuring 100% uptime and resilience.

---

## 4. Performance & Bundle Optimization Strategy

* **Manual Vendor Chunking** (`vite.config.ts`):
  - `three-vendor`: Three.js and React Three Fiber (~221 KB gzip)
  - `motion-vendor`: Framer Motion (~45 KB gzip)
  - `sanity-vendor`: Sanity Client and PortableText (~41 KB gzip)
  - `icons-vendor`: Lucide React (~147 KB gzip)
  - `html2pdf`: PDF compilation engine (~285 KB gzip)
  - `googleFontsCatalog`: Lazy-loaded font dataset (~98 KB gzip)
* **Image Optimization**:
  - Sanity Image Pipeline with dynamic WebP/AVIF generation, crop/hotspot preservation, and responsive `srcSet`.
  - Local static assets pre-converted to WebP with multiple resolution breakpoints (400w, 800w, 1200w).
* **Font Loading**:
  - System font stack fallback for immediate text rendering (`font-display: swap`).
  - Google Fonts dynamically loaded on demand via FontFace API in font preview components.
