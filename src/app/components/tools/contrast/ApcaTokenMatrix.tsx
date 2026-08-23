import React, { useState } from "react";
import {
  DEFAULT_DESIGN_TOKENS,
  SemanticToken,
  evaluateContrast,
  isValidHex,
  normalizeHex,
} from "../../../../lib/accessibility/apcaEngine";
import { Layers, Check, X, Sliders } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

export default function ApcaTokenMatrix() {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [tokens, setTokens] = useState<SemanticToken[]>(DEFAULT_DESIGN_TOKENS);

  const handleColorChange = (id: string, newHex: string) => {
    setTokens((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hex: newHex } : t))
    );
  };

  const bgTokens = tokens.filter((t) => t.role === "background" || t.role === "surface");
  const fgTokens = tokens.filter((t) => t.role === "text" || t.role === "accent" || t.role === "danger");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
              {isAz ? "DİZAYN SİSTEMİ SEMANTİK TOKEN MATRİSİ" : "DESIGN SYSTEM TOKEN MATRIX"}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAz
              ? "Semantik dizayn tokenləri arasında cüt-cüt kontrast və əlçatanlıq auditi"
              : "Pairwise contrast evaluation across core semantic design system tokens"}
          </p>
        </div>
      </div>

      {/* Editable Token Swatches Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="truncate text-[11px] font-bold text-foreground">
                {isAz ? token.name_az : token.name}
              </span>
              <input
                type="color"
                value={isValidHex(token.hex) ? normalizeHex(token.hex) : "#000000"}
                onChange={(e) => handleColorChange(token.id, e.target.value)}
                className="h-5 w-5 rounded cursor-pointer border-0 bg-transparent"
                aria-label={`Pick color for ${token.name}`}
              />
            </div>
            <div className="text-[10px] text-primary font-bold mono">
              {token.hex}
            </div>
          </div>
        ))}
      </div>

      {/* Pairwise Evaluation Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs mono">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground">
              <th className="py-3 px-3 font-semibold text-foreground">
                {isAz ? "Fon Səthi" : "Background Surface"}
              </th>
              {fgTokens.map((fg) => (
                <th key={fg.id} className="py-3 px-3 font-semibold text-center">
                  {isAz ? fg.name_az : fg.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {bgTokens.map((bg) => (
              <tr key={bg.id} className="hover:bg-white/[0.01]">
                <td className="py-3.5 px-3 font-bold text-foreground whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-4 w-4 rounded-md border border-white/20 shrink-0"
                      style={{ backgroundColor: bg.hex }}
                    />
                    <span>{isAz ? bg.name_az : bg.name}</span>
                  </div>
                </td>

                {fgTokens.map((fg) => {
                  const ev = evaluateContrast(fg.hex, bg.hex);
                  const isPass = ev.absLc >= 60;
                  const isPreferred = ev.absLc >= 75;

                  let badgeColor = "bg-rose-500/10 border-rose-500/30 text-rose-400";
                  if (isPreferred) badgeColor = "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
                  else if (isPass) badgeColor = "bg-sky-500/10 border-sky-500/30 text-sky-400";

                  return (
                    <td key={fg.id} className="p-2 text-center">
                      <div
                        className={`rounded-xl border p-2.5 flex flex-col items-center justify-between gap-1 ${badgeColor}`}
                      >
                        {/* Sample Tag */}
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-bold"
                          style={{ backgroundColor: bg.hex, color: fg.hex }}
                        >
                          Sample
                        </span>

                        <span className="text-[10px] font-bold mt-1">
                          Lc {ev.lc > 0 ? `+${ev.lc}` : ev.lc}
                        </span>

                        <span className="text-[9px] text-muted-foreground/80">
                          {ev.wcag.formattedRatio}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
