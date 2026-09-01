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
  title: "How Avis Turned Position No. 2 into a Competitive Advantage",
  title_az: "Avis necə “2-ci yeri” üstünlüyə çevirdi?",
  slug: { _type: "slug", current: "avis-we-try-harder" },
  slug_az: { _type: "slug", current: "avis-2-ci-yeri-ustunluye-cevirdi" },
  originalSlug: "avis-we-try-harder",
  category: "Marketing Psychology",
  category_az: "Marketing Psixologiyası",
  featured: true,
  excerpt: "How a car rental brand losing money for 13 years turned its No. 2 market position into its greatest marketing weapon. The strategy of admitting weakness and the Pratfall Effect.",
  excerpt_az: "13 il zərər edən brend necə oldu ki, bazar liderinə qarşı öz 2-ci yerini ən böyük silahına çevirdi? Zəifliyi etiraf etməyin və Pratfall Effektinin marketinq psixologiyası.",
  coverImage: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-05b84901cc52ea9195189d594335788c9ed1a6ba-1600x1067-jpg" },
    alt: "Avis We Try Harder historical advertising campaign analysis and positioning diagram",
    url: "https://cdn.sanity.io/images/0lqwkcmg/production/35f291a056702bbc7354aee2e0378a7ab73a9781-1600x1067.jpg",
  },
  publishDate: "2026-08-18",
  readTime: "12 min read",
  tags: ["Avis", "We Try Harder", "Pratfall Effect", "Brand Strategy", "Marketing Psychology", "Underdog Marketing"],
  body: [
    createBlock("How Avis Turned Position No. 2 into a Competitive Advantage", "h2"),
    createBlock("In the world of business, almost every brand follows the exact same script: 'We are the best', 'We are the market leader', 'Our quality is unmatched'. Nobody wants to admit their weakness out loud. But in 1962, Avis—a car rental company struggling in a distant second place—did something completely unexpected."),
    createBlock("They were not number one. Hertz was far bigger, with more cars, more locations, and a massive budget. Avis had lost money for 13 consecutive years. Most companies in that position would try to hide their weakness or inflate their numbers. Avis chose a radically different path: they made being No. 2 the core idea of their entire advertising campaign."),

    createBlock("1. The Problem Avis Had: 13 Years in the Shadow of the Leader", "h3"),
    createBlock("In the early 1960s, the US car rental market felt like a near-monopoly. Hertz was the undisputed leader, deeply entrenched in consumer minds as the default choice. Avis, despite its best efforts, had failed to turn a profit between 1949 and 1962."),
    createBlock("In 1962, new Avis CEO Robert Townsend turned to legendary advertising agency Doyle Dane Bernbach (DDB) to pull the company out of the red. Bill Bernbach and copywriter Paula Green faced a daunting question: With Hertz so dominant, why should anyone rent from Avis?"),

    createBlock("2. The 'We Try Harder' Idea", "h3"),
    createBlock("DDB's solution reshaped advertising history. The central campaign premise was disarmingly simple:"),
    createBlock("'Avis is only No. 2 in rent a cars. So why go with us? We try harder.'"),
    createBlock("The brilliance of this slogan lay in its indisputable logic. Instead of ignoring that they were smaller, the campaign reframed it: 'Because we are smaller, we cannot afford dirty ashtrays, half-empty gas tanks, or long lines. If we fail you, you'll leave us for number one. Therefore, we are forced to serve you better.'"),
    createBlock("This was not just a tagline; it was a compelling reason for consumers to choose the underdog."),

    createBlock("3. The Psychology Behind It: The Pratfall Effect Lens", "h3"),
    createBlock("To understand why this strategy resonated so deeply, it helps to examine a key psychological framework: the Pratfall Effect."),
    createBlock("Discovered by social psychologist Elliot Aronson and his colleagues, the Pratfall Effect suggests that a highly competent person or brand becomes more endearing, human, and trustworthy after revealing a minor flaw or vulnerability. Flawless perfection can feel cold and distant; a small admitted flaw builds authentic rapport."),
    createBlock("It is crucial to note an important historical distinction: Aronson's classic Pratfall Effect study was published in 1966, whereas the Avis campaign launched in 1963. DDB did not base their campaign on Aronson's research. Rather, the Pratfall Effect serves as a powerful psychological lens that explains why DDB's intuitive positioning worked so effectively."),

    createBlock("4. Why Admitting Weakness Creates Trust", "h3"),
    createBlock("Consumers are bombarded with hundreds of marketing messages daily. When every company claims to be 'number one', consumer skepticism reaches an all-time high."),
    createBlock("When a brand openly admits a flaw:"),
    createBlock("• Credibility Soars: 'If they are honest enough to admit they are No. 2, their claims about cleaner cars and better service must be true.'"),
    createBlock("• Humanization: The brand transforms from a cold corporation into an energetic team of underdogs fighting for your business."),
    createBlock("• Perceived Motivation: Buyers assume the leader is complacent, while the runner-up is hungry and attentive."),

    createBlock("5. The Actual Campaign Results", "h3"),
    createBlock("The campaign's impact was immediate and dramatic:"),
    createBlock("• In 1962, Avis reported a $3.2 million loss."),
    createBlock("• Within 10 months of launching the campaign in 1963, Avis posted a $1.2 million profit."),
    createBlock("• Avis's market share jumped from 29% to 36%, significantly narrowing the gap with Hertz."),
    createBlock("• The 'We Try Harder' positioning was so effective that Avis ran it for over 50 years."),

    createBlock("6. The Deeper Branding Lesson", "h3"),
    createBlock("The key takeaway for strategists is this: Avis did not simply say 'We are smaller.' Admitting a flaw alone is not enough."),
    createBlock("Avis linked their flaw directly to a meaningful customer benefit (better service, cleaner cars, faster checkouts). A weakness only becomes powerful positioning when it is tied to a compelling reason to buy."),

    createBlock("7. Practical Lessons for Designers & Marketers Today", "h3"),
    createBlock("1. Don't instinctively hide every flaw — Honesty can be your most powerful differentiator."),
    createBlock("2. Connect the flaw to a benefit — Never admit a weakness without explaining how it makes your service better."),
    createBlock("3. Positioning is about comparison — Define your brand relative to where the leader sits in the customer's mind."),
    createBlock("4. Align execution with the claim — Avis gave employees 'We Try Harder' buttons and improved operational standards before launching the ads."),
    createBlock("5. Don't manufacture fake vulnerability — Authenticity must be genuine, or consumers will spot the insincerity."),

    createBlock("Closing Thought", "h3"),
    createBlock("A limitation is not always something to conceal. Frame it correctly, and your greatest weakness might just become your brand's most undeniable competitive advantage.")
  ],
  body_az: [
    createBlock("Avis necə “2-ci yeri” üstünlüyə çevirdi?", "h2"),
    createBlock("Biznes dünyasında demək olar ki, bütün brendlər eyni ssenariyə əməl edir: 'Biz ən yaxşısıyıq', 'Biz bazar lideriyik', 'Bizim keyfiyyətimiz analoqsuzdur'. Çünki heç kim öz zəifliyini ucadan etiraf etmək istəmir. Amma 1962-ci ildə avtomobil icarəsi bazarında çətin vəziyyətdə olan Avis şirkəti tamamilə gözlənilməz bir addım atdı."),
    createBlock("Onlar bazarda 1-ci deyildilər. Hertz şirkəti çox böyük idi, daha çox avtomobili, daha çox filialı və nəhəng reklam büdcəsi var idi. Avis isə düz 13 il idi ki (1949–1962), davamlı olaraq zərərlə işləyirdi. Belə bir vəziyyətdə əksər şirkətlər zəifliklərini gizlətməyə, rəqəmləri bəzəməyə çalışardı. Amma Avis tamam başqa bir yol seçdi: öz 2-ci yerini reklam kampaniyasının mərkəzi ideyasına çevirdi."),

    createBlock("1. Avis-in Problemi: Liderin Kölqəsində 13 İl", "h3"),
    createBlock("1960-cı illərin əvvəllərində ABŞ-da avtomobil icarəsi bazarında tam bir monopoliya ab-havası hakim idi. Hertz bazarda aşkar lider idi və müştərilərin şüurunda 'avtomobil icarəsi' deyəndə ilk xatırlanan brend idi. Avis isə nə qədər çalışsa da, 13 il ərzində gəlir əldə edə bilmirdi."),
    createBlock("1962-ci ildə Avis-in yeni baş icraçı direktoru Robert Townsend şirkəti bu bataqlıqdan çıxarmaq üçün əfsanəvi reklam agentliyi Doyle Dane Bernbach (DDB) ilə əməkdaşlığa başladı. Bill Bernbach və kopirayter Paula Green qarşısında çox çətin bir sual var idi: Hertz bu kadar böyükkən, insanlar niyə Avis-dən maşın götürməlidir?"),

    createBlock("2. 'We Try Harder' İdeyası", "h3"),
    createBlock("DDB agentliyinin təklif etdiyi həll yolu reklam tarixini kökündən dəyişdi. Kampaniyanın əsas mesajı belə idi:"),
    createBlock("'Avis avtomobil icarəsində yalnız 2-ci yerdədir. Bəs onda niyə bizimlə getməlisiniz? Çünki biz daha çox çalışırıq.' (We Try Harder)."),
    createBlock("Bu mesajın gücü onun təkzibedilməz məntiqində idi. Kampaniya 'Biz daha kiçikik' fakta əsaslanan zəifliyi belə bir mənaya çevirdi: 'Biz 1-ci yer sahibi kimi rahat arxayınlaşa bilmərik. Əgər maşında külqabı çirklidirsə, əgər benzin çəni tam doludursa, əgər növbə uzundursa — biz müştərini itirərik. Deməli, sizə daha yaxşı xidmət göstərməyə məcburuq.'"),
    createBlock("Bu, sadəcə bir deviz deyildi; bu, rəqabət şəraitində istehlakçı üçün tamamilə məntiqli bir seçim arqumenti idi."),

    createBlock("3. Arxasındakı Psixologiya: Pratfall Effekti Nə Deyir?", "h3"),
    createBlock("Bu strategiyanın niyə bu qədər dərin təsir bağışladığını başlamaq üçün psixologiyadakı cəlbedici bir fenomene — Pratfall Effektinə (Pratfall Effect) baxmaq faydalıdır."),
    createBlock("Sosial psixoloq Elliot Aronson və həmkarları tərəfindən aparılan tədqiqata görə, yüksək səriştəyə malik bir insan və ya brend kiçik bir qüsurunu etiraf etdikdə, o, insanların gözündə daha sevimli, səmimi və etibarlı görünməyə başlayır. Mükəmməllik bəzən soyuq və uzaq hiss etdirir, kiçik nüsxələr isə brendi insaniləşdirir."),
    createBlock("Dəqiq tarixi faktı vurğulamaq vacibdir: Aronsonun Pratfall Effekti haqqında məşhur elmi məqaləsi 1966-cı ildə dərc olunub. Avis-in 'We Try Harder' kampaniyası isə 1963-cü ildə işə düşüb. Yəni DDB agentliyi bu reklamı hazırlayarkən psixoloji elmi məqalədən istifadə etməmişdi. Pratfall Effekti — kampaniyanın uğurunu illər sonra elmi baxımdan izah edən mühüm bir psixoloji çərçivə və obyektivdir."),

    createBlock("4. Zəifliyi Boynuna Almaq Niyə Etabar Yaradır?", "h3"),
    createBlock("İstehlakçılar hər gün yüzlərlə reklam mesajı ilə bombardman olunurlar və hər kəsin 'ən yaxşı' olduğunu iddia etdiyi bir mühitdə təbii bir müdafiə mexanizmi (şübhəçilik) formalaşır."),
    createBlock("Bir brend öz zəifliyini etiraf etdikdə baş verənlər:"),
    createBlock("• İnam və Səmimiyyət: 'Əgər onlar 2-ci yerdə olduqlarını etiraf edirlərsə, deməli, xidmətimiz haqqında dedikləri digər sözlər də həqiqətdir.'"),
    createBlock("• İnsanilik və Təvazökarlıq: Mükəmməl görünməyə çalışan soyuq korporasiya yerinə, daha çox çalışan canlı bir komanda imici yaranır."),
    createBlock("• Motivasiya Təsəvvürü: Müştəri 1-ci yerdəki brendin toxunulmazlıq arxayınlığına qapıldığını, 2-ci yerin isə hər müştəri üçün mübarizə apardığını düşünür."),

    createBlock("5. Kampaniyanın Real Nəticələri: Rəqəmlər Nə Deyir?", "h3"),
    createBlock("Avis kampaniyasının nəticələri təkcə alqışlarla bitmədi, maliyyə göstəricilərində kəskin dönüş yaratdı:"),
    createBlock("• 1962-ci ildə Avis 3.2 milyon dollar zərər edirdı."),
    createBlock("• Kampaniya başladıqdan vur-tut 10 ay sonra, 1963-cü ildə şirkət 1.2 milyon dollar xalis mənfəətə keçdi."),
    createBlock("• Şirkətin bazar payı qısa müddətdə 29%-dən 36%-ə yüksəldi və Hertz ilə aradakı fərq tarixdə ilk dəfə ciddi şəkildə azaldı."),
    createBlock("• 'We Try Harder' ideyası o qədər uğurlu oldu ki, brend bu devizdən 50 ildən artıq müddətdə istifadə etməyə davam etdi."),

    createBlock("6. Dərin Brend Dərsi: Zəifliyi Faydası İlə Birləşdirmək", "h3"),
    createBlock("Burada ən mühüm nüans budur: Avis kampaniyası təkcə 'Biz pisik' və ya 'Biz kiçikik' demirdi. Zəifliyi etiraf etmək təkbaşına kifayət deyil."),
    createBlock("Avis zəifliyi (2-ci olmaq) müştəri üçün birbaşa fayda ilə (daha təmiz maşınlar, daha tez xidmət, daha çox qayğı) bağlaya bildi. Zəiflik yalnız o zaman güclü mövqeləndirməyə çevrilir ki, o, müştərinin aldığı dəyərlə birbaşa əlaqələndirilsin."),

    createBlock("7. Dizaynerlər və Marketoloqlar Üçün 5 Praktiki Dərs", "h3"),
    createBlock("1. Hər zəifliyi gizlətməyə çalışmayın — Bəzən dürüstlük ən yaxşı fərqlənmə alətidir."),
    createBlock("2. Zəifliyin arxasındakı mənanı tapın — Zəifliyi sadəcə etiraf etməyin, onun müştəriyə nə qazandırdığını göstərin."),
    createBlock("3. Mövqeləndirmə müqayisədən doğur — İstehlakçının şüurunda artıq mövcud olan lider brendə nəzərən harada olduğunuzu dəqiq müəyyən edin."),
    createBlock("4. İddia məhsulun reallığı ilə üst-üstə düşməlidir — Avis işçilərinə 'We Try Harder' düymələri paylamışdı və xidmət keyfiyyətini həqiqətən qaldırmışdı."),
    createBlock("5. Süni zəiflik uydurmayın — İnsanlar saxta həssaslığı dərhal hiss edirlər; dürüstlük təbii olmalıdır."),

    createBlock("Nəticə", "h3"),
    createBlock("Problem bəzən gizlətməli olduğunuz bir qüsur deyil. Düzgün çərçivədə təqdim etdikdə, o, brendinizin ən inandırıcı və unudulmaz arqumentinə çevrilə bilər.")
  ]
};
