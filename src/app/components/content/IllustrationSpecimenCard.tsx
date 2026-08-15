import React, { useState } from "react";
import { Check, Copy, Code, Download, Image as ImageIcon } from "lucide-react";
import { IllustrationItem } from "../../../lib/illustrationEngine";
import { Button } from "../ui/Button";

interface IllustrationSpecimenCardProps {
  illustration: IllustrationItem;
  accentColor?: string;
}

export const IllustrationSpecimenCard: React.FC<IllustrationSpecimenCardProps> = ({
  illustration,
  accentColor = "#61c5ad",
}) => {
  const [copiedType, setCopiedType] = useState<"svg" | "react" | "download-svg" | "download-png" | null>(null);

  const rawSvgContent = illustration.svgTemplate(accentColor);

  const handleCopyReact = () => {
    const componentName = illustration.title.replace(/[^a-zA-Z0-9]/g, "");
    const jsxSnippet = `// unDraw Vector Illustration: ${illustration.title}\nconst ${componentName} = ({ color = "${accentColor}" }) => (\n  ${rawSvgContent}\n);`;
    navigator.clipboard.writeText(jsxSnippet);
    setCopiedType("react");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopySvg = () => {
    navigator.clipboard.writeText(rawSvgContent);
    setCopiedType("svg");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([rawSvgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${illustration.id}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setCopiedType("download-svg");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    const canvasWidth = 1024;
    const canvasHeight = 768;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([rawSvgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${illustration.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setCopiedType("download-png");
      setTimeout(() => setCopiedType(null), 2500);
    };
    img.src = url;
  };

  return (
    <article className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden">
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

      {/* Action Toolbar */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          onClick={handleCopyReact}
          variant="outline"
          size="sm"
          className="text-[10.5px] px-2 py-2"
          icon={copiedType === "react" ? <Check size={12} className="text-emerald-400" /> : <Code size={12} />}
          iconPosition="left"
        >
          {copiedType === "react" ? "REACT!" : "REACT"}
        </Button>

        <Button
          onClick={handleCopySvg}
          variant="secondary"
          size="sm"
          className="text-[10.5px] px-2 py-2"
          icon={copiedType === "svg" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          iconPosition="left"
        >
          {copiedType === "svg" ? "SVG!" : "SVG"}
        </Button>

        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-muted-foreground hover:text-white hover:border-[#61c5ad]/40 transition-all cursor-pointer"
          title="Download SVG vector file"
        >
          {copiedType === "download-svg" ? <Check size={12} className="text-emerald-400" /> : <Download size={12} />}
          <span>.SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono font-bold text-muted-foreground hover:text-white hover:border-[#61c5ad]/40 transition-all cursor-pointer"
          title="Download high-res PNG file"
        >
          {copiedType === "download-png" ? <Check size={12} className="text-emerald-400" /> : <ImageIcon size={12} />}
          <span>.PNG</span>
        </button>
      </div>
    </article>
  );
};
