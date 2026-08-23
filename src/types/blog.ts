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
  body: any[];
  body_az?: any[];
  publishDate: string;
  readTime: string;
  category: string;
  category_az?: string;
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
  seo?: BlogSeo;
}