/**
 * ECOSYSTEM RELATIONSHIP MAP
 * 
 * Defines the structured semantic graph connecting all 39 master editorial essays
 * to relevant interactive tools, curated resources, and complementary articles.
 * Zero orphan content, bidirectional topical clusters, full EN & AZ localization.
 */

export interface ContextualBridge {
  type: "tool" | "resource" | "article";
  path: string;
  badge?: {
    en: string;
    az: string;
  };
  title: {
    en: string;
    az: string;
  };
  description: {
    en: string;
    az: string;
  };
  ctaText?: {
    en: string;
    az: string;
  };
}

export interface ArticleRelationship {
  slug: string;
  cluster: "Design Psychology" | "Typography & Brand Semantics" | "Design History" | "Pricing & Marketing Psychology" | "Creative Culture & AI";
  primaryTopic: {
    en: string;
    az: string;
  };
  toolBridge?: ContextualBridge;
  resourceBridge?: ContextualBridge;
  relatedSlugs: string[];
}

export const ECOSYSTEM_RELATIONSHIPS: Record<string, ArticleRelationship> = {
  // 01. Visual Hierarchy & Eye-Tracking
  "why-eyes-look-at-certain-things-first": {
    slug: "why-eyes-look-at-certain-things-first",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Visual Hierarchy & F-Pattern Scans",
      az: "Vizual İyerarxiya və F-Sxem Skanninqi",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "PRACTICAL APPLICATION", az: "PRAKTİK TƏTBİQ" },
      title: {
        en: "Test Visual Hierarchy on an ATS Resume",
        az: "ATS CV Üzərində Vizual İyerarxiyanı Yoxlayın",
      },
      description: {
        en: "See how strategic typographic hierarchy, margins, and section order guide recruiter eye-tracking in under 6 seconds.",
        az: "Düzgün tipoqrafik iyerarxiya, kənar boşluqlar və bölmə ardıcıllığının rekruterin diqqətini 6 saniyədə necə yönəltdiyini canlı görün.",
      },
      ctaText: { en: "Build ATS Resume", az: "CV Hazırla" },
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/inter",
      badge: { en: "TYPOGRAPHY RESOURCE", az: "TİPOQRAFİYA RESURSU" },
      title: {
        en: "Inter — Engineered for UI Hierarchy",
        az: "Inter — İnterfeys İyerarxiyası Üçün Hazırlanmış Şrift",
      },
      description: {
        en: "Explore Rasmus Andersson's iconic screen typeface, built with a tall x-height to maximize cognitive reading ease.",
        az: "Oxuma rahatlığını maksimuma çatdırmaq üçün hündür x-hündürlüyü ilə hazırlanmış məşhur ekran şriftini kəşf edin.",
      },
      ctaText: { en: "Test Inter Specimen", az: "Inter Şriftini Test Et" },
    },
    relatedSlugs: [
      "why-negative-space-makes-designs-feel-expensive",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-we-group-things-together-gestalt-proximity",
      "psychology-of-google-search-position-bias",
    ],
  },

  // 02. Why Some Fonts Feel Expensive
  "why-some-fonts-feel-expensive-gotham-typography": {
    slug: "why-some-fonts-feel-expensive-gotham-typography",
    cluster: "Typography & Brand Semantics",
    primaryTopic: {
      en: "Font Psychology & Luxury Semiotics",
      az: "Şrift Psixologiyası və Lüks Semiotikası",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/typography-scale",
      badge: { en: "PRACTICAL APPLICATION", az: "PRAKTİK TƏTBİQ" },
      title: {
        en: "Generate Responsive Type Scales & CSS Clamp",
        az: "Elastik Tipoqrafiya Miqyası və CSS Clamp Hesablayın",
      },
      description: {
        en: "Calculate harmonic modular scales and copy exact, production-ready CSS clamp() expressions for fluid headlines and body copy.",
        az: "Harmonik modul miqyaslar hesablayın və başlıqlar ilə mətnlər üçün hazır CSS clamp() kodlarını əldə edin.",
      },
      ctaText: { en: "Launch Type Scale Tool", az: "Tipoqrafiya Alətini Başlat" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=fonts",
      badge: { en: "CURATED CATALOG", az: "SEÇİLMİŞ KATALOQ" },
      title: {
        en: "Browse 2,000+ Curated Open Source Fonts",
        az: "2,000+ Açıq Mənbəli Şrifti Kəşf Edin",
      },
      description: {
        en: "Discover editorial serifs, modern display grotesque, and luxury geometry for your next brand identity.",
        az: "Növbəti brend identikliyiniz üçün redaksion serifləri və müasir displey şriftlərini araşdırın.",
      },
      ctaText: { en: "Explore Fonts", az: "Şriftləri Kəşf Et" },
    },
    relatedSlugs: [
      "why-helvetica-became-the-font-of-corporate-america",
      "why-changing-a-font-changes-brand-personality",
      "why-luxury-brands-use-so-much-empty-space",
      "why-comic-sans-is-the-most-hated-font-in-history",
    ],
  },

  // 03. Notification Icon Bell
  "why-notification-icon-is-a-bell": {
    slug: "why-notification-icon-is-a-bell",
    cluster: "Design History",
    primaryTopic: {
      en: "Iconography & Auditory Metaphors",
      az: "İkonoqrafiya və Səs Metaforaları",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "VECTOR ICON ENGINE", az: "VEKTOR İKON BAZASI" },
      title: {
        en: "Explore 500+ Lucide Vector UI Icons",
        az: "500+ Lucide Vektor UI İkonunu Kəşf Edin",
      },
      description: {
        en: "Browse scalable SVG stroke icons including bells, alarms, badges, and notification indicators.",
        az: "Zənglər, həyəcan siqnalları və bildiriş indikatorları daxil olmaqla təmiz SVG vektor ikonları tapın.",
      },
      ctaText: { en: "Browse UI Icons", az: "İkonları İncələ" },
    },
    relatedSlugs: [
      "why-save-icon-is-still-a-floppy-disk",
      "why-search-is-a-magnifying-glass",
      "why-phone-icon-is-a-1960s-telephone-receiver",
      "why-settings-icon-is-a-mechanical-gear",
    ],
  },

  // 04. FOMO & Loss Aversion
  "fomo-loss-aversion-scarcity-psychology": {
    slug: "fomo-loss-aversion-scarcity-psychology",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Loss Aversion & Conversion Triggers",
      az: "İtki Qorxusu və Konversiya Tətikləyiciləri",
    },
    toolBridge: {
      type: "tool",
      path: "/tools",
      badge: { en: "CREATIVE SUITE", az: "KREATİV ALƏTLƏR" },
      title: {
        en: "Empower Your Digital Product Strategy",
        az: "Rəqəmsal Məhsul Strategiyanızı Gücləndirin",
      },
      description: {
        en: "Explore browser-native tools built to streamline your design, conversion, and marketing workflows.",
        az: "Dizayn, konversiya və marketinq proseslərinizi sürətləndirən brauzerdaxili alətləri kəşf edin.",
      },
      ctaText: { en: "View All Tools", az: "Bütün Alətlərə Bax" },
    },
    relatedSlugs: [
      "why-only-3-left-makes-you-panic-buy-scarcity",
      "why-free-makes-people-buy-zero-price-effect",
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-most-popular-works-on-pricing-tables",
    ],
  },

  // 05. Visual Metaphors in Advertising
  "what-is-visual-metaphor-advertising": {
    slug: "what-is-visual-metaphor-advertising",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Visual Metaphors & Brand Recall",
      az: "Vizual Metaforalar və Yaddaşda Qalma",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "CREATIVE BUILDER", az: "YARADICI QURAŞDIRICI" },
      title: {
        en: "Craft Character-Led Visual Storytelling",
        az: "Personaj Əsaslı Vizual Hekayələr Yaradın",
      },
      description: {
        en: "Mix hand-drawn poses, expressions, and clothing to build memorable illustrative metaphors for campaigns.",
        az: "Kampaniyalarınız üçün unudulmaz illüstrativ metaforalar yaratmaq üçün əl ilə çəkilmiş personajları quraşdırın.",
      },
      ctaText: { en: "Open Character Builder", az: "Personaj Quraşdır" },
    },
    relatedSlugs: [
      "why-some-logos-are-impossible-to-forget",
      "why-minimalist-designs-look-more-expensive",
      "why-ai-images-look-expensive-but-feel-wrong",
      "why-the-number-3-appears-everywhere-in-design",
    ],
  },

  // 06. $999 Left-Digit Effect
  "why-999-feels-cheaper-than-1000-pricing-psychology": {
    slug: "why-999-feels-cheaper-than-1000-pricing-psychology",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Left-Digit Bias & Pricing Anchoring",
      az: "Sol Rəqəm Yanılsaması və Qiymət Lövbəri",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "CAREER ROI", az: "KARYERA DƏYƏRİ" },
      title: {
        en: "Frame High-Impact Accomplishments",
        az: "Nailiyyətlərinizi Yüksək Dəyərlə Təqdim Edin",
      },
      description: {
        en: "Quantify your professional achievements with strong numerical metrics that command higher compensation.",
        az: "Daha yüksək maaş təklifləri cəlb etmək üçün peşəkar nəticələrinizi ölçülə bilən rəqəmlərlə formalaşdırın.",
      },
      ctaText: { en: "Build Resume", az: "CV Hazırla" },
    },
    relatedSlugs: [
      "why-free-makes-people-buy-zero-price-effect",
      "why-restaurants-put-expensive-dish-on-menu",
      "never-tell-a-client-your-price-too-early-value-framing",
      "why-most-popular-works-on-pricing-tables",
    ],
  },

  // 07. Negative Space
  "why-negative-space-makes-designs-feel-expensive": {
    slug: "why-negative-space-makes-designs-feel-expensive",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Negative Space & Premium Aesthetics",
      az: "Boş Sahələr və Premium Estetika",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "LAYOUT BUILDER", az: "STRUKTUR QURAŞDIRICI" },
      title: {
        en: "Apply Clean Spatial Balance to Your Resume",
        az: "CV-nizdə Təmiz Məkan Balansını Tətbiq Edin",
      },
      description: {
        en: "Avoid crowded documents with balanced 24mm margin presets and breathable line spacing tailored for executives.",
        az: "Rəhbər vəzifələr üçün tənzimlənmiş 24mm kənar boşluqları ilə səliqəli və geniş oxunan sənəd hazırlayın.",
      },
      ctaText: { en: "Design Clean Resume", az: "Səliqəli CV Hazırla" },
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/playfair-display",
      badge: { en: "LUXURY SERIF", az: "LÜKS SERİF ŞRİFTİ" },
      title: {
        en: "Playfair Display — High-Contrast Elegance",
        az: "Playfair Display — Yüksək Kontrastlı Zəriflik",
      },
      description: {
        en: "A transitional serif typeface inspired by 18th-century Enlightenment printing, ideal for spacious layouts.",
        az: "Geniş və boşluqlu dizaynlar üçün mükəmməl olan 18-ci əsr maarifçilik dövrü üslublu klassik serif şrifti.",
      },
      ctaText: { en: "Test Playfair Display", az: "Playfair Şriftini Sına" },
    },
    relatedSlugs: [
      "why-luxury-brands-use-so-much-empty-space",
      "why-minimalist-designs-look-more-expensive",
      "why-eyes-look-at-certain-things-first",
      "why-the-number-3-appears-everywhere-in-design",
    ],
  },

  // 08. Error Red, Success Green, Blue Links
  "why-error-is-red-success-green-links-blue": {
    slug: "why-error-is-red-success-green-links-blue",
    cluster: "Design History",
    primaryTopic: {
      en: "Color Semantics & Web Conventions",
      az: "Rəng Semantikası və Veb Qaydaları",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "SEMANTIC ICONS", az: "SEMANTİK İKONLAR" },
      title: {
        en: "Explore Status & Action Vector Icons",
        az: "Status və Fəaliyyət Vektor İkonlarını Kəşf Edin",
      },
      description: {
        en: "Check, alert, cross, and link glyphs designed with crisp optical balance for modern interface states.",
        az: "Müasir interfeys vəziyyətləri üçün dəqiq optik balansla hazırlanmış təsdiq, xəbərdarlıq və keçid nişanları.",
      },
      ctaText: { en: "View Vector Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "psychology-of-dark-mode-oled-black-ui",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-hamburger-menu-has-three-lines",
      "why-delete-action-is-a-trash-can",
    ],
  },

  // 09. Hamburger Menu
  "why-hamburger-menu-has-three-lines": {
    slug: "why-hamburger-menu-has-three-lines",
    cluster: "Design History",
    primaryTopic: {
      en: "Interaction History & Navigation Affordances",
      az: "İnteraksiya Tarixi və Naviqasiya Nişanları",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "NAVIGATION ICONS", az: "NAVİQASİYA İKONLARI" },
      title: {
        en: "Discover UI Navigation & Drawer Glyphs",
        az: "UI Naviqasiya və Menyu İkonlarını Kəşf Edin",
      },
      description: {
        en: "Download lightweight SVG menu, grid, and navigation icons ready for React and Tailwind CSS.",
        az: "React və Tailwind CSS üçün hazır yüngül SVG menyu və naviqasiya ikonlarını yükləyin.",
      },
      ctaText: { en: "Browse Nav Icons", az: "Naviqasiya İkonları" },
    },
    relatedSlugs: [
      "why-save-icon-is-still-a-floppy-disk",
      "why-search-is-a-magnifying-glass",
      "why-notification-icon-is-a-bell",
      "why-settings-icon-is-a-mechanical-gear",
    ],
  },

  // 10. Minimalist Designs Look Expensive
  "why-minimalist-designs-look-more-expensive": {
    slug: "why-minimalist-designs-look-more-expensive",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "Minimalism & Dieter Rams Aesthetics",
      az: "Minimalizm və Diter Rams Estetikası",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "MINIMALIST BUILDER", az: "MİNİMALİST ALƏT" },
      title: {
        en: "Create a Clean Minimalist Resume",
        az: "Təmiz Minimalist CV Hazırlayın",
      },
      description: {
        en: "Eliminate visual clutter. Choose high-clarity typography and structured sections that focus on your work.",
        az: "Lazımsız vizual elementləri kənarlaşdırın. Yalnız fəaliyyətinizə fokuslanan təmiz tipoqrafiya seçin.",
      },
      ctaText: { en: "Create Minimalist CV", az: "Minimalist CV Yarat" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=fonts",
      badge: { en: "MINIMALIST TYPOGRAPHY", az: "MİNİMAL TİPOQRAFİYA" },
      title: {
        en: "Explore Grotesque & Neo-Grotesque Typefaces",
        az: "Qrotesk və Neo-Qrotesk Şriftləri Kəşf Edin",
      },
      description: {
        en: "Discover clean geometric and unadorned sans-serif families that elevate design restraint.",
        az: "Dizaynda təmizliyi və zərifliyi artıran bəzəksiz həndəsi sans-serif şrift ailələrini araşdırın.",
      },
      ctaText: { en: "Browse Grotesques", az: "Qrotesk Şriftlərə Bax" },
    },
    relatedSlugs: [
      "why-negative-space-makes-designs-feel-expensive",
      "why-luxury-brands-use-so-much-empty-space",
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-modern-websites-all-look-the-same",
    ],
  },

  // 11. Number 3 in Design
  "why-the-number-3-appears-everywhere-in-design": {
    slug: "why-the-number-3-appears-everywhere-in-design",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "The Rule of Three & Visual Cadence",
      az: "3 Qaydası və Vizual Ahəng",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "COMPOSITION BUILDER", az: "KOMPOZİSİYA QURAŞDIRICI" },
      title: {
        en: "Create Character Trios & Compositions",
        az: "3-lü Personaj Kompozisiyaları Yaradın",
      },
      description: {
        en: "Combine modular character illustrations into balanced three-figure layouts for web heroes and feature blocks.",
        az: "Veb səhifələr və təqdimatlar üçün balanslı üçlü personaj illüstrasiyaları qurun.",
      },
      ctaText: { en: "Assemble Peeps", az: "Personaj Quraşdır" },
    },
    relatedSlugs: [
      "why-eyes-look-at-certain-things-first",
      "why-we-group-things-together-gestalt-proximity",
      "why-minimalist-designs-look-more-expensive",
      "what-is-visual-metaphor-advertising",
    ],
  },

  // 12. Unforgettable Logos
  "why-some-logos-are-impossible-to-forget": {
    slug: "why-some-logos-are-impossible-to-forget",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "Logo Memorability & Gestalt Closure",
      az: "Loqo Yaddaşda Qalması və Gestalt Qanunu",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "SYMBOL LIBRARY", az: "SİMBOL KİTABXANASI" },
      title: {
        en: "Explore Minimal Glyphs & Iconic Symbols",
        az: "Minimal Qlif və Simvolları Araşdırın",
      },
      description: {
        en: "Study pure geometric marks with high silhouette distinctiveness and visual contrast.",
        az: "Yüksək siluet fərqliliyi və vizual kontrasta malik təmiz həndəsi simvolları təhlil edin.",
      },
      ctaText: { en: "Explore Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "what-is-visual-metaphor-advertising",
      "why-changing-a-font-changes-brand-personality",
      "why-we-group-things-together-gestalt-proximity",
      "why-some-fonts-feel-expensive-gotham-typography",
    ],
  },

  // 13. Expensive Menu Dish
  "why-restaurants-put-expensive-dish-on-menu": {
    slug: "why-restaurants-put-expensive-dish-on-menu",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Decoy Anchoring & Menu Psychology",
      az: "Lövbər Təsiri və Menyu Qiymət Psixologiyası",
    },
    toolBridge: {
      type: "tool",
      path: "/tools",
      badge: { en: "DESIGN STACK", az: "DİZAYN ALƏTLƏRİ" },
      title: {
        en: "Explore Value-Driven Design Utilities",
        az: "Dəyər Əsaslı Dizayn Alətlərini Kəşf Edin",
      },
      description: {
        en: "Use our interactive suite of career, graphic, and design tools to maximize your project output.",
        az: "Layihə nəticələrinizi maksimuma çatdırmaq üçün interaktiv dizayn və karyera alətlərimizdən istifadə edin.",
      },
      ctaText: { en: "Explore Tools Stack", az: "Bütün Alətlərə Bax" },
    },
    relatedSlugs: [
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-most-popular-works-on-pricing-tables",
      "never-tell-a-client-your-price-too-early-value-framing",
      "why-free-makes-people-buy-zero-price-effect",
    ],
  },

  // 14. UI Animation & Physics
  "why-good-animation-feels-natural-ui-physics": {
    slug: "why-good-animation-feels-natural-ui-physics",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "UI Easing Curves & Natural Kinematics",
      az: "UI Easing Əyriləri və Təbii Kinematika",
    },
    resourceBridge: {
      type: "resource",
      path: "/work",
      badge: { en: "PORTFOLIO CASE STUDIES", az: "PORTFOLİO NÜMUNƏLƏRİ" },
      title: {
        en: "View Motion Design & Kinetic Brand Studies",
        az: "Motion Dizayn və Kinetik Brend Layihələrini İncələyin",
      },
      description: {
        en: "Explore automotive 3D motion, fluid UI transitions, and commercial campaign animations.",
        az: "Avtomobil 3D motion sistemləri, axıcı UI animasiyaları və reklam kampaniyalarını kəşf edin.",
      },
      ctaText: { en: "Explore Motion Work", az: "Layihələrə Bax" },
    },
    relatedSlugs: [
      "why-rounded-shapes-feel-friendlier-corner-radius-psychology",
      "why-modern-websites-all-look-the-same",
      "why-eyes-look-at-certain-things-first",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
    ],
  },

  // 15. Zeigarnik Effect
  "why-youre-almost-done-works-zeigarnik-effect": {
    slug: "why-youre-almost-done-works-zeigarnik-effect",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Zeigarnik Effect & Goal Gradient",
      az: "Zeyqarnik Təsiri və Məqsəd Qradiyenti",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "PROGRESSIVE WORKBENCH", az: "MƏRHƏLƏLİ ALƏT" },
      title: {
        en: "Real-Time ATS Resume Score & Progress Bar",
        az: "Canlı ATS CV Xalı və Tərəqqi İndikatoru",
      },
      description: {
        en: "Experience how section completion meters and live ATS scoring turn resume writing into a friction-free workflow.",
        az: "Canlı ATS xal indikatorunun CV yazılışını necə rahat və tamamlanmağa meyilli prosesə çevirdiyini sınaqdan keçirin.",
      },
      ctaText: { en: "Track Resume Score", az: "CV Xalını Yoxla" },
    },
    relatedSlugs: [
      "fomo-loss-aversion-scarcity-psychology",
      "why-eyes-look-at-certain-things-first",
      "why-only-3-left-makes-you-panic-buy-scarcity",
      "psychology-of-google-search-position-bias",
    ],
  },

  // 16. Most Popular on Pricing Tables
  "why-most-popular-works-on-pricing-tables": {
    slug: "why-most-popular-works-on-pricing-tables",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Social Proof & Default Effect in SaaS",
      az: "Sosial Sübut və İlkin Seçim Effekti",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "SOCIAL PROOF CV", az: "TƏSDİQLƏNMİŞ ŞABLON" },
      title: {
        en: "Use Recruiter-Approved Resume Formats",
        az: "Rekruterlərin Təsdiqlədiyi CV Formatlarını Seçin",
      },
      description: {
        en: "Choose the single-column standard template proven across top global tech, finance, and engineering hiring screens.",
        az: "Qlobal texnologiya və mühəndislik vakansiyalarında ən yüksək keçid faizinə malik standart şablonları tətbiq edin.",
      },
      ctaText: { en: "Select Proven Template", az: "Şablonu Seç" },
    },
    relatedSlugs: [
      "why-restaurants-put-expensive-dish-on-menu",
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-small-creators-sell-more-than-celebrities",
      "fomo-loss-aversion-scarcity-psychology",
    ],
  },

  // 17. Small Creators Sell More Than Celebrities
  "why-small-creators-sell-more-than-celebrities": {
    slug: "why-small-creators-sell-more-than-celebrities",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Parasocial Trust & Creator Authenticity",
      az: "Parasosial Etibar və Müəllif Həqiqiliyi",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "CREATOR AVATARS", az: "MÜƏLLİF AVATARLARI" },
      title: {
        en: "Generate Authentic Creator Avatars",
        az: "Orijinal Müəllif Avatarları Yaradın",
      },
      description: {
        en: "Build customized, hand-drawn vector illustrations for your newsletter, personal blog, or social channels.",
        az: "Bloqunuz, bülleteniniz və sosial şəbəkələriniz üçün xüsusi əl ilə çəkilmiş vektor avatarlar qurun.",
      },
      ctaText: { en: "Create Avatar", az: "Avatar Quraşdır" },
    },
    relatedSlugs: [
      "why-personalized-ads-feel-creepy-privacy-paradox",
      "why-some-logos-are-impossible-to-forget",
      "why-changing-a-font-changes-brand-personality",
      "why-ai-writing-sounds-so-similar-rlhf-homogenization",
    ],
  },

  // 18. Save Icon Floppy Disk
  "why-save-icon-is-still-a-floppy-disk": {
    slug: "why-save-icon-is-still-a-floppy-disk",
    cluster: "Design History",
    primaryTopic: {
      en: "Semiotic Inertia & Skeuomorphic Persistence",
      az: "Semiotik İnersiya və Skevomorfik Davamlılıq",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "ICONOGRAPHY SYSTEM", az: "İKONOQRAFİYA SİSTEMİ" },
      title: {
        en: "Explore Modern System & Action Glyphs",
        az: "Müasir Sistem və Əməliyyat İkonlarını Kəşf Edin",
      },
      description: {
        en: "Download clean Lucide icons crafted for crisp rendering across light and dark user interfaces.",
        az: "Açıq və qaranlıq interfeyslərdə mükəmməl görünən təmiz Lucide ikonlarını yükləyin.",
      },
      ctaText: { en: "Browse Icon Collection", az: "İkon Kolleksiyasına Bax" },
    },
    relatedSlugs: [
      "why-notification-icon-is-a-bell",
      "why-search-is-a-magnifying-glass",
      "why-phone-icon-is-a-1960s-telephone-receiver",
      "why-settings-icon-is-a-mechanical-gear",
    ],
  },

  // 19. Zero-Price Effect
  "why-free-makes-people-buy-zero-price-effect": {
    slug: "why-free-makes-people-buy-zero-price-effect",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Zero-Price Effect & Frictionless Value",
      az: "Sıfır Qiymət Effekti və Maneəsiz Dəyər",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "100% FREE TOOL", az: "100% PULSUZ ALƏT" },
      title: {
        en: "Experience Truly Free Professional Tools",
        az: "Tamamilə Pulsuz Peşəkar Alətləri Sınaqdan Keçirin",
      },
      description: {
        en: "No hidden paywalls, watermark extortion, or credit card requirements. Export vector PDFs instantly.",
        az: "Gizli ödənişlər, su nişanı məcburiyyəti və ya qeydiyyat tələbi olmadan dərhal vektor PDF yükləyin.",
      },
      ctaText: { en: "Try Free Resume Builder", az: "Pulsuz CV Yarat" },
    },
    relatedSlugs: [
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "fomo-loss-aversion-scarcity-psychology",
      "why-only-3-left-makes-you-panic-buy-scarcity",
      "why-restaurants-put-expensive-dish-on-menu",
    ],
  },

  // 20. Only 3 Left Scarcity
  "why-only-3-left-makes-you-panic-buy-scarcity": {
    slug: "why-only-3-left-makes-you-panic-buy-scarcity",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Artificial Scarcity & Urgency Triggers",
      az: "Süni Qıtlıq və Təcililik Tətikləyiciləri",
    },
    toolBridge: {
      type: "tool",
      path: "/tools",
      badge: { en: "CREATIVE HUB", az: "KREATİV MƏRKƏZ" },
      title: {
        en: "Access Our Open-Access Designer Stack",
        az: "Açıq Girişli Dizayn Alətlərindən Yararlanın",
      },
      description: {
        en: "Build your visual assets with our un-gated suite of design, illustration, and career tools.",
        az: "Qeydiyyatsız və məhdudiyyətsiz dizayn, illüstrasiya və karyera alətlərimizlə işinizi sürətləndirin.",
      },
      ctaText: { en: "Explore Creative Suite", az: "Alətləri Kəşf Et" },
    },
    relatedSlugs: [
      "fomo-loss-aversion-scarcity-psychology",
      "why-free-makes-people-buy-zero-price-effect",
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-most-popular-works-on-pricing-tables",
    ],
  },

  // 21. Why Modern Websites All Look the Same
  "why-modern-websites-all-look-the-same": {
    slug: "why-modern-websites-all-look-the-same",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "Web Homogenization & Design System Monoculture",
      az: "Veb Dizaynda Eynilik və Dizayn Sistemləri",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "BESPOKE ASSETS", az: "ÖZƏL AKTİVLƏR" },
      title: {
        en: "Break Monotony with Hand-Drawn Characters",
        az: "Əl ilə Çəkilmiş Personajlarla Eyniliyi Qırın",
      },
      description: {
        en: "Ditch generic stock illustration kits. Mix unique facial expressions and hairstyles for authentic visual personality.",
        az: "Standart stok qrafikalardan imtina edin. Saytınıza xarakter qatmaq üçün unikal personajlar qurun.",
      },
      ctaText: { en: "Design Custom Illustrations", az: "İllüstrasiya Quraşdır" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=fonts",
      badge: { en: "DISTINCTIVE FONTS", az: "FƏRQLİ ŞRİFTLƏR" },
      title: {
        en: "Discover Distinctive Variable Typography",
        az: "Fərqli Dəyişən (Variable) Tipoqrafiyanı Kəşf Edin",
      },
      description: {
        en: "Elevate your brand beyond standard sans-serifs with expressive display, serif, and monospace families.",
        az: "Brendinizi standart şriftlərdən fərqləndirmək üçün ifadəli displey və serif şriftləri seçin.",
      },
      ctaText: { en: "Explore Typography", az: "Şriftlərə Bax" },
    },
    relatedSlugs: [
      "why-ai-images-look-expensive-but-feel-wrong",
      "why-minimalist-designs-look-more-expensive",
      "why-helvetica-became-the-font-of-corporate-america",
      "why-good-animation-feels-natural-ui-physics",
    ],
  },

  // 22. Helvetica & Corporate America
  "why-helvetica-became-the-font-of-corporate-america": {
    slug: "why-helvetica-became-the-font-of-corporate-america",
    cluster: "Typography & Brand Semantics",
    primaryTopic: {
      en: "Swiss Modernism & Corporate Neutrality",
      az: "İsveçrə Modernizmi və Korporativ Neytrallıq",
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/inter",
      badge: { en: "MODERN GROTESQUE", az: "MÜASİR QROTESK" },
      title: {
        en: "Inter — The Digital Successor to Neutral Grotesques",
        az: "Inter — Neytral Qrotesklərin Rəqəmsal Varisi",
      },
      description: {
        en: "Discover how Inter continues the Swiss modernist tradition of objective, crystal-clear visual communication on screen.",
        az: "Inter şriftinin ekranda aydın vizual ünsiyyət üçün İsveçrə modernizm ənənəsini necə davam etdirdiyini görün.",
      },
      ctaText: { en: "Test Inter Typography", az: "Inter Şriftini Yoxla" },
    },
    toolBridge: {
      type: "tool",
      path: "/tools/typography-scale",
      badge: { en: "SWISS TYPOGRAPHY UTILITY", az: "İSVEÇRƏ TİPOQRAFİYA ALƏTİ" },
      title: {
        en: "Build a Swiss Modular Type Scale",
        az: "İsveçrə Modul Şrift Miqyası Qurun",
      },
      description: {
        en: "Generate mathematically rigorous, neutral typographic hierarchies with instant CSS clamp() and rem tokens.",
        az: "Riyazi cəhətdən dəqiq və neytral tipoqrafik iyerarxiyaları CSS clamp() və rem vahidləri ilə formalaşdırın.",
      },
      ctaText: { en: "Calculate Scale", az: "Miqyası Hesabla" },
    },
    relatedSlugs: [
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-comic-sans-is-the-most-hated-font-in-history",
      "why-changing-a-font-changes-brand-personality",
      "why-modern-websites-all-look-the-same",
    ],
  },

  // 23. Value Framing & Negotiation
  "never-tell-a-client-your-price-too-early-value-framing": {
    slug: "never-tell-a-client-your-price-too-early-value-framing",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Value Framing & Client Negotiation",
      az: "Dəyər Çərçivəsi və Müştəri Danışıqları",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "EXECUTIVE FRAMING", az: "RƏHBƏR TƏQDİMATI" },
      title: {
        en: "Frame Executive Experience Around High ROI",
        az: "Təcrübənizi Yüksək Gəlirlilik Çərçivəsində Təqdim Edin",
      },
      description: {
        en: "Structure your resume bullet points around strategic business impact and revenue rather than routine duties.",
        az: "CV bəndlərinizi adi vəzifə öhdəlikləri əvəzinə strateji biznes təsiri və gəlir artımı üzərində qurun.",
      },
      ctaText: { en: "Frame Executive Resume", az: "Rəhbər CV-si Quraşdır" },
    },
    relatedSlugs: [
      "why-restaurants-put-expensive-dish-on-menu",
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-small-creators-sell-more-than-celebrities",
      "fomo-loss-aversion-scarcity-psychology",
    ],
  },

  // 24. Personalized Ads Privacy Paradox
  "why-personalized-ads-feel-creepy-privacy-paradox": {
    slug: "why-personalized-ads-feel-creepy-privacy-paradox",
    cluster: "Pricing & Marketing Psychology",
    primaryTopic: {
      en: "Privacy Paradox & Hyper-Targeting",
      az: "Məxfilik Paradoksu və Hədəflənmiş Reklamlar",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "100% PRIVATE CLIENT ENGINE", az: "100% MƏXFİ LOKAL ALƏT" },
      title: {
        en: "Your Data Stays 100% in Your Browser",
        az: "Məlumatlarınız 100% Brauzerinizdə Qalır",
      },
      description: {
        en: "Unlike SaaS resume builders that harvest and sell personal contacts, our generator processes everything locally in browser memory.",
        az: "Məlumat toplayan saytlardan fərqli olaraq, bizim CV generatorumuz bütün prosesi yalnız sizin brauzerinizdə icra edir.",
      },
      ctaText: { en: "Try Private Generator", az: "Məxfi Aləti Sına" },
    },
    relatedSlugs: [
      "why-small-creators-sell-more-than-celebrities",
      "psychology-of-google-search-position-bias",
      "what-is-visual-metaphor-advertising",
      "why-ai-writing-sounds-so-similar-rlhf-homogenization",
    ],
  },

  // 25. Corner Radius Psychology
  "why-rounded-shapes-feel-friendlier-corner-radius-psychology": {
    slug: "why-rounded-shapes-feel-friendlier-corner-radius-psychology",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Corner Radii, Squircles & Tactile Comfort",
      az: "Künc Radiusları, Squircle və Taktil Rahatlıq",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "ORGANIC VECTOR BUILDER", az: "ORQANİK VEKTOR ALƏTİ" },
      title: {
        en: "Mix Soft & Organic Vector Illustrations",
        az: "Yumşaq və Orqanik Vektor İllüstrasiyaları Yaradın",
      },
      description: {
        en: "Assemble friendly, rounded character poses and cheerful expressions that soften interface interactions.",
        az: "İnterfeysinizi daha səmimi etmək üçün yumşaq xətli personaj pozaları və pozitiv ifadələri birləşdirin.",
      },
      ctaText: { en: "Build Friendly Peeps", az: "Personaj Quraşdır" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "ROUNDED VECTOR ICONS", az: "YUVARLAQ İKONLAR" },
      title: {
        en: "Explore Smooth Continuous-Radius Glyphs",
        az: "Dairəvi Radiuslu Vektor İkonları Kəşf Edin",
      },
      description: {
        en: "Browse rounded stroke glyphs from the Lucide system engineered for friendly, touch-friendly UI design.",
        az: "Səmimi və toxunma üçün rahat UI dizaynı üçün hazırlanmış dairəvi xətli Lucide ikonlarını araşdırın.",
      },
      ctaText: { en: "Explore Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "why-good-animation-feels-natural-ui-physics",
      "why-eyes-look-at-certain-things-first",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-minimalist-designs-look-more-expensive",
    ],
  },

  // 26. AI Images Uncanny Valley
  "why-ai-images-look-expensive-but-feel-wrong": {
    slug: "why-ai-images-look-expensive-but-feel-wrong",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "Uncanny Valley & Generative Aesthetics",
      az: "Qeyri-Təbii Təəssürat və Süni İntellekt Qrafikası",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "HUMAN-CRAFTED ART", az: "İNSAN ƏLİ İLƏ ÇƏKİLMİŞ" },
      title: {
        en: "Use Hand-Drawn Art to Counter AI Gloss",
        az: "AI Parıltısına Qarşı Əl İllüstrasiyalarından İstifadə Edin",
      },
      description: {
        en: "Pablo Stanley's human-drawn vector library provides warmth, imperfection, and authenticity that AI prompts lack.",
        az: "Pablo Stenlinin əl işi vektor kitabxanası AI şəkillərində çatışmayan istilik və canlı xarakter bəxş edir.",
      },
      ctaText: { en: "Assemble Human Art", az: "İllüstrasiya Quraşdır" },
    },
    resourceBridge: {
      type: "resource",
      path: "/work",
      badge: { en: "3D & MOTION PORTFOLIO", az: "3D VƏ MOTİON PORTFOLİO" },
      title: {
        en: "Explore Bespoke 3D & Creative Direction",
        az: "Xüsusi 3D və Kreativ Rəhbərlik İşlərinə Baxın",
      },
      description: {
        en: "See how intentional art direction and authentic render lighting create genuine emotional resonance.",
        az: "Düşünülmüş art direktinq və orijinal 3D işıqlandırmanın necə güclü emosional təsir yaratdığını görün.",
      },
      ctaText: { en: "View Creative Work", az: "Layihələri İncələ" },
    },
    relatedSlugs: [
      "why-ai-writing-sounds-so-similar-rlhf-homogenization",
      "why-modern-websites-all-look-the-same",
      "why-some-logos-are-impossible-to-forget",
      "what-is-visual-metaphor-advertising",
    ],
  },

  // 27. Search Magnifying Glass
  "why-search-is-a-magnifying-glass": {
    slug: "why-search-is-a-magnifying-glass",
    cluster: "Design History",
    primaryTopic: {
      en: "Search Affordances & Detective Metaphors",
      az: "Axtarış Nişanı və Detektiv Metaforaları",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "SEARCH ICONS", az: "AXTARIŞ İKONLARI" },
      title: {
        en: "Explore Search & Filter Vector Glyphs",
        az: "Axtarış və Filtr Vektor İkonlarını Kəşf Edin",
      },
      description: {
        en: "Download magnifying glass, zoom, scan, and filter vector icons ready for your search experiences.",
        az: "Axtarış sistemləriniz üçün lupa, böyütmə və filtr vektor ikonlarını endirin.",
      },
      ctaText: { en: "View Search Icons", az: "Axtarış İkonlarına Bax" },
    },
    relatedSlugs: [
      "psychology-of-google-search-position-bias",
      "why-notification-icon-is-a-bell",
      "why-save-icon-is-still-a-floppy-disk",
      "why-settings-icon-is-a-mechanical-gear",
    ],
  },

  // 28. AI Writing RLHF Homogenization
  "why-ai-writing-sounds-so-similar-rlhf-homogenization": {
    slug: "why-ai-writing-sounds-so-similar-rlhf-homogenization",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "RLHF Tone Convergence & Authentic Copywriting",
      az: "RLHF Təkrarçılığı və Orijinal Müəllif Mətni",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "AUTHENTIC CV COPY", az: "ORİJİNAL CV MƏTNİ" },
      title: {
        en: "Write High-Impact Human Career Accomplishments",
        az: "Təsirli və Orijinal Karyera Nailiyyətləri Yazın",
      },
      description: {
        en: "Avoid repetitive AI jargon. Frame your achievements with precise action verbs and concrete engineering metrics.",
        az: "Şablon AI cümlələrindən qaçın. Nailiyyətlərinizi dəqiq fəaliyyət felləri və ölçülə bilən mühəndislik nəticələri ilə yazın.",
      },
      ctaText: { en: "Craft Human Resume", az: "CV-ni Tərtib Et" },
    },
    relatedSlugs: [
      "why-ai-images-look-expensive-but-feel-wrong",
      "why-modern-websites-all-look-the-same",
      "why-small-creators-sell-more-than-celebrities",
      "why-changing-a-font-changes-brand-personality",
    ],
  },

  // 29. Phone Call 1960s Receiver
  "why-phone-icon-is-a-1960s-telephone-receiver": {
    slug: "why-phone-icon-is-a-1960s-telephone-receiver",
    cluster: "Design History",
    primaryTopic: {
      en: "Telephony Iconography & Historic Affordances",
      az: "Telefon İkonoqrafiyası və Tarixi Vərdişlər",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "COMMUNICATION ICONS", az: "ƏLAQƏ İKONLARI" },
      title: {
        en: "Explore Communication & Audio Glyphs",
        az: "Ünsiyyət və Səs İkonlarını Kəşf Edin",
      },
      description: {
        en: "Download telephone, message, mic, and headset icons built for modern mobile and desktop software.",
        az: "Müasir mobil və masaüstü proqramlar üçün hazırlanmış telefon, mesaj və qulaqlıq ikonlarını yükləyin.",
      },
      ctaText: { en: "Browse Communication Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "why-notification-icon-is-a-bell",
      "why-email-is-a-paper-envelope-icon",
      "why-save-icon-is-still-a-floppy-disk",
      "why-delete-action-is-a-trash-can",
    ],
  },

  // 30. Comic Sans
  "why-comic-sans-is-the-most-hated-font-in-history": {
    slug: "why-comic-sans-is-the-most-hated-font-in-history",
    cluster: "Typography & Brand Semantics",
    primaryTopic: {
      en: "Typographic Decorum & Contextual Mismatch",
      az: "Tipoqrafik Etika və Kontekst Uyğunsuzluğu",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=fonts",
      badge: { en: "CURATED TYPOGRAPHY", az: "PEŞƏKAR ŞRİFTLƏR" },
      title: {
        en: "Find Professional Display & Handwriting Fonts",
        az: "Peşəkar Displey və Əl Yazısı Şriftlərini Tapın",
      },
      description: {
        en: "Explore high-quality expressive typefaces that balance playful character with proper typographic proportions.",
        az: "Düzgün tipoqrafik nisbətlərə və səmimi xarakterə malik keyfiyyətli şrift ailələrini kəşf edin.",
      },
      ctaText: { en: "Browse Fonts Catalog", az: "Şrift Kataloquna Bax" },
    },
    toolBridge: {
      type: "tool",
      path: "/tools/open-peeps",
      badge: { en: "PLAYFUL BUILDER", az: "SƏMİMİ QURAŞDIRICI" },
      title: {
        en: "Pair Informal Visuals with Playful Characters",
        az: "Səmimi Vizual Kontenti Peeps İllüstrasiyaları ilə Qurun",
      },
      description: {
        en: "Use expressive modular character avatars for education, onboarding, and informal brand touchpoints.",
        az: "Tədris və qeydiyyat addımları üçün əyləncəli və ifadəli personaj avatarları quraşdırın.",
      },
      ctaText: { en: "Build Playful Avatars", az: "Personaj Yarat" },
    },
    relatedSlugs: [
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-helvetica-became-the-font-of-corporate-america",
      "why-changing-a-font-changes-brand-personality",
      "why-minimalist-designs-look-more-expensive",
    ],
  },

  // 31. Settings Mechanical Gear
  "why-settings-icon-is-a-mechanical-gear": {
    slug: "why-settings-icon-is-a-mechanical-gear",
    cluster: "Design History",
    primaryTopic: {
      en: "Mechanical Metaphors & Configuration UI",
      az: "Mexaniki Metaforalar və Tənzimləmə İnterfeysləri",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "SYSTEM ICONS", az: "SİSTEM İKONLARI" },
      title: {
        en: "Explore Gear, Sliders & Preference Icons",
        az: "Dişli Çarx, Slayder və Tənzimləmə İkonları",
      },
      description: {
        en: "Download clean mechanical and slider icons for system configuration and user account settings.",
        az: "Sistem konfiqurasiyası və istifadəçi tənzimləmələri üçün təmiz vektor ikonları yükləyin.",
      },
      ctaText: { en: "Explore System Icons", az: "Sistem İkonlarına Bax" },
    },
    relatedSlugs: [
      "why-notification-icon-is-a-bell",
      "why-save-icon-is-still-a-floppy-disk",
      "why-search-is-a-magnifying-glass",
      "why-delete-action-is-a-trash-can",
    ],
  },

  // 32. Delete Trash Can
  "why-delete-action-is-a-trash-can": {
    slug: "why-delete-action-is-a-trash-can",
    cluster: "Design History",
    primaryTopic: {
      en: "Destructive Action Safety & Spatial Metaphors",
      az: "Silmə Əməliyyatının Təhlükəsizliyi və Zibil Qutusu Metaforası",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "UTILITY GLYPHS", az: "FƏALİYYƏT İKONLARI" },
      title: {
        en: "Explore Trash, Archive & State Management Icons",
        az: "Silmə, Arxiv və Vəziyyət İkonlarını Kəşf Edin",
      },
      description: {
        en: "Download SVG trash cans, bins, erase, and archive icons designed for clear user interface feedback.",
        az: "Aydın istifadəçi rəyi təmin edən zibil qutusu, silmə və arxivləşdirmə vektor ikonlarını endirin.",
      },
      ctaText: { en: "Browse Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "why-error-is-red-success-green-links-blue",
      "why-save-icon-is-still-a-floppy-disk",
      "why-phone-icon-is-a-1960s-telephone-receiver",
      "why-settings-icon-is-a-mechanical-gear",
    ],
  },

  // 33. Luxury Brands Empty Space
  "why-luxury-brands-use-so-much-empty-space": {
    slug: "why-luxury-brands-use-so-much-empty-space",
    cluster: "Creative Culture & AI",
    primaryTopic: {
      en: "Spatial Inefficiency & Veblen Conspicuous Restraint",
      az: "Məkan İsrafı və Lüks Brendlərin Geniş Boşluq Strategiyası",
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/playfair-display",
      badge: { en: "EDITORIAL TYPOGRAPHY", az: "LÜKS TİPOQRAFİYA" },
      title: {
        en: "Playfair Display — High Fashion & Luxury Editorial",
        az: "Playfair Display — Dəb və Lüks Redaksiya Şrifti",
      },
      description: {
        en: "Experience how classical high-contrast serifs shine when surrounded by generous, unhurried negative space.",
        az: "Geniş boşluqlarla əhatə olunmuş klassik yüksək kontrastlı serif şriftinin necə parladığını görün.",
      },
      ctaText: { en: "Test Luxury Specimen", az: "Şrifti Test Et" },
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "EXECUTIVE CV LAYOUT", az: "RƏHBƏR CV STRUKTURU" },
      title: {
        en: "Apply Executive Whitespace to Your Career Profile",
        az: "Karyera Profilinizə Rəhbər Səviyyəli Boşluq Tətbiq Edin",
      },
      description: {
        en: "Give your achievements breathing room with premium margins and elegant typographic hierarchy.",
        az: "Zərif tipoqrafik iyerarxiya və təmiz kənar boşluqları ilə nailiyyətlərinizə nəfəs alma sahəsi verin.",
      },
      ctaText: { en: "Design Executive Resume", az: "CV Quraşdır" },
    },
    relatedSlugs: [
      "why-negative-space-makes-designs-feel-expensive",
      "why-minimalist-designs-look-more-expensive",
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-eyes-look-at-certain-things-first",
    ],
  },

  // 34. Font Personality & Semiotics
  "why-changing-a-font-changes-brand-personality": {
    slug: "why-changing-a-font-changes-brand-personality",
    cluster: "Typography & Brand Semantics",
    primaryTopic: {
      en: "Typographic Voice & Brand Perception",
      az: "Tipoqrafik Səs və Brend Qavrayışı",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=fonts",
      badge: { en: "TYPOGRAPHY DISCOVERY", az: "ŞRİFT KƏŞFİ" },
      title: {
        en: "Explore 2,000+ Font Families & Live Specimens",
        az: "2,000+ Şrift Ailəsi və Canlı Test Meydançası",
      },
      description: {
        en: "Compare geometric sans, elegant serifs, monospaced tech fonts, and expressive display typography in real-time.",
        az: "Həndəsi sans, zərif serif, texnoloji monospaced və ifadəli displey şriftlərini canlı müqayisə edin.",
      },
      ctaText: { en: "Test Font Personalities", az: "Şriftləri Canlı Sına" },
    },
    toolBridge: {
      type: "tool",
      path: "/tools/typography-scale",
      badge: { en: "TYPOGRAPHY SCALE ENGINE", az: "TİPOQRAFİYA MİQYAS ALƏTİ" },
      title: {
        en: "Test Brand Typography Scales Live",
        az: "Brend Tipoqrafiya Miqyasını Canlı Test Edin",
      },
      description: {
        en: "Switch between modern sans, luxury serifs, and editorial scales with immediate CSS clamp() token generation.",
        az: "Müasir sans, premium serif və redaksion miqyaslar arasında keçid edərək dərhal CSS clamp() dəyişənlərini əldə edin.",
      },
      ctaText: { en: "Test Brand Scale", az: "Brend Miqyasını Sına" },
    },
    relatedSlugs: [
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-helvetica-became-the-font-of-corporate-america",
      "why-comic-sans-is-the-most-hated-font-in-history",
      "why-some-logos-are-impossible-to-forget",
    ],
  },

  // 35. Email Paper Envelope
  "why-email-is-a-paper-envelope-icon": {
    slug: "why-email-is-a-paper-envelope-icon",
    cluster: "Design History",
    primaryTopic: {
      en: "Postal Metaphors & Digital Mail UX",
      az: "Poçt Zərfi Metaforası və Rəqəmsal Məktub UX-i",
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "MAIL ICONS", az: "POÇT İKONLARI" },
      title: {
        en: "Explore Mail, Send & Inbox Vector Glyphs",
        az: "Məktub, Göndərmə və Gələnlər Qutusu İkonları",
      },
      description: {
        en: "Download envelope, paper plane, inbox, and communication icons with consistent stroke weight.",
        az: "Vahid xətt qalınlığı ilə hazırlanmış zərf, kağız təyyarə və gələnlər qutusu vektor ikonlarını endirin.",
      },
      ctaText: { en: "Explore Mail Glyphs", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "why-phone-icon-is-a-1960s-telephone-receiver",
      "why-notification-icon-is-a-bell",
      "why-save-icon-is-still-a-floppy-disk",
      "why-search-is-a-magnifying-glass",
    ],
  },

  // 36. Von Restorff Isolation Effect
  "why-contrast-makes-designs-impossible-to-ignore-von-restorff": {
    slug: "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Von Restorff Isolation Effect & Visual Salience",
      az: "Fon Restorff Təsiri və Vizual Fərqlilik",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "CONTRAST APPLIED", az: "KONTRAST TƏTBİQİ" },
      title: {
        en: "Make Your Key Skills Impossible to Miss",
        az: "Əsas Bacarıqlarınızı Dərhal Nəzərəçarpan Edin",
      },
      description: {
        en: "Use high-contrast visual skill pills and bold typography to make critical career strengths stand out immediately.",
        az: "Yüksək kontrastlı bacarıq nişanları və güclü tipoqrafiya ilə əsas peşəkar üstünlüklərinizi dərhal vurğulayın.",
      },
      ctaText: { en: "Create Standout Resume", az: "Seçilən CV Yarat" },
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/space-grotesk",
      badge: { en: "HIGH-CONTRAST TYPE", az: "YÜKSƏK KONTRASTLI ŞRİFT" },
      title: {
        en: "Space Grotesk — Distinctive Glyph Contrast",
        az: "Space Grotesk — Unikal Hərf Kontrastı",
      },
      description: {
        en: "Explore Florian Karsten's proportional sans-serif based on Colophon Foundry's Space Mono, engineered for maximum standout.",
        az: "Maksimum nəzərə çarpmaq üçün xüsusi hazırlanmış Florian Karstenin məşhur Space Grotesk şriftini kəşf edin.",
      },
      ctaText: { en: "Test Space Grotesk", az: "Space Grotesk-i Sına" },
    },
    relatedSlugs: [
      "why-eyes-look-at-certain-things-first",
      "psychology-of-dark-mode-oled-black-ui",
      "why-error-is-red-success-green-links-blue",
      "why-we-group-things-together-gestalt-proximity",
    ],
  },

  // 37. Dark Mode & OLED Black
  "psychology-of-dark-mode-oled-black-ui": {
    slug: "psychology-of-dark-mode-oled-black-ui",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Dark Mode Ergonomics & Developer Culture",
      az: "Qaranlıq Rejim Erqonomikası və Proqramçı Mədəniyyəti",
    },
    resourceBridge: {
      type: "resource",
      path: "/fonts/fira-code",
      badge: { en: "DEVELOPER MONOSPACE", az: "DEVELOPER ŞRİFTİ" },
      title: {
        en: "Fira Code — Programmers' Monospaced Ligatures",
        az: "Fira Code — Proqramçılar Üçün Liqatur Şrift",
      },
      description: {
        en: "Explore Nikita Prokopov's free monospaced font with programming ligatures for clean, strain-free dark mode coding.",
        az: "Qaranlıq rejimdə göz yormayan və proqramlaşdırma liqaturalarına malik məşhur monospace şrifti sınaqdan keçirin.",
      },
      ctaText: { en: "Test Fira Code", az: "Fira Code-u Sına" },
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "DARK WORKSPACE", az: "QARANLIQ İŞ REJİMİ" },
      title: {
        en: "Build in Dark Mode, Export for High-Contrast Print",
        az: "Qaranlıq Rejimdə Qurun, Çap Üçün Ağ-Qara İxrac Edin",
      },
      description: {
        en: "Work comfortably in dark mode while producing crisp, print-standard monochrome A4 PDF vectors.",
        az: "Qaranlıq rejimdə rahatlıqla işləyin, eyni zamanda printer üçün mükəmməl ağ-qara A4 PDF ixrac edin.",
      },
      ctaText: { en: "Build in Dark Canvas", az: "Qaranlıq Rejimdə CV Yarat" },
    },
    relatedSlugs: [
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-error-is-red-success-green-links-blue",
      "why-eyes-look-at-certain-things-first",
      "why-we-group-things-together-gestalt-proximity",
    ],
  },

  // 38. Gestalt Proximity & Visual Chunking
  "why-we-group-things-together-gestalt-proximity": {
    slug: "why-we-group-things-together-gestalt-proximity",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Gestalt Proximity & Visual Chunking",
      az: "Gestalt Yaxınlıq Qanunu və Məlumat Qruplaşdırılması",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "CHUNKING ENGINE", az: "QRUPLAŞDIRMA SİSTEMİ" },
      title: {
        en: "Group Professional Experience with Gestalt Logic",
        az: "Təcrübənizi Gestalt Qaydası ilə Qruplaşdırın",
      },
      description: {
        en: "Apply spatial proximity between job titles, companies, dates, and bullet lists for effortless cognitive scanning.",
        az: "Vəzifə, şirkət və fəaliyyət bəndləri arasında düzgün məsafə qoyaraq rekruterin dərhal oxumasını təmin edin.",
      },
      ctaText: { en: "Apply Gestalt Layout", az: "Gestalt CV Quraşdır" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources?category=icons",
      badge: { en: "ICON GRIDS", az: "İKON QRİDLƏRİ" },
      title: {
        en: "Explore Structured UI Icon Systems",
        az: "Strukturlaşdırılmış UI İkon Sistemlərini Kəşf Edin",
      },
      description: {
        en: "Discover 24x24 grid-aligned Lucide icons built with consistent padding and bounding box proximity.",
        az: "Vahid 24x24 qrid və balanslı daxili boşluqlarla hazırlanmış Lucide ikonlarını araşdırın.",
      },
      ctaText: { en: "Browse Grid Icons", az: "İkonlara Bax" },
    },
    relatedSlugs: [
      "why-eyes-look-at-certain-things-first",
      "why-negative-space-makes-designs-feel-expensive",
      "why-the-number-3-appears-everywhere-in-design",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
    ],
  },

  // 39. Google Search Position Bias
  "psychology-of-google-search-position-bias": {
    slug: "psychology-of-google-search-position-bias",
    cluster: "Design Psychology",
    primaryTopic: {
      en: "Position Bias & Authority Heuristics in SERP",
      az: "Mövqe Yanılsaması və Axtarışda Mötəbərlik Hevristikası",
    },
    toolBridge: {
      type: "tool",
      path: "/tools/resume-builder",
      badge: { en: "FIRST-ITEM IMPACT", az: "İLK SƏTİR TƏSİRİ" },
      title: {
        en: "Capitalize on Top-Position Bias on Your Resume",
        az: "CV-nizdə İlk Mövqe Üstünlüyündən Yararlanın",
      },
      description: {
        en: "Place your strongest achievement, metric, or technical skill at the very top of each career entry.",
        az: "Mövqe yanılsamasından istifadə edərək ən güclü nəticənizi və bacarığınızı hər bölmənin ən üstündə yerləşdirin.",
      },
      ctaText: { en: "Position Strongest Points", az: "CV-ni Optimallaşdır" },
    },
    resourceBridge: {
      type: "resource",
      path: "/resources",
      badge: { en: "DISCOVERY HUB", az: "KƏŞF MƏRKƏZİ" },
      title: {
        en: "Discover Our Curated Ecosystem of Tools & Assets",
        az: "Alətlər və Resurs Ekosistemimizi Kəşf Edin",
      },
      description: {
        en: "Explore open-source developer utilities, typography specimens, and vector libraries built for creative craft.",
        az: "Dizayner və proqramçılar üçün hazırlanmış açıq mənbəli tipoqrafiya, alətlər və vektor kitabxanalarını araşdırın.",
      },
      ctaText: { en: "Explore Ecosystem", az: "Ekosistemə Bax" },
    },
    relatedSlugs: [
      "why-eyes-look-at-certain-things-first",
      "why-search-is-a-magnifying-glass",
      "why-most-popular-works-on-pricing-tables",
      "why-youre-almost-done-works-zeigarnik-effect",
    ],
  },
};

const AZ_SLUG_TO_EN_MAP: Record<string, string> = {
  "gozler-niye-ilk-baxir": "why-eyes-look-at-certain-things-first",
  "bahali-ve-ucuz-sriftler": "why-some-fonts-feel-expensive-gotham-typography",
  "bildiris-ikonu-niye-zengdir": "why-notification-icon-is-a-bell",
  "fomo-itirmek-qorxusu-psixologiyasi": "fomo-loss-aversion-scarcity-psychology",
  "vizual-metafora-ve-reklamlar": "what-is-visual-metaphor-advertising",
  "sol-reqem-effekti-qiymet-psixologiyasi": "why-999-feels-cheaper-than-1000-pricing-psychology",
  "menfi-bosluq-ve-bahali-dizayn": "why-negative-space-makes-designs-feel-expensive",
  "xeta-qirmizi-ugur-yasil-link-goy": "why-error-is-red-success-green-links-blue",
  "hamburger-menyu-niye-uc-xetdir": "why-hamburger-menu-has-three-lines",
  "minimalist-dizayn-niye-bahali-gorunur": "why-minimalist-designs-look-more-expensive",
  "3-qaydasi-dizaynda-ve-metnde": "why-the-number-3-appears-everywhere-in-design",
  "bezi-loqolar-niye-unudulmur": "why-some-logos-are-impossible-to-forget",
  "restoran-menyu-lovber-qiymet-psixologiyasi": "why-restaurants-put-expensive-dish-on-menu",
  "yaxsi-animasiya-ve-ui-fizikasi": "why-good-animation-feels-natural-ui-physics",
  "zeigarnik-effekti-ve-tamamlama-psixologiyasi": "why-youre-almost-done-works-zeigarnik-effect",
  "en-meshur-nisani-ve-sosial-subut": "why-most-popular-works-on-pricing-tables",
  "kicik-yaradicilar-ve-otentiklik-gucu": "why-small-creators-sell-more-than-celebrities",
  "yadda-saxla-ikonu-niye-diskisdir": "why-save-icon-is-still-a-floppy-disk",
  "pulsuz-sozunun-qeyri-adi-psixologiyasi": "why-free-makes-people-buy-zero-price-effect",
  "mehdud-sayda-qalma-psixologiyasi": "why-only-3-left-makes-you-panic-buy-scarcity",
  "vebsaytlar-niye-eyni-gorunur": "why-modern-websites-all-look-the-same",
  "helvetica-ve-korporativ-amerika": "why-helvetica-became-the-font-of-corporate-america",
  "qiymeti-tez-demeyin-deyer-psixologiyasi": "never-tell-a-client-your-price-too-early-value-framing",
  "ferdi-reklamlar-ve-qorxu-hissi": "why-personalized-ads-feel-creepy-privacy-paradox",
  "dairevi-formalar-ve-kunclerin-psixologiyasi": "why-rounded-shapes-feel-friendlier-corner-radius-psychology",
  "ai-sekilleri-niye-saxta-gorunur": "why-ai-images-look-expensive-but-feel-wrong",
  "axtaris-niye-boyuducu-susedir": "why-search-is-a-magnifying-glass",
  "ai-metnleri-niye-eyni-seslenir": "why-ai-writing-sounds-so-similar-rlhf-homogenization",
  "zeng-ikonu-niye-kohne-destekdir": "why-phone-icon-is-a-1960s-telephone-receiver",
  "comic-sans-niye-en-nifret-edilen-sriftdir": "why-comic-sans-is-the-most-hated-font-in-history",
  "tenzimlemeler-niye-disli-carxdir": "why-settings-icon-is-a-mechanical-gear",
  "silme-niye-zibil-qutusudur": "why-delete-action-is-a-trash-can",
  "luks-brendler-ve-bos-mekan-psixologiyasi": "why-luxury-brands-use-so-much-empty-space",
  "srift-deyisikliyi-ve-brend-xarakteri": "why-changing-a-font-changes-brand-personality",
  "e-poct-niye-kagiz-zerf-ikonudur": "why-email-is-a-paper-envelope-icon",
  "kontrast-ve-von-restorff-effekti": "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
  "qaranliq-rejim-psixologiyasi-oled": "psychology-of-dark-mode-oled-black-ui",
  "gestalt-yaxinliq-qanunu-ve-qruplasma": "why-we-group-things-together-gestalt-proximity",
  "google-axtaris-ve-movqe-psixologiyasi": "psychology-of-google-search-position-bias",
};

/**
 * Retrieve relationship metadata for any article by slug (EN or AZ alias)
 */
export function getEcosystemRelationship(slug: string): ArticleRelationship | null {
  if (!slug) return null;
  const cleanSlug = slug
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim()
    .toLowerCase();

  const resolvedSlug = AZ_SLUG_TO_EN_MAP[cleanSlug] || cleanSlug;
  return ECOSYSTEM_RELATIONSHIPS[resolvedSlug] || null;
}

