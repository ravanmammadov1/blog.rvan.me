import fs from "fs";

const token = process.env.SANITY_API_WRITE_TOKEN;
const projectId = "0lqwkcmg";
const dataset = "production";

// Category translations
const categoryMap = {
  "Design": "Dizayn",
  "Motion": "Motion & 3D",
  "Marketing": "Marketinq",
  "AI": "Süni İntellekt",
  "Strategy": "Strategiya",
};

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

// 1. Translate Singletons: SiteSettings and About
async function translateSingletons() {
  console.log("Updating SiteSettings with Azerbaijani translations...");
  await patchDoc("siteSettings", {
    heroTitle_az: "FİKİRLƏRİ DİZAYN ET. GƏLƏCƏYİ QUR.",
    heroSubtitle_az: "Dizayn, motion qrafika, brend dünyaları və diqqət çəkən yüksək performanslı rəqəmsal həlləri birləşdirən aparıcı kreativ dizayner.",
    contactHeading_az: "GƏLİN BİRLİKDƏ YARADAQ.",
    contactSubtext_az: "Yeni kampaniya, motion layihəsi və ya vizual sistem planlaşdırırsınız? Yaradıcı əməkdaşlıqlara hər zaman açığam.",
    footerText_az: "© {year} RƏVAN MƏMMƏDOV. BÜTÜN HÜQUQLAR QORUNUR.",
  });

  console.log("Updating About document with Azerbaijani translations...");
  await patchDoc("about", {
    heading_az: "Brendlər üçün unudulmaz vizual enerji və dizayn sistemləri yaradıram.",
    introParagraph1_az: "İlk ideyadan son kadracan hər bir detal emosional təsir yaratmaq üçün formalaşdırılır. Motion dizayn, qrafik dizayn, art direksiya və inkişaf yönümlü yaradıcı həllər üzrə çalışıram.",
    introParagraph2_az: "Mənim yanaşmam dizaynerin estetik baxışı ilə marketoloqun strateji aydınlığını birləşdirir: yadda qalan və real nəticə verən gözəl ideyalar.",
  });
}

// 2. Translate Projects
async function translateProjects() {
  console.log("Fetching projects...");
  const res = await fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${encodeURIComponent('*[_type == "projects"]')}`);
  const { result: projects } = await res.json();
  console.log(`Found ${projects.length} projects to localize.`);

  const projectTranslations = {
    "omoda": {
      title_az: "Omoda — Rəqəmsal Kampaniya & Art Direksiya",
      description_az: "Omoda brendi üçün gələcəyə yönəlmiş vizual kimlik, 3D vizualizasiya və inteqrasiya olunmuş rəqəmsal marketinq aktivləri.",
      type_az: "Art Direksiya · Motion · Kampaniya",
    },
    "jaecoo": {
      title_az: "Jaecoo — Brend Strategiyası & Vizual Kimlik",
      description_az: "Premium avtomobil seqmenti üçün lüks brendinq, rəqəmsal dizayn sistemi və video istehsalı.",
      type_az: "Brend Kimliyi · Video İstehsalı",
    },
    "jmc": {
      title_az: "JMC — Kommersiya Brendinqi & Reklam Dizaynı",
      description_az: "Kommersiya nəqliyyatı üçün möhkəm və dinamik vizual təqdimat, sosial media aktivləri və çap materialları.",
      type_az: "Kommersiya Brendinqi · Reklam",
    },
    "wuling": {
      title_az: "Wuling Motors — Rəqəmsal Kampaniya & Launch",
      description_az: "Wuling elektrik avtomobillərinin bazara çıxarılması üçün interaktiv təqdimatlar və sosial media kampaniyası.",
      type_az: "Rəqəmsal Kampaniya · Launch",
    },
    "vertu": {
      title_az: "Vertu — Lüks Aksessuar & Brend Vizualları",
      description_az: "Vertu smartfon və aksessuarları üçün yüksək səviyyəli vizual dizayn və pərakəndə marketinq həlləri.",
      type_az: "Lüks Brendinq · Qablaşdırma",
    },
    "xor": {
      title_az: "XOR — Təhlükəsizlik Texnologiyası & Vizual Təqdimat",
      description_az: "Kiber-təhlükəsizlik və premium texnologiya brendi üçün korporativ vizual materiallar və pitch deck dizaynı.",
      type_az: "Texnologiya · UI/UX Vizualları",
    },
    "myshop": {
      title_az: "MyShop — Elektron Ticarət Brend Kimliyi",
      description_az: "E-ticarət platforması üçün tam brend arxitekturası, istifadəçi interfeysi qrafikası və reklam materialları.",
      type_az: "E-ticarət · Qrafik Sistemlər",
    },
    "prior-leasing": {
      title_az: "Prior Leasing — Korporativ Maliyyə Brendinqi",
      description_az: "Maliyyə və lizinq sektoru üçün etibarlı korporativ şəxsiyyət, hesabat dizaynları və vizual kommunikasiya.",
      type_az: "Korporativ Brendinq · Maliyyə",
    },
    "otodok-service": {
      title_az: "Otodok Service — Avtomobil Xidməti Brendinqi",
      description_az: "Müasir avtomobil servis şəbəkəsi üçün loqo, vizual identiklik və interyer qrafikası.",
      type_az: "Brend Kimliyi · Vizual Sistemlər",
    },
  };

  for (const proj of projects) {
    const slug = proj.slug?.current || "";
    let translation = null;
    for (const key of Object.keys(projectTranslations)) {
      if (slug.includes(key) || proj.title?.toLowerCase().includes(key)) {
        translation = projectTranslations[key];
        break;
      }
    }

    if (!translation) {
      translation = {
        title_az: proj.title || "",
        description_az: proj.description || "",
        type_az: proj.type || "Dizayn · Motion",
      };
    }

    await patchDoc(proj._id, translation);
    console.log(`✓ Project translated: ${proj.title} -> ${translation.title_az}`);
  }
}

async function run() {
  await translateSingletons();
  await translateProjects();
  console.log("Singletons and projects translated successfully.");
}

run().catch(console.error);
