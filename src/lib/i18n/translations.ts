export type Language = "en" | "az";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    navHome: "Home",
    navNews: "News",
    navResources: "Resources",
    navTools: "Tools",
    navBlog: "Blog",
    navAbout: "About",
    navProfile: "Profile",
    navContact: "Contact",
    signIn: "SIGN IN",
    signOut: "Sign Out",

    // Hero Section
    heroBadge: "STUDIO VISION & CREATIVE ENGINE",
    heroTitle1: "Design that moves.",
    heroTitle2: "Ideas that matter.",
    heroSubtitle: "A creative studio and digital platform exploring design, marketing, technology, and the tools shaping the digital world.",
    btnExploreResources: "EXPLORE RESOURCES",
    btnReadNews: "READ INDUSTRY NEWS",

    // Section Titles
    sectionNewsEyebrow: "02 / Industry Intelligence Feed",
    sectionNewsTitle: "Latest updates.",
    viewAllNews: "VIEW ALL NEWS",

    sectionBlogEyebrow: "03 / Insights & Ideas",
    sectionBlogTitle: "Thinking out loud.",
    exploreAllArticles: "EXPLORE ALL ARTICLES",
    exploreFullBlogArchive: "EXPLORE FULL BLOG ARCHIVE",

    sectionResourcesEyebrow: "04 / Curated Vault",
    sectionResourcesTitle: "Showcase resources.",
    exploreFullResourceArchive: "EXPLORE FULL RESOURCE ARCHIVE",

    sectionToolsEyebrow: "IN-BROWSER WORKFLOW ENGINE",
    sectionToolsTitle: "Featured Interactive Tools.",
    sectionToolsSubtitle: "Test visual CSS generators, waves, fluid typography, and color contrast directly on this page—zero API dependencies, instant client-side code export.",
    viewAllUtilities: "VIEW ALL IN-BROWSER UTILITIES",

    sectionContactEyebrow: "LET'S BUILD SOMETHING EXTRAORDINARY",
    sectionContactTitle: "Got a project in mind?",
    sectionContactSubtitle: "Whether you need motion design, brand systems, visual identity or creative technical direction—let's discuss your vision.",
    btnGetInTouch: "GET IN TOUCH",

    // News Archive & Detail
    newsArchiveTitle: "Industry News & Technical Insights",
    newsArchiveSubtitle: "Real-time coverage across Design, AI, Frontend, Dev, Marketing, and Motion. Unified real-time feed.",
    allNews: "All News",
    designNews: "Design",
    aiNews: "AI & ML",
    marketingNews: "Marketing",
    frontendNews: "Frontend",
    motionNews: "Motion",
    announcements: "Announcements",
    readArticle: "READ ARTICLE",
    backToNews: "BACK TO NEWS HUB",
    aiSummaryTitle: "AI Editorial Executive Summary",
    originalSource: "Original Source",
    visitArticle: "VISIT ORIGINAL PUBLICATION",
    relatedArticles: "Related Intelligence",
    copyLink: "Copy Link",
    linkCopied: "Link Copied!",

    // Resources Archive
    resourcesArchiveTitle: "Creative Resources & Open-Source Directory",
    resourcesArchiveSubtitle: "Curated open-source fonts, developer repositories, design utilities, asset kits, and learning roadmaps.",
    fonts: "Fonts",
    githubRepos: "GitHub Repositories",
    tools: "Tools",
    assets: "Assets",
    learning: "Learning",
    inspiration: "Inspiration",
    searchPlaceholder: "Search by title, keyword, or tag...",
    loadMore: "LOAD MORE",
    visitResource: "VISIT RESOURCE",
    backToResources: "BACK TO RESOURCES",

    // Blog Archive & Detail
    blogArchiveTitle: "Design & Motion Insights",
    blogArchiveSubtitle: "Original articles on visual strategy, motion mechanics, design systems, and creative technology.",
    readTime: "read",
    backToBlog: "BACK TO BLOG",
    writtenBy: "WRITTEN BY",
    publishedOn: "PUBLISHED ON",
    shareArticle: "Share Article",

    // Footer
    footerTagline: "Independent Creative Studio & Digital Ecosystem",
    footerCopyright: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    cookiePolicy: "Cookie Policy",
  },
  az: {
    // Navigation
    navHome: "Ana Səhifə",
    navNews: "Xəbərlər",
    navResources: "Resurslar",
    navTools: "Alətlər",
    navBlog: "Bloq",
    navAbout: "Haqqında",
    navProfile: "Profil",
    navContact: "Əlaqə",
    signIn: "DAXİL OL",
    signOut: "Çıxış et",

    // Hero Section
    heroBadge: "STUDİO VİZYONU VƏ YARADICI MƏRKƏZ",
    heroTitle1: "Dizayn ki, hərəkət edir.",
    heroTitle2: "Fikirlər ki, dəyər daşıyır.",
    heroSubtitle: "Rəqəmsal dünyanı formalaşdıran dizayn, marketinq, texnologiya və alətləri kəşf edən yaradıcı studiya və rəqəmsal platforma.",
    btnExploreResources: "RESURSLARI KƏŞF ET",
    btnReadNews: "SAHƏ XƏBƏRLƏRİNİ OXU",

    // Section Titles
    sectionNewsEyebrow: "02 / Sahə Xəbərləri Və İntellekt Lenti",
    sectionNewsTitle: "Son güncəlləmələr.",
    viewAllNews: "BÜTÜN XƏBƏRLƏRƏ BAX",

    sectionBlogEyebrow: "03 / Fikirlər Və Məqalələr",
    sectionBlogTitle: "Təcrübə və yazılar.",
    exploreAllArticles: "BÜTÜN MƏQALƏLƏRƏ BAX",
    exploreFullBlogArchive: "BLOQ ARXİVİNƏ BAX",

    sectionResourcesEyebrow: "04 / Seçilmiş Kolleksiya",
    sectionResourcesTitle: "Önə çıxan resurslar.",
    exploreFullResourceArchive: "RESURS ARXİVİNƏ BAX",

    sectionToolsEyebrow: "BRAUZER-DAXİLİ ALƏTLƏR",
    sectionToolsTitle: "İnteraktiv İş Alətləri.",
    sectionToolsSubtitle: "Vizual CSS generatorları, SVG dalğaları, fluid tipoqrafiya və rəng kontrastını birbaşa səhifədə sınaqdan keçirin—anında kod ixracı.",
    viewAllUtilities: "BÜTÜN ALƏTLƏRƏ BAX",

    sectionContactEyebrow: "BİRLİKDƏ YENİ LAYİHƏ BAŞLADAQ",
    sectionContactTitle: "Yeni bir projeniz var?",
    sectionContactSubtitle: "Hərəkətli dizayn, brend sistemləri, vizual kimlik və ya rəqəmsal texniki həllər üçün vizyonunuzu müzakirə edək.",
    btnGetInTouch: "ƏLAQƏ SAXLA",

    // News Archive & Detail
    newsArchiveTitle: "Sahə Xəbərləri Və Texniki İcmallar",
    newsArchiveSubtitle: "Dizayn, Süni İntellekt, Frontend, Marketinq və Motion sahəsində canlı xəbər və analitik lent.",
    allNews: "Bütün Xəbərlər",
    designNews: "Dizayn",
    aiNews: "Süni İntellekt & ML",
    marketingNews: "Marketinq",
    frontendNews: "Frontend",
    motionNews: "Motion & 3D",
    announcements: "Elanlar",
    readArticle: "MƏQALƏNİ OXU",
    backToNews: "XƏBƏRLƏRƏ QAYIT",
    aiSummaryTitle: "AI Redaksiya Xülasəsi",
    originalSource: "Əsl Mənbə",
    visitArticle: "RƏSMİ MƏNBƏDƏ OXU",
    relatedArticles: "Oxşar Xəbərlər",
    copyLink: "Linki Köçür",
    linkCopied: "Link Köçürüldü!",

    // Resources Archive
    resourcesArchiveTitle: "Yaradıcı Resurslar Və Açıq-Mənbə Kataloqu",
    resourcesArchiveSubtitle: "Açıq-mənbəli şriftlər, proqramçı repozitoriyaları, dizayn alətləri, vizual dəstlər və təhsil resursları.",
    fonts: "Şriftlər",
    githubRepos: "GitHub Repozitoriyaları",
    tools: "Alətlər",
    assets: "Vizuallar & Dəstlər",
    learning: "Təhsil & Kurslar",
    inspiration: "İlham Mənbələri",
    searchPlaceholder: "Başlıq, açar söz və ya teg ilə axtarın...",
    loadMore: "DAHA ÇOX YÜKLƏ",
    visitResource: "RESURSA KEÇ",
    backToResources: "RESURSLARA QAYIT",

    // Blog Archive & Detail
    blogArchiveTitle: "Dizayn Və Motion Analitikası",
    blogArchiveSubtitle: "Vizual strategiya, motion mexanikası, dizayn sistemləri və texnologiya haqqında müəllif məqalələri.",
    readTime: "oxuma müddəti",
    backToBlog: "BLOQA QAYIT",
    writtenBy: "MÜƏLLİF",
    publishedOn: "TƏRİX",
    shareArticle: "Məqaləni Paylaş",

    // Footer
    footerTagline: "Müstəqil Yaradıcı Studiya Və Rəqəmsal Platforma",
    footerCopyright: "Bütün hüquqlar qorunur.",
    privacyPolicy: "Məxfilik Siyasəti",
    termsOfService: "İstifadə Şərtləri",
    cookiePolicy: "Kuki Siyasəti",
  },
};
