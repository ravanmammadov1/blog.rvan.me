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
}

export interface SiteSettings {
  _id?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  availabilityStatus?: string;
  heroEmbedUrl?: string;
  logo?: any;
  resumeFileUrl?: string;
  socialLinks?: SocialLinks;
  seo?: SEOSettings;
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
