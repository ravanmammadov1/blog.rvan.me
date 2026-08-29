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
      variantClasses = "text-white liquid-glass-btn-primary";
    } else if (variant === "secondary") {
      variantClasses = "liquid-glass-btn text-foreground";
    } else if (variant === "outline") {
      variantClasses =
        "border border-black/[0.10] dark:border-white/15 bg-transparent text-foreground hover:border-primary/60 hover:text-primary transition-all";
    } else if (variant === "filter") {
      if (active) {
        variantClasses = "liquid-glass-pill liquid-glass-pill-active font-bold";
      } else {
        variantClasses = "liquid-glass-pill text-muted-foreground hover:text-foreground";
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
