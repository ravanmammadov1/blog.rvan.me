import React, { useState } from "react";
import { Copy, Check, RefreshCw, LayoutGrid, Sliders } from "lucide-react";

export const CssGridGenerator: React.FC = () => {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnGap, setColumnGap] = useState(16);
  const [rowGap, setRowGap] = useState(16);
  const [copied, setCopied] = useState(false);

  const cssCode = `.parent-grid {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  gap: ${rowGap}px ${columnGap}px;
  width: 100%;
}`;

  const copyCode = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalCells = columns * rows;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <LayoutGrid className="text-primary" size={20} /> CSS Grid Builder
          </h3>
          <p className="text-xs text-muted-foreground/80 font-medium mt-0.5">
            Configure columns, rows, and gaps visually to generate clean CSS Grid code.
          </p>
        </div>
        <button
          onClick={copyCode}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:bg-white transition-all shadow-lg shadow-primary/20 shrink-0"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "COPIED CSS!" : "COPY CSS GRID CODE"}
        </button>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.01]">
        <div>
          <label htmlFor="grid-cols" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Columns</span> <span className="text-primary font-bold">{columns}</span>
          </label>
          <input
            id="grid-cols"
            type="range"
            min="1"
            max="12"
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="grid-rows" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Rows</span> <span className="text-primary font-bold">{rows}</span>
          </label>
          <input
            id="grid-rows"
            type="range"
            min="1"
            max="8"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="grid-col-gap" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Column Gap</span> <span className="text-primary font-bold">{columnGap}px</span>
          </label>
          <input
            id="grid-col-gap"
            type="range"
            min="0"
            max="64"
            value={columnGap}
            onChange={(e) => setColumnGap(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <label htmlFor="grid-row-gap" className="block text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase mb-1.5 flex justify-between">
            <span>Row Gap</span> <span className="text-primary font-bold">{rowGap}px</span>
          </label>
          <input
            id="grid-row-gap"
            type="range"
            min="0"
            max="64"
            value={rowGap}
            onChange={(e) => setRowGap(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Live Interactive Grid Canvas */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-muted-foreground mono uppercase">Visual Preview</span>
        <div
          className="w-full min-h-[260px] p-4 rounded-xl border border-white/10 bg-background/90 transition-all duration-300"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            columnGap: `${columnGap}px`,
            rowGap: `${rowGap}px`,
          }}
        >
          {Array.from({ length: totalCells }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center p-3 rounded-lg border border-primary/30 bg-primary/10 text-primary font-mono text-xs font-bold hover:bg-primary/20 transition-all cursor-pointer select-none"
            >
              Cell {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Generated CSS Code Block */}
      <div className="relative rounded-xl border border-white/10 bg-black/60 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
        <pre>{cssCode}</pre>
      </div>
    </div>
  );
};
export default CssGridGenerator;
