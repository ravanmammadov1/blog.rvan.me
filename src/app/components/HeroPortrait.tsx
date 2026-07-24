import { useRef, useCallback, lazy, Suspense, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import ErrorBoundary from "./ErrorBoundary";

const Hero3DCanvas = lazy(() => import("./Hero3DCanvas"));

function StaticHeroLogo() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 bg-transparent text-foreground text-center select-none">
      <div className="relative flex items-center justify-center">
        {/* Monogram emblem */}
        <div className="h-28 w-28 rounded-3xl border-2 border-primary/50 bg-black flex items-center justify-center text-primary font-bold text-4xl mono shadow-[0_0_50px_rgba(232,253,82,0.15)]">
          RM
        </div>
        {/* Decorative corner accent */}
        <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary" />
      </div>
      <p className="mt-6 text-xs font-bold tracking-[0.24em] text-primary mono uppercase">
        RAVANIMATE CREATIVE
      </p>
      <p className="mt-1 text-[10px] font-medium tracking-widest text-muted-foreground mono uppercase">
        3D · MOTION · BRAND WORLDS
      </p>
    </div>
  );
}

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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden bg-transparent"
      style={
        isDesktop
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1400,
              transformStyle: "preserve-3d" as any,
              willChange: "transform",
            }
          : {}
      }
    >
      {/* Seamless background matching Hero section background */}
      <div className="absolute inset-0 bg-transparent" />

      {/* Hero Visual Layer */}
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-transparent">
        {!isDesktop ? (
          /* Mobile / Tablet Static Logo (No Three.js asset loading for max performance) */
          <StaticHeroLogo />
        ) : (
          /* Desktop Interactive 3D Canvas (>=1024px) */
          <ErrorBoundary fallback={<StaticHeroLogo />}>
            <Suspense fallback={<StaticHeroLogo />}>
              <Hero3DCanvas />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </motion.div>
  );
}