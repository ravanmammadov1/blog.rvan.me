/**
 * HeroPortrait — Premium SVG focal centrepiece
 *
 * - Animated SVG gradient shift (filter hue-rotate loop)
 * - Gentle floating 7px / 11s ease-in-out loop
 * - Mouse parallax max 5px, spring-smoothed, desktop only
 * - Aurora-reactive multi-layer glow behind the logo
 * - Hover: scale 1.015 only
 * - prefers-reduced-motion: all animations disabled
 * - Zero Three.js / Canvas / WebGL
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ravanLogo from "@/assets/ravan_logo.svg";

const MAX_PX = 5;
const SPRING = { stiffness: 80, damping: 20, mass: 0.8 };

export default function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const mql = () => setReduced(mq.matches);
    mq.addEventListener("change", mql);

    const sizeMq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(sizeMq.matches);
    const sizeHandler = () => setIsDesktop(sizeMq.matches);
    sizeMq.addEventListener("change", sizeHandler);

    return () => {
      mq.removeEventListener("change", mql);
      sizeMq.removeEventListener("change", sizeHandler);
    };
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, SPRING);
  const springY = useSpring(rawY, SPRING);
  const logoX = useTransform(springX, (v) => v * MAX_PX);
  const logoY = useTransform(springY, (v) => v * MAX_PX);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !isDesktop || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      rawX.set((e.clientX - r.left) / r.width * 2 - 1);
      rawY.set((e.clientY - r.top) / r.height * 2 - 1);
    },
    [reduced, isDesktop, rawX, rawY]
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
      {/* Layer 1 — deep aurora core glow (slowest pulse) */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: "90%",
          height: "90%",
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.12) 35%, rgba(79,102,182,0.10) 60%, transparent 80%)",
          filter: "blur(48px)",
        }}
        animate={reduced ? {} : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.12, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2 — violet echo glow (offset timing) */}
      <motion.div
        className="pointer-events-none absolute"
        style={{
          width: "70%",
          height: "70%",
          background:
            "radial-gradient(ellipse 60% 55% at 52% 48%, rgba(139,92,246,0.14) 0%, rgba(59,130,246,0.08) 50%, transparent 75%)",
          filter: "blur(36px)",
        }}
        animate={reduced ? {} : { opacity: [0.3, 0.65, 0.3], scale: [1.05, 0.95, 1.05] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Floating + parallax wrapper */}
      <motion.div
        className="relative z-10"
        style={reduced ? {} : { x: logoX, y: logoY }}
        whileHover={reduced ? {} : { scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        {/* Floating keyframe wrapper */}
        <div className={reduced ? "" : "hero-logo-float"}>
          {/* Gradient animated wrapper for the SVG */}
          <div className={`relative ${reduced ? "" : "hero-logo-hue"}`}>
            <img
              src={ravanLogo}
              alt="Ravan Mammadov"
              className="hero-logo-img h-auto w-full max-w-[300px] select-none lg:max-w-[380px] xl:max-w-[440px]"
              draggable={false}
            />
            {/* Glass shine overlay on the logo */}
            {!reduced && (
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.03) 100%)",
                  mixBlendMode: "screen",
                }}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* Layer 3 — bottom teal ground glow */}
      <motion.div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: "65%",
          height: "35%",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={reduced ? {} : { opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
    </div>
  );
}