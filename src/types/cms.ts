export interface NewsItem {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  coverImage?: any;
  excerpt?: string;
  body?: any[];
  publishedAt?: string;
  category?: string;
}

export interface ToolItem {
  _id: string;
  name: string;
  description?: string;
  icon?: any;
  link?: string;
  category?: string;
}

export interface ProjectItem {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  coverImage?: any;
  client?: string;
  description?: string;
  type?: string;
  tags?: string[];
  body?: any[];
  gallery?: any[];
  liveUrl?: string;
  year?: string;
  accent?: string;
  order?: number;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface PlatformValue {
  title: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface DetailedExperienceItem {
  period: string;
  role: string;
  company: string;
  brands?: string[];
  responsibilities?: string[];
  desc?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period?: string;
  description?: string;
}

export interface AwardItem {
  title: string;
  issuer?: string;
  year?: string;
  category?: string;
}

export interface BrandItem {
  name: string;
  category?: string;
  logo?: any;
}

export interface AboutSection {
  _id?: string;
  heading?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  profilePhoto?: any;
  stats?: StatItem[];
  platformValues?: PlatformValue[];
  experience?: DetailedExperienceItem[];
  skills?: SkillCategory[];
  education?: EducationItem[];
  awards?: AwardItem[];
  brandLogos?: BrandItem[];
}

export interface TestimonialItem {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  photo?: any;
  linkedURL?: string;
}

export interface SocialLinks {
  email?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  behance?: string;
  pinterest?: string;
}

export interface SEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: any;
  twitterImage?: any;
  siteName?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  defaultKeywords?: string;
  author?: string;
  googleVerification?: string;
}

export interface NavItemSetting {
  label: string;
  target: string;
  hidden?: boolean;
}

export interface AnnouncementBar {
  text?: string;
  link?: string;
  linkLabel?: string;
  enabled?: boolean;
}

export interface HeroCoordinates {
  lat?: string;
  lng?: string;
}

export interface ServiceItemSetting {
  name: string;
  relatedBlogSlug?: string;
  externalLink?: string;
}

export interface PrincipleItemSetting {
  label: string;
  tools?: string;
  relatedBlogSlug?: string;
}

export interface FieldNoteItemSetting {
  period?: string;
  role: string;
  badge?: string;
  desc1?: string;
  desc2?: string;
  relatedBlogSlug?: string;
}

export interface SiteSettings {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  availabilityStatus?: string;
  heroEmbedUrl?: string;
  favicon?: any;
  logo?: any;
  resumeFileUrl?: string;
  services?: ServiceItemSetting[];
  principles?: PrincipleItemSetting[];
  fieldNotes?: FieldNoteItemSetting[];
  socialLinks?: SocialLinks;
  seo?: SEOSettings;
  navItems?: NavItemSetting[];
  contactHeading?: string;
  contactSubtext?: string;
  letsTalkLabel?: string;
  heroCoordinates?: HeroCoordinates;
  footerText?: string;
  announcementBar?: AnnouncementBar;
}

export interface CommentItem {
  _id: string;
  relatedPostId?: string;
  authorName: string;
  authorEmail?: string;
  commentText: string;
  status: "pending" | "approved" | "declined";
  likes: number;
  dislikes: number;
  createdAt: string;
}

export interface ResourceTag {
  _id: string;
  name: string;
  slug?: string;
}

export interface ResourceCategory {
  _id: string;
  name: string;
  slug?: string;
}


export type UniversalContentType =
  | "resource"
  | "aiTool"
  | "scholarship"
  | "remoteJob"
  | "competition"
  | "freeCourse"
  | "githubProject"
  | "designAsset"
  | "template"
  | "marketingResource"
  | "industryNews";

export interface UniversalContentItem {
  _id: string;
  _createdAt?: string;
  title: string;
  slug: { current: string } | string;
  contentType: UniversalContentType;
  summary: string;
  whyItMatters?: string;
  whoShouldUseIt?: string;
  link: string;
  coverImage?: any;
  logo?: any;
  qualityScore: number;
  trendingScore: number;
  publishedAt?: string;
  status: "draft" | "review" | "published" | "archived";
  verificationStatus?: "official" | "verified" | "community";
  sourceName?: string;
  category?: { name: string; slug: { current: string }; icon?: string };
  tags?: Array<{ name: string; slug: { current: string } }>;

  // Polymorphic Metadata Extensions
  jobDetails?: { company?: string; locationType?: string; salaryRange?: string; countryEligibility?: string[] };
  scholarshipDetails?: { fundingAmount?: string; eligibilityCriteria?: string; deadline?: string };
  aiToolDetails?: { pricingModel?: "free" | "freemium" | "paid"; platforms?: string[] };
  githubDetails?: { repoUrl?: string; starsCount?: number; primaryLanguage?: string; license?: string };
  courseDetails?: { provider?: string; duration?: string; certificateIncluded?: boolean };
  competitionDetails?: { prizePool?: string; deadline?: string; organizer?: string };

  seoTitle?: string;
  seoDescription?: string;
}

export interface ResourceItem {
  _id: string;
  title: string;
  slug?: string | { current?: string };
  resourceType:
    | "studentPack"
    | "aiCredits"
    | "software"
    | "roadmap"
    | "scholarship"
    | "internship"
    | "job"
    | "hackathon"
    | "startupProgram";
  category?: ResourceCategory;
  tags?: ResourceTag[];
  description: string;
  benefitSummary?: string;
  link: string;
  logo?: any;
  status: "draft" | "review" | "published" | "archived" | "expired";
  verificationStatus: "official" | "verified" | "community";
  isGlobal?: boolean;
  countries?: string[];
  body?: any[];
  
  // Roadmap specific
  difficultyLevel?: "beginner" | "intermediate" | "advanced" | "all";
  completionTime?: string;

  // Conditional fields
  company?: string;
  salaryRange?: string;
  prizePool?: string;
  startDate?: string;
  endDate?: string;
  fundingAmount?: string;

  // Sorting & badges
  featuredScore?: number;
  sortPriority?: number;
  badges?: string[];
  analyticsId?: string;

  // SEO overrides
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: any;
    canonicalUrl?: string;
    noIndex?: boolean;
  };
}

