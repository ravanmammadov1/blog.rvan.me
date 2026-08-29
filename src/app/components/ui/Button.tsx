import React from "react";
import { Link } from "react-router-dom";

export type ButtonVariant = "primary" | "secondary" | "outline" | "filter" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  to?: string;
  href?: string;
  external?: boolean;
  download?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      active = false,
      to,
      href,
      external = false,
      download,
      icon,
      iconPosition = "right",
      children,
      className = "",
      style,
      type = "button",
      ...props
    },
    ref
  ) => {
    // Base Design System Classes matching clean editorial hierarchy with polished micro-interactions
    const baseClasses =
      "group inline-flex items-center justify-center gap-2 rounded-full font-bold uppercase tracking-[.12em] transition-all duration-200 cursor-pointer select-none mono whitespace-nowrap focus-visible:outline-none active:scale-[0.985]";

    // Size Variant Classes
    const sizeClasses = {
      sm: "px-3.5 py-1.5 text-[10.5px]",
      md: "px-4.5 py-2 text-xs",
      lg: "px-6 py-2.5 text-xs",
    }[size];

    // Variant Style Logic
    let variantClasses = "";
    let inlineStyle: React.CSSProperties = { ...style };

    if (variant === "primary") {
      variantClasses =
        "text-white shadow-[0_4px_16px_rgba(97,197,173,0.25)] hover:opacity-95 active:scale-95 transition-all bg-[length:200%_200%] bg-left hover:bg-right relative overflow-hidden";
      inlineStyle.backgroundImage = "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)";
    } else if (variant === "secondary") {
      variantClasses =
        "border border-black/[0.08] dark:border-white/[0.12] bg-white/60 dark:bg-white/[0.05] backdrop-blur-xl text-foreground hover:bg-white/80 dark:hover:bg-white/[0.10] hover:border-black/15 dark:hover:border-white/20 shadow-2xs transition-all";
    } else if (variant === "outline") {
      variantClasses =
        "border border-black/[0.10] dark:border-white/15 bg-transparent text-foreground hover:border-primary/60 hover:text-primary transition-all";
    } else if (variant === "filter") {
      if (active) {
        variantClasses =
          "text-foreground dark:text-white font-bold bg-[#61c5ad]/15 dark:bg-white/[0.08] border border-[#61c5ad]/50 dark:border-[#61c5ad]/40 shadow-xs backdrop-blur-xl transition-all";
      } else {
        variantClasses =
          "border border-black/[0.08] dark:border-white/[0.10] bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-muted-foreground hover:text-foreground hover:bg-white/80 dark:hover:bg-white/[0.06] hover:border-primary/30 transition-all";
      }
    } else if (variant === "ghost") {
      variantClasses =
        "border border-transparent text-muted-foreground hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all";
    }

    const combinedClassName = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

    const content = (
      <>
        {icon && iconPosition === "left" && (
          <span className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-x-0.5">
            {icon}
          </span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === "right" && (
          <span className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-0.5">
            {icon}
          </span>
        )}
      </>
    );

    if (to) {
      return (
        <Link to={to} className={combinedClassName} style={inlineStyle}>
          {content}
        </Link>
      );
    }

    if (href) {
      return (
        <a
          href={href}
          download={download}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={combinedClassName}
          style={inlineStyle}
        >
          {content}
        </a>
      );
    }

    return (
      <button ref={ref as any} type={type} className={combinedClassName} style={inlineStyle} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
