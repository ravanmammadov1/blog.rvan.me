import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Check, Copy, Code, Download } from "lucide-react";
import { IconItem } from "../../../lib/iconEngine";
import { Button } from "../ui/Button";

interface IconSpecimenCardProps {
  iconItem: IconItem;
  iconSize?: number;
  strokeWidth?: number;
}

export const IconSpecimenCard: React.FC<IconSpecimenCardProps> = ({
  iconItem,
  iconSize = 28,
  strokeWidth = 2,
}) => {
  const [copiedType, setCopiedType] = useState<"svg" | "react" | null>(null);

  // Dynamic Lucide Icon Component Resolution
  const IconComponent = (LucideIcons as any)[iconItem.componentName] || LucideIcons.Sparkles;

  const handleCopyReact = () => {
    const jsxSnippet = `<${iconItem.componentName} size={${iconSize}} strokeWidth={${strokeWidth}} />`;
    navigator.clipboard.writeText(jsxSnippet);
    setCopiedType("react");
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleCopySvg = () => {
    // Generate clean SVG string for the icon
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-${iconItem.componentName.toLowerCase()}"><!-- Icon: ${iconItem.name} --></svg>`;
    navigator.clipboard.writeText(svgCode);
    setCopiedType("svg");
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <article className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 glass transition-all duration-300 hover:border-[#61c5ad]/40 hover:bg-white/[0.08] flex flex-col justify-between overflow-hidden">
      <div>
        {/* Top Header & Category Tag */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#61c5ad] border border-[#61c5ad]/20 bg-[#61c5ad]/10 px-2.5 py-0.5 rounded-full mono">
            {iconItem.category}
          </span>
          <span className="text-[9.5px] font-mono text-muted-foreground/70 uppercase">
            Lucide SVG
          </span>
        </div>

        {/* Live Dynamic Icon Specimen Render */}
        <div className="my-4 flex items-center justify-center p-6 rounded-xl border border-white/5 bg-black/40 text-[#61c5ad] group-hover:text-white transition-colors duration-300 min-h-[96px]">
          <IconComponent size={iconSize} strokeWidth={strokeWidth} className="transition-all duration-300" />
        </div>

        {/* Icon Name & Tags */}
        <div className="mb-4">
          <h3 className="text-sm font-bold text-foreground group-hover:text-[#61c5ad] transition-colors mono truncate">
            {iconItem.name}
          </h3>
          <p className="text-[10px] text-muted-foreground/70 mono truncate mt-0.5">
            {iconItem.tags.slice(0, 3).join(" • ")}
          </p>
        </div>
      </div>

      {/* Copy Actions Footer */}
      <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
        <Button
          onClick={handleCopyReact}
          variant="outline"
          size="sm"
          className="text-[10px] px-2 py-2"
          icon={copiedType === "react" ? <Check size={12} className="text-emerald-400" /> : <Code size={12} />}
          iconPosition="left"
        >
          {copiedType === "react" ? "REACT!" : "REACT"}
        </Button>

        <Button
          onClick={handleCopySvg}
          variant="secondary"
          size="sm"
          className="text-[10px] px-2 py-2"
          icon={copiedType === "svg" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          iconPosition="left"
        >
          {copiedType === "svg" ? "SVG!" : "SVG"}
        </Button>
      </div>
    </article>
  );
};
