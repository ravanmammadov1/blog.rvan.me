import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Check, Image as ImageIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load and reset image when opened
  useEffect(() => {
    if (imageSrc && isOpen) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageRef.current = img;
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        drawCanvas();
      };
      img.src = imageSrc;
    }
  }, [imageSrc, isOpen]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 400;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // Center point
    ctx.translate(size / 2 + pan.x, size / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw scaled image centered
    const aspect = img.width / img.height;
    let drawWidth = size;
    let drawHeight = size;

    if (aspect > 1) {
      drawWidth = size * aspect;
      drawHeight = size;
    } else {
      drawWidth = size;
      drawHeight = size / aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }, [zoom, rotation, pan]);

  useEffect(() => {
    if (isOpen) {
      drawCanvas();
    }
  }, [isOpen, drawCanvas]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSaveCrop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Export a compressed, high-quality WebP image (400x400) < 50KB
    const croppedDataUrl = canvas.toDataURL("image/webp", 0.9);
    onCropComplete(croppedDataUrl);
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-neutral-900/95 p-6 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ImageIcon size={18} className="text-primary" />
            <h3 className="text-base font-bold text-foreground">
              {isAz ? "Profil Şəklini Kəs və Tənzimlə" : "Crop & Adjust Profile Photo"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Canvas Crop Area */}
        <div className="my-6 flex flex-col items-center">
          <div
            className="relative h-64 w-64 overflow-hidden rounded-full border-2 border-primary shadow-[0_0_30px_rgba(97,197,173,0.2)] cursor-move bg-black select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas ref={canvasRef} className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-[11px] font-mono text-muted-foreground">
            {isAz ? "Şəkli yerləşdirmək üçün sürüşdürün" : "Drag to reposition within circle"}
          </p>
        </div>

        {/* Controls: Zoom & Rotate */}
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <ZoomOut size={14} className="text-muted-foreground" />
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-primary h-1.5 bg-white/20 rounded-lg cursor-pointer"
            />
            <ZoomIn size={14} className="text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground w-10 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCw size={13} />
              <span>{isAz ? "90° Döndər" : "Rotate 90°"}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <Button onClick={onClose} variant="ghost" size="sm">
            {isAz ? "Ləğv et" : "Cancel"}
          </Button>
          <Button
            onClick={handleSaveCrop}
            variant="primary"
            size="sm"
            icon={<Check size={14} />}
            iconPosition="left"
          >
            {isAz ? "Təsdiqlə və Saxla" : "Apply & Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
