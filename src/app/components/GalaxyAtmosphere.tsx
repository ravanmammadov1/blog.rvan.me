import { useTheme } from "../../context/ThemeContext";

/**
 * GalaxyAtmosphere
 * Living animated gradient atmosphere for the Rvan.me brand.
 *
 * Uses 3 large blurred gradient masses slowly drifting via CSS keyframe animations.
 * GPU-accelerated (transform + opacity only). No canvas, no JS animation loop.
 * Respects prefers-reduced-motion (pauses all animation).
 *
 * Light Mode: Soft teal/blue/violet haze over warm-neutral #F5F6F5 canvas.
 * Dark Mode: Deeper, richer teal/blue/violet atmospheric glow over near-black canvas.
 */
export default function GalaxyAtmosphere() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-40 overflow-hidden select-none transform-gpu"
      aria-hidden="true"
    >
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* ── Animated Gradient Mass 1: Teal/Cyan — Top Right ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-1"
        style={{
          top: "-12%",
          right: "-8%",
          width: "min(65vw, 900px)",
          height: "min(65vw, 900px)",
          background: isDark
            ? "radial-gradient(ellipse at 45% 50%, rgba(97, 197, 173, 0.28) 0%, rgba(97, 197, 173, 0.10) 40%, transparent 70%)"
            : "radial-gradient(ellipse at 45% 50%, rgba(97, 197, 173, 0.22) 0%, rgba(97, 197, 173, 0.08) 40%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Animated Gradient Mass 2: Blue — Center Left ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-2"
        style={{
          top: "25%",
          left: "-10%",
          width: "min(55vw, 780px)",
          height: "min(55vw, 780px)",
          background: isDark
            ? "radial-gradient(ellipse at 55% 45%, rgba(66, 111, 186, 0.26) 0%, rgba(66, 111, 186, 0.10) 45%, transparent 72%)"
            : "radial-gradient(ellipse at 55% 45%, rgba(66, 111, 186, 0.20) 0%, rgba(66, 111, 186, 0.07) 45%, transparent 72%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Animated Gradient Mass 3: Purple/Violet — Bottom Right ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-3"
        style={{
          bottom: "-5%",
          right: "5%",
          width: "min(50vw, 700px)",
          height: "min(50vw, 700px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.24) 0%, rgba(152, 79, 159, 0.08) 45%, transparent 70%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.18) 0%, rgba(152, 79, 159, 0.06) 45%, transparent 70%)",
          filter: "blur(75px)",
        }}
      />

      {/* ── Animated Gradient Mass 4: Mixed Accent — Upper Center (softer, connecting) ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-4"
        style={{
          top: "8%",
          left: "25%",
          width: "min(40vw, 550px)",
          height: "min(40vw, 550px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, rgba(96, 153, 223, 0.18) 0%, rgba(97, 197, 173, 0.08) 50%, transparent 75%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(96, 153, 223, 0.14) 0%, rgba(97, 197, 173, 0.06) 50%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />
    </div>
  );
}
