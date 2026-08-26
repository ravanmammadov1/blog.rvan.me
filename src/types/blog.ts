export interface BlogSlug {
  _type?: string;
  current: string;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: any;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface BlogSource {
  title: string;
  author?: string;
  year?: string | number;
  url?: string;
}

export interface BlogDiscussionPrompt {
  question: string;
  question_az?: string;
  context?: string;
  context_az?: string;
}

export interface BlogSocialDrafts {
  linkedin?: string;
  instagram?: string;
  x?: string;
  telegram?: string;
  newsletter?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  title_az?: string;
  slug: BlogSlug;
  slug_az?: BlogSlug;
  originalSlug?: string;
  azSlug?: string;
  excerpt: string;
  excerpt_az?: string;
  deck?: string;
  deck_az?: string;
  body: any[];
  body_az?: any[];
  publishDate: string;
  readTime: string;
  category: string;
  category_az?: string;
  desk?: string;
  desk_az?: string;
  format?: "Analiz" | "Bələdçi" | "Keys" | "Tədqiqat" | "Fikir";
  cluster?: "career" | "design" | "marketing" | "ai" | "strategy";
  tags?: string[];
  tag?: string[];
  featured?: boolean;
  coverImage: any;
  authorName?: string;
  authorSlug?: string;
  authorRole?: string;
  authorPhoto?: any;
  authorBio?: string;
  status?: "draft" | "review" | "published";
  discussionPrompt?: BlogDiscussionPrompt;
  sources?: BlogSource[];
  relatedSlugs?: string[];
  socialDrafts?: BlogSocialDrafts;
  seo?: BlogSeo;
}