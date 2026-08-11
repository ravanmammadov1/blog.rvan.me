import React from "react";

/**
 * HeroAtmosphere
 *
 * Subtle abstract visual layer inspired by modern art-direction:
 * - 3D-styled liquid/ribbon curves in brand gradient tones (teal, cyan, blue, purple) around outer edges.
 * - Precision concentric circular & grid vector lines at low opacity.
 * - Floating atmospheric light points / sparkles with gentle pulsing.
 *
 * Designed to strictly maintain text readability, zero visual clutter, and minimal black aesthetic.
 */
export default function HeroAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── 1. SUBTLE BACKGROUND GRID OVERLAY (Low Opacity Tech Atmosphere) ── */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* ── 2. TOP-RIGHT CONCENTRIC CIRCULAR VECTOR LINES ── */}
      <svg
        className="absolute -top-12 -right-12 w-[650px] h-[650px] md:w-[800px] md:h-[800px] opacity-[0.07] text-white"
        viewBox="0 0 800 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="600" cy="200" r="160" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 6" />
        <circle cx="600" cy="200" r="300" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="600" cy="200" r="440" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2 8" />
        <circle cx="600" cy="200" r="580" stroke="currentColor" strokeWidth="0.5" />
        {/* Subtle Crosshair Ticks */}
        <line x1="600" y1="30" x2="600" y2="370" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
        <line x1="430" y1="200" x2="770" y2="200" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
      </svg>

      {/* ── 3. BOTTOM-LEFT CONCENTRIC CIRCULAR VECTOR LINES ── */}
      <svg
        className="absolute -bottom-24 -left-24 w-[500px] h-[500px] md:w-[650px] md:h-[650px] opacity-[0.05] text-white"
        viewBox="0 0 650 650"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="150" cy="500" r="140" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="150" cy="500" r="280" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 6" />
        <circle cx="150" cy="500" r="420" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* ── 4. ABSTRACT 3D LIQUID / RIBBON FORMS (TOP-RIGHT OUTER MARGIN) ── */}
      <div className="aurora-blob-1 absolute -top-20 -right-20 w-[550px] h-[550px] md:w-[750px] md:h-[750px] opacity-70">
        <svg
          viewBox="0 0 700 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter blur-[28px] md:blur-[36px]"
        >
          <defs>
            <linearGradient id="ribbonGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
              <stop offset="40%" stopColor="#3b82f6" stopOpacity="0.22" />
              <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="ribbonGlowTop" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#e8fd52" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          {/* Main Fluid Ribbon Layer 1 */}
          <path
            d="M 450 50 C 600 120, 680 280, 620 420 C 560 560, 380 620, 480 440 C 580 260, 420 180, 450 50 Z"
            fill="url(#ribbonGradTop)"
          />
          {/* Secondary Intertwined Ribbon Layer 2 */}
          <path
            d="M 520 20 C 650 80, 720 220, 650 360 C 580 500, 450 580, 520 380 C 590 180, 480 100, 520 20 Z"
            fill="url(#ribbonGlowTop)"
          />
        </svg>
      </div>

      {/* ── 5. ABSTRACT 3D LIQUID / RIBBON FORMS (BOTTOM-LEFT OUTER MARGIN) ── */}
      <div className="aurora-blob-2 absolute -bottom-24 -left-24 w-[480px] h-[480px] md:w-[620px] md:h-[620px] opacity-65">
        <svg
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full filter blur-[32px] md:blur-[42px]"
        >
          <defs>
            <linearGradient id="ribbonGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <path
            d="M 80 520 C 180 600, 340 540, 380 420 C 420 300, 260 220, 160 320 C 60 420, 20 460, 80 520 Z"
            fill="url(#ribbonGradBottom)"
          />
        </svg>
      </div>

      {/* ── 6. ATMOSPHERIC LIGHT POINTS / SPARKLES (VERY SUBTLE & FLOATING) ── */}
      {/* Sparkle 1 (Top Right) */}
      <div
        className="absolute top-[14%] right-[12%] text-cyan-400/40 animate-pulse"
        style={{ animationDuration: "4s" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Sparkle 2 (Upper Left Margin) */}
      <div
        className="absolute top-[28%] left-[6%] text-purple-400/35 animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "1.5s" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Sparkle 3 (Mid Right Edge) */}
      <div
        className="absolute top-[58%] right-[8%] text-primary/45 animate-pulse"
        style={{ animationDuration: "5s", animationDelay: "3s" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Sparkle 4 (Bottom Left) */}
      <div
        className="absolute bottom-[16%] left-[10%] text-blue-400/35 animate-pulse"
        style={{ animationDuration: "5.5s", animationDelay: "0.8s" }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>

      {/* Sparkle 5 (Top Center Right) */}
      <div
        className="absolute top-[8%] left-[62%] text-teal-300/30 animate-pulse"
        style={{ animationDuration: "7s", animationDelay: "2.2s" }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      </div>
    </div>
  );
}
