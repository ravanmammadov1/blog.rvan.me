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

export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = [
    "rgb(232, 253, 82)",
    "rgb(109, 129, 255)",
    "rgb(6, 182, 212)",
  ],
  noiseOpacity = 0.15,
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
      {/* Animated multi-color gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40 transition-opacity duration-700 group-hover:opacity-90 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${color1} 0%, transparent 50%), radial-gradient(circle at 80% 50%, ${color2} 0%, transparent 55%), radial-gradient(circle at 40% 90%, ${color3} 0%, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.06, 1],
          rotate: [0, 3, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG noise texture overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none mix-blend-overlay"
        style={{
          opacity: noiseOpacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
