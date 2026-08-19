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
  readTime: "20 min read",
  tags: ["Fluid Typography", "CSS clamp", "Type Scale", "Design Systems", "Responsive Design", "CSS Tokens", "Web Typography"],
  body: [
    createBlock("The Death of Breakpoint-Driven Typography", "h2"),
    createBlock("Have you ever been reading an article on your phone, rotated it sideways, and watched the headline suddenly jump in size, breaking the layout? For over a decade, responsive web typography was built on a flawed compromise: static font sizes locked safely behind arbitrary CSS media query breakpoints like `@media (min-width: 768px)`. When a visitor stretched their browser even slightly, headings abruptly leaped by 8 pixels. It felt clunky. Between those hard breakpoints, typography remained completely rigid—appearing oversized on small mobile screens and pathetically underwhelming on ultra-wide desktop monitors."),
    createBlock("I remember battling this in the early 2010s. We'd write endless lines of media queries just to wrestle text into submission. But in modern design systems, typography must not step. It must flow continuously like water filling a vessel. Fluid typography uses mathematical linear interpolation wrapped neatly inside the native CSS `clamp()` function. It scales text smoothly across every possible viewport dimension, giving your users a seamless reading experience."),

    createBlock("1. What Exactly Is Fluid Typography?", "h3"),
    createBlock("Think of fluid typography as a technique where your font size scales proportionally and continuously with the viewport width, staying strictly between defined minimum and maximum boundaries. Instead of snapping at distinct device cutoffs, a headline smoothly transitions from a modest 32px on a compact iPhone screen to a commanding 64px on a 4K studio monitor."),
    createBlock("Why does this matter? Because screens are no longer just 'mobile', 'tablet', and 'desktop'. There are folding phones, smart fridges, ultrawide monitors, and split-screen tablets. Designing for specific breakpoints is a losing game. Fluid type ensures that no matter what obscure screen size your user has, the text looks like it was custom-tailored for them."),

    createBlock("2. Anatomy of CSS clamp(): Your New Best Friend", "h3"),
    createBlock("The CSS `clamp()` function is incredibly elegant. It accepts three parameters: `clamp(MIN, PREFERRED, MAX)`. It acts as a set of guardrails for your typography."),
    createBlock("• MIN (Lower Bound): The minimum acceptable font size (e.g., 1.25rem = 20px). The font will never shrink below this threshold, protecting mobile readability. No one wants to squint to read your hero text."),
    createBlock("• PREFERRED (Fluid Value): A dynamic mathematical expression combining a base REM value with a viewport percentage unit (e.g., 0.95rem + 1.25vw). This is the engine of the fluid behavior."),
    createBlock("• MAX (Upper Bound): The maximum acceptable font size (e.g., 2.5rem = 40px). The font will never expand beyond this threshold, preventing layout blowout on massive screens."),

    createBlock("3. The Mathematics of Linear Interpolation (y = mx + b)", "h3"),
    createBlock("Does `y = mx + b` give you high school geometry flashbacks? Don't panic. To calculate the exact preferred value, we use this standard linear interpolation formula. We want a straight line linking our minimum font size to our maximum font size across a specific range of screen widths."),
    createBlock("Slope (m) = (FontSize_max - FontSize_min) / (Viewport_max - Viewport_min)"),
    createBlock("Intersection (b) = FontSize_min - (Slope * Viewport_min)"),
    createBlock("Let's calculate an H1 heading where the minimum size is 32px at a 320px viewport, and the max size is 64px at a 1200px viewport (assuming a standard 16px root font size)."),
    createBlock("1. Slope = (64 - 32) / (1200 - 320) = 32 / 880 ≈ 0.036363. Multiply by 100 to get viewport width units: 3.636vw."),
    createBlock("2. Intersection = 32 - (0.036363 * 320) = 32 - 11.636 = 20.364px. Convert to rem: 20.364 / 16 = 1.2727rem."),
    createBlock("3. Resulting CSS: `font-size: clamp(2rem, 1.2727rem + 3.636vw, 4rem);`"),
    createBlock("Boom! You just wrote a perfect fluid clamp. The math handles the heavy lifting, ensuring perfect scaling without a single media query."),

    createBlock("4. Selecting Harmonious Modular Scales", "h3"),
    createBlock("I see this mistake constantly: designers arbitrarily choosing font sizes. 'Let's make H1 48px, and H2 36px because it looks okay.' Typography hierarchy should never be chosen randomly. A modular scale applies a consistent mathematical ratio across heading levels, creating subconscious harmony. It's the musical theory of design."),
    createBlock("• Major Second (1.125): A subtle, compact scale. Ideal for information-dense dashboards, financial apps, and data-heavy interfaces where screen real estate is precious."),
    createBlock("• Minor Third (1.200): The versatile, balanced standard. If you're building a modern SaaS web application, start here."),
    createBlock("• Major Third (1.250): A classic editorial scale providing crisp, punchy separation between headings and body text. Perfect for blogs like this one."),
    createBlock("• Perfect Fourth (1.333): A high-contrast hierarchy suited for storytelling and content-heavy publication websites. Headings demand attention."),
    createBlock("• Golden Ratio (1.618): The dramatic, high-impact scale. Reserve this for creative studios, portfolio sites, and luxury brand landing pages."),

    createBlock("5. Production CSS Variable Architecture", "h3"),
    createBlock("So, how do we actually manage all these complex clamp functions in a real-world codebase? Hardcoding them into individual classes is a nightmare for maintenance. The cleanest, most professional way to implement fluid typography is via semantic CSS custom properties on the `:root` element. Set them once, use them everywhere."),
    createBlock(":root {\n  --step--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.125rem);\n  --step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.500rem);\n  --step-2:  clamp(1.56rem, 1.38rem + 0.90vw, 2.000rem);\n  --step-3:  clamp(1.95rem, 1.65rem + 1.50vw, 2.750rem);\n  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 3.750rem);\n  --step-5:  clamp(3.05rem, 2.30rem + 3.75vw, 5.000rem);\n}"),
    createBlock("Now, you simply apply `font-size: var(--step-3);` to your H1, and the system handles the rest. This architecture scales brilliantly across large teams and projects."),

    createBlock("6. Accessibility & WCAG Zoom Resilience", "h3"),
    createBlock("I cannot stress this enough: do not use pure viewport units for text. A critical accessibility hazard with viewport units (`vw`) is that pure viewport sizing (e.g., `font-size: 4vw`) entirely disables browser user zoom. Think about visually impaired users who rely on zooming in. WCAG 2.1 Success Criterion 1.4.4 legally requires that text can be magnified to 200% without loss of content or functionality."),
    createBlock("By anchoring the preferred value with a REM component in our clamp (e.g., `1.25rem + 2vw`), browser zoom mechanisms successfully scale the base REM value. The text grows, the user is happy, and you guarantee full WCAG 2.1 AAA compliance. It's a win-win."),

    createBlock("7. Interactive Tool Integration", "h3"),
    createBlock("Let's be honest, solving linear slope equations by hand every time you start a new project gets old fast. That's exactly why we built our internal Typography Scale & Clamp Calculator (/tools/typography-scale). It allows you to select modular scale presets, customize your exact viewport breakpoints, and test live font sizes across a real-time slider. Best of all? It exports ready-to-use CSS Variables or Tailwind tokens with a single click. Go try it out, and stop writing media queries for typography today.")
  ],
  body_az: [
    createBlock("Media Query Əsaslı Tipoqrafiyanın Sonu", "h2"),
    createBlock("Heç telefonda məqalə oxuyarkən ekranı üfüqi çevirəndə başlıqların qəfildən böyüdüyünü və dizaynı darmadağın etdiyini görmüsünüz? On ildən artıq müddətdə responsiv veb tipoqrafiyası məhz bu qüsurlu güzəştə əsaslanırdı: statik şrift ölçüləri `@media (min-width: 768px)` kimi media query breakpoint-lərinin arxasında gizlədilirdi. Ziyarətçi pəncərəni bir qədər böyüdən kimi başlıqlar qəfil 8 piksel tullanırdı. Bu, qətiyyən təbii hiss olunmurdu. Breakpoint-lər arasında isə mətn tamamilə hərəkətsiz qalırdı — kiçik mobil ekranlarda nəhəng, geniş masaüstü monitorlarda isə görünməz dərəcədə kiçik."),
    createBlock("Mən 2010-cu illərin əvvəllərində bu problemlə çox mübarizə aparmışam. Mətnləri qaydaya salmaq üçün onlarla sətir media query yazırdıq. Amma müasir dizayn sistemlərində tipoqrafiya tullanmamalı, su kimi fasiləsiz axmalıdır. Elastik (fluid) tipoqrafiya xətti interpolyasiya riyaziyyatını CSS-in doğma `clamp()` funksiyası ilə birləşdirərək mətnin hər bir ekran ölçüsündə axıcı böyüməsini təmin edir."),

    createBlock("1. Elastik (Fluid) Tipoqrafiya Əslində Nədir?", "h3"),
    createBlock("Elastik tipoqrafiyanı belə təsəvvür edin: şriftinizin ölçüsü təyin edilmiş minimum və maksimum hədlər arasında, ekranın eninə mütənasib olaraq fasiləsiz dəyişir. Mətn cihaz keçidlərində qəfil böyümür. Əvəzində, o, iPhone ekranında 32px-dən 4K monitorda 64px-ə qədər rəvan şəkildə miqyaslanır."),
    createBlock("Bu niyə bu qədər vacibdir? Çünki artıq ekranlar yalnız 'mobil', 'planşet' və 'masaüstü' ilə məhdudlaşmır. Qatlanan telefonlar, ağıllı soyuducular və geniş monitorlar var. Xüsusi ekran ölçüləri üçün dizayn etmək artıq işə yaramır. Elastik tipoqrafiya isə istifadəçinin ekranı nə qədər qeyri-adi olsa da, mətnin sanki xüsusi olaraq o ekran üçün dizayn edildiyi hissini yaradır."),

    createBlock("2. CSS clamp() Funksiyasının Strukturu: Yeni Ən Yaxşı Dostunuz", "h3"),
    createBlock("CSS `clamp()` funksiyası inanılmaz dərəcədə eleqantdır. O, üç parametr qəbul edir: `clamp(MIN, SEÇİLMİŞ, MAX)`. Bu, sizin tipoqrafiyanız üçün qoruyucu sədlər rolunu oynayır."),
    createBlock("• MIN (Aşağı Hədd): Şriftin ala biləcəyi ən kiçik ölçü (məs., 1.25rem = 20px). Şrift heç vaxt bu ölçüdən kiçik olmur. Heç kim telefonda mətni oxumaq üçün gözünü qıymaq istəmir."),
    createBlock("• SEÇİLMİŞ (Dinamik Dəyər): REM vahidi ilə ekran faizinin (vw) xətti cəmi (məs., 0.95rem + 1.25vw). Bu, mətnin elastikliyini təmin edən mühərrikdir."),
    createBlock("• MAX (Yuxarı Hədd): Şriftin ala biləcəyi ən böyük ölçü (məs., 2.5rem = 40px). Ultra-geniş ekranlarda mətnin həddən artıq böyüməsinin və dizaynı pozmasının qarşısını alır."),

    createBlock("3. Xətti İnterpolyasiya Riyaziyyatı (y = mx + b)", "h3"),
    createBlock("`y = mx + b` düsturu sizə məktəb illərini xatırladır? Narahat olmayın. Dəqiq dinamik dəyəri hesablamaq üçün məhz bu xətti interpolyasiya düsturundan istifadə edirik. Biz müəyyən ekran genişlikləri çərçivəsində minimum və maksimum şrift ölçülərini birləşdirən düz xətt yaratmaq istəyirik."),
    createBlock("Meyillilik (m) = (Şrift_max - Şrift_min) / (Ekran_max - Ekran_min)"),
    createBlock("Kəsişmə (b) = Şrift_min - (Meyillilik * Ekran_min)"),
    createBlock("Gəlin, 320px ekranda 32px, 1200px ekranda isə 64px olan H1 başlığı üçün hesablama aparaq (baza ölçüsünü 16px qəbul edərək):"),
    createBlock("1. Meyillilik = (64 - 32) / (1200 - 320) = 32 / 880 ≈ 0.036363. Ekran vahidinə (vw) çevirmək üçün 100-ə vururuq: 3.636vw."),
    createBlock("2. Kəsişmə = 32 - (0.036363 * 320) = 32 - 11.636 = 20.364px. REM-ə çeviririk: 20.364 / 16 = 1.2727rem."),
    createBlock("3. Yekun CSS: `font-size: clamp(2rem, 1.2727rem + 3.636vw, 4rem);`"),
    createBlock("Budur! Siz mükəmməl elastik kod yazdınız. Riyaziyyat bütün ağır işi görür və media query-siz qüsursuz miqyaslanmanı təmin edir."),

    createBlock("4. Harmonik Modul Miqyasların Seçilməsi", "h3"),
    createBlock("Dizaynerlərin şrift ölçülərini təsadüfi seçməsi ən çox rast gəlinən səhvlərdən biridir. Şrift iyerarxiyası heç vaxt təsadüfi olmamalıdır. Modul miqyas başlıqlar arasında ardıcıl riyazi nisbət tətbiq edərək şüuraltı bir harmoniya yaradır. Bu, dizaynın musiqi nəzəriyyəsidir:"),
    createBlock("• Major Second (1.125): Məlumatla zəngin idarəetmə panelləri və analitik tətbiqlər üçün kompakt, yığcam miqyas."),
    createBlock("• Minor Third (1.200): Müasir SaaS veb tətbiqləri üçün ən universal və balanslı standart. İşə burdan başlayın."),
    createBlock("• Major Third (1.250): Başlıqlar və əsas mətn arasında aydın fərq yaradan, bizim bloq kimi səhifələr üçün klassik redaksiya miqyası."),
    createBlock("• Perfect Fourth (1.333): Məzmun yönümlü media və nəşr saytları üçün yüksək kontrastlı, diqqət çəkən iyerarxiya."),
    createBlock("• Golden Ratio (1.618): Kreativ studiyalar və lüks brendlər üçün nəzərdə tutulmuş dramatik və təsirli vizual miqyas."),

    createBlock("5. İstehsalat CSS Dəyişənləri Arxitekturası", "h3"),
    createBlock("Bəs biz bütün bu mürəkkəb `clamp` funksiyalarını real layihədə necə idarə edirik? Onları hər sinfə (class) əllə yazmaq kabusa çevrilə bilər. Müasir layihələrdə elastik tipoqrafiyanı tətbiq etməyin ən professional yolu `:root` selektorunda semantik CSS dəyişənlərindən istifadə etməkdir."),
    createBlock(":root {\n  --step--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);\n  --step-0:  clamp(1.00rem, 0.95rem + 0.25vw, 1.125rem);\n  --step-1:  clamp(1.25rem, 1.15rem + 0.50vw, 1.500rem);\n  --step-2:  clamp(1.56rem, 1.38rem + 0.90vw, 2.000rem);\n  --step-3:  clamp(1.95rem, 1.65rem + 1.50vw, 2.750rem);\n  --step-4:  clamp(2.44rem, 1.95rem + 2.45vw, 3.750rem);\n  --step-5:  clamp(3.05rem, 2.30rem + 3.75vw, 5.000rem);\n}"),
    createBlock("İndi sadəcə H1 üçün `font-size: var(--step-3);` tətbiq edirsiniz və sistem qalanını özü həll edir. Bu yanaşma böyük komandalarda möhtəşəm işləyir."),

    createBlock("6. Əlçatanlıq və Brauzer Miqyaslanması (WCAG)", "h3"),
    createBlock("Bunu xüsusilə vurğulamaq istəyirəm: mətn üçün heç vaxt sırf viewport vahidlərindən istifadə etməyin. Yalnız viewport vahidlərindən (məs., `font-size: 4vw`) istifadə etmək brauzerin böyütmə (zoom) funksiyasını tamamilə sıradan çıxarır. Görmə qüsuru olan və mətni böyütməli olan insanları düşünün. WCAG 2.1 1.4.4 meyarı mətnin strukturunu itirmədən 200%-ə qədər böyüdülə bilməsini qanuni olaraq tələb edir."),
    createBlock("Dinamik ifadəyə REM vahidi əlavə etməklə (məs., `1.25rem + 2vw`), brauzer böyütməsi məhz REM hissəsini hədəf alır. Nəticədə mətn böyüyür, istifadəçi rahat oxuyur və siz tam WCAG AAA uyğunluğu əldə edirsiniz."),

    createBlock("7. Canlı Alətlə İnteqrasiya", "h3"),
    createBlock("Açığını deyim, hər yeni layihədə xətti tənlikləri əllə hesablamaq çox yorucudur. Məhz buna görə biz platformamızın Tipoqrafiya Miqyası və Clamp Kalkulyatorunu (/tools/typography-scale) yaratdıq. Modul miqyasları seçin, qırılma nöqtələrini təyin edin və canlı ekran simulyatorunda sınaqdan keçirin. Ən yaxşısı? Bir kliklə CSS dəyişənlərini və ya Tailwind tokenlərini kopyalayıb layihənizə əlavə edə bilərsiniz. Tipoqrafiya üçün media query yazmağı bu gün dayandırın.")
  ]
};
