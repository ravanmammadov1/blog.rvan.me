import { useEffect, useState } from "react";
import { BlogPost } from "../../../types/blog";
import { AboutSection } from "../../../types/cms";
import { fetchAboutSection } from "../../../lib/sanityQueries";
import { urlFor } from "../../../lib/sanityClient";
import RavanPortrait from "@/imports/ravan_1.png";

interface AuthorCardProps {
  post?: BlogPost | null;
}

export default function AuthorCard({ post }: AuthorCardProps) {
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);

  useEffect(() => {
    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });
  }, []);

  // Priority 1: Blog post author photo from Sanity
  // Priority 2: About section profile photo from Sanity
  // Priority 3: Fallback image asset
  const authorPhotoObj = post?.authorPhoto || aboutSection?.profilePhoto;
  const authorPhotoUrl = authorPhotoObj
    ? urlFor(authorPhotoObj)?.url() || RavanPortrait
    : RavanPortrait;

  // Priority 1: Blog post author name from Sanity
  // Priority 2: Fallback name
  const authorName = post?.authorName || "Ravan Mammadov";

  // Priority 1: Blog post author role from Sanity
  // Priority 2: Fallback role
  const authorRole = post?.authorRole || "Senior Creative Designer & Marketer";

  // Priority 1: Blog post author bio from Sanity
  // Priority 2: About section paragraph 1 from Sanity
  const authorBio =
    post?.authorBio ||
    aboutSection?.introParagraph1 ||
    "From the first concept to the last frame, every detail is shaped to make an emotional impact. I work across motion, graphic design, art direction and growth-focused creative.";

  return (
    <div className="my-16 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-surface/60 p-8 text-center backdrop-blur-md sm:flex-row sm:text-left">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/60 bg-black">
        <img
          src={authorPhotoUrl}
          alt={authorName}
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[.18em] text-primary mono">
          Written by
        </div>

        <h4 className="mt-1 text-xl font-bold text-white">
          {authorName}
        </h4>

        <p className="mt-1 text-xs font-medium text-white/60">
          {authorRole}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {authorBio}
        </p>
      </div>
    </div>
  );
}