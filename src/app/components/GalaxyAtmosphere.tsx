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
 * Minimal, editorial cosmic atmosphere for Rvan.me.
 * Dark Mode: Quiet night sky / deep space (near-black + sparse tiny stars + subtle atmospheric depth).
 * Light Mode: Bright atmospheric daytime cosmos (warm-neutral canvas + perceptible teal/blue/violet atmospheric haze + sparse micro-stardust).
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

    // Palette accents for starlight in dark mode
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
      "71, 85, 105",   // Slate-600
      "100, 116, 139", // Slate-500
      "13, 148, 136",  // Subtle Teal
      "37, 99, 235",   // Subtle Blue
      "124, 58, 237",  // Subtle Purple
    ];

    const initStars = (w: number, h: number) => {
      const isMobile = w < 768;
      // Sparse star count ensuring minimal, quiet editorial aesthetic without clutter
      const totalStars = isMobile ? (isDark ? 65 : 45) : (isDark ? 120 : 80);
      const newStars: Star[] = [];

      for (let i = 0; i < totalStars; i++) {
        const randTier = Math.random();
        let size = 0.8;
        let baseAlpha = 0.2;
        let twinkleSpeed = 0.008;
        let colorRgb = isDark ? "255, 255, 255" : "71, 85, 105";

        if (randTier < 0.70) {
          // Tier 1: Distant micro-stardust (70%) — tiny & calm
          size = Math.random() * 0.5 + 0.4;
          baseAlpha = isDark ? Math.random() * 0.25 + 0.12 : Math.random() * 0.16 + 0.08;
          twinkleSpeed = Math.random() * 0.006 + 0.003;
        } else if (randTier < 0.92) {
          // Tier 2: Mid-depth subtle stars (22%)
          size = Math.random() * 0.6 + 0.8;
          baseAlpha = isDark ? Math.random() * 0.40 + 0.20 : Math.random() * 0.24 + 0.12;
          twinkleSpeed = Math.random() * 0.012 + 0.006;
          const colors = isDark ? darkAccentColors : lightAccentColors;
          colorRgb = colors[Math.floor(Math.random() * colors.length)];
        } else {
          // Tier 3: Rare luminous cosmic accents (8%)
          size = Math.random() * 0.6 + 1.2;
          baseAlpha = isDark ? Math.random() * 0.55 + 0.30 : Math.random() * 0.35 + 0.18;
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
          const variance = Math.sin(star.twinklePhase) * 0.35;
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
      {/* ── 1. Base Neutral Canvas ── */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* ── 2. Subtle Cosmic Atmospheric Gradient Fields (Visible & Sophisticated) ── */}
      {/* Top-Right Primary Atmospheric Nebula Haze (Teal → Blue → Violet) */}
      <div
        className="absolute -top-[10%] right-[-5%] w-[70vw] h-[70vw] max-w-[950px] max-h-[950px] rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 65% 55% at 60% 40%, rgba(97, 197, 173, 0.16) 0%, rgba(66, 111, 186, 0.12) 45%, rgba(152, 79, 159, 0.08) 75%, transparent 100%)"
            : "radial-gradient(ellipse 65% 55% at 60% 40%, rgba(97, 197, 173, 0.16) 0%, rgba(66, 111, 186, 0.11) 45%, rgba(152, 79, 159, 0.07) 75%, transparent 100%)",
          filter: "blur(60px)",
        }}
      />

      {/* Center-Left Secondary Atmospheric Depth (Violet → Blue) */}
      <div
        className="absolute top-[30%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none transition-opacity duration-1000"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 60% 50% at 40% 50%, rgba(188, 102, 197, 0.12) 0%, rgba(66, 111, 186, 0.08) 50%, transparent 80%)"
            : "radial-gradient(ellipse 60% 50% at 40% 50%, rgba(152, 79, 159, 0.10) 0%, rgba(66, 111, 186, 0.07) 50%, transparent 80%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── 3. High-Performance Canvas Starfield (Sparse, refined starlight) ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isDark ? 0.9 : 0.65 }}
      />
    </div>
  );
}
