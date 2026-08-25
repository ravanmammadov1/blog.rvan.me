export interface FaqItem {
  id: number | string;
  qEn: string;
  qAz: string;
  aEn: string | string[];
  aAz: string | string[];
  bulletsEn?: string[];
  bulletsAz?: string[];
}

export const GLOBAL_FAQS: FaqItem[] = [
  {
    id: 1,
    qEn: "What is Rvan.me?",
    qAz: "Rvan.me nədir?",
    aEn: "Rvan.me is a premier digital publication, knowledge hub, and creative ecosystem dedicated to high-standard design systems, brand strategy, typography, motion graphics, and technology in Azerbaijan and globally.",
    aAz: "Rvan.me Azərbaycanda və qlobal miqyasda yüksək səviyyəli dizayn sistemləri, brend strategiyası, tipoqrafiya, motion dizayn və texnologiya sahələrinə həsr olunmuş aparıcı rəqəmsal nəşriyyat, bilik mərkəzi və yaradıcı ekosistemdir.",
    bulletsEn: [
      "In-depth editorial articles, critical essays, and real-world case studies.",
      "Comprehensive curated directory of 2,000+ Google Fonts, SVG vector icons, and AI utilities.",
      "Verified author platform giving regional and international writers a permanent public portfolio."
    ],
    bulletsAz: [
      "Dərin redaksiya məqalələri, analitik esselər və real təcrübə araşdırmaları.",
      "2,000-dən çox Google Şrifti, SVG vektor ikonlar və süni intellekt alətlərinin kataloqu.",
      "Yazıçılar və dizaynerlər üçün şəxsi rəqəmsal portfolio və müəlliflik platforması."
    ]
  },
  {
    id: 2,
    qEn: "How does user authentication work on Rvan.me?",
    qAz: "Rvan.me-də istifadəçi girişi necə işləyir?",
    aEn: "We provide seamless, passwordless One-Click Google Authentication backed by enterprise-grade Firebase security.",
    aAz: "Biz Firebase təhlükəsizlik infrastrukturu ilə dəstəklənən sürətli və şifrəsiz 'Tək Kliklə Google Girişi' təqdim edirik.",
    bulletsEn: [
      "Zero password friction — securely sign in using your existing Google account.",
      "Instantly unlocks your personal profile, custom avatars, and reading features.",
      "Your display name and photo are automatically synced from your verified Google credentials."
    ],
    bulletsAz: [
      "Şifrə yadda saxlamağa ehtiyac yoxdur — Google və Firebase vasitəsilə təhlükəsiz giriş.",
      "Şəxsi profilinizi, fərdi avatarınızı və oxu imkanlarını dərhal aktivləşdirir.",
      "Adınız, soyadınız və profil şəkliniz Google hesabınızdan avtomatik sinxronlaşdırılır."
    ]
  },
  {
    id: 3,
    qEn: "How can I share an idea or submit an article to Rvan.me?",
    qAz: "Rvan.me ilə necə fikir və ya məqalə paylaşa bilərəm?",
    aEn: "Anyone with an original idea or finished article can submit it for editorial consideration via our submission page (/write). Fill out the form with your article text, author bio, profile photo, and cover image.",
    aAz: "Orijinal fikri və ya hazır məqaləsi olan hər kəs onu təqdimat səhifəmiz (/write) vasitəsilə redaksiyamıza göndərə bilər. Formu məqalə mətni, müəllif bioqrafiyası, profil şəkli və üz qabığı ilə dolduraraq bizimlə bölüşün.",
    bulletsEn: [
      "No account required — anyone can submit an article for editorial review.",
      "Attach your profile photo and cover image directly in the form.",
      "Our editorial team reviews every submission and reaches out via email if selected."
    ],
    bulletsAz: [
      "Müəllif hesabı açmaq tələb olunmur — hər kəs məqalə göndərə bilər.",
      "Profil şəklinizi və üz qabığı şəklini birbaşa forma vasitəsilə əlavə edin.",
      "Redaksiya heyətimiz hər müraciəti nəzərdən keçirir və seçildikdə e-poçtla sizinlə əlaqə saxlayır."
    ]
  },
  {
    id: 4,
    qEn: "How does the editorial review process work?",
    qAz: "Redaksiya baxışı prosesi necə işləyir?",
    aEn: "Submissions are delivered directly to the editorial team for manual evaluation.",
    aAz: "Təqdim olunan yazılar birbaşa redaksiya heyətinə çatdırılır və qiymətləndirilir.",
    bulletsEn: [
      "Evaluation: We review your submission for originality, structure, and real utility.",
      "Attribution: If accepted, your article is published on Rvan.me with your name, bio, and profile photo.",
      "Copyright: Your work stays yours — you retain 100% of your copyright."
    ],
    bulletsAz: [
      "Qiymətləndirmə: Məqalənizi orijinallıq, struktur və faydalılıq üzrə nəzərdən keçiririk.",
      "Müəlliflik: Qəbul edildikdə, məqaləniz adınız, bioqrafiyanız və şəklinizlə Rvan.me-də dərc olunur.",
      "Müəllif Hüququ: Əsəriniz sizə məxsusdur — 100% müəllif hüququ sizdə qalır."
    ]
  },
  {
    id: 5,
    qEn: "What are the rules regarding AI-generated content?",
    qAz: "Süni intellektlə (AI) yaradılan məzmuna dair qaydalar nələrdir?",
    aEn: "We strictly value genuine human critical thinking, original lived expertise, and substantive domain knowledge.",
    aAz: "Biz həqiqi insan təfəkkürünü, şəxsi peşəkar təcrübəni və dərin sahəvi bilikləri hər şeydən üstün tuturuq.",
    bulletsEn: [
      "AI as Assistant: Using AI for grammar polishing, ideation, or initial structuring is permitted.",
      "No Raw AI Dumps: Direct copy-pasting of generic, unedited LLM output is strictly rejected.",
      "Mandatory Disclosure: Authors must declare the extent of AI assistance during the submission process."
    ],
    bulletsAz: [
      "AI Köməkçi Kimi: Qrammatik düzəlişlər, ideya axtarışı və ya ilkin struktur üçün AI istifadəsinə icazə verilir.",
      "Xam AI Mətnlərinə Qadağa: Süni intellekt tərəfindən yazılmış şablon mətni birbaşa köçürmək qəti qadağandır.",
      "Məcburi Bəyanat: Müəlliflər təqdimat zamanı AI-dan hansı dərəcədə istifadə etdiklərini bəyan etməlidirlər."
    ]
  },
  {
    id: 6,
    qEn: "How is user data and privacy handled?",
    qAz: "İstifadəçi məlumatları və məxfilik necə qorunur?",
    aEn: "We adhere to privacy-first architecture and GDPR compliance principles. We never sell your personal information or track you across third-party networks.",
    aAz: "Biz məxfilik prinsiplərinə və GDPR standartlarına tam riayət edirik. Şəxsi məlumatlarınız heç vaxt üçüncü tərəflərə satılmır.",
    bulletsEn: [
      "All account authentication data is encrypted via Google Firebase infrastructure.",
      "You have the right to request deletion of your account and associated profile data at any time.",
      "No intrusive advertising tracking pixels or third-party cookies are used on the platform."
    ],
    bulletsAz: [
      "Bütün istifadəçi məlumatları Google Firebase infrastrukturu vasitəsilə şifrələnir.",
      "Hesabınızı və profil məlumatlarınızı istənilən vaxt tamamilə silmək hüququnuz var.",
      "Platformada heç bir bezdirici reklam izləmə kodu və ya kənar kukilər istifadə olunmur."
    ]
  },
  {
    id: 7,
    qEn: "Who owns the submitted article content?",
    qAz: "Təqdim olunan məqalənin müəllif hüquqları kimə məxsusdur?",
    aEn: "You do. The author RETAINS 100% COPYRIGHT OWNERSHIP of their original work. Rvan.me does NOT take ownership of your copyright.",
    aAz: "Müəllif hüquqları tamamilə SİZƏ məxsusdur. Müəllif öz orijinal əsərinin 100% müəllif hüququnu özündə saxlayır. Rvan.me heç bir halda müəllif hüquqlarını öz üzərinə keçirmir.",
    bulletsEn: [
      "You retain full intellectual property rights to your written work and original concepts.",
      "By submitting, you grant Rvan.me a non-exclusive license to publish, display, archive, distribute, and promote your article.",
      "You are always free to republish, adapt, or cross-post your original writing on other platforms with reference to original publication."
    ],
    bulletsAz: [
      "Yazdığınız məqalə və orijinal fikirləriniz üzərində bütün əqli mülkiyyət hüquqları sizdə qalır.",
      "Yazını təqdim etməklə siz Rvan.me-yə məqaləni yayımlamaq, arxivləşdirmək və tanıtmaq üçün qeyri-müstəsna lisenziya hüququ verirsiniz.",
      "Orijinal yazınızı istənilən vaxt digər platformalarda yenidən paylaşmaq və ya uyğunlaşdırmaq hüququnuz tam qorunur."
    ]
  },
  {
    id: 8,
    qEn: "How can I contact Rvan.me?",
    qAz: "Rvan.me ilə necə əlaqə saxlaya bilərəm?",
    aEn: "You can reach the editorial desk directly via our Contact page (/contact) or by sending an email to mammadovravan1@gmail.com.",
    aAz: "Redaksiya heyəti ilə birbaşa Əlaqə səhifəmiz (/contact) və ya mammadovravan1@gmail.com e-poçt ünvanı vasitəsilə əlaqə saxlaya bilərsiniz.",
    bulletsEn: [
      "Editorial Inquiries: Questions about article proposals, reviews, or editorial standards.",
      "Partnerships & Collaborations: Brand partnerships, creative workshops, and project inquiries.",
      "Corrections & Feedback: Reporting factual updates or technical issues on the site."
    ],
    bulletsAz: [
      "Redaksiya Sorğuları: Məqalə təklifləri, baxış prosesi və ya redaksiya standartları ilə bağlı suallar.",
      "Tərəfdaşlıq və Əməkdaşlıq: Brend əməkdaşlıqları, yaradıcı seminarlar və layihə müraciətləri.",
      "Düzəlişlər və Rəylər: Faktiki məlumatların yenilənməsi və ya saytla bağlı texniki bildirişlər."
    ]
  },
  {
    id: 9,
    qEn: "How does the Resources section work?",
    qAz: "Resurslar bölməsi necə işləyir?",
    aEn: "The Resources directory (/resources) is a curated collection of high-utility design assets, open-source typography, SVG icons, and productivity tools.",
    aAz: "Resurslar bölməsi (/resources) dizaynerlər və yaradıcı peşəkarlar üçün açıq mənbəli şriftlər, SVG ikonlar və faydalı alətlərin seçilmiş kolleksiyasıdır.",
    bulletsEn: [
      "Fonts Catalog: Explore 2,000+ open-source Google fonts with live interactive specimens, variable axes, and ready-to-use CSS tokens.",
      "Lucide Vector Icons: Search and copy thousands of clean SVG icons for UI/UX and web development.",
      "AI & Design Tools: Curated directory of verified utilities engineered to accelerate creative workflows."
    ],
    bulletsAz: [
      "Şrift Kataloqu: 2,000-dən çox açıq mənbəli şrifti canlı nümayiş, variativ oxlar və hazır CSS kodları ilə kəşf edin.",
      "Lucide Vektor İkonları: UI/UX və veb tətbiqlər üçün minlərlə təmiz SVG ikonu axtarın və istifadə edin.",
      "Süni İntellekt və Dizayn Alətləri: Yaradıcı iş axınlarını sürətləndirmək üçün sınaqdan keçirilmiş faydalı alətlər toplusu."
    ]
  },
  {
    id: 10,
    qEn: "What languages are available on Rvan.me?",
    qAz: "Rvan.me hansı dillərdə mövcuddur?",
    aEn: "Rvan.me is fully bilingual, offering complete interfaces, navigation, and content in both Azerbaijani and English.",
    aAz: "Rvan.me tam iki dilli (bilingual) platformadır və bütün interfeys, naviqasiya və məzmunu həm Azərbaycan, həm də İngilis dilində təqdim edir.",
    bulletsEn: [
      "Azerbaijani (AZ): Our primary domestic language, fostering high-quality regional creative literature under the /az routes.",
      "English (EN): Designed for international accessibility, global readers, and worldwide creative collaboration.",
      "Seamless Switching: Switch languages anytime via the globe selector in the header or profile menu."
    ],
    bulletsAz: [
      "Azərbaycan dili (AZ): Əsas dilimiz — /az bölməsində yüksək səviyyəli yerli dizayn və brendinq ədəbiyyatını inkişaf etdirir.",
      "İngilis dili (EN): Beynəlxalq oxucular, qlobal əlçatanlıq və xarici əməkdaşlıqlar üçün nəzərdə tutulub.",
      "Rahat Keçid: Menyudakı və ya profil bölməsindəki dil seçicisi vasitəsilə istənilən vaxt dillər arasında dərhal keçid edə bilərsiniz."
    ]
  }
];

export const HOMEPAGE_FAQS: FaqItem[] = [
  GLOBAL_FAQS[0], // What is Rvan.me?
  GLOBAL_FAQS[2], // How can I share an idea or submit an article?
  GLOBAL_FAQS[3], // How does the editorial review process work?
  GLOBAL_FAQS[6], // Who owns submitted article content?
];

export const ABOUT_FAQS: FaqItem[] = [
  GLOBAL_FAQS[0], // What is Rvan.me?
  GLOBAL_FAQS[2], // How can I share an idea or submit an article?
  GLOBAL_FAQS[3], // How does the editorial review process work?
  GLOBAL_FAQS[4], // What are the rules regarding AI-generated content?
  GLOBAL_FAQS[6], // Who owns submitted article content?
  GLOBAL_FAQS[9], // What languages are available on Rvan.me?
];

export const CONTACT_FAQS: FaqItem[] = [
  GLOBAL_FAQS[7], // How can I contact Rvan.me?
  GLOBAL_FAQS[2], // How can I share an idea or submit an article?
  GLOBAL_FAQS[3], // How does the editorial review process work?
  GLOBAL_FAQS[5], // How is user data and privacy handled?
];

export const BLOG_FAQS: FaqItem[] = [
  {
    id: "b1",
    qEn: "What topics does the Rvan.me publication cover?",
    qAz: "Rvan.me bloqu hansı mövzuları əhatə edir?",
    aEn: "Our publication explores visual strategy, brand identity, typography, motion design, AI workflow integration, conversion psychology, and critical commentary on the creative industry in Azerbaijan.",
    aAz: "Bloqumuz vizual strategiya, brend kimliyi, tipoqrafiya, motion dizayn, süni intellektin dizayna tətbiqi, konversiya psixologiyası və Azərbaycanda yaradıcı sənaye mövzularını əhatə edir."
  },
  {
    id: "b2",
    qEn: "How often are new articles published?",
    qAz: "Yeni məqalələr nə qədər tez-tez dərc olunur?",
    aEn: "We prioritize depth over frequency. Rather than daily news churn, we publish curated, long-form editorial essays and case studies as they are completed and reviewed.",
    aAz: "Biz kəmiyyətə deyil, keyfiyyətə üstünlük veririk. Gündəlik xəbər axını əvəzinə, hərtərəfli araşdırılmış dərin analitik məqalələr və layihə icmalları dərc olunur."
  },
  {
    id: "b3",
    qEn: "Can I submit an article or pitch an editorial idea?",
    qAz: "Mən də məqalə təklif edə və ya qaralama göndərə bilərəmmi?",
    aEn: "Yes. Any designer, researcher, or marketing strategist can share ideas or submit an article draft via /write for editorial review.",
    aAz: "Bəli. Hər bir dizayner, tədqiqatçı və ya marketoloq /write səhifəsi vasitəsilə məqalə qaralamasını redaksiyaya təqdim edə bilər."
  },
  {
    id: "b4",
    qEn: "How are published articles curated and selected?",
    qAz: "Məqalələr hansı meyarlar əsasında seçilir və redaktə olunur?",
    aEn: "Articles are evaluated for originality, analytical rigor, actionable lessons, and clarity. We work with authors to ensure every piece delivers genuine intellectual value to readers.",
    aAz: "Yazılar orijinallıq, analitik dəqiqlik, praktiki fayda və fikir aydınlığı meyarları üzrə qiymətləndirilir və oxucu üçün ən yüksək dəyəri təmin etmək üçün cilalanır."
  }
];

export const ARTICLE_DETAIL_FAQS: FaqItem[] = [
  {
    id: "ad1",
    qEn: "Can I share or reference this article?",
    qAz: "Bu məqaləni paylaşa və ya sitat gətirə bilərəmmi?",
    aEn: "Yes. You are free to share this article on social platforms, cite it in your research, or reference its frameworks, provided you attribute the author and link to the canonical Rvan.me URL.",
    aAz: "Bəli. Məqaləni sosial şəbəkələrdə paylaşa, araşdırmalarınızda sitat gətirə bilərsiniz — bu zaman müəllifin adını və Rvan.me mənbə linkini qeyd etmək kifayətdir."
  },
  {
    id: "ad2",
    qEn: "Who wrote this article and how is author identity verified?",
    qAz: "Bu məqalənin müəllifi kimdir və müəllif kimliyi necə təsdiqlənir?",
    aEn: "Every article is written by an authenticated author with a verified public profile detailing their role, professional background, and portfolio links.",
    aAz: "Hər bir yazı təsdiqlənmiş ictimai profilə, peşəkar təcrübəyə və portfolio linklərinə malik müəllif tərəfindən qələmə alınır."
  },
  {
    id: "ad3",
    qEn: "Can I write and submit an article on a related topic?",
    qAz: "Mən də bu və ya oxşar mövzuda məqalə yazıb göndərə bilərəmmi?",
    aEn: "Yes. We actively encourage dialogue, follow-up perspectives, and differing viewpoints. Submit your draft through /write.",
    aAz: "Bəli. Mövzu ilə bağlı alternativ fikirləri, fərqli təcrübələri və davam məqalələrini dəstəkləyirik. Fikrinizi bizimlə bölüşün (/write) səhifəsi vasitəsilə qaralamanızı göndərə bilərsiniz."
  },
  {
    id: "ad4",
    qEn: "How do community comments and discussions work?",
    qAz: "Şərhlər və müzakirələr necə tənzimlənir?",
    aEn: "Authenticated users can leave comments, ask questions to the author, and engage in peer discussions. All discussions are moderated for constructive, professional communication.",
    aAz: "Daxil olmuş istifadəçilər məqaləyə şərh yaza, müəllifə suallar verə və peşəkar müzakirə apara bilərlər. Bütün şərhlər etik qaydalar çərçivəsində tənzimlənir."
  }
];

export const CONTRIBUTORS_FAQS = GLOBAL_FAQS;
