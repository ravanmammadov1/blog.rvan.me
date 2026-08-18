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

export const GUIDE_APCA_ACCESSIBILITY: BlogPost = {
  _id: "blog-apca-vs-wcag-contrast-accessibility-guide",
  title: "APCA vs. WCAG 2.1: The Definitive Contrast & Accessibility Guide",
  title_az: "APCA və WCAG 2.1: Kontrast və Əlçatanlığın Əsas Bələdçisi",
  slug: { _type: "slug", current: "apca-vs-wcag-contrast-accessibility-guide" },
  slug_az: { _type: "slug", current: "apca-wcag-kontrast-elcatanliq-rehberi" },
  originalSlug: "apca-vs-wcag-contrast-accessibility-guide",
  category: "Accessibility",
  category_az: "Əlçatanlıq",
  featured: true,
  excerpt: "An architectural deep-dive comparing WCAG 2.x relative luminance ratios (4.5:1) with the W3C Silver APCA-0.98G perceptual lightness algorithm: Spatial frequency, font weight, and dark mode polarity.",
  excerpt_az: "WCAG 2.x nisbi parlaqlıq nisbətləri (4.5:1) ilə W3C Silver APCA-0.98G perseptual alqoritminin müqayisəsi: Məkan tezliyi, şrift çəkisi və qaranlıq rejim qütblüyü.",
  coverImage: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-manual-apca" },
    alt: "APCA lightness contrast comparison diagram showing human visual perception versus mathematical luminance ratios",
    url: "/covers/apca-contrast-science-cover.webp",
  },
  publishDate: "2026-08-18",
  readTime: "15 min read",
  tags: ["APCA", "WCAG 2.1", "Color Contrast", "Accessibility", "Design Systems", "Dark Mode", "Typography Legibility"],
  body: [
    createBlock("The Flaw in the 4.5:1 Math", "h2"),
    createBlock("For nearly two decades, digital accessibility has relied on a single mathematical formula: the WCAG 2.x relative luminance contrast ratio (e.g. 4.5:1 for normal text, 3:1 for large text). While WCAG 2.1 remains the legally mandated worldwide standard under Section 508 and the European Accessibility Act, visual neuroscientists and accessibility engineers have long recognized its fundamental flaw: it measures simple mathematical color distance, not human visual perception."),
    createBlock("The human eye does not perceive contrast linearly. Our ability to discern text against a background depends on three interconnected physiological variables:"),
    createBlock("1. Spatial Frequency: The physical thickness of font glyph strokes at specific viewing distances."),
    createBlock("2. Light Adaptation & Polarity: Whether dark text sits on a bright surface (positive polarity) or bright text sits on an OLED black background (negative polarity)."),
    createBlock("3. Contextual Weight: Thin light fonts require substantially greater luminance contrast than heavy bold headings to achieve the same readability."),

    createBlock("1. What Is APCA (Advanced Perceptual Contrast Algorithm)?", "h3"),
    createBlock("APCA (Advanced Perceptual Contrast Algorithm, specifically the 0.98G standard authored by Andrew Somers for the W3C Silver / WCAG 3 working group) is a perceptual lightness contrast model grounded in modern psychophysics. Instead of generating a generic ratio from 1:1 to 21:1, APCA computes a signed Lightness Contrast (Lc) value ranging from -108 (pure white text on pure black) to +106 (pure black text on pure white)."),

    createBlock("2. Understanding the Lightness Contrast (Lc) Value", "h3"),
    createBlock("The signed polarity of Lc directly reflects human eye optics:"),
    createBlock("• Positive Lc (+): Indicates dark text on a lighter background (positive polarity / light mode). Human eyes naturally resolve positive polarity text with lower fatigue due to pupil constriction."),
    createBlock("• Negative Lc (-): Indicates light text on a darker background (negative polarity / dark mode). In dark mode, pupil dilation increases optical aberrations and text halation, requiring higher absolute contrast thresholds."),

    createBlock("3. The APCA Compliance Hierarchy", "h3"),
    createBlock("Unlike WCAG 2.1's binary pass/fail at 4.5:1, APCA defines functional task thresholds:"),
    createBlock("• Lc 90+: Preferred for fluent continuous body text reading (14px–16px regular weight)."),
    createBlock("• Lc 75+: Minimum threshold for body text and critical content."),
    createBlock("• Lc 60+: Acceptable for large headlines (24px+ bold) or secondary subheadings."),
    createBlock("• Lc 45+: Minimum threshold for non-text UI controls, input borders, and active icons."),
    createBlock("• Lc 30+: Minimum for disabled elements or decorative borders (never use for readable text)."),

    createBlock("4. Where WCAG 2.1 Fails in Real Design Systems", "h3"),
    createBlock("Consider pure blue (#0000FF) on pure black (#000000). WCAG 2.1 gives this pair a passing 2.44:1 ratio for non-text UI, yet the human eye's S-cones (short-wavelength blue receptors) have exceptionally low spatial resolution, making dark blue text on black nearly illegible."),
    createBlock("Conversely, pure orange (#FFA500) on white (#FFFFFF) fails WCAG 2.1 AA with a 2.14:1 ratio, even though at 32px bold it is effortlessly readable. APCA correctly resolves both cases by factoring in human spatial frequency."),

    createBlock("5. Dark Mode Halation & Pure Black Hazards", "h3"),
    createBlock("A common mistake in modern UI is placing pure white text (#FFFFFF) on pure OLED black (#000000). While this achieves a maximum WCAG ratio of 21:1, the extreme contrast causes 'halation'—a glaring blur where photons bleed into adjacent photoreceptors. APCA recommends calibrating dark mode text to off-white (#E4E4E7) over elevated slate surfaces (#18181B) to maintain an optimal Lc -75 to -85 without glare."),

    createBlock("6. How to Use Both Standards Today", "h3"),
    createBlock("Legal compliance requires meeting WCAG 2.1 AA (4.5:1 for body text, 3:1 for 18px+ bold). However, leading design systems use a dual-tier strategy:"),
    createBlock("1. Satisfy WCAG 2.1 AA as the legal baseline."),
    createBlock("2. Use APCA 0.98G as the optical quality benchmark to ensure true legibility across all font weights and display polarities."),

    createBlock("7. Interactive Tool Integration", "h3"),
    createBlock("Test your color palettes and typography scales directly inside our APCA Contrast Matrix & Color Accessibility Checker (/tools/contrast-matrix). It provides a full 2D font size vs. weight compliance matrix, comparative WCAG 2.1 side-by-side math, and live UI specimen previews.")
  ],
  body_az: [
    createBlock("4.5:1 Riyaziyyatındakı Əsas Qüsur", "h2"),
    createBlock("İyirmi ilə yaxındır ki, rəqəmsal əlçatanlıq tək bir riyazi formulaya əsaslanırdı: WCAG 2.x nisbi parlaqlıq kontrast nisbəti (məs. əsas mətn üçün 4.5:1, böyük başlıqlar üçün 3:1). WCAG 2.1 beynəlxalq qanunvericilikdə standart olaraq qalsa da, görmə neyroelmləri və dizayn mühəndisləri onun əsas çatışmazlığını sübut etdilər: o, insan gözünün qavrayışını deyil, yalnız sadə riyazi rəng məsafəsini ölçür."),
    createBlock("İnsan gözü kontrastı xətti şəkildə qavramır. Mətnin oxunaqlılığı üç əsas fizioloji faktordan asılıdır:"),
    createBlock("1. Məkan Tezliyi (Spatial Frequency): Şrift qliflərinin baxış məsafəsindəki fiziki qalınlığı."),
    createBlock("2. İşıq Uyğunlaşması və Qütblülük (Polarity): Tünd mətnin açıq fonda (müsbət qütb), yoxsa parlaq mətnin qara fonda (mənfi qütb) yerləşməsi."),
    createBlock("3. Şrift Çəkisi (Weight): İncə şriftlər eyni oxunaqlılığı təmin etmək üçün qalın başlıqlara nisbətən daha yüksək kontrast tələb edir."),

    createBlock("1. APCA Nədir?", "h3"),
    createBlock("APCA (Advanced Perceptual Contrast Algorithm — W3C Silver / WCAG 3 işçi qrupu üçün Andrew Somers tərəfindən hazırlanmış 0.98G alqoritmi) müasir psixofizikaya əsaslanan perseptual parlaqlıq modelidir. O, 1:1-dən 21:1-ə qədər nisbət yerinə, işarəli İşıqlıq Kontrastı (Lc) xalını hesablayır (-108-dən +106-ya qədər)."),

    createBlock("2. Lc Xalının Mahiyyəti", "h3"),
    createBlock("Lc dəyərinin işarəsi insan gözünün optik xüsusiyyətlərini əks etdirir:"),
    createBlock("• Müsbət Lc (+): Açıq fonda tünd mətn (işıqlı rejim). Bəbək daraldığı üçün insan gözü bu mətni daha az yorğunluqla oxuyur."),
    createBlock("• Mənfi Lc (-): Qaranlıq fonda açıq mətn (qaranlıq rejim). Qaranlıqda bəbək genişlənir və işıq saçılması (halasiya) artır, bu səbəbdən daha yüksək kontrast həddi tələb olunur."),

    createBlock("3. APCA Uyğunluq Hədləri", "h3"),
    createBlock("WCAG 2.1-in sadə keçdi/kəsildi yanaşmasından fərqli olaraq, APCA funksional hədlər təyin edir:"),
    createBlock("• Lc 90+: Əsas mütaliə mətni üçün ideal səviyyə (14px–16px normal çəki)."),
    createBlock("• Lc 75+: Əsas mətn və vacib məzmun üçün minimum tələb."),
    createBlock("• Lc 60+: Böyük başlıqlar (24px+ qalın) və alt başlıqlar üçün uyğundur."),
    createBlock("• Lc 45+: Düymələr, daxiletmə sahələrinin sərhədləri və aktiv ikonlar üçün minimum hədd."),
    createBlock("• Lc 30+: Yalnız qeyri-aktiv elementlər və dekorativ xətlər üçün."),

    createBlock("4. Qaranlıq Rejimdə Halasiya və Saf Qara Təhlükəsi", "h3"),
    createBlock("Saf qara fonda (#000000) saf ağ mətn (#FFFFFF) yerləşdirmək WCAG 2.1-də 21:1 xalı versə də, insan gözündə 'halasiya' (işıq yayılması) effekti yaradır və gözü tez yorur. APCA qaranlıq rejimdə açıq boz mətn (#E4E4E7) və tünd qrafit fondan (#18181B) istifadə edərək Lc -75 ilə -85 aralığını saxlamağı tövsiyə edir."),

    createBlock("5. Hər İki Standartı Necə Tətbiq Etməli?", "h3"),
    createBlock("Hüquqi uyğunluq üçün WCAG 2.1 AA standartını (əsas mətn üçün 4.5:1) təmin etmək vacibdir. Lakin müasir dizayn sistemləri iki pilləli strategiyadan istifadə edir: WCAG 2.1 hüquqi baza, APCA 0.98G isə real insan görmə keyfiyyətinin qızıl standartı kimi qəbul edilir."),

    createBlock("6. Canlı Alətlə İnteqrasiya", "h3"),
    createBlock("Rəng palitranızı və şrift miqyasınızı platformamızın APCA Kontrast Matrisi və Rəng Əlçatanlığı Yoxlayıcısında (/tools/contrast-matrix) canlı sınaqdan keçirin. 2D şrift matrisi və WCAG müqayisəli alətləri ilə dəqiq tokenlər əldə edin.")
  ]
};
