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
      "group inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-[.14em] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer select-none mono whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.985]";

    // Size Variant Classes
    const sizeClasses = {
      sm: "px-3.5 py-2 text-[11px]",
      md: "px-5 py-2.5 text-xs",
      lg: "px-6 py-3.5 text-xs",
    }[size];

    // Variant Style Logic
    let variantClasses = "";
    let inlineStyle: React.CSSProperties = { ...style };

    if (variant === "primary") {
      variantClasses =
        "text-white shadow-md shadow-black/10 dark:shadow-black/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#61c5ad]/20 bg-[length:200%_200%] bg-left hover:bg-right transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] relative overflow-hidden";
      inlineStyle.backgroundImage = "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)";
    } else if (variant === "secondary") {
      variantClasses =
        "border border-[#DDE1E0] dark:border-white/10 bg-white/95 dark:bg-white/[0.04] text-foreground hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";
    } else if (variant === "outline") {
      variantClasses =
        "border border-[#DDE1E0] dark:border-white/15 bg-transparent text-foreground hover:border-primary/80 hover:text-primary hover:bg-primary/5 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";
    } else if (variant === "filter") {
      if (active) {
        variantClasses =
          "text-white font-bold border border-transparent shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";
        inlineStyle.backgroundImage = "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)";
      } else {
        variantClasses =
          "border border-[#DDE1E0] dark:border-white/10 bg-white/80 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/[0.08] hover:border-primary/30 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";
      }
    } else if (variant === "ghost") {
      variantClasses =
        "border border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]";
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
