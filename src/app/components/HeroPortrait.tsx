import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ravanLogo from "@/assets/ravan_logo.svg";
import heroSculpture from "@/assets/hero_glass_sculpture.jpg";
import { Sparkles, Layers, Cpu, Code2, ArrowUpRight } from "lucide-react";

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
  const rotateX = useTransform(springY, (v) => v * -6);
  const rotateY = useTransform(springX, (v) => v * 6);

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
      {/* ── 3D GLASS SCULPTURE KNOT (Syngri & TaskHarbor Fusion Centerpiece) ── */}
      <motion.div
        className="relative z-10 w-full max-w-[480px] lg:max-w-[540px]"
        style={reduced ? {} : { x: logoX, y: logoY, rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduced ? {} : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        <div className="hero-logo-float relative">
          
          {/* Main 3D Iridescent Glass Knot Sculpture with Glass Glow */}
          <div className="relative rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-2 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.45)] dark:shadow-[0_30px_80px_rgba(97,197,173,0.18)] transition-all duration-500 hover:border-[#61c5ad]/50">
            
            {/* Header Window Dots (TaskHarbor style) */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-[10px] font-bold tracking-[.18em] mono text-muted-foreground uppercase flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#61c5ad]" />
                <span>RVAN.ME // CREATIVE ENGINE</span>
              </div>
            </div>

            {/* Glass Sculpture Image Container */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/40">
              <img
                src={heroSculpture}
                alt="3D Iridescent Glass Sculpture"
                className="h-full w-full object-cover mix-blend-screen opacity-95 transition-transform duration-700 hover:scale-105"
                draggable={false}
              />

              {/* Floating Rvan Logo Overlay in Sculpture Center */}
              <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none">
                <img
                  src={ravanLogo}
                  alt="Ravan Mammadov Logo"
                  className="w-full max-w-[220px] filter drop-shadow-[0_0_25px_rgba(97,197,173,0.6)] opacity-90 transition-transform duration-500 hover:scale-105"
                  draggable={false}
                />
              </div>

              {/* Glass Tag 1 (Top Right) */}
              <div className="absolute top-4 right-4 glass-sm px-3.5 py-1.5 rounded-full border border-white/20 text-[10px] font-bold mono uppercase text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <Layers size={12} className="text-[#61c5ad]" />
                <span>ART DIRECTION</span>
              </div>

              {/* Glass Tag 2 (Bottom Left) */}
              <div className="absolute bottom-4 left-4 glass-sm px-3.5 py-1.5 rounded-full border border-white/20 text-[10px] font-bold mono uppercase text-white shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                <Cpu size={12} className="text-[#426fba]" />
                <span>AI & AUTOMATION</span>
              </div>
            </div>

            {/* Bottom Mini Metric Bar */}
            <div className="grid grid-cols-2 divide-x divide-white/10 bg-white/5 px-4 py-3 text-center">
              <div>
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mono">VISUAL SYSTEM</span>
                <span className="text-xs font-bold text-foreground mono">100% UNIFIED</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-muted-foreground uppercase tracking-wider mono">LATENCY</span>
                <span className="text-xs font-bold text-[#61c5ad] mono">&lt; 20ms EDGE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
