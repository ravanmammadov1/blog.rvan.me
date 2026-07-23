import { useRef, useCallback, lazy, Suspense } from "react";
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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 22, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Soft 3D tilt angle (max 5 degrees)
  const rotateX = useTransform(smoothY, [-1, 1], [5, -5]);
  const rotateY = useTransform(smoothX, [-1, 1], [-5, 5]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x * 2);
      mouseY.set(y * 2);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden rounded-[inherit]"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d" as any,
        willChange: "transform",
      }}
    >
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-surface/90 backdrop-blur-md rounded-[inherit]"
        style={{ transform: "translateZ(-20px)" }}
      />

      {/* 3D GLB Model Layer */}
      <div
        className="absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden"
        style={{ transform: "translateZ(25px)" }}
      >
        <ErrorBoundary
          fallback={
            <div className="flex h-full w-full flex-col items-center justify-center p-6 bg-surface text-foreground text-center">
              <div className="h-14 w-14 rounded-2xl border border-primary/50 bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mono mb-3">
                R
              </div>
              <p className="text-[11px] font-bold tracking-widest text-primary mono uppercase">
                RAVANIMATE CREATIVE
              </p>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-surface/80">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            }
          >
            <Hero3DCanvas />
          </Suspense>
        </ErrorBoundary>
      </div>
    </motion.div>
  );
}