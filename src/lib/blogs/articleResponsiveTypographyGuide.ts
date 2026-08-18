import { BlogPost } from "../../types/blog";

function createBlock(text: string, style = "normal", key = Math.random().toString(36).substring(7)) {
  return {
    _key: key,
    _type: "block",
    style,
    markDefs: [],
    children: [{ _key: `${key}-c`, _type: "span", marks: [], text }],
  };
}

export const GUIDE_RESPONSIVE_FLUID_TYPOGRAPHY: BlogPost = {
  _id: "blog-guide-responsive-fluid-typography-css-clamp",
  title: "Complete Guide to Responsive Fluid Typography with CSS clamp()",
  title_az: "CSS clamp() ilə Responsiv Elastik Tipoqrafiyanın Tam Bələdçisi",
  slug: { _type: "slug", current: "guide-responsive-fluid-typography-css-clamp" },
  slug_az: { _type: "slug", current: "elastik-tipoqrafiya-css-clamp-rehberi" },
  originalSlug: "guide-responsive-fluid-typography-css-clamp",
  category: "Design",
  category_az: "Dizayn",
  featured: true,
  excerpt: "The comprehensive architectural guide to modern responsive typography: How linear interpolation equations, modular harmonic scales, and CSS clamp() eliminate breakpoint jumps.",
  excerpt_az: "Müasir elastik tipoqrafiyanın hərtərəfli arxitektura bələdçisi: Xətti interpolyasiya riyaziyyatı, harmonik modul miqyaslar və CSS clamp() ilə media query tullanışlarına son qoyun.",
  coverImage: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-manual-typography" },
    alt: "Responsive fluid typography scale diagram showing smooth linear interpolation across mobile and desktop viewports",
    url: "https://cdn.sanity.io/images/0lqwkcmg/production/35f291a056702bbc7354aee2e0378a7ab73a9781-1600x1067.jpg",
  },
  publishDate: "2026-08-18",
  readTime: "14 min read",
  tags: ["Fluid Typography", "CSS clamp", "Type Scale", "Design Systems", "Responsive Design", "CSS Tokens", "Web Typography"],
  body: [
    createBlock("The Death of Breakpoint-Driven Typography", "h2"),
    createBlock("For over a decade, responsive web typography was built on a flawed compromise: static font sizes locked behind arbitrary CSS media query breakpoints (@media min-width: 768px). When a visitor stretched their browser from 767px to 768px, headings abruptly leaped by 8 pixels. Between breakpoints, typography remained completely rigid—appearing oversized on small mobile screens and underwhelming on ultra-wide desktop monitors."),
    createBlock("In modern design systems, typography must not step. It must flow continuously. Fluid typography uses mathematical linear interpolation wrapped inside the CSS clamp() function to scale text smoothly across every possible viewport dimension."),

    createBlock("1. What Is Fluid Typography?", "h3"),
    createBlock("Fluid typography is a technique where font size scales proportionally and continuously with the viewport width between defined minimum and maximum boundaries. Instead of snapping at distinct device cutoffs, a headline smoothly transitions from 32px on an iPhone screen to 64px on a 4K studio monitor."),

    createBlock("2. Anatomy of CSS clamp()", "h3"),
    createBlock("The CSS clamp() function accepts three parameters: clamp(MIN, PREFERRED, MAX)."),
    createBlock("• MIN (Lower Bound): The minimum acceptable font size (e.g. 1.25rem = 20px). The font will never shrink below this threshold, protecting mobile readability."),
    createBlock("• PREFERRED (Fluid Value): A dynamic mathematical expression combining a base REM value with a viewport percentage unit (e.g. 0.95rem + 1.25vw)."),
    createBlock("• MAX (Upper Bound): The maximum acceptable font size (e.g. 2.5rem = 40px). The font will never expand beyond this threshold, preventing layout blowout on ultra-wide screens."),

    createBlock("3. The Mathematics of Linear Interpolation (y = mx + b)", "h3"),
    createBlock("To calculate the exact preferred value, we use the standard linear interpolation formula from coordinate geometry:"),
    createBlock("Slope (m) = (FontSize_max - FontSize_min) / (Viewport_max - Viewport_min)"),
    createBlock("Intersection (b) = FontSize_min - (Slope * Viewport_min)"),
    createBlock("Let's calculate an H1 heading where min size is 32px at 320px viewport, and max size is 64px at 1200px viewport (assuming 16px root font size):"),
    createBlock("1. Slope = (64 - 32) / (1200 - 320) = 32 / 880 ≈ 0.036363 (or 3.636vw)"),
    createBlock("2. Intersection = 32 - (0.036363 * 320) = 32 - 11.636 = 20.364px = 1.2727rem"),
    createBlock("3. Resulting CSS: font-size: clamp(2rem, 1.2727rem + 3.636vw, 4rem);"),

    createBlock("4. Selecting Harmonious Modular Scales", "h3"),
    createBlock("Typography hierarchy should never be chosen randomly. A modular scale applies a consistent mathematical ratio across heading levels:"),
    createBlock("• Major Second (1.125): Subtle, compact scale ideal for information-dense dashboards and data applications."),
    createBlock("• Minor Third (1.200): Versatile, balanced standard for modern SaaS web applications."),
    createBlock("• Major Third (1.250): Classic editorial scale providing crisp separation between headings and body text."),
    createBlock("• Perfect Fourth (1.333): High-contrast hierarchy suited for storytelling and content-heavy publication websites."),
    createBlock("• Golden Ratio (1.618): Dramatic, high-impact scale for creative studios and luxury brand landing pages."),

    createBlock("5. Production CSS Variable Architecture", "h3"),
    createBlock("The cleanest way to implement fluid typography in modern production codebases is via semantic CSS custom properties on the :root element:"),
    createBlock(":root {\n  --step--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.125rem);\n  --step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.500rem);\n  --step-2:  clamp(1.56rem, 1.38rem + 0.90vw, 2.000rem);\n  --step-3:  clamp(1.95rem, 1.65rem + 1.50vw, 2.750rem);\n  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 3.750rem);\n  --step-5:  clamp(3.05rem, 2.30rem + 3.75vw, 5.000rem);\n}"),

    createBlock("6. Accessibility & WCAG Zoom Resilience", "h3"),
    createBlock("A critical accessibility hazard with viewport units (vw) is that pure viewport sizing (e.g. font-size: 4vw) disables browser user zoom. WCAG 2.1 Success Criterion 1.4.4 requires that text can be magnified to 200% without loss of content or functionality."),
    createBlock("By anchoring the preferred value with a REM component (e.g. 1.25rem + 2vw), browser zoom mechanisms successfully scale the base REM value, guaranteeing full WCAG 2.1 AAA compliance."),

    createBlock("7. Interactive Tool Integration", "h3"),
    createBlock("Instead of solving linear slope equations by hand, use our built-in Typography Scale & Clamp Calculator (/tools/typography-scale). It allows you to select modular scale presets, customize viewport breakpoints, test live font sizes across a real-time slider, and export CSS Variables or Tailwind tokens with one click.")
  ],
  body_az: [
    createBlock("Media Query Əsaslı Tipoqrafiyanın Sonu", "h2"),
    createBlock("On ildən artıq müddətdə responsiv veb tipoqrafiyası media query breakpoint-lərinin (@media min-width: 768px) arxasında saxlanılan statik şrift ölçülərinə əsaslanırdı. Ekran 767px-dən 768px-ə keçdikdə başlıqlar qəfil 8 piksel böyüyürdü. Breakpoint-lər arasında isə mətn tamamilə statik qalırdı."),
    createBlock("Müasir dizayn sistemlərində tipoqrafiya tullanmamalı, fasiləsiz axmalıdır. Elastik (fluid) tipoqrafiya xətti interpolyasiya riyaziyyatını CSS clamp() funksiyası ilə birləşdirərək mətnin hər bir ekran ölçüsündə axıcı böyüməsini təmin edir."),

    createBlock("1. Elastik (Fluid) Tipoqrafiya Nədir?", "h3"),
    createBlock("Elastik tipoqrafiya — şrift ölçüsünün təyin edilmiş minimum və maksimum hədlər arasında ekran eni ilə mütənasib olaraq fasiləsiz dəyişməsi texnikasıdır. Mətn cihaz keçidlərində qəfil böyümür, iPhone ekranında 32px-dən 4K monitorda 64px-ə qədər rəvan şəkildə miqyaslanır."),

    createBlock("2. CSS clamp() Funksiyasının Strukturu", "h3"),
    createBlock("CSS clamp() funksiyası 3 parametr qəbul edir: clamp(MIN, SEÇİLMİŞ, MAX)."),
    createBlock("• MIN (Aşağı Hədd): Şriftin ala biləcəyi ən kiçik ölçü (məs. 1.25rem = 20px). Şrift heç vaxt bu ölçüdən kiçik olmur."),
    createBlock("• SEÇİLMİŞ (Dinamik Dəyər): REM vahidi ilə ekran faizinin (vw) xətti cəmi (məs. 0.95rem + 1.25vw)."),
    createBlock("• MAX (Yuxarı Hədd): Şriftin ala biləcəyi ən böyük ölçü (məs. 2.5rem = 40px). Ultra-geniş ekranlarda mətnin həddən artıq böyüməsinin qarşısını alır."),

    createBlock("3. Xətti İnterpolyasiya Riyaziyyatı (y = mx + b)", "h3"),
    createBlock("Dəqiq dinamik dəyəri hesablamaq üçün koordinat həndəsəsinin xətti tənliyindən istifadə olunur:"),
    createBlock("Meyillilik (m) = (Şrift_max - Şrift_min) / (Ekran_max - Ekran_min)"),
    createBlock("Kəsişmə (b) = Şrift_min - (Meyillilik * Ekran_min)"),
    createBlock("Məsələn, 320px ekranda 32px, 1200px ekranda 64px olan H1 başlığı üçün:"),
    createBlock("1. Meyillilik = (64 - 32) / (1200 - 320) = 32 / 880 ≈ 0.036363 (3.636vw)"),
    createBlock("2. Kəsişmə = 32 - (0.036363 * 320) = 20.364px = 1.2727rem"),
    createBlock("3. Yekun CSS: font-size: clamp(2rem, 1.2727rem + 3.636vw, 4rem);"),

    createBlock("4. Harmonik Modul Miqyasların Seçilməsi", "h3"),
    createBlock("Şrift iyerarxiyası heç vaxt təsadüfi seçilməməlidir. Modul miqyas başlıqlar arasında ardıcıl riyazi nisbət tətbiq edir:"),
    createBlock("• Major Second (1.125): Məlumatla zəngin idarəetmə panelləri və analitik tətbiqlər üçün kompakt miqyas."),
    createBlock("• Minor Third (1.200): Müasir SaaS veb tətbiqləri üçün universal və balanslı standart."),
    createBlock("• Major Third (1.250): Başlıqlar və əsas mətn arasında aydın fərq yaradan klassik redaksiya miqyası."),
    createBlock("• Perfect Fourth (1.333): Məzmun yönümlü media və nəşr saytları üçün yüksək kontrastlı iyerarxiya."),
    createBlock("• Golden Ratio (1.618): Kreativ studiyalar və lüks brendlər üçün dramatik vizual miqyas."),

    createBlock("5. İstehsalat CSS Dəyişənləri Arxitekturası", "h3"),
    createBlock("Müasir layihələrdə elastik tipoqrafiyanı tətbiq etməyin ən təmiz yolu :root selektorunda semantik CSS dəyişənlərindən istifadə etməkdir:"),
    createBlock(":root {\n  --step--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.125rem);\n  --step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.500rem);\n  --step-2:  clamp(1.56rem, 1.38rem + 0.90vw, 2.000rem);\n  --step-3:  clamp(1.95rem, 1.65rem + 1.50vw, 2.750rem);\n  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 3.750rem);\n  --step-5:  clamp(3.05rem, 2.30rem + 3.75vw, 5.000rem);\n}"),

    createBlock("6. Əlçatanlıq və Brauzer Miqyaslanması (WCAG)", "h3"),
    createBlock("Yalnız viewport vahidlərindən (məs. font-size: 4vw) istifadə etmək brauzerin böyütmə (zoom) funksiyasını sıradan çıxarır. WCAG 2.1 1.4.4 meyarı mətnin 200%-ə qədər problemsiz böyüdülə bilməsini tələb edir."),
    createBlock("Dinamik ifadəyə REM vahidi əlavə etməklə (məs. 1.25rem + 2vw), brauzer böyütməsi problemsiz işləyir və tam WCAG AAA uyğunluğu təmin olunur."),

    createBlock("7. Canlı Alətlə İnteqrasiya", "h3"),
    createBlock("Xətti tənlikləri əllə hesablamaq əvəzinə platformamızın Tipoqrafiya Miqyası və Clamp Kalkulyatorundan (/tools/typography-scale) istifadə edin. Modul miqyasları seçin, canlı ekran simulyatorunda sınaqdan keçirin və bir kliklə CSS dəyişənlərini ixrac edin.")
  ]
};
