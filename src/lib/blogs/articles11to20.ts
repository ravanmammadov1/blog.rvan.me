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

export const ARTICLES_11_TO_20: BlogPost[] = [
  // 01. THE ECONOMIST / DECOY EFFECT
  {
    _id: "blog-conversion-rate-optimization-cro",
    title: "How The Economist Changed Our Choices with a Simple Pricing Table",
    title_az: "The Economist qiymət cədvəli ilə seçimimizi necə dəyişdi?",
    slug: { _type: "slug", current: "the-economist-decoy-effect" },
    slug_az: { _type: "slug", current: "the-economist-decoy-effect" },
    originalSlug: "conversion-rate-optimization-cro",
    category: "Marketing Psychology",
    category_az: "Marketinq Psixologiyası",
    excerpt: "How an apparently irrational subscription option shifts consumer preference: An empirical analysis of asymmetric dominance, Dan Ariely's experiment, and contextual choice architecture.",
    excerpt_az: "Məntiqsiz görünən bir abunəlik seçiminin istehlakçı qərarlarına təsiri: Asimmetrik dominantlıq, Dan Ariely-nin təcrübəsi və kontekstual qiymətləndirmə psixologiyası.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-0bad8c12d0fb624f9e0bdb858596f4a419ed1849-1600x1067-jpg" },
      alt: "Conceptual editorial visualization of choice architecture and asymmetric dominance effect",
      url: "https://cdn.sanity.io/images/0lqwkcmg/production/0bad8c12d0fb624f9e0bdb858596f4a419ed1849-1600x1067.jpg",
    },
    publishDate: "2026-04-03",
    readTime: "13 min read",
    featured: true,
    tags: ["The Economist", "Decoy Effect", "Behavioral Economics", "Pricing Psychology", "Asymmetric Dominance", "Choice Architecture"],
    body: [
      createBlock("How The Economist Changed Our Choices with a Simple Pricing Table", "h2"),
      createBlock("Imagine sitting in front of a screen and looking at three subscription choices for a major publication:"),
      createBlock("• Web-only access: $59"),
      createBlock("• Print-only subscription: $125"),
      createBlock("• Print + Web bundle: $125"),
      createBlock("At first glance, the second option appears completely irrational. Why would anyone pay $125 for the print-only version when the exact same $125 buys both print and digital access? Why would a world-class publisher put an option on their menu that seemingly nobody in their right mind would select?"),
      createBlock("This apparently redundant choice unlocks one of the most profound principles in behavioral economics: the Decoy Effect (or Asymmetric Dominance Effect)."),

      createBlock("1. The Option Nobody Picked", "h3"),
      createBlock("To understand why an apparently useless option exists, we have to analyze how the human brain evaluates choices. When a consumer is presented with a choice between two distinct products—a cheaper, lightweight web-only package ($59) and an expensive, comprehensive print-plus-web package ($125)—the decision is cognitively difficult. The user is forced to trade off money against utility."),
      createBlock("By inserting the print-only option at $125, the publisher didn't create a real product to sell. They created an anchor. The print-only option is strictly dominated by the print+web bundle: it costs the exact same price ($125) but offers less value. Suddenly, the print+web bundle no longer feels like an expensive option; it feels like an obvious, high-value bargain."),

      createBlock("2. What Happened When the Option Was Removed?", "h3"),
      createBlock("In his landmark 2008 book Predictably Irrational, MIT behavioral economist Dan Ariely set out to test this exact pricing table with 100 students at MIT Sloan School of Management."),
      createBlock("In the first condition, when students were presented with all three options:"),
      createBlock("• 16% selected Web-only ($59)"),
      createBlock("• 0% selected Print-only ($125)"),
      createBlock("• 84% selected Print + Web ($125)"),
      createBlock("Zero students chose the print-only option. It seemed completely useless. But Ariely then ran a second condition with another 100 students, this time removing the print-only decoy entirely, leaving only Web-only ($59) vs. Print+Web ($125)."),
      createBlock("The results flipped dramatically:"),
      createBlock("• 68% selected Web-only ($59)"),
      createBlock("• 32% selected Print + Web ($125)"),
      createBlock("Removing an option that zero people chose shifted the majority preference from the expensive $125 bundle down to the $59 basic plan. It's crucial to clarify an important distinction: these percentages represent Dan Ariely's controlled academic experiment at MIT, not internal corporate sales conversion data published by The Economist."),

      createBlock("3. What Is the Decoy Effect?", "h3"),
      createBlock("The foundational science behind this phenomenon was established in 1982 by researchers Joel Huber, John W. Payne, and Christopher Puto in their seminal Journal of Consumer Research paper: 'Adding Asymmetrically Dominated Alternatives: Violations of Regularity and the Similarity Hypothesis'."),
      createBlock("They proved that adding an asymmetrically dominated third alternative to a two-option choice set systematically increases the probability of choosing the option that dominates it. The decoy doesn't need to be bought; its mere presence alters the decision framework."),

      createBlock("4. We Don't Judge Price in Isolation", "h3"),
      createBlock("Human beings are notoriously poor at calculating the absolute value of goods and services. Instead, we rely heavily on relative comparison. A $125 subscription evaluated in isolation might feel steep to a casual reader. But placed directly next to another $125 option that offers half as much value, the $125 bundle looks like a rational victory."),

      createBlock("5. Are All Tiered Pricing Tables Decoys?", "h3"),
      createBlock("No. It is important to distinguish legitimate Good/Better/Best customer segmentation from asymmetric dominance. Tiered plans that offer scaled features for different user segments (e.g. Starter, Pro, Enterprise) represent authentic value alignment. A decoy specifically involves a choice structured to make another target alternative look comparatively superior."),

      createBlock("6. Does the Decoy Effect Always Work?", "h3"),
      createBlock("No. Behavioral science shows that the decoy effect is context-dependent. Subsequent replication studies (such as Frederick et al., 2014) demonstrated that boundary conditions exist: attribute clarity, brand trust, user expertise, and transparent information architecture influence the magnitude of the effect. Overusing artificial decoys can erode customer trust."),

      createBlock("7. Key Takeaways for Designers and Marketers", "h3"),
      createBlock("1. Never evaluate a pricing card in isolation; options define each other's context."),
      createBlock("2. Comparison is a fundamental component of information architecture."),
      createBlock("3. A visual UI highlight ('Most Popular') is not the same as a structural behavioral decoy."),
      createBlock("4. Avoid deceptive pricing traps that damage long-term customer trust."),

      createBlock("Closing Thought", "h3"),
      createBlock("Sometimes an option does not exist to be selected. Its true purpose is to change the perspective through which another choice is evaluated.")
    ],
    body_az: [
      createBlock("The Economist qiymət cədvəli ilə seçimimizi necə dəyişdi?", "h2"),
      createBlock("Təsəvvür edin ki, onlayn bir nəşrin abunəlik səhifəsindəsiniz və qarşınızda üç seçim var:"),
      createBlock("• Yalnız Onlayn abunəlik: $59"),
      createBlock("• Yalnız Çap abunəlik: $125"),
      createBlock("• Çap + Onlayn paketi: $125"),
      createBlock("İlkin baxışdan ikinci seçim tamamilə məntiqsiz və absurd görünür: Eyni $125 hesabına həm çap, həm də rəqəmsal girişi almaq mümkün olduğu halda, kim sadəcə çap versiyası üçün $125 ödəyər? Niyə nüfuzlu bir nəşriyyat öz qiymət menyusuna heç kimin seçməyəcəyi aydın olan bir bənd əlavə etsin?"),
      createBlock("Məhz bu absurd görünən variant davranış iqtisadiyyatının ən dərin və maraqlı prinsiplərindən birini ortaya çıxarır: Decoy Effekti (və ya Asimmetrik Dominantlıq Effekti)."),

      createBlock("1. Heç Kimin Seçmədiyi Seçim", "h3"),
      createBlock("Görünüşdə mənasız olan bir seçimin niyə var olduğunu anlamaq üçün insan beyninin variantları necə qiymətləndirdiyinə baxmalırıq. Müştəriyə yalnız iki seçim verildikdə — ucuz, sadə onlayn paket ($59) və baha, hərtərəfli çap+onlayn paketi ($125) — qərar vermək idrak baxımından çətindir. İstifadəçi pul ilə əlavə dəyər arasında birbaşa müqayisə aparmağa məcbur olur."),
      createBlock("$125 qiymətində yalnız çap seçimini əlavə etməklə nəşriyyat əslində satılacaq yeni məhsul yaratmırdı. O, bir lövbər (anchor) yaradırdı. Yalnız çap seçimi Çap+Onlayn paketi tərəfindən tamamilə sıxışdırılır (asimmetrik dominantlıq): qiymət eynidir ($125), amma təklif olunan dəyər daha azdır. Nəticədə, Çap+Onlayn paketi artıq 'baha bir təklif' kimi görünmür; o, qaçırılmaz bir fürsət kimi qavranılır."),

      createBlock("2. O Seçim Çıxarılanda Nə Baş Verdi?", "h3"),
      createBlock("MIT davranış iqtisadçısı Dan Ariely özünün klassik 'Gözlənilən Qeyri-rasionallıq' (Predictably Irrational, 2008) kitabında bu qiymət cədvəlini MIT Sloan Biznes Məktəbinin 100 tələbəsi üzərində sınaqdan keçirdi."),
      createBlock("İlk sınaqda iştirakçılara hər üç seçim təqdim olundu:"),
      createBlock("• 16% tələbə Yalnız Onlayn paketi ($59) seçdi"),
      createBlock("• 0% tələbə Yalnız Çap paketini ($125) seçdi"),
      createBlock("• 84% tələbə Çap + Onlayn paketini ($125) seçdi"),
      createBlock("Heç bir tələbə yalnız çap paketini seçmədi. O, kağız üzərində tamamilə lüzumsuz görünürdü. Sonra Ariely ikinci sınaq keçirdi: digər 100 tələbəyə yalnız iki seçim verildi, lüzumsuz yalnız çap seçimi cədvəldən tamamilə çıxarıldı (Yalnız Onlayn $59 vs. Çap+Onlayn $125)."),
      createBlock("Nəticələr kəskin şəkildə dəyişdi:"),
      createBlock("• 68% tələbə Yalnız Onlayn paketi ($59) seçdi"),
      createBlock("• 32% tələbə Çap + Onlayn paketini ($125) seçdi"),
      createBlock("Heç kimin seçmədiyi bir variantı cədvəldən çıxarmaq əksəriyyətin seçimini $125-lik baha paketdən $59-luq bazis paketə endirdi."),
      createBlock("Mühüm faktoloji fərqləndirmə: Bu faizlər The Economist-in daxili korporativ satış göstəriciləri deyil; Dan Ariely-nin akademik mühitdə keçirdiyi eksperimentin nəticələridir. İki mənbəni fərqləndirmək elmi məsuliyyətin vacib tələbidir."),

      createBlock("3. Decoy Effekti Nədir?", "h3"),
      createBlock("Bu fenomenin akademik təməli 1982-ci ildə tədqiqatçılar Joel Huber, John W. Payne və Christopher Puto tərəfindən 'Journal of Consumer Research' jurnalında dərc olunan məqalədə qoyulub: 'Adding Asymmetrically Dominated Alternatives: Violations of Regularity and the Similarity Hypothesis'."),
      createBlock("Onlar sübut etdilər ki, iki seçimli bir dəstə asimmetrik şəkildə sıxışdırılan üçüncü variant (decoy/yem) əlavə edildikdə, həmin yem tərəfindən üstünlənən variantın seçilmə ehtimalı sistematik olaraq artır. Yem seçimin satılması vacib deyil; onun sadəcə orada olması qərar çərçivəsini dəyişir."),

      createBlock("4. Qiymətə Tək Baxmırıq", "h3"),
      createBlock("İnsanlar məhsul və xidmətlərin mütləq dəyərini hesablamaqda zəifdirlər. Bunun əvəzinə, biz nisbi müqayisəyə söykənirik. Təkbaşına baxıldıqda $125-lik abunəlik baha görünə bilsə də, yarısını təklif edən başqa bir $125-lik variantın yanında həmin $125 rasional bir qələbə kimi görünür. İdrak qiyməti mücərrəd riziyaziyyatla yox, yanındakı kontekstlə ölçür."),

      createBlock("5. Deməli Bütün 'Orta Paketlər' Saxtadır?", "h3"),
      createBlock("Xeyr. Müştəri seqmentasiyasına əsaslanan legitimat paketləri (Good / Better / Best) asimmetrik dominantlıqdan fərqləndirmək vacibdir. Fərqli istifadəçi ehtiyaclarına görə funksiyaları artan paketlər dürüst dəyər bölgüsüdür. Decoy isə xüsusi olaraq başqa bir variantı üstün göstərmək üçün qurulmuş seçim arxitekturasıdır."),

      createBlock("6. Decoy Həmişə İşləyir?", "h3"),
      createBlock("Xeyr. Davranış elmi göstərir ki, decoy effekti universal sehrli formula deyil. Sonrakı tədqiqatlar (məsələn, Frederick et al., 2014) göstərdi ki, effekti müəyyən edən sərhəd şərtləri var: məhsul xüsusiyyətlərinin aydınlığı, brendə olan güvən, istifadəçi təcrübəsi və informasiya arxitekturası fərq yaradır. Süni yemlərdən sui-istifadə etmək müştəri etibarını zədələyə bilər."),

      createBlock("7. Dizayner Və Marketoloq Burada Nə Görməlidir?", "h3"),
      createBlock("• Qiymət kartını heç vaxt təcrid olunmuş şəkildə qiymətləndirməyin; variantlar bir-birinin kontekstini müəyyən edir."),
      createBlock("• Müqayisə informasiya arxitekturasının ayrılmaz tərkib hissəsidir."),
      createBlock("• Vizual olaraq qabardılmış kart ('Ən Məşhur' nişanı) ilə davranış decoys-u (seçim strukturu) eyni şey deyil."),
      createBlock("• İstehlakçı etibarını zədələyən manipulyativ qiymət tələlərindən qaçın."),

      createBlock("Nəticə", "h3"),
      createBlock("Bir seçim bəzən satılmaq üçün var olmur. Onun əsl vəzifəsi — başqa bir seçimin necə görünəcəyini kökündən dəyişdirməkdir.")
    ],
  },

  // 02. FLOPPY DISK & SKEUOMORPHIC INERTIA
  {
    _id: "blog-viral-growth-loops",
    title: "Why Is the Save Icon Still a Floppy Disk in 2026?",
    title_az: "2026-cı İldə Yadda Saxla İkonu Niyə Hələ Də Diskətdir?",
    slug: { _type: "slug", current: "why-save-icon-is-still-a-floppy-disk" },
    slug_az: { _type: "slug", current: "yadda-saxla-ikonu-niye-diskisdir" },
    originalSlug: "viral-growth-loops",
    category: "Design History",
    category_az: "Dizayn Tarixi",
    excerpt: "Skeuomorphic inertia and semiotic shifts: Why an obsolete magnetic storage square from 1981 remains the immortal universal symbol of data persistence.",
    excerpt_az: "Skevomorfizm ətaləti və semiotika: 1981-ci ilin köhnəlmiş 3.5 düymlük disketinin necə məlumatı qorumağın əbədi qlobal simvoluna çevrilməsi.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-3a65720a982c079700c159c099c039d40fcdb744-1600x1067-jpg" },
      alt: "Museum-style technology artifact photograph showing a floppy disk bridging physical storage and digital semiotics",
      url: "https://cdn.sanity.io/images/0lqwkcmg/production/3a65720a982c079700c159c099c039d40fcdb744-1600x1067.jpg",
    },
    publishDate: "2026-04-08",
    readTime: "10 min read",
    featured: true,
    tags: ["Floppy Disk", "Design History", "Semiotics", "Iconography", "Skeuomorphism"],
    body: [
      createBlock("Why Is the Save Icon Still a Floppy Disk in 2026?", "h2"),
      createBlock("Ask any 14-year-old child to identify a real physical 3.5-inch floppy disk, and they might genuinely call it a '3D printed model of the Save button'. I once saw a video of exactly this happening, and it struck me as one of the most amusing paradoxes of modern technology. An artifact that has been functionally obsolete for over two decades remains the undisputed, globally recognized icon for saving data."),
      createBlock("It's a square piece of magnetic tape housed in plastic that maxed out at 1.44 megabytes. You couldn't even fit a single modern iPhone photo on it. So why has no genius UI designer successfully replaced it with a cloud, an arrow pointing into a box, or a minimalist hard drive icon?"),
      createBlock("1. The Immense Cost of Re-learning Universal Symbols", "h3"),
      createBlock("In interface design, clarity always trumps cleverness. Once an arbitrary visual mark achieves global consensus across billions of users and thousands of software applications, the cognitive cost of changing it becomes astronomical. Imagine if Microsoft, Apple, and Google held a secret meeting tomorrow and decided to officially change the Save icon to a downward-pointing cloud arrow. Hundreds of millions of enterprise users would experience immediate panic and disorientation. The floppy disk isn't surviving because it's the most accurate representation of storage; it survives because it is the most recognized."),
      createBlock("2. From Skeuomorphic Affordance to Pure Semiotic Glyphs", "h3"),
      createBlock("There's a fascinating phenomenon in linguistics where words frequently outlive their etymological origins. We still tell people to 'dial a number' even though rotary phones are museum pieces, and we 'roll up the window' in our electric Teslas using a button. The floppy disk icon has completed this exact same evolutionary journey."),
      createBlock("It has transcended its physical origins. It is no longer a skeuomorphic illustration of a magnetic storage device; it has become a pure semiotic glyph. Just like the letter 'A' originated from the shape of an ox's head in ancient Phoenician, the floppy disk is now simply a digital hieroglyph. Its literal meaning is dead, but its symbolic meaning is immortal.")
    ],
    body_az: [
      createBlock("2026-cı İldə Yadda Saxla İkonu Niyə Hələ Də Diskətdir?", "h2"),
      createBlock("İstənilən 14 yaşlı yeniyetmədən fiziki 3.5 düymlük disketi tanımasını istəsəniz, o böyük ehtimalla onu 'Yadda Saxla düyməsinin 3D çap edilmiş modeli' adlandıracaq. Mən bir dəfə məhz bu vəziyyəti əks etdirən video görmüşdüm və bu mənə müasir texnologiyanın ən gülməli paradokslarından biri kimi təsir etmişdi. İyirmi ildən çoxdur ki, istifadədən çıxmış bir əşya hələ də məlumatı qeyd etməyin qlobal miqyasda tanınan tək simvolu olaraq qalır."),
      createBlock("Bu, plastik korpusa yerləşdirilmiş və maksimum tutumu 1.44 meqabayt olan maqnit lent parçasıdır. Siz ona müasir iPhone-la çəkilmiş tək bir şəkli belə sığdıra bilməzsiniz. Bəs niyə indiyə qədər heç bir dahi UI dizayneri onu bulud, qutuya yönəlmiş ox və ya minimalist sərt disk ilə uğurla əvəz edə bilməyib?"),
      createBlock("1. Universal Simvolları Yenidən Öyrənməyin Böyük Qiyməti", "h3"),
      createBlock("İnterfeys dizaynında aydınlıq həmişə ağıllılıqdan üstündür. Bir vizual işarə milyardlarla istifadəçi və minlərlə proqram arasında qlobal konsensusa çatdıqdan sonra onu dəyişdirməyin koqnitiv bədəli həddən artıq yüksək olur. Təsəvvür edin ki, Microsoft, Apple və Google sabah gizli bir iclas keçirib 'Yadda saxla' ikonunu rəsmi olaraq aşağı baxan bulud oxu ilə əvəzləmək qərarına gəlirlər. Yüz milyonlarla korporativ istifadəçi dərhal panika və çaşqınlıq yaşayacaq. Diskət ən dəqiq yaddaş təsviri olduğu üçün yox, ən çox tanınan simvol olduğu üçün həyatda qalır."),
      createBlock("2. Skeomorfizmdən Təmiz Semiotik İşarəyə", "h3"),
      createBlock("Dilçilikdə maraqlı bir fenomen var: sözlər çox vaxt öz etimoloji mənşələrindən daha uzunömürlü olur. Diskli telefonlar muzey eksponatına çevrilsə də biz hələ də 'nömrə yığmaq' deyirik, yaxud düymə ilə işləyən elektrikli Teslamızda 'şüşəni qaldırırıq'. Diskət ikonu da məhz bu eyni təkamül yolunu tamamlamışdır."),
      createBlock("O öz fiziki mənşəyini aşıb keçib. O artıq maqnit yaddaş qurğusunun illüstrasiyası deyil; o, təmiz semiotik bir işarəyə çevrilib. Qədim Finikiyada 'A' hərfinin öküz başı formasından yaranması kimi, diskət də indi sadəcə rəqəmsal bir heroqlifdir. Onun hərfi mənası ölüb, lakin simvolik mənası ölümsüzdür.")
    ]
  },

  // 03. ZERO PRICE EFFECT
  {
    _id: "blog-customer-lifetime-value-ltv",
    title: "Why Does 'Free' Make People Buy Things They Never Wanted?",
    title_az: "'Pulsuz' Sözü İnsanlara Niyə Heç Vaxt İstəmədikləri Şeyləri Aldırır?",
    slug: { _type: "slug", current: "why-free-makes-people-buy-zero-price-effect" },
    slug_az: { _type: "slug", current: "pulsuz-sozunun-qeyri-adi-psixologiyasi" },
    originalSlug: "customer-lifetime-value-ltv",
    category: "Marketing Psychology",
    category_az: "Marketinq Psixologiyası",
    excerpt: "Dan Ariely's Zero Price Effect: Why a drop from 1 cent to 0 cents causes a non-linear psychological explosion in demand compared to a drop from $2 to $1.",
    excerpt_az: "Dan Ariely-nin Sıfır Qiymət Effekti: 1 qəpikdən 0 qəpiyə enməyin insan beynində yaratdığı irrasional emosional təsir və pulsuz çatdırılma sehri.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-690e2ecd41c49d0767045c0186937b128ba51d08-1600x1106-jpg" },
      alt: "Behavioral economics visual metaphor demonstrating the irrational attraction of the zero price effect",
      url: "https://cdn.sanity.io/images/0lqwkcmg/production/690e2ecd41c49d0767045c0186937b128ba51d08-1600x1106.jpg",
    },
    publishDate: "2026-04-10",
    readTime: "12 min read",
    featured: false,
    tags: ["Zero Price Effect", "Behavioral Economics", "Pricing Psychology", "Dan Ariely", "Consumer Habits"],
    body: [
      createBlock("Why Does 'Free' Make People Buy Things They Never Wanted?", "h2"),
      createBlock("Have you ever added an extra $15 item to your online shopping cart, an item you didn't even want, just to qualify for a $5 'Free Shipping' threshold? Logically, you just spent $15 to save $5. It makes absolutely no mathematical sense. Yet, we all do it. Why does the word 'Free' possess such a tyrannical grip over our decision-making faculties?"),
      createBlock("In his landmark book *Predictably Irrational*, MIT behavioral economist Dan Ariely set up a brilliant chocolate stand experiment on campus to test human decision-making. He offered two options:"),
      createBlock("• A premium luxury Lindt truffle (normally worth 50 cents) aggressively priced at 15 cents."),
      createBlock("• An ordinary Hershey's Kiss (normally worth 5 cents) priced at 1 cent."),
      createBlock("At these initial prices, humanity proved quite rational. 73% of people chose the Lindt truffle. They correctly calculated that getting a luxury 50-cent truffle for only 15 cents (a 35-cent value gain) was an incredible deal compared to a 4-cent value gain on the Kiss."),
      createBlock("Then Ariely did something devious. He lowered the price of both items by exactly one single penny:"),
      createBlock("• The Lindt truffle was now 14 cents."),
      createBlock("• The Hershey's Kiss was now FREE (0 cents)."),
      createBlock("The mathematical price difference between the two chocolates remained exactly the same (14 cents). If humans were purely rational economic calculators, their preferences shouldn't have budged an inch. Instead, the results flipped dramatically: **69% of people suddenly chose the Hershey's Kiss!**"),
      createBlock("1. The Emotional Surge of Zero Risk", "h3"),
      createBlock("When something costs even 1 single cent, the brain must perform a cost-benefit calculation. *'Is this worth paying for? What if it's not good?'* There is always a tiny, nagging risk of buyer's remorse."),
      createBlock("When a price drops to absolutely ZERO, that perceived risk vanishes entirely from our cognitive radar. The brain stops viewing 'Free' as a numerical price point and starts processing it as a powerful emotional trigger that signals pure upside with zero downside. That zero-risk euphoria is exactly why sane adults will stand in a line for 45 minutes to get a free scoop of ice cream on 'Free Cone Day'—an item they wouldn't even cross the street to buy for $2 on a normal Tuesday.")
    ],
    body_az: [
      createBlock("'Pulsuz' Sözü İnsanlara Niyə Heç Vaxt İstəmədikləri Şeyləri Aldırır?", "h2"),
      createBlock("Heç 5 dollarlıq 'Pulsuz Çatdırılma' limitini keçmək üçün səbətinizə əslində heç istəmədiyiniz əlavə 15 dollarlıq məhsul əlavə etmisinizmi? Məntiqlə yanaşsaq, 5 dollara qənaət etmək üçün 15 dollar xərclədiniz. Bunun riyazi olaraq heç bir mənası yoxdur. Lakin hamımız bunu edirik. Niyə 'Pulsuz' sözü qərar qəbul etmə qabiliyyətimiz üzərində belə bir avtoritar hakimiyyətə malikdir?"),
      createBlock("MIT davranış iqtisadçısı Dan Ariely özünün klassik *Gözlənilən Qeyri-rasionallıq* kitabında insan qərarlarını sınaqdan keçirmək üçün kampusda dahi bir şokolad stendi təcrübəsi qurdu. O, iki seçim təklif etdi:"),
      createBlock("• Lüks Lindt şokoladı (adətən 50 sent) çox sərfəli şəkildə 15 sentə."),
      createBlock("• Sadə Hershey's şokoladı (adətən 5 sent) 1 sentə."),
      createBlock("Bu ilkin qiymətlərlə bəşəriyyət olduqca rasional davrandı. İnsanların 73%-i Lindt şokoladını seçdi. Onlar haqlı olaraq hesabladılar ki, 50 sentlik lüks şokoladı 15 sentə almaq (35 sent qazanc), Hershey'sdən ediləcək 4 sentlik qazancdan çox daha böyük fürsətdir."),
      createBlock("Sonra Ariely hiyləgər bir addım atdı. Hər iki şokoladın qiymətini dəqiqliklə yalnız 1 qəpik aşağı saldı:"),
      createBlock("• Lindt şokoladı 14 sent oldu."),
      createBlock("• Hershey's şokoladı isə tamamilə PULSUZ (0 sent) oldu."),
      createBlock("İki şokolad arasındakı riyazi fərq yenə də tam olaraq 14 sent olaraq qaldı. İnsanlar sırf rasional iqtisadi maşınlar olsaydılar, seçimləri bir millimetr belə dəyişməməli idi. Lakin nəticələr dramatik şəkildə alt-üst oldu: **İnsanların 69%-i qəfil Hershey's şokoladını seçdi!**"),
      createBlock("1. Sıfır Riskin Emosional Dalğası", "h3"),
      createBlock("Bir şey hətta 1 sentə başa gələndə belə, beyin qazanc-xərc hesabı aparmağa məcbur olur: *'Buna pul verməyə dəyərmi? Ya dadlı olmasa?'* Arxa planda həmişə cüzi də olsa peşmanlıq riski qalır."),
      createBlock("Qiymət tamamilə SIFIRA düşəndə isə, bu qavranılan risk koqnitiv radarımızdan tamamilə yoxa çıxır. Beyin 'Pulsuz' sözünü rəqəmsal qiymət nöqtəsi kimi görməyi dayandırır və onu heç bir itkisi olmayan təmiz qazanc siqnalı verən güclü emosional tətik kimi emal etməyə başlayır. Məhz bu sıfır risk eyforiyasına görə tamamilə sağlam düşüncəli insanlar 'Pulsuz Dondurma Günü'ndə bir top dondurma üçün 45 dəqiqə növbədə dururlar — halbuki normal gündə onu 2 dollara almaq üçün heç küçəni də keçməzdilər.")
    ]
  }
];
