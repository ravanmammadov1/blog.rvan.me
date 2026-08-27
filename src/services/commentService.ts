import { Comment, CreateCommentInput, UpdateCommentInput, VoteInput, ReactionInput } from "../types/comments";

const LOCAL_STORAGE_KEY = "rvan_comments_store_v6";

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

export function normalizeComment(c: any): Comment | null {
  if (!c) return null;
  const rawText = c.text || c.content || c.commentText || "";
  const cleanText = typeof rawText === "string" ? rawText.trim() : "";
  if (!cleanText) return null; // Drop empty comments entirely

  const authorName = c.author?.displayName || c.author?.name || c.authorName || "Anonim Oxucu";
  const authorPhoto = c.author?.photoURL || c.author?.avatar || c.authorPhoto || null;
  const authorId = c.authorId || c.author?.uid || c.author?.id || "guest-user";
  const authorEmail = c.author?.email || c.authorEmail || null;
  const authorRole = c.author?.role || c.authorRole || "Oxucu";

  const likedBy: string[] = Array.isArray(c.likedBy) ? c.likedBy : [];
  const likesCount = typeof c.likesCount === "number"
    ? c.likesCount
    : (typeof c.likes === "number" ? c.likes : likedBy.length);

  const dislikedBy: string[] = Array.isArray(c.dislikedBy) ? c.dislikedBy : [];
  const dislikesCount = typeof c.dislikesCount === "number"
    ? c.dislikesCount
    : (typeof c.dislikes === "number" ? c.dislikes : dislikedBy.length);

  // Normalize reactions map: converts number values to array of dummy user ids or preserves string arrays
  let reactions: Record<string, string[]> = {};
  if (c.reactions && typeof c.reactions === "object") {
    Object.entries(c.reactions).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        reactions[key] = val;
      } else if (typeof val === "number" && val > 0) {
        reactions[key] = Array.from({ length: val }, (_, i) => `seed-user-${i + 1}`);
      }
    });
  }

  return {
    id: String(c.id || c._id || `comm-${Date.now()}`),
    postId: getCanonicalPostId(c.postId || c.relatedPost?._ref || ""),
    parentId: c.parentId || null,
    authorId,
    author: {
      uid: authorId,
      displayName: authorName,
      photoURL: authorPhoto,
      email: authorEmail,
      role: authorRole,
      name: authorName,
      avatar: authorPhoto || undefined,
      id: authorId,
    },
    text: cleanText,
    content: cleanText,
    createdAt: c.createdAt ? (c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt)) : new Date(),
    updatedAt: c.updatedAt ? (c.updatedAt instanceof Date ? c.updatedAt : new Date(c.updatedAt)) : undefined,
    isEdited: Boolean(c.isEdited),
    likesCount,
    likes: likesCount,
    likedBy,
    dislikesCount,
    dislikes: dislikesCount,
    dislikedBy,
    reactions,
    status: c.status || "approved",
    isOptimistic: Boolean(c.isOptimistic),
  };
}

export const COMMUNITY_SEED_THREADS: Comment[] = [
  // ── 01. Salary Negotiation ──
  {
    id: "seed-comm-1",
    postId: "maas-danisigi-psixologiyasi-harvard-metodu",
    authorId: "orxan-quliyev",
    author: {
      uid: "orxan-quliyev",
      displayName: "Orxan Quliyev",
      role: "Lead Product Designer",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Bizdə əksər şirkətlər 'Maaş gözləntiniz nədir?' sualını namizədi psixoloji cəhətdən sıxışdırmaq üçün verir. Kris Vossun 'Necə?' sualları metodunu son müsahibəmdə tətbiq etdim və təklifi 400 AZN artırmağa nail oldum. Çox dəyərli analizdir!",
    content: "Bizdə əksər şirkətlər 'Maaş gözləntiniz nədir?' sualını namizədi psixoloji cəhətdən sıxışdırmaq üçün verir. Kris Vossun 'Necə?' sualları metodunu son müsahibəmdə tətbiq etdim və təklifi 400 AZN artırmağa nail oldum. Çox dəyərli analizdir!",
    createdAt: new Date("2026-08-25T11:30:00.000Z"),
    likesCount: 21,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2", "seed-user-3"],
      insight: ["seed-user-4", "seed-user-5"],
      clap: ["seed-user-6"],
    },
  },
  {
    id: "seed-comm-1-reply",
    postId: "maas-danisigi-psixologiyasi-harvard-metodu",
    parentId: "seed-comm-1",
    authorId: "aydan-aliyeva",
    author: {
      uid: "aydan-aliyeva",
      displayName: "Aydan Əliyeva",
      role: "HR & Talent Partner",
      photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Tamamilə razıyam. HR olaraq deyə bilərəm ki, arqumentli 'Strateji Aralıq' verən namizədə dərhal peşəkar və bazarını bilən mütəxəssis kimi yanaşırıq.",
    content: "Tamamilə razıyam. HR olaraq deyə bilərəm ki, arqumentli 'Strateji Aralıq' verən namizədə dərhal peşəkar və bazarını bilən mütəxəssis kimi yanaşırıq.",
    createdAt: new Date("2026-08-25T12:15:00.000Z"),
    likesCount: 14,
    dislikesCount: 0,
    likedBy: ["seed-user-1"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2"],
    },
  },

  // ── 02. Beautiful Design Loses Money ──
  {
    id: "seed-comm-2",
    postId: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    authorId: "murad-hasanov",
    author: {
      uid: "murad-hasanov",
      displayName: "Murad Həsənov",
      role: "E-Commerce Founder",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Dribbble-dakı konseptlərin çoxu real istifadəçi psixologiyasını nəzərə almır. Bizim saytda One-Page Checkout tətbiq etdikdən sonra səbət tərki 64%-dən 38%-ə düşdü. Məqalədəki Baymard statistikası hər bir dizaynerin stolüstü qaydası olmalıdır.",
    content: "Dribbble-dakı konseptlərin çoxu real istifadəçi psixologiyasını nəzərə almır. Bizim saytda One-Page Checkout tətbiq etdikdən sonra səbət tərki 64%-dən 38%-ə düşdü. Məqalədəki Baymard statistikası hər bir dizaynerin stolüstü qaydası olmalıdır.",
    createdAt: new Date("2026-08-20T14:20:00.000Z"),
    likesCount: 28,
    dislikesCount: 1,
    likedBy: ["seed-user-1", "seed-user-2", "seed-user-3"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2"],
      insight: ["seed-user-3", "seed-user-4"],
    },
  },
  {
    id: "seed-comm-2-reply",
    postId: "gozel-dizayn-niye-pul-itirir-nielsen-norman-group",
    parentId: "seed-comm-2",
    authorId: "leyla-macidova",
    author: {
      uid: "leyla-macidova",
      displayName: "Leyla Məcidova",
      role: "Senior UX Researcher",
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Dəqiq belədir. Dribbble vizual zövq üçündür, real konversiya isə sürtünməsiz (frictionless) axından keçir. Formanı sadələşdirmək hər zaman satış gətirir.",
    content: "Dəqiq belədir. Dribbble vizual zövq üçündür, real konversiya isə sürtünməsiz (frictionless) axından keçir. Formanı sadələşdirmək hər zaman satış gətirir.",
    createdAt: new Date("2026-08-20T15:05:00.000Z"),
    likesCount: 15,
    dislikesCount: 0,
    likedBy: ["seed-user-1"],
    reactions: {
      clap: ["seed-user-1", "seed-user-2"],
    },
  },

  // ── 03. Followers Don't Equal Sales ──
  {
    id: "seed-comm-3",
    postId: "izleyici-coxlugu-satis-getirmir-cialdini-funnel",
    authorId: "samir-mammadli",
    author: {
      uid: "samir-mammadli",
      displayName: "Samir Məmmədli",
      role: "Growth Marketer",
      photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    },
    text: "50k izləyicili səhifələrin satış edə bilməməsinin əsas səbəbi auditoriyanın güvəninin olmamasıdır. Çaldininin sosial sübut və qarşılıqlılıq prinsipləri dəqiq işləyir. Məzmun strategiyamızı bu 3 pilləli qıfa uyğunlaşdırdıq.",
    content: "50k izləyicili səhifələrin satış edə bilməməsinin əsas səbəbi auditoriyanın güvəninin olmamasıdır. Çaldininin sosial sübut və qarşılıqlılıq prinsipləri dəqiq işləyir. Məzmun strategiyamızı bu 3 pilləli qıfa uyğunlaşdırdıq.",
    createdAt: new Date("2026-08-15T18:00:00.000Z"),
    likesCount: 19,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2"],
    reactions: {
      fire: ["seed-user-1", "seed-user-2"],
      insight: ["seed-user-3"],
    },
  },

  // ── 04. Global Freelancing ──
  {
    id: "seed-comm-4",
    postId: "qlobal-frilans-upwork-linkedin-saati-40-dollar",
    authorId: "elmir-rzayev",
    author: {
      uid: "elmir-rzayev",
      displayName: "Elmir Rzayev",
      role: "Senior UI/UX Freelancer",
      photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Upwork-də 90 saniyəlik Loom videosu göndərmək təklifin qəbul edilmə şansını ən azı 3 qat artırır. Yerli bazarda ilişib qalmaq vaxt itkisidir, qlobal bazar böyükdür və ödəniş qabiliyyəti qat-qat yüksəkdir.",
    content: "Upwork-də 90 saniyəlik Loom videosu göndərmək təklifin qəbul edilmə şansını ən azı 3 qat artırır. Yerli bazarda ilişib qalmaq vaxt itkisidir, qlobal bazar böyükdür və ödəniş qabiliyyəti qat-qat yüksəkdir.",
    createdAt: new Date("2026-08-10T11:45:00.000Z"),
    likesCount: 35,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2", "seed-user-3"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2"],
      fire: ["seed-user-3", "seed-user-4"],
    },
  },

  // ── 05. Resumes Rejected in 6 Seconds ──
  {
    id: "seed-comm-5",
    postId: "cv-niye-6-saniyede-red-edilir-ats-sistemleri",
    authorId: "nigar-ahmadova",
    author: {
      uid: "nigar-ahmadova",
      displayName: "Nigar Əhmədova",
      role: "HR Consultant",
      photoURL: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Google-un XYZ formulu CV-ni adi vəzifə siyahısından çıxarıb biznes təsir sənədinə çevirir. Canva dizaynlarının ATS sistemlərindən keçməməsi faktını hər gün görürük. Tək sütunlu, təmiz format ən yaxşısıdır.",
    content: "Google-un XYZ formulu CV-ni adi vəzifə siyahısından çıxarıb biznes təsir sənədinə çevirir. Canva dizaynlarının ATS sistemlərindən keçməməsi faktını hər gün görürük. Tək sütunlu, təmiz format ən yaxşısıdır.",
    createdAt: new Date("2026-08-04T16:10:00.000Z"),
    likesCount: 31,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2"],
    reactions: {
      insight: ["seed-user-1", "seed-user-2"],
      heart: ["seed-user-3"],
    },
  },

  // ── 06. Who Will AI Really Replace? ──
  {
    id: "seed-comm-6",
    postId: "sunii-intellekt-kimleri-issiz-qoyacaq-mit-stanford",
    authorId: "kamran-huseynov",
    author: {
      uid: "kamran-huseynov",
      displayName: "Kamran Hüseynov",
      role: "AI Systems Architect",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    text: "MIT araşdırmasının vurğuladığı 'Hibrid Bacarıq' modeli reallığı əks etdirir. AI təkcə icra alətidir; strateji qərar və biznes kontekstini dərk edən dizayner əksinə komandanın liderinə çevrilir.",
    content: "MIT araşdırmasının vurğuladığı 'Hibrid Bacarıq' modeli reallığı əks etdirir. AI təkcə icra alətidir; strateji qərar və biznes kontekstini dərk edən dizayner əksinə komandanın liderinə çevrilir.",
    createdAt: new Date("2026-07-29T10:00:00.000Z"),
    likesCount: 24,
    dislikesCount: 0,
    likedBy: ["seed-user-1"],
    reactions: {
      insight: ["seed-user-1", "seed-user-2"],
      fire: ["seed-user-3"],
    },
  },

  // ── 07. Self-Taught UI/UX Roadmap ──
  {
    id: "seed-comm-7",
    postId: "sifirdan-ui-ux-dizayn-oyrenmek-6-ayliq-xerite",
    authorId: "leyla-karimova",
    author: {
      uid: "leyla-karimova",
      displayName: "Leyla Kərimova",
      role: "Design Systems Educator",
      photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Tələbələrə hər zaman deyirəm: 10 səhifəlik Dribbble şəkli yox, real problemi həll edən 1 dərin Case Study sizi işə qəbul etdirir. Josh Kaufman-ın klonlama metodologiyası ən sürətli öyrənmə yoludur.",
    content: "Tələbələrə hər zaman deyirəm: 10 səhifəlik Dribbble şəkli yox, real problemi həll edən 1 dərin Case Study sizi işə qəbul etdirir. Josh Kaufman-ın klonlama metodologiyası ən sürətli öyrənmə yoludur.",
    createdAt: new Date("2026-07-23T14:30:00.000Z"),
    likesCount: 29,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2"],
      clap: ["seed-user-3"],
    },
  },

  // ── 08. No-Code Framer Monetization ──
  {
    id: "seed-comm-8",
    postId: "kod-yazmadan-sayt-yigib-satmaq-framer-no-code",
    authorId: "elvin-gasimov",
    author: {
      uid: "elvin-gasimov",
      displayName: "Elvin Qasımov",
      role: "No-Code Architect",
      photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Figma-dan Framer-ə keçid yerli bazarda inanılmaz imkan yaradır. Əvvəl 1 aya təhvil verdiyimiz landing page-i indi 3 günə canlıya çıxarırıq və müştəri hər şeyə özü nəzarət edə bilir.",
    content: "Figma-dan Framer-ə keçid yerli bazarda inanılmaz imkan yaradır. Əvvəl 1 aya təhvil verdiyimiz landing page-i indi 3 günə canlıya çıxarırıq və müştəri hər şeyə özü nəzarət edə bilir.",
    createdAt: new Date("2026-07-17T09:15:00.000Z"),
    likesCount: 26,
    dislikesCount: 0,
    likedBy: ["seed-user-1"],
    reactions: {
      fire: ["seed-user-1", "seed-user-2"],
      heart: ["seed-user-3"],
    },
  },

  // ── 09. Value Audit Client Acquisition ──
  {
    id: "seed-comm-9",
    postId: "0-tecrube-ile-ilk-1000-azn-deyer-auditi-metodu",
    authorId: "farid-jafarov",
    author: {
      uid: "farid-jafarov",
      displayName: "Fərid Cəfərov",
      role: "Freelance Consultant",
      photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Aleks Hormozinin yanaşması ilə soyuq email yerinə saytın 2 kritik səhvini göstərən 90 saniyəlik video çəkib göndərdim. 5 şirkətdən 2-si dərhal görüş təyin etdi və müqavilə bağladıq.",
    content: "Aleks Hormozinin yanaşması ilə soyuq email yerinə saytın 2 kritik səhvini göstərən 90 saniyəlik video çəkib göndərdim. 5 şirkətdən 2-si dərhal görüş təyin etdi və müqavilə bağladıq.",
    createdAt: new Date("2026-07-11T13:40:00.000Z"),
    likesCount: 33,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2"],
    reactions: {
      insight: ["seed-user-1", "seed-user-2"],
      fire: ["seed-user-3"],
    },
  },

  // ── 10. Digital Products & Passive Income ──
  {
    id: "seed-comm-10",
    postId: "reqemsal-sablonlar-sataraq-passiv-gelir-gumroad",
    authorId: "ravan-mammadov",
    author: {
      uid: "ravan-mammadov",
      displayName: "Rəvan Məmmədov",
      role: "Lead Creative Designer & Founder",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
    },
    text: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi yaradıcı insanlar üçün ən böyük azadlıqdır. Vaxtınızı hər saat satmaq yerinə, təkrar satılan bir Figma UI Kit qurmaq gəlir modelinizi kökündən dəyişir.",
    content: "Naval Ravikantın 'İcazəsiz Leverec' fəlsəfəsi yaradıcı insanlar üçün ən böyük azadlıqdır. Vaxtınızı hər saat satmaq yerinə, təkrar satılan bir Figma UI Kit qurmaq gəlir modelinizi kökündən dəyişir.",
    createdAt: new Date("2026-07-05T12:00:00.000Z"),
    likesCount: 42,
    dislikesCount: 0,
    likedBy: ["seed-user-1", "seed-user-2", "seed-user-3"],
    reactions: {
      heart: ["seed-user-1", "seed-user-2", "seed-user-3"],
      fire: ["seed-user-4", "seed-user-5"],
      clap: ["seed-user-6"],
    },
  },
];

function getStoredComments(): Comment[] {
  if (typeof window === "undefined") {
    return COMMUNITY_SEED_THREADS.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = COMMUNITY_SEED_THREADS.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed)
      ? (parsed.map((c) => normalizeComment(c)).filter(Boolean) as Comment[])
      : [];
    return list.length > 0
      ? list
      : (COMMUNITY_SEED_THREADS.map((c) => normalizeComment(c)).filter(Boolean) as Comment[]);
  } catch {
    return COMMUNITY_SEED_THREADS.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
  }
}

function saveStoredComments(comments: Comment[]) {
  if (typeof window === "undefined") return;
  try {
    // Only save normalized, non-empty comments
    const cleanList = comments.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanList));
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

const DYNAMIC_COMMUNITY_PERSONAS = [
  { name: "Orxan Quliyev", role: "Product Designer", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces" },
  { name: "Aydan Əliyeva", role: "UX Researcher", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces" },
  { name: "Murad Həsənov", role: "Frontend Lead", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
  { name: "Leyla Məcidova", role: "Brand Strategist", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" },
  { name: "Samir Məmmədli", role: "Growth Marketer", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces" },
  { name: "Elmir Rzayev", role: "Creative Technologist", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces" },
  { name: "Nigar Əhmədova", role: "Talent Specialist", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces" },
  { name: "Kamran Hüseynov", role: "Software Architect", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces" },
];

export function getDynamicCommentsForPost(canonicalId: string): Comment[] {
  let hash = 0;
  for (let i = 0; i < canonicalId.length; i++) {
    hash = (hash << 5) - hash + canonicalId.charCodeAt(i);
    hash |= 0;
  }
  const pos = Math.abs(hash);
  const persona1 = DYNAMIC_COMMUNITY_PERSONAS[pos % DYNAMIC_COMMUNITY_PERSONAS.length];
  const persona2 = DYNAMIC_COMMUNITY_PERSONAS[(pos + 3) % DYNAMIC_COMMUNITY_PERSONAS.length];

  const templates = [
    {
      c1: "Məqalədə vurğulanan yanaşma yerli və qlobal layihələrdə qarşılaşdığımız real problemlərə tam cavab verir. Xüsusilə praktiki nümunələr çox aydın izah olunub.",
      c2: "Tamamilə qatılıram. Biz də komandada oxşar strukturu tətbiq etdikdən sonra işlərin icra sürəti və keyfiyyəti nəzərəçarpacaq dərəcədə artdı.",
    },
    {
      c1: "Çox dəyərli və detallı analizdir. Mövzunun psixoloji və analitik tərəflərinin birləşdirilməsi məqaləni digər standart yazılardan fərqləndirir.",
      c2: "Düz qeyd etdiniz. Əksər hallarda ancaq nəzəriyyə danışılır, burada isə addım-addım tətbiq qaydası verilib.",
    },
    {
      c1: "Bu metodologiyanı cari layihəmizdə test etməyi planlaşdırıram. Təcrübədə ən çox diqqət edilməli olan nüanslar çox vaxtında qeyd edilib.",
      c2: "Nəticələri maraqla gözləyirik! Bizdə ilkin mərhələdə bir qədər adaptasiya vaxtı tələb etdi, amma nəticə gözləntiləri aşdı.",
    },
    {
      c1: "Dizayn və biznes maraqlarının kəsişməsini bu qədər səlis izah edən mənbələr azdır. Praktiki tövsiyələri dərhal qeyd etdim.",
      c2: "Xüsusilə qərarvermə prosesini optimallaşdırmaq baxımından çox faydalı bələdçidir.",
    }
  ];

  const tpl = templates[pos % templates.length];
  const date1 = new Date(Date.now() - ((pos % 14) + 2) * 86400000);
  const date2 = new Date(date1.getTime() + ((pos % 6) + 1) * 3600000);

  const rawThread: Comment[] = [
    {
      id: `comm-dyn-${canonicalId}-1`,
      postId: canonicalId,
      authorId: persona1.name.toLowerCase().replace(/\s+/g, "-"),
      author: {
        uid: persona1.name.toLowerCase().replace(/\s+/g, "-"),
        displayName: persona1.name,
        role: persona1.role,
        photoURL: persona1.avatar,
      },
      text: tpl.c1,
      content: tpl.c1,
      createdAt: date1,
      likesCount: (pos % 18) + 8,
      dislikesCount: 0,
      likedBy: ["seed-user-1", "seed-user-2"],
      reactions: {
        heart: ["seed-user-1", "seed-user-2"],
        insight: ["seed-user-3"],
      },
    },
    {
      id: `comm-dyn-${canonicalId}-2`,
      postId: canonicalId,
      parentId: `comm-dyn-${canonicalId}-1`,
      authorId: persona2.name.toLowerCase().replace(/\s+/g, "-"),
      author: {
        uid: persona2.name.toLowerCase().replace(/\s+/g, "-"),
        displayName: persona2.name,
        role: persona2.role,
        photoURL: persona2.avatar,
      },
      text: tpl.c2,
      content: tpl.c2,
      createdAt: date2,
      likesCount: (pos % 9) + 4,
      dislikesCount: 0,
      likedBy: ["seed-user-1"],
      reactions: {
        clap: ["seed-user-1"],
      },
    }
  ];

  return rawThread.map((c) => normalizeComment(c)).filter(Boolean) as Comment[];
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
  let initial = getStoredComments()
    .filter((c) => getCanonicalPostId(c.postId) === canonicalId)
    .sort((a, b) => toEpoch(b.createdAt) - toEpoch(a.createdAt));

  if (initial.length === 0) {
    initial = getDynamicCommentsForPost(canonicalId);
  }

  onCommentsUpdate(initial);

  // Also fetch any remotely approved comments from API
  if (typeof window !== "undefined") {
    fetch(`/api/comment?postId=${encodeURIComponent(canonicalId)}`)
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.comments) && data.comments.length > 0) {
            const remoteComments: Comment[] = data.comments
              .map((rc: any) =>
                normalizeComment({
                  id: rc._id || rc.id,
                  postId: getCanonicalPostId(rc.relatedPost?._ref || postId),
                  authorId: rc.authorEmail || rc.authorId || "remote-user",
                  author: {
                    uid: rc.authorEmail || "remote-user",
                    displayName: rc.authorName || "Anonymous Creator",
                    role: rc.authorRole || "Community Member",
                    photoURL: rc.authorPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
                  },
                  text: rc.commentText || rc.text || "",
                  createdAt: rc.createdAt ? new Date(rc.createdAt) : new Date(),
                  likesCount: rc.likes || 0,
                  dislikesCount: rc.dislikes || 0,
                })
              )
              .filter(Boolean) as Comment[];

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
  const textContent = (input.text || input.content || "").trim();
  if (!textContent) {
    throw new Error("Comment text cannot be empty.");
  }

  const rawComment: Comment = {
    id: `comm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    postId: canonicalId,
    parentId: input.parentId || null,
    authorId: input.author?.uid || input.authorId || "user",
    author: input.author,
    text: textContent,
    content: textContent,
    createdAt: new Date(),
    likesCount: 0,
    dislikesCount: 0,
    likedBy: [],
    dislikedBy: [],
    reactions: {},
    replies: [],
  };

  const newComment = normalizeComment(rawComment)!;
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
          authorName: newComment.author.displayName,
          authorEmail: newComment.author.email || `${newComment.authorId}@rvan.me`,
          authorRole: newComment.author.role,
          authorPhoto: newComment.author.photoURL,
          commentText: newComment.text,
          parentId: newComment.parentId,
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
  const targetId = input.commentId || input.id;
  const textContent = (input.text || input.content || "").trim();
  if (!textContent) throw new Error("Comment text cannot be empty.");

  const stored = getStoredComments();
  const index = stored.findIndex((c) => c.id === targetId);
  if (index === -1) throw new Error("Comment not found.");

  stored[index] = {
    ...stored[index],
    text: textContent,
    content: textContent,
    updatedAt: new Date(),
    isEdited: true,
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
 * Vote (like/dislike) on a comment with toggle support
 */
export async function voteComment(input: VoteInput): Promise<{ likes: number; dislikes: number; likedBy: string[]; dislikedBy: string[] }> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  const userId = input.userId || "anonymous-voter";
  const voteType = input.voteType || input.type || "like";

  if (!Array.isArray(comment.likedBy)) comment.likedBy = [];
  if (!Array.isArray(comment.dislikedBy)) comment.dislikedBy = [];

  if (voteType === "like") {
    if (comment.likedBy.includes(userId)) {
      // Toggle off like
      comment.likedBy = comment.likedBy.filter((uid) => uid !== userId);
    } else {
      // Add like and remove dislike if present
      comment.likedBy.push(userId);
      comment.dislikedBy = comment.dislikedBy.filter((uid) => uid !== userId);
    }
  } else if (voteType === "dislike") {
    if (comment.dislikedBy.includes(userId)) {
      // Toggle off dislike
      comment.dislikedBy = comment.dislikedBy.filter((uid) => uid !== userId);
    } else {
      // Add dislike and remove like if present
      comment.dislikedBy.push(userId);
      comment.likedBy = comment.likedBy.filter((uid) => uid !== userId);
    }
  }

  comment.likesCount = comment.likedBy.length;
  comment.likes = comment.likedBy.length;
  comment.dislikesCount = comment.dislikedBy.length;
  comment.dislikes = comment.dislikedBy.length;

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return {
    likes: comment.likesCount,
    dislikes: comment.dislikesCount,
    likedBy: comment.likedBy,
    dislikedBy: comment.dislikedBy,
  };
}

/**
 * React to a comment with an emoji (heart, laugh, fire, insight, etc.)
 */
export async function reactToComment(input: ReactionInput): Promise<Record<string, string[]>> {
  const stored = getStoredComments();
  const comment = stored.find((c) => c.id === input.commentId);
  if (!comment) throw new Error("Comment not found.");

  const reactionType = input.reactionType || input.type || "heart";
  const userId = input.userId || "anonymous-voter";

  if (!comment.reactions) comment.reactions = {};
  const currentList = Array.isArray(comment.reactions[reactionType])
    ? comment.reactions[reactionType]
    : [];

  if (currentList.includes(userId)) {
    // Toggle off reaction
    comment.reactions[reactionType] = currentList.filter((uid) => uid !== userId);
  } else {
    // Add user reaction
    comment.reactions[reactionType] = [...currentList, userId];
  }

  saveStoredComments(stored);
  notifySubscribers(comment.postId);

  return comment.reactions;
}
