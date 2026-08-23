import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ravanLogo from "@/assets/ravan_logo.svg";

const MAX_PX = 6;
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
  const rotateX = useTransform(springY, (v) => v * -3);
  const rotateY = useTransform(springX, (v) => v * 3);

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
      <motion.div
        className="relative z-10 w-full max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px]"
        style={reduced ? {} : { x: logoX, y: logoY, rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? {} : { scale: 1.02 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-center p-2">
          <img
            src={ravanLogo}
            alt="Rvan.me Logo"
            width={480}
            height={480}
            fetchPriority="high"
            decoding="async"
            className="h-auto w-full select-none transition-transform duration-300"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
}
