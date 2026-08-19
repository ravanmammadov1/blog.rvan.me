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
  readTime: "22 min read",
  tags: ["APCA", "WCAG 2.1", "Color Contrast", "Accessibility", "Design Systems", "Dark Mode", "Typography Legibility"],
  body: [
    createBlock("The Flaw in the 4.5:1 Math", "h2"),
    createBlock("Let me ask you something: have you ever passed a color contrast check in a tool, only to look at the text and think, \"There's no way anyone can comfortably read this\"? For nearly two decades, digital accessibility has relied on a single mathematical formula: the WCAG 2.x relative luminance contrast ratio. We all know the magic numbers. 4.5:1 for normal text. 3:1 for large text. It's burned into the brains of designers worldwide."),
    createBlock("While WCAG 2.1 remains the legally mandated worldwide standard under Section 508 and the European Accessibility Act, visual neuroscientists and accessibility engineers have long recognized its fundamental flaw. The problem is that it measures simple mathematical color distance, not human visual perception. It treats colors as raw hex codes rather than photons hitting the back of a retina."),
    createBlock("The human eye simply does not perceive contrast linearly. Our ability to discern text against a background depends heavily on three interconnected physiological variables that WCAG 2.1 completely ignores:"),
    createBlock("1. Spatial Frequency: This refers to the physical thickness of font glyph strokes at specific viewing distances. A thin font needs more contrast than a thick font to be equally readable."),
    createBlock("2. Light Adaptation & Polarity: Whether dark text sits on a bright surface (positive polarity, like reading a book) or bright text sits on an OLED black background (negative polarity, like dark mode)."),
    createBlock("3. Contextual Weight: Thin light fonts require substantially greater luminance contrast than heavy bold headings to achieve the exact same readability. The math needs to account for weight."),

    createBlock("1. What Is APCA (Advanced Perceptual Contrast Algorithm)?", "h3"),
    createBlock("Enter APCA. The Advanced Perceptual Contrast Algorithm (specifically the 0.98G standard authored by Andrew Somers for the W3C Silver / WCAG 3 working group) is an absolute game-changer. It is a perceptual lightness contrast model grounded in modern psychophysics. Instead of generating a generic, flat ratio from 1:1 to 21:1, APCA computes a signed Lightness Contrast (Lc) value."),
    createBlock("This Lc value ranges from -108 (pure white text on pure black) to +106 (pure black text on pure white). It fundamentally understands how the human eye processes light, edge detection, and typography."),

    createBlock("2. Understanding the Lightness Contrast (Lc) Value", "h3"),
    createBlock("The signed polarity of Lc directly reflects human eye optics. The plus and minus aren't just math symbols; they tell you the biological context of the reading experience:"),
    createBlock("• Positive Lc (+): This indicates dark text on a lighter background (positive polarity / light mode). Human eyes naturally resolve positive polarity text with lower fatigue. Why? Because the bright background causes our pupils to constrict, sharpening the image on our retina much like a small aperture on a camera lens."),
    createBlock("• Negative Lc (-): This indicates light text on a darker background (negative polarity / dark mode). In dark mode, our pupils dilate to let in more light. This dilation increases optical aberrations and text halation (where the text seems to glow and blur), requiring much higher absolute contrast thresholds to remain legible."),

    createBlock("3. The APCA Compliance Hierarchy", "h3"),
    createBlock("Unlike WCAG 2.1's rigid binary pass/fail at 4.5:1, APCA defines nuanced, functional task thresholds. It understands that reading a long blog post is much harder than spotting a massive hero headline."),
    createBlock("• Lc 90+: The gold standard. Preferred for fluent, continuous body text reading (14px–16px regular weight)."),
    createBlock("• Lc 75+: The minimum threshold for body text and critical content. Don't go below this for your main paragraphs."),
    createBlock("• Lc 60+: Acceptable for large headlines (24px+ bold) or secondary subheadings that require less prolonged focus."),
    createBlock("• Lc 45+: Minimum threshold for non-text UI controls, input borders, and active icons. Think buttons and forms."),
    createBlock("• Lc 30+: Minimum for disabled elements or decorative borders. Please, never use this for readable text."),

    createBlock("4. Where WCAG 2.1 Fails in Real Design Systems", "h3"),
    createBlock("Let's look at a real-world example of WCAG 2.1's blind spots. Consider pure blue (#0000FF) on pure black (#000000). WCAG 2.1 gives this pair a passing 2.44:1 ratio for non-text UI. Yet, the human eye's S-cones (our short-wavelength blue receptors) have exceptionally low spatial resolution. Biologically, dark blue text on black is nearly illegible to us. WCAG says it's fine; APCA knows it fails."),
    createBlock("Conversely, look at pure orange (#FFA500) on white (#FFFFFF). This fails WCAG 2.1 AA with a 2.14:1 ratio. But if you make it 32px bold, it is effortlessly readable. APCA correctly resolves both cases by factoring in human spatial frequency and font weight."),

    createBlock("5. Dark Mode Halation & Pure Black Hazards", "h3"),
    createBlock("Here's a common mistake I see constantly in modern UI: placing pure white text (#FFFFFF) on pure OLED black (#000000). Sure, this achieves a maximum WCAG ratio of 21:1, so it must be great, right? Wrong. The extreme contrast causes 'halation'—a glaring blur where photons literally bleed into adjacent photoreceptors in your eye. It physically hurts to read for long periods."),
    createBlock("APCA recommends calibrating dark mode text to a soft off-white (like #E4E4E7) over elevated slate surfaces (#18181B). This maintains an optimal Lc of -75 to -85, ensuring crisp legibility without the painful glare."),

    createBlock("6. How to Use Both Standards Today", "h3"),
    createBlock("So what do we do right now? Legal compliance still requires meeting WCAG 2.1 AA (4.5:1 for body text). However, leading design systems have adopted a smart dual-tier strategy:"),
    createBlock("1. Satisfy WCAG 2.1 AA to establish the legal and structural baseline."),
    createBlock("2. Use APCA 0.98G as your optical quality benchmark to ensure true, human-centric legibility across all font weights and display polarities."),

    createBlock("7. Interactive Tool Integration", "h3"),
    createBlock("Stop guessing your contrast ratios. Test your color palettes and typography scales directly inside our APCA Contrast Matrix & Color Accessibility Checker (/tools/contrast-matrix). It provides a full 2D font size vs. weight compliance matrix, comparative WCAG 2.1 side-by-side math, and live UI specimen previews. See exactly how your users will experience your colors.")
  ],
  body_az: [
    createBlock("4.5:1 Riyaziyyatındakı Əsas Qüsur", "h2"),
    createBlock("Sizə bir sualım var: heç bir alətdə rəng kontrastı testindən keçdiyiniz halda, mətnə baxıb \"Bunu oxumaq qətiyyən mümkün deyil\" demisinizmi? İyirmi ilə yaxındır ki, rəqəmsal əlçatanlıq məhz bu cür tək bir riyazi formulaya əsaslanırdı: WCAG 2.x nisbi parlaqlıq kontrast nisbəti. Əsas mətn üçün 4.5:1, böyük başlıqlar üçün 3:1. Bu rəqəmlər dizaynerlərin beyninə həkk olunub."),
    createBlock("WCAG 2.1 beynəlxalq qanunvericilikdə standart olaraq qalsa da, görmə neyroelmləri və dizayn mühəndisləri onun əsas çatışmazlığını çoxdan sübut ediblər. Problem bundadır ki, o, insan gözünün qavrayışını deyil, yalnız sadə riyazi rəng məsafəsini ölçür. Rəngləri gözümüzə çatan fotonlar kimi deyil, kompüterin anladığı sadə hex kodları kimi qəbul edir."),
    createBlock("İnsan gözü kontrastı xətti şəkildə qavramır. Mətnin oxunaqlılığı WCAG 2.1-in tamamilə nəzərdən qaçırdığı üç əsas fizioloji faktordan asılıdır:"),
    createBlock("1. Məkan Tezliyi (Spatial Frequency): Şrift qliflərinin baxış məsafəsindəki fiziki qalınlığı. İncə bir şriftin oxunaqlı olması üçün qalın şriftə nisbətən daha çox kontrasta ehtiyacı var."),
    createBlock("2. İşıq Uyğunlaşması və Qütblülük (Polarity): Tünd mətnin açıq fonda (müsbət qütb, məsələn kitab oxumaq) yoxsa parlaq mətnin qara fonda (mənfi qütb, yəni qaranlıq rejim) yerləşməsindən asılıdır."),
    createBlock("3. Şrift Çəkisi (Weight): İncə şriftlər eyni oxunaqlılığı təmin etmək üçün qalın başlıqlara nisbətən xeyli daha yüksək kontrast tələb edir."),

    createBlock("1. APCA (Advanced Perceptual Contrast Algorithm) Nədir?", "h3"),
    createBlock("Budur APCA. W3C Silver / WCAG 3 işçi qrupu üçün Andrew Somers tərəfindən hazırlanmış 0.98G alqoritmi əsl inqilabdır. O, müasir psixofizikaya əsaslanan perseptual parlaqlıq modelidir. O, 1:1-dən 21:1-ə qədər olan dar və ümumi nisbət yerinə, işarəli İşıqlıq Kontrastı (Lc) xalını hesablayır."),
    createBlock("Bu Lc xalı -108-dən (saf qara fonda saf ağ mətn) +106-ya (saf ağ fonda saf qara mətn) qədər dəyişir. O, insan gözünün işığı və tipoqrafiyanı necə işlədiyini bioloji səviyyədə anlayır."),

    createBlock("2. Lc Xalının Mahiyyəti və İnsan Biologiyası", "h3"),
    createBlock("Lc dəyərinin önündəki müsbət (+) və mənfi (-) işarələri sadəcə riyaziyyat deyil, insan gözünün optik xüsusiyyətlərini əks etdirir:"),
    createBlock("• Müsbət Lc (+): Açıq fonda tünd mətn (işıqlı rejim). İşıqlı fonda bəbəyimiz daraldığı üçün (kamera linzasındakı kiçik diafraqma kimi) insan gözü bu mətni daha kəskin görür və az yorğunluqla oxuyur."),
    createBlock("• Mənfi Lc (-): Qaranlıq fonda açıq mətn (qaranlıq rejim). Qaranlıqda göz bəbəklərimiz daha çox işıq almaq üçün genişlənir. Bu genişlənmə optik qüsurları və işıq saçılması (halasiya) effektini artırır, buna görə də oxunaqlılığı qorumaq üçün daha yüksək kontrast həddi tələb olunur."),

    createBlock("3. APCA Uyğunluq Hədləri", "h3"),
    createBlock("WCAG 2.1-in \"ya keçdi, ya kəsildi\" deyən sərt 4.5:1 yanaşmasından fərqli olaraq, APCA daha dəqiq funksional hədlər təyin edir. O, başa düşür ki, uzun bir məqaləni oxumaq böyük bir başlığı görməkdən daha çətindir:"),
    createBlock("• Lc 90+: Əsas mütaliə mətni üçün ideal qızıl standart (14px–16px normal çəki)."),
    createBlock("• Lc 75+: Əsas mətn və vacib məzmun üçün minimum tələb. Əsas paraqraflarınız bu həddən aşağı düşməməlidir."),
    createBlock("• Lc 60+: Böyük başlıqlar (24px+ qalın) və diqqət mərkəzində az qalan alt başlıqlar üçün uyğundur."),
    createBlock("• Lc 45+: Düymələr, daxiletmə sahələrinin sərhədləri və aktiv ikonlar üçün minimum hədd."),
    createBlock("• Lc 30+: Yalnız qeyri-aktiv (disabled) elementlər üçün. Lütfən, oxunmalı mətnlər üçün bundan istifadə etməyin."),

    createBlock("4. WCAG 2.1 Real Dizayn Sistemlərində Harada Səhv Edir?", "h3"),
    createBlock("Gəlin, saf qara (#000000) üzərində saf mavi (#0000FF) rənginə baxaq. WCAG 2.1 bu ikili üçün UI elementlərində 2.44:1 keçid xalı verir. Lakin insan gözündəki qısa dalğalı mavi reseptorların (S-cones) qətnaməsi (rezolyusiyası) çox aşağıdır. Bioloji olaraq qara fonda mavi mətni oxumaq demək olar ki, imkansızdır. WCAG buna \"əladır\" deyir, lakin APCA reallığı bilir."),
    createBlock("Əksinə, ağ (#FFFFFF) fonda saf narıncıya (#FFA500) baxaq. Bu, 2.14:1 nisbəti ilə WCAG 2.1-dən keçə bilmir. Ancaq onu 32px və qalın (bold) etsəniz, mükəmməl oxunur. APCA şrift çəkisini nəzərə alaraq hər iki halı doğru qiymətləndirir."),

    createBlock("5. Qaranlıq Rejimdə Halasiya və Saf Qara Təhlükəsi", "h3"),
    createBlock("Müasir UI dizaynlarında ən çox gördüyüm səhv: saf qara (#000000) fonda saf ağ mətn (#FFFFFF) yerləşdirməkdir. Bəli, bu WCAG-də 21:1 maksimum xal verir, amma gözə fiziki zərər verir. Yüksək kontrast 'halasiya' yaradır — fotonlar sözün əsl mənasında qonşu reseptorlara yayılır və mətnin ətrafında bulanıq işıq haləsi yaranır."),
    createBlock("APCA qaranlıq rejimdə açıq boz mətn (#E4E4E7) və tünd qrafit fondan (#18181B) istifadə edərək Lc -75 ilə -85 aralığını saxlamağı tövsiyə edir. Bu, həm kəskinliyi qoruyur, həm də gözü yormur."),

    createBlock("6. Hər İki Standartı Bu Gün Necə Tətbiq Etməli?", "h3"),
    createBlock("Bəs indi nə etməliyik? Hüquqi uyğunluq üçün hələ də WCAG 2.1 AA standartını (əsas mətn üçün 4.5:1) təmin etmək vacibdir. Lakin peşəkar dizayn sistemləri ağıllı iki pilləli strategiyadan istifadə edir:"),
    createBlock("1. Hüquqi baza olaraq WCAG 2.1 AA standartını təmin edin."),
    createBlock("2. Real insan qavrayışını, bütün şrift çəkilərini və ekran qütblərini nəzərə alan əsas keyfiyyət standartı kimi APCA 0.98G-dən istifadə edin."),

    createBlock("7. Canlı Alətlə İnteqrasiya", "h3"),
    createBlock("Kontrast rəqəmlərini təxmin etməyi dayandırın. Rəng palitranızı və şrift miqyasınızı platformamızın APCA Kontrast Matrisi və Rəng Əlçatanlığı Yoxlayıcısında (/tools/contrast-matrix) canlı sınaqdan keçirin. 2D şrift matrisi və WCAG müqayisəli alətləri ilə rənglərinizin istifadəçilər tərəfindən əslində necə görünəcəyini dəqiq görün.")
  ]
};
