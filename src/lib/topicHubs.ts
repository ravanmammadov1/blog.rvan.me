/**
 * TOPIC HUBS REGISTRY
 * 
 * Defines high-value topical pillars interconnecting master editorial essays,
 * interactive flagship tools, and curated design resources.
 */

export interface TopicHubDefinition {
  id: string;
  slug: string;
  name: string;
  name_az: string;
  headline: string;
  headline_az: string;
  description: string;
  description_az: string;
  accentColor: string;
  icon: string;
  seoTitle: string;
  seoTitle_az: string;
  seoDescription: string;
  seoDescription_az: string;
  featuredArticleSlugs: string[];
  toolIds: string[];
  resourceSlugs: { type: "font" | "icon" | "resource"; path: string; label: string; label_az: string }[];
  keyPrinciples: {
    title: string;
    title_az: string;
    description: string;
    description_az: string;
  }[];
}

export const TOPIC_HUBS: TopicHubDefinition[] = [
  {
    id: "typography",
    slug: "typography",
    name: "Typography & Type Systems",
    name_az: "Tipoqrafiya və Şrift Sistemləri",
    headline: "The Science of Fluid Scaling, Font Pairings & Editorial Rhythm",
    headline_az: "Elastik Şrift Miqyası, Şrift Uyğunlaşdırması və Tipoqrafik Ritm",
    description: "Deep research on typographic semantics, mathematical modular scales, CSS clamp() calculation, and variable font engineering for responsive design systems.",
    description_az: "Tipoqrafik semantika, riyazi modul miqyaslar, CSS clamp() hesablamaları və responsiv dizayn sistemləri üçün variativ şrift mühəndisliyi üzrə elmi tədqiqatlar.",
    accentColor: "from-sky-500/20 to-blue-500/5",
    icon: "📐",
    seoTitle: "Typography Systems & Responsive Font Scale Hub — Rvan.me",
    seoTitle_az: "Tipoqrafiya Sistemləri və Elastik Şrift Miqyası Mərkəzi — Rvan.me",
    seoDescription: "Explore responsive typography systems, mathematical type scales, CSS clamp() token generators, and master editorial essays on typographic hierarchy and font psychology.",
    seoDescription_az: "Responsiv tipoqrafiya sistemləri, riyazi şrift miqyasları, CSS clamp() generatorları və tipoqrafik iyerarxiya üzrə elmi məqalələri kəşf edin.",
    featuredArticleSlugs: [
      "guide-responsive-fluid-typography-css-clamp",
      "why-some-fonts-feel-expensive-gotham-typography",
      "why-helvetica-became-the-font-of-corporate-america",
      "why-changing-a-font-changes-brand-personality",
      "why-comic-sans-is-the-most-hated-font-in-history",
    ],
    toolIds: ["typography-scale", "contrast-matrix"],
    resourceSlugs: [
      { type: "font", path: "/fonts/inter", label: "Inter — Engineered for UI", label_az: "Inter — UI üçün Hesablanmış" },
      { type: "font", path: "/fonts/playfair-display", label: "Playfair Display — High Contrast Editorial", label_az: "Playfair Display — Yüksək Kontrastlı Displey" },
      { type: "font", path: "/fonts/fira-code", label: "Fira Code — Monospace with Ligatures", label_az: "Fira Code — Liqaturlu Monospace" }
    ],
    keyPrinciples: [
      {
        title: "Mathematical Ratio Consistency",
        title_az: "Riyazi Nisbət Ardıcıllığı",
        description: "Harmonic type scales (e.g. Major Third 1.25, Perfect Fourth 1.333) eliminate arbitrary sizing decisions across multi-screen layouts.",
        description_az: "Harmonik şrift miqyasları (məs. Böyük Tersiya 1.25, Kvart 1.333) fərqli ekranlarda təsadüfi ölçü seçimini aradan qaldırır."
      },
      {
        title: "Continuous Fluid Interpolation",
        title_az: "Fasiləsiz Elastik İnterpolyasiya",
        description: "CSS clamp() allows text to transition smoothly between minimum and maximum viewport boundaries without abrupt media query jumps.",
        description_az: "CSS clamp() şriftin kəskin media query keçidləri olmadan minimum və maksimum ekran hədləri arasında axıcı böyüməsini təmin edir."
      },
      {
        title: "Spatial Frequency & Legibility",
        title_az: "Fəza Tezliyi və Oxunaqlıq",
        description: "Small body text requires heavier weights and higher lightness contrast than high-visibility display titles.",
        description_az: "Kiçik mətnlər böyük başlıqlara nisbətən daha qalın şrift çəkisi və daha yüksək kontrast tələb edir."
      }
    ]
  },
  {
    id: "design-psychology",
    slug: "design-psychology",
    name: "Design Psychology & Perception",
    name_az: "Dizayn Psixologiyası və Qavrayış",
    headline: "How Cognitive Heuristics and Visual Neuroscience Govern Interaction",
    headline_az: "Koqnitiv Hevristikalar və Vizual Neyroelm İnterfeys Qərarlarını Necə İdarə Edir",
    description: "Scientific exploration of visual hierarchy, Gestalt proximity laws, the Von Restorff isolation effect, cognitive fluency, and color semantics.",
    description_az: "Vizual iyerarxiya, Geştalt yaxınlıq qanunları, Von Restorff fərqlilik effekti, koqnitiv axıcılıq və rəng semantikası üzrə neyroiqtisadi və vizual tədqiqatlar.",
    accentColor: "from-emerald-500/20 to-teal-500/5",
    icon: "🧠",
    seoTitle: "Design Psychology, Perception & Cognitive Heuristics Hub — Rvan.me",
    seoTitle_az: "Dizayn Psixologiyası, Qavrayış və Koqnitiv Prinsiplər Mərkəzi — Rvan.me",
    seoDescription: "Understand the neuroscience of visual attention, eye-tracking patterns, Gestalt grouping, and why human brains process design structures predictably.",
    seoDescription_az: "Vizual diqqətin neyroelmini, baxış trayektoriyalarını, Geştalt qruplaşmasını və insan beyninin dizaynı necə qavradığını öyrənin.",
    featuredArticleSlugs: [
      "visual-hierarchy-framework-web-interfaces",
      "why-eyes-look-at-certain-things-first",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-we-group-things-together-gestalt-proximity",
      "why-the-number-3-appears-everywhere-in-design",
      "why-error-is-red-success-green-links-blue",
    ],
    toolIds: ["contrast-matrix", "typography-scale", "persuasion-analyzer"],
    resourceSlugs: [
      { type: "icon", path: "/resources?category=icons", label: "Lucide Vector Glyphs — Visual Semiotics", label_az: "Lucide Vektor İkonları — Vizual Semiotika" },
      { type: "font", path: "/fonts/outfit", label: "Outfit Geometric Sans — High Fluency", label_az: "Outfit Həndəsi Şrift — Yüksək Axıcılıq" }
    ],
    keyPrinciples: [
      {
        title: "The Von Restorff Isolation Effect",
        title_az: "Von Restorff Fərqlilik Effekti",
        description: "When multiple homogeneous stimuli are presented, the stimulus that differs significantly in color, size, or contrast is encoded first into memory.",
        description_az: "Eyni tipli elementlər arasında rəng, ölçü və ya kontrastla fərqlənən element insan yaddaşında ilk olaraq həkk olunur."
      },
      {
        title: "Gestalt Spatial Proximity",
        title_az: "Geştalt Məkan Yaxınlığı Qanunu",
        description: "Objects placed physically closer together are perceived as belonging to a single semantic unit, overriding color or shape differences.",
        description_az: "Bir-birinə yaxın yerləşdirilən obyektlər rəng və formasından asılı olmayaraq beyin tərəfindən vahid məntiqi qrup kimi qəbul edilir."
      },
      {
        title: "Cognitive Fluency & Processing Ease",
        title_az: "Koqnitiv Axıcılıq və Dərketmə Rahatlığı",
        description: "Interfaces that reduce cognitive friction trigger positive emotional valence and higher user trust.",
        description_az: "Zehni yükü və anlaşılmazlığı azaldan interfeyslər istifadəçidə avtomatik etibar və rahatlıq hissi yaradır."
      }
    ]
  },
  {
    id: "marketing-psychology",
    slug: "marketing-psychology",
    name: "Marketing Psychology & Conversion",
    name_az: "Marketinq Psixologiyası və Konversiya",
    headline: "The Behavioral Economics of Pricing, Scarcity, and High-Impact Copy",
    headline_az: "Qiymət Strategiyası, Qıtlıq və Yüksək Təsirli Mətnlərin Davranış İqtisadiyyatı",
    description: "Empirical strategies in conversion rate optimization, pricing psychology, charm pricing, loss aversion framing, and frictionless call-to-action engineering.",
    description_az: "Konversiya optimallaşdırması, qiymət psixologiyası, sol rəqəm effekti, itkidən qorxma və maneəsiz fəaliyyət düymələrinin qurulması strategiyaları.",
    accentColor: "from-amber-500/20 to-orange-500/5",
    icon: "⚡",
    seoTitle: "Marketing Psychology, Pricing & Conversion Optimization Hub — Rvan.me",
    seoTitle_az: "Marketinq Psixologiyası, Qiymət və Konversiya Mərkəzi — Rvan.me",
    seoDescription: "Master conversion copywriting, psychological pricing models, risk reversal mechanics, and customer-centric value propositions with empirical heuristic tools.",
    seoDescription_az: "Konversiya kopiraytinqi, qiymət modelləri, risk ləğvi və müştəri yönümlü dəyər təkliflərini elmi hevristik alətlərlə öyrənin.",
    featuredArticleSlugs: [
      "guide-cognitive-conversion-copywriting",
      "why-999-feels-cheaper-than-1000-pricing-psychology",
      "why-restaurants-put-expensive-dish-on-menu",
      "why-free-makes-people-buy-zero-price-effect",
      "why-only-3-left-makes-you-panic-buy-scarcity",
      "why-most-popular-works-on-pricing-tables",
    ],
    toolIds: ["persuasion-analyzer", "resume-builder"],
    resourceSlugs: [
      { type: "resource", path: "/tools/persuasion-analyzer", label: "Persuasion Analyzer — Heuristic Audit", label_az: "Persuasiya Analizatoru — Hevristik Audit" },
      { type: "font", path: "/fonts/montserrat", label: "Montserrat — Commercial Landing Sans", label_az: "Montserrat — Kommersiya Səhifələri Şrifti" }
    ],
    keyPrinciples: [
      {
        title: "Left-Digit Bias & Anchor Contrasting",
        title_az: "Sol Rəqəm Meyilliliyi və Lövbər Qiymət",
        description: "Prices ending in .99 change the leftmost digit, causing subconscious magnitude underestimation before analytical computation begins.",
        description_az: ".99 ilə bitən qiymətlər sol rəqəmi dəyişərək beynin qiyməti şüuraltı olaraq daha kiçik qəbul etməsinə səbəb olur."
      },
      {
        title: "Zero-Price Effect & Absolute Friction Removal",
        title_az: "Sıfır Qiymət Effekti və Maneəsiz Dəyər",
        description: "Zero cost eliminates downside risk entirely, multiplying conversion volume far beyond an equivalent marginal discount.",
        description_az: "Pulsuz təklif itki riskini sıfıra endirərək konversiya sayını adi endirimlərdən dəfələrlə çox artırır."
      },
      {
        title: "Explicit Risk Reversal",
        title_az: "Birbaşa Risk Zəmanəti",
        description: "Micro-copy assuring 'No credit card required' or '100% money-back guarantee' overcomes prospect inertia instantly.",
        description_az: "'Kart tələb olunmur' və ya '100% zəmanət' kimi kiçik qeydlər istifadəçinin tərəddüdünü dərhal aradan qaldırır."
      }
    ]
  },
  {
    id: "accessibility",
    slug: "accessibility",
    name: "Accessibility & Inclusive Systems",
    name_az: "Əlçatanlıq və İnklyuziv Dizayn",
    headline: "Perceptual Contrast, Spatial Frequency & Ergonomic Digital Experiences",
    headline_az: "Perseptual Kontrast, Fəza Tezliyi və Ergonomik Rəqəmsal İnterfeyslər",
    description: "Deep technical guides on APCA 0.98G lightness contrast, WCAG 2.1 compliance, dark mode glare reduction, and accessible token architecture.",
    description_az: "APCA 0.98G perseptual kontrastı, WCAG 2.1 uyğunluğu, qaranlıq rejimdə parlaqlıq kompensasiyası və əlçatan dizayn tokenləri üzrə texniki bələdçi.",
    accentColor: "from-purple-500/20 to-indigo-500/5",
    icon: "👁️",
    seoTitle: "Digital Accessibility, APCA Contrast & Inclusive Design Hub — Rvan.me",
    seoTitle_az: "Rəqəmsal Əlçatanlıq, APCA Kontrast və İnklyuziv Dizayn Mərkəzi — Rvan.me",
    seoDescription: "Explore modern color accessibility, the W3C Silver APCA 0.98G standard, typography legibility thresholds, and accessible design system token workflows.",
    seoDescription_az: "Müasir rəng əlçatanlığı, W3C Silver APCA 0.98G standartı, tipoqrafik oxunaqlıq hədləri və əlçatan dizayn sistemi iş axınlarını kəşf edin.",
    featuredArticleSlugs: [
      "apca-vs-wcag-contrast-accessibility-guide",
      "why-error-is-red-success-green-links-blue",
      "why-contrast-makes-designs-impossible-to-ignore-von-restorff",
      "why-modern-websites-all-look-the-same",
    ],
    toolIds: ["contrast-matrix", "typography-scale"],
    resourceSlugs: [
      { type: "resource", path: "/tools/contrast-matrix", label: "APCA Matrix Calculator", label_az: "APCA Kontrast Kalkulyatoru" },
      { type: "font", path: "/fonts/roboto-flex", label: "Roboto Flex — Variable Accessibility Axis", label_az: "Roboto Flex — Variativ Əlçatanlıq Oxları" }
    ],
    keyPrinciples: [
      {
        title: "Perceptual Lightness Contrast (Lc)",
        title_az: "Perseptual İşıqlıq Kontrastı (Lc)",
        description: "Human eye rod/cone cells do not perceive contrast linearly. APCA accounts for spatial frequency and background luminance.",
        description_az: "İnsan gözü kontrastı xətti qəbul etmir. APCA fəza tezliyini və fon işıqlığını nəzərə alaraq real oxunaqlığı hesablayır."
      },
      {
        title: "Polarity Effects in Dark/Light Interfaces",
        title_az: "Açıq və Qaranlıq Rejimdə Polyarlıq Təsiri",
        description: "Dark mode causes light halation (irradiation flare); text on dark surfaces requires higher spatial weight and calibrated Lc.",
        description_az: "Qaranlıq rejimdə işıq şüalanması baş verir; tünd fonda açıq mətn daha qalın şrift çəkisi və xüsusi Lc dərəcəsi tələb edir."
      },
      {
        title: "Deterministic Design Tokens",
        title_az: "Dəqiq Əlçatan Dizayn Tokenləri",
        description: "Semantic color tokens must guarantee WCAG and APCA thresholds programmatically at the system layer.",
        description_az: "Semantik rəng tokenləri WCAG və APCA hədlərini sistem səviyyəsində avtomatik təmin etməlidir."
      }
    ]
  }
];

export function getTopicBySlug(slug: string): TopicHubDefinition | undefined {
  const clean = (slug || "").toLowerCase().trim();
  return TOPIC_HUBS.find((h) => h.slug === clean || h.id === clean);
}

export function getAllTopicHubs(): TopicHubDefinition[] {
  return TOPIC_HUBS;
}
