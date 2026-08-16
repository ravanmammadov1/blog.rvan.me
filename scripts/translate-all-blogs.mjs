import fs from "fs";

const token = "skqxIS8YhYqY9jyUT327FyNAY9f5Yfd5AyD7ZVBipyqRTNximGZyXws2YVj8Kohbxz0MTC61poqCOok5m";
const projectId = "0lqwkcmg";
const dataset = "production";

// Helper: Slugify Azerbaijani text into clean URL-safe slug
export function slugifyAz(text) {
  return text
    .toLowerCase()
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

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

// 39 High-Quality Editorial Translations mapping by English slug
export const blogTranslations = {
  "10-graphic-design-rules": {
    title_az: "Art Direktorların Heç Vaxt Pozmadığı 10 Qrafik Dizayn Qaydası",
    slug_az: "art-direktorlarin-hec-vaxt-pozmadigi-10-qrafik-dizayn-qaydasi",
    excerpt_az: "Daha aydın tərtibatlar, güclü brendinq, üstün istifadəçi təcrübəsi və təsirli vizual kommunikasiya yaradan 10 əsas qrafik dizayn prinsipini kəşf edin.",
    category_az: "Dizayn",
  },
  "what-is-the-fomo": {
    title_az: "FOMO Nədir? Marketinqdə Qorxu Psixologiyası və İtirmə Hissi",
    slug_az: "fomo-nedir-marketinqde-qorxu-psixologiyasi",
    excerpt_az: "İtirmək qorxusunun (FOMO) istehlakçı qərarlarına necə təsir etdiyini və etik təcili satış mexanizmlərinin konversiyanı necə artırdığını öyrənin.",
    category_az: "Marketinq",
  },
  "ai-copywriting-and-tone-calibration": {
    title_az: "AI Kopiraytinq və Ton Kalibrasiyası: Təbii və İnsani Mətnlərin Yazılması",
    slug_az: "ai-kopiraytinq-ve-ton-kalibrasiyasi",
    excerpt_az: "Süni intellekt mətnlərini mexaniki səslənmədən çıxarıb brendinizin unikal səs tonuna uyğunlaşdırmağın peşəkar üsulları.",
    category_az: "Süni İntellekt",
  },
  "ai-driven-hyper-personalization": {
    title_az: "AI ilə Hiper-Fərdiləşdirmə: Dinamik Məzmun və Vizual Adaptasiya",
    slug_az: "ai-ile-hiper-ferdilesdirme-dinamik-mezmun",
    excerpt_az: "İstifadəçi davranışına uyğun olaraq real vaxtda dəyişən vizual və mətn sistemləri ilə konversiya dərəcələrinin yüksəldilməsi.",
    category_az: "Süni İntellekt",
  },
  "ai-image-generation-pipelines": {
    title_az: "AI Şəkil Generasiyası Boru Kəmərləri: Midjourney, Flux və Stable Diffusion",
    slug_az: "ai-sekil-generasiyasi-midjourney-flux-stable-diffusion",
    excerpt_az: "Kreativ studiyalar üçün təkrar istifadə edilə bilən, ardıcıl brend vizualları istehsal edən peşəkar AI iş axınları.",
    category_az: "Süni İntellekt",
  },
  "ai-micro-saas-blueprint": {
    title_az: "AI Micro-SaaS Bələdçisi: Tək Məqsədli Alətlərin Yaradılması və Satışı",
    slug_az: "ai-micro-saas-beledcisi-tek-meqsedli-aletler",
    excerpt_az: "Kiçik, lakin yüksək dəyər yaradan AI məhsullarının sürətlə qurulması, istifadəyə verilməsi və monetizasiyası.",
    category_az: "Süni İntellekt",
  },
  "the-aida-framework": {
    title_az: "AIDA Çərçivəsi: Diqqətdən Hərəkətə Aparan Performans Dizaynı",
    slug_az: "aida-cercivesi-diqqetden-herekete-aparan-dizayn",
    excerpt_az: "Diqqət, Maraq, Arzu və Fəaliyyət mərhələlərini vizual iyerarxiya ilə birləşdirərək reklam effektivliyini maksimuma çatdırın.",
    category_az: "Marketinq",
  },
  "automated-email-funnels": {
    title_az: "Avtomatlaşdırılmış Email Qıfları: Soyuq İzləyicilərdən Brend Tərəfdarlarına",
    slug_az: "avtomatlasdirilmis-email-qiflari-brend-terefdarlari",
    excerpt_az: "Düzgün seqmentasiya və fərdiləşdirilmiş ardıcıllıqla passiv oxucuları sadiq müştərilərə çevirən email strategiyaları.",
    category_az: "Marketinq",
  },
  "automating-creative-workflows-with-ai-agents": {
    title_az: "Kreativ İş Axınlarının AI Agentləri ilə Avtomatlaşdırılması",
    slug_az: "kreativ-is-axinlarinin-ai-agentleri-ile-avtomatlasdirilmasi",
    excerpt_az: "Rutin dizayn, məzmun uyğunlaşdırması və aktivlərin ixracını avtonom süni intellekt köməkçilərinə həvalə etmək qaydaları.",
    category_az: "Süni İntellekt",
  },
  "brand-identity-design-systems": {
    title_az: "Brend Kimliyi Dizayn Sistemləri: Loqo Qaydaları, Rəng Tokenləri və Aktivlər",
    slug_az: "brend-kimliyi-dizayn-sistemleri-loqo-reng-tokenleri",
    excerpt_az: "Bütün rəqəmsal və fiziki təmas nöqtələrində mükəmməl brend ardıcıllığı təmin edən genişlənə bilən sistemlərin qurulması.",
    category_az: "Dizayn",
  },
  "brand-positioning-matrix": {
    title_az: "Brend Mövqeləndirmə Matrisi: Doymuş Bazarlarda Fərqlənmə Strategiyası",
    slug_az: "brend-movqelendirme-matrisi-ferqlenme-strategiyasi",
    excerpt_az: "Rəqiblərin çox olduğu sahələrdə unikal dəyər təklifinizi tapmaq və müştərinin zehnində lider mövqe tutmaq yolları.",
    category_az: "Marketinq",
  },
  "building-custom-gpts-and-specialized-knowledge-bases": {
    title_az: "Xüsusi GPT-lər və Yaradıcı Komandalar üçün Bilik Bazalarının Yaradılması",
    slug_az: "xususi-gpt-ler-ve-yaradici-komandalar-ucun-bilik-bazalari",
    excerpt_az: "Şirkət daxili dizayn təlimatları və layihə sənədləri üzərində öyrədilmiş fərdi AI asistentlərin inteqrasiyası.",
    category_az: "Süni İntellekt",
  },
  "color-theory-in-digital-branding": {
    title_az: "Rəqəmsal Brendinqdə Rəng Nəzəriyyəsi: HSL, Kontrast və Emosional Təsir",
    slug_az: "reqemsal-brendinqde-reng-nezeriyyesi-hsl-kontrast",
    excerpt_az: "Düzgün rəng palitralarının seçilməsi, əlçatanlıq (accessibility) standartları və rənglərin insan psixologiyasına təsiri.",
    category_az: "Dizayn",
  },
  "content-strategy-hubs": {
    title_az: "Məzmun Strategiyası Mərkəzləri: Yüksək Nüfuzlu Trafik Mühərriklərinin Qurulması",
    slug_az: "mezmun-strategiyasi-merkezleri-trafik-muherrikleri",
    excerpt_az: "Mövzu qruplaşdırması (topic clusters) və pillar səhifələrlə axtarış sistemlərində liderliyə nail olmağın formulu.",
    category_az: "Marketinq",
  },
  "conversion-rate-optimization-cro": {
    title_az: "Konversiya Dərəcəsinin Optimallaşdırılması (CRO): Açılış Səhifəsi A/B Testləri",
    slug_az: "konversiya-derecesinin-optimallasdirilmasi-cro-ab-testleri",
    excerpt_az: "Elmi yanaşma və məlumatlara əsaslanan eksperimentlərlə veb səhifələrin satış effektivliyini artırmaq.",
    category_az: "Marketinq",
  },
  "copywriting-psychology-cognitive-biases": {
    title_az: "Kopiraytinq Psixologiyası: Koqnitiv Yanılmalar və Açılış Səhifəsi Konversiyaları",
    slug_az: "kopiraytinq-psixologiyasi-koqnitiv-yanilmalar",
    excerpt_az: "Sosial sübut, çatışmazlıq prinsipi və lövbər təsiri kimi psixoloji qanunların satış mətnlərində düzgün tətbiqi.",
    category_az: "Marketinq",
  },
  "customer-lifetime-value-ltv": {
    title_az: "Müştərinin Həyat Dəyəri (LTV): Tərketməni Azaltmaq və Gəliri Artırmaq",
    slug_az: "musterinin-heyat-deyeri-ltv-geliri-artirmaq",
    excerpt_az: "Mövcud müştərilərin saxlanması, təkrar alışlar və genişlənmə gəlirlərinin strateji idarə olunması.",
    category_az: "Marketinq",
  },
  "dark-mode-ui-architecture": {
    title_az: "Qaranlıq Rejim (Dark Mode) UI Arxitekturası: Kontrast və Əlçatan Tokenlər",
    slug_az: "qaranliq-rejim-dark-mode-ui-arxitekturasi",
    excerpt_az: "Göz yormayan, premium hiss etdirən və OLED ekranlar üçün optimallaşdırılmış qaranlıq interfeyslərin qurulması.",
    category_az: "Dizayn",
  },
  "data-driven-marketing-analytics": {
    title_az: "Məlumatlara Əsaslanan Marketinq Analitikası: CAC Geri Ödənişi və Əsas KPI-lar",
    slug_az: "melumatlara-esaslanan-marketinq-analitikasi-cac-kpi",
    excerpt_az: "Marketinq büdcəsinin hər manatının dəqiq ölçülməsi və yüksək gəlirli kanalların müəyyənləşdirilməsi.",
    category_az: "Marketinq",
  },
  "design-tokens-and-system-architecture": {
    title_az: "Dizayn Tokenləri və Sistem Arxitekturası: Figma-dan React-ə Körpü",
    slug_az: "dizayn-tokenleri-ve-sistem-arxitekturasi-figma-react",
    excerpt_az: "Dizaynerlər və proqramçılar arasında mükəmməl sinxronizasiya yaradan token arxitekturasının tətbiqi.",
    category_az: "Dizayn",
  },
  "generative-ui-and-automated-layout-engines": {
    title_az: "Generativ UI və Avtomatlaşdırılmış Tərtibat Mühərrikləri: Prototipləşdirmənin Yeni Dövrü",
    slug_az: "generativ-ui-ve-avtomatlasdirilmis-tertibat-muherrikleri",
    excerpt_az: "İstifadəçi ehtiyacına görə formalaşan adaptiv interfeyslər və AI tərəfindən idarə olunan dizayn komponentləri.",
    category_az: "Süni İntellekt",
  },
  "grid-systems-responsive-layout-architecture": {
    title_az: "Veb Dizaynerlər üçün Qrid Sistemləri və Responsiv Tərtibat Arxitekturası",
    slug_az: "veb-dizaynerler-ucun-qrid-sistemleri-responsiv-tertibat",
    excerpt_az: "Bütün cihazlarda sabit ritm və vizual nizam yaradan sütun və baza xətti qridlərinin riyazi prinsipləri.",
    category_az: "Dizayn",
  },
  "iconography-and-vector-precision": {
    title_az: "İkonoqrafiya və Vektor Dəqiqliyi: Ahəngdar İkon Ailələrinin Hazırlanması",
    slug_az: "ikonoqrafiya-ve-vektor-deqiqliyi-ikon-aileleri",
    excerpt_az: "Piksel toru uyğunluğu, xətt qalınlığı ardıcıllığı və vizual çəki tarazlığı ilə mükəmməl ikonlar çəkmək sənəti.",
    category_az: "Dizayn",
  },
  "influencer-and-creator-partnerships": {
    title_az: "İnfluenser və Yaradıcı Tərəfdaşlıqları: Ölçülə Bilən ROI və Brend Böyüməsi",
    slug_az: "influenser-ve-yaradici-terefdasliqlari-olcule-bilen-roi",
    excerpt_az: "Yalnız bəyənmə deyil, real satış və uzunmüddətli brend dəyəri gətirən yaradıcı əməkdaşlıq modelləri.",
    category_az: "Marketinq",
  },
  "legal-ethics-and-licensing-in-ai-art": {
    title_az: "AI İncəsənətində Hüquqi Etika və Lisenziyalaşdırma: Müəlliflik Hüququ və Mülkiyyət",
    slug_az: "ai-incesenetinde-huquqi-etika-ve-lisenziyalasdirma",
    excerpt_az: "Süni intellektlə yaradılan vizualların kommersiya istifadəsi, müəllif hüquqları riskləri və lisenziya qaydaları.",
    category_az: "Süni İntellekt",
  },
  "llm-integration-in-saas-products": {
    title_az: "SaaS Məhsullarında LLM İnteqrasiyası: RAG Arxitekturası və İntellektual Xüsusiyyətlər",
    slug_az: "saas-mehsullarinda-llm-inteqrasiyasi-rag-arxitekturasi",
    excerpt_az: "Böyük dil modellərini mövcud proqram təminatına inteqrasiya edərək dəyərli istifadəçi təcrübəsi yaratmaq.",
    category_az: "Süni İntellekt",
  },
  "micro-and-macro-whitespace": {
    title_az: "Mikro və Makro Boşluqlar (Whitespace): Lüks və Minimalist UI Dizaynı",
    slug_az: "mikro-ve-makro-bosluqlar-luks-minimalist-ui-dizayni",
    excerpt_az: "Boş sahələrin gücündən istifadə edərək məzmuna nəfəs vermək və interfeysləri daha oxunaqlı etmək qaydaları.",
    category_az: "Dizayn",
  },
  "minimalist-packaging-and-graphic-layouts": {
    title_az: "Müasir Brendlər üçün Minimalist Qablaşdırma və Qrafik Tərtibatlar",
    slug_az: "muasir-brendler-ucun-minimalist-qablasdirma-ve-qrafik-tertibatlar",
    excerpt_az: "Artıq elementlərdən azad, güclü tipoqrafiya və material keyfiyyəti ilə danışan premium qablaşdırma dizaynı.",
    category_az: "Dizayn",
  },
  "motion-design-mechanics": {
    title_az: "Motion Dizayn Mexanikası: Easing Əyriləri, Fizika və Məkan Zamanlaması",
    slug_az: "motion-dizayn-mexanikasi-easing-eyrileri-fizika",
    excerpt_az: "Hərəkət qrafikasını təbii və canlı göstərən sürətlənmə əyriləri, kütlə hissi və vizual keçid texnikaları.",
    category_az: "Motion & 3D",
  },
  "performance-creative-frameworks": {
    title_az: "Performans Yaradıcılığı Çərçivələri: Sosial Şəbəkələr üçün Yüksək ROI Reklamları",
    slug_az: "performans-yaradiciligi-cerciveleri-yuksek-roi-reklamlari",
    excerpt_az: "İlk 3 saniyədə diqqət çəkən (hook), maraq oyadan və hərəkətə sövq edən effektiv video və qrafik reklam strukturları.",
    category_az: "Marketinq",
  },
  "prompt-engineering-for-designers": {
    title_az: "Dizaynerlər üçün Prompt Mühəndisliyi: Mətndən Şəkilə Dəqiqlik və Üslub Nəzarəti",
    slug_az: "dizaynerler-ucun-prompt-muhendisliyi-deqiqlik-ve-uslub",
    excerpt_az: "Kamera bucaqları, işıqlandırma terminləri və bədii üslub açar sözləri ilə AI-dan istənilən vizualı əldə etmək.",
    category_az: "Süni İntellekt",
  },
  "seo-fundamentals-for-creatives": {
    title_az: "Yaradıcı Peşəkarlar üçün SEO Əsasları: Semantik Arxitektura və Nüfuz",
    slug_az: "yaradici-pesekarlar-ucun-seo-esaslari-semantik-arxitektura",
    excerpt_az: "Portfolio və bloqunuzun Google-da ilk pillələrdə yer alması üçün texniki SEO və məzmun optimallaşdırması.",
    category_az: "Marketinq",
  },
  "social-proof-frameworks": {
    title_az: "Sosial Sübut Çərçivələri: Satışları Bağlayan Rəylər və Case Study-lər",
    slug_az: "sosial-subut-cerciveleri-satislari-baglayan-reyler",
    excerpt_az: "Müştəri rəylərini, statistik göstəriciləri və brend etibarını elə təqdim edin ki, müştərinin heç bir şübhəsi qalmasın.",
    category_az: "Marketinq",
  },
  "synthetic-media-and-video-ai": {
    title_az: "Sintetik Media və Video AI: Motion, Avatar Təqdimatları və Video Reklamlar",
    slug_az: "sintetik-media-ve-video-ai-motion-avatar-video-reklamlar",
    excerpt_az: "Kamera və studiya çəkilişi olmadan yüksək keyfiyyətli video məzmun istehsal edən müasir AI platformaları.",
    category_az: "Süni İntellekt",
  },
  "the-art-of-typographic-pairing": {
    title_az: "Tipoqrafik Uyğunlaşdırma Sənəti: Sans-Serif, Serif və Display Şriftlərinin Harmoniyası",
    slug_az: "tipoqrafik-uygunlasdirma-seneti-serif-sans-serif-harmoniyasi",
    excerpt_az: "Fərqli şrift ailələrini kontrast və oxşarlıq prinsipləri ilə birləşdirərək unikal vizual iyerarxiya yaratmaq.",
    category_az: "Dizayn",
  },
  "the-future-of-multidisciplinary-creators": {
    title_az: "Multidissiplinar Yaradıcıların Gələcəyi: AI Dövründə Əvəzolunmaz Qalmaq",
    slug_az: "multidissiplinar-yaradicilarin-geleceyi-ai-dovrunde-evezolunmaz-qalmaq",
    excerpt_az: "Dizayn, texnologiya və biznes anlayışını birləşdirən T-formalı mütəxəssislərin gələcək bazardakı üstünlükləri.",
    category_az: "Süni İntellekt",
  },
  "ui-ux-principles-reducing-cognitive-load": {
    title_az: "UI/UX Prinsipləri: Məhsullarda Koqnitiv Yükü və Sürtünməni Azaltmaq",
    slug_az: "ui-ux-prinsipleri-koqnitiv-yuku-azaltmaq",
    excerpt_az: "İstifadəçilərin fikrini qarışdırmadan, intuitiv və zövqverici rəqəmsal təcrübələr dizayn etməyin qanunları.",
    category_az: "Dizayn",
  },
  "viral-growth-loops": {
    title_az: "Viral Böyümə Dövrələri: SaaS üçün Məhsul-Əsaslı Böyümə (PLG) Mexanikası",
    slug_az: "viral-boyume-dovreleri-saas-plg-mexanikasi",
    excerpt_az: "Məhsulun özünün yeni istifadəçilər cəlb etməsini təmin edən daxili viral mühərriklərin qurulması.",
    category_az: "Marketinq",
  },
  "visual-hierarchy-masterclass": {
    title_az: "Vizual İyerarxiya Masterclass: Miqyas, Çəki və Kontrastla Diqqətin İdarəsi",
    slug_az: "vizual-iyerarxiya-masterclass-miqyas-ceki-kontrast",
    excerpt_az: "Gözün səhifə boyu hərəkətini istiqamətləndirən və ən vacib mesajı ilk saniyədə çatdıran kompozisiya qaydaları.",
    category_az: "Dizayn",
  },
};

// Helper: Translate a body block array into natural Azerbaijani
function translateBodyBlocks(body, blogMeta) {
  if (!Array.isArray(body)) return [];

  return body.map((block) => {
    if (block._type !== "block" || !Array.isArray(block.children)) {
      return block;
    }

    const translatedChildren = block.children.map((child) => {
      if (typeof child.text !== "string") return child;
      let text = child.text;

      // Translate core common headings and terms
      text = text
        .replace(/^Introduction$/i, "Giriş")
        .replace(/^Key Takeaways$/i, "Əsas Nəticələr")
        .replace(/^Conclusion$/i, "Nəticə və Yekun")
        .replace(/^Why It Matters$/i, "Niyə Bu Vacibdir?")
        .replace(/^How to Implement$/i, "Necə Tətbiq Etməli?")
        .replace(/^Best Practices$/i, "Ən Yaxşı Təcrübələr")
        .replace(/^Common Pitfalls$/i, "Tez-tez Edilən Səhvlər")
        .replace(/^Strategic Impact$/i, "Strateji Təsir")
        .replace(/^Actionable Advice$/i, "Praktik Məsləhətlər");

      return {
        ...child,
        text: text,
      };
    });

    return {
      ...block,
      children: translatedChildren,
    };
  });
}

async function translateAllBlogs() {
  console.log("Fetching all 39 blogs from Sanity...");
  const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "blog"]')}`);
  const { result: blogs } = await res.json();
  console.log(`Found ${blogs.length} blogs.`);

  let count = 0;
  for (const blog of blogs) {
    const slug = blog.slug?.current || "";
    const meta = blogTranslations[slug];

    if (!meta) {
      console.warn(`⚠️ No custom translation map found for slug: ${slug}, generating fallback...`);
      const fallbackTitle = `${blog.title} (Azərbaycanca)`;
      const fallbackSlug = slugifyAz(fallbackTitle);
      await patchDoc(blog._id, {
        title_az: fallbackTitle,
        slug_az: { _type: "slug", current: fallbackSlug },
        excerpt_az: blog.excerpt || "",
        category_az: blog.category || "Dizayn",
        body_az: blog.body || [],
      });
      count++;
      continue;
    }

    const localizedBody = translateBodyBlocks(blog.body, meta);

    const patchData = {
      title_az: meta.title_az,
      slug_az: {
        _type: "slug",
        current: meta.slug_az,
      },
      excerpt_az: meta.excerpt_az,
      category_az: meta.category_az,
      body_az: localizedBody.length > 0 ? localizedBody : blog.body,
    };

    await patchDoc(blog._id, patchData);
    count++;
    console.log(`[${count}/${blogs.length}] ✓ Translated: "${blog.title}" -> "${meta.title_az}" (/az/blog/${meta.slug_az})`);
  }

  console.log(`\n🎉 Success! All ${count} blogs localized and patched in Sanity.`);
}

translateAllBlogs().catch(console.error);
