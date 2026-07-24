export interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt: string;
  body: any[];
  publishDate: string;
  readTime: string;
  category: string;
  tags?: string[];
  tag?: string[];
  featured: boolean;
  coverImage: any;
  authorName?: string;
  authorRole?: string;
  authorPhoto?: any;
  authorBio?: string;
}