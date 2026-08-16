import React, { useRef } from "react";
import { useResumeEditor } from "../context/ResumeEditorContext";
import { Camera, Trash2, User } from "lucide-react";

interface CanvasPhotoProps {
  className?: string;
  size?: number;
  shape?: "circle" | "rounded" | "square";
}

export const CanvasPhoto: React.FC<CanvasPhotoProps> = ({
  className = "",
  size = 110,
  shape = "circle",
}) => {
  const { data, updatePhoto, removePhoto, selectedElement, selectElement } = useResumeEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSelected = selectedElement?.id === "profile-photo";

  const { photoUrl, fullName, showPhoto } = data.personalInfo;
  if (!showPhoto) return null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        updatePhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const getShapeClass = () => {
    switch (shape) {
      case "rounded":
        return "rounded-2xl";
      case "square":
        return "rounded-md";
      case "circle":
      default:
        return "rounded-full";
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        selectElement({
          id: "profile-photo",
          type: "photo",
        });
      }}
      className={`relative group inline-block cursor-pointer transition-all ${className}`}
    >
      {/* Photo Container */}
      <div
        className={`relative overflow-hidden border-2 border-white/40 shadow-lg bg-neutral-800 ${getShapeClass()} ${
          isSelected ? "ring-2 ring-primary ring-offset-2 scale-[1.02]" : "hover:ring-2 hover:ring-primary/60"
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {photoUrl ? (
          <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <User size={size * 0.45} />
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white print:hidden">
          <Camera size={20} />
        </div>
      </div>

      {/* Small Contextual Floating Toolbar on Click / Selection */}
      {isSelected && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900 border border-white/20 p-1 rounded-xl shadow-2xl z-40 text-xs font-mono text-white print:hidden whitespace-nowrap animate-in fade-in zoom-in-95">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-black font-bold hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Camera size={11} /> Replace
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removePhoto();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
          >
            <Trash2 size={11} /> Remove
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};
