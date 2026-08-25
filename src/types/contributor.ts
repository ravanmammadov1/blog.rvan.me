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

export type ContributorStatus =
  | "NONE" // Regular user (can comment, customize profile)
  | "APPLICANT" // Submitted contributor application, under review
  | "APPROVED" // Approved contributor, can draft and submit articles
  | "PUBLISHED" // Has at least 1 published article
  | "VERIFIED"; // Editorially verified contributor

export interface ContributorSocialLinks {
  website?: string;
  linkedin?: string;
  instagram?: string;
  behance?: string;
  dribbble?: string;
  github?: string;
  twitter?: string;
}

export interface ContributorApplication {
  uid: string;
  // Private / Editorial Only
  email: string | null;
  age?: number | string;
  internalNotes?: string;
  submittedAt: string;
  status: "APPLICANT" | "APPROVED" | "REJECTED";
  
  // Public Author Presentation Data
  displayName: string;
  slug: string;
  photoURL: string | null;
  roleTitle: string;
  areaOfExpertise?: string;
  yearsOfExperience?: string;
  currentRole?: string;
  location?: string;
  showLocation?: boolean;
  showAge?: boolean;
  bio: string;
  socialLinks: ContributorSocialLinks;
  preferredTopics: string[];
  preferredLanguage: "az" | "en" | "tr";
  isVerifiedAuthor?: boolean;
  acceptedTermsAt?: string;
  termsVersion?: string;
  updatedAt: string;
}

export interface ArticleDailyView {
  date: string; // YYYY-MM-DD
  views: number;
}

export interface ArticleAnalytics {
  articleSlug: string;
  articleTitle: string;
  authorId: string;
  views: number;
  reads: number;
  commentsCount: number;
  sharesCount: number;
  dailyViews: ArticleDailyView[];
  lastViewedAt?: string;
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
    slug?: string;
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
  feedbackHistory?: {
    feedback: string;
    requestedAt: string;
    resolvedAt?: string;
  }[];
  acceptedTermsAt?: string;
  termsVersion?: string;
  createdAt: string;
  updatedAt: string;
  publishedSlug?: string;
  analytics?: ArticleAnalytics;
}

export type ReportReason =
  | "spam"
  | "plagiarism"
  | "misleading"
  | "offensive"
  | "copyright"
  | "ai_low_effort"
  | "promotional"
  | "other";

export interface ArticleReport {
  id: string;
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  authorName?: string;
  reason: ReportReason;
  details?: string;
  reporterUid?: string;
  reporterEmail?: string;
  reporterName?: string;
  createdAt: string;
  status: "NEW" | "REVIEWING" | "RESOLVED" | "DISMISSED";
}
