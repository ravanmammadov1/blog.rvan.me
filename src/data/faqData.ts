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
    qEn: "What is Rvan.me and what is its editorial mission?",
    qAz: "Rvan.me nədir və əsas redaksiya missiyası nədən ibarətdir?",
    aEn: "Rvan.me is an independent creative publication and knowledge platform exploring visual strategy, brand architecture, motion design, creative technology, marketing psychology, and Azerbaijan's growing creative community.",
    aAz: "Rvan.me — vizual strategiya, brend memarlığı, motion dizayn, yaradıcı texnologiyalar, marketinq psixologiyası və Azərbaycanın inkişaf edən kreativ icmasını araşdıran müstəqil nəşr və bilik platformasıdır.",
    bulletsEn: [
      "Replacing fleeting social media noise with rigorous, permanent analysis.",
      "Bridging high-level theoretical foundations with practical execution.",
      "Providing verified public author attribution for regional creative thinkers."
    ],
    bulletsAz: [
      "Sosial media lentlərində itən səthi səs-küyü qalıcı və analitik məzmunla əvəz etmək.",
      "Nəzəri strateji prinsipləri real layihə təcrübəsi ilə birləşdirmək.",
      "Yaradıcı düşüncə sahiblərinə təsdiqlənmiş ictimai müəlliflik imkanı yaratmaq."
    ]
  },
  {
    id: 2,
    qEn: "Who can become a contributor on Rvan.me?",
    qAz: "Kimlər Rvan.me-də müəllif kimi yazı dərc edə bilər?",
    aEn: "We welcome designers, brand strategists, marketing professionals, writers, researchers, students, and creative technologists. We care about the depth of your thinking and clarity of your perspective rather than your job title.",
    aAz: "Dizaynerlər, brend strateqləri, marketoloqlar, yazıçılar, tədqiqatçılar, tələbələr və kreativ texnoloqlar platformamızda yazı dərc edə bilərlər. Bizim üçün vəzifə adından daha çox fikirlərinizin dərinliyi və arqumentlərinizin aydınlığı önəmlidir.",
    bulletsEn: [
      "Practitioners with hands-on case studies and lessons learned.",
      "Researchers analyzing industry trends, typography, or behavioral UX.",
      "Emerging creators with original, non-obvious viewpoints."
    ],
    bulletsAz: [
      "Real layihə təcrübələri və dərslərini bölüşən praktiklər.",
      "Sənaye trendlərini, tipoqrafiyanı və ya UX psixologiyasını araşdıranlar.",
      "Orijinal və qeyri-standart baxış bucağına malik gənc yaradıcılar."
    ]
  },
  {
    id: 3,
    qEn: "What types of articles and topics do you publish?",
    qAz: "Hansı mövzularda və formatda məqalələr dərc olunur?",
    aEn: "We publish analytical essays, practical frameworks, case studies, and critical reviews across five core editorial pillars:",
    aAz: "Biz beş əsas redaksiya sütunu üzrə analitik esselər, praktiki bələdçilər, layihə təhlilləri və tənqidi icmallar dərc edirik:",
    bulletsEn: [
      "Visual Strategy & Brand Systems: Identity deconstructions and market positioning.",
      "Motion, Typography & Graphic Craft: Kinetic rules, fluid type math, and art direction.",
      "Applied AI & Creative Tech: Practical computational tools and algorithmic workflows.",
      "Behavioral Psychology & Copywriting: Cognitive heuristics, conversion ethics, and perceptual UX.",
      "Industry Critiques & Essays: Reflections on creative leadership and careers in Azerbaijan."
    ],
    bulletsAz: [
      "Vizual Strategiya və Brend Sistemləri: Brend kimliyi və bazar mövqeləndirilməsi.",
      "Motion, Tipoqrafiya və Qrafik Sənət: Kinetik qaydalar, elastik tipoqrafiya və art direktorluq.",
      "Tətbiqi AI və Kreativ Texnologiyalar: Alqoritmik alətlər və hesablama dizaynı.",
      "Davranış Psixologiyası və Kopiraytinq: Koqnitiv təsirlər və konversiya psixologiyası.",
      "Sənaye Tənqidi və İcma Məqalələri: Azərbaycanda kreativ karyera və dizayn liderliyi."
    ]
  },
  {
    id: 4,
    qEn: "Can I write and submit articles in Azerbaijani?",
    qAz: "Məqalələri Azərbaycan dilində yaza və təqdim edə bilərəmmi?",
    aEn: "Yes, absolutely. Azerbaijani is one of Rvan.me's primary languages. Fostering high-quality Azerbaijani-language design and branding literature is central to our founding mission.",
    aAz: "Bəli, mütləq. Azərbaycan dili Rvan.me-nin əsas dillərindən biridir. Azərbaycan dilində keyfiyyətli dizayn, brendinq və marketinq ədəbiyyatının formalaşdırılması bizim ən başlıca missiyamızdır.",
    bulletsEn: [
      "Contributions in Azerbaijani are prioritized and actively supported.",
      "Bilingual publishing (AZ + EN) is also supported to reach international readers."
    ],
    bulletsAz: [
      "Azərbaycan dilində olan yazılara xüsusi üstünlük verilir və redaksiya dəstəyi göstərilir.",
      "Beynəlxalq auditoriyaya çıxış üçün iki dilli (AZ + EN) nəşr imkanı da mövcuddur."
    ]
  },
  {
    id: 5,
    qEn: "What is Rvan.me's policy on using AI tools for writing?",
    qAz: "Yazı prosesində süni intellektdən (AI) istifadə qaydaları necədir?",
    aEn: "We maintain a transparent and balanced approach: AI is welcomed as an intellectual amplifier, not as an author replacement.",
    aAz: "Biz şəffaf və balanslı yanaşmaya üstünlük veririk: AI müəllifin düşüncəsini gücləndirən köməkçi alətdir, müəllifin özünü əvəz edən vasitə deyil.",
    bulletsEn: [
      "Permitted: Using AI for background research, outlining, idea exploration, and grammar polish.",
      "Prohibited: Submitting unedited, raw AI outputs lacking personal perspective or domain insight.",
      "Accountability: The human contributor is 100% responsible for facts, arguments, and voice."
    ],
    bulletsAz: [
      "İcazə verilir: İlkin araşdırma, strukturlaşdırma, beyin həmləsi və qrammatik cilalama.",
      "Qadağandır: Heç bir şəxsi təhlil olmadan birbaşa AI tərəfindən çıxarılan səthi mətnlər.",
      "Məsuliyyət: Müəllif məqalədəki bütün faktlara, arqumentlərə və üsluba şəxsən cavabdehdir."
    ]
  },
  {
    id: 6,
    qEn: "How does the editorial submission and review process work?",
    qAz: "Məqalənin təqdim edilməsi və redaksiya baxışı prosesi necə işləyir?",
    aEn: "Our publishing lifecycle follows four transparent, structured steps:",
    aAz: "Nəşr prosesimiz dörd şəffaf və ardıcıl mərhələdən ibarətdir:",
    bulletsEn: [
      "1. Draft: Sign in with Google, set up your public profile in Settings (/profile), and submit your draft.",
      "2. Review: Our editorial team reviews your submission within 2–5 business days for depth and clarity.",
      "3. Collaborative Polish: If needed, we provide actionable editorial feedback to elevate the piece.",
      "4. Publication: Your article goes live with a verified badge, custom URL, and permanent attribution."
    ],
    bulletsAz: [
      "1. Qaralama: Google ilə daxil olun, Tənzimləmələrdə (/profile) profilinizi tamamlayın və yazını göndərin.",
      "2. Baxış: Redaksiya heyəti 2–5 iş günü ərzində məqalənin dərinliyini və orijinallığını qiymətləndirir.",
      "3. Birgə Redaktə: Lazım olduqda, məzmunun mükəmməlləşdirilməsi üçün təkliflər təqdim edilir.",
      "4. Canlı Yayımlanma: Məqaləniz təsdiqlənmiş müəlliflik nişanı və daimi linklə dərc olunur."
    ]
  },
  {
    id: 7,
    qEn: "Does every submitted article get published?",
    qAz: "Təqdim olunan hər bir yazı mütləq dərc edilirmi?",
    aEn: "No. To maintain high editorial trust and reading value, every submission undergoes editorial curation. Submissions may be accepted directly, returned for collaborative revisions, or declined if they lack sufficient analytical rigor.",
    aAz: "Xeyr. Redaksiya keyfiyyətini və oxucu etimadını qorumaq üçün hər bir yazı dəyərləndirilir. Məqalə birbaşa qəbul edilə, təkmilləşdirmə üçün düzəlişlərə göndərilə və ya yetərincə analitik dərinliyə malik olmadıqda qəbul edilməyə bilər."
  },
  {
    id: 8,
    qEn: "Can I write about my own studio, projects, or services?",
    qAz: "Öz studiyam, müştəri layihələrim və ya xidmətlərim haqqında yaza bilərəmmi?",
    aEn: "Yes, case studies from your direct experience are welcome as long as they deliver educational value, practical methodologies, or critical takeaways. Pure promotional advertisements, disguised press releases, and SEO keyword spam are not accepted.",
    aAz: "Bəli. Şəxsi layihələriniz və təcrübələriniz oxucuya öyrədici dərslər, metodologiyalar və real nəticələr təqdim etdiyi təqdirdə çox faydalıdır. Lakin birbaşa reklam xarakterli mətnlər və gizli piar yazıları qəbul edilmir."
  },
  {
    id: 9,
    qEn: "What do I gain as a published Rvan.me contributor?",
    qAz: "Rvan.me-də dərc olunan müəllif nə əldə edir?",
    aEn: "Publishing on Rvan.me gives your professional thinking an enduring, reputable public home:",
    aAz: "Rvan.me-də məqalə dərc etmək sizə peşəkar nüfuz və qalıcı ictimai arxiv qazandırır:",
    bulletsEn: [
      "Permanent Public Portfolio: All your published articles link to your verified author profile (/author/:slug).",
      "Real Engagement Insights: Access genuine metrics on views, shares, and reader comments in your dashboard.",
      "Editorial Mentorship: Work directly with experienced art directors and editors to sharpen your writing."
    ],
    bulletsAz: [
      "Daimi İctimai Portfolio: Yazılarınız ictimai müəllif profilinizdə (/author/:slug) daimi arxivləşir.",
      "Real Oxucu Analitikası: Yazılarınıza olan baxışları və şərhləri şəxsi kabinetinizdən izləyin.",
      "Redaksiya Dəstəyi: Təcrübəli redaktor və dizaynerlərlə birgə yazınızı ən yüksək standartlara çatdırın."
    ]
  },
  {
    id: 10,
    qEn: "Is contributing free and how do I get started?",
    qAz: "Müəllif olmaq ödənişsizdirmi və necə başlaya bilərəm?",
    aEn: "Yes, contributing is 100% free. Rvan.me is an independent community publication focused on elevating creative discourse.",
    aAz: "Bəli, müəlliflik tamamilə ödənişsizdir. Rvan.me yaradıcı müzakirələri inkişaf etdirmək üçün qurulmuş müstəqil icma platformasıdır.",
    bulletsEn: [
      "1. Sign in with Google using the profile menu in the header.",
      "2. Go to Settings (/profile) or the Contributor page (/contributor).",
      "3. Complete your public profile and submit your draft for review."
    ],
    bulletsAz: [
      "1. Saytın yuxarı menyusundan Google hesabınızla daxil olun.",
      "2. Tənzimləmələrə (/profile) və ya Müəlliflik səhifəsinə (/contributor) keçin.",
      "3. İctimai profilinizi tamamlayaraq ilk məqalə qaralamanızı təqdim edin."
    ]
  }
];

export const HOMEPAGE_FAQS: FaqItem[] = [
  GLOBAL_FAQS[0], // What is Rvan.me?
  GLOBAL_FAQS[1], // Who can become a contributor?
  GLOBAL_FAQS[3], // Can I write in Azerbaijani?
  GLOBAL_FAQS[2], // What types of articles do you publish?
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
  GLOBAL_FAQS[1], // Who can become a contributor?
  GLOBAL_FAQS[2], // What types of articles do you publish?
  GLOBAL_FAQS[3], // Can I write in Azerbaijani?
  GLOBAL_FAQS[4], // AI policy
  GLOBAL_FAQS[5], // Review process
];

export const ABOUT_FAQS: FaqItem[] = [
  GLOBAL_FAQS[0], // What is Rvan.me?
  GLOBAL_FAQS[1], // Who is Rvan.me for?
  GLOBAL_FAQS[2], // What kind of content?
  GLOBAL_FAQS[3], // Azerbaijani language support
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
