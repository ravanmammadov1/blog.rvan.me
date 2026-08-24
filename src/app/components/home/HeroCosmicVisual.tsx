import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../../../context/ThemeContext";

const MAX_OFFSET = 8;
const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.9 };

export default function HeroCosmicVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { isDark } = useTheme();

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
  const springX = useSpring(rawX, SPRING_CONFIG);
  const springY = useSpring(rawY, SPRING_CONFIG);

  const visualX = useTransform(springX, (v) => v * MAX_OFFSET);
  const visualY = useTransform(springY, (v) => v * MAX_OFFSET);
  const rotateX = useTransform(springY, (v) => v * -4);
  const rotateY = useTransform(springX, (v) => v * 4);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !isDesktop || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [reduced, isDesktop, rawX, rawY]
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  // Color tokens depending on active theme
  const strokeBase = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(15, 23, 42, 0.12)";
  const strokeFaint = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.06)";
  const strokeAccentTeal = isDark ? "rgba(97, 197, 173, 0.45)" : "rgba(13, 148, 136, 0.45)";
  const strokeAccentBlue = isDark ? "rgba(66, 111, 186, 0.4)" : "rgba(37, 99, 235, 0.4)";
  const nodeFill = isDark ? "#121215" : "#ffffff";
  const nodeBorder = isDark ? "rgba(255, 255, 255, 0.25)" : "#dde1e0";
  const textMuted = isDark ? "#94a3b8" : "#64748b";

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full items-center justify-center pointer-events-auto select-none overflow-visible py-4 md:py-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Background Atmospheric Nebula Haze */}
      <div
        className="pointer-events-none absolute -inset-8 md:-inset-16 rounded-full transition-opacity duration-1000"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(97, 197, 173, 0.15) 0%, rgba(66, 111, 186, 0.12) 40%, rgba(152, 79, 159, 0.08) 70%, transparent 100%)"
            : "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(13, 148, 136, 0.08) 0%, rgba(66, 111, 186, 0.06) 40%, rgba(152, 79, 159, 0.04) 70%, transparent 100%)",
          filter: "blur(40px)",
        }}
      />

      {/* Main Cosmic Constellation & Orbital System */}
      <motion.div
        className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[500px] aspect-square"
        style={
          reduced
            ? {}
            : {
                x: visualX,
                y: visualY,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for Primary Orbital Ring */}
            <linearGradient id="orbitGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDark ? "#61c5ad" : "#0d9488"} stopOpacity="0.8" />
              <stop offset="50%" stopColor={isDark ? "#426fba" : "#2563eb"} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isDark ? "#984f9f" : "#7c3aed"} stopOpacity="0.8" />
            </linearGradient>

            {/* Core Nucleus Glow */}
            <radialGradient id="nucleusGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isDark ? "#61c5ad" : "#0d9488"} stopOpacity="0.5" />
              <stop offset="100%" stopColor={isDark ? "#61c5ad" : "#0d9488"} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── 1. BACKGROUND GUIDE GRID & SUBTLE RADIALS ── */}
          <circle cx="250" cy="250" r="230" stroke={strokeFaint} strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="250" cy="250" r="180" stroke={strokeFaint} strokeWidth="1" />
          <circle cx="250" cy="250" r="110" stroke={strokeFaint} strokeWidth="1" strokeDasharray="2 4" />

          {/* Axis Crosshairs */}
          <line x1="20" y1="250" x2="480" y2="250" stroke={strokeFaint} strokeWidth="0.75" />
          <line x1="250" y1="20" x2="250" y2="480" stroke={strokeFaint} strokeWidth="0.75" />

          {/* ── 2. ROTATING ORBITAL ELLIPSES ── */}
          {/* Outer Inclined Orbit (Tilted 32deg) */}
          <g transform="rotate(-28 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="210"
              ry="110"
              stroke="url(#orbitGradPrimary)"
              strokeWidth="1.25"
              strokeDasharray="6 8"
              opacity={isDark ? "0.7" : "0.85"}
            />
            {/* Satellite Node on Outer Orbit */}
            <circle cx="460" cy="250" r="4" fill={isDark ? "#61c5ad" : "#0d9488"} />
            <circle cx="460" cy="250" r="8" stroke={strokeAccentTeal} strokeWidth="1" />
          </g>

          {/* Middle Counter-Inclined Orbit (Tilted -42deg) */}
          <g transform="rotate(38 250 250)">
            <ellipse
              cx="250"
              cy="250"
              rx="170"
              ry="85"
              stroke={strokeBase}
              strokeWidth="1"
            />
            {/* Satellite Node on Middle Orbit */}
            <circle cx="80" cy="250" r="3.5" fill={isDark ? "#426fba" : "#2563eb"} />
            <circle cx="80" cy="250" r="7" stroke={strokeAccentBlue} strokeWidth="1" />
          </g>

          {/* Inner Fast Orbit */}
          <ellipse
            cx="250"
            cy="250"
            rx="95"
            ry="60"
            transform="rotate(-15 250 250)"
            stroke={strokeBase}
            strokeWidth="0.75"
            strokeDasharray="4 4"
          />

          {/* ── 3. CONSTELLATION NODES & GEOMETRIC CONNECTIONS ── */}
          {/* Connecting Constellation Lines */}
          <polygon
            points="145,130 355,145 385,320 160,360 110,230"
            stroke={strokeAccentTeal}
            strokeWidth="1"
            strokeDasharray="4 4"
            fill="none"
            opacity="0.6"
          />
          <line x1="250" y1="250" x2="145" y2="130" stroke={strokeFaint} strokeWidth="1" />
          <line x1="250" y1="250" x2="355" y2="145" stroke={strokeFaint} strokeWidth="1" />
          <line x1="250" y1="250" x2="385" y2="320" stroke={strokeFaint} strokeWidth="1" />
          <line x1="250" y1="250" x2="160" y2="360" stroke={strokeFaint} strokeWidth="1" />
          <line x1="250" y1="250" x2="110" y2="230" stroke={strokeFaint} strokeWidth="1" />

          {/* Secondary Constellation Stars */}
          <circle cx="85" cy="110" r="1.5" fill={textMuted} opacity="0.6" />
          <circle cx="410" cy="95" r="2" fill={textMuted} opacity="0.7" />
          <circle cx="440" cy="380" r="1.5" fill={textMuted} opacity="0.6" />
          <circle cx="70" cy="390" r="2" fill={textMuted} opacity="0.7" />
          <circle cx="290" cy="80" r="1.5" fill={textMuted} opacity="0.5" />
          <circle cx="210" cy="430" r="1.5" fill={textMuted} opacity="0.5" />

          {/* Node 1: DESIGN (Top-Left) */}
          <g>
            <circle cx="145" cy="130" r="7" fill={nodeFill} stroke={nodeBorder} strokeWidth="1.5" />
            <circle cx="145" cy="130" r="2.5" fill={isDark ? "#61c5ad" : "#0d9488"} />
            <text
              x="145"
              y="112"
              textAnchor="middle"
              fill={textMuted}
              fontSize="9"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.12em"
              fontWeight="600"
            >
              01 // DESIGN
            </text>
          </g>

          {/* Node 2: STRATEGY (Top-Right) */}
          <g>
            <circle cx="355" cy="145" r="7" fill={nodeFill} stroke={nodeBorder} strokeWidth="1.5" />
            <circle cx="355" cy="145" r="2.5" fill={isDark ? "#426fba" : "#2563eb"} />
            <text
              x="355"
              y="128"
              textAnchor="middle"
              fill={textMuted}
              fontSize="9"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.12em"
              fontWeight="600"
            >
              02 // STRATEGY
            </text>
          </g>

          {/* Node 3: IDEAS / CULTURE (Bottom-Right) */}
          <g>
            <circle cx="385" cy="320" r="7" fill={nodeFill} stroke={nodeBorder} strokeWidth="1.5" />
            <circle cx="385" cy="320" r="2.5" fill={isDark ? "#984f9f" : "#7c3aed"} />
            <text
              x="385"
              y="342"
              textAnchor="middle"
              fill={textMuted}
              fontSize="9"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.12em"
              fontWeight="600"
            >
              03 // IDEAS
            </text>
          </g>

          {/* Node 4: AI & DISCOVERY (Bottom-Left) */}
          <g>
            <circle cx="160" cy="360" r="6" fill={nodeFill} stroke={nodeBorder} strokeWidth="1.5" />
            <circle cx="160" cy="360" r="2" fill={isDark ? "#61c5ad" : "#0d9488"} />
            <text
              x="160"
              y="380"
              textAnchor="middle"
              fill={textMuted}
              fontSize="9"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.12em"
              fontWeight="600"
            >
              04 // DISCOVERY
            </text>
          </g>

          {/* Node 5: INTERFACE (Mid-Left) */}
          <g>
            <circle cx="110" cy="230" r="5" fill={nodeFill} stroke={nodeBorder} strokeWidth="1.25" />
            <circle cx="110" cy="230" r="2" fill={isDark ? "#426fba" : "#2563eb"} />
          </g>

          {/* ── 4. CENTRAL KNOWLEDGE NUCLEUS ── */}
          {/* Subtle Halo */}
          <circle cx="250" cy="250" r="38" fill="url(#nucleusGlow)" />
          {/* Outer Nucleus Ring */}
          <circle
            cx="250"
            cy="250"
            r="26"
            fill={nodeFill}
            stroke={isDark ? "rgba(97, 197, 173, 0.6)" : "rgba(13, 148, 136, 0.6)"}
            strokeWidth="1.5"
            className="shadow-sm"
          />
          {/* Inner Ring */}
          <circle
            cx="250"
            cy="250"
            r="19"
            fill={isDark ? "#1a1a20" : "#f1f5f9"}
            stroke={strokeBase}
            strokeWidth="1"
          />

          {/* Subtle Core Monogram 'R' */}
          <text
            x="250"
            y="256"
            textAnchor="middle"
            fill={isDark ? "#f8fafc" : "#0f172a"}
            fontSize="14"
            fontFamily="'Geist', sans-serif"
            fontWeight="800"
            letterSpacing="-0.02em"
          >
            R
          </text>

          {/* System Coordinates Micro-Badge */}
          <g transform="translate(250, 475)">
            <text
              x="0"
              y="0"
              textAnchor="middle"
              fill={textMuted}
              fontSize="8.5"
              fontFamily="'Geist Mono', monospace"
              letterSpacing="0.18em"
              fontWeight="600"
            >
              SYS // RVAN.ME · CONNECTED KNOWLEDGE
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
