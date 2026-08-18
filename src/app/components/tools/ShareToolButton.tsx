import React, { useState } from "react";
import { Link as LinkIcon, Check } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface ShareToolButtonProps {
  className?: string;
  size?: "sm" | "md";
}

export function ShareToolButton({ className = "", size = "sm" }: ShareToolButtonProps) {
  const [copied, setCopied] = useState(false);
  const { language } = useLanguage();
  const isAz = language === "az";

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Clipboard copy failed, using fallback:", err);
      // Fallback
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      onClick={handleShare}
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-white/[0.08] transition-all duration-200 mono font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        isSmall ? "px-2.5 py-1 text-[11px]" : "px-3.5 py-1.5 text-xs"
      } ${copied ? "text-primary border-primary/60 bg-primary/10" : ""} ${className}`}
      title={isAz ? "Konfiqurasiya linkini kopyala" : "Copy shareable configuration link"}
      aria-label={isAz ? "Link kopyala" : "Copy shareable link"}
    >
      {copied ? (
        <>
          <Check size={isSmall ? 12 : 14} className="text-primary animate-in fade-in zoom-in duration-200" />
          <span className="text-primary">{isAz ? "Link kopyalandı!" : "Link copied!"}</span>
        </>
      ) : (
        <>
          <LinkIcon size={isSmall ? 12 : 14} />
          <span>{isAz ? "Paylaş" : "Share"}</span>
        </>
      )}
    </button>
  );
}
