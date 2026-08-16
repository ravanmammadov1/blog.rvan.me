import React, { useState } from "react";
import { Check, Download, Copy, Image as ImageIcon, FileCode } from "lucide-react";
import { IllustrationItem } from "../../../lib/illustrationEngine";
import { downloadEpsFile } from "../../../lib/epsExporter";

interface IllustrationSpecimenCardProps {
  illustration: IllustrationItem;
  accentColor?: string;
}

export const IllustrationSpecimenCard: React.FC<IllustrationSpecimenCardProps> = ({
  illustration,
  accentColor = "#61c5ad",
}) => {
  const [downloadedType, setDownloadedType] = useState<"eps" | "png" | "svg" | "copied" | null>(null);

  // Raw SVG with background included
  const rawSvgContent = illustration.svgTemplate(accentColor);

  const handleCopySvg = () => {
    navigator.clipboard.writeText(rawSvgContent);
    setDownloadedType("copied");
    setTimeout(() => setDownloadedType(null), 2000);
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

    setDownloadedType("svg");
    setTimeout(() => setDownloadedType(null), 2000);
  };

  const handleDownloadEps = () => {
    downloadEpsFile(rawSvgContent, illustration.id);
    setDownloadedType("eps");
    setTimeout(() => setDownloadedType(null), 2000);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    const width = 1200;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Draw rich solid dark background first
    ctx.fillStyle = "#0c0c10";
    ctx.fillRect(0, 0, width, height);

    // Prepare clean standalone SVG data URL
    let exportSvg = rawSvgContent;
    if (!exportSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
      exportSvg = exportSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const svgDataUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(exportSvg);
    const img = new Image();

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = `${illustration.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadedType("png");
      setTimeout(() => setDownloadedType(null), 2000);
    };

    img.onerror = () => {
      // Fallback in case data URI needs blob URL
      const svgBlob = new Blob([exportSvg], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(svgBlob);
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        ctx.drawImage(fallbackImg, 0, 0, width, height);
        URL.revokeObjectURL(blobUrl);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = `${illustration.id}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadedType("png");
        setTimeout(() => setDownloadedType(null), 2000);
      };
      fallbackImg.src = blobUrl;
    };

    img.src = svgDataUri;
  };

  return (
    <article
      className="group relative rounded-3xl border border-white/10 bg-white/5 p-5 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden shadow-lg"
    >
      <div>
        {/* Top Header & Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#61c5ad] border border-[#61c5ad]/20 bg-[#61c5ad]/10 px-2.5 py-0.5 rounded-full mono">
            {illustration.category}
          </span>
          <button
            onClick={handleCopySvg}
            className="text-[10px] font-mono text-muted-foreground hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            title="Copy raw SVG to clipboard"
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

        {/* Live Vector SVG Render Preview with Background Frame */}
        <div
          className="my-3 flex items-center justify-center rounded-2xl border border-white/5 bg-[#0c0c10] aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.02] overflow-hidden shadow-inner"
          dangerouslySetInnerHTML={{ __html: rawSvgContent }}
        />

        {/* Title & Tags */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mono truncate">
            {illustration.title}
          </h3>
          <p className="text-[11px] text-muted-foreground/70 mono mt-1 truncate">
            {illustration.tags.slice(0, 4).join(" • ")}
          </p>
        </div>
      </div>

      {/* Action Buttons: SVG | PNG | EPS */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
        <button
          onClick={handleDownloadSvg}
          className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download vector SVG"
        >
          {downloadedType === "svg" ? <Check size={12} className="text-emerald-400" /> : <FileCode size={12} className="text-[#61c5ad]" />}
          <span>SVG</span>
        </button>

        <button
          onClick={handleDownloadPng}
          className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download 1200px PNG"
        >
          {downloadedType === "png" ? <Check size={12} className="text-emerald-400" /> : <ImageIcon size={12} className="text-primary" />}
          <span>PNG</span>
        </button>

        <button
          onClick={handleDownloadEps}
          className="flex items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/5 py-2 text-[11px] font-mono font-bold text-white hover:border-[#61c5ad] hover:bg-[#61c5ad]/10 transition-all cursor-pointer"
          title="Download EPS file"
        >
          {downloadedType === "eps" ? <Check size={12} className="text-emerald-400" /> : <Download size={12} className="text-zinc-400" />}
          <span>EPS</span>
        </button>
      </div>
    </article>
  );
};
