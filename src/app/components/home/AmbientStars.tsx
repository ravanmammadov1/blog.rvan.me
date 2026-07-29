import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface Star {
  id: number;
  xPct: number;
  yPct: number;
  size: number;
  opacity: number;
  floatX: number;
  floatY: number;
  duration: number;
}

export default function AmbientStars() {
  const [stars, setStars] = useState<Star[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    // Generate stars on client-side to prevent hydration mismatch
    const generated: Star[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      xPct: Math.random() * 100,
      yPct: Math.random() * 100,
      size: Math.random() < 0.7 ? 1 : 1.8, // Most stars are 1px, some are 1.8px
      opacity: 0.08 + Math.random() * 0.14, // Extremely low opacity (8% to 22%)
      floatX: 4 + Math.random() * 8, // Drifts by 4px to 12px
      floatY: 4 + Math.random() * 8,
      duration: 12 + Math.random() * 16, // Ultra-slow floating cycle (12s to 28s)
    }));
    setStars(generated);

    // Track size & mobile status
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < 768);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    // Track prefers-reduced-motion status
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Mouse listener on window (since it's a fixed backdrop)
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Touch listener for touch screens to update/fade out cursor position
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX.set(e.touches[0].clientX);
        mouseY.set(e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("resize", updateDimensions);
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {stars.map((star) => (
        <StarNode
          key={star.id}
          star={star}
          mouseX={mouseX}
          mouseY={mouseY}
          width={dimensions.width}
          height={dimensions.height}
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  );
}

interface StarNodeProps {
  star: Star;
  mouseX: any;
  mouseY: any;
  width: number;
  height: number;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

function StarNode({
  star,
  mouseX,
  mouseY,
  width,
  height,
  isMobile,
  prefersReducedMotion,
}: StarNodeProps) {
  // Translate cursor proximity into a gentle push away
  const x = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (isMobile || prefersReducedMotion) return 0;
    const starAbsX = (star.xPct / 100) * width;
    const diffX = mx - starAbsX;
    const starAbsY = (star.yPct / 100) * height;
    const diffY = my - starAbsY;
    const dist = Math.hypot(diffX, diffY);

    if (dist < 130) {
      const force = (130 - dist) / 130; // Scale from 0 (at 130px away) to 1 (at 0px away)
      const angle = Math.atan2(diffY, diffX);
      // Gentle push away by up to 5px with smooth easing
      return -Math.cos(angle) * 5.5 * force * force;
    }
    return 0;
  });

  const y = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (isMobile || prefersReducedMotion) return 0;
    const starAbsX = (star.xPct / 100) * width;
    const diffX = mx - starAbsX;
    const starAbsY = (star.yPct / 100) * height;
    const diffY = my - starAbsY;
    const dist = Math.hypot(diffX, diffY);

    if (dist < 130) {
      const force = (130 - dist) / 130;
      const angle = Math.atan2(diffY, diffX);
      return -Math.sin(angle) * 5.5 * force * force;
    }
    return 0;
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${star.xPct}%`,
        top: `${star.yPct}%`,
        x,
        y,
      }}
    >
      <motion.div
        className="rounded-full bg-white"
        style={{
          width: star.size,
          height: star.size,
          opacity: star.opacity,
        }}
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, star.floatX, -star.floatX, 0],
                y: [0, star.floatY, -star.floatY, 0],
              }
        }
        transition={{
          duration: star.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
