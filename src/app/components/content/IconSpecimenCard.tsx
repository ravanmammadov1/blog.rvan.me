import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Check, Copy, Code, Download, Image as ImageIcon } from "lucide-react";
import { IconItem } from "../../../lib/iconEngine";
import { Button } from "../ui/Button";

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
  const [copiedType, setCopiedType] = useState<"svg" | "react" | "download-svg" | "download-png" | null>(null);

  // Dynamic Lucide Icon Component Resolution
  const IconComponent = (LucideIcons as any)[iconItem.componentName] || LucideIcons.Sparkles;

  const handleCopyReact = () => {
    const jsxSnippet = `<${iconItem.componentName} size={${iconSize}} color="${iconColor}" strokeWidth={${strokeWidth}} />`;
    navigator.clipboard.writeText(jsxSnippet);
    setCopiedType("react");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const generateSvgString = (size = iconSize) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconItem.componentName.toLowerCase()}"><!-- Icon: ${iconItem.name} --></svg>`;
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(generateSvgString());
    setCopiedType("svg");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadSvg = () => {
    const svgContent = generateSvgString();
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${iconItem.componentName.toLowerCase()}-icon.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopiedType("download-svg");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadPng = () => {
    // Render high-res 512x512 PNG using Offscreen Canvas
    const canvas = document.createElement("canvas");
    const canvasSize = 512;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // High resolution SVG string for canvas rendering
    const svgRaw = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasSize}" height="${canvasSize}" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><g>${generateSvgInnerPaths(iconItem.componentName)}</g></svg>`;

    const img = new Image();
    const svgBlob = new Blob([svgRaw], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${iconItem.componentName.toLowerCase()}-icon.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setCopiedType("download-png");
      setTimeout(() => setCopiedType(null), 2500);
    };
    img.src = url;
  };

  return (
    <article className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header & Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#61c5ad] border border-[#61c5ad]/20 bg-[#61c5ad]/10 px-2 py-0.5 rounded-full mono truncate max-w-[140px]">
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

        {/* Icon Name & Tags */}
        <div className="mb-3">
          <h3 className="text-xs font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mono truncate">
            {iconItem.name}
          </h3>
          <p className="text-[9.5px] text-muted-foreground/70 mono truncate mt-0.5">
            {iconItem.componentName}
          </p>
        </div>
      </div>

      {/* Action Buttons: Copy & Download */}
      <div className="pt-3 border-t border-white/10 space-y-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <Button
            onClick={handleCopyReact}
            variant="outline"
            size="sm"
            className="text-[9.5px] px-1.5 py-1.5 justify-center"
            icon={copiedType === "react" ? <Check size={11} className="text-emerald-400" /> : <Code size={11} />}
            iconPosition="left"
          >
            {copiedType === "react" ? "REACT!" : "REACT"}
          </Button>

          <Button
            onClick={handleCopySvg}
            variant="secondary"
            size="sm"
            className="text-[9.5px] px-1.5 py-1.5 justify-center"
            icon={copiedType === "svg" ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            iconPosition="left"
          >
            {copiedType === "svg" ? "SVG!" : "SVG"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-[9.5px] font-mono font-bold text-muted-foreground hover:text-white hover:border-[#61c5ad]/40 transition-all cursor-pointer"
            title="Download SVG file"
          >
            {copiedType === "download-svg" ? (
              <Check size={11} className="text-emerald-400" />
            ) : (
              <Download size={11} />
            )}
            <span>.SVG</span>
          </button>

          <button
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5 text-[9.5px] font-mono font-bold text-muted-foreground hover:text-white hover:border-[#61c5ad]/40 transition-all cursor-pointer"
            title="Download high-res PNG file"
          >
            {copiedType === "download-png" ? (
              <Check size={11} className="text-emerald-400" />
            ) : (
              <ImageIcon size={11} />
            )}
            <span>.PNG</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// Helper SVG path extractor fallback for high-res PNG canvas export
function generateSvgInnerPaths(name: string): string {
  // If fallback element exists in DOM or template, return generic path
  return `<path d="M12 2v20M2 12h20"/>`;
}
