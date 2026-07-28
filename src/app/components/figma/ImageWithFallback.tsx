import React, { useState } from 'react';
import { getOptimizedImageUrl } from "../../../lib/sanityClient";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  width?: number;
  height?: number;
  fit?: "crop" | "fill" | "max" | "min";
  format?: "webp" | "avif" | "auto";
  quality?: number;
  priority?: boolean;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { 
    src, 
    fallbackSrc, 
    alt, 
    style, 
    className, 
    onError, 
    width = 800,
    height,
    fit = "crop",
    format = "auto",
    quality = 85,
    priority = false,
    ...rest 
  } = props;
  
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate optimized URL if src is a Sanity image object
  const optimizedSrc = typeof src === "object" && src !== null 
    ? getOptimizedImageUrl(src, width, height, { fit, format, quality })
    : src;

  const optimizedFallback = typeof fallbackSrc === "object" && fallbackSrc !== null
    ? getOptimizedImageUrl(fallbackSrc, width, height, { fit, format, quality })
    : fallbackSrc;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasFailed && optimizedFallback && currentSrc !== optimizedFallback) {
      setCurrentSrc(optimizedFallback);
      setHasFailed(true);
    } else {
      setHasFailed(true);
    }
    if (onError) onError(e);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const activeSrc = hasFailed && optimizedFallback ? optimizedFallback : (currentSrc || optimizedSrc || optimizedFallback);

  return (
    <img
      src={activeSrc}
      alt={alt || "Project image"}
      className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className || ""}`}
      style={style}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding={priority ? "sync" : "async"}
      width={width}
      height={height || Math.round(width * 0.625)}
      {...rest}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
