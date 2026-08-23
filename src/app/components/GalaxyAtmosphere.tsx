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
 * Refined, high-performance deep-space / galaxy atmosphere.
 * Features ultra-subtle multi-depth stars, organic slow twinkle, and continuous cosmic depth.
 * Respects `prefers-reduced-motion` and seamlessly supports both Dark & Light themes.
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

    // Palette accents for rare starlight
    const darkAccentColors = [
      "255, 255, 255",     // Crisp pure starlight
      "255, 255, 255",     // Crisp pure starlight
      "97, 197, 173",      // Brand Cyan / Teal
      "96, 153, 223",      // Brand Blue
      "188, 102, 197",     // Brand Lilac / Purple
      "224, 242, 254",     // Sky Blue
    ];

    const lightAccentColors = [
      "15, 23, 42",        // Slate ink
      "30, 41, 59",        // Dark slate
      "13, 148, 136",      // Muted teal
      "66, 111, 186",      // Muted blue
    ];

    const initStars = (w: number, h: number) => {
      const isMobile = w < 768;
      // Total count balanced for maximum elegance and near-zero CPU/GPU footprint
      const totalStars = isMobile ? 90 : 160;
      const newStars: Star[] = [];

      for (let i = 0; i < totalStars; i++) {
        const randTier = Math.random();
        let size = 0.8;
        let baseAlpha = 0.2;
        let twinkleSpeed = 0.015;
        let colorRgb = isDark ? "255, 255, 255" : "15, 23, 42";

        if (randTier < 0.7) {
          // Tier 1: Distant stardust micro-particles (70%)
          size = Math.random() * 0.7 + 0.5;
          baseAlpha = isDark ? Math.random() * 0.25 + 0.12 : Math.random() * 0.05 + 0.03;
          twinkleSpeed = Math.random() * 0.008 + 0.004;
        } else if (randTier < 0.92) {
          // Tier 2: Mid-depth sparkling stars (22%)
          size = Math.random() * 0.8 + 1.1;
          baseAlpha = isDark ? Math.random() * 0.35 + 0.25 : Math.random() * 0.08 + 0.05;
          twinkleSpeed = Math.random() * 0.02 + 0.01;
        } else {
          // Tier 3: Rare luminous celestial accents (8%)
          size = Math.random() * 1.0 + 1.6;
          baseAlpha = isDark ? Math.random() * 0.45 + 0.35 : Math.random() * 0.12 + 0.08;
          twinkleSpeed = Math.random() * 0.03 + 0.015;
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
          driftX: (Math.random() - 0.5) * 0.04,
          driftY: (Math.random() - 0.5) * 0.03,
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

      // If reduced motion is preferred, render a single frame and exit
      if (prefersReducedMotion) {
        drawFrame(0);
      }
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        if (!prefersReducedMotion) {
          // Slow organic drift
          star.x += star.driftX;
          star.y += star.driftY;

          // Wrap edges smoothly
          if (star.x < 0) star.x = width;
          if (star.x > width) star.x = 0;
          if (star.y < 0) star.y = height;
          if (star.y > height) star.y = 0;

          // Natural sine-wave twinkling
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
      // Throttle slightly to ensure rock-solid 60fps with zero battery/GPU strain
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
      {/* ── 1. Base Deep Space Void Background ── */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* ── 2. Atmospheric Deep Space Nebula Fields (Seamless Across Whole Page) ── */}
      {/* Top-Right Cosmic Glow (Subtle Brand Cyan/Blue) */}
      <div
        className="absolute -top-[20%] right-[-10%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full pointer-events-none opacity-30 dark:opacity-20 transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(97, 197, 173, 0.08) 0%, rgba(66, 111, 186, 0.03) 45%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(97, 197, 173, 0.04) 0%, rgba(66, 111, 186, 0.015) 50%, transparent 75%)",
          filter: "blur(70px)",
        }}
      />

      {/* Middle-Left Ambient Depth (Subtle Brand Purple) */}
      <div
        className="absolute top-[35%] -left-[15%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none opacity-25 dark:opacity-15 transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(152, 79, 159, 0.07) 0%, rgba(66, 111, 186, 0.02) 50%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(152, 79, 159, 0.03) 0%, rgba(66, 111, 186, 0.01) 50%, transparent 75%)",
          filter: "blur(80px)",
        }}
      />

      {/* Bottom Cosmic Depth (Deep Subdued Blue) */}
      <div
        className="absolute -bottom-[15%] right-[20%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full pointer-events-none opacity-20 dark:opacity-15 transition-opacity duration-700"
        style={{
          background: isDark
            ? "radial-gradient(circle at center, rgba(66, 111, 186, 0.06) 0%, rgba(97, 197, 173, 0.02) 55%, transparent 75%)"
            : "radial-gradient(circle at center, rgba(66, 111, 186, 0.025) 0%, rgba(97, 197, 173, 0.01) 55%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      {/* ── 3. High-Performance Canvas Starfield ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: isDark ? 0.9 : 0.6 }}
      />
    </div>
  );
}
