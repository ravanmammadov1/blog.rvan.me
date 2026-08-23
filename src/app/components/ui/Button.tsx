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
    // Base Design System Classes matching HOME page reference
    const baseClasses =
      "group inline-flex items-center justify-center gap-2.5 rounded-full font-bold uppercase tracking-[.18em] transition-all duration-300 cursor-pointer select-none mono whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

    // Size Variant Classes
    const sizeClasses = {
      sm: "px-4 py-2 text-[10.5px]",
      md: "px-6 py-3.5 text-xs",
      lg: "px-8 py-4 text-xs",
    }[size];

    // Variant Style Logic
    let variantClasses = "";
    let inlineStyle: React.CSSProperties = { ...style };

    if (variant === "primary") {
      variantClasses =
        "text-white hover:scale-[1.03]";
      inlineStyle.background = "linear-gradient(135deg, #61c5ad 0%, #426fba 48%, #984f9f 100%)";
    } else if (variant === "secondary") {
      variantClasses =
        "border border-white/15 bg-white/5 text-foreground hover:border-[#61c5ad]/50 hover:bg-white/10 glass";
    } else if (variant === "outline") {
      variantClasses =
        "border border-[#61c5ad]/40 text-[#61c5ad] hover:text-white hover:border-transparent glass-sm";
      inlineStyle.background =
        "linear-gradient(135deg, rgba(97,197,173,0.12) 0%, rgba(66,111,186,0.12) 50%, rgba(152,79,159,0.12) 100%)";
    } else if (variant === "filter") {
      if (active) {
        variantClasses =
          "text-white font-extrabold border border-transparent";
        inlineStyle.background =
          "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)";
      } else {
        variantClasses =
          "border border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:border-[#61c5ad]/50 hover:bg-white/10 glass-sm";
      }
    } else if (variant === "ghost") {
      variantClasses =
        "border border-transparent text-primary hover:text-white hover:bg-white/5";
    }

    const combinedClassName = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

    const content = (
      <>
        {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
        {icon && iconPosition === "right" && (
          <span className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
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
