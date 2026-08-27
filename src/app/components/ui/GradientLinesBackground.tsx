import React, { memo } from "react";

/**
 * GradientLinesBackground
 * Ultra-lightweight, crisp moving gradient lines in the canonical rvan.me logo colors:
 *   - Mint / Teal: #61c5ad
 *   - Cobalt Blue: #426fba
 *   - Indigo:      #4f66b6
 *   - Violet:      #984f9f
 *
 * 100% GPU-composited, zero heavy blurs, zero lag, maintains clean solid dark background.
 */
export const GradientLinesBackground: React.FC<{ className?: string }> = memo(
  function GradientLinesBackground({ className = "" }) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-0 overflow-hidden select-none ${className}`}
      >
        {/* ── Subtly Animated Vector Gradient Lines ── */}
        <svg
          className="absolute inset-0 h-full w-full opacity-35 dark:opacity-40"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
        >
          <defs>
            {/* Canonical Rvan Logo Color Gradients */}
            <linearGradient id="rvan-line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#61c5ad" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#426fba" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#4f66b6" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#984f9f" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="rvan-line-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#984f9f" stopOpacity="0.75" />
              <stop offset="40%" stopColor="#4f66b6" stopOpacity="0.75" />
              <stop offset="70%" stopColor="#426fba" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#61c5ad" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="rvan-beam-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#61c5ad" stopOpacity="0" />
              <stop offset="40%" stopColor="#61c5ad" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#426fba" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#984f9f" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Line 1: Elegant top-to-mid sweeping curved trajectory */}
          <path
            d="M-80,180 Q380,320 850,140 T1560,260"
            fill="none"
            stroke="url(#rvan-line-grad-1)"
            strokeWidth="1.2"
            strokeDasharray="6 8"
            className="animate-line-drift-1 opacity-70"
          />

          {/* Moving Laser Beam along Line 1 */}
          <path
            d="M-80,180 Q380,320 850,140 T1560,260"
            fill="none"
            stroke="url(#rvan-beam-glow)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="140 1800"
            className="animate-beam-flow-1"
          />

          {/* Line 2: Smooth central undulating ribbon */}
          <path
            d="M-40,460 C320,320 620,580 1050,420 S1500,520 1560,480"
            fill="none"
            stroke="url(#rvan-line-grad-2)"
            strokeWidth="1.2"
            className="animate-line-pulse opacity-65"
          />

          {/* Moving Laser Beam along Line 2 */}
          <path
            d="M-40,460 C320,320 620,580 1050,420 S1500,520 1560,480"
            fill="none"
            stroke="url(#rvan-beam-glow)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="160 2200"
            className="animate-beam-flow-2"
          />

          {/* Line 3: Subtle lower contour across bottom sections */}
          <path
            d="M-60,740 Q450,640 920,800 T1520,720"
            fill="none"
            stroke="url(#rvan-line-grad-1)"
            strokeWidth="1"
            strokeDasharray="5 7"
            className="animate-line-drift-2 opacity-60"
          />

          {/* Moving Laser Beam along Line 3 */}
          <path
            d="M-60,740 Q450,640 920,800 T1520,720"
            fill="none"
            stroke="url(#rvan-beam-glow)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="120 1900"
            className="animate-beam-flow-3"
          />
        </svg>

        {/* ── Geometric Clean Hairline Horizontal Laser Beams ── */}
        <div className="absolute top-[28%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#61c5ad]/20 to-transparent pointer-events-none" />
        <div className="absolute top-[58%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#426fba]/20 to-transparent pointer-events-none" />
        <div className="absolute top-[82%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#984f9f]/20 to-transparent pointer-events-none" />

        {/* Travelling Light Pulses along Horizontal Lines */}
        <div className="absolute top-[28%] left-0 h-px w-36 bg-gradient-to-r from-transparent via-[#61c5ad] to-transparent animate-laser-slide-1 opacity-60" />
        <div className="absolute top-[58%] right-0 h-px w-44 bg-gradient-to-r from-transparent via-[#426fba] to-transparent animate-laser-slide-2 opacity-60" />
        <div className="absolute top-[82%] left-0 h-px w-40 bg-gradient-to-r from-transparent via-[#984f9f] to-transparent animate-laser-slide-3 opacity-60" />
      </div>
    );
  }
);

export default GradientLinesBackground;
