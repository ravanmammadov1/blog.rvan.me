import { Comment, CreateCommentInput, UpdateCommentInput, VoteInput, ReactionInput } from "../types/comments";

const LOCAL_STORAGE_KEY = "rvan_comments_store_v3";

type CommentsSubscriber = (comments: Comment[]) => void;
const subscribers = new Map<string, Set<CommentsSubscriber>>();

const CANONICAL_SLUG_MAP: Record<string, string> = {
  "salary-negotiation-psychology-harvard-method": "maas-danisigi-psixologiyasi-harvard-metodu",
  "maas-danisigi-psixologiyasi-harvard-metodu": "maas-danisigi-psixologiyasi-harvard-metodu",
  "blog-masterclass-maas-danisigi-psixologiyasi-harvard-metodu": "maas-danisigi-psixologiyasi-harvard-metodu",

  "why-beautiful-design-loses-money-nng-research": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
  "gozel-dizayn-niye-pul-itirir-nielsen-norman-group": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
  "blog-masterclass-gozel-dizayn-niye-pul-itirir-nielsen-norman-group": "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",

  "why-large-followers-dont-equal-sales-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
  "izleyici-coxlugu-satis-getirmir-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
  "blog-masterclass-izleyici-coxlugu-satis-getirmir-cialdini-funnel": "izleyici-coxlugu-satis-getirmir-cialdini-funnel",

  "global-freelancing-upwork-linkedin-40-dollar-hour": "qlobal-frilans-upwork-linkedin-saati-40-dollar",
  "qlobal-frilans-upwork-linkedin-saati-40-dollar": "qlobal-frilans-upwork-linkedin-saati-40-dollar",
  "blog-masterclass-qlobal-frilans-upwork-linkedin-saati-40-dollar": "qlobal-frilans-upwork-linkedin-saati-40-dollar",

  "why-resumes-get-rejected-in-6-seconds-ats-secrets": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
  "cv-niye-6-saniyede-red-edilir-ats-sistemleri": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
  "blog-masterclass-cv-niye-6-saniyede-red-edilir-ats-sistemleri": "cv-niye-6-saniyede-red-edilir-ats-sistemleri",

  "who-will-ai-replace-mit-stanford-studies": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
  "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
  "blog-masterclass-sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford": "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",

  "self-taught-ui-ux-designer-6-month-roadmap": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
  "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
  "blog-masterclass-sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite": "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",

  "building-selling-no-code-websites-framer-figma": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
  "kod-yazmadan-sayt-yigib-satmaq-framer-no-code": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
  "blog-masterclass-kod-yazmadan-sayt-yigib-satmaq-framer-no-code": "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",

  "landing-first-client-zero-experience-value-audit": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
  "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
  "blog-masterclass-0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu": "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",

  "passive-income-digital-templates-figma-notion": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
  "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
  "blog-masterclass-reqemsal-sablonlar-sataraq-passiv-gelir-gumroad": "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
};

export function getCanonicalPostId(postId: string): string {
  if (!postId) return "default";
  const clean = postId
    .toLowerCase()
    .replace(/^\/?(az\/)?blog\//, "")
    .replace(/^\//, "")
    .replace(/\/+$/, "")
    .trim();
  return CANONICAL_SLUG_MAP[clean] || clean;
}

export const COMMUNITY_SEED_THREADS: Comment[] = [
  // ── 01. Salary Negotiation ──
  {
    id: "seed-comm-1",
    postId: "maas-danisigi-psixologiyasi-harvard-metodu",
    authorId: "orxan-quliyev",
    author: {
      id: "orxan-quliyev",
      name: "Orxan Quliyev",
      role: "Lead Product Designer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Bizdə əksər şirkətlər 'Maaş gözləntiniz nədir?' sualını namizədi psixoloji cəhətdən sıxışdırmaq üçün verir. Kris Vossun 'Necə?' sualları metodunu son müsahibəmdə tətbiq etdim və təklifi 400 AZN artırmağa nail oldum. Çox dəyərli analizdir!",
    createdAt: new Date("2026-08-25T11:30:00.000Z"),
    likes: 21,
    dislikes: 0,
    reactions: { like: 21, heart: 9, celebrate: 6 },
    replies: [
      {
        id: "seed-comm-1-reply",
        postId: "maas-danisigi-psixologiyasi-harvard-metodu",
        authorId: "aydan-aliyeva",
        author: {
          id: "aydan-aliyeva",
          name: "Aydan Əliyeva",
          role: "HR & Talent Partner",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Tamamilə razıyam. HR olaraq deyə bilərəm ki, arqumentli 'Strateji Aralıq' verən namizədə dərhal peşəkar və bazarını bilən mütəxəssis kimi yanaşırıq.",
        createdAt: new Date("2026-08-25T12:15:00.000Z"),
        likes: 14,
        dislikes: 0,
        reactions: { like: 14 },
      },
    ],
  },

  // ── 02. Beautiful Design Loses Money ──
  {
    id: "seed-comm-2",
    postId: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    authorId: "murad-hasanov",
    author: {
      id: "murad-hasanov",
      name: "Murad Həsənov",
      role: "E-Commerce Founder",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Dribbble-dakı konseptlərin çoxu real istifadəçi psixologiyasını nəzərə almır. Bizim saytda One-Page Checkout tətbiq etdikdən sonra səbət tərki 64%-dən 38%-ə düşdü. Məqalədəki Baymard statistikası hər bir dizaynerin stolüstü qaydası olmalıdır.",
    createdAt: new Date("2026-08-20T14:20:00.000Z"),
    likes: 28,
    dislikes: 1,
    reactions: { like: 28, heart: 7 },
    replies: [
      {
        id: "seed-comm-2-reply",
        postId: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
        authorId: "leyla-macidova",
        author: {
          id: "leyla-macidova",
          name: "Leyla Məcidova",
          role: "Senior UX Researcher",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Dəqiq belədir. Dribbble vizual zövq üçündür, real konversiya isə sürtünməsiz (frictionless) axından keçir. Formanı sadələşdirmək hər zaman satış gətirir.",
        createdAt: new Date("2026-08-20T15:05:00.000Z"),
        likes: 15,
        dislikes: 0,
        reactions: { like: 15 },
      },
    ],
  },

  // ── 03. Followers Don't Equal Sales ──
  {
    id: "seed-comm-3",
    postId: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    authorId: "samir-mammadli",
    author: {
      id: "samir-mammadli",
      name: "Samir Məmmədli",
      role: "Growth Marketer",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    },
    content: "50k izləyicili səhifələrin satış edə bilməməsinin əsas səbəbi auditoriyanın güvəninin olmamasıdır. Çaldininin sosial sübut və qarşılıqlılıq prinsipləri dəqiq işləyir. Məzmun strategiyamızı bu 3 pilləli qıfa uyğunlaşdırdıq.",
    createdAt: new Date("2026-08-15T18:00:00.000Z"),
    likes: 19,
    dislikes: 0,
    reactions: { like: 19, celebrate: 5 },
    replies: [
      {
        id: "seed-comm-3-reply",
        postId: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
        authorId: "gunel-ismayilova",
        author: {
          id: "gunel-ismayilova",
          name: "Günel İsmayılova",
          role: "Brand Strategist",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Xüsusilə TOFU-da maarifləndirib BOFU-da konkret həll təklif edəndə dönüşüm faizi 3 qat artır. Giveaway izləyiciləri isə sadəcə ballastdır.",
        createdAt: new Date("2026-08-15T19:30:00.000Z"),
        likes: 11,
        dislikes: 0,
        reactions: { like: 11 },
      },
    ],
  },

  // ── 04. Global Freelancing ──
  {
    id: "seed-comm-4",
    postId: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
    authorId: "elmir-rzayev",
    author: {
      id: "elmir-rzayev",
      name: "Elmir Rzayev",
      role: "Senior UI/UX Freelancer",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Upwork-də 90 saniyəlik Loom videosu göndərmək təklifin qəbul edilmə şansını ən azı 3 qat artırır. Yerli bazarda ilişib qalmaq vaxt itkisidir, qlobal bazar böyükdür və ödəniş qabiliyyəti qat-qat yüksəkdir.",
    createdAt: new Date("2026-08-10T11:45:00.000Z"),
    likes: 35,
    dislikes: 0,
    reactions: { like: 35, heart: 16, celebrate: 11 },
    replies: [
      {
        id: "seed-comm-4-reply",
        postId: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
        authorId: "rashad-qasimov",
        author: {
          id: "rashad-qasimov",
          name: "Rəşad Qasımov",
          role: "Frontend Consultant",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Dil baryerindən qorxurlar, amma əslində texniki ingiliscə və Loom-da problemi göstərmək kifayət edir. Saatlıq $45-dən başladım və yerli layihələri tam dayandırdım.",
        createdAt: new Date("2026-08-10T13:20:00.000Z"),
        likes: 18,
        dislikes: 0,
        reactions: { like: 18 },
      },
    ],
  },

  // ── 05. Resumes Rejected in 6 Seconds ──
  {
    id: "seed-comm-5",
    postId: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    authorId: "nigar-ahmadova",
    author: {
      id: "nigar-ahmadova",
      name: "Nigar Əhmədova",
      role: "HR Consultant",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Google-un XYZ formulu CV-ni adi vəzifə siyahısından çıxarıb biznes təsir sənədinə çevirir. Canva dizaynlarının ATS sistemlərindən keçməməsi faktını hər gün görürük. Tək sütunlu, təmiz format ən yaxşısıdır.",
    createdAt: new Date("2026-08-04T16:10:00.000Z"),
    likes: 31,
    dislikes: 0,
    reactions: { like: 31, heart: 14 },
    replies: [
      {
        id: "seed-comm-5-reply",
        postId: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
        authorId: "tural-aliyev",
        author: {
          id: "tural-aliyev",
          name: "Tural Əliyev",
          role: "Product Manager",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
        },
        content: "XYZ formatına keçdikdən sonra LinkedIn-də xarici şirkətlərdən cavab alma faizim 15%-dən 60%-ə qalxdı. Nəticəni rəqəmlə göstərmək açar məqamdır.",
        createdAt: new Date("2026-08-04T17:40:00.000Z"),
        likes: 16,
        dislikes: 0,
        reactions: { like: 16 },
      },
    ],
  },

  // ── 06. Who Will AI Really Replace? ──
  {
    id: "seed-comm-6",
    postId: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    authorId: "kamran-huseynov",
    author: {
      id: "kamran-huseynov",
      name: "Kamran Hüseynov",
      role: "AI Systems Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    content: "MIT araşdırmasının vurğuladığı 'Hibrid Bacarıq' modeli reallığı əks etdirir. AI təkcə icra alətidir; strateji qərar və biznes kontekstini dərk edən dizayner əksinə komandanın liderinə çevrilir.",
    createdAt: new Date("2026-07-29T10:00:00.000Z"),
    likes: 24,
    dislikes: 0,
    reactions: { like: 24, heart: 8, celebrate: 5 },
    replies: [
      {
        id: "seed-comm-6-reply",
        postId: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
        authorId: "vusal-babayev",
        author: {
          id: "vusal-babayev",
          name: "Vüsal Babayev",
          role: "Product Lead",
          avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Gündəlik rutin ikon axtarışı və variant generatorlarını AI-ya verib, vaxtı istifadəçi testlərinə ayırırıq. İş itkisi yox, sürət artımı baş verir.",
        createdAt: new Date("2026-07-29T11:20:00.000Z"),
        likes: 13,
        dislikes: 0,
        reactions: { like: 13 },
      },
    ],
  },

  // ── 07. Self-Taught UI/UX Roadmap ──
  {
    id: "seed-comm-7",
    postId: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    authorId: "leyla-karimova",
    author: {
      id: "leyla-karimova",
      name: "Leyla Kərimova",
      role: "Design Systems Educator",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Tələbələrə hər zaman deyirəm: 10 səhifəlik Dribbble şəkli yox, real problemi həll edən 1 dərin Case Study sizi işə qəbul etdirir. Josh Kaufman-ın klonlama metodologiyası ən sürətli öyrənmə yoludur.",
    createdAt: new Date("2026-07-23T14:30:00.000Z"),
    likes: 29,
    dislikes: 0,
    reactions: { like: 29, heart: 12 },
    replies: [
      {
        id: "seed-comm-7-reply",
        postId: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
        authorId: "fuad-karimov",
        author: {
          id: "fuad-karimov",
          name: "Fuad Kərimov",
          role: "Junior UI/UX Designer",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Bu yol xəritəsindəki 2-ci mərhələni (Laws of UX analizi) keçdikdən sonra dizaynlarım tamamilə fərqli, məntiqli səviyyəyə çatdı.",
        createdAt: new Date("2026-07-23T15:45:00.000Z"),
        likes: 17,
        dislikes: 0,
        reactions: { like: 17 },
      },
    ],
  },

  // ── 08. No-Code Framer Monetization ──
  {
    id: "seed-comm-8",
    postId: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    authorId: "elvin-gasimov",
    author: {
      id: "elvin-gasimov",
      name: "Elvin Qasımov",
      role: "No-Code Architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Figma-dan Framer-ə keçid yerli bazarda inanılmaz imkan yaradır. Əvvəl 1 aya təhvil verdiyimiz landing page-i indi 3 günə canlıya çıxarırıq və müştəri hər şeyə özü nəzarət edə bilir.",
    createdAt: new Date("2026-07-17T09:15:00.000Z"),
    likes: 26,
    dislikes: 0,
    reactions: { like: 26, heart: 10 },
    replies: [
      {
        id: "seed-comm-8-reply",
        postId: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
        authorId: "orxan-quliyev",
        author: {
          id: "orxan-quliyev",
          name: "Orxan Quliyev",
          role: "Creative Director",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Animasiyaların sürəti və mobil optimizasiyası da əladır. Vaxta 70% qənaət edirik.",
        createdAt: new Date("2026-07-17T11:00:00.000Z"),
        likes: 15,
        dislikes: 0,
        reactions: { like: 15 },
      },
    ],
  },

  // ── 09. Value Audit Client Acquisition ──
  {
    id: "seed-comm-9",
    postId: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    authorId: "farid-jafarov",
    author: {
      id: "farid-jafarov",
      name: "Fərid Cəfərov",
      role: "Freelance Consultant",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Aleks Hormozinin yanaşması ilə soyuq email yerinə saytın 2 kritik səhvini göstərən 90 saniyəlik video çəkib göndərdim. 5 şirkətdən 2-si dərhal görüş təyin etdi və müqavilə bağladıq.",
    createdAt: new Date("2026-07-11T13:40:00.000Z"),
    likes: 33,
    dislikes: 0,
    reactions: { like: 33, celebrate: 12 },
    replies: [
      {
        id: "seed-comm-9-reply",
        postId: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
        authorId: "samir-mammadli",
        author: {
          id: "samir-mammadli",
          name: "Samir Məmmədli",
          role: "Growth Marketer",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Çünki dəyəri əvvəlcədən təmənnasız verirsən. Bu qarşılıqlılıq prinsipinə görə şirkət sahibi özünü borclu hiss edir.",
        createdAt: new Date("2026-07-11T14:55:00.000Z"),
        likes: 19,
        dislikes: 0,
        reactions: { like: 19 },
      },
    ],
  },

  // ── 10. Digital Products & Passive Income ──
  {
    id: "seed-comm-10",
    postId: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    authorId: "ravan-mammadov",
    author: {
      id: "ravan-mammadov",
      name: "Rəvan Məmmədov",
      role: "Lead Creative Designer & Founder",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    content: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi yaradıcı insanlar üçün ən böyük azadlıqdır. Vaxtınızı hər saat satmaq yerinə, təkrar satılan bir Figma UI Kit qurmaq gəlir modelinizi kökündən dəyişir.",
    createdAt: new Date("2026-07-05T12:00:00.000Z"),
    likes: 42,
    dislikes: 0,
    reactions: { like: 42, heart: 20, celebrate: 15 },
    replies: [
      {
        id: "seed-comm-10-reply",
        postId: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
        authorId: "nigar-rustamli",
        author: {
          id: "nigar-rustamli",
          name: "Nigar Rüstəmli",
          role: "UI/UX Designer",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
        },
        content: "Gumroad-da 3 Notion şablonum var və hər ay sabit 300-400$ passiv gəlir gətirir. İlk başladanda inanmırdım, amma sistem qurulduqdan sonra avtomatik işləyir.",
        createdAt: new Date("2026-07-05T14:10:00.000Z"),
        likes: 25,
        dislikes: 0,
        reactions: { like: 25 },
      },
    ],
  },
];

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") return COMMUNITY_SEED_THREADS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(COMMUNITY_SEED_THREADS));
      return COMMUNITY_SEED_THREADS;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? parsed.map((c) => ({
          ...c,
          createdAt: c.createdAt ? new Date(c.createdAt) : new Date(),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
        }))
      : [];
    return list.length > 0 ? list : COMMUNITY_SEED_THREADS;
  } catch {
    return COMMUNITY_SEED_THREADS;
  }
}

function saveStoredComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.warn("Failed to persist comments to localStorage:", e);
  }
}

function notifySubscribers(postId: string) {
  const canonicalId = getCanonicalPostId(postId);
  const postSubs = subscribers.get(postId) || subscribers.get(canonicalId);
  if (!postSubs || postSubs.size === 0) return;

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  const allComments = getStoredComments();
  const filtered = allComments
    .filter((c) => getCanonicalPostId(c.postId) === canonicalId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));

  postSubs.forEach((cb) => {
    try {
      cb(filtered);
    } catch (err) {
      console.error("Error in comments subscriber:", err);
    }
  });
}

/**
 * Subscribe to comments for a specific post.
 */
export function subscribeToComments(
  postId: string,
  onCommentsUpdate: (comments: Comment[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!postId) {
    onCommentsUpdate([]);
    return () => {};
  }

  const canonicalId = getCanonicalPostId(postId);

  if (!subscribers.has(canonicalId)) {
    subscribers.set(canonicalId, new Set());
  }
  subscribers.get(canonicalId)!.add(onCommentsUpdate);

  const toEpoch = (val: any) => {
    if (!val) return 0;
    if (typeof val?.toDate === "function") return val.toDate().getTime();
    return new Date(val).getTime() || 0;
  };

  // Deliver current cached/stored comments immediately
  const initial = getStoredComments()
    .filter((c) => getCanonicalPostId(c.postId) === canonicalId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));
  onCommentsUpdate(initial);

  // Also fetch any remotely approved comments from API
  if (typeof window !== "undefined") {
    fetch(`/api/comment?postId=${encodeURIComponent(canonicalId)}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.comments) && data.comments.length > 0) {
            const remoteComments: Comment[] = data.comments.map((rc: any) => ({
              id: rc._id || rc.id,
              postId: getCanonicalPostId(rc.relatedPost?._ref || postId),
              authorId: rc.authorEmail || rc.authorId || "remote-user",
              author: {
                id: rc.authorEmail || "remote-user",
                name: rc.authorName || "Anonymous Creator",
                role: rc.authorRole || "Community Member",
                avatar: rc.authorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
              },
              content: rc.commentText || rc.text || "",
              createdAt: rc.createdAt ? new Date(rc.createdAt) : new Date(),
              likes: rc.likes || 0,
              dislikes: rc.dislikes || 0,
            }));

            const merged = [...initial];
            remoteComments.forEach((rc) => {
              if (!merged.some((m) => m.id === rc.id)) {
                merged.push(rc);
              }
            });
            onCommentsUpdate(merged.sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt)));
          }
        }
      })
      .catch((err) => {
        if (onError) onError(err);
      });
  }

  return () => {
    subscribers.get(canonicalId)?.delete(onCommentsUpdate);
  };
}

/**
 * Add a new top-level comment or reply to an existing comment
 */
export async function addComment(input: CreateCommentInput): Promise<Comment> {
  const canonicalId = getCanonicalPostId(input.postId);
  const newComment: Comment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    postId: canonicalId,
    parentId: input.parentId,
    authorId: input.authorId,
    author: input.author,
    content: input.content,
    createdAt: new Date(),
    likes: 0,
    dislikes: 0,
    replies: [],
  };

  const stored = getStoredComments();
  stored.unshift(newComment);
  saveStoredComments(stored);
  notifySubscribers(canonicalId);

  // Sync to remote API
  if (typeof window !== "undefined") {
    try {
      await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: canonicalId,
          authorName: input.author.name,
          authorEmail: input.author.email || `${input.authorId}@rvan.me`,
          authorRole: input.author.role,
          authorPhoto: input.author.avatar,
          commentText: input.content,
          parentId: input.parentId,
        }),
      });
    } catch (e) {
      console.warn("Failed to sync comment to remote API:", e);
    }
  }

  return newComment;
}

/**
 * Update existing comment content
 */
export async function updateComment(input: UpdateCommentInput): Promise<Comment> {
  const stored = getStoredComments();
  const index = stored.findIndex((c) => c.id === input.id);
  if (index === -1) throw new Error("Comment not found.");

  stored[index] = {
    ...stored[index],
    content: input.content,
    updatedAt: new Date(),
  };

  saveStoredComments(stored);
  notifySubscribers(stored[index].postId);
  return stored[index];
}

/**
 * Delete a comment
 */
export async function deleteComment(id: string): Promise<void> {
  const stored = getStoredComments();
  const target = stored.find((c) => c.id === id);
  if (!target) return;

  const filtered = stored.filter((c) => c.id !== id && c.parentId !== id);
  saveStoredComments(filtered);
  notifySubscribers(target.postId);
}

/**
 * Vote (like/dislike) on a comment
 */
export async function voteComment(input: VoteInput): Promise<{ likes: number; dislikes: number }> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  if (input.type === "like") {
    comment.likes = (comment.likes || 0) + 1;
  } else if (input.type === "dislike") {
    comment.dislikes = (comment.dislikes || 0) + 1;
  }

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return {
    likes: comment.likes || 0,
    dislikes: comment.dislikes || 0,
  };
}

/**
 * React to a comment with an emoji (heart, celebrate, etc.)
 */
export async function reactToComment(input: ReactionInput): Promise<Record<string, number>> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  if (!comment.reactions) comment.reactions = {};
  comment.reactions[input.type] = (comment.reactions[input.type] || 0) + 1;

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return comment.reactions;
}
