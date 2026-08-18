import React from "react";
import {
  generateTypographyMatrix,
  MATRIX_FONT_SIZES,
  MATRIX_FONT_WEIGHTS,
  ApcaEvaluation,
} from "../../../../lib/accessibility/apcaEngine";
import { Grid, Check, X, AlertTriangle, Sparkles } from "lucide-react";
import { useLanguage } from "../../../../lib/i18n/LanguageContext";

interface ApcaTypographyMatrixProps {
  evaluation: ApcaEvaluation;
}

export default function ApcaTypographyMatrix({ evaluation }: ApcaTypographyMatrixProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const matrix = generateTypographyMatrix(evaluation.absLc);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl space-y-6">
      {/* Matrix Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Grid size={18} className="text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mono">
              {isAz ? "TİPOQRAFİK KONTRAST MATRİSİ" : "TYPOGRAPHIC CONTRAST MATRIX"}
            </h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {isAz
              ? `Şrift ölçüsü və çəkisinə görə APCA uyğunluq xəritəsi (Cari Lc: ${evaluation.lc})`
              : `Font size vs. weight compliance map based on APCA spatial frequency standards (Active Lc: ${evaluation.lc})`}
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Optimal (Lc ≥ Req+15)
          </span>
          <span className="flex items-center gap-1 text-sky-400">
            <span className="h-2 w-2 rounded-full bg-sky-400" /> Pass (Lc ≥ Req)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Large Only
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-400" /> Fail (Lc &lt; Req)
          </span>
        </div>
      </div>

      {/* 2D Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs mono">
          <thead>
            <tr className="border-b border-white/10 text-muted-foreground">
              <th className="py-3 px-3 font-semibold text-foreground">
                {isAz ? "Ölçü / Çəki" : "Size / Weight"}
              </th>
              {MATRIX_FONT_WEIGHTS.map((fw) => (
                <th key={fw.weight} className="py-3 px-3 font-semibold text-center">
                  {fw.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {matrix.map((row, rowIndex) => {
              const fontSize = MATRIX_FONT_SIZES[rowIndex];

              return (
                <tr key={fontSize} className="hover:bg-white/[0.01] transition-colors">
                  {/* Row Header: Font Size */}
                  <td className="py-3.5 px-3 font-bold text-foreground whitespace-nowrap">
                    <span className="text-primary">{fontSize}px</span>
                    <span className="ml-1 text-[10px] text-muted-foreground font-normal">
                      ({(fontSize / 16).toFixed(2)}rem)
                    </span>
                  </td>

                  {/* Matrix Cells for each Weight */}
                  {row.map((cell) => {
                    const isOptimal = cell.status === "optimal";
                    const isPass = cell.status === "pass";
                    const isLargeOnly = cell.status === "large_only";
                    const isFail = cell.status === "fail";

                    let bgClass = "bg-rose-500/10 border-rose-500/30 text-rose-300";
                    if (isOptimal) bgClass = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                    else if (isPass) bgClass = "bg-sky-500/10 border-sky-500/30 text-sky-300";
                    else if (isLargeOnly) bgClass = "bg-amber-500/10 border-amber-500/30 text-amber-300";

                    return (
                      <td key={cell.fontWeight} className="p-2 text-center">
                        <div
                          className={`rounded-xl border p-2.5 flex flex-col items-center justify-between gap-1 transition-all ${bgClass}`}
                          title={`Font ${cell.fontSize}px w${cell.fontWeight}: Requires Lc ${cell.minRequiredLc}, Actual Lc ${cell.actualLc}`}
                        >
                          {/* Live Rendered Sample Text in User Colors */}
                          <div
                            className="w-full text-center truncate py-1 rounded px-1"
                            style={{
                              backgroundColor: evaluation.bgHex,
                              color: evaluation.fgHex,
                              fontSize: `${Math.min(22, cell.fontSize)}px`,
                              fontWeight: cell.fontWeight,
                            }}
                          >
                            Aa {cell.fontSize}px
                          </div>

                          {/* Compliance Status Pill */}
                          <div className="flex items-center gap-1 text-[10px] font-bold mt-1">
                            {isOptimal && (
                              <span className="text-emerald-400 flex items-center gap-0.5">
                                <Check size={11} /> OPTIMAL
                              </span>
                            )}
                            {isPass && (
                              <span className="text-sky-400 flex items-center gap-0.5">
                                <Check size={11} /> PASS
                              </span>
                            )}
                            {isLargeOnly && (
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <AlertTriangle size={11} /> LARGE
                              </span>
                            )}
                            {isFail && (
                              <span className="text-rose-400 flex items-center gap-0.5">
                                <X size={11} /> FAIL
                              </span>
                            )}
                          </div>

                          {/* Req Score Subtext */}
                          <span className="text-[9px] text-muted-foreground/80">
                            Req: Lc {cell.minRequiredLc}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
