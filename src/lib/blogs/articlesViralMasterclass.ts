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

export const ARTICLES_VIRAL_MASTERCLASS: BlogPost[] = [
  // ── 01. Salary Negotiation ──
  {
    _id: "blog-masterclass-maas-danisigi-psixologiyasi-harvard-metodu",
    title: "The Harvard Salary Negotiation Framework: Escaping the Budget Trap",
    title_az: "Maaş Danışığında Harvard Metodu: Şirkətlərin Qiymət Tələsindən Çıxış",
    slug: { _type: "slug", current: "salary-negotiation-psychology-harvard-method" },
    slug_az: { _type: "slug", current: "maas-danisigi-psixologiyasi-harvard-metodu" },
    originalSlug: "maas-danisigi-psixologiyasi-harvard-metodu",
    category: "Career & Negotiations",
    category_az: "Karyera & Danışıqlar",
    excerpt: "Who should state the first number in an interview? Daniel Kahneman's anchoring heuristic, FBI negotiator Chris Voss's calibrated questions, and exact scripts to command top-of-market compensation offers.",
    excerpt_az: "Müsahibədə ilk rəqəmi kim deməlidir? Daniel Kanemanın Lövbər effekti, FTB danışıqçısı Kris Vossun sualları və şirkətlərdən yüksək təklif almağın dəqiq skriptləri.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Strategic salary negotiation represented by minimal chess pieces on dark background",
    },
    publishDate: "26 Avqust 2026",
    readTime: "8 min read",
    featured: true,
    authorName: "Ravan Mammadov",
    authorRole: "Lead Creative Designer & Visual Strategist",
    authorSlug: "ravan-mammadov",
    tags: ["career", "salary", "interview", "hr", "negotiation", "psychology"],
    body: [
      createBlock("Let's be candid: discussing compensation remains one of the greatest career taboos across modern labor markets.", "normal"),
      createBlock("From early education, professionals are conditioned to believe that asking for more is impolite or ungrateful. When carried into professional life, this mindset creates a compounding financial deficit. Two specialists with identical portfolios and technical acumen often experience a 2x income disparity purely due to negotiation proficiency.", "normal"),
      createBlock("Many believe compensation negotiations are a matter of luck or stubbornness. However, extensive research by Harvard Business School Professor Deepak Malhotra and Nobel laureate Daniel Kahneman demonstrates that salary negotiation is an entirely controllable discipline grounded in behavioral economics.", "normal"),
      createBlock("1. Behind the Table: How Hiring Managers and HR Actually Think", "h3"),
      createBlock("According to LinkedIn's Global Talent Trends data, over 73% of mid-to-enterprise roles have pre-approved salary bands.", "normal"),
      createBlock("For instance, a company may have budgeted $3,500 – $5,500 monthly for a senior designer or product strategist:", "normal"),
      createBlock("* If you prematurely anchor at the bottom of the band ($3,500), HR accepts immediately to conserve budget and score internal efficiency marks.", "normal"),
      createBlock("* If you systematically justify $5,500 using value metrics, the company willingly pays it because it sits comfortably within their approved parameters.", "normal"),
      createBlock("2. The Anchoring Heuristic: Who Should Anchor First?", "h3"),
      createBlock("Discovered by Daniel Kahneman and Amos Tversky, the Anchoring Effect dictates that the initial number mentioned sets the gravitational center for all subsequent offers.", "normal"),
      createBlock("Harvard Negotiation Project guidance: If you possess reliable market intelligence, drop the anchor first—not as a single rigid number, but as a strategic, ambitious range (e.g., $5,000 – $6,200). Columbia Business School research proves employers instinctively accept the lower bound as a cooperative compromise.", "normal"),
      createBlock("3. FBI Calibrated Questions by Chris Voss", "h3"),
      createBlock("Former FBI lead hostage negotiator Chris Voss ('Never Split the Difference') emphasizes shifting problem-solving pressure back to the counterpart using 'How' and 'What' questions.", "normal"),
      createBlock("Script Example:", "normal"),
      createBlock("Employer: 'We love your profile, but our absolute ceiling for this role is $3,200.'", "blockquote"),
      createBlock(">", "normal"),
      createBlock("You: 'I completely respect your budget constraints and desire to optimize overhead. Given the critical business goals and revenue targets expected from this role, how can we structure compensation so we both succeed?'", "blockquote"),
      createBlock("4. Total Compensation: Beyond Base Salary", "h3"),
      createBlock("1. **Hybrid/Remote Flexibility:** Working remotely 2 days a week saves 30+ hours of commuting monthly and significant transit overhead.", "normal"),
      createBlock("2. **Professional Development Stipend:** Annual budget allocation for international conferences and specialized tooling.", "normal"),
      createBlock("3. **Documented Review Milestones:** 'Upon meeting X performance metric within the 90-day onboarding period, base compensation automatically scales to $4,500.'", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Malhotra, D. (Harvard Business Review) – '15 Rules for Negotiating a Job Offer'.", "normal"),
      createBlock("2. Kahneman, D. – 'Thinking, Fast and Slow'.", "normal"),
      createBlock("3. Voss, C. – 'Never Split the Difference'.", "normal")
    ],
    body_az: [
      createBlock("Gəlin səmimi olaq: əmək bazarında ən böyük tabulardan biri maaş haqqında açıq danışmaqdır.", "normal"),
      createBlock("Uşaqlıqdan bəri bizə aşılanan \"pulu çox soruşmaq ayıbdır\" təfəkkürü peşəkar həyatımıza keçəndə böyük maliyyə itkisinə çevrilir. Nəticədə eyni bacarığa malik iki mütəxəssisdən biri ayda 700 AZN alarkən, digəri düzgün danışıq apardığı üçün 1600 AZN qazanır.", "normal"),
      createBlock("Harvard Universitetinin professoru Dikpak Malhotra və Nobel mükafatçısı Daniel Kanemanın araşdırmaları göstərir ki, maaş danışığı 100% davranış iqtisadiyyatı və psixologiyaya əsaslanan idarəolunan bir prosesdir.", "normal"),
      createBlock("1. Masanın Digər Tərəfi: HR Əslində Nə Düşünür?", "h3"),
      createBlock("LinkedIn-in qlobal hesabatına görə, işəgötürənlərin 73%-nin hər vakansiya üçün əvvəlcədən təsdiqlənmiş büdcə dəhlizi olur (məsələn: 900 – 1400 AZN).", "normal"),
      createBlock("* Əgər ilk olaraq \"Mənim üçün 800 AZN bəs edər\" desəniz, HR daxilən sevinərək büdcəyə qənaət edir.", "normal"),
      createBlock("* Əgər dəyəri əsaslandırıb \"1400 AZN\" desəniz, şirkət yenə də sizi işə götürür, çünki bu məbləğ onların onsuz da təsdiqlənmiş dəhlizinin içindədir.", "normal"),
      createBlock("2. \"Lövbər Effekti\": İlk Rəqəmi Kim Deməlidir?", "h3"),
      createBlock("Daniel Kanemanın kəşf etdiyi Lövbər Effektinə görə, masada səslənən ilk rəqəm bütün sonrakı müzakirələrin mərkəzinə çevrilir.", "normal"),
      createBlock("Harvard tövsiyəsi: Bazar dəyərini bilirsinizsə, lövbəri birinci siz atın; amma tək rəqəmlə yox, 'Strateji Aralıq' (məsələn: 1200 - 1500 AZN) ilə. Bu zaman işəgötürən aralığın minimumunu kompromis kimi qəbul edir.", "normal"),
      createBlock("3. Kris Vossdan 'Kalibrlənmiş Suallar'", "h3"),
      createBlock("Keçmiş FTB girov danışıqçısı Kris Vossun metodu: 'Necə?' sualları ilə təzyiqi qarşı tərəfə ötürmək.", "normal"),
      createBlock("Şirkət: \"Biz sizə maksimum 700 AZN təklif edə bilərik.\"", "blockquote"),
      createBlock(">", "normal"),
      createBlock("Siz: \"Büdcə çərçivənizi tam başa düşürəm. Eyni zamanda, bu vəzifədə məndən gözlənilən hədəfləri nəzərə alsaq, bu büdcə ilə qarşılıqlı olaraq necə irəliləyə bilərik?\"", "blockquote"),
      createBlock("4. 'Total Compensation' Paketi", "h3"),
      createBlock("1. Hibrid/Uzaqdan iş imkanı (ayda 100-150 AZN və 30 saat qənaət).", "normal"),
      createBlock("2. İllik təhsil və konfrans büdcəsi.", "normal"),
      createBlock("3. Rəsmi artım protokolu: '3 aylıq sınaqdan sonra maaş 1200 AZN-ə qaldırılır.'", "normal"),
      createBlock("Mənbələr:", "h3"),
      createBlock("1. Malhotra, D. (HBR) – '15 Rules for Negotiating a Job Offer'.", "normal"),
      createBlock("2. Kahneman, D. – 'Thinking, Fast and Slow'.", "normal"),
      createBlock("3. Voss, C. – 'Never Split the Difference'.", "normal")
    ],
    seo: {
      metaTitle: "Maaş Danışığında Harvard Metodu: Şirkətlərin Qiymət Tələsindən Çıxış | Rvan.me",
      metaDescription: "Müsahibədə ilk rəqəmi kim deməlidir? Daniel Kanemanın Lövbər effekti, FTB danışıqçısı Kris Vossun sualları və yüksək təklif almağın dəqiq skriptləri.",
      canonicalUrl: "https://www.rvan.me/blog/salary-negotiation-psychology-harvard-method"
    }
  },

  // ── 02. Beautiful Design Loses Money ──
  {
    _id: "blog-masterclass-gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    title: "Why Beautiful Design Loses Money: Dribbble vs Real UX",
    title_az: "Gözəl Dizayn Niyə Pul İtirir? Dribbble Mifləri və UX Reallığı",
    slug: { _type: "slug", current: "why-beautiful-design-loses-money-nng-research" },
    slug_az: { _type: "slug", current: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group" },
    originalSlug: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    category: "UI/UX & Product Design",
    category_az: "UI/UX & Rəqəmsal Məhsul",
    excerpt: "Why Dribbble-perfect visual concepts destroy checkout conversion rates in production. Baymard Institute's 68.8% cart abandonment research and 4 critical business metrics that triple designer value.",
    excerpt_az: "Dribbble-dakı min layklı dizaynlar real biznesdə niyə satışları öldürür? Baymard İnstitutunun 68.8% səbət tərki araşdırması və dizaynerin dəyərini artıran 4 biznes metrikası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal visual representation of UX friction and conversion architecture",
    },
    publishDate: "24 Avqust 2026",
    readTime: "9 min read",
    featured: true,
    authorName: "Leyla Karimova",
    authorRole: "Senior Product Designer & UX Researcher",
    authorSlug: "leyla-karimova",
    tags: ["uiux", "product-design", "baymard", "nngroup", "ecommerce", "conversion", "metrics"],
    body: [
      createBlock("A pervasive fallacy circulates modern digital design: 'If a product looks aesthetic, modern, and colorful, it will inherently succeed.'", "normal"),
      createBlock("Every year, thousands of designers ship glowing concepts that accumulate thousands of likes on Dribbble and Behance. Yet when deployed into production, sales crater and users bounce in frustration.", "normal"),
      createBlock("1. Baymard Institute Benchmark: 68.8% Cart Abandonment", "h3"),
      createBlock("Analyzing over 48,000 global checkout interactions, the Baymard Institute reveals an average e-commerce cart abandonment rate of 68.8%. Primary friction points include:", "normal"),
      createBlock("* 24% – Mandatory forced account creation before purchase.", "normal"),
      createBlock("* 18% – Overly complicated multi-step checkout sequences.", "normal"),
      createBlock("* 17% – Hidden or unexpected shipping and handling surcharges.", "normal"),
      createBlock("2. Nielsen Norman Group (NN/g): The F-Shape Scanning Paradigm", "h3"),
      createBlock("Pioneered by Don Norman and Jakob Nielsen, eye-tracking research proves web users do not read interfaces like books—they scan in an F-shaped pattern.", "normal"),
      createBlock("When Call-to-Action (CTA) triggers violate this natural reading vector, cognitive friction spikes and bounce rates surge.", "normal"),
      createBlock("3. Production Case Study: How Radical Simplicity Increased Conversions by +42%", "h3"),
      createBlock("In an on-demand delivery app redesign:", "normal"),
      createBlock("* Account registration was removed entirely (replaced by SMS OTP).", "normal"),
      createBlock("* Checkout was consolidated into a single frictionless pane.", "normal"),
      createBlock("* The primary action button was anchored directly in the ergonomic thumb zone.", "normal"),
      createBlock("Result: Checkout completion surged from 32.0% to 45.4%—a net +42% revenue increase.", "normal"),
      createBlock("The 4 Core Business Metrics Every Designer Must Measure:", "h3"),
      createBlock("1. **Conversion Rate (CR):** Percentage of active users completing the target business outcome.", "normal"),
      createBlock("2. **Bounce Rate:** Proportion of visitors abandoning without interaction.", "normal"),
      createBlock("3. **Task Completion Rate:** Time-to-value for completing essential flows.", "normal"),
      createBlock("4. **Funnel Drop-Off Rate:** Pinpointing the exact step where users abandon.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Baymard Institute – 'Cart Abandonment Rate Statistics'.", "normal"),
      createBlock("2. Nielsen, J. – 'Eyetracking Web Usability'.", "normal"),
      createBlock("3. Norman, D. – 'The Design of Everyday Things'.", "normal")
    ],
    body_az: [
      createBlock("Dizayn dünyasında çox təhlükəli bir mif var: \"Əgər dizayn estetik və rəngarəngdirsə, o mütləq uğurlu olacaq.\"", "normal"),
      createBlock("Dribbble-da minlərlə layk toplayan animasiyalı dizaynları real biznesə tətbiq etdikdə acı reallıq üzə çıxır: Satışlar kəskin düşür, istifadəçilər çaşqınlıq içində saytı tərk edir.", "normal"),
      createBlock("1. Baymard İnstitutu: 68.8% Səbət Tərki", "h3"),
      createBlock("48.000-dən çox istifadəçini əhatə edən qlobal araşdırmaya görə, onlayn alış-verişdə səbəti tərk edənlərin ortalaması 68.8%-dir. Əsas səbəblər:", "normal"),
      createBlock("* 24% – Məcburi uzun qeydiyyat tələbi.", "normal"),
      createBlock("* 18% – Ödəniş prosesinin həddindən artıq mürəkkəb olması.", "normal"),
      createBlock("* 17% – Sonda gözlənilməz əlavə xərclərin çıxması.", "normal"),
      createBlock("2. NN/g: F-Şəkilli Baxış Modeli", "h3"),
      createBlock("Nielsen Norman Group sübut etdi ki, istifadəçilər saytları kitab kimi oxumur, F-şəkilli trayektoriya ilə gözdən keçirir. Ən vacib düymə bu təbii axına uyğun deyilsə, istifadəçi saytdan çıxır.", "normal"),
      createBlock("3. Sadəlik Satışı Necə 42% Artırdı?", "h3"),
      createBlock("Real çatdırılma xidmətində edilən UX dəyişiklikləri:", "normal"),
      createBlock("* Qeydiyyat tam ləğv edildi (tək SMS kod).", "normal"),
      createBlock("* Checkout tək səhifəyə endirildi.", "normal"),
      createBlock("* Əsas düymə baş barmağın rahat çatdığı Thumb Zone sahəsinə qoyuldu.", "normal"),
      createBlock("Nəticə: Sifarişi tamamlayanların nisbəti 32%-dən 45.4%-ə yüksəldi (+42% xalis artım).", "normal"),
      createBlock("Dizaynerin Dəyərini Artıran 4 Metrika:", "h3"),
      createBlock("1. Conversion Rate (Konversiya dərəcəsi)", "normal"),
      createBlock("2. Bounce Rate (Həmən çıxma faizi)", "normal"),
      createBlock("3. Task Completion Rate (Tapşırığı bitirmə vaxtı)", "normal"),
      createBlock("4. Drop-off Rate (Mərhələdən qopma dərəcəsi)", "normal")
    ],
    seo: {
      metaTitle: "Gözəl Dizayn Niyə Pul İtirir? Dribbble Mifləri və UX Reallığı | Rvan.me",
      metaDescription: "Dribbble-dakı min layklı dizaynlar real biznesdə niyə satışları öldürür? Baymard İnstitutunun 68.8% səbət tərki araşdırması və 4 əsas UX metrikası.",
      canonicalUrl: "https://www.rvan.me/blog/why-beautiful-design-loses-money-nng-research"
    }
  },

  // ── 03. Followers Don't Equal Sales ──
  {
    _id: "blog-masterclass-izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    title: "Why 50K Followers Fail to Sell: Cialdini's Funnel Rules",
    title_az: "50k İzləyici Niyə Satış Gətirmir? Çaldini Qanunları və Satış Qıfı",
    slug: { _type: "slug", current: "why-large-followers-dont-equal-sales-cialdini-funnel" },
    slug_az: { _type: "slug", current: "izleyici-coxlugu-satis-getirmir-cialdini-funnel" },
    originalSlug: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    category: "Marketing & Growth",
    category_az: "Marketinq & SMM",
    excerpt: "The trap of social vanity metrics. Robert Cialdini's persuasion principles and a 3-tier sales funnel that converts cold impressions into high-ticket recurring clients.",
    excerpt_az: "Sosial mediada 'Vanity Metrics' tələsi. Robert Çaldininin 3 psixoloji prinsipi və soyuq izləyicini sadiq alıcıya çevirən 3 pilləli satış qıfı strategiyası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Abstract spheres representing audience density versus conversion depth",
    },
    publishDate: "22 Avqust 2026",
    readTime: "8 min read",
    featured: true,
    authorName: "Tural Aliyev",
    authorRole: "Growth Architect & Performance Marketer",
    authorSlug: "tural-aliyev",
    tags: ["growth", "marketing", "cialdini", "sales-funnel", "conversion", "branding"],
    body: [
      createBlock("A costly illusion dominates modern digital marketing: 'Massive follower counts automatically translate into massive revenue.'", "normal"),
      createBlock("Brands pour extensive budgets into giveaways and follower growth hacks. The result is bloated accounts with 50k+ followers where posts generate virtually zero engagement and zero qualified inquiries.", "normal"),
      createBlock("True commercial value is not determined by follower volume, but by the Audience Trust Index and systematic conversion architecture.", "normal"),
      createBlock("1. Applying Robert Cialdini's Core Persuasion Principles", "h3"),
      createBlock("1. **Social Proof:** Showcasing unfiltered user testimonials, client audio notes, and documented transformation stories. Harvard research shows authentic testimonials boost conversion by up to 270%.", "normal"),
      createBlock("2. **Authority:** Shifting from constant transactional pitches to authoritative industry teardowns that position your brand as the undisputed category leader.", "normal"),
      createBlock("3. **Reciprocity:** Delivering immense upfront value without friction (in-depth guides, diagnostic audits, open frameworks).", "normal"),
      createBlock("2. The 3-Tier Evergreen Sales Funnel:", "h3"),
      createBlock("* **TOFU (Top of Funnel - 60% of Content):** Broadly accessible, highly engaging educational breakdowns that capture intent.", "normal"),
      createBlock("* **MOFU (Middle of Funnel - 30% of Content):** Trust & Authority: In-depth case studies, client breakdowns, behind-the-scenes methodology.", "normal"),
      createBlock("* **BOFU (Bottom of Funnel - 10% of Content):** High-intent direct conversions: Frictionless booking links, clear guarantees, targeted offers.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Cialdini, R. B. – 'Influence: The Psychology of Persuasion'.", "normal"),
      createBlock("2. Berger, J. – 'Contagious: Why Things Catch On'.", "normal")
    ],
    body_az: [
      createBlock("Sosial mediada ən çox pul itkisinə səbəb olan təməl yanılsama: \"İzləyici sayı çoxdursa, satış da çox olacaq.\"", "normal"),
      createBlock("Hər gün minlərlə manat giveaway-lərə xərclənir. Nəticədə 50-100 minlik səhifələr yaranır, amma bir post paylaşanda heç kim rəy yazmır və satış olmur.", "normal"),
      createBlock("Əsl dəyər 'İzləyici sayı'nda deyil, 'Auditoriyanın Güvən İndeksi'ndədir.", "normal"),
      createBlock("1. Robert Çaldininin 3 Qızıl Qaydası", "h3"),
      createBlock("1. **Sosial Sübut:** Real müştəri rəyləri və səs yazıları. Araşdırmalara görə real rəylər satışı 270% artırır.", "normal"),
      createBlock("2. **Avtoritet:** Sadəcə məhsul satmayın, sahənizdə maarifləndirici ekspert təhlilləri verin.", "normal"),
      createBlock("3. **Qarşılıqlılıq:** Əvvəlcə təmənnasız dəyər verin (Pulsuz bələdçi, şablon, analiz).", "normal"),
      createBlock("2. Satış Qıfının 3 Pilləsi:", "h3"),
      createBlock("* **TOFU (60%):** Hər kəs üçün maraqlı, viral maarifləndirici məzmun.", "normal"),
      createBlock("* **MOFU (30%):** Etibar yaradan Case Study və real nəticələr.", "normal"),
      createBlock("* **BOFU (10%):** Birbaşa konkret təklif və aydın çağırış (CTA).", "normal")
    ],
    seo: {
      metaTitle: "50k İzləyici Niyə Satış Gətirmir? Çaldini Qanunları və Satış Qıfı | Rvan.me",
      metaDescription: "Sosial mediada 'Vanity Metrics' tələsi. Robert Çaldininin 3 psixoloji prinsipi və soyuq izləyicini sadiq alıcıya çevirən 3 pilləli satış qıfı strategiyası.",
      canonicalUrl: "https://www.rvan.me/blog/why-large-followers-dont-equal-sales-cialdini-funnel"
    }
  },

  // ── 04. Global Freelancing ──
  {
    _id: "blog-masterclass-qlobal-frilans-upwork-linkedin-saati-40-dollar",
    title: "Commanding $40+/hr Globally: Upwork & LinkedIn Playbook",
    title_az: "Qlobal Frilansda Saatı $40+: Upwork və LinkedIn Satış Skripti",
    slug: { _type: "slug", current: "global-freelancing-upwork-linkedin-40-dollar-hour" },
    slug_az: { _type: "slug", current: "qlobal-frilans-upwork-linkedin-saati-40-dollar" },
    originalSlug: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
    category: "Freelance & Global Business",
    category_az: "Frilanserlik & Qlobal",
    excerpt: "Breaking free from local salary ceilings. The Futur pricing frameworks, high-converting cold proposal architecture, and building an inbound LinkedIn client acquisition engine.",
    excerpt_az: "Yerli bazarın büdcə limitlərindən çıxış yolu. The Futur metodologiyası, qlobal müştəriyə təsir edən Proposal şablonu və LinkedIn Inbound satış sistemi.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Abstract digital network globe representing international freelance client acquisition",
    },
    publishDate: "20 Avqust 2026",
    readTime: "9 min read",
    featured: false,
    authorName: "Ravan Mammadov",
    authorRole: "Founder & Creative Director",
    authorSlug: "ravan-mammadov",
    tags: ["freelance", "upwork", "linkedin", "remote-work", "the-futur", "pricing"],
    body: [
      createBlock("Competing in low-budget local client pools leads straight to creative exhaustion and burnout. By redirecting that exact effort toward international startups and scaleups, professionals routinely secure $40–$80/hr rates or $2,000–$5,000 fixed scopes.", "normal"),
      createBlock("1. The Race-to-the-Bottom Pricing Trap", "h3"),
      createBlock("When enterprise buyers see an $8/hr profile, they instinctively associate it with elevated risk and supervision overhead. Serious international founders prioritize speed, reliability, and business impact over marginal cost savings.", "normal"),
      createBlock("2. The 4-Part Upwork & Proposal Architecture:", "h3"),
      createBlock("1. **First Line:** Directly pinpointing the client's commercial bottleneck without self-aggrandizing introductions.", "normal"),
      createBlock("2. **Second Line:** Concrete proposed solution paired with a 90-second customized Loom video walkthrough.", "normal"),
      createBlock("3. **Third Line:** Proven commercial result achieved on an equivalent project (e.g., +35% conversion lift).", "normal"),
      createBlock("4. **Fourth Line:** Low-friction next step (a 10-minute exploratory discovery alignment call).", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Do, C. (The Futur) – 'Pricing Design & The Psychology of Value'.", "normal"),
      createBlock("2. Upwork Research Institute – 'Freelance Forward Global Report'.", "normal")
    ],
    body_az: [
      createBlock("Yerli bazarda kiçik büdcəli müştərilərlə işləmək insanı tez tükəndirir. Eyni vaxtı və enerjini qlobal startaplara sərf etməklə saatı 40-70$ və ya layihə başına 2000-5000$ qazanmaq tamamilə realdır.", "normal"),
      createBlock("1. Ucuz Qiymətlə Rəqabət Tələsi", "h3"),
      createBlock("Qlobal müştəri saatı 8$ olan profili görəndə keyfiyyətsiz işdən şübhələnir. Onlar üçün əsas məsələ vaxta qənaət və problemin birdəfəlik peşəkar həllidir.", "normal"),
      createBlock("2. Upwork-də 4 Pilləli Proposal Modeli:", "h3"),
      createBlock("1. **1-ci Cümlə:** Birbaşa müştərinin problemini vurğulamaq (adınızı tərifləmədən).", "normal"),
      createBlock("2. **2-ci Cümlə:** Qısa 90 saniyəlik fərdi Loom video izahı.", "normal"),
      createBlock("3. **3-cü Cümlə:** Əvvəlki layihədə əldə edilən konkret nəticə (+35% konversiya).", "normal"),
      createBlock("4. **4-cü Cümlə:** Sadə 10 dəqiqəlik tanışlıq zəngi təklifi.", "normal")
    ],
    seo: {
      metaTitle: "Qlobal Frilansda Saatı $40+: Upwork və LinkedIn Satış Skripti | Rvan.me",
      metaDescription: "Yerli bazarın büdcə limitlərindən çıxış yolu. The Futur metodologiyası, qlobal müştəriyə təsir edən Proposal şablonu və LinkedIn Inbound satış sistemi.",
      canonicalUrl: "https://www.rvan.me/blog/global-freelancing-upwork-linkedin-40-dollar-hour"
    }
  },

  // ── 05. Resumes Rejected in 6 Seconds ──
  {
    _id: "blog-masterclass-cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    title: "Why Resumes Get Rejected in 6s: ATS Secrets & Google XYZ",
    title_az: "CV-lər Niyə 6 Saniyədə Rədd Olur? ATS Robotları və Google Formulu",
    slug: { _type: "slug", current: "why-resumes-get-rejected-in-6-seconds-ats-secrets" },
    slug_az: { _type: "slug", current: "cv-niye-6-saniyede-red-edilir-ats-sistemleri" },
    originalSlug: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    category: "Career & Recruitment",
    category_az: "Karyera & HR",
    excerpt: "Why 75% of resumes are discarded before human screening. Canva layout pitfalls, The Ladders eye-tracking heatmaps, and Google's renowned XYZ impact formula.",
    excerpt_az: "CV-lərin 75%-i niyə insan gözü görmədən rədd edilir? Canva tələsi, The Ladders göz izləmə araşdırması və Google-un məşhur XYZ formulu.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal document layout symbolizing applicant tracking systems and resume screening",
    },
    publishDate: "18 Avqust 2026",
    readTime: "8 min read",
    featured: false,
    authorName: "Aysel Mammadova",
    authorRole: "Senior Talent Partner & Executive Recruiter",
    authorSlug: "aysel-mammadova",
    tags: ["career", "resume", "ats", "hiring", "recruitment", "google-xyz"],
    body: [
      createBlock("Harvard Business School's 'Hidden Workers' study reveals that over 75% of resumes submitted to mid-and-large tier companies are automatically eliminated by Applicant Tracking Systems (ATS) without ever being viewed by a human recruiter.", "normal"),
      createBlock("1. The Canva Template Trap", "h3"),
      createBlock("Complex multi-column visual layouts, embedded skill rating meters, and graphical icons corrupt ATS text parsers, rendering candidate qualifications completely invisible.", "normal"),
      createBlock("2. Google's XYZ Impact Formula", "h3"),
      createBlock("'Accomplished [X] as measured by [Y], by doing [Z].'", "blockquote"),
      createBlock("Example: 'Scaled product signups by 35% in 4 months (X), generating $120K in annualized net revenue (Y) by redesigning onboarding flow and implementing frictionless auth (Z).'", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Harvard Business School – 'Hidden Workers: Untapped Talent'.", "normal"),
      createBlock("2. The Ladders Eye-Tracking Heatmap Study.", "normal")
    ],
    body_az: [
      createBlock("Harvard araşdırması göstərir ki, şirkətlərə daxil olan CV-lərin 75%-dən çoxu insan tərəfindən oxunmadan, birbaşa avtomatlaşdırılmış ATS proqramları tərəfindən rədd edilir.", "normal"),
      createBlock("1. Canva Dizaynları Niyə Keçmir?", "h3"),
      createBlock("2 sütunlu qrafik dizaynlar və şəkillər ATS robotlarının mətni oxumasına mane olur və namizəd avtomatik arxivə gedir.", "normal"),
      createBlock("2. Google-un 'XYZ Formulu'", "h3"),
      createBlock("\"Mən [Z] tətbiq edərək [Y] nəticəsini əldə etdim və bu [X] metrikayla ölçüldü.\"", "blockquote"),
      createBlock("Nümunə: \"Yeni vizual dildən istifadə edərək (Z), şirkətin satışlarını 4 ayda 35% artırdım (X) və aylıq gəlirə 4000 AZN əlavə töhfə verdim (Y).\"", "normal")
    ],
    seo: {
      metaTitle: "CV-lər Niyə 6 Saniyədə Rədd Olur? ATS Robotları və Google Formulu | Rvan.me",
      metaDescription: "CV-lərin 75%-i niyə insan görmədən rədd edilir? Canva tələsi, The Ladders araşdırması və Google-un məşhur XYZ formulu.",
      canonicalUrl: "https://www.rvan.me/blog/why-resumes-get-rejected-in-6-seconds-ats-secrets"
    }
  },

  // ── 06. Who Will AI Really Replace? ──
  {
    _id: "blog-masterclass-sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    title: "Who Will AI Really Replace? MIT & Stanford Studies",
    title_az: "AI Kimləri İşsiz Qoyacaq? MIT və Stanford Araşdırması",
    slug: { _type: "slug", current: "who-will-ai-replace-mit-stanford-studies" },
    slug_az: { _type: "slug", current: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford" },
    originalSlug: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    category: "Artificial Intelligence & Future of Work",
    category_az: "Süni İntellekt & Gələcək",
    excerpt: "Does AI destroy jobs or redistribute value? Insights from MIT's 453-professional benchmark study and high-earning hybrid skill stacks resilient to automation.",
    excerpt_az: "AI iş yerlərini yox edir, yoxsa yenidən bölüşdürür? MIT-nin 453 mütəxəssis üzərindəki eksperimenti və gələcəyin ən yüksək qazanclı hibrid bacarıqları.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal digital neural landscape representing artificial intelligence leverage",
    },
    publishDate: "16 Avqust 2026",
    readTime: "9 min read",
    featured: false,
    authorName: "Kamran Huseynov",
    authorRole: "AI Systems Architect & Tech Lead",
    authorSlug: "kamran-huseynov",
    tags: ["ai", "future-of-work", "mit", "stanford", "automation", "productivity"],
    body: [
      createBlock("Controlled trials by MIT economists Shakked Noy and Whitney Zhang demonstrate that knowledge workers leveraging AI complete core deliverables 37% faster with an 18% improvement in output quality.", "normal"),
      createBlock("AI will not replace humans outright. However, professionals leveraging AI leverage to operate at 2x output velocity will inevitably displace those clinging to legacy operational workflows.", "normal"),
      createBlock("The critical differentiator of the coming decade is not generic 'prompting' skills, but Deep Domain Expertise and systemic workflow orchestration.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Noy, S., & Zhang, W. (MIT) – Science, 2023.", "normal"),
      createBlock("2. Stanford HAI – Artificial Intelligence Index Report 2024.", "normal")
    ],
    body_az: [
      createBlock("MIT tədqiqatı göstərdi ki, AI alətlərindən istifadə edən mütəxəssislər işlərini 37% daha sürətli və 18% daha keyfiyyətli tamamlayırlar.", "normal"),
      createBlock("Süni intellekt insanları əvəz etməyəcək. Amma süni intellektdən istifadə edərək işini 2 qat sürətləndirən bir mütəxəssis, köhnə üsullarla işləyən həmkarını bazardan sıxışdırıb çıxaracaq.", "normal"),
      createBlock("Əsl kritik bacarıq sadəcə 'Prompt yazmaq' deyil, 'Domen Ekspertizası' olacaq.", "normal")
    ],
    seo: {
      metaTitle: "AI Kimləri İşsiz Qoyacaq? MIT və Stanford Araşdırması | Rvan.me",
      metaDescription: "AI iş yerlərini yox edir, yoxsa yenidən bölüşdürür? MIT-nin 453 mütəxəssis üzərindəki eksperimenti və gələcəyin ən yüksək qazanclı hibrid bacarıqları.",
      canonicalUrl: "https://www.rvan.me/blog/who-will-ai-replace-mit-stanford-studies"
    }
  },

  // ── 07. Self-Taught UI/UX Roadmap ──
  {
    _id: "blog-masterclass-sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    title: "Self-Taught UI/UX in 6 Months: The Free Roadmap",
    title_az: "Sıfırdan UI/UX Dizayneri Olmaq: 6 Aylıq Pulsuz Yol Xəritəsi",
    slug: { _type: "slug", current: "self-taught-ui-ux-designer-6-month-roadmap" },
    slug_az: { _type: "slug", current: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite" },
    originalSlug: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    category: "Design & Education",
    category_az: "Təhsil & Dizayn",
    excerpt: "How to transition into product design using open resources. Josh Kaufman's 20-hour accelerated acquisition model, Figma workflow mastery, and engineering two standout case studies.",
    excerpt_az: "Pulsuz resurslarla 6 aya necə peşəkar dizayner olmaq olar? Josh Kaufman-ın sürətli öyrənmə metodu, Figma ustalığı və 2 güclü Case Study formulu.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal design workspace wireframe layout representing UI UX education",
    },
    publishDate: "14 Avqust 2026",
    readTime: "10 min read",
    featured: false,
    authorName: "Nigar Rustamli",
    authorRole: "Product Designer & Design Systems Educator",
    authorSlug: "nigar-rustamli",
    tags: ["uiux", "figma", "product-design", "self-education", "portfolio", "roadmap"],
    body: [
      createBlock("The majority of commercial bootcamps repackage open-access documentation into overpriced modules. With a structured self-directed roadmap, any driven individual can reach hireable junior/mid-level proficiency in 6 months.", "normal"),
      createBlock("Structured 6-Month Curriculum:", "h3"),
      createBlock("* **Months 1–2:** Gestalt Psychology, Typography Systems, 60-30-10 Color Theory, and Figma Auto Layout / Component Architecture.", "normal"),
      createBlock("* **Months 3–4:** Interface Reverse Engineering and Laws of UX cognitive heuristics.", "normal"),
      createBlock("* **Months 5–6:** Engineering 2 deeply researched Case Studies solving real commercial problems.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Kaufman, J. – 'The First 20 Hours'.", "normal"),
      createBlock("2. Yablonski, J. – 'Laws of UX'.", "normal")
    ],
    body_az: [
      createBlock("Bahalı kursların əksəriyyəti sadəcə internetdə pulsuz olan məlumatları təkrar edir. Düzgün planla 6 aya güclü mütəxəssisə çevrilmək mümkündür.", "normal"),
      createBlock("6 Aylıq Dəqiq Plan:", "h3"),
      createBlock("* **1-2-ci Ay:** Qeştalt Psixologiyası, Tipoqrafika, 60-30-10 Rəng Qaydası, Figma Auto Layout və Components.", "normal"),
      createBlock("* **3-4-cü Ay:** Klonlama (Reverse Engineering) və Laws of UX psixologiyası.", "normal"),
      createBlock("* **5-6-cı Ay:** Real biznes problemini həll edən 2 güclü Case Study.", "normal")
    ],
    seo: {
      metaTitle: "Sıfırdan UI/UX Dizayneri Olmaq: 6 Aylıq Pulsuz Yol Xəritəsi | Rvan.me",
      metaDescription: "Pulsuz resurslarla 6 aya necə peşəkar dizayner olmaq olar? Josh Kaufman-ın metodu, Figma ustalığı və 2 güclü Case Study formulu.",
      canonicalUrl: "https://www.rvan.me/blog/self-taught-ui-ux-designer-6-month-roadmap"
    }
  },

  // ── 08. No-Code Framer Monetization ──
  {
    _id: "blog-masterclass-kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    title: "Selling No-Code Websites for $1,500: Framer & Figma",
    title_az: "Kodsüz Veb-Sayt Qurub Satmaq: Framer və Figma Modeli",
    slug: { _type: "slug", current: "building-selling-no-code-websites-framer-figma" },
    slug_az: { _type: "slug", current: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code" },
    originalSlug: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    category: "No-Code & Web Development",
    category_az: "No-Code & Veb",
    excerpt: "Gartner's projection that 70% of new applications will be no-code. The Figma-to-Framer production pipeline and direct outreach scripts for selling high-converting landing pages.",
    excerpt_az: "Gartner-in 70%-lik No-Code proqnozu. Figma-dan Framer-ə 3 addımlıq istehsal zənciri və bizneslərə Landing Page satmağın dəqiq skripti.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal code and modular software building blocks for no-code development",
    },
    publishDate: "12 Avqust 2026",
    readTime: "9 min read",
    featured: false,
    authorName: "Elvin Gasimov",
    authorRole: "No-Code Architect & Frontend Consultant",
    authorSlug: "elvin-gasimov",
    tags: ["framer", "no-code", "web-development", "figma-to-framer", "freelance"],
    body: [
      createBlock("Gartner forecasts that over 70% of new enterprise and commercial web applications will be assembled using Low-Code / No-Code infrastructure.", "normal"),
      createBlock("A solo designer without frontend engineering background can now convert Figma mockups into fully responsive, performant, and SEO-optimized production sites within 48 hours—commanding $500–$1,500 per deployment.", "normal"),
      createBlock("The 3-Step Production Pipeline:", "h3"),
      createBlock("1. **Figma Auto Layout:** Structuring responsive layouts with clean semantic nesting.", "normal"),
      createBlock("2. **Figma to Framer Plugin:** Instant vector-to-production transfer with zero distortion.", "normal"),
      createBlock("3. **Interactivity & Forms:** Deploying rich scroll triggers and integrated lead capture.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Gartner Research – Forecast Analysis: No-Code Development.", "normal"),
      createBlock("2. Framer Documentation & Case Studies.", "normal")
    ],
    body_az: [
      createBlock("Gartner-in proqnozuna görə, dünyada yeni tətbiq və saytların 70%-dən çoxu No-Code alətləri ilə hazırlanacaq.", "normal"),
      createBlock("Tək bir dizayner 1 sətr kod yazmadan Figma dizaynını 2 gün ərzində işlək, animasiyalı və sürətli Framer saytına çevirib 500 - 1500 AZN-ə sata bilər.", "normal"),
      createBlock("3 Addımlıq Zəncir:", "h3"),
      createBlock("1. **Figma:** Auto Layout ilə struktur.", "normal"),
      createBlock("2. **Framer Plugin:** 'Figma to Framer' ilə birbaşa kopyalama.", "normal"),
      createBlock("3. **İnteraktivlik:** Scroll effektləri və inteqrasiya olunmuş formalar.", "normal")
    ],
    seo: {
      metaTitle: "Kodsüz Veb-Sayt Qurub Satmaq: Framer və Figma Modeli | Rvan.me",
      metaDescription: "Gartner-in 70%-lik No-Code proqnozu. Figma-dan Framer-ə 3 addımlıq istehsal zənciri və bizneslərə Landing Page satmağın dəqiq skripti.",
      canonicalUrl: "https://www.rvan.me/blog/building-selling-no-code-websites-framer-figma"
    }
  },

  // ── 09. Value Audit Client Acquisition ──
  {
    _id: "blog-masterclass-0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    title: "Landing Your First $1,000 Client: The Value Audit Method",
    title_az: "0 Təcrübə ilə İlk $1,000 Müştəri: Dəyər Auditi Strategiyası",
    slug: { _type: "slug", current: "landing-first-client-zero-experience-value-audit" },
    slug_az: { _type: "slug", current: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu" },
    originalSlug: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    category: "Business & Client Acquisition",
    category_az: "Satış & Frilans",
    excerpt: "Alex Hormozi's '$100M Leads' core principles. Replacing generic service pitches with 2-minute async Loom revenue audits that compel founders to reply.",
    excerpt_az: "Aleks Hormozinin '$100M Leads' prinsipləri. Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom audit strategiyası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal ascending steps representing first revenue generation and growth",
    },
    publishDate: "10 Avqust 2026",
    readTime: "9 min read",
    featured: false,
    authorName: "Ravan Mammadov",
    authorRole: "Founder & Creative Director",
    authorSlug: "ravan-mammadov",
    tags: ["client-acquisition", "freelance", "sales", "alex-hormozi", "value-audit", "business"],
    body: [
      createBlock("Clients never buy 'design services' or 'code snippets'; business owners invest exclusively in removing friction from their commercial engine.", "normal"),
      createBlock("The 3-Step Value Audit Framework:", "h3"),
      createBlock("1. Identify 10 high-margin businesses with clear digital revenue potential.", "normal"),
      createBlock("2. Uncover 2 critical bottlenecks in their existing checkout or conversion flow.", "normal"),
      createBlock("3. Redesign the broken interface and deliver an asynchronous 2-minute Loom breakdown directly to leadership.", "normal"),
      createBlock("Out of 15 personalized value audits, an average of 2–3 convert into ongoing $500–$1,000 monthly retainer agreements.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Hormozi, A. – '$100M Leads'.", "normal"),
      createBlock("2. Kennedy, D. – 'No B.S. Direct Marketing'.", "normal")
    ],
    body_az: [
      createBlock("İnsanlar heç vaxt sadəcə 'loqo' və ya 'kod' almaq istəmirlər; biznes sahibləri problemlərindən qurtulmaq istəyirlər.", "normal"),
      createBlock("\"Dəyər Auditi\" Addımları:", "h3"),
      createBlock("1. Yaxşı gəlirli 10 yerli biznes seçin.", "normal"),
      createBlock("2. Onların saytındakı 2 kritik problemi tapın.", "normal"),
      createBlock("3. Həmin problemi düzəldib 2 dəqiqəlik Loom videosu ilə sahibkara göndərin.", "normal"),
      createBlock("15 fərdiləşdirilmiş mesajdan ən az 2-si aylıq 500-1000 AZN-lik müqaviləyə çevrilir.")
    ],
    seo: {
      metaTitle: "0 Təcrübə ilə İlk $1,000 Müştəri: Dəyər Auditi Strategiyası | Rvan.me",
      metaDescription: "Aleks Hormozinin '$100M Leads' prinsipləri. Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom audit strategiyası.",
      canonicalUrl: "https://www.rvan.me/blog/landing-first-client-zero-experience-value-audit"
    }
  },

  // ── 10. Digital Products & Passive Income ──
  {
    _id: "blog-masterclass-reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    title: "Passive Income with Digital Assets: Figma & Notion Systems",
    title_az: "Rəqəmsal Şablonlarla Passiv Gəlir: Figma və Notion Modeli",
    slug: { _type: "slug", current: "passive-income-digital-templates-figma-notion" },
    slug_az: { _type: "slug", current: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad" },
    originalSlug: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    category: "Digital Products & Passive Income",
    category_az: "Passiv Gəlir & Məhsul",
    excerpt: "Naval Ravikant's permissionless leverage philosophy. Building recurring digital revenue streams with Figma UI kits, Framer components, and modular Notion operating systems.",
    excerpt_az: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi. Figma UI Kit, Framer Template və Notion şablonları ilə aylıq $500-2000 passiv gəlir qurmaq.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal digital template grid representing scalable passive income assets",
    },
    publishDate: "08 Avqust 2026",
    readTime: "9 min read",
    featured: false,
    authorName: "Farid Jafarov",
    authorRole: "Design Systems Lead & Creator",
    authorSlug: "farid-jafarov",
    tags: ["passive-income", "gumroad", "figma-templates", "notion-templates", "naval-ravikant", "digital-products"],
    body: [
      createBlock("Naval Ravikant: 'If you don't find a way to make money while you sleep, you will work until you die.'", "normal"),
      createBlock("Digital knowledge products carry gross margins exceeding 95%: Build once, sell infinitely with zero inventory friction.", "normal"),
      createBlock("Top 3 High-Demand Digital Product Classes:", "h3"),
      createBlock("1. **Figma UI Kits & Design Systems** ($30–$80)", "normal"),
      createBlock("2. **Framer & Webflow Production Templates** ($49–$99)", "normal"),
      createBlock("3. **Notion Enterprise Productivity OS** ($10–$30)", "normal"),
      createBlock("Distribution Hubs: Gumroad, Lemon Squeezy, Framer Template Marketplace.", "normal"),
      createBlock("Key References:", "h3"),
      createBlock("1. Ravikant, N. – 'How to Get Rich Without Getting Lucky'.", "normal"),
      createBlock("2. Gumroad Creator Economics Report 2024.", "normal")
    ],
    body_az: [
      createBlock("Naval Ravikant: \"Siz yatarkən pul qazanmağın yolunu tapmasanız, hər zaman vaxtınızı satmaq məcburiyyətində qalacaqsınız.\"", "normal"),
      createBlock("Rəqəmsal məhsulun marjası 95%-dən yüksəkdir: 1 dəfə yarat, minlərlə dəfə sat.", "normal"),
      createBlock("Ən Çox Tələbat Olan 3 Məhsul:", "h3"),
      createBlock("1. **Figma UI Kit & Dizayn Sistemləri** ($30-80)", "normal"),
      createBlock("2. **Framer & Webflow Şablonları** ($49-99)", "normal"),
      createBlock("3. **Notion Məhsuldarlıq Sistemləri** ($10-30)", "normal"),
      createBlock("Satış platformaları: Gumroad, Lemon Squeezy, Framer Marketplace.")
    ],
    seo: {
      metaTitle: "Rəqəmsal Şablonlarla Passiv Gəlir: Figma və Notion Modeli | Rvan.me",
      metaDescription: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi. Figma UI Kit, Framer Template və Notion şablonları ilə aylıq $500-2000 passiv gəlir qurmaq.",
      canonicalUrl: "https://www.rvan.me/blog/passive-income-digital-templates-figma-notion"
    }
  },
];
