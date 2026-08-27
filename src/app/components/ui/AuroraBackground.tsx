import React, { memo } from "react";
import { useTheme } from "../../../context/ThemeContext";

interface AuroraBackgroundProps {
  className?: string;
}

/**
 * AuroraBackground
 * High-performance, living ambient Aurora lights background
 * featuring the canonical rvan.me brand logo color palette:
 *   - Mint / Cyan-Green: #61c5ad (rgba(97, 197, 173))
 *   - Cobalt Azure Blue:  #426fba (rgba(66, 111, 186))
 *   - Indigo / Periwinkle: #4f66b6 (rgba(79, 102, 182))
 *   - Orchid / Violet:    #984f9f (rgba(152, 79, 159))
 */
export const AuroraBackground: React.FC<AuroraBackgroundProps> = memo(function AuroraBackground({
  className = "",
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-30 overflow-hidden select-none transform-gpu ${className}`}
    >
      {/* 1. Base Canvas Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-700" />

      {/* 2. Primary Luminous Aurora Orbs */}
      <div className="absolute inset-0 filter blur-[60px] sm:blur-[85px] lg:blur-[110px] transform-gpu">
        {/* ── ORB 1: MINT / EMERALD (#61c5ad) — Upper-right drifting orb ── */}
        <div
          className="aurora-orb-mint absolute rounded-full"
          style={{
            top: "-10%",
            right: "-5%",
            width: "min(75vw, 950px)",
            height: "min(75vw, 950px)",
            background: isDark
              ? "radial-gradient(ellipse at 45% 45%, rgba(97, 197, 173, 0.55) 0%, rgba(97, 197, 173, 0.25) 40%, rgba(97, 197, 173, 0.08) 65%, transparent 80%)"
              : "radial-gradient(ellipse at 45% 45%, rgba(97, 197, 173, 0.42) 0%, rgba(97, 197, 173, 0.20) 40%, rgba(97, 197, 173, 0.05) 65%, transparent 80%)",
            mixBlendMode: isDark ? "screen" : "multiply",
          }}
        />

        {/* ── ORB 2: COBALT / AZURE BLUE (#426fba) — Mid-left roaming orb ── */}
        <div
          className="aurora-orb-blue absolute rounded-full"
          style={{
            top: "20%",
            left: "-12%",
            width: "min(70vw, 900px)",
            height: "min(70vw, 900px)",
            background: isDark
              ? "radial-gradient(ellipse at 50% 50%, rgba(66, 111, 186, 0.52) 0%, rgba(96, 153, 223, 0.26) 40%, rgba(66, 111, 186, 0.08) 65%, transparent 80%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(66, 111, 186, 0.38) 0%, rgba(96, 153, 223, 0.18) 40%, rgba(66, 111, 186, 0.05) 65%, transparent 80%)",
            mixBlendMode: isDark ? "screen" : "multiply",
          }}
        />

        {/* ── ORB 3: INDIGO / PERIWINKLE (#4f66b6) — Center roaming connector ── */}
        <div
          className="aurora-orb-indigo absolute rounded-full"
          style={{
            top: "45%",
            right: "-8%",
            width: "min(65vw, 850px)",
            height: "min(65vw, 850px)",
            background: isDark
              ? "radial-gradient(ellipse at 50% 50%, rgba(79, 102, 182, 0.48) 0%, rgba(129, 140, 248, 0.22) 45%, rgba(79, 102, 182, 0.06) 70%, transparent 85%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(79, 102, 182, 0.32) 0%, rgba(129, 140, 248, 0.15) 45%, rgba(79, 102, 182, 0.04) 70%, transparent 85%)",
            mixBlendMode: isDark ? "screen" : "multiply",
          }}
        />

        {/* ── ORB 4: ORCHID / VIOLET (#984f9f) — Lower-left & bottom sweep ── */}
        <div
          className="aurora-orb-violet absolute rounded-full"
          style={{
            bottom: "5%",
            left: "-5%",
            width: "min(65vw, 850px)",
            height: "min(65vw, 850px)",
            background: isDark
              ? "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.50) 0%, rgba(188, 102, 197, 0.24) 40%, rgba(152, 79, 159, 0.07) 65%, transparent 80%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.35) 0%, rgba(188, 102, 197, 0.16) 40%, rgba(152, 79, 159, 0.04) 65%, transparent 80%)",
            mixBlendMode: isDark ? "screen" : "multiply",
          }}
        />

        {/* ── ORB 5: MULTI-HUED BRAND AURORA BEAM (#61c5ad + #426fba + #984f9f) — Lower-right ── */}
        <div
          className="aurora-orb-mint absolute rounded-full"
          style={{
            bottom: "-15%",
            right: "5%",
            width: "min(70vw, 900px)",
            height: "min(70vw, 900px)",
            background: isDark
              ? "radial-gradient(ellipse at 40% 60%, rgba(97, 197, 173, 0.45) 0%, rgba(152, 79, 159, 0.30) 40%, rgba(66, 111, 186, 0.10) 65%, transparent 80%)"
              : "radial-gradient(ellipse at 40% 60%, rgba(97, 197, 173, 0.32) 0%, rgba(152, 79, 159, 0.20) 40%, rgba(66, 111, 186, 0.05) 65%, transparent 80%)",
            mixBlendMode: isDark ? "screen" : "multiply",
            animationDelay: "-14s",
          }}
        />
      </div>

      {/* 3. Atmospheric Vignette Edge Softener */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, transparent 40%, rgba(10, 10, 12, 0.4) 80%, rgba(10, 10, 12, 0.75) 100%)"
            : "radial-gradient(ellipse at center, transparent 50%, rgba(246, 248, 247, 0.3) 80%, rgba(246, 248, 247, 0.6) 100%)",
        }}
      />
    </div>
  );
});

export default AuroraBackground;
