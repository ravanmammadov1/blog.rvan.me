import { useTheme } from "../../context/ThemeContext";

/**
 * GalaxyAtmosphere
 * Large, visually prominent animated gradient atmosphere for the Rvan.me hero.
 *
 * Creates 4 large blurred gradient masses using ONLY brand colors:
 *   - Cyan/Teal: #61c5ad / rgba(97, 197, 173)
 *   - Blue:      #426fba / rgba(66, 111, 186) / #6099df / rgba(96, 153, 223)
 *   - Purple:    #984f9f / rgba(152, 79, 159) / #bc66c5 / rgba(188, 102, 197)
 *
 * The gradient is NOT subtle — it's a primary visual element of the hero.
 * GPU-accelerated (transform + opacity only). Respects prefers-reduced-motion.
 */
export default function GalaxyAtmosphere() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-40 overflow-hidden select-none transform-gpu"
      aria-hidden="true"
    >
      {/* Base Canvas — matches site background */}
      <div className="absolute inset-0 bg-background transition-colors duration-500" />

      {/* ── Gradient Mass 1: TEAL/CYAN — Top Right, very large ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-1"
        style={{
          top: "-18%",
          right: "-12%",
          width: "min(80vw, 1100px)",
          height: "min(80vw, 1100px)",
          background: isDark
            ? "radial-gradient(ellipse at 40% 50%, rgba(97, 197, 173, 0.50) 0%, rgba(97, 197, 173, 0.22) 35%, rgba(97, 197, 173, 0.06) 60%, transparent 80%)"
            : "radial-gradient(ellipse at 40% 50%, rgba(97, 197, 173, 0.40) 0%, rgba(97, 197, 173, 0.18) 35%, rgba(97, 197, 173, 0.05) 60%, transparent 80%)",
          filter: "blur(50px)",
        }}
      />

      {/* ── Gradient Mass 2: BLUE — Center-Left, very large ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-2"
        style={{
          top: "10%",
          left: "-15%",
          width: "min(75vw, 1000px)",
          height: "min(75vw, 1000px)",
          background: isDark
            ? "radial-gradient(ellipse at 55% 45%, rgba(96, 153, 223, 0.45) 0%, rgba(66, 111, 186, 0.20) 40%, rgba(66, 111, 186, 0.06) 65%, transparent 82%)"
            : "radial-gradient(ellipse at 55% 45%, rgba(96, 153, 223, 0.35) 0%, rgba(66, 111, 186, 0.15) 40%, rgba(66, 111, 186, 0.04) 65%, transparent 82%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Gradient Mass 3: PURPLE/VIOLET — Bottom-Center-Right, large ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-3"
        style={{
          bottom: "-10%",
          right: "0%",
          width: "min(70vw, 950px)",
          height: "min(70vw, 950px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, rgba(188, 102, 197, 0.42) 0%, rgba(152, 79, 159, 0.18) 40%, rgba(152, 79, 159, 0.05) 65%, transparent 80%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(188, 102, 197, 0.32) 0%, rgba(152, 79, 159, 0.14) 40%, rgba(152, 79, 159, 0.04) 65%, transparent 80%)",
          filter: "blur(55px)",
        }}
      />

      {/* ── Gradient Mass 4: Connecting TEAL-BLUE — Upper Center, medium ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-4"
        style={{
          top: "5%",
          left: "20%",
          width: "min(55vw, 750px)",
          height: "min(55vw, 750px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, rgba(97, 197, 173, 0.28) 0%, rgba(96, 153, 223, 0.18) 45%, transparent 75%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(97, 197, 173, 0.22) 0%, rgba(96, 153, 223, 0.12) 45%, transparent 75%)",
          filter: "blur(70px)",
        }}
      />

      {/* ── Gradient Mass 5: Deep PURPLE — Lower-Left, connecting ── */}
      <div
        className="absolute rounded-full animate-gradient-drift-1"
        style={{
          bottom: "5%",
          left: "-5%",
          width: "min(50vw, 650px)",
          height: "min(50vw, 650px)",
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.30) 0%, rgba(66, 111, 186, 0.12) 50%, transparent 78%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(152, 79, 159, 0.22) 0%, rgba(66, 111, 186, 0.08) 50%, transparent 78%)",
          filter: "blur(65px)",
          animationDelay: "-12s",
        }}
      />
    </div>
  );
}
