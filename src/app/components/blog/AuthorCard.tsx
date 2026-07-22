import { DEFAULT_AUTHOR } from "../../../lib/blogHelpers";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import RavanPhoto from "@/imports/Ravan.png";

export default function AuthorCard() {
  return (
    <div className="my-16 flex flex-col items-center gap-6 rounded-2xl border border-white/10 bg-surface/60 p-8 text-center backdrop-blur-md sm:flex-row sm:text-left">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
        <ImageWithFallback
          src={RavanPhoto}
          alt={DEFAULT_AUTHOR.name}
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-[.18em] text-primary mono">
          Written by
        </div>

        <h4 className="mt-1 text-xl font-bold text-white">
          {DEFAULT_AUTHOR.name}
        </h4>

        <p className="mt-1 text-xs font-medium text-white/60">
          {DEFAULT_AUTHOR.role}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {DEFAULT_AUTHOR.bio}
        </p>
      </div>
    </div>
  );
}