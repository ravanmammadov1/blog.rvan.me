import React, { useState } from "react";
import { Check, Copy, Image as ImageIcon, FileCode, ExternalLink, ShieldCheck } from "lucide-react";
import { IllustrationItem } from "../../../lib/illustrationsData";

interface IllustrationSpecimenCardProps {
  illustration: IllustrationItem;
  accentColor?: string;
}

export const IllustrationSpecimenCard: React.FC<IllustrationSpecimenCardProps> = ({
  illustration,
  accentColor = "#61c5ad",
}) => {
  const [downloadedType, setDownloadedType] = useState<"png" | "svg" | "copied" | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCopySvg = async () => {
    try {
      const res = await fetch(illustration.src);
      const svgText = await res.text();
      const customizedSvg = svgText.split("#6c63ff").join(accentColor);
      await navigator.clipboard.writeText(customizedSvg);
      setDownloadedType("copied");
      setTimeout(() => setDownloadedType(null), 2000);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      const res = await fetch(illustration.src);
      let svgText = await res.text();

      if (accentColor && accentColor !== "#6c63ff") {
        svgText = svgText.split("#6c63ff").join(accentColor);
      }

      if (!svgText.includes("<rect") && !svgText.includes('fill="#0c0c10"')) {
        const insertIdx = svgText.indexOf(">") + 1;
        svgText =
          svgText.slice(0, insertIdx) +
          `<rect width="100%" height="100%" fill="#0c0c10"/>` +
          svgText.slice(insertIdx);
      }

      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${illustration.slug || illustration.id}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadedType("svg");
      setTimeout(() => setDownloadedType(null), 2000);
    } catch (err) {
      console.error("Failed to download SVG:", err);
    }
  };

  const handleDownloadPng = async () => {
    try {
      const res = await fetch(illustration.src);
      let svgText = await res.text();

      if (accentColor && accentColor !== "#6c63ff") {
        svgText = svgText.split("#6c63ff").join(accentColor);
      }

      const canvas = document.createElement("canvas");
      const width = 1200;
      const height = 900;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      ctx.fillStyle = "#0c0c10";
      ctx.fillRect(0, 0, width, height);

      const svgDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
      const img = new Image();

      img.onload = () => {
        const padding = 60;
        ctx.drawImage(img, padding, padding, width - padding * 2, height - padding * 2);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${illustration.slug || illustration.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadedType("png");
        setTimeout(() => setDownloadedType(null), 2000);
      };
      img.src = svgDataUri;
    } catch (err) {
      console.error("Failed to download PNG:", err);
    }
  };

  return (
    <article className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/40 flex flex-col justify-between overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:hover:shadow-black/40">
      <div>
        {/* Header: Category Badge & Copy SVG */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2 py-0.5 rounded-md mono truncate max-w-[170px]">
            {illustration.category}
          </span>

          <button
            onClick={handleCopySvg}
            className="text-[10px] font-mono text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Copy SVG code to clipboard"
          >
            {downloadedType === "copied" ? (
              <>
                <Check size={12} className="text-emerald-500" />
                <span className="text-emerald-500 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>COPY SVG</span>
              </>
            )}
          </button>
        </div>

        {/* Live Vector SVG Render Preview */}
        <div className="my-3 flex items-center justify-center p-4 rounded-xl border border-border bg-surface aspect-[4/3] overflow-hidden relative">
          <img
            src={illustration.src}
            alt={illustration.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          )}
        </div>

        {/* Title & Searchable Tags */}
        <div className="mb-3 space-y-1">
          <h3 className="text-sm font-bold text-card-foreground group-hover:text-primary transition-colors mono truncate">
            {illustration.title}
          </h3>
          <p className="text-[11px] text-muted-foreground mono truncate">
            {illustration.tags.slice(0, 4).join(" • ")}
          </p>
        </div>

        {/* Source & Open-Source License Attribution Bar */}
        <div className="pt-2 pb-3 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span className="truncate max-w-[130px]" title={illustration.license}>
            {illustration.collection} · Open Source
          </span>

          <a
            href={illustration.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            title={`View source: ${illustration.sourceUrl}`}
          >
            <span>SOURCE</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      {/* Action Buttons: SVG & PNG Downloads */}
      <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/60 py-2 text-[11px] font-mono font-bold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-[0.98]"
          title="Download vector SVG"
        >
          {downloadedType === "svg" ? (
            <Check size={13} className="text-emerald-500" />
          ) : (
            <FileCode size={13} className="text-primary" />
          )}
          <span>SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/60 py-2 text-[11px] font-mono font-bold text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer active:scale-[0.98]"
          title="Download high-resolution PNG (1200x900)"
        >
          {downloadedType === "png" ? (
            <Check size={13} className="text-emerald-500" />
          ) : (
            <ImageIcon size={13} className="text-primary" />
          )}
          <span>PNG</span>
        </button>
      </div>
    </article>
  );
};
