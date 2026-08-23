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
    // Base Design System Classes matching clean editorial hierarchy
    const baseClasses =
      "group inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-[.14em] transition-all duration-200 cursor-pointer select-none mono whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
      variantClasses = "text-white shadow-sm hover:opacity-95 hover:shadow-md";
      inlineStyle.background = "linear-gradient(135deg, #61c5ad 0%, #426fba 48%, #984f9f 100%)";
    } else if (variant === "secondary") {
      variantClasses = "border border-border bg-card text-foreground hover:bg-muted hover:border-foreground/30";
    } else if (variant === "outline") {
      variantClasses = "border border-border bg-transparent text-foreground hover:border-primary hover:text-primary";
    } else if (variant === "filter") {
      if (active) {
        variantClasses = "text-white font-bold border border-transparent shadow-sm";
        inlineStyle.background = "linear-gradient(135deg, #61c5ad 0%, #426fba 50%, #984f9f 100%)";
      } else {
        variantClasses = "border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40";
      }
    } else if (variant === "ghost") {
      variantClasses = "border border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50";
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
