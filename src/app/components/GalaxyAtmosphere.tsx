import React, { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  currentAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
  color: string;
}

/**
 * GalaxyAtmosphere
 * Minimal, editorial digital atmosphere for Rvan.me.
 * Dark Mode: Quiet night sky / deep space (near-black + sparse tiny stars + subtle atmospheric depth).
 * Light Mode: Quiet daytime sky / atmosphere (warm off-white + very subtle sky/cyan depth).
 * Completely lightweight, pure Canvas 2D + CSS, respects `prefers-reduced-motion`.
 */
export default function GalaxyAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Palette accents for rare starlight in dark mode
    const darkAccentColors = [
      "255, 255, 255", // Crisp pure white starlight
      "255, 255, 255",
      "97, 197, 173",  // Brand Cyan
      "96, 153, 223",  // Brand Blue
      "188, 102, 197", // Brand Purple
      "224, 242, 254", // Faint Sky Blue
    ];

    // Palette accents for sparse micro-particles in light mode
    const lightAccentColors = [
      "30, 41, 59",    // Slate
      "51, 65, 85",    // Slate micro-speck
      "13, 148, 136",  // Subtle Cyan/Teal
      "59, 130, 246",  // Subtle Sky Blue
    ];

    const initStars = (w: number, h: number) => {
      const isMobile = w < 768;
      // Sparse star count ensuring minimal, quiet editorial aesthetic without clutter
      const totalStars = isMobile ? 65 : 120;
      const newStars: Star[] = [];

      for (let i = 0; i < totalStars; i++) {
        const randTier = Math.random();
        let size = 0.7;
        let baseAlpha = 0.15;
        let twinkleSpeed = 0.008;
        let colorRgb = isDark ? "255, 255, 255" : "30, 41, 59";

        if (randTier < 0.75) {
          // Tier 1: Distant micro-stardust (75%) — tiny & calm
          size = Math.random() * 0.5 + 0.4;
          baseAlpha = isDark ? Math.random() * 0.18 + 0.08 : Math.random() * 0.04 + 0.02;
          twinkleSpeed = Math.random() * 0.006 + 0.003;
        } else if (randTier < 0.94) {
          // Tier 2: Mid-depth subtle stars (19%)
          size = Math.random() * 0.6 + 0.9;
          baseAlpha = isDark ? Math.random() * 0.28 + 0.15 : Math.random() * 0.06 + 0.03;
          twinkleSpeed = Math.random() * 0.012 + 0.006;
        } else {
          // Tier 3: Rare luminous accents (6%)
          size = Math.random() * 0.7 + 1.2;
          baseAlpha = isDark ? Math.random() * 0.38 + 0.22 : Math.random() * 0.08 + 0.04;
          twinkleSpeed = Math.random() * 0.018 + 0.008;
          const colors = isDark ? darkAccentColors : lightAccentColors;
          colorRgb = colors[Math.floor(Math.random() * colors.length)];
        }

        newStars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size,
          baseAlpha,
          currentAlpha: baseAlpha,
          twinkleSpeed,
          twinklePhase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.025,
          driftY: (Math.random() - 0.5) * 0.02,
          color: colorRgb,
        });
      }

      return newStars;
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      stars = initStars(width, height);

      // If user prefers reduced motion, render single frame
      if (prefersReducedMotion) {
        drawFrame(0);
      }
    };

    const drawFrame = (_time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Extremely slow organic drift
          star.x += star.driftX;
          star.y += star.driftY;

          // Smooth edge wrap
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;

          // Subtle organic sine twinkle
          star.twinklePhase += star.twinkleSpeed;
          const variance = Math.sin(star.twinklePhase) * 0.3;
          star.currentAlpha = Math.max(0.01, Math.min(1, star.baseAlpha + variance * star.baseAlpha));
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color}, ${star.currentAlpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle for 60fps efficiency
      if (time - lastTime >= 16) {
        drawFrame(time);
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 -z-40 overflow-hidden select-none transform-gpu"
      aria-hidden="true"
    >
      {/* ── 1. Base Neutral Atmosphere ── */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* ── 2. Minimal Atmospheric Depth (Subtle Gradient Fields) ── */}
      {/* Top Ambient Glow (Subtle Brand Cyan/Blue Accent) */}
      <div
        className="absolute -top-[15%] right-[-8%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(97, 197, 173, 0.05) 0%, rgba(66, 111, 186, 0.02) 50%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(97, 197, 173, 0.04) 0%, rgba(59, 130, 246, 0.02) 50%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      {/* Center-Left Depth (Subtle Brand Purple/Lilac Accent) */}
      <div
        className="absolute top-[35%] -left-[12%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(188, 102, 197, 0.04) 0%, rgba(66, 111, 186, 0.015) 50%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(188, 102, 197, 0.025) 0%, rgba(66, 111, 186, 0.01) 50%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      {/* ── 3. High-Performance Canvas Starfield (Dark: Night Sky / Light: Daytime micro-texture) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isDark ? 0.85 : 0.45 }}
      />
    </div>
  );
}
