import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ravanLogo from "@/assets/ravan_logo.svg";

const MAX_PX = 8;
const SPRING = { stiffness: 90, damping: 22, mass: 0.8 };

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
  const rotateX = useTransform(springY, (v) => v * -5);
  const rotateY = useTransform(springX, (v) => v * 5);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !isDesktop || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      rawX.set(((e.clientX - r.left) / r.width) * 2 - 1);
      rawY.set(((e.clientY - r.top) / r.height) * 2 - 1);
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
      className="relative flex h-full w-full items-center justify-center pointer-events-auto select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Floating + Parallax Pure Logo Focal Centerpiece */}
      <motion.div
        className="relative z-10 w-full max-w-[360px] md:max-w-[440px] lg:max-w-[500px]"
        style={reduced ? {} : { x: logoX, y: logoY, rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? {} : { scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="hero-logo-float flex items-center justify-center p-4">
          <img
            src={ravanLogo}
            alt="Ravan Mammadov Studio Logo"
            width={480}
            height={480}
            fetchPriority="high"
            decoding="async"
            className="h-auto w-full select-none drop-shadow-[0_10px_35px_rgba(97,197,173,0.3)] transition-transform duration-500 hover:drop-shadow-[0_15px_45px_rgba(152,79,159,0.45)]"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
