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

export const ARTICLES_01_TO_10: BlogPost[] = [
  // 01. OATLY PACKAGING & DISTINCTIVENESS (VON RESTORFF)
  {
    _id: "blog-visual-hierarchy-masterclass",
    title: "How Oatly Stood Out on the Milk Shelf",
    title_az: "Oatly süd rəfində necə fərqləndi?",
    slug: { _type: "slug", current: "oatly-packaging-design-strategy" },
    slug_az: { _type: "slug", current: "oatly-sud-refinde-nece-ferqlendi" },
    originalSlug: "oatly-packaging-design-strategy",
    category: "Branding Strategy",
    category_az: "Brendinq və Vizual Strategiya",
    excerpt: "How Oatly broke dairy category conventions and turned milk cartons into primary media channels. Packaging strategy, anti-design aesthetics, and the psychology of the Von Restorff Effect.",
    excerpt_az: "Supermarket rəflərindəki oxşar paketlər arasında Oatly necə diqqət çəkdi? Qablaşdırmanı reklam lövhəsinə çevirmək, korporativ qaydaları bozmaq və Von Restorff effektinin psixologiyası.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-eefbef1add712a8e53e76c701307c8ba3e00b287-1376x768-jpg" },
      alt: "Abstract editorial illustration of human eye anatomy with neural pathways and visual cortex processing",
      url: "https://cdn.sanity.io/images/0lqwkcmg/production/eefbef1add712a8e53e76c701307c8ba3e00b287-1376x768.jpg",
    },
    publishDate: "2026-03-01",
    readTime: "11 min read",
    featured: true,
    tags: ["Oatly", "Packaging Design", "Von Restorff Effect", "Brand Strategy", "Design Psychology", "Category Conventions", "Forsman & Bodenfors"],
    body: [
      createBlock("How Oatly Stood Out on the Milk Shelf", "h2"),
      createBlock("Imagine walking down the dairy aisle of a supermarket. Ahead of you is a seamless wall of white and blue cartons, featuring grazing cows, pristine green pastures, and splashing milk drops. Every brand speaks the exact same visual language."),
      createBlock("Then, right in the middle of this predictable lineup, your eyes land on a carton that looks entirely out of place. There are no cows, no pastures, and no traditional food photography. Instead, it features chunky, hand-drawn typography, quirky illustrations, and a bold, self-aware declaration: 'It's like milk, but made for humans.'"),
      createBlock("When Oatly unveiled this redesign, internal reaction was far from unanimous. Certain board members reportedly thought it looked childish and unprofessional for a commercial brand. Yet CEO Toni Petersson and Creative Director John Schoolcraft stood firmly behind the radical new direction. Why would a brand intentionally make its packaging look less polished and less corporate than its competitors?"),

      createBlock("1. What Oatly Looked Like Before", "h3"),
      createBlock("Oatly was founded in Sweden during the 1990s by food scientist Rickard Öste, who invented oat milk. For nearly two decades, the product existed as a quiet, functional alternative for individuals with lactose intolerance or milk allergies. Its packaging resembled a clinical pharmaceutical product—a standard blue-and-white Tetrapak that blended invisibly into grocery shelves."),
      createBlock("By 2012, Oatly was struggling to achieve significant market expansion. The core limitation was positioning: as long as oat milk was viewed strictly as a medical substitute for lactose intolerance, it could never achieve mainstream lifestyle adoption."),

      createBlock("2. Turning the Package into a Billboard", "h3"),
      createBlock("In 2012, Toni Petersson stepped in as CEO and appointed John Schoolcraft as Creative Director. Partnering with Swedish agency Forsman & Bodenfors, they confronted a major constraint: Oatly lacked the multi-million dollar traditional advertising budget of major dairy conglomerates."),
      createBlock("Their strategic breakthrough was simple yet profound: make the carton itself the primary media channel. If you cannot afford massive TV or billboard campaigns, every carton sitting in a customer's hand or on a grocery shelf must function as a poster, magazine page, and brand manifesto."),

      createBlock("3. Why They Intentionally Avoided Looking Corporate", "h3"),
      createBlock("In the dairy and plant-based category, competitors were locked in a race to appear clean, natural, and eco-friendly. Oatly deliberately broke these category conventions:"),
      createBlock("• Hand-Drawn Typography: Instead of sleek corporate typefaces, they introduced blocky, irregular, hand-crafted lettering."),
      createBlock("• Conversational Copy: They replaced dry nutritional copy on the side panels with editorial essays titled 'Hey Random Reader', speaking directly and humanly to the customer."),
      createBlock("• Memorable Slogans: Unapologetic slogans like 'Wow No Cow' and 'It's like milk, but made for humans' directly challenged dairy norms."),
      createBlock("• Shift to Lifestyle Positioning: Oatly transformed oat milk from a medical necessity into a conscious lifestyle choice for anyone seeking an alternative to cow's milk."),

      createBlock("4. What Our Brain Does: The Von Restorff Effect Lens", "h3"),
      createBlock("To understand why Oatly's packaging captures immediate visual attention, social psychology offers a compelling framework: the Von Restorff Effect (or Isolation Effect)."),
      createBlock("First documented in 1933 by German psychiatrist Hedwig von Restorff, the principle demonstrates that when multiple homogeneous items are presented together, the single item that differs significantly from its surrounding context is disproportionately more likely to be noticed and remembered."),
      createBlock("Crucially, distinctiveness is relational. An object is not inherently distinctive on its own; it becomes distinctive only because of the visual uniformity surrounding it. If every milk brand adopted hand-drawn typography tomorrow, Oatly's carton would no longer trigger the isolation effect."),
      createBlock("Importantly, the Von Restorff Effect serves as an explanatory lens for Oatly's success—not proof that the design team explicitly referenced Hedwig von Restorff's 1933 laboratory paper during their creative process."),

      createBlock("5. Being Different Is Not Enough", "h3"),
      createBlock("A common marketing trap is assuming that random eccentricity guarantees brand success. Superficial weirdness without strategic alignment creates meaningless noise."),
      createBlock("Oatly's distinctiveness worked because the anti-corporate visual aesthetic directly reinforced its brand narrative: an agile, rebellious underdog challenging established dairy giants. Visual contrast is only powerful when it aligns with core brand meaning."),

      createBlock("6. Practical Lessons for Designers and Brands", "h3"),
      createBlock("1. Map category conventions first — Before attempting to stand out, catalog the visual tropes, colors, and fonts common to your industry."),
      createBlock("2. Ask 'What is everyone else doing?' — Rather than solely asking 'What looks good?', identify the default choices competitors rely on."),
      createBlock("3. Treat packaging as owned media — Leverage every physical touchpoint as an engaging communication surface."),
      createBlock("4. Distinctiveness requires context — Visual impact depends on contrast against the immediate environment."),
      createBlock("5. Align aesthetics with positioning — Ensure unconventional visual choices reinforce your brand's underlying philosophy."),
      createBlock("6. Evolve when conventions shift — If competitors copy your anti-design aesthetic, distinctiveness fades, requiring new strategic evolution."),

      createBlock("Closing Thought", "h3"),
      createBlock("The primary question shouldn't be 'How can I make this design look more different?' A far more potent question is: 'What does everyone in this category do automatically—and do we actually need to do the same?'")
    ],
    body_az: [
      createBlock("Oatly süd rəfində necə fərqləndi?", "h2"),
      createBlock("Təsəvvür edin ki, supermarketin süd şöbəsindəsiniz. Gözünüzün önündə onlarla müxtəlif markanın paketləri var: hamısı ağ və göy rəngdədir, üzərində otlayan inək, yaşıl otlar və təzə süd damlaları təsvir olunub. Bütün brendlər eyni vizual dili danışır."),
      createBlock("Və qəfildən bu səliqəli rəfin ortasında bir paket görürsünüz: üzərində nə inək var, nə otlaq, nə də ənənəvi qida fotosu. Əvəzində sanki bir dizaynerin deyil, həvəskar birinin əllə çəkdiyi kobud hərflər, qəribə illüstrasiyalar və bir az da iddialı, düşünməyə vadar edən bir cümlə var: 'It's like milk, but made for humans' (Süd kimidir, amma insanlar üçün hazırlanıb)."),
      createBlock("Oatly şirkəti bu yeni qablaşdırmanı təqdim edəndə, idarə heyətindəki bəzi rəhbərlər dəhşətə gəlmişdi. Deyilənə görə, ilk reaksiya belə olmuşdu: 'Bu nədir? Çox uşaqcasına və peşəkarlıqdan uzaq görünür!' Amma Oatly-nin baş icraçı direktoru Toni Petersson və kreativ direktor Con Skoolkraft bu riskə getməkdən çəkinmədilər. Bəs bir brend niyə rəfdəki rəqiblərindən daha az 'korporativ' və daha az 'mükəmməl' görünmək istəsin?"),

      createBlock("1. Oatly Əvvəl Necə Görünürdü?", "h3"),
      createBlock("Oatly 1990-cı illərdə İsveçdə qida alimi Rikard Öste tərəfindən təsis edilmişdi. O zamanlar bu məhsul qluten və laktoza dözümsüzlüyü olan insanlar üçün sırf tibbi, funksional bir alternativ idi. Paketləri aptek dərmanını xatırladan, mavi-ağ rəngli, darıxdırıcı Tetrapak qutuları idi."),
      createBlock("2012-ci ilə qədər Oatly böyüməkdə çətinlik çəkirdi. Çünki məhsul 'laktoza dözümsüzlüyü olan xəstələr üçün əvəzedici' kimi mövqeləndirilmişdi. Brend geniş kütlənin diqqətini çəkmirdi."),

      createBlock("2. Qablaşdırma Reklam Lövhəsinə Çevriləndə", "h3"),
      createBlock("2012-ci ildə Toni Petersson CEO postuna gəldi və Con Skoolkraft-ı kreativ direktor təyin etdi. Şirkət İsveçin məşhur Forsman & Bodenfors agentliyi ilə tərəfdaşlığa başladı."),
      createBlock("Böyük bir problem var idi: Oatly-nin ənənəvi televiziya və ya bilbord reklamlarına xərcləməyə milyonlarla dolları yox idi. Con Skoolkraft və Forsman & Bodenfors komandası dahiyanə bir qərara gəldi: qablaşdırmanın özü onların ən əsas reklam lövhəsi olmalıdır. Əgər böyük media büdcəniz yoxdursa, müştərinin mağazada əlinə aldığı süd qutusu təkcə məhsulu saxlayan qab deyil, həm də jurnal səhifəsi, poster və redaksiya mətni rolunu oynamalıdır."),

      createBlock("3. Niyə Qəsdən 'Korporativ' Görünmədilər?", "h3"),
      createBlock("Süd və bitki südü kateqoriyasında bütün rəqiblər eyni şeyi edirdi: 'təbii', 'sağlam', 'ekoloji' görünməyə çalışırdılar. Oatly bu vizual qaydaları bilərəkdən pozdu:"),
      createBlock("• Əllə çəkilmiş kobud tipoqrafiya: Səliqəli korporativ şriftlər əvəzinə blocky, qeyri-nizamlı hərflərdən istifadə etdilər."),
      createBlock("• Özü ilə zarafat edən mətnlər: Qutunun böyür hissəsinə formal tərkib cədvəli əvəzinə 'Hey Random Reader' başlığı ilə maraqlı mini-esselər yazdılar."),
      createBlock("• Unudulmaz şüarlar: 'Wow No Cow' və 'It's like milk, but made for humans' kimi birbaşa mesajlar tətbiq etdilər."),
      createBlock("• Hədəf auditoriyanın dəyişməsi: Oatly məhsulu 'laktoza xəstələri üçün məcburi alternativ'dən 'inək südü içmək istəməyən müasir insanlar üçün həyat tərzi seçimi'nə çevirdi."),

      createBlock("4. Burada Beynimiz Nə Edir? (Von Restorff Effekti)", "h3"),
      createBlock("Oatly-nin bu uğurunu psixoloji cəhətdən izah etmək üçün Von Restorff Effektinə (Isolation Effect) baxmaq faydalıdır."),
      createBlock("1933-cü ildə alman psixiatrı Hedviq fon Restorff tərəfindən aparılan tədqiqat göstərir ki, oxşar obyektlər sırasından vizual və ya konseptual olaraq fərqlənən tək bir element yaddaşda daha tez qalır və diqqəti dərhal cəlb edir."),
      createBlock("Ancaq bu psixoloji prinsipin mühüm bir nüansı var: fərqlilik nisbidir (relational). Bir obyekt öz-özlüyündə 'fərqli' olmur; o, yalnız ətrafındakı kontekstlə müqayisədə fərqlənir. Əgər bütün qutular qeyri-adi olsaydı, Oatly fərqlənməyəcəkdi. Oatly rəfdəki bütün digər markalar həddən artıq səliqəli və ağ olduğu üçün fərqləndi."),
      createBlock("Dəqiq fərqləndirmə: Von Restorff effekti Oatly-nin niyə diqqət çəkdiyini izah edən psixoloji bir çərçivədir — bu, Oatly komandasının 1933-cü il elmi məqaləsini oxuyub dizayn etdiyini sübut etmir."),

      createBlock("5. Fərqli Olmaq Kifayət Etmir", "h3"),
      createBlock("Marketinqdə tez-tez təkrarlanan bir səhv var: 'Sadəcə fərqli görün, diqqət çəkəcəksən.' Amma mənasız qəribəlik yaxşı brendinq demək deyil. Əgər sizin fərqliliyiniz brendin mahiyyəti ilə üst-üstə düşmürsə, o sadəcə qıcıqlandırıcı kənar səs yaradır."),
      createBlock("Oatly-nin fərqliliyi uğurlu oldu, çünki onun qeyri-adi dizaynı brendin asi, ənənəvi süd sənayesinə meydan oxuyan mövqeyini birbaşa dəstəkləyirdi. Fərqlilik brendin mənası ilə birləşdikdə güclü silaha çevrilir."),

      createBlock("6. Dizaynerlər və Brendlər Bundan Nə Öyrənə Bilər?", "h3"),
      createBlock("1. Fərqlənməzdən əvvəl kateqoriyanın vizual dilini xəritələndirin — Bütün rəqiblərinizin hansı şriftləri, rəngləri və şablonları işlətdiyini dəqiq görün."),
      createBlock("2. 'Nə gözəl görünür?' sualı ilə yanaşı 'Hamı nə edir?' sualını verin."),
      createBlock("3. Qablaşdırma da bir mediadır — İllik reklam büdcəniz azdırsa, məhsulun öz səthini reklam lövhəsinə çevirin."),
      createBlock("4. Fərqlilik kontekstdən asılıdır — Obyekt yalnız ətrafındakı mühitə nəzərən fərqlənir."),
      createBlock("5. Asilik brendin mahiyyətini dəstəkləməlidir — Çatdırdığınız vizual üslub brendinizin fəlsəfəsinə uyğun gəlməlidir."),
      createBlock("6. Trend kütləviləşəndə fərqlilik itir — Əgər sabah bütün süd markaları Oatly kimi əllə çəkilmiş şriftlər işlətsə, Oatly yenidən fərqli bir yol axtarmalı olacaq."),

      createBlock("Nəticə", "h3"),
      createBlock("Sual 'Bu dizaynı necə daha fərqli edim?' olmamalıdır. Daha doğru sual budur: 'Bu kateqoriyada hamı avtomatik olaraq nə edir — və mən həqiqətən həmin qaydaya əməl etməyə məcburammı?'")
    ],
  },

  // 02. BETTY CROCKER & THE IKEA EFFECT
  {
    _id: "blog-iconography-and-vector-precision",
    title: "Why Betty Crocker Made Bakers Add a Fresh Egg",
    title_az: "Betty Crocker niyə tort qarışığına yumurta əlavə etdirdi?",
    slug: { _type: "slug", current: "betty-crocker-egg-myth-ikea-effect" },
    slug_az: { _type: "slug", current: "betty-crocker-tort-qarisigi-yumurta" },
    originalSlug: "betty-crocker-egg-myth-ikea-effect",
    category: "Behavioral Economics",
    category_az: "Davranış İqtisadiyyatı",
    excerpt: "Why making a product too effortless can reduce user ownership. The Betty Crocker egg story, Ernest Dichter's motivation research, and the psychology of the IKEA Effect in product design.",
    excerpt_az: "Hazır tort qarışığına tək bir yumurta əlavə etmək satışı necə dəyişdi? Rahatlıq paradoksu, Dichter rəvayətinin pərdəarxası reallığı və IKEA effektinin məhsul dizaynındakı rolu.",
    coverImage: {
      _type: "image",
      asset: { _type: "reference", _ref: "image-37249609fa384a87a7548bd603030fc5c33556cd-1376x768-jpg" },
      alt: "A single brass bell floating in dramatic spotlight with acoustic sound waves",
      url: "https://cdn.sanity.io/images/0lqwkcmg/production/37249609fa384a87a7548bd603030fc5c33556cd-1376x768.jpg",
    },
    publishDate: "2026-03-05",
    readTime: "11 min read",
    featured: true,
    tags: ["Betty Crocker", "IKEA Effect", "Behavioral Economics", "Consumer Psychology", "Product Design", "User Participation", "Friction vs Convenience"],
    body: [
      createBlock("Why Betty Crocker Made Bakers Add a Fresh Egg", "h2"),
      createBlock("Imagine a company launching a product engineered for maximum convenience: an instant cake mix. The product is complete—just add water, stir, and bake."),
      createBlock("Yet shortly after launch, the company intentionally modifies the recipe, requiring consumers to crack and add two of their own fresh eggs."),
      createBlock("If convenience is the ultimate selling proposition, why would a brand deliberately add friction to the user experience? Should an ideal instant product require almost no effort at all?"),

      createBlock("1. When Baking Became Too Easy", "h3"),
      createBlock("In the late 1940s, food manufacturer General Mills introduced instant cake mixes under the Betty Crocker brand. Ginger Cake Mix launched in 1947, followed by Party Cake and Devil's Food in 1949."),
      createBlock("The commercial premise seemed bulletproof: save post-war homemakers valuable time by combining flour, sugar, shortening, and dried egg powder into a single box. The user simply added water. Yet initial market adoption fell short of corporate expectations."),

      createBlock("2. Where Did the Egg Come From?", "h3"),
      createBlock("General Mills' historical documentation shows that during 1949 consumer testing, home bakers explicitly requested to add fresh eggs. Bakers noted that dried egg powder yielded inferior flavor and texture, whereas adding fresh eggs produced a noticeably fresher, richer cake."),
      createBlock("Concurrently, motivational psychologist Ernest Dichter conducted focus group research for General Mills. Dichter observed that all-in-one instant mixes triggered subconscious guilt: homemakers felt they weren't truly 'baking' or expressing care for their families if a box did all the work."),
      createBlock("By requiring home bakers to add fresh eggs, General Mills restored a sense of creative participation without sacrificing convenience."),

      createBlock("3. Where the Marketing Myth Begins", "h3"),
      createBlock("A widely retold marketing legend claims that Ernest Dichter single-handedly saved a failing product by removing powdered eggs to eliminate guilt, causing sales to instantly skyrocket."),
      createBlock("Historical evidence reveals a more nuanced reality: General Mills and competing manufacturers were already transitioning to fresh eggs due to culinary quality and consumer preference. Dichter's motivation research provided an insightful psychological explanation for why participation felt satisfying, rather than acting as a sudden standalone miracle cure."),
      createBlock("Examining how case studies become oversimplified over time highlights an important truth: real consumer behavior is rarely driven by a single isolated variable."),

      createBlock("4. 50 Years Later, Science Named It: The IKEA Effect", "h3"),
      createBlock("Decades after Betty Crocker's early cake mixes, consumer psychologists formalized the underlying mechanism. In a landmark 2012 study published in the Journal of Consumer Psychology, researchers Michael I. Norton, Daniel Mochon, and Dan Ariely defined the 'IKEA Effect'."),
      createBlock("Across experiments involving IKEA furniture assembly, origami folding, and Lego construction, participants assigned significantly higher subjective value to items they helped assemble compared to identical pre-assembled items."),
      createBlock("Crucially, the study proved a vital boundary condition: labor leads to love only when the effort results in successful completion. If a task fails or the output is destroyed, the emotional valuation dissipates."),
      createBlock("Importantly, the IKEA Effect is a retrospective psychological framework—not proof that 1940s food executives consciously planned around 21st-century behavioral economics."),

      createBlock("5. Why a Single Egg Creates Perceived Value", "h3"),
      createBlock("Cracking an egg takes 5 seconds, yet it shifts the consumer's psychological posture:"),
      createBlock("• From passive consumer ('I bought a boxed cake') to active co-creator ('I baked a cake')."),
      createBlock("By reserving a meaningful contribution step for the user, participation restores feelings of competence and creates authentic emotional ownership over the final result."),

      createBlock("6. Convenience Is Not Always Good UX", "h3"),
      createBlock("Modern digital product design faces the exact same tension. Completely eliminating user effort can inadvertently strip away emotional investment."),
      createBlock("Examples in digital products:"),
      createBlock("• Customizable workspace templates and dashboards."),
      createBlock("• Guided onboarding flows where users configure personal goals."),
      createBlock("• Curating custom playlists, collections, or avatars."),
      createBlock("When a software application automates 100% of an outcome without user input, the user feels zero sense of accomplishment. Providing a manageable, high-utility contribution step builds lasting engagement."),

      createBlock("7. Bad Friction vs. Meaningful Participation", "h3"),
      createBlock("It is vital to distinguish between two distinct design concepts:"),
      createBlock("• Bad Friction: Confusing navigation, unnecessary form fields, redundant verification steps, and slow load times. This frustrates users."),
      createBlock("• Meaningful Participation: Customization, personal choice, and meaningful contribution steps. This empowers users and builds ownership."),
      createBlock("Great product design eliminates bad friction while protecting meaningful participation."),

      createBlock("8. Practical Takeaways for Designers", "h3"),
      createBlock("1. Don't eliminate every user action just because automation allows it."),
      createBlock("2. Ask whether your user seeks pure zero-effort convenience or a sense of authorship."),
      createBlock("3. Provide a contribution step that users can easily and successfully complete."),
      createBlock("4. Never manufacture annoying friction and label it 'engagement'."),

      createBlock("Closing Thought", "h3"),
      createBlock("The most valuable ingredient in a experience isn't what is included in the box. It's the small, meaningful contribution that allows the user to proudly say: 'I made this.'")
    ],
    body_az: [
      createBlock("Betty Crocker niyə tort qarışığına yumurta əlavə etdirdi?", "h2"),
      createBlock("Bir şirkət təsəvvür edin: o, mətbəxdə insanların işini maksimum dərəcədə asanlaşdırmaq üçün hazır tort qarışığı istehsal edir. Məhsul tam hazırdır — sadəcə su əlavə edib sobaya qoymaq kifayətdir."),
      createBlock("Lakin qısa müddət sonra şirkət gözlənilməz bir qərar verir: resepti dəyişir və müştəridən xəmirə öz cibindən iki təzə yumurta qırmağı tələb edir."),
      createBlock("Əgər rahatlıq ən əsas dəyərdirsə, bir məhsulu istifadə etməyi niyə qəsdən mürəkkəbləşdirəsən? İdeal hazır məhsul demək olar ki, heç bir zəhmət tələb etməməli deyildi?"),

      createBlock("1. Tort Bişirmək Həddindən Artıq Asanlaşanda", "h3"),
      createBlock("1940-cı illərin sonlarında ABŞ-da General Mills şirkəti Betty Crocker brendi altında hazır tort qarışıqlarını satışa çıxardı. 1947-ci ildə 'Ginger Cake Mix', 1949-cu ildə isə 'Party Cake' və 'Devil's Food' qarışıqları bazara daxil oldu."),
      createBlock("İdeya kağız üzərində mükəmməl görünürdü: müharibədən sonrakı dövrdə ev qadınlarının vaxtına qənaət etmək, unu, şəkəri və hətta yumurta tozunu tək bir paketdə birləşdirmək. Müştəri sadəcə su töküb qarışdırmalı idi. Lakin məhsulun ilkin satışları gözlənilən böyük sıçrayışı etmədi."),

      createBlock("2. Bəs Yumurta Haradan Çıxdı?", "h3"),
      createBlock("General Mills-in rəsmi arxivlərinə əsasən, 1949-cu ildə sınaq mərhələsində ev qadınları aydın bir istək bildirdilər: onlar qarışığa öz təzə yumurtalarını əlavə etmək istəyirdilər. Çünki yumurta tozu ilə bişən tortlar dad və konsistensiya baxımından təbii hiss olunmurdu."),
      createBlock("Eyni dövrdə psixoanalitik Ernest Dichter General Mills üçün fokus qrupları keçirdi. Dichter müşahidə etdi ki, hər şeyi hazır təqdim edən qarışıqlar şüuraltı təqsirkarlıq hissi yaradır: ev qadınları bütün işi bir qutu gördüyü üçün özlərini həqiqi bişirən kimi hiss etmirdilər."),
      createBlock("General Mills təzə yumurta istifadəsini təlimata əlavə etməklə müştəriyə rahatlığı itirmədən yaratmaq və qayğı göstərmək hissiyyatını geri qaytardı."),

      createBlock("3. Marketinq Əfsanəsi Burada Başlayır", "h3"),
      createBlock("İnternetdə ən çox yayılan məşhur rəvayət belədir: 'Qadınlar zəhmət çəkmədikləri üçün təqsirkar hiss edirdilər, Dichter gəldi, yumurta tozunu çıxartdı və satışlar ani olaraq partladı.'"),
      createBlock("Tarixi reallıq bir az daha mürəkkəbdir: General Mills və digər istehsalçılar yumurtanı təkcə psixoloji təqsirkarlıq hissinə görə deyil, həm də təzə yumurtanın kulinar keyfiyyəti kəskin qaldırdığı üçün dəyişdilər. Dichter-in tədqiqatı sadəcə izah etdi ki, təzə yumurta qırmaq müştəriyə 'Bu tortu mən bişirdim' hissini qaytarır."),
      createBlock("Hekayənin tarixi təfərrüatlarının zamanla sadələşdirilməsini araşdırmaq bizə marketinq keyslərinin necə əfsanələşdiyini daha yaxşı anlamağa kömək edir."),

      createBlock("4. 50 İl Sonra Bunun Bir Adı Yarandı: IKEA Effekti", "h3"),
      createBlock("Betty Crocker hadisəsindən onlarca il sonra — 2012-ci ildə Harvard Biznes Məktəbinin tədqiqatçıları (Michael Norton, Daniel Mochon və Dan Ariely) tərəfindən dərc olunan elmi məqalə bu fenomene ad verdi: IKEA Effekti (The IKEA Effect: When labor leads to love)."),
      createBlock("Təcrübələrdə iştirakçılar IKEA mebelləri quraşdırır, oriqlami qatlayır və Lego fiqurları düzəldirdilər. Nəticə aydın idi: insanlar öz əməklərini sərf etdikləri obyekti tam hazır alınmış analoqundan kəskin şəkildə daha yüksək dəyərləndirirlər."),
      createBlock("Ancaq elmi tədqiqatın mühüm bir şərti var idi: əmək yalnız uğurlu nəticələndikdə dəyər yaradır. Əgər iştirakçının quraşdırdığı mebel dağılırdısa, IKEA effekti itirdi."),
      createBlock("Dəqiq tarixi fərqləndirmə: 'IKEA Effekti' termini 2012-ci ildə yaranıb. Betty Crocker brendinin 1950-ci illərdə bu terminlə fəaliyyət göstərdiyini iddia etmək yanlış olardı. IKEA Effekti — həmin hadisəni illər sonra izah edən retrospektiv psixoloji çərçivədir."),

      createBlock("5. Bir Yumurta Niyə Fərq Yarada Bilər?", "h3"),
      createBlock("Təzə yumurta qırmaq fiziki baxımdan cəmi 5 saniyə vaxt aparır. Amma psixoloji baxımdan o, təcrübənin strukturunu dəyişir:"),
      createBlock("• 'Mən qutudan hazır tort aldım' (Passiv istehlak) ➔ 'Mən tort bişirdim' (Yaradıcı iştirak)."),
      createBlock("Bir yumurta insana bişirmə prosesində şəxsi töhfə verir, səriştəlilik hissini (self-efficacy) bərpa edir və hazır məhsula emosional sahiblik duygusu qazandırır."),

      createBlock("6. Asanlıq Həmişə Yaxşı UX Demək Deyil", "h3"),
      createBlock("Müasir rəqəmsal məhsul dizaynında da eyni tələ var: bütün sürtünməni (friction) aradan qaldırmaq hər zaman yaxşı təcrübə demək deyil."),
      createBlock("Rəqəmsal məhsullardan nümunələr:"),
      createBlock("• Fərdiləşdirilə bilən şablonlar və idarəetmə panelləri."),
      createBlock("• Onboarding zamanı istifadəçinin öz seçimlərini etməsi."),
      createBlock("• Öz pleylistini və ya avatarını yaratmaq."),
      createBlock("Əgər tətbiq istifadəçinin əvəzinə hər şeyi 100% avtomatik etsə, müştəri nəticəyə qarşı heç bir bağlılıq hiss etmir. İstifadəçiyə tamamlayacağı balaca, amma mənalı bir rol vermək lazımdır."),

      createBlock("7. Friction Və İştirak Eyni Şey Deyil", "h3"),
      createBlock("Burada çox incə bir sərhəd var:"),
      createBlock("• Zərərli Sürtünmə (Bad Friction): Mənasız formalar, mürəkkəb naviqasiya, gözləmə müddətləri. Bu, istifadəçini yorur."),
      createBlock("• Mənalı İştirak (Meaningful Participation): Seçim etmək, fərdiləşdirmək, şəxsi töhfə vermək. Bu, istifadəçiyə sahiblik hissi verir."),
      createBlock("Dizaynerin vəzifəsi mənasız sürtünməni silmək, amma mənalı iştirak addımını qorumaqdır."),

      createBlock("8. Dizaynerlər Üçün 4 Praktiki Dərs", "h3"),
      createBlock("1. Avtomatlaşdırmaq mümkün olduğuna görə hər qarşılıqlı əlaqəni silməyin."),
      createBlock("2. Sual verin: Müştəri yalnız 1-klik rahatlıq istəyir, yoxsa müəlliflik hissi?"),
      createBlock("3. İstifadəçiyə uğurla tamamlaya biləcəyi kiçik bir töhfə addımı verin."),
      createBlock("4. Süni maneə yaradıb adını 'cəlb etmə' (engagement) qoymayın."),

      createBlock("Nəticə", "h3"),
      createBlock("Təcrübənin ən vacib inqrediyenti qutunun içində gələn hissə deyil. Ən vacib inqrediyent — insanın yaratdığı işə baxıb qürurla deyə bildiyi həmin ifadədir: 'Bunu mən hazırladım.'")
    ],
  }
];
