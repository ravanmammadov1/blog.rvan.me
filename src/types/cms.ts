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

export interface ExperienceItem {
  year?: string;
  role: string;
  company?: string;
  desc?: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface AboutSection {
  _id?: string;
  heading?: string;
  introParagraph1?: string;
  introParagraph2?: string;
  profilePhoto?: any;
  stats?: StatItem[];
  experience?: ExperienceItem[];
  skills?: SkillCategory[];
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


export interface ResourceItem {
  _id: string;
  title: string;
  slug?: string;
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

