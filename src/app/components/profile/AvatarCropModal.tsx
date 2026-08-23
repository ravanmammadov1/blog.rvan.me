import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Loader2, Crop, AlertCircle } from "lucide-react";
import { useLanguage } from "../../../lib/i18n/LanguageContext";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onSave: (croppedDataUrl: string, croppedBlob: Blob) => Promise<void>;
  isUploading?: boolean;
}

export default function AvatarCropModal({
  isOpen,
  onClose,
  imageSrc,
  onSave,
  isUploading = false,
}: AvatarCropModalProps) {
  const { language } = useLanguage();
  const isAz = language === "az";

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when opening new image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setError(null);
      setImageLoaded(false);
    }
  }, [isOpen, imageSrc]);

  // Mouse & Touch drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleConfirmCrop = async () => {
    if (!imageRef.current || !containerRef.current) return;
    setError(null);

    try {
      const img = imageRef.current;
      const container = containerRef.current;

      const outputSize = 400; // 400x400 px crisp avatar
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not initialize 2D canvas context.");
      }

      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Ratio between container size and rendered image size
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      // Calculate crop rectangle in original image coordinates
      const cropX = (containerRect.left - imgRect.left) * scaleX;
      const cropY = (containerRect.top - imgRect.top) * scaleY;
      const cropWidth = containerRect.width * scaleX;
      const cropHeight = containerRect.height * scaleY;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputSize,
        outputSize
      );

      // Generate compact Data URL and Blob
      const croppedDataUrl = canvas.toDataURL("image/webp", 0.9);

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            // Fallback blob creation from dataUrl
            const res = await fetch(croppedDataUrl);
            const fallbackBlob = await res.blob();
            await onSave(croppedDataUrl, fallbackBlob);
          } else {
            await onSave(croppedDataUrl, blob);
          }
        },
        "image/webp",
        0.9
      );
    } catch (err: any) {
      console.error("Cropping error:", err);
      setError(isAz ? "Şəkli kəsmək mümkün olmadı. Yenidən cəhd edin." : "Couldn't crop image. Please try again.");
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={!isUploading ? onClose : undefined}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 sm:p-7 text-foreground z-10 my-8 overflow-hidden space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                <Crop size={16} />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {isAz ? "Profil Şəklini Tənzimləyin" : "Crop Profile Photo"}
                </h3>
                <p className="text-[11px] text-muted-foreground mono">
                  {isAz ? "1:1 Dairəvi Kəsim" : "1:1 Square & Circular Mask"}
                </p>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={onClose}
                className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Interactive Crop Viewport */}
          <div className="flex flex-col items-center gap-4">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl border-2 border-primary/50 bg-black/40 overflow-hidden cursor-move flex items-center justify-center select-none shadow-inner"
            >
              {/* Circular Mask Overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] z-10" />

              {/* Grid Lines */}
              <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Rendered Source Image with Drag & Zoom transform */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                onLoad={() => setImageLoaded(true)}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                  maxWidth: "none",
                  maxHeight: "none",
                }}
                className="max-w-none max-h-none pointer-events-none select-none"
              />
            </div>

            <span className="text-[11px] text-muted-foreground mono text-center">
              {isAz
                ? "Şəkli mərkəzləşdirmək üçün sürüşdürün və ölçüsünü dəyişin"
                : "Drag image to position and use slider to zoom"}
            </span>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-2xl border border-border bg-surface/60 space-y-3">
            {/* Zoom Slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(1, +(prev - 0.2).toFixed(1)))}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>

              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-primary cursor-pointer h-1.5 rounded-lg bg-muted"
              />

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, +(prev + 0.2).toFixed(1)))}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground cursor-pointer ml-1"
                title="Reset Position"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button
              type="button"
              disabled={isUploading}
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold uppercase mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isAz ? "LƏĞV ET" : "CANCEL"}
            </button>

            <button
              type="button"
              disabled={isUploading || !imageLoaded}
              onClick={handleConfirmCrop}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase mono tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20"
            >
              {isUploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>{isAz ? "YÜKLƏNİR..." : "UPLOADING..."}</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>{isAz ? "ŞƏKLİ YADDA SAXLA" : "SAVE PHOTO"}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
