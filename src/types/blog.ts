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

  tag: string[];

  featured: boolean;

  coverImage: any;
}