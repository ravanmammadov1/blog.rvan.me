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

export const GUIDE_VISUAL_HIERARCHY: BlogPost = {
  _id: "blog-visual-hierarchy-framework-web-interfaces",
  title: "The 3-Second Visual Hierarchy Framework for Modern Web Interfaces",
  title_az: "Müasir Veb İnterfeyslər Üçün 3 Saniyəlik Vizual İyerarxiya Çərçivəsi",
  slug: { _type: "slug", current: "visual-hierarchy-framework-web-interfaces" },
  slug_az: { _type: "slug", current: "veb-interfeyslerde-vizual-iyerarxiya-cercivesi" },
  originalSlug: "visual-hierarchy-framework-web-interfaces",
  category: "Design",
  category_az: "Dizayn",
  featured: true,
  excerpt: "The neuroscience of visual scanning: How scale, Gestalt proximity, luminance contrast, and focal anchors direct user attention across landing pages in under 3 seconds.",
  excerpt_az: "Vizual baxış trayektoriyalarının neyroelmi: Miqyas, Geştalt yaxınlığı, parlaqlıq kontrastı və fokus nöqtələrinin 3 saniyə ərzində istifadəçi diqqətini necə idarə etməsi.",
  coverImage: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-manual-hierarchy" },
    alt: "Visual hierarchy eye-tracking scanpath diagram showing focal anchors and Gestalt chunking on digital layouts",
    url: "https://cdn.sanity.io/images/0lqwkcmg/production/35f291a056702bbc7354aee2e0378a7ab73a9781-1600x1067.jpg",
  },
  publishDate: "2026-08-18",
  readTime: "13 min read",
  tags: ["Visual Hierarchy", "UX Psychology", "Eye Tracking", "Gestalt Principles", "Focal Points", "F-Pattern", "Z-Pattern", "UI Design"],
  body: [
    createBlock("The 50-Millisecond First Impression", "h2"),
    createBlock("Eye-tracking research conducted by visual neuroscience laboratories confirms that human users form an aesthetic and structural judgment of a webpage in approximately 50 milliseconds (0.05 seconds). In the subsequent 3 seconds, their gaze executes rapid pre-attentive fixations: scanning for primary focal anchors, grouping related information, and deciding whether the page is worth cognitive investment."),
    createBlock("When visual hierarchy is weak, every element competes equally for attention, causing cognitive overload. When visual hierarchy is disciplined, the interface effortlessly orchestrates the sequence in which elements are perceived."),

    createBlock("1. The 4 Levers of Visual Dominance", "h3"),
    createBlock("Visual weight in digital UI is controlled by four physical attributes:"),
    createBlock("• Scale (Size): The largest typographic or graphic element is processed first by the retina's foveal vision."),
    createBlock("• Luminance Contrast: High contrast (e.g. bold black text on white or glowing green on dark slate) commands immediate fixation over low-contrast muted tones."),
    createBlock("• Spatial Isolation (Whitespace): An isolated element surrounded by ample negative space commands more salience than a larger element buried in a dense grid."),
    createBlock("• Depth & Layering: Elevation shadows, borders, and glassy backdrops separate interactive focal elements from ambient background textures."),

    createBlock("2. Eye-Scanning Paths: The F-Pattern vs. Z-Pattern", "h3"),
    createBlock("Eye-tracking studies reveal two dominant reading patterns:"),
    createBlock("• The F-Pattern (Text-Dense Pages): Visitors read the first horizontal line, drop down slightly for a shorter horizontal scan, and then scan vertically down the left margin. Place crucial keywords and icons along the left vertical stem."),
    createBlock("• The Z-Pattern (Visual Landing Pages): The gaze moves top-left (Logo) → top-right (Navigation/CTA) → diagonal down-left (Hero Feature/Illustration) → bottom-right (Primary CTA). Designing along this diagonal ensures the primary conversion action is the natural terminal fixation."),

    createBlock("3. Gestalt Grouping: Proximity as Structural Architecture", "h3"),
    createBlock("The Law of Proximity states that objects positioned physically close to each other are perceived as belonging to a unified conceptual group. In UI design, spacing must strictly reflect conceptual relationships:"),
    createBlock("• Related items (e.g. card title and its subtitle) should have small gaps (4px–8px)."),
    createBlock("• Distinct components (e.g. card container and neighboring card) should have larger gaps (24px–32px)."),
    createBlock("• Major layout sections should have substantial padding (80px–120px) to signal cognitive context shifts."),

    createBlock("4. The Rule of the Single Primary Anchor", "h3"),
    createBlock("Every viewport screen must have exactly ONE primary visual anchor. If an interface presents a glowing button, a pulsing notification badge, an animated banner, and a high-contrast modal all at once, visual processing collapses. Subordinate all secondary elements with muted tones, lower weights, or reduced scale."),

    createBlock("5. Typography Hierarchy & Ratio Discipline", "h3"),
    createBlock("Typographic scale is the backbone of hierarchy. Applying harmonic modular scales (like the Major Third 1.25 or Perfect Fourth 1.333) ensures that H1 headlines, H2 subheadings, and body paragraphs maintain an unmistakable visual distinction across both mobile and desktop viewports."),

    createBlock("6. Interactive Ecosystem Integration", "h3"),
    createBlock("Put visual hierarchy into practice:"),
    createBlock("• Calculate harmonious type scales with our Typography Scale & Clamp Calculator (/tools/typography-scale)."),
    createBlock("• Verify contrast compliance with our APCA Contrast Matrix (/tools/contrast-matrix)."),
    createBlock("• Test structured typographic hierarchy on professional CVs with our ATS Resume Builder (/tools/resume-builder).")
  ],
  body_az: [
    createBlock("50 Millisaniyəlik İlk Təəssürat", "h2"),
    createBlock("Görmə neyroelmləri tədqiqatları sübut edir ki, istifadəçi veb səhifə haqqında ilkin struktur və estetik qərarını cəmi 50 millisaniyədə (0.05 saniyə) verir. Növbəti 3 saniyədə isə baxışlar əsas fokus nöqtələrini axtarır, məlumatları qruplaşdırır və səhifədə qalmağa dəyib-dəymədiyini müəyyən edir."),
    createBlock("Vizual iyerarxiya zəif olduqda, bütün elementlər eyni vaxtda diqqət çəkməyə çalışır və beyində koqnitiv yüklənmə yaradır. Nizamlı iyerarxiya isə baxış trayektoriyasını təbii şəkildə idarə edir."),

    createBlock("1. Vizual Hakimiyyətin 4 Əsas Faktoru", "h3"),
    createBlock("İnterfeysdə elementin vizual çəkisi 4 əsas fiziki xüsusiyyətlə müəyyən edilir:"),
    createBlock("• Miqyas (Ölçü): Ən böyük mətn və ya qrafik element gözün ilkin fokusunu qazanır."),
    createBlock("• Parlaqlıq Kontrastı: Yüksək kontrastlı elementlər solğun rənglərdən daha tez diqqət çəkir."),
    createBlock("• Məkan Təcridi (Boşluq): Ətrafında geniş mənfi boşluq olan element daha güclü vurğu yaradır."),
    createBlock("• Dərinlik və Laylar: Kölgələr və şüşə effektləri interaktiv elementləri arxa fondan ayırır."),

    createBlock("2. Baxış Trayektoriyaları: F-Sxem və Z-Sxem", "h3"),
    createBlock("• F-Sxemi (Mətnlə Zəngin Səhifələr): İstifadəçi birinci sətri oxuyur, sonra bir qədər aşağı enərək daha qısa horizontal baxış keçirir və sol kənar boyu şaquli skan edir."),
    createBlock("• Z-Sxemi (Vizual Açılış Səhifələri): Baxış yuxarı sol (Loqo) → yuxarı sağ (Menyu/CTA) → diaqonal aşağı sol (Əsas İllüstrasiya) → aşağı sağ (Əsas Hərəkət Düyməsi) istiqamətində hərəkət edir."),

    createBlock("3. Geştalt Yaxınlıq Qanunu", "h3"),
    createBlock("Bir-birinə yaxın yerləşən obyektlər beyin tərəfindən vahid məntiqi qrup kimi qavranılır. Başlıq və onun alt mətni arasında kiçik məsafə (4px–8px), kartlar arasında orta (24px–32px), əsas bölmələr arasında isə geniş boşluqlar (80px–120px) qoyulmalıdır."),

    createBlock("4. Canlı Alətlərlə İnteqrasiya", "h3"),
    createBlock("Vizual iyerarxiya prinsiplərini platformamızın canlı alətlərində tətbiq edin:"),
    createBlock("• Tipoqrafiya Miqyası və Clamp Kalkulyatoru (/tools/typography-scale) ilə harmonik şrift ölçüləri qurun."),
    createBlock("• APCA Kontrast Matrisi (/tools/contrast-matrix) ilə kontrastı yoxlayın."),
    createBlock("• ATS CV Hazırlayıcı (/tools/resume-builder) ilə peşəkar sənədlərdə iyerarxiyanı sınaqdan keçirin.")
  ]
};
