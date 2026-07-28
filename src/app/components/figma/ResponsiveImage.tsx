import { useState, useEffect } from "react";
import { getOptimizedImageUrl, getResponsiveImageUrls } from "../../lib/sanityClient";

interface ResponsiveImageProps {
  source: any;
  alt: string;
  className?: string;
  widths?: number[];
  aspectRatio?: number;
  fit?: "crop" | "fill" | "max" | "min";
  sizes?: string;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

export function ResponsiveImage({
  source,
  alt,
  className = "",
  widths = [400, 800, 1200, 1600],
  aspectRatio = 16/10,
  fit = "crop",
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  placeholder = "empty",
  blurDataURL,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");

  const responsiveUrls = getResponsiveImageUrls(source, { widths, aspectRatio, fit });
  const fallbackUrl = getOptimizedImageUrl(source, widths[1], undefined, { fit, format: "webp" });

  useEffect(() => {
    if (priority && responsiveUrls) {
      // Preload the most likely needed size
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = responsiveUrls.fallback;
      link.type = "image/webp";
      document.head.appendChild(link);
      return () => document.head.removeChild(link);
    }
  }, [priority, responsiveUrls]);

  if (hasError || !responsiveUrls) {
    return (
      <div className={`relative overflow-hidden bg-surface ${className}`} role="img" aria-label={alt}>
        {placeholder === "blur" && blurDataURL && (
          <img
            src={blurDataURL}
            alt=""
            className="absolute inset-0 h-full w-full object-cover blur-lg scale-110"
            aria-hidden="true"
          />
        )}
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          {alt}
        </div>
      </div>
    );
  }

  return (
    <picture className={`relative block overflow-hidden ${className}`}>
      {/* AVIF source - best compression */}
      <source
        type="image/avif"
        srcSet={responsiveUrls.avif}
        sizes={sizes}
      />
      {/* WebP source - good compression, wide support */}
      <source
        type="image/webp"
        srcSet={responsiveUrls.webp}
        sizes={sizes}
      />
      {/* Fallback JPEG/PNG */}
      <img
        src={responsiveUrls.fallback}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        className={`transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => {
          setIsLoaded(true);
          setCurrentSrc(responsiveUrls.fallback);
        }}
        onError={() => setHasError(true)}
        width={widths[widths.length - 1]}
        height={Math.round(widths[widths.length - 1] / aspectRatio)}
      />
      {placeholder === "blur" && blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 h-full w-full object-cover blur-lg scale-110 transition-opacity duration-500"
          aria-hidden="true"
        />
      )}
    </picture>
  );
}

/**
 * Simplified image component for cases where you just need a single optimized URL
 */
interface OptimizedImageProps {
  source: any;
  alt: string;
  width: number;
  height?: number;
  className?: string;
  fit?: "crop" | "fill" | "max" | "min";
  format?: "webp" | "avif" | "auto";
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

export function OptimizedImage({
  source,
  alt,
  width,
  height,
  className = "",
  fit = "crop",
  format = "auto",
  quality = 85,
  priority = false,
  loading = "lazy",
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const src = getOptimizedImageUrl(source, width, height, { fit, format, quality });

  if (!src || hasError) {
    return (
      <div className={`relative bg-surface ${className}`} role="img" aria-label={alt}>
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          {alt}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height || Math.round(width * 0.625)}
      loading={loading}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
      onLoad={() => setIsLoaded(true)}
      onError={() => setHasError(true)}
    />
  );
}

/**
 * Blur placeholder generator - creates a tiny base64 data URL for LQIP
 */
export function generateBlurDataURL(source: any, width = 20): string | null {
  const url = getOptimizedImageUrl(source, width, undefined, { format: "webp", quality: 20 });
  if (!url) return null;
  // Return a data URL placeholder - in production, you'd generate this at build time
  return `data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA`;
}