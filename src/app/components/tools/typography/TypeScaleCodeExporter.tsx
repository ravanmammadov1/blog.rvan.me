import React, { useState } from "react";
import { TypeScaleResult } from "../../../../lib/typography/typeScaleEngine";
import { Code, Copy, Check, Download, FileText } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface TypeScaleCodeExporterProps {
  result: TypeScaleResult;
}

type ExportTab = "css-variables" | "utility-classes" | "tailwind";

export default function TypeScaleCodeExporter({ result }: TypeScaleCodeExporterProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [activeTab, setActiveTab] = useState<ExportTab>("css-variables");
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case "utility-classes":
        return result.utilityClasses;
      case "tailwind":
        return result.tailwindConfig;
      case "css-variables":
      default:
        return result.cssVariables;
    }
  };

  const code = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === "tailwind" ? "tailwind.typography.config.js" : "typography-scale.css";
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
      {/* Exporter Header & Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-primary" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mono">
            {isAz ? "İXRAC VƏ KOD NƏTİCƏSİ" : "CSS CODE EXPORT"}
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1">
          <button
            onClick={() => setActiveTab("css-variables")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "css-variables"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            CSS Variables
          </button>
          <button
            onClick={() => setActiveTab("utility-classes")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "utility-classes"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Utility Classes
          </button>
          <button
            onClick={() => setActiveTab("tailwind")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all mono ${
              activeTab === "tailwind"
                ? "bg-primary text-black font-bold"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Tailwind Config
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
      <div className="relative p-5 overflow-x-auto max-h-96">
        <pre className="text-xs text-white/90 font-mono leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>

      {/* Exporter Footer Note */}
      <div className="border-t border-white/5 bg-white/[0.01] px-5 py-2.5 flex items-center justify-between text-[10px] text-muted-foreground/60 mono">
        <span>Zero JavaScript runtime dependencies · Pure CSS clamp()</span>
        <span>Standard root base: 16px (1rem)</span>
      </div>
    </div>
  );
}
