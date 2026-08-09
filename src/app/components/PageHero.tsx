import React from "react";
import { motion } from "framer-motion";

export type GradientVariant = "primary" | "secondary" | "accent" | "creative";

export interface PageHeroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accentText?: React.ReactNode;
  description?: React.ReactNode;
  gradientVariant?: GradientVariant;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Centralized Brand Gradient Tokens for Rvan.me
 * Maintains strict saturation, brightness, and color language across all main page titles.
 */
export const BRAND_GRADIENTS: Record<GradientVariant, string> = {
  // Primary: Cyan -> Sky -> Blue (Used for Tools, Main Features)
  primary: "from-cyan-400 via-sky-400 to-blue-500",

  // Secondary: Electric Blue -> Indigo -> Violet (Used for Blog, Editorial)
  secondary: "from-blue-400 via-indigo-400 to-violet-500",

  // Accent: Mint/Emerald -> Cyan -> Blue (Used for News, Platform Mission)
  accent: "from-emerald-400 via-cyan-400 to-blue-500",

  // Creative: Sky -> Blue -> Violet (Used for Resources, Work Portfolio)
  creative: "from-sky-400 via-blue-500 to-violet-500",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Unified PageHero Component for Rvan.me
 * Enforces standardized typography scale, letter-spacing, line-height, and brand gradients.
 */
export function PageHero({
  eyebrow,
  title,
  accentText,
  description,
  gradientVariant = "primary",
  className = "",
  children,
}: PageHeroProps) {
  const gradientClass = BRAND_GRADIENTS[gradientVariant] || BRAND_GRADIENTS.primary;

  return (
    <section className={`px-6 pt-24 pb-8 md:px-10 md:pt-32 relative z-10 ${className}`}>
      <div className="mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-5xl"
        >
          {/* Eyebrow Label */}
          {eyebrow && (
            <div className="mb-4">
              {typeof eyebrow === "string" ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold tracking-widest text-primary mono uppercase">
                  {eyebrow}
                </span>
              ) : (
                eyebrow
              )}
            </div>
          )}

          {/* Unified Page Title */}
          <h1 className="text-4xl font-semibold tracking-[-.06em] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-foreground">
            {title}{" "}
            {accentText && (
              <>
                <br />
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientClass}`}>
                  {accentText}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Description */}
          {description && (
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed font-medium">
              {description}
            </p>
          )}

          {/* Optional Action Buttons or Children */}
          {children && <div className="mt-8">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export default PageHero;
