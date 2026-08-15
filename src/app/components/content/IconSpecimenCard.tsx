import React, { useState, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { Check, Download, Image as ImageIcon } from "lucide-react";
import { IconItem } from "../../../lib/iconEngine";

interface IconSpecimenCardProps {
  iconItem: IconItem;
  iconSize?: number;
  strokeWidth?: number;
  iconColor?: string;
}

export const IconSpecimenCard: React.FC<IconSpecimenCardProps> = ({
  iconItem,
  iconSize = 28,
  strokeWidth = 2,
  iconColor = "#61c5ad",
}) => {
  const [downloadedType, setDownloadedType] = useState<"svg" | "png" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic Lucide Icon Component Resolution
  const IconComponent = (LucideIcons as any)[iconItem.componentName] || LucideIcons.Sparkles;

  const handleDownloadSvg = () => {
    const svgElement = cardRef.current?.querySelector("svg");
    if (!svgElement) return;

    // Clone SVG and set explicit XML attributes for valid standalone SVG file export
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("width", "512");
    clonedSvg.setAttribute("height", "512");

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${iconItem.componentName.toLowerCase()}-icon.svg`;
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
    clonedSvg.setAttribute("width", "1024");
    clonedSvg.setAttribute("height", "1024");

    const svgString = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, 1024, 1024);
      ctx.drawImage(img, 0, 0, 1024, 1024);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${iconItem.componentName.toLowerCase()}-icon.png`;
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
      className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden"
    >
      <div>
        {/* Top Header & Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#61c5ad] border border-[#61c5ad]/20 bg-[#61c5ad]/10 px-2.5 py-0.5 rounded-full mono truncate max-w-[140px]">
            {iconItem.category}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground/60 uppercase">
            Vector
          </span>
        </div>

        {/* Live Dynamic Icon Specimen Render with Custom Color */}
        <div className="my-3 flex items-center justify-center p-5 rounded-xl border border-white/5 bg-black/40 transition-colors duration-300 min-h-[88px]">
          <IconComponent
            size={iconSize}
            strokeWidth={strokeWidth}
            color={iconColor}
            className="transition-all duration-300"
          />
        </div>

        {/* Icon Name */}
        <div className="mb-3">
          <h3 className="text-xs font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mono truncate">
            {iconItem.name}
          </h3>
          <p className="text-[9.5px] text-muted-foreground/70 mono truncate mt-0.5">
            {iconItem.componentName}
          </p>
        </div>
      </div>

      {/* Simplified Download Actions Footer */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download SVG vector file"
        >
          {downloadedType === "svg" ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <Download size={13} className="text-[#61c5ad]" />
          )}
          <span>.SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download high-res PNG image"
        >
          {downloadedType === "png" ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <ImageIcon size={13} className="text-primary" />
          )}
          <span>.PNG</span>
        </button>
      </div>
    </article>
  );
};
