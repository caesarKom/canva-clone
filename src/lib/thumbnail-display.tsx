'use client'

import Image from "next/image"

interface ThumbnailDisplayProps {
  src: string
  alt: string
  className?: string
  width?: number;
  height?: number;
}

export function ThumbnailDisplay({ src, alt, width, height, className = '' }: ThumbnailDisplayProps) {
  if (src === "") return;
  
  // ✅ if is base64, use img
  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
      />
    )
  }

  // For normal URL use Next.js Image
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}
