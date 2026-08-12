import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || "0lqwkcmg",
  dataset: process.env.VITE_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2025-01-01",
  useCdn: false,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return res.status(500).json({ error: "SANITY_API_WRITE_TOKEN is missing" });
  }

  try {
    const existingBlogs = (await client.fetch(`*[_type == "blog"]{ _id, title, "slug": slug.current }`)) || [];
    const protectedSlugs = new Set(["what-is-the-fomo", "the-aida-framework", "10-graphic-design-rules"]);
    const blogsToUpdate = existingBlogs.filter((b: any) => !protectedSlugs.has(b.slug));

    const newTopics = [
      {
        title: "Dizaynda Vizual Metafor Nədir? Qlobal Brendlərin Gizli Silahı",
        slug: "dizaynda-vizual-metafor-nedir",
        category: "Design",
        tags: ["Dizayn", "Branding", "Visual Identity", "Metafor", "Logo"],
        readTime: "5 min",
        excerpt: "Vizual metafor brendin ideyasını heç bir söz demədən birbaşa izləyicinin şüuraltısına necə ötürür? FedEx, Amazon və Apple nümunələri.",
        coverUrl: "https://www.rvan.me/images/blog/cover_visual_metaphor.jpg",
        body: `Dizaynda vizual metafor — mürəkkəb bir ideyanı, brend dəyərini və ya konsepti tək bir vizual obraz vasitəsilə sözsüz çatdırmaq sənətidir. Şüuraltı səviyyədə işləyən bu texnika brendin yaddaşda qalma faizini 3 dəfədən çox artırır.

### Vizual Metaforu Kimlər Və Harada İstifadə Edir?

Qlobal nəhəng brendlərdən tutmuş müasir rəqəmsal studiyalara qədər hər bir uğurlu brend identitiesində vizual metafordan istifadə edir:

1. **FedEx (Gizli Ox Metaforu):** "E" və "x" hərfləri arasında gizlənmiş ox işarəsi hərəkət, sürət və dəqiqlik metaforudur.
2. **Amazon (A-dan Z-yə Təbəssüm Metaforu):** Logodakı sarı ox A-dan Z-yə hər şeyin olduğunu və müştəri məmnuniyyətini (təbəssümü) göstərir.
3. **Apple (Dişlənmiş Alma Metaforu):** Bilik və kəşf simvolu olan alma vizual olaraq kompyuter "byte" sözü ilə söz oyunu yaradır.

![3 İkonik Vizual Metafor İnfoqrafikası](https://www.rvan.me/images/blog/inline_metaphor_matrix.jpg)

### Niyə Vizual Metafordan İstifadə Etməlisiniz?

- **Ani Anlaşılma:** İnsan beyni vizual informasiyanı mətndən 60,000 dəfə daha tez emal edir.
- **Emosional Bağ:** Yaxşı düşünülmüş metafor izləyicidə "Eureka!" effekti yaradaraq brendlə emosional bağ qurur.
- **Sözsüz Kommunikasiya:** Beynəlxalq pazarda dil maneəsini tamamilə aradan qaldırır.`,
      },
      {
        title: "Christopher Nolan Niyə 'Gotham Bold' Şriftindən İstifadə Edir?",
        slug: "christopher-nolan-niye-gotham-bold-istifade-edir",
        category: "Design",
        tags: ["Tipoqrafiya", "Gotham Bold", "Christopher Nolan", "Kino", "Branding"],
        readTime: "6 min",
        excerpt: "Oskarlı rejissor Christopher Nolan və ABŞ siyasətçiləri niyə Gotham Bold şriftinə üstünlük verir? Qrafik tipoqrafiyada güc və kino estetikası.",
        coverUrl: "https://www.rvan.me/images/blog/cover_gotham_nolan.jpg",
        body: `Kino dünyasının dahi rejissoru Christopher Nolan və məşhur siyasi kampaniyalar (məsələn, Barak Obamanın tarixi seçim kampaniyası) eyni tipoqrafik silaha güvənir: **Gotham Bold**.

### Gotham Bold Şriftinin Yaranma Tarixi Və Gücü

2000-ci ildə Tobias Frere-Jones tərəfindən New York şəhərinin tarixi arxitekturasından və Port Authority avtovağzalının qabarıq hərflərindən ilhamlanaraq yaradılan Gotham, həndəsi mükəmməlliklə emosional ağırlığı birləşdirir.

### Nolan Və Qlobal Brendlər Niyə Gotham-ı Seçir?

- **Kino Arxitekturası:** Nolan "The Dark Knight", "Inception" və "Interstellar" filmlərinin plakatlarında Gotham-ın kompress olunmuş həndəsi strukturundan istifadə edərək filmin ciddi, real və dramatik tonunu vurğulayır.
- **Siyasi Güc Və İnam:** Gotham Bold hərflərinin bərabər çəkisi və açıq formaları izləyicidə sarsılmaz inam, sabitlik və müasirlik hissi yaradır.
- **Hər Ölçüdə Oxunurluq:** Nəhəng küçə bilbordlarından tutmuş kiçik mobil ekrana qədər Gotham öz xarakterini itirmir.`,
      },
      {
        title: "Hər Dizaynerin Bilməsi Lazım Olan 3 Əsas Vebsayt",
        slug: "her-dizaynerin-bilmesi-lazim-olan-3-esas-vebsayt",
        category: "Design",
        tags: ["Dizayn", "Resources", "Visuelle", "ItsNiceThat", "99designs"],
        readTime: "4 min",
        excerpt: "İlham, sənaye xəbərləri və kommersiya dizaynı üçün hər gün daxil olmalı olduğunuz 3 əsas platforma: Visuelle, ItsNiceThat və 99designs.",
        coverUrl: "https://www.rvan.me/images/blog/cover_designer_websites.jpg",
        body: `Yaradıcı sənayedə fərqlənmək üçün doğru ilham mənbələrinə malik olmaq vacibdir. Hər bir peşəkar dizaynerin gündəlik qovluğunda olmalı olan 3 əsas platforma:

### 1. Visuelle.co (Minimalist Dizayn Və Kurasiya)
Visuelle qrafik dizayn, tipoqrafiya və minimalist brendinq sahəsində ən təmiz vizual kurasiya platformasıdır. Artıq səs-küy yoxdur — yalnız yüksək keyfiyyətli beynəlxalq işlər.

### 2. ItsNiceThat.com (Kreativ Sənaye Və Trendlər)
İllüstrasiya, motion dizayn, incəsənət və müasir vizual mədəniyyəti izləmək üçün dünyanın 1 nömrəli redaksiya saytıdır. Dünyanın ən aparıcı rəssamlarının müsahibələri və layihə pərdəarxası burada yer alır.

### 3. 99designs.com (Kommersiya Təcrübəsi Və Müştəri İnterfeysi)
Qlobal dizayner icması və müştəri brendinq müsabiqələri platformasıdır. Real kommersiya briflərini araşdırmaq və müştəri tələblərini öyrənmək üçün ideal mühitdir.

![3 Əsas Dizayn Vebsaytının Müqayisəsi](https://www.rvan.me/images/blog/inline_websites_trio.jpg)`,
      },
      {
        title: "Ən Yaxşı 3 Claude Code Bacarığı: Emil Kowalski, Impeccable Və KSkill",
        slug: "en-yaxsi-3-claude-code-bacarigi",
        category: "AI",
        tags: ["AI", "Claude Code", "Emil Kowalski", "Impeccable", "KSkill", "Development"],
        readTime: "5 min",
        excerpt: "Süni intellektdən istifadə edərək ultra-dəqiq UI animasiyaları və arxitektura qurmaq üçün Claude-un 3 ən güclü agent bələdçisi.",
        coverUrl: "https://www.rvan.me/images/blog/cover_claude_code_skills.jpg",
        body: `Claude Code və AI agent texnologiyaları proqramlaşdırma və dizayn mühəndisliyini kökündən dəyişir. Xüsusilə 3 spesifik bacarıq və prompt bələdçisi proseqsiya sürətini 10 dəfə artırır:

### 1. Emil Kowalski Animasiya Sənəti (Motion & Micro-Interactions)
Məşhur UI mühəndisi Emil Kowalski-nin mikro-interaksiya prinsiplərini Claude agentinə inteqrasiya edərək təbii spring fizikası, framer-motion keçidləri və rəvan interfeys animasiyaları yaradın.

### 2. Impeccable Claude (Piksel Dəqiqliyi Və UI Təmizliyi)
İnterfeys komponentlərində marjin, paddinq və tipoqrafik iyerarxiyanı 100% piksel dəqiqliyi ilə təmin edən, dizayn sisteminə sıx bağlı kod generatoru.

### 3. KSkill Claude (Memarlıq Və Effektiv İş Axını)
Böyük layihələrdə modul koda nəzarət edən, lazımsız asılılıqları aradan qaldıran və koda arxitektur təmizlik gətirən agent bacarığı.

![Claude Code 3 Əsas Agent Bacarığı İnfoqrafikası](https://www.rvan.me/images/blog/inline_claude_skills.jpg)`,
      },
      {
        title: "'Qiymət Nədir?' Sualına Heç Vaxt Birbaşa Qiymət Yazmayın",
        slug: "qiymet-nedir-sualina-hec-vaxt-birbasa-qiymet-yazmayin",
        category: "Marketing",
        tags: ["Marketinq", "Satış Psixologiyası", "Value Positioning", "Freelance", "Biznes"],
        readTime: "5 min",
        excerpt: "Müştəri qiymət soruşduqda birbaşa rəqəm yazmaq sizi müqayisə cədvəlinə salır. Dəyər yaratmaq və qiymət psixologiyası strategiyası.",
        coverUrl: "https://www.rvan.me/images/blog/cover_value_pricing.jpg",
        body: `Bir müştəri sizə "Salam, dizayn/sayt qiyməti nədir?" deyə yazdıqda verəcəyiniz ən böyük səhv birbaşa rəqəm söyləməkdir. Niyə?

### Müqayisə Tələsi (Comparison Trap)

Siz birbaşa qiymət yazdıqda müştəri sizi biznes tərəfdaşı kimi yox, sadəcə xərclər cədvəlində bir sətir kimi görür. Müştəri sizin təqdim etdiyiniz dəyəri bilmədən 500$ ilə 5000$ arasındakı fərqi anlaya bilməz.

![Qiymət Sualına Cavab Strategiyası Və Dəyər Matrisi](https://www.rvan.me/images/blog/inline_pricing_matrix.jpg)

### Nə Etməlisiniz? Dəyər Mövqeləndirilməsi (Value Positioning)

1. **Sual İlə Cavab Verin:** "Salam! Sizə dəqiq təklif verə bilməyim üçün layihənizin əsas biznes məqsədini öyrənə bilerəm?"
2. **Problemi Diagnostika Edin:** Qiymətdən əvvəl müştərinin hansı problemi həll etmək istədiyini üzə çıxarın.
3. **Nəticə Və ROI Təqdim Edin:** Müştəriyə təkcə dizayn yox, onun satışlarını və brend nüfuzunu necə artıracağınızı göstərin.`,
      },
    ];

    const mutations = blogsToUpdate.map((blog: any, i: number) => {
      const topic = newTopics[i % newTopics.length];
      return {
        patch: {
          id: blog._id,
          set: {
            title: topic.title,
            slug: { _type: "slug", current: `${topic.slug}-${i}` },
            category: topic.category,
            tags: topic.tags,
            excerpt: topic.excerpt,
            readTime: topic.readTime,
            publishDate: new Date(Date.now() - i * 86400000 * 2).toISOString().split("T")[0],
            imageUrl: topic.coverUrl,
            body: topic.body,
          },
        },
      };
    });

    const result = await client.mutate(mutations);
    return res.status(200).json({
      success: true,
      updatedCount: mutations.length,
      protectedCount: protectedSlugs.size,
      result,
    });
  } catch (err: any) {
    console.error("[run-blog-update] Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
