import React, { useRef, useEffect, useState } from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";

interface CanvasTextProps {
  id: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div" | "li";
  multiline?: boolean;
}

export const CanvasText: React.FC<CanvasTextProps> = ({
  id,
  value,
  onChange,
  placeholder = "Type here...",
  className = "",
  style = {},
  tag = "span",
  multiline = false,
}) => {
  const { selectedElement, selectElement, editingId, setEditingId } = useResumeEditor();
  const elementRef = useRef<HTMLElement>(null);
  const isSelected = selectedElement?.id === id;
  const isEditing = editingId === id;

  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
    if (elementRef.current && elementRef.current.innerText !== value) {
      elementRef.current.innerText = value || "";
    }
  }, [value]);

  const handleSingleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditing && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      selectElement({
        id,
        type: "text",
        rect,
        value: localVal,
      });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    if (elementRef.current) {
      elementRef.current.focus();
      // Select all or place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(elementRef.current);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleBlur = () => {
    if (elementRef.current) {
      const text = elementRef.current.innerText.trim();
      if (text !== value) {
        onChange(text);
        setLocalVal(text);
      }
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline && tag !== "p" && tag !== "div") {
      e.preventDefault();
      elementRef.current?.blur();
    } else if (e.key === "Escape") {
      elementRef.current?.blur();
      setEditingId(null);
      selectElement(null);
    }
  };

  const Tag = tag as any;

  return (
    <Tag
      ref={elementRef}
      contentEditable={isEditing}
      suppressContentEditableWarning
      onClick={handleSingleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`relative transition-all duration-150 rounded outline-none cursor-pointer select-text ${
        isEditing
          ? "bg-sky-500/10 ring-2 ring-primary ring-offset-1 cursor-text shadow-sm"
          : isSelected
          ? "ring-2 ring-primary ring-offset-1 bg-primary/5"
          : "hover:outline hover:outline-1 hover:outline-dashed hover:outline-primary/50"
      } empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-400 empty:before:italic print:ring-0 print:outline-none print:hover:outline-none ${className}`}
      style={style}
      data-placeholder={placeholder}
      data-canvas-id={id}
    >
      {value}
    </Tag>
  );
};
