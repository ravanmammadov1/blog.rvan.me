import React, { useState } from 'react'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const { src, fallbackSrc, alt, style, className, onError, ...rest } = props
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src)
  const [hasFailed, setHasFailed] = useState(false)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasFailed && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasFailed(true)
    } else {
      setHasFailed(true)
    }
    if (onError) onError(e)
  }

  const activeSrc = hasFailed && fallbackSrc ? fallbackSrc : (currentSrc || src || fallbackSrc);

  return (
    <img
      src={activeSrc}
      alt={alt || "Project image"}
      className={className}
      style={style}
      loading={props.loading || "lazy"}
      decoding="async"
      {...rest}
      onError={handleError}
    />
  )
}
