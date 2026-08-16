import React, { useState } from "react";
import { Check, Copy, Image as ImageIcon, FileCode, Download } from "lucide-react";
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
      // Apply accent color tint if dynamic
      const customizedSvg = svgText.replaceAll("#6c63ff", accentColor);
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

      // If user chose a custom accent color, tint unDraw default purple (#6c63ff) to accent color
      if (accentColor && accentColor !== "#6c63ff") {
        svgText = svgText.replaceAll("#6c63ff", accentColor);
      }

      // Ensure proper dark background rect is inside SVG for standalone view
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
        svgText = svgText.replaceAll("#6c63ff", accentColor);
      }

      const canvas = document.createElement("canvas");
      const width = 1200;
      const height = 900;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Solid background
      ctx.fillStyle = "#0c0c10";
      ctx.fillRect(0, 0, width, height);

      const svgDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgText);
      const img = new Image();

      img.onload = () => {
        // Draw centered with margin
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
      console.error("Failed to export PNG:", err);
    }
  };

  return (
    <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 glass transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden shadow-lg">
      <div>
        {/* Top Header: Category & Collection Badges + Copy SVG */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/10 px-2.5 py-0.5 rounded-full mono">
              {illustration.category}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              {illustration.collection}
            </span>
          </div>

          <button
            onClick={handleCopySvg}
            className="text-[10px] font-mono text-muted-foreground hover:text-white flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            title="Copy SVG source code to clipboard"
          >
            {downloadedType === "copied" ? (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>COPY SVG</span>
              </>
            )}
          </button>
        </div>

        {/* Live Vector SVG Render Preview with Dark Card Frame */}
        <div className="my-3 flex items-center justify-center p-4 rounded-2xl border border-white/5 bg-[#0c0c10] aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden shadow-inner relative">
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
            <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c10]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          )}
        </div>

        {/* Title & Tags */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mono truncate">
            {illustration.title}
          </h3>
          <p className="text-[11px] text-muted-foreground/70 mono mt-1 truncate">
            {illustration.tags.slice(0, 4).join(" • ")}
          </p>
        </div>
      </div>

      {/* Action Buttons: SVG & PNG Downloads */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-mono font-bold text-white hover:border-primary hover:bg-primary/10 transition-all cursor-pointer"
          title="Download standalone SVG vector"
        >
          {downloadedType === "svg" ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <FileCode size={13} className="text-primary" />
          )}
          <span>DOWNLOAD SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-mono font-bold text-white hover:border-primary hover:bg-primary/10 transition-all cursor-pointer"
          title="Download high-resolution 1200px PNG"
        >
          {downloadedType === "png" ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <ImageIcon size={13} className="text-cyan-400" />
          )}
          <span>DOWNLOAD PNG</span>
        </button>
      </div>
    </article>
  );
};
