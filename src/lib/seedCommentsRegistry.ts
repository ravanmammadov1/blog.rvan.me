import { Comment } from "../types/comments";

/**
 * Article-Bound Discussion Seed Registry
 *
 * Provides highly authentic, topic-specific discussion threads for individual blog articles.
 * - Max 2-3 comments per article.
 * - 0-1 targeted replies per discussion.
 * - Zero generic praise ("Great post", "Nice article").
 * - Bound strictly by postId/slug to prevent cross-page data leakage.
 */

export const BLOG_SEED_DISCUSSIONS: Record<string, Comment[]> = {
  // 1. Motion Design Mechanics
  "motion-design-mechanics": [
    {
      id: "seed-mdm-1",
      postId: "motion-design-mechanics",
      authorId: "seed-dev-1",
      author: {
        uid: "seed-dev-1",
        displayName: "Marcus Thorne",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      text: "The point about over-shooting cubic beziers on mobile touch targets is spot on. I used to use (0.34, 1.56, 0.64, 1) for almost every UI modal until we noticed frame drops on lower-tier Android devices.",
      createdAt: new Date("2026-07-28T14:20:00Z"),
      parentId: null,
    },
    {
      id: "seed-mdm-2",
      postId: "motion-design-mechanics",
      authorId: "seed-dev-2",
      author: {
        uid: "seed-dev-2",
        displayName: "Elena Rostova",
        photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      },
      text: "Ngl cubic-bezier(0.16, 1, 0.3, 1) has basically become my default for springy drawer reveals in React Native. Smooth deceleration without feeling sluggish.",
      createdAt: new Date("2026-07-28T15:05:00Z"),
      parentId: null,
    },
    {
      id: "seed-mdm-3",
      postId: "motion-design-mechanics",
      authorId: "seed-dev-3",
      author: {
        uid: "seed-dev-3",
        displayName: "David Chen",
        photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
      text: "Do you ever offset spatial timing dynamically based on list item count? Or do you cap stagger delays at around 250ms total for large datasets?",
      createdAt: new Date("2026-07-28T16:40:00Z"),
      parentId: null,
    },
    {
      id: "seed-mdm-4",
      postId: "motion-design-mechanics",
      authorId: "seed-dev-1",
      author: {
        uid: "seed-dev-1",
        displayName: "Marcus Thorne",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      text: "Definitely cap it. Anything beyond 300ms total stagger duration starts making the app feel laggy to heavy users, even if 60fps renders cleanly.",
      createdAt: new Date("2026-07-28T17:15:00Z"),
      parentId: "seed-mdm-3",
    },
  ],

  // 2. Design Tokens & System Architecture
  "design-tokens-and-system-architecture": [
    {
      id: "seed-dt-1",
      postId: "design-tokens-and-system-architecture",
      authorId: "seed-dt-user-1",
      author: {
        uid: "seed-dt-user-1",
        displayName: "Sophie Laurent",
        photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      },
      text: "Mapping Figma Variables directly to Tailwind CSS CSS variables using Style Dictionary was a huge speedup for our team. The hardest part was convincing dev leads to abandon hardcoded hex values in component props.",
      createdAt: new Date("2026-07-25T11:10:00Z"),
      parentId: null,
    },
    {
      id: "seed-dt-2",
      postId: "design-tokens-and-system-architecture",
      authorId: "seed-dt-user-2",
      author: {
        uid: "seed-dt-user-2",
        displayName: "Tural Mammadov",
        photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
      text: "Bizdə ən böyük problem semantic token sırasını düzgün qurmaq idi (bg-surface-primary vs color-brand-500). Məqalədəki 3-tier layering strukturunu komandada tətbiq etdikdən sonra refaktor çox rahatlaşdı.",
      createdAt: new Date("2026-07-25T13:45:00Z"),
      parentId: null,
    },
  ],

  // 3. Dark Mode UI Architecture
  "dark-mode-ui-architecture": [
    {
      id: "seed-dm-1",
      postId: "dark-mode-ui-architecture",
      authorId: "seed-dm-1",
      author: {
        uid: "seed-dm-1",
        displayName: "Lucas Vance",
        photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      },
      text: "Tbh pure #000000 backgrounds cause terrible OLED smearing during fast vertical scrolling. Using #09090b or #0d0d10 with 5% surface overlays looks 10x more premium.",
      createdAt: new Date("2026-07-22T09:30:00Z"),
      parentId: null,
    },
    {
      id: "seed-dm-2",
      postId: "dark-mode-ui-architecture",
      authorId: "seed-dm-2",
      author: {
        uid: "seed-dm-2",
        displayName: "Orkhan Guliyev",
        photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      },
      text: "Düzdür, tünd rejimdə kontrasdı qorumaq üçün rəngin saturation dəyərini 15-20% azaltmaq vacibdir. Əks halda neon elementlər gözü tez yorur.",
      createdAt: new Date("2026-07-22T10:15:00Z"),
      parentId: null,
    },
    {
      id: "seed-dm-3",
      postId: "dark-mode-ui-architecture",
      authorId: "seed-dm-1",
      author: {
        uid: "seed-dm-1",
        displayName: "Lucas Vance",
        photoURL: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80",
      },
      text: "Exact. Desaturating primary accents by around 15% on dark surfaces prevents visual vibration around crisp text borders.",
      createdAt: new Date("2026-07-22T11:00:00Z"),
      parentId: "seed-dm-2",
    },
  ],

  // 4. AI Image Generation Pipelines
  "ai-image-generation-pipelines": [
    {
      id: "seed-ai-img-1",
      postId: "ai-image-generation-pipelines",
      authorId: "seed-ai-1",
      author: {
        uid: "seed-ai-1",
        displayName: "Kavya Patel",
        photoURL: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      },
      text: "FLUX.1 Dev combined with ControlNet depth maps has basically replaced 80% of our initial 3D studio blocking phase for packaging concepts. Speed is insane.",
      createdAt: new Date("2026-07-19T16:00:00Z"),
      parentId: null,
    },
    {
      id: "seed-ai-img-2",
      postId: "ai-image-generation-pipelines",
      authorId: "seed-ai-2",
      author: {
        uid: "seed-ai-2",
        displayName: "Emin Aslanov",
        photoURL: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      },
      text: "Btw commercial vector export tərəfində rəng dəqiqliyini necə saxlayırsınız? AI-dən gələn raster asset-ləri CMYK çap üçün vektora keçirəndə rəng tonları bəzən itir.",
      createdAt: new Date("2026-07-19T17:20:00Z"),
      parentId: null,
    },
  ],

  // 5. Minimalist Packaging & Graphic Layouts
  "minimalist-packaging-and-graphic-layouts": [
    {
      id: "seed-pkg-1",
      postId: "minimalist-packaging-and-graphic-layouts",
      authorId: "seed-pkg-1",
      author: {
        uid: "seed-pkg-1",
        displayName: "Sarah Jenkins",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      text: "The breakdown of tactile foil stamping vs debossing contrast in FMCG cosmetics was super insightful. Less really is more when the substrate material texture speaks for itself.",
      createdAt: new Date("2026-07-15T08:40:00Z"),
      parentId: null,
    },
    {
      id: "seed-pkg-2",
      postId: "minimalist-packaging-and-graphic-layouts",
      authorId: "seed-pkg-2",
      author: {
        uid: "seed-pkg-2",
        displayName: "Leyla Rahimli",
        photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
      },
      text: "Xüsusilə Azərbaycan pərakəndə sektorunda piştaxtada diqqət çəkmək üçün bəzən markalar həddindən artıq vizual element doldururlar. Minimalist yanaşma məhsulu daha premium göstərir.",
      createdAt: new Date("2026-07-15T10:10:00Z"),
      parentId: null,
    },
  ],

  // 6. The AIDA Framework
  "the-aida-framework": [
    {
      id: "seed-aida-1",
      postId: "the-aida-framework",
      authorId: "seed-aida-1",
      author: {
        uid: "seed-aida-1",
        displayName: "Julian Rossi",
        photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
      text: "IMO the first 1.5 seconds of a video ad are 90% of the battle. If your visual hook doesn't break the infinite scroll pattern, the rest of the AIDA sequence doesn't even get evaluated.",
      createdAt: new Date("2026-07-12T12:00:00Z"),
      parentId: null,
    },
    {
      id: "seed-aida-2",
      postId: "the-aida-framework",
      authorId: "seed-aida-2",
      author: {
        uid: "seed-aida-2",
        displayName: "Rashad Baghirov",
        photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
      text: "Tamamilə razıyam. Meta və TikTok reklamlarında 'Action' düyməsinə keçməzdən əvvəl 'Desire' mərhələsində sosial sübut (UGC / testimonial) göstərmək konversiyanı 2 dəfə artırır.",
      createdAt: new Date("2026-07-12T13:15:00Z"),
      parentId: null,
    },
  ],

  // 7. What is the FOMO?
  "what-is-the-fomo": [
    {
      id: "seed-fomo-1",
      postId: "what-is-the-fomo",
      authorId: "seed-fomo-1",
      author: {
        uid: "seed-fomo-1",
        displayName: "Clara Rossi",
        photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      },
      text: "Artificial urgency timers in SaaS pricing pages often backfire when users notice the countdown resets after clearing cookies. Authentic scarcity (e.g. limited cohort seats) works so much better.",
      createdAt: new Date("2026-07-10T14:30:00Z"),
      parentId: null,
    },
    {
      id: "seed-fomo-2",
      postId: "what-is-the-fomo",
      authorId: "seed-fomo-2",
      author: {
        uid: "seed-fomo-2",
        displayName: "Kamran Aliyev",
        photoURL: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      },
      text: "Ngl yerli bazarda brendlər üçün real 'limited drop' kampaniyaları keçirəndə müştəri marağı süni endirimlərdən daha yüksək olur.",
      createdAt: new Date("2026-07-10T16:05:00Z"),
      parentId: null,
    },
  ],
};

/**
 * Helper to fetch unique discussion seed comments for a specific post.
 */
export function getSeedCommentsForPost(postId: string): Comment[] {
  if (!postId) return [];
  const normalized = postId.trim().toLowerCase();

  // Match by exact slug key or fallback to matched category seed
  if (BLOG_SEED_DISCUSSIONS[normalized]) {
    return BLOG_SEED_DISCUSSIONS[normalized];
  }

  return [];
}
