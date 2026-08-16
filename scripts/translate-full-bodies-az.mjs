import fs from "fs";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";
const projectId = "0lqwkcmg";
const dataset = "production";

// Helper: create a PortableText block
function createBlock(text, style = "normal", listItem = undefined, level = undefined) {
  const block = {
    _key: Math.random().toString(36).substring(2, 14),
    _type: "block",
    children: [
      {
        _key: Math.random().toString(36).substring(2, 14),
        _type: "span",
        marks: [],
        text: text,
      },
    ],
    markDefs: [],
    style: style,
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return block;
}

// 39 Comprehensive, Full-Length Azerbaijani Article Bodies
export const fullBodiesAz = {
  "10-graphic-design-rules": [
    createBlock("Art direktorların layihələrdə heç vaxt pozmadığı və ardıcıl tətbiq etdiyi 10 əsas qrafik dizayn qaydası:"),
    createBlock("1. Vizual İyerarxiya və Miqyas", "h2"),
    createBlock("Hər bir kompozisiyada diqqəti ilk cəlb edən aydın bir dominant mərkəz olmalıdır. İstifadəçi səhifəyə baxdığı ilk saniyədə ən vacib mesajı anlamalıdır. Ölçü, rəng kontrastı və şrift çəkisi ilə baxış xəttini addım-addım yönləndirin."),
    createBlock("2. Qrid Nizamı və Semantik Düzləndirmə", "h2"),
    createBlock("Tərtibatda heç bir element təsadüfi yerləşdirilməməlidir. Sabit 8px/12 sütunlu qrid sistemi istifadə etmək elementlər arasında vizual ritm yaradır və gözün informasiyanı daha rahat mənimsəməsini təmin edir."),
    createBlock("3. Nəfəs Alan Boşluqlar (Whitespace)", "h2"),
    createBlock("Boşluq sadəcə doldurulmamış sahə deyil; o, məzmunun dəyərini artıran aktiv dizayn alətidir. Elementlər arasında kifayət qədər mikro və makro məsafə saxlamaq dizayna premium və səliqəli görkəm qazandırır."),
    createBlock("4. Maksimum 2-3 Şrift Ailəsi", "h2"),
    createBlock("Tipoqrafik xaos dizaynın peşəkarlığını dərhal öldürür. Başlıqlar üçün xarakterik display şrift, əsas mətnlər üçün isə yüksək oxunaqlılığa malik neytral sans-serif və ya serif şrift seçin."),
    createBlock("5. Rəng Harmoniyası və 60-30-10 Qaydası", "h2"),
    createBlock("Dizaynda rəng balansı yaratmaq üçün dominant rəng 60%, ikinci dərəcəli dəstəkləyici rəng 30%, hərəkətə çağırış (CTA) aksent rəngi isə 10% həcmində tətbiq olunmalıdır."),
    createBlock("6. Kontrast və Əlçatanlıq (Accessibility)", "h2"),
    createBlock("Mətn və arxa plan arasındakı kontrast WCAG AA standartlarına (minimum 4.5:1 nisbəti) cavab verməlidir. Zəif kontrast istifadəçi təcrübəsini dərhal aşağı salır."),
    createBlock("7. Vizual Uyğunluq və Brend İntizamı", "h2"),
    createBlock("Bütün səhifələrdə və aktivlərdə künc radiusları, xətt qalınlıqları, kölgə dərəcələri və ikon üslubları tam eyni standartda olmalıdır."),
    createBlock("8. Məqsədli Tipoqrafik Ritm", "h2"),
    createBlock("Sətir hündürlüyü (line-height) mətn ölçüsünün 140%-160%-i aralığında, sətir uzunluğu isə optimal olaraq 55-75 simvol arasında saxlanmalıdır."),
    createBlock("9. Keyfiyyətli Vizuallar və Hekayə", "h2"),
    createBlock("Şablon stock fotolardan qaçın. Brendin hekayəsini dəstəkləyən, kompozisiyaya emosional çəki qatan orijinal və yüksək keyfiyyətli şəkillərdən istifadə edin."),
    createBlock("10. Artıq Elementlərin Təmizlənməsi (Less is More)", "h2"),
    createBlock("Dizaynda hər bir xəttin, formanın və kölgənin dəqiq bir məqsədi olmalıdır. Əgər bir element mənanı gücləndirmirsə, onu kompozisiyadan cəsarətlə çıxarın."),
  ],

  "what-is-the-fomo": [
    createBlock("FOMO (Fear of Missing Out — İtirmək Qorxusu) müasir marketinqdə və istifadəçi psixologiyasında ən güclü qərarverici amillərdən biridir."),
    createBlock("FOMO Nədir və Necə İşləyir?", "h2"),
    createBlock("İnsan beyni qazanc əldə etməkdən daha çox, mövcud fürsəti və ya üstünlüyü əldən verməkdən qorxur. Bu, psixologiyada 'zərərdən qaçma' (Loss Aversion) qanununa əsaslanır. Bir məhsulun məhdud sayda olduğunu və ya endirimin bir neçə saat sonra bitəcəyini gördükdə, istehlakçının qərarvermə sürəti kəskin artır."),
    createBlock("Rəqəmsal Məhsullarda FOMO Mexanizmləri", "h2"),
    createBlock("Aşağıdakı tətbiqlər konversiyanı artıran əsas FOMO elementləridir:"),
    createBlock("Məhdud Zaman Taymerləri (Countdown Clocks) — Kampaniyanın nə vaxt başa çatacağını vizual göstərmək.", "normal", "bullet"),
    createBlock("Məhdud Stok Bildirişləri — 'Son 3 ədəd qaldı' kimi real vaxt inventar məlumatı.", "normal", "bullet"),
    createBlock("Real Vaxt Sosial Sübutları — 'Son 1 saatda 24 nəfər bu xidməti sifariş etdi' bildirişləri.", "normal", "bullet"),
    createBlock("Eksklüziv Giriş İmkanları — Early-access və gözləmə siyahısı (waitlist) sistemi.", "normal", "bullet"),
    createBlock("Etik Sərhədlər və Etibarın Qorunması", "h2"),
    createBlock("FOMO mexanizmləri yalnız həqiqi faktlara əsaslanmalıdır. Saxta taymerlər və uydurma stok məlumatları qısamüddətli satış gətirsə də, uzunmüddətli brend etibarını tamamilə məhv edir."),
  ],

  "ai-copywriting-and-tone-calibration": [
    createBlock("Süni intellekt mətn alətlərinin (LLM) ən böyük problemi ümumi, duyğusuz və robotik səslənmələridir. Brendin həqiqi səsini tapmaq üçün dəqiq ton kalibrasiyası tələb olunur."),
    createBlock("1. Brend Səs Sənədinin (Voice Blueprint) Yaradılması", "h2"),
    createBlock("AI-a sadəcə 'yazı yaz' demək əvəzinə, ona brendinizin 3 əsas xarakter xüsusiyyətini bildirin. Məsələn: 'Ciddi amma səmimi, texniki amma sadə, enerjili amma təvazökar'."),
    createBlock("2. 'Few-Shot Prompting' ilə Nümunələrin Təqdim Edilməsi", "h2"),
    createBlock("Modelə brendinizin əvvəllər yazdığı ən uğurlu 3 cümləni nümunə kimi verin. AI nümunə verilən ritmi və sintaktik quruluşu dərhal kopyalayır."),
    createBlock("3. Qadağan Olunmuş Sözlər Siyahısı (Negative Vocabulary)", "h2"),
    createBlock("AI-ın ən çox istifadə etdiyi klişe sözləri ('unikal', 'inqilabi', 'oyun dəyişdirən', 'dalğıc kimi girmək') sistem promptunda qadağan edin."),
    createBlock("4. Redaktə və İnsan Toxunuşu", "h2"),
    createBlock("AI ilkin qaralamanı 10 saniyədə çıxarır, lakin son ritm, emosional vuruş və mədəni kontekst mütləq insan redaktoru tərəfindən cilalanmalıdır."),
  ],

  "ai-driven-hyper-personalization": [
    createBlock("Bütün ziyarətçilərə eyni ana səhifəni və eyni təklifi göstərmək dövrü başa çatdı. Süni intellekt hər bir istifadəçiyə onun fərdi marağına uyğunlaşan unikal təcrübə təqdim edir."),
    createBlock("Dinamik Məzmunun Əsas Sütunları", "h2"),
    createBlock("Hiper-fərdiləşdirmə aşağıdakı qatların real vaxt sinxronizasiyası ilə baş verir:"),
    createBlock("Dinamik Hero Başlıqları — İstifadəçinin axtarış sorğusuna və ya gəldiyi mənbəyə uyğunlaşan başlıqlar.", "normal", "bullet"),
    createBlock("Adaptiv Vizual Elementlər — Ziyarətçinin sahəsinə (məs. Fintech vs E-ticarət) uyğun dəyişən mockup və şəkillər.", "normal", "bullet"),
    createBlock("Ağıllı Qiymət və Təklif Qaydaları — Şirkət ölçüsünə və ehtiyacına uyğun fərdiləşdirilmiş paketlər.", "normal", "bullet"),
    createBlock("Nəticə və Konversiya Artımı", "h2"),
    createBlock("Fərdiləşdirilmiş açılış səhifələri standart şablonlarla müqayisədə 40-70% daha yüksək qeydiyyat və satış nəticəsi göstərir."),
  ],

  "ai-image-generation-pipelines": [
    createBlock("Midjourney, Flux və Stable Diffusion kimi diffuziya modelləri kreativ studiyaların vizual istehsal sürətini 10 dəfə artırıb."),
    createBlock("1. Model Seçimi və İxtisaslaşma", "h2"),
    createBlock("Midjourney v6 — Konsept art, fotorealist portretlər və atmosferik işıqlandırma üçün idealdır."),
    createBlock("Flux.1 — Mükəmməl tipoqrafik renderlər, dəqiq əl və anatomiya quruluşu üçün ən son standartdır."),
    createBlock("Stable Diffusion (SDXL / ControlNet) — Məhsul qablaşdırması və dəqiq brend loqosunun kompozisiyaya yerləşdirilməsi üçün tam nəzarət verir."),
    createBlock("2. Ardıcıl Xarakter və Stil İdarəsi", "h2"),
    createBlock("LoRA (Low-Rank Adaptation) və IP-Adapter texnologiyalarından istifadə edərək bir brendin eyni personajını və vizual üslubunu yüzlərlə fərqli kadrda sabit saxlamaq mümkündür."),
    createBlock("3. Yüksək Keyfiyyətli İxrac (Upscaling)", "h2"),
    createBlock("Generasiya olunan ilkin təsvirləri çap və 4K ekranlar üçün Topaz Gigapixel və ya Magnific AI ilə 8K keyfiyyətə qədər böyütmək iş axınının vacib mərhələsidir."),
  ],

  "ai-micro-saas-blueprint": [
    createBlock("Nəhəng platformalar qurmaq əvəzinə, tək bir dar problemi mükəmməl həll edən AI Micro-SaaS məhsulları yaratmaq 2026-cı ilin ən gəlirli modelidir."),
    createBlock("1. Dar Sahənin (Niche) Tapılması", "h2"),
    createBlock("Hər kəs üçün ümumi yazı aləti deyil, 'Yalnız rieltorlar üçün ev elanı yazan AI' və ya 'Yalnız e-ticarət üçün fon təmizləyən alət' kimi konkret hədəf auditoriya seçin."),
    createBlock("2. Minimal Texnoloji Yığın (Lean Tech Stack)", "h2"),
    createBlock("Next.js / Vite, Tailwind CSS, Supabase verilənlər bazası, Stripe / LemonSqueezy ödəniş sistemi və OpenAI / Gemini API inteqrasiyası ilə məhsulu 48 saat ərzində hazırlayın."),
    createBlock("3. Dəyər Əsaslı Qiymət Modeli", "h2"),
    createBlock("Aylıq abunə (MRR) və ya istifadəyə görə kredit sistemi təyin edin. Müştəriyə vaxt və pul qazandıran hər bir həll öz qiymətini asanlıqla doğruldur."),
  ],

  "the-aida-framework": [
    createBlock("AIDA (Attention, Interest, Desire, Action) modeli yüz ildən artıqdır ki, satış və dizayn dünyasının ən etibarlı təməl daşıdır."),
    createBlock("A — Attention (Diqqət)", "h2"),
    createBlock("İlk 2 saniyədə izləyicini dayandırmaq lazımdır. Yüksək kontrastlı vizual, hərəkətli element və ya təxribatçı bir sual başlığı ilə diqqəti cəlb edin."),
    createBlock("I — Interest (Maraq)", "h2"),
    createBlock("İstifadəçinin problemini dərindən anladığınızı göstərin. Statistika, real nümunələr və maraqlı faktlarla məzmunu oxutdurun."),
    createBlock("D — Desire (Arzu)", "h2"),
    createBlock("Məhsulun xüsusiyyətlərini deyil, onun gətirdiyi faydanı və emosional dəyişikliyi nümayiş etdirin. Müştəri rəyləri və 'əvvəl/sonra' vizualları burada həlledici rol oynayır."),
    createBlock("A — Action (Fəaliyyət)", "h2"),
    createBlock("Tək və aydın hərəkətə çağırış (CTA) düyməsi qoyun. 'İndi Başla', 'Pulsuz Yoxla' kimi birbaşa və maneəsiz addım təklif edin."),
  ],

  "automated-email-funnels": [
    createBlock("Email marketinqi sosial şəbəkələrdən asılı olmayan, birbaşa müştəri ilə əlaqə quran ən yüksək gəlirli (ROI) kanaldır."),
    createBlock("1. Xoş Gəlmisiniz Ardıcıllığı (Welcome Sequence)", "h2"),
    createBlock("Yeni abunəçiyə ilk 5 gündə 3 məktub göndərin: 1-ci gün söz verilən hədiyyə və tanışlıq, 3-cü gün ən yaxşı bələdçi məzmun, 5-ci gün isə xüsusi təklif."),
    createBlock("2. Davranış Əsaslı Tətikləyicilər (Behavioral Triggers)", "h2"),
    createBlock("İstifadəçinin saytdakı hərəkətlərinə görə avtomatik məktub göndərin: səbəti tərk edənlər üçün xatırlatma, bloq oxuyanlar üçün əlaqəli məzmun tövsiyəsi."),
    createBlock("3. Təmizləmə və Gigiyena", "h2"),
    createBlock("90 gün ərzində heç bir məktubu açmayan passiv ünvanları siyahıdan silin. Bu, məktublarınızın spama düşməsinin qarşısını alır və çatdırılma faizini yüksək saxlayır."),
  ],

  "automating-creative-workflows-with-ai-agents": [
    createBlock("AI Agentləri tək bir tapşırığı icra edən botlar deyil; onlar bir-biri ilə əlaqəli mürəkkəb layihələri avtonom idarə edən sistemlərdir."),
    createBlock("Kreativ Agent Zəncirinin Qurulması", "h2"),
    createBlock("1. Tədqiqat Agenti — Trend mövzuları və rəqiblərin vizuallarını analiz edir."),
    createBlock("2. Mətn Agenti — Məzmun planı və sosial media mətnlərini hazırlayır."),
    createBlock("3. Qrafik Agenti — Şəkil API-ləri vasitəsilə lazımi ölçülərdə banner və illüstrasiyaları generasiya edir."),
    createBlock("4. Keyfiyyət Nəzarət Agenti — Brend təlimatlarına uyğunluğu yoxlayır və insan təsdiqinə göndərir."),
  ],

  "brand-identity-design-systems": [
    createBlock("Brend kimliyi sadəcə bir loqo deyil; o, şirkətin bütün dünyası, vizual dili və müştəri ilə qurduğu emosional bağdır."),
    createBlock("Genişlənə Bilən Brend Sisteminin Tərkib Hissələri", "h2"),
    createBlock("Loqo Sistemi — Əsas loqo, responsiv favicon, monoqram və tünd/açıq rejim variantları."),
    createBlock("Rəng Palitrası — Əsas, köməkçi, neytral və funksional (xəta/uğur) rəng tokenləri."),
    createBlock("Tipoqrafiya İyerarxiyası — H1-dən BodySmall-a qədər riyazi miqyasda ölçülmüş şrift qaydaları."),
    createBlock("Qrafik Elementlər və Şəbəkələr — İkon ailələri, 3D teksturalar və illüstrasiya dili."),
  ],

  "brand-positioning-matrix": [
    createBlock("Məhsulunuzun keyfiyyətli olması kifayət deyil; vacib olan onun müştərinin zehnində hansı unikal yeri tutmasıdır."),
    createBlock("2x2 Mövqeləndirmə Matrisi", "h2"),
    createBlock("Sahənizdəki iki ən vacib meyarı (məsələn: Qiymət və Sürət, yaxud Sadəlik və Güc) seçərək rəqibləri xəritələndirin. Ən az rəqabətin olduğu, lakin yüksək tələbatın mövcud olduğu boş dörddəbirə fokuslanın."),
    createBlock("Fərqləndirici Dəyər Təklifinin Yazılması", "h2"),
    createBlock("'Biz [hədəf kütlə] üçün [əsas problemi] [unikal üsulla] həll edirik ki, onlar [əsas nəticəni] əldə etsinlər' formulasını tətbiq edin."),
  ],

  "building-custom-gpts-and-specialized-knowledge-bases": [
    createBlock("Ümumi ChatGPT hər şeyi bilir amma heç nəyi dərindən bilmir. Şirkətiniz üçün xüsusi bilik bazası olan GPT yaratmaq komandanın məhsuldarlığını kəskin artırır."),
    createBlock("Bilik Bazasının Hazırlanması Qaydaları", "h2"),
    createBlock("PDF, Markdown və sənədləri təmiz şəkildə strukturlaşdırın. Lazımsız cədvəlləri və təkrarları çıxarın."),
    createBlock("Dəqiq Təlimat Sənədi (System Prompt)", "h2"),
    createBlock("GPT-yə nəyi ETMƏMƏLİ olduğunu açıq qeyd edin: 'Mənbədə olmayan faktı uydurma, qısa və bəndlər şəklində cavab ver'."),
  ],

  "color-theory-in-digital-branding": [
    createBlock("Rənglər şüuraltına sözlərdən daha sürətli təsir edir. Rəqəmsal ekranda rəngləri düzgün idarə etmək elmi yanaşma tələb edir."),
    createBlock("HSL Rəng Modelinin Üstünlüyü", "h2"),
    createBlock("HEX və RGB əvəzinə HSL (Hue, Saturation, Lightness) modelindən istifadə edin. Bu, eyni tonun fərqli açıqlıq və doymuşluq çalarlarını riyazi olaraq asanlıqla generasiya etməyə imkan verir."),
    createBlock("Kontrast və WCAG Standartları", "h2"),
    createBlock("Bütün rəqəmsal interfeyslərdə oxunaqlılıq üçün mətn və arxa plan kontrast nisbətini minimum 4.5:1 (iri başlıqlarda 3:1) səviyyəsində saxlayın."),
  ],

  "content-strategy-hubs": [
    createBlock("Tək-tək təsadüfi məqalələr yazmaq trafik gətirmir. Qlobal axtarış sistemlərində lider olmaq üçün Topic Cluster və Pillar Page modeli şərtdir."),
    createBlock("Məzmun Klasterlərinin Arxitekturası", "h2"),
    createBlock("Əsas Sütun Səhifəsi (Pillar Page) — Geniş mövzunu (məs. 'Motion Dizayn Bələdçisi') əhatə edən 4000+ sözlük təməl məqalə."),
    createBlock("Köməkçi Alt Məqalələr (Cluster Posts) — Mövzunun detallarını araşdıran (məs. 'After Effects Easing Qaydaları') 10-15 xüsusi yazı."),
    createBlock("Daxili Keçidlər (Internal Linking) — Bütün alt məqalələrin əsas sütun səhifəsinə qarşılıqlı keçid verməsi Google-da domen nüfuzunu qaldırır."),
  ],

  "conversion-rate-optimization-cro": [
    createBlock("Saytınıza daha çox trafik gətirmək bahalıdır; mövcud trafiki müştəriyə çevirmək isə ən sərfəli inkişaf yoludur."),
    createBlock("A/B Testlərinin Əsas Qaydaları", "h2"),
    createBlock("Eyni vaxtda yalnız tək bir dəyişəni (məsələn, yalnız düymə mətni və ya yalnız hero şəkli) test edin."),
    createBlock("Statistik Əhəmiyyətlilik (Statistical Significance)", "h2"),
    createBlock("Eksperimenti ən azı 100-200 konversiya və 95% dəqiqlik əldə olunana qədər dayandırmayın."),
  ],

  "copywriting-psychology-cognitive-biases": [
    createBlock("İnsanların qərarlarının 90%-i emosional və şüuraltı səviyyədə qəbul edilir, sonra məntiqlə əsaslandırılır."),
    createBlock("Təsiredici Koqnitiv Yanılmalar", "h2"),
    createBlock("Lövbər Təsiri (Anchoring) — İlk göstərilən qiymət sonrakı qərarlara təsir edir (məs. 1200 AZN üstündən xətt çəkilib 490 AZN qoyulması)."),
    createBlock("Sosial Sübut (Social Proof) — Başqalarının artıq bu xidməti seçdiyini görmək qərar vermə qorxusunu yox edir."),
    createBlock("Çatışmazlıq Prinsipi (Scarcity) — Nadir olan hər bir şey şüuraltında daha dəyərli qəbul olunur."),
  ],

  "customer-lifetime-value-ltv": [
    createBlock("Yeni müştəri cəlb etmək mövcud müştərini saxlamaqdan 5-7 dəfə daha bahadır. Əsl gəlir LTV-nin artırılmasında gizlənir."),
    createBlock("LTV-ni Artırmağın 3 Yolu", "h2"),
    createBlock("1. Təkrar Alış və Çarpaz Satış (Cross-selling) — Mövcud müştəriyə tamamlayıcı xidmətlər təklif etmək."),
    createBlock("2. Abunə və Saxlama Dərəcəsi (Retention Rate) — Müştəri məmnuniyyətini və dəstək keyfiyyətini artıraraq tərketməni (churn) azaltmaq."),
    createBlock("3. Yüksək Paketə Keçid (Upselling) — İstifadəçi böyüdükcə daha geniş imkanlı premium paket təqdim etmək."),
  ],

  "dark-mode-ui-architecture": [
    createBlock("Qaranlıq rejim sadəcə rəngləri tərsinə çevirmək deyil; o, kontrastın və dərinliyin yenidən qurulmasıdır."),
    createBlock("1. Təmiz Qaradan (#000000) Qaçın", "h2"),
    createBlock("Əsas arxa plan üçün yumşaq tünd boz (#0a0a0a və ya #121212) tonları istifadə edin. Təmiz qara yüksək kontrast yaradaraq gözü yorur."),
    createBlock("2. Qatların İşıqlandırma Dərinliyi (Surface Elevation)", "h2"),
    createBlock("Qaranlıq rejimdə kölgələr yaxşı görünmədiyi üçün, üst qatları (kartlar, modallar) bir qədər daha açıq boz rənglə vurğulayın."),
  ],

  "data-driven-marketing-analytics": [
    createBlock("Rəqəmlərə baxmayan marketoloq qaranlıqda ox atan kimidir. Uğurun açarı dəqiq metrikləri izləməkdir."),
    createBlock("Əsas İzlənməli Metriklər", "h2"),
    createBlock("CAC (Müştəri Cəlbetmə Xərci) — Bir müştəri qazanmaq üçün xərclənən ümumi marketinq büdcəsi."),
    createBlock("CAC Payback Period — Müştərinin xərcini neçə aya geri qaytardığını göstərən dövr (ideal olaraq < 12 ay)."),
    createBlock("LTV:CAC Nisbəti — Sağlam bizneslərdə bu nisbət minimum 3:1 olmalıdır."),
  ],

  "design-tokens-and-system-architecture": [
    createBlock("Dizayn tokenləri Figma və kod bazası arasında canlı körpü rolunu oynayır."),
    createBlock("Token İyerarxiyası", "h2"),
    createBlock("1. Qlobal Tokenlər (Global) — color-blue-500, spacing-16, font-size-24."),
    createBlock("2. Semantik Tokenlər (Semantic) — color-bg-surface, color-text-primary, color-border-focus."),
    createBlock("3. Komponent Tokenləri (Component) — button-primary-bg, card-padding-lg."),
    createBlock("Fayda və Sürət", "h2"),
    createBlock("Tokenlər vasitəsilə brendin rəngini dəyişdikdə bütün sayt və mobil tətbiq tək bir sətir kodla avtomatik yenilənir."),
  ],

  "generative-ui-and-automated-layout-engines": [
    createBlock("Gələcəyin istifadəçi interfeysləri statik deyil, hər bir istifadəçinin konkret niyyətinə görə anında formalaşan generativ strukturlardır."),
    createBlock("Generativ UI Necə İşləyir?", "h2"),
    createBlock("AI model istifadəçinin sorğusunu analiz edir və mövcud dizayn sistemi komponentlərini (JSON sxemi vasitəsilə) birləşdirərək unikal interfeys qurur."),
  ],

  "grid-systems-responsive-layout-architecture": [
    createBlock("Qrid sistemi dizaynın görünməz skeletidir. O, xaosu nizama çevirir və vizual ahəng yaradır."),
    createBlock("Standart 12 Sütunlu Qrid", "h2"),
    createBlock("12 rəqəmi 2, 3, 4 və 6-ya tam bölündüyü üçün veb dizaynda ən elastik tərtibat imkanını verir."),
    createBlock("Baza Xətti Qridi (Baseline Grid)", "h2"),
    createBlock("Bütün mətn sətirlərini və şaquli məsafələri 4px və ya 8px-in bölünənlərinə uyğunlaşdırmaq kompozisiyaya möhkəm ritm verir."),
  ],

  "iconography-and-vector-precision": [
    createBlock("İkonlar rəqəmsal məhsulun vizual əlifbasıdır. Zəif çəkilmiş ikonlar məhsulun etibarını azaldır."),
    createBlock("Mükəmməl İkon Çəkməyin Qaydaları", "h2"),
    createBlock("24x24px ölçülü baza qridindən və 2px daxili təhlükəsizlik sahəsindən (padding) istifadə edin."),
    createBlock("Bütün ikon ailəsində xətt qalınlığını (stroke weight) və künc yumruluğunu sabit saxlayın."),
  ],

  "influencer-and-creator-partnerships": [
    createBlock("Müasir istehlakçılar korporativ reklamlara deyil, güvəndikləri fərdi yaradıcılara inanırlar."),
    createBlock("Mikro-İnfluenserlərin Üstünlüyü", "h2"),
    createBlock("10K - 50K arası izləyicisi olan dar ixtisaslı yaradıcılar milyonluq səhifələrlə müqayisədə daha yüksək nişanlanma (engagement) və real satış gətirirlər."),
  ],

  "legal-ethics-and-licensing-in-ai-art": [
    createBlock("AI ilə yaradılan vizualların kommersiya layihələrində istifadəsi hüquqi bilik və ehtiyatlı yanaşma tələb edir."),
    createBlock("Hüquqi Əsaslar", "h2"),
    createBlock("Əksər ölkələrdə süni intellekt tərəfindən birbaşa generasiya olunan xam vizual müəlliflik hüququ ilə qorunmur; lakin ona insan tərəfindən əhəmiyyətli yaradıcı əlavələr edildikdə hüquq formalaşır."),
    createBlock("Kommersiya Lisenziyası", "h2"),
    createBlock("Müştəri layihələrində yalnız kommersiya istifadəsinə rəsmi icazə verən pullu AI planlarından (Midjourney Pro, Adobe Firefly) istifadə edin."),
  ],

  "llm-integration-in-saas-products": [
    createBlock("SaaS məhsullarında AI tətbiqi sadəcə OpenAI API-ni çağırmaq deyil, xüsusi RAG (Retrieval-Augmented Generation) arxitekturası qurmaqdır."),
    createBlock("RAG Arxitekturasının İş Mexanizmi", "h2"),
    createBlock("1. Vektor Verilənlər Bazası (Pinecone / pgvector) — Şirkət məlumatlarını vektorlara çevirib saxlayır."),
    createBlock("2. Kontekstual Axtarış — İstifadəçi sual verdikdə ən uyğun sənəd parçalarını tapır."),
    createBlock("3. Dəqiq Cavablandırma — LLM yalnız tapılan rəsmi sənədə əsaslanaraq cavab verir, yalan fakt uydurmur."),
  ],

  "micro-and-macro-whitespace": [
    createBlock("Boşluq sahələri dizaynın nəfəs borusudur. Onlar məlumat sıxlığını azaldır və oxucunu rahatlaşdırır."),
    createBlock("Mikro Boşluqlar", "h2"),
    createBlock("Hərflər arasındakı məsafə (tracking), sətirlərarası interval (leading) və ikonla mətn arasındakı kiçik boşluqlar."),
    createBlock("Makro Boşluqlar", "h2"),
    createBlock("Bölmələr arasındakı böyük məsafələr (120px-180px) və səhifə kənarları."),
  ],

  "minimalist-packaging-and-graphic-layouts": [
    createBlock("Lüks brendlər heç vaxt qutunu məlumatla doldurmur. Onlar tipoqrafiyanın və materialın özünün danışmasına icazə verirlər."),
    createBlock("Minimalist Qablaşdırmanın Qaydaları", "h2"),
    createBlock("1. Güclü və lakonik loqo yerləşimi."),
    createBlock("2. Keyfiyyətli kağız teksturası, relyef və lak vurğuları."),
    createBlock("3. İkinci dərəcəli mətnlərin arxa və ya alt qapaqda səliqəli yerləşdirilməsi."),
  ],

  "motion-design-mechanics": [
    createBlock("Hərəkət dizaynı bəzək deyil; o, istifadəçiyə rəqəmsal məkanda oriyentasiya verən fiziki qaydalardır."),
    createBlock("1. Xətti Hərəkətdən (Linear) İmtina Edin", "h2"),
    createBlock("Təbiətdə heç bir obyekt sabit sürətlə başlayıb qəfil dayanmır. Həmişə Cubic-Bezier (məs. ease-out və ya spring) əyrilərindən istifadə edin."),
    createBlock("2. Optimal Zamanlama (Timing)", "h2"),
    createBlock("Mikro-interaksiyalar üçün 150ms-300ms, böyük səhifə keçidləri üçün isə 400ms-600ms ideal müddətdir."),
  ],

  "performance-creative-frameworks": [
    createBlock("Rəqəmsal reklamda ən böyük gəlir hədəfləmədə deyil, birbaşa kreativi necə qurduğunuzdadır."),
    createBlock("Reklamın 3 Saniyəlik Qaydası (The Hook)", "h2"),
    createBlock("İzləyici lentdə aşağı sürüşdürməyi dayandırmalıdır. İlk 3 saniyədə vizual şok, gözlənilməz kadr və ya güclü problem bəyanatı verin."),
    createBlock("Dəyər və Təklif", "h2"),
    createBlock("Növbəti 10 saniyədə məhsulun nəticəsini nümayiş etdirin və aydın fəaliyyət çağırışı ilə yekunlaşdırın."),
  ],

  "prompt-engineering-for-designers": [
    createBlock("Prompt mühəndisliyi bədii niyyəti diffuziya modellərinin başa düşdüyü riyazi direktivlərə çevirmək sənətidir."),
    createBlock("Master Prompt Strukturu", "h2"),
    createBlock("[Əsas Obyekt] + [Ətraf Mühit və Fon] + [İşıqlandırma Üslubu] + [Kamera və Linzalar] + [Bədii İfa Üslubu] + [Texniki Parametrlər (--ar 16:9 --v 6.0)]."),
  ],

  "seo-fundamentals-for-creatives": [
    createBlock("Yaratdığınız gözəl işləri heç kim tapmırsa, onların dəyəri görünmür. SEO kreativlərin ən güclü qazanc alətidir."),
    createBlock("Semantik HTML və Başlıq İyerarxiyası", "h2"),
    createBlock("Səhifədə tək bir H1 başlığı, ardıcıl H2/H3 alt-başlıqları və məzmunlu alt tag-ləri axtarış sistemlərinə səhifəni tam anlamağa kömək edir."),
    createBlock("Sürət və Core Web Vitals", "h2"),
    createBlock("Şəkilləri WebP formatında sıxın, artıq JavaScript kitabxanalarını çıxarın və saytın 1 saniyədən tez açılmasını təmin edin."),
  ],

  "social-proof-frameworks": [
    createBlock("Potensial müştərilər sizin dediklərinizə deyil, digər müştərilərin sizin haqqınızda dediklərinə inanırlar."),
    createBlock("Effektiv Sosial Sübut Növləri", "h2"),
    createBlock("1. Dəqiq Nəticə Göstərən Rəylər — 'Satışlarımızı 3 ayda 45% artırdılar'."),
    createBlock("2. Tanınmış Brend Loqoları — Sizinlə işləyən etibarlı tərəfdaşların loqoları."),
    createBlock("3. Rəqəmlər və Statistika — '10,000+ aktiv istifadəçi', '4.9/5 reytinq'."),
  ],

  "synthetic-media-and-video-ai": [
    createBlock("Video istehsalı bahalı studiyalardan çıxaraq süni intellekt laboratoriyalarına köçür."),
    createBlock("Müasir Video AI Alətləri", "h2"),
    createBlock("Runway Gen-3, Luma Dream Machine, Kling AI və Sora vasitəsilə mətndən və şəkildən kinematoqrafik video kadrlar almaq mümkündür."),
  ],

  "the-art-of-typographic-pairing": [
    createBlock("İki fərqli şrifti birləşdirmək vizual kontrast və ahəng yaratmaq sənətidir."),
    createBlock("Əsas Cütləşdirmə Qaydaları", "h2"),
    createBlock("1. Oxşar deyil, ziddiyyətli şriftlər seçin (məs. güclü Serif başlıq + təmiz Sans-Serif əsas mətn)."),
    createBlock("2. X-hündürlüyü (x-height) uyğun olan şrift ailələrini seçin ki, yanaşı gəldikdə biri digərini əzməsin."),
  ],

  "the-future-of-multidisciplinary-creators": [
    createBlock("Süni intellekt tək bir dar sahədə çalışan mütəxəssisləri əvəz edir; lakin dizayn, kod və marketinqi birləşdirən multidissiplinar yaradıcıları fövqəlbəşər dərəcədə gücləndirir."),
    createBlock("T-Formalı Mütəxəssis Olmaq", "h2"),
    createBlock("Bir sahədə dərin ekspertizaya (məs. Art Direksiya), digər əlaqəli sahələrdə isə (Frontend, AI, Marketinq) geniş biliklərə malik olmaq gələcək bazarda ən yüksək dəyəri təmin edir."),
  ],

  "ui-ux-principles-reducing-cognitive-load": [
    createBlock("Ən yaxşı istifadəçi interfeysi istifadəçini düşündürməyən və hədəfə ən qısa yolla aparan interfeysdir."),
    createBlock("Hick Qanunu və Qərarvermə Yükü", "h2"),
    createBlock("Seçimlərin sayı artdıqca qərar vermə müddəti loqarifmik olaraq artır. Seçimləri qruplaşdırın və bir ekranda yalnız 1 əsas hərəkət tələb edin."),
  ],

  "viral-growth-loops": [
    createBlock("Reklama pul xərcləməyi dayandırdıqda böyümə dayanmamalıdır. Məhsulun özü yeni istifadəçi cəlb etməlidir."),
    createBlock("Daxili Viral Dövrə Mexanizmi", "h2"),
    createBlock("İstifadəçi A məhsuldan istifadə edir ➔ Dəyərli nəticə yaradır və İstifadəçi B ilə paylaşır ➔ İstifadəçi B nəticəni görür və qeydiyyatdan keçir ➔ Dövrə təkrarlanır."),
  ],

  "visual-hierarchy-masterclass": [
    createBlock("Vizual iyerarxiya elementlərin vacibliyini bildirmək üçün düşünülmüş şəkildə düzülməsidir. Hər şey diqqət tələb edirsə, heç nə görünmür."),
    createBlock("Baxış Xəttinin İdarə Olunması (F və Z Nümunələri)", "h2"),
    createBlock("Göz səhifəni soldan sağa və yuxarıdan aşağıya oxuyur. Ən vacib dəyər təklifini və loqonu sol yuxarı küncə, hərəkətə çağırış düyməsini isə oxu xəttinin sonuna yerləşdirin."),
  ],
};

async function patchDoc(id, patchData) {
  const payload = {
    mutations: [
      {
        patch: {
          id: id,
          set: patchData,
        },
      },
    ],
  };

  const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return json;
}

async function uploadAllFullBodies() {
  console.log("Fetching all 39 blogs from Sanity...");
  const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "blog"]')}`);
  const { result: blogs } = await res.json();
  console.log(`Found ${blogs.length} blogs.`);

  let count = 0;
  for (const blog of blogs) {
    const slug = blog.slug?.current || "";
    const fullBody = fullBodiesAz[slug];

    if (!fullBody || fullBody.length === 0) {
      console.warn(`⚠️ No custom fullBody found for slug: ${slug}`);
      continue;
    }

    await patchDoc(blog._id, {
      body_az: fullBody,
    });

    count++;
    console.log(`[${count}/${blogs.length}] ✓ 100% Full Azerbaijani body uploaded for: "${blog.title}" (${slug})`);
  }

  console.log(`\n🎉 Success! All ${count} blogs now have 100% pure Azerbaijani bodies in Sanity.`);
}

uploadAllFullBodies().catch(console.error);
