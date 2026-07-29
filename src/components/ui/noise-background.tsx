import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NoiseBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseOpacity?: number;
}

/**
 * Global background texture & aurora light fields (Linear, Stripe, Apple & Framer aesthetic).
 * Rendered at the app root to provide a unified, elegant background atmosphere across every page.
 */
export function GlobalNoiseBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden="true">
      {/* Base deep background */}
      <div className="absolute inset-0 bg-background" />

      {/* Layer 1 — Primary Emerald / Gold Aurora Light Field */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(circle at center, rgba(232,253,82,0.12) 0%, rgba(16,185,129,0.06) 45%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 2 — Indigo / Violet Aurora Light Field */}
      <motion.div
        className="absolute top-[30%] -right-[15%] w-[65vw] h-[65vw] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at center, rgba(109,129,255,0.12) 0%, rgba(139,92,246,0.05) 50%, transparent 75%)",
          filter: "blur(90px)",
        }}
        animate={{
          scale: [1, 1.12, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Layer 3 — Cyan / Teal Bottom Aurora Light Field */}
      <motion.div
        className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle at center, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.04) 55%, transparent 75%)",
          filter: "blur(85px)",
        }}
        animate={{
          scale: [1, 1.08, 1],
          x: [0, 25, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* High-precision micro grid */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Silky SVG Noise Texture Overlay (Linear & Framer inspired) */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

/**
 * Card & Container level component for elegant noise texturing & multi-color glows.
 */
export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(232, 253, 82)",
    "rgb(109, 129, 255)",
    "rgb(6, 182, 212)",
  ],
  noiseOpacity = 0.08,
}: NoiseBackgroundProps) {
  const color1 = gradientColors[0] || "rgb(232, 253, 82)";
  const color2 = gradientColors[1] || "rgb(109, 129, 255)";
  const color3 = gradientColors[2] || "rgb(6, 182, 212)";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-[1px] group transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10",
        containerClassName
      )}
    >
      {/* Subtle multi-color gradient glow */}
      <motion.div
        className="absolute inset-0 opacity-20 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${color1} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${color2} 0%, transparent 55%), radial-gradient(circle at 40% 90%, ${color3} 0%, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle SVG Noise texture overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card Content Container */}
      <div
        className={cn(
          "relative z-20 h-full w-full rounded-2xl bg-neutral-950/80 backdrop-blur-xl transition-colors duration-500 group-hover:bg-neutral-900/80 border border-white/10 group-hover:border-white/20",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
