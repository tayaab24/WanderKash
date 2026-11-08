"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  preload?: boolean;
  sizes?: string;
  label?: string;
};

export default function SafeImage({
  src,
  alt,
  className = "",
  preload,
  sizes = "100vw",
  label,
}: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-surface-hover to-bg ${className}`}
      >
        {label && <span className="font-serif text-2xl text-muted">{label}</span>}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      preload={preload}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}