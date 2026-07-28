// HeroPortrait component – premium SVG hero with depth, ambient light, interactive grid, grain, and staggered entrance
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useMotionValue, useTransform, Variants } from "motion/react";
import logo from "@/imports/ravan_logo.svg"; // SVG asset

// Simple grain overlay CSS (light noise)
const grainStyle = `
@keyframes grainAnim {
  0% { opacity: 0.03; }
  50% { opacity: 0.05; }
  100% { opacity: 0.03; }
}
.grain-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent);
  mix-blend-mode: overlay;
  animation: grainAnim 8s ease-in-out infinite;
}
`;

// Create a lightweight grid (15x15) using SVG lines
const Grid = ({ translateX, translateY }: { translateX: any; translateY: any }) => {
  const lines = useMemo(() => {
    const cols = 15;
    const rows = 15;
    const step = 100 / (cols - 1);
    const items: JSX.Element[] = [];
    for (let i = 0; i < cols; i++) {
      const x = i * step;
      items.push(
        <line
          key={`v-${i}`}
          x1={`${x}%`}
          y1="0%"
          x2={`${x}%`}
          y2="100%"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={0.5}
        />
      );
    }
    for (let i = 0; i < rows; i++) {
      const y = i * step;
      items.push(
        <line
          key={`h-${i}`}
          x1="0%"
          y1={`${y}%`}
          x2="100%"
          y2={`${y}%`}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={0.5}
        />
      );
    }
    return items;
  }, []);

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ x: translateX, y: translateY, willChange: "transform" }}
    >
      {lines}
    </motion.svg>
  );
};

// Framer‑motion variants for staggered entrance
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const layerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function HeroPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Mouse tracking for parallax (max 6px)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const maxOffset = 6; // pixels
  const translateX = useTransform(mouseX, [-1, 1], [-maxOffset, maxOffset]);
  const translateY = useTransform(mouseY, [-1, 1], [-maxOffset, maxOffset]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktop || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
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

  // Mobile: simple static SVG (no heavy effects)
  if (!isDesktop) {
    return (
      <div className="relative flex items-center justify-center h-full w-full">
        <img src={logo} alt="Ravan Logo" className="max-w-full h-auto" />
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center h-full w-full"
      style={{ perspective: 800, animation: "floatAnim 12s ease-in-out infinite" }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Ambient radial glow */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.12), transparent)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      {/* Grid background that reacts to mouse */}
      <motion.div variants={layerVariants} className="relative z-10">
        <Grid translateX={translateX} translateY={translateY} />
      </motion.div>

      {/* Logo layers for depth effect */}
      <motion.div variants={layerVariants} className="relative z-20">
        {/* First copy – slightly offset, lower opacity */}
        <motion.img
          src={logo}
          alt="Ravan Logo"
          className="max-w-full h-auto absolute inset-0 opacity-30"
          style={{
            x: translateX,
            y: translateY,
            filter: "blur(2px)",
            willChange: "transform",
          }}
        />
        {/* Main crisp logo */}
        <motion.img
          src={logo}
          alt="Ravan Logo"
          className="max-w-full h-auto relative"
          style={{
            x: translateX,
            y: translateY,
            willChange: "transform",
          }}
        />
        {/* Second copy – lighter, opposite offset for subtle depth */}
        <motion.img
          src={logo}
          alt="Ravan Logo"
          className="max-w-full h-auto absolute inset-0 opacity-20"
          style={{
            x: translateX.map((v: any) => -v),
            y: translateY.map((v: any) => -v),
            filter: "blur(4px)",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Light grain overlay */}
      <div className="grain-overlay" />
    </motion.div>
  );
}

// Inject the grain keyframes into the document head (runs once)
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = grainStyle;
  document.head.appendChild(style);
}