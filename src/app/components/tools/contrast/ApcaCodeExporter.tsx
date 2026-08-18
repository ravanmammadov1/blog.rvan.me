import React, { useState } from "react";
import { ApcaEvaluation } from "../../../../lib/accessibility/apcaEngine";
import { Code, Copy, Check, Download } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface ApcaCodeExporterProps {
  evaluation: ApcaEvaluation;
}

type TabType = "css" | "tailwind" | "json";

export default function ApcaCodeExporter({ evaluation }: ApcaCodeExporterProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [activeTab, setActiveTab] = useState<TabType>("css");
  const [copied, setCopied] = useState(false);

  const { fgHex, bgHex, lc, absLc, rating, wcag } = evaluation;

  const generateCss = () => {
    return `:root {\n  /* Accessible Color Tokens (APCA Lc ${lc > 0 ? `+${lc}` : lc} — ${rating.label}) */\n  --color-foreground: ${fgHex};\n  --color-background: ${bgHex};\n  --contrast-apca-lc: ${lc};\n  --contrast-wcag-ratio: "${wcag.formattedRatio}";\n}`;
  };

  const generateTailwind = () => {
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        foreground: '${fgHex}',\n        background: '${bgHex}',\n      },\n    },\n  },\n};`;
  };

  const generateJson = () => {
    return JSON.stringify(
      {
        foreground: fgHex,
        background: bgHex,
        apca: {
          lc,
          absLc,
          polarity: evaluation.polarity,
          rating: rating.label,
        },
        wcag: {
          ratio: wcag.formattedRatio,
          aaNormal: wcag.aaNormalText,
          aaLarge: wcag.aaLargeText,
        },
      },
      null,
      2
    );
  };

  const getCode = () => {
    switch (activeTab) {
      case "tailwind":
        return generateTailwind();
      case "json":
        return generateJson();
      case "css":
      default:
        return generateCss();
    }
  };

  const code = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === "json" ? "json" : activeTab === "tailwind" ? "js" : "css";
    const filename = `contrast-tokens.${ext}`;
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d0d0d] overflow-hidden shadow-2xl space-y-0">
      {/* Header & Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "KOD VƏ TOKEN İXRACI" : "ACCESSIBILITY TOKEN EXPORT"}
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            onClick={() => setActiveTab("css")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "css"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            CSS Variables
          </button>
          <button
            onClick={() => setActiveTab("tailwind")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "tailwind"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Tailwind
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "json"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            JSON Tokens
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-black transition-all mono"
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>{isAz ? "KOPYALANDI!" : "COPIED!"}</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>{isAz ? "KODU KOPYALA" : "COPY CODE"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-white/10 hover:text-white transition-all mono"
            title="Download file"
          >
            <Download size={13} />
            <span className="hidden sm:inline">{isAz ? "Yüklə" : "Download"}</span>
          </button>
        </div>
      </div>

      {/* Code Display Area */}
      <div className="relative p-5 overflow-x-auto max-h-80">
        <pre className="text-xs text-white/90 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>

      {/* Footer Note */}
      <div className="border-t border-white/5 bg-white/[0.01] px-5 py-2.5 flex items-center justify-between text-[10px] text-muted-foreground/60 mono">
        <span>Deterministic APCA-0.98G & WCAG 2.1 verified</span>
        <span>Standard sRGB color space</span>
      </div>
    </div>
  );
}
