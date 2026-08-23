export type AiDisclosureLevel =
  | "none" // I did not use AI
  | "assisted" // I used AI for research, brainstorming or editing
  | "substantial"; // I used AI substantially while drafting

export type SubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

export interface ContributorProfile {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  roleTitle?: string;
  location?: string;
  bio?: string;
  website?: string;
  linkedin?: string;
  instagram?: string;
  behance?: string;
  github?: string;
  twitter?: string;
  isVerifiedAuthor?: boolean;
  publishedArticlesCount?: number;
  updatedAt: string;
}

export interface ArticleSubmission {
  id: string;
  authorId: string;
  author: {
    uid: string;
    displayName: string;
    email: string | null;
    photoURL: string | null;
    roleTitle?: string;
  };
  title: string;
  excerpt: string;
  category: "design" | "marketing" | "branding" | "ai-creativity" | "creative-industry" | string;
  language: "az" | "en" | "tr";
  content: string; // Markdown or rich draft body
  coverImageUrl?: string;
  sources?: string;
  tags?: string[];
  aiDisclosure: AiDisclosureLevel;
  aiNotes?: string;
  status: SubmissionStatus;
  editorialFeedback?: string;
  createdAt: string;
  updatedAt: string;
  publishedSlug?: string;
}
