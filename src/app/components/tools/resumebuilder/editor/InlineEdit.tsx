import React, { useRef, useEffect } from "react";

interface InlineEditProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  multiline?: boolean;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "li";
}

export const InlineEdit: React.FC<InlineEditProps> = ({
  value,
  onChange,
  placeholder = "Click to type...",
  className = "",
  style = {},
  tag = "span",
}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value || "";
    }
  }, [value]);

  const handleBlur = () => {
    if (elementRef.current) {
      const text = elementRef.current.innerText.trim();
      if (text !== value) {
        onChange(text);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tag !== "p" && tag !== "div" && tag !== "li") {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  const Tag = tag as any;

  return (
    <Tag
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`outline-none transition-colors hover:bg-black/5 focus:bg-white focus:ring-1 focus:ring-primary/50 rounded px-0.5 empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:italic cursor-text print:hover:bg-transparent print:focus:ring-0 ${className}`}
      style={style}
      data-placeholder={placeholder}
    >
      {value}
    </Tag>
  );
};
