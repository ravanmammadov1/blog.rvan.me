import React, { useState, useRef } from "react";
import { Check, Download, Image as ImageIcon } from "lucide-react";
import { IllustrationItem } from "../../../lib/illustrationEngine";

interface IllustrationSpecimenCardProps {
  illustration: IllustrationItem;
  accentColor?: string;
}

export const IllustrationSpecimenCard: React.FC<IllustrationSpecimenCardProps> = ({
  illustration,
  accentColor = "#61c5ad",
}) => {
  const [downloadedType, setDownloadedType] = useState<"svg" | "png" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawSvgContent = illustration.svgTemplate(accentColor);

  const handleDownloadSvg = () => {
    const svgElement = cardRef.current?.querySelector("svg");
    if (!svgElement) return;

    // Clone SVG and set explicit XML namespaces for valid standalone vector file
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("width", "800");
    clonedSvg.setAttribute("height", "600");

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${illustration.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadedType("svg");
    setTimeout(() => setDownloadedType(null), 2500);
  };

  const handleDownloadPng = () => {
    const svgElement = cardRef.current?.querySelector("svg");
    if (!svgElement) return;

    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("width", "1200");
    clonedSvg.setAttribute("height", "900");

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${illustration.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadedType("png");
      setTimeout(() => setDownloadedType(null), 2500);
    };
    img.src = url;
  };

  return (
    <article
      ref={cardRef}
      className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Top Header & Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#61c5ad] border border-[#61c5ad]/20 bg-[#61c5ad]/10 px-3 py-1 rounded-full mono">
            {illustration.category}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">
            unDraw Vector
          </span>
        </div>

        {/* Live Vector SVG Render Preview */}
        <div
          className="my-4 flex items-center justify-center p-6 rounded-2xl border border-white/5 bg-black/40 min-h-[220px] transition-transform duration-300 group-hover:scale-[1.02]"
          dangerouslySetInnerHTML={{ __html: rawSvgContent }}
        />

        {/* Title & Tags */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mono">
            {illustration.title}
          </h3>
          <p className="text-xs text-muted-foreground/70 mono mt-1">
            {illustration.tags.slice(0, 4).join(" • ")}
          </p>
        </div>
      </div>

      {/* Simplified Download Actions Footer */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download SVG vector file"
        >
          {downloadedType === "svg" ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <Download size={14} className="text-[#61c5ad]" />
          )}
          <span>DOWNLOAD .SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download high-res PNG image"
        >
          {downloadedType === "png" ? (
            <Check size={14} className="text-emerald-400" />
          ) : (
            <ImageIcon size={14} className="text-primary" />
          )}
          <span>DOWNLOAD .PNG</span>
        </button>
      </div>
    </article>
  );
};
