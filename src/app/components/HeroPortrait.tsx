/**
 * HeroPortrait — Apple-inspired SVG hero visual
 *
 * Features:
 * - SVG logo as focal centrepiece
 * - Soft floating animation (CSS keyframe, GPU-only)
 * - Mouse-parallax via framer-motion (max 8px, desktop only)
 * - Ambient radial aurora glow behind the logo
 * - prefers-reduced-motion respected
 * - No Three.js, no Canvas, no WebGL, no broken .map() calls
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ravanLogo from "@/assets/ravan_logo.svg";

// ─── constants ───────────────────────────────────────────────────────────────
const MAX_PARALLAX = 8; // px
const SPRING_CONFIG = { stiffness: 120, damping: 22, mass: 0.6 };

// ─── component ───────────────────────────────────────────────────────────────
export default function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Detect reduced-motion preference once on mount
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = () => setPrefersReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Raw mouse position (normalised -1 → 1)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth spring followers
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReduced || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    },
    [prefersReduced, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Ambient aurora glow — behind the logo */}
      <motion.div
        className="hero-glow pointer-events-none absolute inset-0"
        animate={
          prefersReduced
            ? {}
            : {
                opacity: [0.55, 0.85, 0.55],
                scale: [1, 1.08, 1],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(79,102,182,0.28) 0%, rgba(97,197,173,0.18) 50%, transparent 80%)",
          filter: "blur(28px)",
        }}
      />

      {/* Floating + parallax logo wrapper */}
      <motion.div
        className="relative z-10"
        style={
          prefersReduced
            ? {}
            : {
                x: springX,
                y: springY,
                translateX: `calc(${MAX_PARALLAX}px * var(--px, 0))`,
                translateY: `calc(${MAX_PARALLAX}px * var(--py, 0))`,
              }
        }
        whileHover={prefersReduced ? {} : { scale: 1.03 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Floating keyframe wrapper */}
        <div
          style={
            prefersReduced
              ? {}
              : { animation: "heroFloat 7s ease-in-out infinite" }
          }
        >
          <img
            src={ravanLogo}
            alt="Ravan Mammadov logo"
            className="h-auto w-full max-w-[340px] select-none drop-shadow-2xl lg:max-w-[420px]"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* Subtle secondary glow echo */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "70%",
          height: "40%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(152,79,159,0.18) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
        animate={prefersReduced ? {} : { opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}