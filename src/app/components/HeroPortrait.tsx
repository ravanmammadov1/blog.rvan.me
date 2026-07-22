import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "motion/react";

interface HeroPortraitProps {
  embedUrl?: string;
}

export default function HeroPortrait({ embedUrl }: HeroPortraitProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isHovered = useMotionValue(0);

  const springConfig = {
    stiffness: 140,
    damping: 22,
    mass: 0.5,
  };

  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const smoothHover = useSpring(isHovered, springConfig);

  // Soft 3D tilt angle (max 8-10 degrees)
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);

  // Dynamic ambient shadow
  const shadowX = useTransform(smoothX, [-1, 1], [24, -24]);
  const shadowY = useTransform(smoothY, [-1, 1], [24, -24]);

  const boxShadow = useMotionTemplate`
    ${shadowX}px
    ${shadowY}px
    60px
    -20px
    rgba(0,0,0,.45)
  `;

  // Glare position & opacity
  const glareX = useTransform(smoothX, [-1, 1], [15, 85]);
  const glareY = useTransform(smoothY, [-1, 1], [15, 85]);

  const glareBackground = useMotionTemplate`
    radial-gradient(
      circle at ${glareX}% ${glareY}%,
      rgba(255,255,255,.14) 0%,
      rgba(255,255,255,0) 65%
    )
  `;

  const glareOpacity = useTransform(smoothHover, [0, 1], [0, 0.6]);
  const scale = useTransform(smoothHover, [0, 1], [1, 1.02]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      mouseX.set(x * 2 - 1);
      mouseY.set(y * 2 - 1);
    },
    [mouseX, mouseY]
  );

  const handleMouseEnter = useCallback(() => {
    isHovered.set(1);
  }, [isHovered]);

  const handleMouseLeave = useCallback(() => {
    isHovered.set(0);
    mouseX.set(0);
    mouseY.set(0);
  }, [isHovered, mouseX, mouseY]);

  const activeEmbedUrl = embedUrl || "https://app.vectary.com/p/4pfBeUDxFndvueghYmT7Kp";

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative h-full w-full overflow-hidden rounded-[inherit]"
      style={{
        rotateX,
        rotateY,
        scale,
        boxShadow,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Background Layer */}
      <motion.div
        className="absolute inset-0 bg-surface/90 backdrop-blur-md rounded-[inherit]"
        style={{ transform: "translateZ(-20px)" }}
      />

      {/* 3D Embed Layer */}
      <motion.div
        className="absolute inset-0 h-full w-full rounded-[inherit] overflow-hidden"
        style={{ transform: "translateZ(25px)" }}
      >
        <iframe
          src={activeEmbedUrl}
          frameBorder="0"
          width="100%"
          height="100%"
          allow="xr-spatial-tracking; fullscreen;"
          className="h-full w-full border-0 pointer-events-auto"
          title="Ravan Mammadov 3D Personal Brand Logo"
        />
      </motion.div>

      {/* Glare Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 mix-blend-soft-light"
        style={{
          background: glareBackground,
          opacity: glareOpacity,
          transform: "translateZ(40px)",
        }}
      />
    </motion.div>
  );
}