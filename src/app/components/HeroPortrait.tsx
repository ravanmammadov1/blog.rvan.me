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
      className="relative flex h-full w-full items-center justify-center overflow-visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Layer 1 — deep emerald/teal vector radial light field (full container, zero vertical seams) */}
      <motion.div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.06) 30%, rgba(6,182,212,0.03) 60%, transparent 100%)",
        }}
        animate={reduced ? {} : { opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 2 — violet vector radial light field (full container, zero vertical seams) */}
      <motion.div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.08) 0%, rgba(139,92,246,0.04) 35%, rgba(59,130,246,0.02) 65%, transparent 100%)",
        }}
        animate={reduced ? {} : { opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* Layer 3 — bottom teal vector radial ground light */}
      <motion.div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(ellipse at center 85%, rgba(16,185,129,0.10) 0%, rgba(6,182,212,0.03) 50%, transparent 100%)",
        }}
        animate={reduced ? {} : { opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
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
          <img
            src={ravanLogo}
            alt="Ravan Mammadov"
            className="hero-logo-img h-auto w-full max-w-[300px] select-none lg:max-w-[380px] xl:max-w-[440px]"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}