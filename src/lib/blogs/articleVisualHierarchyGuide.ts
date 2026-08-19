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
    url: "/covers/visual-hierarchy-3-second-framework-cover.webp",
  },
  publishDate: "2026-08-18",
  readTime: "18 min read",
  tags: ["Visual Hierarchy", "UX Psychology", "Eye Tracking", "Gestalt Principles", "Focal Points", "F-Pattern", "Z-Pattern", "UI Design"],
  body: [
    createBlock("The 50-Millisecond First Impression", "h2"),
    createBlock("Let me paint a picture for you. A user clicks a link and lands on your homepage. How long do you think you have to convince them to stay? Ten seconds? Five? Try 50 milliseconds. Eye-tracking research conducted by visual neuroscience laboratories confirms that human users form a concrete aesthetic and structural judgment of a webpage in approximately 0.05 seconds. It happens faster than a blink."),
    createBlock("In the subsequent 3 seconds, their gaze executes a series of rapid, subconscious pre-attentive fixations. They are scanning for primary focal anchors, grouping related information, and ultimately deciding whether your page is worth the cognitive calories required to read it."),
    createBlock("When visual hierarchy is weak, every single element on the screen competes equally for attention. The logo, the navigation, the headline, the background image, the footer—they all shout at once, causing massive cognitive overload. But when visual hierarchy is disciplined, the interface acts as a silent conductor, effortlessly orchestrating the exact sequence in which elements are perceived."),

    createBlock("1. The 4 Levers of Visual Dominance", "h3"),
    createBlock("How do we control where the eye goes? Visual weight in a digital UI isn't magic; it is controlled by four specific physical attributes:"),
    createBlock("• Scale (Size): This is the most primitive lever. The largest typographic or graphic element on the screen is processed first by the retina's foveal vision. If everything is big, nothing is big. Reserve maximum scale for your single most important message."),
    createBlock("• Luminance Contrast: High contrast commands immediate fixation over low-contrast muted tones. Think bold black text on a stark white background, or a glowing neon green button on dark slate. Our eyes are evolutionarily wired to detect high-contrast edges."),
    createBlock("• Spatial Isolation (Whitespace): This is the designer's secret weapon. An isolated element surrounded by ample negative space commands drastically more salience than a physically larger element buried in a dense grid. Silence makes the note louder."),
    createBlock("• Depth & Layering: Humans live in a 3D world. Elevation shadows, crisp borders, and glassy backdrops separate interactive focal elements from ambient background textures, signaling to the brain: \"I can touch this.\""),

    createBlock("2. Eye-Scanning Paths: The F-Pattern vs. Z-Pattern", "h3"),
    createBlock("We do not read web pages like books. Eye-tracking studies reveal two dominant, instinctual reading patterns that you must design around:"),
    createBlock("• The F-Pattern (Text-Dense Pages): When faced with walls of text (like blogs or documentation), visitors read the first horizontal line, drop down slightly for a shorter horizontal scan, and then furiously scan vertically down the left margin. The lesson? Place crucial keywords, bullet points, and icons along that left vertical stem. Don't hide the good stuff on the right side of a paragraph."),
    createBlock("• The Z-Pattern (Visual Landing Pages): On sparse, highly visual pages, the gaze moves predictably: top-left (usually the Logo) → top-right (Navigation or secondary CTA) → diagonal down-left (Hero Feature or Illustration) → bottom-right (Primary CTA). Designing your layout along this diagonal ensures the primary conversion action is the natural terminal point of the user's scan."),

    createBlock("3. Gestalt Grouping: Proximity as Structural Architecture", "h3"),
    createBlock("The human brain is an aggressive pattern-matching machine. The Gestalt Law of Proximity states that objects positioned physically close to each other are perceived as belonging to a unified conceptual group. In UI design, your spacing must strictly reflect conceptual relationships. It's not just \"padding\"; it's meaning."),
    createBlock("• Related items (e.g., a card title and its subtitle) should have small gaps (4px–8px). They are tightly bound in meaning."),
    createBlock("• Distinct components (e.g., a card container and its neighboring card) should have larger gaps (24px–32px). They are peers, but separate."),
    createBlock("• Major layout sections (e.g., transitioning from 'Features' to 'Pricing') must have substantial padding (80px–120px) to signal a hard cognitive context shift. Give the brain a moment to breathe."),

    createBlock("4. The Rule of the Single Primary Anchor", "h3"),
    createBlock("This is the rule most junior designers break. Every viewport screen must have exactly ONE primary visual anchor. If an interface presents a glowing primary button, a pulsing red notification badge, an animated banner ad, and a high-contrast modal window all at the exact same time, visual processing collapses. The user feels overwhelmed and leaves."),
    createBlock("You must make choices. Subordinate all secondary elements with muted tones, lower weights, or reduced scale. Let the hero be the hero."),

    createBlock("5. Typography Hierarchy & Ratio Discipline", "h3"),
    createBlock("Typographic scale is the absolute backbone of visual hierarchy. Applying harmonic modular scales (like the Major Third 1.25 or Perfect Fourth 1.333) ensures that your H1 headlines, H2 subheadings, and body paragraphs maintain an unmistakable visual distinction across both mobile and desktop viewports. When typographic hierarchy is mathematically sound, users can scan the structural skeleton of your page without reading a single word."),

    createBlock("6. Interactive Ecosystem Integration", "h3"),
    createBlock("Reading about visual hierarchy is one thing; putting it into practice is another. Here is how you can start today:"),
    createBlock("• Calculate harmonious type scales instantly with our Typography Scale & Clamp Calculator (/tools/typography-scale)."),
    createBlock("• Verify that your focal elements have enough punch with our APCA Contrast Matrix (/tools/contrast-matrix)."),
    createBlock("• Test structured typographic hierarchy on professional documents with our ATS Resume Builder (/tools/resume-builder). Stop guessing and start designing with intent.")
  ],
  body_az: [
    createBlock("50 Millisaniyəlik İlk Təəssürat", "h2"),
    createBlock("Gəlin, sizə bir mənzərə canlandırım. İstifadəçi linkə klikləyir və sizin saytınıza daxil olur. Sizcə, onu saytda saxlamaq üçün nə qədər vaxtınız var? On saniyə? Beş? Cəmi 50 millisaniyə. Görmə neyroelmləri tədqiqatları sübut edir ki, istifadəçi veb səhifə haqqında ilkin struktur və estetik qərarını cəmi 0.05 saniyədə verir. Bu, göz qırpımından daha sürətlidir."),
    createBlock("Növbəti 3 saniyədə isə baxışlar sürətli və şüuraltı şəkildə səhifəni skan edir. Onlar əsas fokus nöqtələrini axtarır, məlumatları qruplaşdırır və ən əsası, səhifənin zehni enerji sərf etməyə dəyib-dəymədiyini müəyyən edirlər."),
    createBlock("Vizual iyerarxiya zəif olduqda, ekrandakı hər bir element eyni vaxtda diqqət çəkməyə çalışır. Loqo, menyu, başlıq, arxa fon — hamısı eyni anda qışqırır və beyində kütləvi koqnitiv yüklənmə yaradır. Lakin nizamlı iyerarxiya olduqda, interfeys səssiz bir dirijor kimi çıxış edir və baxış trayektoriyasını təbii şəkildə idarə edir."),

    createBlock("1. Vizual Hakimiyyətin 4 Əsas Faktoru", "h3"),
    createBlock("Bəs gözün hara baxacağını necə idarə edirik? İnterfeysdə elementin vizual çəkisi sehr deyil; o, 4 əsas fiziki xüsusiyyətlə müəyyən edilir:"),
    createBlock("• Miqyas (Ölçü): Bu ən primitiv vasitədir. Ən böyük mətn və ya qrafik element gözün ilkin fokusunu qazanır. Əgər hər şey böyükdürsə, deməli, heç nə böyük deyil. Ən böyük ölçünü yalnız ən vacib mesajınız üçün saxlayın."),
    createBlock("• Parlaqlıq Kontrastı: Yüksək kontrastlı elementlər solğun rənglərdən daha tez diqqət çəkir. Ağ fonda qara mətn və ya tünd fonda parlayan neon düymə düşünün. Gözlərimiz təkamül olaraq yüksək kontrastı dərhal sezməyə proqramlaşdırılıb."),
    createBlock("• Məkan Təcridi (Boşluq): Bu, dizaynerin gizli silahıdır. Ətrafında geniş boşluq olan kiçik bir element, sıx bir şəbəkəyə sıxışdırılmış daha böyük elementdən daha çox diqqət çəkir. Səssizlik səsi daha da ucaldır."),
    createBlock("• Dərinlik və Laylar: Biz 3D dünyasında yaşayırıq. Kölgələr, kəskin sərhədlər və şüşə effektləri interaktiv elementləri arxa fondan ayırır və beyinə \"buna toxuna bilərsən\" siqnalı verir."),

    createBlock("2. Baxış Trayektoriyaları: F-Sxem və Z-Sxem", "h3"),
    createBlock("Biz veb səhifələri kitab kimi oxumuruq. Tədqiqatlar göstərir ki, dizayn edərkən nəzərə almalı olduğunuz iki əsas instinktiv oxuma sxemi var:"),
    createBlock("• F-Sxemi (Mətnlə Zəngin Səhifələr): Uzun məqalələrdə istifadəçi birinci sətri oxuyur, sonra bir qədər aşağı enərək daha qısa horizontal baxış keçirir və sol kənar boyu şaquli skan edir. Nəticə? Ən vacib açar sözləri və ikonları sol kənar boyu yerləşdirin. Yaxşı məlumatı sağda gizlətməyin."),
    createBlock("• Z-Sxemi (Vizual Açılış Səhifələri): Daha az mətnli səhifələrdə baxış belə hərəkət edir: yuxarı sol (Loqo) → yuxarı sağ (Menyu) → diaqonal aşağı sol (İllüstrasiya) → aşağı sağ (Əsas Düymə). Dizaynı bu diaqonal üzrə qurmaq istifadəçini təbii olaraq hədəfə aparır."),

    createBlock("3. Geştalt Yaxınlıq Qanunu", "h3"),
    createBlock("İnsan beyni naxışları (pattern) uyğunlaşdıran bir maşındır. Geştalt yaxınlıq qanununa görə, bir-birinə yaxın yerləşən obyektlər beyin tərəfindən vahid məntiqi qrup kimi qavranılır. İnterfeysdəki boşluqlar sadəcə dizayn elementi deyil, məna daşıyıcısıdır:"),
    createBlock("• Başlıq və onun alt mətni arasında kiçik məsafə (4px–8px) olmalıdır."),
    createBlock("• Fərqli kartlar arasında orta məsafə (24px–32px) olmalıdır."),
    createBlock("• Əsas bölmələr arasında isə (məsələn, 'Xüsusiyyətlər'-dən 'Qiymətlər'-ə keçid) geniş boşluqlar (80px–120px) qoyulmalıdır ki, beyin yeni məzmuna keçid etdiyini anlasın."),

    createBlock("4. Tək Əsas Vurğu Qaydası", "h3"),
    createBlock("Bu, gənc dizaynerlərin ən çox pozduğu qaydadır. Hər bir ekranda tam olaraq BİR əsas vizual fokus nöqtəsi olmalıdır. Əgər eyni anda həm parlayan düymə, həm qırmızı bildiriş, həm də animasiyalı banner varsa, beyin yüklənir və istifadəçi saytı tərk edir. İkincidərəcəli elementlərin rəngini və ölçüsünü azaldın."),

    createBlock("5. Canlı Alətlərlə İnteqrasiya", "h3"),
    createBlock("Vizual iyerarxiya prinsiplərini sadəcə oxumaqla kifayətlənməyin, onları platformamızın canlı alətlərində tətbiq edin:"),
    createBlock("• Tipoqrafiya Miqyası və Clamp Kalkulyatoru (/tools/typography-scale) ilə harmonik şrift ölçüləri qurun."),
    createBlock("• APCA Kontrast Matrisi (/tools/contrast-matrix) ilə vizual gücü yoxlayın."),
    createBlock("• ATS CV Hazırlayıcı (/tools/resume-builder) ilə peşəkar sənədlərdə iyerarxiyanı sınaqdan keçirin. Təxmin etməyi dayandırın və düşünülmüş şəkildə dizayn edin.")
  ]
};
