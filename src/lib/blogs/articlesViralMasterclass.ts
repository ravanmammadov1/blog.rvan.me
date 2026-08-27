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
    title: "Maaş Danışığında İlk Rəqəmi Kim Deməlidir?",
    title_az: "Maaş Danışığında İlk Rəqəmi Kim Deməlidir?",
    deck: "Daniel Kahneman's anchoring bias and FBI negotiation scripts for commanding top-tier offers.",
    deck_az: "Daniel Kanemanın Lövbər effekti və şirkətlərin büdcə tələsindən çıxmaq üçün dəqiq skriptlər.",
    slug: { _type: "slug", current: "salary-negotiation-psychology-harvard-method" },
    slug_az: { _type: "slug", current: "maas-danisigi-psixologiyasi-harvard-metodu" },
    originalSlug: "maas-danisigi-psixologiyasi-harvard-metodu",
    category: "Karyera & Danışıqlar",
    category_az: "Karyera & Danışıqlar",
            format: "Bələdçi",
    cluster: "career",
    excerpt: "Müsahibədə ilk rəqəmi kim deməlidir? Daniel Kanemanın Lövbər effekti, FTB danışıqçısı Kris Vossun sualları və şirkətlərdən yüksək təklif almağın dəqiq skriptləri.",
    excerpt_az: "Müsahibədə ilk rəqəmi kim deməlidir? Daniel Kanemanın Lövbər effekti, FTB danışıqçısı Kris Vossun sualları və şirkətlərdən yüksək təklif almağın dəqiq skriptləri.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Strategic salary negotiation represented by minimal chess pieces on dark background",
    },
    publishDate: "26 Avqust 2026",
    readTime: "8 dəq oxu",
    featured: true,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["karyera", "maas", "musahibe", "hr", "danisiqlar"],
    discussionPrompt: {
      question: "Bir şirkət sizdən maaş gözləntinizi soruşanda ilk rəqəmi siz deyərdiniz, yoxsa onların büdcəsini gözləyərdiniz?",
      question_az: "Bir şirkət sizdən maaş gözləntinizi soruşanda ilk rəqəmi siz deyərdiniz, yoxsa onların büdcəsini gözləyərdiniz?",
      context: "Maaş danışıqlarında ilk addım bütün danışıqların istiqamətini dəyişir. Təcrübənizi bölüşün.",
      context_az: "Maaş danışıqlarında ilk addım bütün danışıqların istiqamətini dəyişir. Təcrübənizi bölüşün.",
    },
    sources: [
      { title: "15 Rules for Negotiating a Job Offer", author: "Deepak Malhotra (Harvard Business Review)", year: 2014 },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: 2011 },
      { title: "Never Split the Difference", author: "Chris Voss", year: 2016 },
    ],
    socialDrafts: {
      linkedin: "Müsahibədə 'Maaş gözləntiniz nədir?' sualına ilk cavab verən tərəf uduzur, yoxsa qazanır? Harvard araşdırmaları və Lövbər effekti haqqında praktiki bələdçi:",
      x: "Maaş danışığında ilk rəqəmi kim deməlidir? Daniel Kanemanın davranış iqtisadiyyatı modeli ilə cavab:",
      instagram: "Maaş gözləntinizi soruşanda dediyiniz ilk rəqəm sizi minlərlə manat ziyana sala bilər. Bəs düzgün cavab nədir?",
    },
    body: [
      createBlock("Müsahibələrin ən kritik məqamı təcrübəniz deyil, 'Maaş gözləntiniz nədir?' sualının verildiyi andır.", "normal"),
      createBlock("Eyni bacarığa və portfelə sahib iki mütəxəssisdən biri ayda 800 AZN alarkən, digərinin 1800 AZN qazanmasının tək səbəbi var: danışıq psixologiyası.", "normal"),
      createBlock("Harvard Universitetinin professoru Dikpak Malhotra və Nobel mükafatçısı Daniel Kanemanın araşdırmaları göstərir ki, maaş danışığı şans deyil, idarəolunan davranış iqtisadiyyatıdır.", "normal"),
      createBlock("1. Masanın Digər Tərəfi: Şirkət Nə Düşünür?", "h3"),
      createBlock("LinkedIn-in qlobal hesabatına görə, işəgötürənlərin 73%-nin hər vakansiya üçün əvvəlcədən təsdiqlənmiş büdcə dəhlizi olur (məsələn: 1000 – 1600 AZN).", "normal"),
      createBlock("* Əgər 'Mənə 900 AZN bəs edər' desəniz, HR daxilən sevinir və büdcəyə qənaət edir.", "normal"),
      createBlock("* Əgər dəyəri əsaslandırıb '1500 AZN' desəniz, şirkət yenə də sizi işə götürür, çünki bu məbləğ onların onsuz da təsdiqlənmiş dəhlizinin içindədir.", "normal"),
      createBlock("2. 'Lövbər Effekti': İlk Rəqəmi Kim Deməlidir?", "h3"),
      createBlock("Daniel Kanemanın kəşf etdiyi Lövbər Effektinə görə, masada səslənən ilk rəqəm bütün sonrakı müzakirələrin mərkəzinə çevrilir.", "normal"),
      createBlock("Harvard tövsiyəsi: Bazar dəyərini bilirsinizsə, lövbəri birinci siz atın; amma tək rəqəmlə yox, 'Strateji Aralıq' (məsələn: 1400 - 1700 AZN) ilə. Bu zaman işəgötürən aralığın minimumunu təbii kompromis kimi qəbul edir.", "normal"),
      createBlock("3. Kris Vossdan 'Kalibrlənmiş Suallar'", "h3"),
      createBlock("Keçmiş FTB girov danışıqçısı Kris Vossun metodu: 'Necə?' sualları ilə təzyiqi qarşı tərəfə ötürmək.", "normal"),
      createBlock("Şirkət: 'Biz sizə maksimum 800 AZN təklif edə bilərik.'", "blockquote"),
      createBlock(">", "normal"),
      createBlock("Siz: 'Büdcə çərçivənizi tam başa düşürəm. Eyni zamanda, bu vəzifədə məndən gözlənilən böyük hədəfləri nəzərə alsaq, bu büdcə ilə qarşılıqlı olaraq necə irəliləyə bilərik?'", "blockquote"),
      createBlock("4. 'Total Compensation' Paketi", "h3"),
      createBlock("1. Hibrid/Uzaqdan iş imkanı (ayda 150 AZN və 35 saat yol vaxtına qənaət).", "normal"),
      createBlock("2. İllik təhsil və konfrans büdcəsi.", "normal"),
      createBlock("3. Rəsmi artım protokolu: '3 aylıq sınaqdan sonra maaş rəsmi 1400 AZN-ə qaldırılır.'", "normal")
    ],
    body_az: [
      createBlock("Müsahibələrin ən kritik məqamı təcrübəniz deyil, 'Maaş gözləntiniz nədir?' sualının verildiyi andır.", "normal"),
      createBlock("Eyni bacarığa və portfelə sahib iki mütəxəssisdən biri ayda 800 AZN alarkən, digərinin 1800 AZN qazanmasının tək səbəbi var: danışıq psixologiyası.", "normal"),
      createBlock("Harvard Universitetinin professoru Dikpak Malhotra və Nobel mükafatçısı Daniel Kanemanın araşdırmaları göstərir ki, maaş danışığı şans deyil, idarəolunan davranış iqtisadiyyatıdır.", "normal"),
      createBlock("1. Masanın Digər Tərəfi: Şirkət Nə Düşünür?", "h3"),
      createBlock("LinkedIn-in qlobal hesabatına görə, işəgötürənlərin 73%-nin hər vakansiya üçün əvvəlcədən təsdiqlənmiş büdcə dəhlizi olur (məsələn: 1000 – 1600 AZN).", "normal"),
      createBlock("* Əgər 'Mənə 900 AZN bəs edər' desəniz, HR daxilən sevinir və büdcəyə qənaət edir.", "normal"),
      createBlock("* Əgər dəyəri əsaslandırıb '1500 AZN' desəniz, şirkət yenə də sizi işə götürür, çünki bu məbləğ onların onsuz da təsdiqlənmiş dəhlizinin içindədir.", "normal"),
      createBlock("2. 'Lövbər Effekti': İlk Rəqəmi Kim Deməlidir?", "h3"),
      createBlock("Daniel Kanemanın kəşf etdiyi Lövbər Effektinə görə, masada səslənən ilk rəqəm bütün sonrakı müzakirələrin mərkəzinə çevrilir.", "normal"),
      createBlock("Harvard tövsiyəsi: Bazar dəyərini bilirsinizsə, lövbəri birinci siz atın; amma tək rəqəmlə yox, 'Strateji Aralıq' (məsələn: 1400 - 1700 AZN) ilə. Bu zaman işəgötürən aralığın minimumunu təbii kompromis kimi qəbul edir.", "normal"),
      createBlock("3. Kris Vossdan 'Kalibrlənmiş Suallar'", "h3"),
      createBlock("Keçmiş FTB girov danışıqçısı Kris Vossun metodu: 'Necə?' sualları ilə təzyiqi qarşı tərəfə ötürmək.", "normal"),
      createBlock("Şirkət: 'Biz sizə maksimum 800 AZN təklif edə bilərik.'", "blockquote"),
      createBlock(">", "normal"),
      createBlock("Siz: 'Büdcə çərçivənizi tam başa düşürəm. Eyni zamanda, bu vəzifədə məndən gözlənilən böyük hədəfləri nəzərə alsaq, bu büdcə ilə qarşılıqlı olaraq necə irəliləyə bilərik?'", "blockquote"),
      createBlock("4. 'Total Compensation' Paketi", "h3"),
      createBlock("1. Hibrid/Uzaqdan iş imkanı (ayda 150 AZN və 35 saat yol vaxtına qənaət).", "normal"),
      createBlock("2. İllik təhsil və konfrans büdcəsi.", "normal"),
      createBlock("3. Rəsmi artım protokolu: '3 aylıq sınaqdan sonra maaş rəsmi 1400 AZN-ə qaldırılır.'", "normal")
    ],
    seo: {
      metaTitle: "Maaş Danışığında İlk Rəqəmi Kim Deməlidir? | Rvan.me",
      metaDescription: "Müsahibədə ilk rəqəmi kim deməlidir? Daniel Kanemanın Lövbər effekti, FTB danışıqçısı Kris Vossun sualları və şirkətlərdən yüksək təklif almağın dəqiq skriptləri.",
      canonicalUrl: "https://www.rvan.me/blog/salary-negotiation-psychology-harvard-method"
    }
  },

  // ── 02. Beautiful Design Loses Money ──
  {
    _id: "blog-masterclass-gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    title: "Gözəl Dizayn Niyə Satmır?",
    title_az: "Gözəl Dizayn Niyə Satmır?",
    deck: "Why Dribbble-style visual perfection kills real checkout conversion rates.",
    deck_az: "Dribbble üslublu animasiyaların real e-ticarətdə səbət tərkini 68%-ə qaldırma səbəbləri.",
    slug: { _type: "slug", current: "why-beautiful-design-loses-money-nng-research" },
    slug_az: { _type: "slug", current: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group" },
    originalSlug: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    category: "UI/UX & Rəqəmsal Məhsul",
    category_az: "UI/UX & Rəqəmsal Məhsul",
            format: "Analiz",
    cluster: "design",
    excerpt: "Dribbble-dakı min layklı dizaynlar real biznesdə niyə satışları öldürür? Baymard İnstitutunun 68.8% səbət tərki araşdırması və dizaynerin dəyərini artıran 4 biznes metrikası.",
    excerpt_az: "Dribbble-dakı min layklı dizaynlar real biznesdə niyə satışları öldürür? Baymard İnstitutunun 68.8% səbət tərki araşdırması və dizaynerin dəyərini artıran 4 biznes metrikası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal visual representation of UX friction and conversion architecture",
    },
    publishDate: "24 Avqust 2026",
    readTime: "9 dəq oxu",
    featured: true,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["uiux", "dizayn", "baymard", "nngroup", "ecommerce", "konversiya"],
    discussionPrompt: {
      question: "Dribbble konsepti ilə real biznes ehtiyacı toqquşanda hansını seçirsiniz: vizual gözəllik, yoxsa konversiya?",
      question_az: "Dribbble konsepti ilə real biznes ehtiyacı toqquşanda hansını seçirsiniz: vizual gözəllik, yoxsa konversiya?",
      context: "Gözəl interfeyslər həmişə funksional olmur. Bəs siz balans nöqtəsini harada görürsünüz?",
      context_az: "Gözəl interfeyslər həmişə funksional olmur. Bəs siz balans nöqtəsini harada görürsünüz?",
    },
    sources: [
      { title: "48 Cart Abandonment Rate Statistics", author: "Baymard Institute", year: 2023 },
      { title: "Eyetracking Web Usability", author: "Jakob Nielsen & Kara Pernice (NN/g)", year: 2010 },
      { title: "The Design of Everyday Things", author: "Don Norman", year: 2013 },
    ],
    body: [
      createBlock("Dizayn dünyasında çox təhlükəli bir mif var: 'Əgər dizayn estetik və rəngarəngdirsə, o mütləq uğurlu olacaq.'", "normal"),
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
      createBlock("Nəticə: Sifarişi tamamlayanların nisbəti 32%-dən 45.4%-ə yüksəldi (+42% xalis artım).", "normal")
    ],
    body_az: [
      createBlock("Dizayn dünyasında çox təhlükəli bir mif var: 'Əgər dizayn estetik və rəngarəngdirsə, o mütləq uğurlu olacaq.'", "normal"),
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
      createBlock("Nəticə: Sifarişi tamamlayanların nisbəti 32%-dən 45.4%-ə yüksəldi (+42% xalis artım).", "normal")
    ],
    seo: {
      metaTitle: "Gözəl Dizayn Niyə Satmır? | Rvan.me",
      metaDescription: "Dribbble-dakı min layklı dizaynlar real biznesdə niyə satışları öldürür? Baymard İnstitutunun 68.8% səbət tərki araşdırması və 4 əsas UX metrikası.",
      canonicalUrl: "https://www.rvan.me/blog/why-beautiful-design-loses-money-nng-research"
    }
  },

  // ── 03. Followers Don't Equal Sales ──
  {
    _id: "blog-masterclass-izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    title: "50K İzləyici Niyə Pul Qazandırmır?",
    title_az: "50K İzləyici Niyə Pul Qazandırmır?",
    deck: "Escaping vanity metrics with Robert Cialdini's persuasion funnel.",
    deck_az: "Sosial mediada rəqəm aldanışı və soyuq izləyicini alıcıya çevirən 3 pilləli satış qıfı.",
    slug: { _type: "slug", current: "why-large-followers-dont-equal-sales-cialdini-funnel" },
    slug_az: { _type: "slug", current: "izleyici-coxlugu-satis-getirmir-cialdini-funnel" },
    originalSlug: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    category: "Marketinq & SMM",
    category_az: "Marketinq & SMM",
            format: "Keys",
    cluster: "marketing",
    excerpt: "Sosial mediada 'Vanity Metrics' tələsi. Robert Çaldininin 3 psixoloji prinsipi və soyuq izləyicini sadiq alıcıya çevirən 3 pilləli satış qıfı strategiyası.",
    excerpt_az: "Sosial mediada 'Vanity Metrics' tələsi. Robert Çaldininin 3 psixoloji prinsipi və soyuq izləyicini sadiq alıcıya çevirən 3 pilləli satış qıfı strategiyası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Abstract spheres representing audience density versus conversion depth",
    },
    publishDate: "22 Avqust 2026",
    readTime: "8 dəq oxu",
    featured: true,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["smm", "marketinq", "cialdini", "satis-qifi", "funnel"],
    discussionPrompt: {
      question: "Sizcə biznes üçün 100 sadiq alıcı daha vacibdir, yoxsa 10.000 passiv izləyici?",
      question_az: "Sizcə biznes üçün 100 sadiq alıcı daha vacibdir, yoxsa 10.000 passiv izləyici?",
      context: "Sosial şəbəkələrdə şişirdilmiş izləyici sayları həqiqətən satışa təsir edir?",
      context_az: "Sosial şəbəkələrdə şişirdilmiş izləyici sayları həqiqətən satışa təsir edir?",
    },
    sources: [
      { title: "Influence: The Psychology of Persuasion", author: "Robert B. Cialdini", year: 2006 },
      { title: "Contagious: Why Things Catch On", author: "Jonah Berger", year: 2013 },
    ],
    body: [
      createBlock("Sosial mediada ən çox pul itkisinə səbəb olan təməl yanılsama: 'İzləyici sayı çoxdursa, satış da çox olacaq.'", "normal"),
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
    body_az: [
      createBlock("Sosial mediada ən çox pul itkisinə səbəb olan təməl yanılsama: 'İzləyici sayı çoxdursa, satış da çox olacaq.'", "normal"),
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
      metaTitle: "50K İzləyici Niyə Pul Qazandırmır? | Rvan.me",
      metaDescription: "Sosial mediada 'Vanity Metrics' tələsi. Robert Çaldininin 3 psixoloji prinsipi və soyuq izləyicini sadiq alıcıya çevirən 3 pilləli satış qıfı strategiyası.",
      canonicalUrl: "https://www.rvan.me/blog/why-large-followers-dont-equal-sales-cialdini-funnel"
    }
  },

  // ── 04. Global Freelancing ──
  {
    _id: "blog-masterclass-qlobal-frilans-upwork-linkedin-saati-40-dollar",
    title: "Qlobal Frilansda Saatı $40+ Necə Qazanılır?",
    title_az: "Qlobal Frilansda Saatı $40+ Necə Qazanılır?",
    deck: "The Futur proposal framework and inbound LinkedIn client acquisition.",
    deck_az: "Yerli büdcə limitlərindən çıxış, The Futur metodologiyası və beynəlxalq müqavilələr.",
    slug: { _type: "slug", current: "global-freelancing-upwork-linkedin-40-dollar-hour" },
    slug_az: { _type: "slug", current: "qlobal-frilans-upwork-linkedin-saati-40-dollar" },
    originalSlug: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
    category: "Frilans & Qlobal Bazar",
    category_az: "Frilans & Qlobal Bazar",
            format: "Bələdçi",
    cluster: "career",
    excerpt: "Yerli bazarın büdcə limitlərindən çıxış yolu. The Futur metodologiyası, qlobal müştəriyə təsir edən Proposal şablonu və LinkedIn Inbound satış sistemi.",
    excerpt_az: "Yerli bazarın büdcə limitlərindən çıxış yolu. The Futur metodologiyası, qlobal müştəriyə təsir edən Proposal şablonu və LinkedIn Inbound satış sistemi.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Abstract digital network globe representing international freelance client acquisition",
    },
    publishDate: "20 Avqust 2026",
    readTime: "9 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["frilans", "upwork", "linkedin", "remote-work", "pricing"],
    discussionPrompt: {
      question: "Qlobal müştəriyə təklif göndərəndə ən çox hansı çətinliklə qarşılaşırsınız: dil baryeri, yoxsa qiymət təyini?",
      question_az: "Qlobal müştəriyə təklif göndərəndə ən çox hansı çətinliklə qarşılaşırsınız: dil baryeri, yoxsa qiymət təyini?",
      context: "Xarici bazarlarla işləyən mütəxəssislərin təcrübəsi digərləri üçün ən böyük bələdçidir.",
      context_az: "Xarici bazarlarla işləyən mütəxəssislərin təcrübəsi digərləri üçün ən böyük bələdçidir.",
    },
    sources: [
      { title: "Pricing Design & The Psychology of Value", author: "Chris Do (The Futur)", year: 2020 },
      { title: "Freelance Forward Global Report", author: "Upwork Research Institute", year: 2023 },
    ],
    body: [
      createBlock("Yerli bazarda kiçik büdcəli müştərilərlə işləmək insanı tez tükəndirir. Eyni vaxtı və enerjini qlobal startaplara sərf etməklə saatı 40-70$ və ya layihə başına 2000-5000$ qazanmaq tamamilə realdır.", "normal"),
      createBlock("1. Ucuz Qiymətlə Rəqabət Tələsi", "h3"),
      createBlock("Qlobal müştəri saatı 8$ olan profili görəndə keyfiyyətsiz işdən şübhələnir. Onlar üçün əsas məsələ vaxta qənaət və problemin birdəfəlik peşəkar həllidir.", "normal"),
      createBlock("2. Upwork-də 4 Pilləli Proposal Modeli:", "h3"),
      createBlock("1. **1-ci Cümlə:** Birbaşa müştərinin problemini vurğulamaq (adınızı tərifləmədən).", "normal"),
      createBlock("2. **2-ci Cümlə:** Qısa 90 saniyəlik fərdi Loom video izahı.", "normal"),
      createBlock("3. **3-cü Cümlə:** Əvvəlki layihədə əldə edilən konkret nəticə (+35% konversiya).", "normal"),
      createBlock("4. **4-cü Cümlə:** Sadə 10 dəqiqəlik tanışlıq zəngi təklifi.", "normal")
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
      metaTitle: "Qlobal Frilansda Saatı $40+ Necə Qazanılır? | Rvan.me",
      metaDescription: "Yerli bazarın büdcə limitlərindən çıxış yolu. The Futur metodologiyası, qlobal müştəriyə təsir edən Proposal şablonu və LinkedIn Inbound satış sistemi.",
      canonicalUrl: "https://www.rvan.me/blog/global-freelancing-upwork-linkedin-40-dollar-hour"
    }
  },

  // ── 05. Resumes Rejected in 6 Seconds ──
  {
    _id: "blog-masterclass-cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    title: "CV-ni 6 Saniyədə Kim Ələyir?",
    title_az: "CV-ni 6 Saniyədə Kim Ələyir?",
    deck: "Decoding ATS algorithms and Google's XYZ impact framework.",
    deck_az: "CV-lərin 75%-nin insan gözü görmədən rədd edilmə səbəbi və Google formulu.",
    slug: { _type: "slug", current: "why-resumes-get-rejected-in-6-seconds-ats-secrets" },
    slug_az: { _type: "slug", current: "cv-niye-6-saniyede-red-edilir-ats-sistemleri" },
    originalSlug: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    category: "Karyera & HR",
    category_az: "Karyera & HR",
            format: "Tədqiqat",
    cluster: "career",
    excerpt: "CV-lərin 75%-i niyə insan gözü görmədən rədd edilir? Canva tələsi, The Ladders göz izləmə araşdırması və Google-un məşhur XYZ formulu.",
    excerpt_az: "CV-lərin 75%-i niyə insan gözü görmədən rədd edilir? Canva tələsi, The Ladders göz izləmə araşdırması və Google-un məşhur XYZ formulu.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal document layout symbolizing applicant tracking systems and resume screening",
    },
    publishDate: "03 Avqust 2026",
    readTime: "8 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["cv", "ats", "rekruting", "google-xyz", "karyera"],
    discussionPrompt: {
      question: "CV hazırlayarkən Canva şablonu işlətmisiniz və nəticəsi nə olub?",
      question_az: "CV hazırlayarkən Canva şablonu işlətmisiniz və nəticəsi nə olub?",
      context: "Qrafik barlar və 2 sütunlu dizaynlar ATS robotlarını çaşdırır. Sizin təcrübəniz necədir?",
      context_az: "Qrafik barlar və 2 sütunlu dizaynlar ATS robotlarını çaşdırır. Sizin təcrübəniz necədir?",
    },
    sources: [
      { title: "Hidden Workers: Untapped Talent", author: "Harvard Business School", year: 2021 },
      { title: "Eye-Tracking Study on Resume Readability", author: "The Ladders", year: 2018 },
    ],
    body: [
      createBlock("Harvard araşdırması göstərir ki, şirkətlərə daxil olan CV-lərin 75%-dən çoxu insan tərəfindən oxunmadan, birbaşa avtomatlaşdırılmış ATS proqramları tərəfindən rədd edilir.", "normal"),
      createBlock("1. Canva Dizaynları Niyə Keçmir?", "h3"),
      createBlock("2 sütunlu qrafik dizaynlar və şəkillər ATS robotlarının mətni oxumasına mane olur və namizəd avtomatik arxivə gedir.", "normal"),
      createBlock("2. Google-un 'XYZ Formulu'", "h3"),
      createBlock("\"Mən [Z] tətbiq edərək [Y] nəticəsini əldə etdim və bu [X] metrikayla ölçüldü.\"", "blockquote"),
      createBlock("Nümunə: \"Yeni vizual dildən istifadə edərək (Z), şirkətin satışlarını 4 ayda 35% artırdım (X) və aylıq gəlirə 4000 AZN əlavə töhfə verdim (Y).\"", "normal")
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
      metaTitle: "CV-ni 6 Saniyədə Kim Ələyir? | Rvan.me",
      metaDescription: "CV-lərin 75%-i niyə insan görmədən rədd edilir? Canva tələsi, The Ladders araşdırması və Google-un məşhur XYZ formulu.",
      canonicalUrl: "https://www.rvan.me/blog/why-resumes-get-rejected-in-6-seconds-ats-secrets"
    }
  },

  // ── 06. Who Will AI Really Replace? ──
  {
    _id: "blog-masterclass-sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    title: "AI Dizaynerləri İşsiz Qoyacaq?",
    title_az: "AI Dizaynerləri İşsiz Qoyacaq?",
    deck: "MIT & Stanford benchmark findings on automation vs hybrid domain leverage.",
    deck_az: "MIT və Stanford araşdırması: AI iş yerlərini yox edir, yoxsa sürətləndirir?",
    slug: { _type: "slug", current: "who-will-ai-replace-mit-stanford-studies" },
    slug_az: { _type: "slug", current: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford" },
    originalSlug: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    category: "Süni İntellekt & Gələcək",
    category_az: "Süni İntellekt & Gələcək",
            format: "Analiz",
    cluster: "ai",
    excerpt: "AI iş yerlərini yox edir, yoxsa yenidən bölüşdürür? MIT-nin 453 mütəxəssis üzərindəki eksperimenti və gələcəyin ən yüksək qazanclı hibrid bacarıqları.",
    excerpt_az: "AI iş yerlərini yox edir, yoxsa yenidən bölüşdürür? MIT-nin 453 mütəxəssis üzərindəki eksperimenti və gələcəyin ən yüksək qazanclı hibrid bacarıqları.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal digital neural landscape representing artificial intelligence leverage",
    },
    publishDate: "28 İyul 2026",
    readTime: "9 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["ai", "future-of-work", "mit", "stanford", "automation"],
    discussionPrompt: {
      question: "AI sizə gündə 3 saat vaxt qazandırsa, bunun müqabilində hansı dizayn işini ona tam həvalə edərdiniz?",
      question_az: "AI sizə gündə 3 saat vaxt qazandırsa, bunun müqabilində hansı dizayn işini ona tam həvalə edərdiniz?",
      context: "AI alətləri gündəlik işlərimizi dəyişir. Siz hansı tapşırıqları avtomatlaşdırmısınız?",
      context_az: "AI alətləri gündəlik işlərimizi dəyişir. Siz hansı tapşırıqları avtomatlaşdırmısınız?",
    },
    sources: [
      { title: "Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence", author: "Shakked Noy & Whitney Zhang (MIT / Science)", year: 2023 },
      { title: "Artificial Intelligence Index Report 2024", author: "Stanford HAI", year: 2024 },
    ],
    body: [
      createBlock("MIT tədqiqatı göstərdi ki, AI alətlərindən istifadə edən mütəxəssislər işlərini 37% daha sürətli və 18% daha keyfiyyətli tamamlayırlar.", "normal"),
      createBlock("Süni intellekt insanları əvəz etməyəcək. Amma süni intellektdən istifadə edərək işini 2 qat sürətləndirən bir mütəxəssis, köhnə üsullarla işləyən həmkarını bazardan sıxışdırıb çıxaracaq.", "normal"),
      createBlock("Əsl kritik bacarıq sadəcə 'Prompt yazmaq' deyil, 'Domen Ekspertizası' olacaq.", "normal")
    ],
    body_az: [
      createBlock("MIT tədqiqatı göstərdi ki, AI alətlərindən istifadə edən mütəxəssislər işlərini 37% daha sürətli və 18% daha keyfiyyətli tamamlayırlar.", "normal"),
      createBlock("Süni intellekt insanları əvəz etməyəcək. Amma süni intellektdən istifadə edərək işini 2 qat sürətləndirən bir mütəxəssis, köhnə üsullarla işləyən həmkarını bazardan sıxışdırıb çıxaracaq.", "normal"),
      createBlock("Əsl kritik bacarıq sadəcə 'Prompt yazmaq' deyil, 'Domen Ekspertizası' olacaq.", "normal")
    ],
    seo: {
      metaTitle: "AI Dizaynerləri İşsiz Qoyacaq? | Rvan.me",
      metaDescription: "AI iş yerlərini yox edir, yoxsa yenidən bölüşdürür? MIT-nin 453 mütəxəssis üzərindəki eksperimenti və gələcəyin ən yüksək qazanclı hibrid bacarıqları.",
      canonicalUrl: "https://www.rvan.me/blog/who-will-ai-replace-mit-stanford-studies"
    }
  },

  // ── 07. Self-Taught UI/UX Roadmap ──
  {
    _id: "blog-masterclass-sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    title: "Portfolio Niyə Diplomdan Güclüdür?",
    title_az: "Portfolio Niyə Diplomdan Güclüdür?",
    deck: "6-month self-directed product design curriculum using open documentation.",
    deck_az: "Bahalı kurslar olmadan, Josh Kaufman metodologiyası ilə 6 aya UI/UX öyrənmək.",
    slug: { _type: "slug", current: "self-taught-ui-ux-designer-6-month-roadmap" },
    slug_az: { _type: "slug", current: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite" },
    originalSlug: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    category: "Təhsil & Dizayn",
    category_az: "Təhsil & Dizayn",
            format: "Bələdçi",
    cluster: "design",
    excerpt: "Pulsuz resurslarla 6 aya necə peşəkar dizayner olmaq olar? Josh Kaufman-ın sürətli öyrənmə metodu, Figma ustalığı və 2 güclü Case Study formulu.",
    excerpt_az: "Pulsuz resurslarla 6 aya necə peşəkar dizayner olmaq olar? Josh Kaufman-ın sürətli öyrənmə metodu, Figma ustalığı və 2 güclü Case Study formulu.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal design workspace wireframe layout representing UI UX education",
    },
    publishDate: "22 İyul 2026",
    readTime: "10 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["uiux", "figma", "product-design", "portfolio", "roadmap"],
    discussionPrompt: {
      question: "İşə qəbulda diplom vacibdir, yoxsa 2 dənə dərindən işlənmiş Case Study?",
      question_az: "İşə qəbulda diplom vacibdir, yoxsa 2 dənə dərindən işlənmiş Case Study?",
      context: "Dizayn sənayesində formal təhsil və portfel arasındakı fərq hər gün böyüyür.",
      context_az: "Dizayn sənayesində formal təhsil və portfel arasındakı fərq hər gün böyüyür.",
    },
    sources: [
      { title: "The First 20 Hours: How to Learn Anything Fast", author: "Josh Kaufman", year: 2013 },
      { title: "Laws of UX", author: "Jon Yablonski", year: 2020 },
    ],
    body: [
      createBlock("Bahalı kursların əksəriyyəti sadəcə internetdə pulsuz olan məlumatları təkrar edir. Düzgün planla 6 aya güclü mütəxəssisə çevrilmək mümkündür.", "normal"),
      createBlock("6 Aylıq Dəqiq Plan:", "h3"),
      createBlock("* **1-2-ci Ay:** Qeştalt Psixologiyası, Tipoqrafika, 60-30-10 Rəng Qaydası, Figma Auto Layout və Components.", "normal"),
      createBlock("* **3-4-cü Ay:** Klonlama (Reverse Engineering) və Laws of UX psixologiyası.", "normal"),
      createBlock("* **5-6-cı Ay:** Real biznes problemini həll edən 2 güclü Case Study.", "normal")
    ],
    body_az: [
      createBlock("Bahalı kursların əksəriyyəti sadəcə internetdə pulsuz olan məlumatları təkrar edir. Düzgün planla 6 aya güclü mütəxəssisə çevrilmək mümkündür.", "normal"),
      createBlock("6 Aylıq Dəqiq Plan:", "h3"),
      createBlock("* **1-2-ci Ay:** Qeştalt Psixologiyası, Tipoqrafika, 60-30-10 Rəng Qaydası, Figma Auto Layout və Components.", "normal"),
      createBlock("* **3-4-cü Ay:** Klonlama (Reverse Engineering) və Laws of UX psixologiyası.", "normal"),
      createBlock("* **5-6-cı Ay:** Real biznes problemini həll edən 2 güclü Case Study.", "normal")
    ],
    seo: {
      metaTitle: "Portfolio Niyə Diplomdan Güclüdür? | Rvan.me",
      metaDescription: "Pulsuz resurslarla 6 aya necə peşəkar dizayner olmaq olar? Josh Kaufman-ın metodu, Figma ustalığı və 2 güclü Case Study formulu.",
      canonicalUrl: "https://www.rvan.me/blog/self-taught-ui-ux-designer-6-month-roadmap"
    }
  },

  // ── 08. No-Code Framer Monetization ──
  {
    _id: "blog-masterclass-kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    title: "Kodsüz Sayt Qurub $1500 Qazanmaq",
    title_az: "Kodsüz Sayt Qurub $1500 Qazanmaq",
    deck: "Figma-to-Framer production pipeline and selling high-converting landing pages.",
    deck_az: "Gartner-in 70%-lik proqnozu və tək dizaynerin 48 saata işlək sayt satmaq modeli.",
    slug: { _type: "slug", current: "building-selling-no-code-websites-framer-figma" },
    slug_az: { _type: "slug", current: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code" },
    originalSlug: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    category: "No-Code & Veb",
    category_az: "No-Code & Veb",
            format: "Bələdçi",
    cluster: "strategy",
    excerpt: "Gartner-in 70%-lik No-Code proqnozu. Figma-dan Framer-ə 3 addımlıq istehsal zənciri və bizneslərə Landing Page satmağın dəqiq skripti.",
    excerpt_az: "Gartner-in 70%-lik No-Code proqnozu. Figma-dan Framer-ə 3 addımlıq istehsal zənciri və bizneslərə Landing Page satmağın dəqiq skripti.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal code and modular software building blocks for no-code development",
    },
    publishDate: "16 İyul 2026",
    readTime: "9 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["framer", "no-code", "web-development", "figma"],
    discussionPrompt: {
      question: "No-Code alətləri ənənəvi frontend developerlərin işini azaldacaq, yoxsa onların işini sürətləndirəcək?",
      question_az: "No-Code alətləri ənənəvi frontend developerlərin işini azaldacaq, yoxsa onların işini sürətləndirəcək?",
      context: "Framer və Webflow ilə sayt qurmaq artıq günlərlə deyil, saatlarla ölçülür.",
      context_az: "Framer və Webflow ilə sayt qurmaq artıq günlərlə deyil, saatlarla ölçülür.",
    },
    sources: [
      { title: "Forecast Analysis: Low-Code / No-Code Development Technologies", author: "Gartner Research", year: 2023 },
    ],
    body: [
      createBlock("Gartner-in proqnozuna görə, dünyada yeni tətbiq və saytların 70%-dən çoxu No-Code alətləri ilə hazırlanacaq.", "normal"),
      createBlock("Tək bir dizayner 1 sətr kod yazmadan Figma dizaynını 2 gün ərzində işlək, animasiyalı və sürətli Framer saytına çevirib 500 - 1500 AZN-ə sata bilər.", "normal"),
      createBlock("3 Addımlıq Zəncir:", "h3"),
      createBlock("1. **Figma:** Auto Layout ilə struktur.", "normal"),
      createBlock("2. **Framer Plugin:** 'Figma to Framer' ilə birbaşa kopyalama.", "normal"),
      createBlock("3. **İnteraktivlik:** Scroll effektləri və inteqrasiya olunmuş formalar.", "normal")
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
      metaTitle: "Kodsüz Sayt Qurub $1500 Qazanmaq | Rvan.me",
      metaDescription: "Gartner-in 70%-lik No-Code proqnozu. Figma-dan Framer-ə 3 addımlıq istehsal zənciri və bizneslərə Landing Page satmağın dəqiq skripti.",
      canonicalUrl: "https://www.rvan.me/blog/building-selling-no-code-websites-framer-figma"
    }
  },

  // ── 09. Value Audit Client Acquisition ──
  {
    _id: "blog-masterclass-0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    title: "İlk $1,000 Müştəri Necə Tapılır?",
    title_az: "İlk $1,000 Müştəri Necə Tapılır?",
    deck: "Alex Hormozi's '$100M Leads' principles applied to async Loom revenue audits.",
    deck_az: "Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom auditi.",
    slug: { _type: "slug", current: "landing-first-client-zero-experience-value-audit" },
    slug_az: { _type: "slug", current: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu" },
    originalSlug: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    category: "Satış & Frilans",
    category_az: "Satış & Frilans",
            format: "Bələdçi",
    cluster: "strategy",
    excerpt: "Aleks Hormozinin '$100M Leads' prinsipləri. Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom audit strategiyası.",
    excerpt_az: "Aleks Hormozinin '$100M Leads' prinsipləri. Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom audit strategiyası.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal ascending steps representing first revenue generation and growth",
    },
    publishDate: "10 İyul 2026",
    readTime: "9 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["musteri-tapmaq", "frilans", "satis", "alex-hormozi"],
    discussionPrompt: {
      question: "Müştəriyə soyuq mesaj yazanda hansı üsul daha çox cavab gətirir: portfel linki, yoxsa fərdi video audit?",
      question_az: "Müştəriyə soyuq mesaj yazanda hansı üsul daha çox cavab gətirir: portfel linki, yoxsa fərdi video audit?",
      context: "Şablon mesajlar artıq oxunmur. Fərdiləşdirilmiş dəyər necə fərq yaradır?",
      context_az: "Şablon mesajlar artıq oxunmur. Fərdiləşdirilmiş dəyər necə fərq yaradır?",
    },
    sources: [
      { title: "$100M Leads: How to Get Strangers to Want to Buy Your Stuff", author: "Alex Hormozi", year: 2023 },
    ],
    body: [
      createBlock("İnsanlar heç vaxt sadəcə 'loqo' və ya 'kod' almaq istəmirlər; biznes sahibləri problemlərindən qurtulmaq istəyirlər.", "normal"),
      createBlock("\"Dəyər Auditi\" Addımları:", "h3"),
      createBlock("1. Yaxşı gəlirli 10 yerli biznes seçin.", "normal"),
      createBlock("2. Onların saytındakı 2 kritik problemi tapın.", "normal"),
      createBlock("3. Həmin problemi düzəldib 2 dəqiqəlik Loom videosu ilə sahibkara göndərin.", "normal"),
      createBlock("15 fərdiləşdirilmiş mesajdan ən az 2-si aylıq 500-1000 AZN-lik müqaviləyə çevrilir.")
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
      metaTitle: "İlk $1,000 Müştəri Necə Tapılır? | Rvan.me",
      metaDescription: "Aleks Hormozinin '$100M Leads' prinsipləri. Xidmət satmaq yerinə biznesin itirdiyi pulu göstərən 2 dəqiqəlik Loom audit strategiyası.",
      canonicalUrl: "https://www.rvan.me/blog/landing-first-client-zero-experience-value-audit"
    }
  },

  // ── 10. Digital Products & Passive Income ──
  {
    _id: "blog-masterclass-reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    title: "Dizayner Nə Vaxt 'Bahalı' Sayılır?",
    title_az: "Dizayner Nə Vaxt 'Bahalı' Sayılır?",
    deck: "Naval Ravikant's permissionless leverage applied to design templates and recurring assets.",
    deck_az: "Figma UI Kit və Notion sistemləri ilə təkrar satılan rəqəmsal aktivlər yaratmaq.",
    slug: { _type: "slug", current: "passive-income-digital-templates-figma-notion" },
    slug_az: { _type: "slug", current: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad" },
    originalSlug: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    category: "Passiv Gəlir & Məhsul",
    category_az: "Passiv Gəlir & Məhsul",
            format: "Fikir",
    cluster: "strategy",
    excerpt: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi. Figma UI Kit, Framer Template və Notion şablonları ilə aylıq $500-2000 passiv gəlir qurmaq.",
    excerpt_az: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi. Figma UI Kit, Framer Template və Notion şablonları ilə aylıq $500-2000 passiv gəlir qurmaq.",
    coverImage: {
      _type: "image",
      url: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&h=675&fit=crop&auto=format&q=80",
      alt: "Minimal digital template grid representing scalable passive income assets",
    },
    publishDate: "04 İyul 2026",
    readTime: "9 dəq oxu",
    featured: false,
    authorName: "Rəvan Məmmədov",
    authorRole: "Baş Redaktor & Təsisçi",
    authorSlug: "ravan-mammadov",
    tags: ["passiv-gelir", "gumroad", "figma", "notion", "naval-ravikant"],
    discussionPrompt: {
      question: "Müştəri layihələrinə vaxt satmaq daha gəlirlidir, yoxsa öz rəqəmsal məhsulunu qurmaq?",
      question_az: "Müştəri layihələrinə vaxt satmaq daha gəlirlidir, yoxsa öz rəqəmsal məhsulunu qurmaq?",
      context: "Vaxt məhduddur, lakin rəqəmsal məhsul 1 dəfə yaradılıb minlərlə dəfə satıla bilir.",
      context_az: "Vaxt məhduddur, lakin rəqəmsal məhsul 1 dəfə yaradılıb minlərlə dəfə satıla bilir.",
    },
    sources: [
      { title: "How to Get Rich Without Getting Lucky", author: "Naval Ravikant", year: 2019 },
      { title: "Creator Economics Report", author: "Gumroad", year: 2024 },
    ],
    body: [
      createBlock("Naval Ravikant: 'Siz yatarkən pul qazanmağın yolunu tapmasanız, hər zaman vaxtınızı satmaq məcburiyyətində qalacaqsınız.'", "normal"),
      createBlock("Rəqəmsal məhsulun marjası 95%-dən yüksəkdir: 1 dəfə yarat, minlərlə dəfə sat.", "normal"),
      createBlock("Ən Çox Tələbat Olan 3 Məhsul:", "h3"),
      createBlock("1. **Figma UI Kit & Dizayn Sistemləri** ($30-80)", "normal"),
      createBlock("2. **Framer & Webflow Şablonları** ($49-99)", "normal"),
      createBlock("3. **Notion Məhsuldarlıq Sistemləri** ($10-30)", "normal"),
      createBlock("Satış platformaları: Gumroad, Lemon Squeezy, Framer Marketplace.")
    ],
    body_az: [
      createBlock("Naval Ravikant: 'Siz yatarkən pul qazanmağın yolunu tapmasanız, hər zaman vaxtınızı satmaq məcburiyyətində qalacaqsınız.'", "normal"),
      createBlock("Rəqəmsal məhsulun marjası 95%-dən yüksəkdir: 1 dəfə yarat, minlərlə dəfə sat.", "normal"),
      createBlock("Ən Çox Tələbat Olan 3 Məhsul:", "h3"),
      createBlock("1. **Figma UI Kit & Dizayn Sistemləri** ($30-80)", "normal"),
      createBlock("2. **Framer & Webflow Şablonları** ($49-99)", "normal"),
      createBlock("3. **Notion Məhsuldarlıq Sistemləri** ($10-30)", "normal"),
      createBlock("Satış platformaları: Gumroad, Lemon Squeezy, Framer Marketplace.")
    ],
    seo: {
      metaTitle: "Dizayner Nə Vaxt 'Bahalı' Sayılır? | Rvan.me",
      metaDescription: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi. Figma UI Kit, Framer Template və Notion şablonları ilə aylıq $500-2000 passiv gəlir qurmaq.",
      canonicalUrl: "https://www.rvan.me/blog/passive-income-digital-templates-figma-notion"
    }
  },
];
