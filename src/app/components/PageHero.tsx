import React from "react";
import { motion } from "framer-motion";
import { Eyebrow } from "./Eyebrow";

export type GradientVariant = "primary" | "secondary" | "accent" | "creative" | "master";

export interface PageHeroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accentText?: React.ReactNode;
  description?: React.ReactNode;
  gradientVariant?: GradientVariant;
  align?: "center" | "left";
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  children?: React.ReactNode;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Unified Editorial PageHero for Rvan.me
 * Enforces standardized typography scale, brand gradient, and centered container alignment.
 */
export function PageHero({
  eyebrow,
  title,
  accentText,
  description,
  align = "center",
  className = "",
  contentClassName = "",
  titleClassName = "",
  children,
}: PageHeroProps) {
  const isCentered = align === "center";

  return (
    <section
      className={`relative pt-12 pb-8 md:pt-16 md:pb-12 px-4 sm:px-6 md:px-8 z-10 ${
        isCentered ? "text-center" : "text-left"
      } ${className}`}
    >
      <div className="mx-auto max-w-[1280px] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className={`w-full ${isCentered ? "max-w-4xl mx-auto flex flex-col items-center" : "max-w-4xl"} ${contentClassName}`}
        >
          {/* Eyebrow Label */}
          {eyebrow && (
            <div className="mb-3.5">
              {typeof eyebrow === "string" ? (
                <Eyebrow className="text-primary tracking-[.24em] font-semibold text-xs sm:text-[13px]">
                  {eyebrow}
                </Eyebrow>
              ) : (
                eyebrow
              )}
            </div>
          )}

          {/* Unified Page Title with Brand Gradient */}
          <h1
            className={`font-extrabold tracking-tight leading-[1.08] text-foreground w-full mb-3 ${titleClassName}`}
            style={{ fontSize: "clamp(2rem, 4.4vw, 3.8rem)" }}
          >
            {title}{" "}
            {accentText && (
              <>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-[#61c5ad] via-[#426fba] to-[#984f9f] dark:from-[#61c5ad] dark:via-[#6099df] dark:to-[#bc66c5] bg-clip-text text-transparent inline-block">
                  {accentText}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Description */}
          {description && (
            <div className={`text-base sm:text-lg text-muted-foreground leading-relaxed font-normal ${isCentered ? "max-w-2xl mx-auto" : "max-w-2xl"}`}>
              {description}
            </div>
          )}

          {/* Optional Action Buttons, Search Bar, or Filters */}
          {children && <div className="mt-6 w-full">{children}</div>}
        </motion.div>
      </div>
    </section>
  );
}

export default PageHero;
