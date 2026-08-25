export interface FaqItem {
  id: string | number;
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
    aEn: "Rvan.me is an independent creative publication, knowledge platform, and resource ecosystem founded by senior creative designer Ravan Mammadov. It brings together in-depth design systems, branding strategy, motion design, creative technology, curated typography, and community perspectives.",
    aAz: "Rvan.me — baş kreativ dizayner Rəvan Məmmədov tərəfindən təsis edilmiş müstəqil kreativ nəşr, bilik platforması və resurs ekosistemidir. Platforma dizayn sistemləri, brendinq strategiyası, motion dizayn, yaradıcı texnologiyalar, şrift kataloqları və icma yazılarını bir araya gətirir.",
    bulletsEn: [
      "Rigorous editorial essays, case studies, and practical design frameworks.",
      "Curated creative tools, Google Fonts catalog with live specimen preview, and vector icons.",
      "Verified contributor platform giving regional and international writers a permanent public portfolio."
    ],
    bulletsAz: [
      "Dərin redaksiya esseləri, layihə təhlilləri və praktiki dizayn çərçivələri.",
      "Kreativ alətlər, canlı nümayişli Google Fonts kataloqu və vektor ikonlar.",
      "Yerli və beynəlxalq müəlliflərə daimi ictimai portfolio təqdim edən təsdiqlənmiş müəllif platforması."
    ]
  },
  {
    id: 2,
    qEn: "How do I create an account?",
    qAz: "Necə hesab yarada bilərəm?",
    aEn: "Creating an account on Rvan.me is instant and secure through Google Sign-In. Click the Profile / Sign In button in the navigation bar to get started.",
    aAz: "Rvan.me-də hesab yaratmaq Google Girişi (Google Sign-In) vasitəsilə dərhal və təhlükəsiz şəkildə həyata keçirilir. Başlamaq üçün menyudakı Profil / Giriş düyməsinə klikləyin.",
    bulletsEn: [
      "No passwords to manage — secure OAuth authentication via Google & Firebase.",
      "Instantly unlocks your personal profile, custom avatars, and contributor access.",
      "Your first name, last name, and profile picture are automatically synced from your Google account."
    ],
    bulletsAz: [
      "Şifrə yadda saxlamağa ehtiyac yoxdur — Google və Firebase vasitəsilə təhlükəsiz giriş.",
      "Şəxsi profilinizi, fərdi avatarınızı və müəlliflik imkanlarını dərhal aktivləşdirir.",
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
      "No contributor account required — anyone can submit an article.",
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
      "Müəlliflik: Qəbul edildikdə yazınız adınız, bioqrafiyanız və şəklinizlə Rvan.me-də yayımlanır.",
      "Müəllif Hüququ: Əsəriniz sizə məxsus olaraq qalır — müəlliflik hüququnuz 100% sizdədir."
    ]
  },
  {
    id: 5,
    qEn: "How does article publication work?",
    qAz: "Məqalənin nəşri necə həyata keçirilir?",
    aEn: "Every selected article is published with full author attribution, dedicated URLs, and social preview cards.",
    aAz: "Seçilmiş hər bir yazı tam müəllif adı, xüsusi link və sosial önizləmə kartları ilə nəşr olunur.",
    bulletsEn: [
      "Direct Communication: We contact authors directly via email regarding publication decisions.",
      "Editorial Crafting: Articles are formatted to premium editorial standards.",
      "Public Attribution: Published articles prominently feature your author identity."
    ],
    bulletsAz: [
      "Birbaşa Əlaqə: Nəşr qərarı ilə bağlı müəlliflə birbaşa e-poçt vasitəsilə əlaqə saxlayırıq.",
      "Redaksiya Tərtibatı: Məqalələr yüksək vizual və məzmun standartları ilə dizayn olunur.",
      "İctimai Müəlliflik: Nəşr olunan yazılarda müəllif kimliyiniz aydın şəkildə təqdim olunur."
    ]
  },
  {
    id: 6,
    qEn: "Can I delete my account?",
    qAz: "Hesabımı və şəxsi məlumatlarımı silə bilərəmmi?",
    aEn: "Yes. You have complete control over your account. You can permanently delete your account and personal profile data at any time directly through the Settings page (/profile) or by contacting us.",
    aAz: "Bəli. Hesabınız üzərində tam nəzarətə sahibsiniz. İstənilən vaxt Tənzimləmələr səhifəsi (/profile) vasitəsilə və ya bizimlə əlaqə saxlayaraq hesabınızı və bütün şəxsi profil məlumatlarınızı birdəfəlik silə bilərsiniz.",
    bulletsEn: [
      "Account deletion removes your stored profile details, custom avatars, and local drafts.",
      "You can also request full removal of your submitted publications by reaching out to our editorial desk.",
      "We do not retain unnecessary personal data after account deletion."
    ],
    bulletsAz: [
      "Hesabın silinməsi saxlanılan profil məlumatlarınızı, fərdi avatarınızı və yerli qaralamalarınızı silir.",
      "Həmçinin redaksiyaya müraciət edərək təqdim etdiyiniz yazıların da tam silinməsini tələb edə bilərsiniz.",
      "Hesab silindikdən sonra heç bir lazımsız şəxsi məlumat saxlanılmır."
    ]
  },
  {
    id: 7,
    qEn: "Who owns contributor content?",
    qAz: "Müəllif məzmununun müəllif hüquqları kimə məxsusdur?",
    aEn: "You do. The contributor RETAINS 100% COPYRIGHT OWNERSHIP of their original work. Rvan.me does NOT take ownership of your copyright.",
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
  GLOBAL_FAQS[2], // How do I become a contributor?
  GLOBAL_FAQS[3], // How do I submit an article?
  GLOBAL_FAQS[6], // Who owns contributor content?
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
    aEn: "Yes. Any designer, researcher, or marketing strategist can apply as a contributor via the Contributor Hub or Settings (/profile) and submit an article draft for editorial review.",
    aAz: "Bəli. Hər bir dizayner, tədqiqatçı və ya marketoloq Müəlliflik səhifəsi və ya Tənzimləmələr (/profile) vasitəsilə məqalə qaralamasını redaksiyaya təqdim edə bilər."
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
    aEn: "Every article is written by an authenticated contributor with a verified public profile detailing their role, professional background, and portfolio links.",
    aAz: "Hər bir yazı təsdiqlənmiş ictimai profilə, peşəkar təcrübəyə və portfolio linklərinə malik autentifikasiya olunmuş müəllif tərəfindən qələmə alınır."
  },
  {
    id: "ad3",
    qEn: "Can I write and submit an article on a related topic?",
    qAz: "Mən də bu və ya oxşar mövzuda məqalə yazıb göndərə bilərəmmi?",
    aEn: "Yes. We actively encourage dialogue, follow-up perspectives, and differing viewpoints. Sign in and submit your draft through the Contributor Hub.",
    aAz: "Bəli. Mövzu ilə bağlı alternativ fikirləri, fərqli təcrübələri və davam məqalələrini dəstəkləyirik. Müəllif kimi qoşularaq qaralamanızı göndərə bilərsiniz."
  },
  {
    id: "ad4",
    qEn: "How do community comments and discussions work?",
    qAz: "Şərhlər və müzakirələr necə tənzimlənir?",
    aEn: "Authenticated users can leave comments, ask questions to the author, and engage in peer discussions. All discussions are moderated for constructive, professional communication.",
    aAz: "Daxil olmuş istifadəçilər məqaləyə şərh yaza, müəllifə suallar verə və peşəkar müzakirə apara bilərlər. Bütün şərhlər etik qaydalar çərçivəsində tənzimlənir."
  }
];

export const CONTRIBUTORS_FAQS: FaqItem[] = [
  GLOBAL_FAQS[2], // How do I become a contributor?
  GLOBAL_FAQS[3], // How do I submit an article?
  GLOBAL_FAQS[4], // How does article approval work?
  GLOBAL_FAQS[6], // Who owns contributor content?
  GLOBAL_FAQS[9], // What languages are available?
];

export const ABOUT_FAQS: FaqItem[] = [
  GLOBAL_FAQS[0], // What is Rvan.me?
  GLOBAL_FAQS[2], // How do I become a contributor?
  GLOBAL_FAQS[8], // How does the Resources section work?
  GLOBAL_FAQS[9], // What languages are available?
];

export const CONTACT_FAQS: FaqItem[] = [
  {
    id: "c1",
    qEn: "How can I contact the Rvan.me editorial team?",
    qAz: "Rvan.me redaksiya heyəti ilə necə əlaqə saxlaya bilərəm?",
    aEn: "You can reach us directly via the contact form on this page or by emailing mammadovravan1@gmail.com for editorial questions, article submissions, and general inquiries.",
    aAz: "Bu səhifədəki əlaqə forması və ya mammadovravan1@gmail.com e-poçt ünvanı vasitəsilə redaksiya sualları, məqalə təklifləri və ümumi müraciətlər üçün bizimlə əlaqə saxlaya bilərsiniz."
  },
  {
    id: "c2",
    qEn: "How do I submit a collaboration, sponsorship, or media request?",
    qAz: "Əməkdaşlıq, tərəfdaşlıq və ya media sorğularını necə göndərə bilərəm?",
    aEn: "Please select 'Partnership & Collaboration' in the contact form or send a brief description of your project to our editorial email. We respond to professional inquiries within 1–3 business days.",
    aAz: "Zəhmət olmasa əlaqə formasında 'Əməkdaşlıq' seçimini qeyd edin və ya layihənizin qısa təsvirini e-poçt ünvanımıza göndərin. Peşəkar müraciətlərə 1–3 iş günü ərzində cavab verilir."
  },
  {
    id: "c3",
    qEn: "Where should I report a factual error, correction, or copyright issue?",
    qAz: "Məqalədəki faktiki səhvi, düzəlişi və ya müəllif hüququ məsələsini hara bildirməliyəm?",
    aEn: "We take editorial accuracy seriously. You can use the 'Report Article' button directly on any blog post or contact our editorial desk with the article link and specific details.",
    aAz: "Biz redaksiya dəqiqliyinə böyük önəm veririk. Hər bir məqalənin altındakı 'Məqaləni Bildir' düyməsindən istifadə edə və ya birbaşa əlaqə forması vasitəsilə düzəliş tələbini göndərə bilərsiniz."
  }
];
