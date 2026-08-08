/**
 * HeroPortrait — Pure SVG focal centrepiece
 *
 * - Pure vector rendering with 100% transparent background
 * - Gentle floating 7px / 11s ease-in-out loop
 * - Mouse parallax max 5px, spring-smoothed, desktop only
 * - Zero radial gradients, zero filters, zero drop-shadows, zero background layers
 * - Hover: scale 1.015 only
 * - prefers-reduced-motion: all animations disabled
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
      className="relative flex h-full w-full items-center justify-center bg-transparent pointer-events-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Floating + parallax wrapper */}
      <motion.div
        className="relative z-10 bg-transparent"
        style={reduced ? {} : { x: logoX, y: logoY }}
        whileHover={reduced ? {} : { scale: 1.015 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        {/* Floating keyframe wrapper */}
        <div className={reduced ? "bg-transparent" : "hero-logo-float bg-transparent"}>
          <img
            src={ravanLogo}
            alt="Ravan Mammadov"
            width={440}
            height={440}
            fetchPriority="high"
            decoding="async"
            className="hero-logo-img h-auto w-full max-w-[300px] select-none lg:max-w-[380px] xl:max-w-[440px] bg-transparent"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
