import { useRef, useCallback, lazy, Suspense, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import ErrorBoundary from "./ErrorBoundary";

const Hero3DCanvas = lazy(() => import("./Hero3DCanvas"));

export default function HeroPortrait() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Soft 3D tilt angle on desktop (max 5 degrees)
  const rotateX = useTransform(smoothY, [-1, 1], [5, -5]);
  const rotateY = useTransform(smoothX, [-1, 1], [-5, 5]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktop || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 2);
      mouseY.set(y * 2);
    },
    [isDesktop, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Completely omit rendering on mobile & tablet (<1024px) for 100% clean mobile layout
  if (!isDesktop) return null;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden bg-transparent"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d" as any,
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 bg-transparent" />
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <Hero3DCanvas />
          </Suspense>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}