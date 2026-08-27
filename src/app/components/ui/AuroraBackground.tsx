import React, { memo } from "react";

interface AuroraBackgroundProps {
  className?: string;
  intensity?: "subtle" | "normal" | "vibrant";
}

/**
 * AuroraBackground
 * High-performance, GPU-accelerated ambient aurora glow
 * using the canonical rvan.me brand logo palette:
 * - Mint / Emerald (#61c5ad)
 * - Cobalt Azure (#426fba)
 * - Indigo (#4f66b6)
 * - Purple / Violet (#984f9f)
 *
 * Engineered with gentle, slow-moving composited CSS keyframes
 * that never strain the eyes or distract from typography.
 */
export const AuroraBackground: React.FC<AuroraBackgroundProps> = memo(function AuroraBackground({
  className = "",
  intensity = "subtle",
}) {
  const opacityClass =
    intensity === "vibrant"
      ? "opacity-30 dark:opacity-40"
      : intensity === "normal"
      ? "opacity-20 dark:opacity-30"
      : "opacity-15 dark:opacity-25";

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-opacity duration-1000 ${opacityClass} ${className}`}
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      {/* Container with heavy blur to create smooth atmospheric diffusion */}
      <div className="absolute inset-0 filter blur-[90px] sm:blur-[130px] lg:blur-[160px] transform-gpu">
        {/* Orb 1: Mint / Emerald (#61c5ad) - Upper left roaming orb */}
        <div
          className="aurora-orb-1 absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-[#61c5ad] to-[#426fba] opacity-60 dark:opacity-70"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Orb 2: Cobalt Azure (#426fba) - Mid right roaming orb */}
        <div
          className="aurora-orb-2 absolute top-[25%] -right-[15%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-tr from-[#426fba] via-[#4f66b6] to-[#61c5ad] opacity-55 dark:opacity-65"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Orb 3: Purple / Violet (#984f9f) - Lower center / left roaming orb */}
        <div
          className="aurora-orb-3 absolute top-[55%] -left-[15%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-br from-[#984f9f] via-[#4f66b6] to-[#426fba] opacity-50 dark:opacity-60"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Orb 4: Multi-hued Brand Wave (#61c5ad + #426fba + #984f9f) - Bottom right roaming orb */}
        <div
          className="aurora-orb-4 absolute -bottom-[10%] right-[10%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tl from-[#61c5ad] via-[#426fba] to-[#984f9f] opacity-50 dark:opacity-60"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Subtle center ambient filler to keep mid-viewport gently illuminated */}
        <div
          className="aurora-orb-1 absolute top-[40%] left-[30%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-[#4f66b6]/30 dark:bg-[#4f66b6]/25 opacity-40"
          style={{ mixBlendMode: "screen" }}
        />
      </div>

      {/* Gentle vignette mask overlay to softly fade the edges */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-background/40 to-background/90 dark:via-background/30 dark:to-background/80 pointer-events-none" />
    </div>
  );
});

export default AuroraBackground;
