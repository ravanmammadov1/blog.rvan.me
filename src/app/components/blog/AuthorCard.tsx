import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlogPost } from "../../../types/blog";
import { AboutSection } from "../../../types/cms";
import { fetchAboutSection } from "../../../lib/sanityQueries";
import { urlFor } from "../../../lib/sanityClient";
import { useLanguage } from "../../../lib/i18n/LanguageContext";
import { slugifyAuthorName } from "../../../services/contributorService";
import RavanPortrait1200 from "@/imports/ravan_1-1200.webp";
import RavanPortrait800 from "@/imports/ravan_1-800.webp";
import RavanPortrait400 from "@/imports/ravan_1-400.webp";

interface AuthorCardProps {
  post?: BlogPost | null;
}

export default function AuthorCard({ post }: AuthorCardProps) {
  const { getLocalizedPath, language } = useLanguage();
  const isAz = language === "az";
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [localApp, setLocalApp] = useState<any>(null);

  useEffect(() => {
    fetchAboutSection().then((data) => {
      if (data) setAboutSection(data);
    });
  }, []);

  const rawAuthorName = post?.authorName || "";
  const isFounder =
    !rawAuthorName ||
    rawAuthorName.toLowerCase().includes("ravan") ||
    post?.authorSlug === "ravan-mammadov" ||
    post?.authorSlug === "ravan";

  const authorSlug = post?.authorSlug || slugifyAuthorName(rawAuthorName || "ravan-mammadov");

  useEffect(() => {
    if (typeof window !== "undefined" && authorSlug) {
      try {
        const apps = JSON.parse(localStorage.getItem("rvan_contributor_applications_v1") || "{}");
        const match = Object.values(apps).find(
          (a: any) => a.slug === authorSlug || slugifyAuthorName(a.displayName) === authorSlug
        );
        if (match) setLocalApp(match);
      } catch (e) {}
    }
  }, [authorSlug]);

  const authorName = localApp?.displayName || (rawAuthorName || (isAz ? "Rəvan Məmmədov" : "Ravan Mammadov"));
  const authorRole = localApp?.roleTitle || post?.authorRole || (isFounder ? (isAz ? "Təsisçi və Kreativ Direktor" : "Founder & Creative Director") : (isAz ? "Redaksiya Müəllifi" : "Editorial Contributor"));
  const authorBio =
    localApp?.bio ||
    post?.authorBio ||
    (isFounder
      ? (aboutSection?.introParagraph1 || "Visual systems, brand architecture, and behavioral design strategy.")
      : (isAz ? "Rvan.me müəllif icmasının fəal üzvü." : "Active contributor and essayist on Rvan.me."));

  const photoObj = post?.authorPhoto || (isFounder ? aboutSection?.profilePhoto : null);
  const authorPhotoUrl = localApp?.photoURL || (photoObj ? urlFor(photoObj)?.url() : (isFounder ? RavanPortrait1200 : null));

  return (
    <div className="my-16 flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center backdrop-blur-md sm:flex-row sm:text-left shadow-sm">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/60 bg-neutral-900 flex items-center justify-center">
        {authorPhotoUrl ? (
          isFounder ? (
            <picture>
              <source srcSet={`${RavanPortrait400} 400w, ${RavanPortrait800} 800w, ${RavanPortrait1200} 1200w`} type="image/webp" />
              <img src={authorPhotoUrl} alt={authorName} width={120} height={120} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
            </picture>
          ) : (
            <img src={authorPhotoUrl} alt={authorName} width={120} height={120} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
          )
        ) : (
          <span className="text-xl font-bold text-primary mono">
            {authorName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </span>
        )}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[.18em] text-primary mono">
          {isAz ? "MÜƏLLİF" : "WRITTEN BY"}
        </div>

        <h4 className="mt-1 text-xl font-bold text-foreground">
          <Link
            to={getLocalizedPath(`/author/${authorSlug}`)}
            className="hover:text-primary transition-colors"
          >
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
