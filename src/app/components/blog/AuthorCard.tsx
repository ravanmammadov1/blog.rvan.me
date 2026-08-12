import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { AboutSection } from "../../../types/cms";
import { fetchAboutSection } from "../../../lib/sanityQueries";
import { urlFor } from "../../../lib/sanityClient";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";

interface AuthorCardProps {
  post?: BlogPost | null;
}

export default function AuthorCard({ post }: AuthorCardProps) {
  const { getLocalizedPath } = useLanguage();
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
    ? urlFor(authorPhotoObj)?.url() || RavanPortrait1200
    : RavanPortrait1200;

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
    <div className="my-16 flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center backdrop-blur-md sm:flex-row sm:text-left shadow-sm">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/60 bg-black">
        <picture>
          <source srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`} type="image/webp" />
          <img src={authorPhotoUrl} alt={authorName} width={120} height={120} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        </picture>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[.18em] text-primary mono">
          Written by
        </div>

        <h4 className="mt-1 text-xl font-bold text-foreground">
          <Link to={getLocalizedPath("/ravan-mammadov")} className="hover:text-primary transition-colors">
            {authorName}
          </Link>
        </h4>

        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {authorRole}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {authorBio}
        </p>
      </div>
    </div>
  );
}
