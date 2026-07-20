"use client";

import Image from "next/image";
import { useState } from "react";
import type { FileDto } from "@/types";

const DEFAULT_FALLBACK = "/images/placeholder.svg";

/** Backend `FileDto`, or a plain URL string for features still on mock data. */
export type AppImageSource = FileDto | string | null | undefined;

type AppImageBaseProps = {
  image: AppImageSource;
  alt: string;
  /** Prefer `thumbnailUrl` when available — use in lists/grids for smaller payloads. */
  preferThumbnail?: boolean;
  fallbackSrc?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
};

type AppImageFillProps = AppImageBaseProps & {
  fill: true;
  width?: never;
  height?: never;
};

type AppImageFixedProps = AppImageBaseProps & {
  fill?: false;
  width: number;
  height: number;
};

export type AppImageProps = AppImageFillProps | AppImageFixedProps;

function resolveSrc(image: AppImageSource, preferThumbnail: boolean): string | null {
  if (!image) return null;
  if (typeof image === "string") return image || null;
  return (preferThumbnail ? image.thumbnailUrl : null) || image.url || null;
}

function resolveAlt(image: AppImageSource, fallbackAlt: string): string {
  if (image && typeof image === "object" && image.alt) return image.alt;
  return fallbackAlt;
}

/**
 * Single reusable entry point for rendering images across the app.
 * Consumes the backend `FileDto` contract directly (docs/FileModule_frontend_integration.md)
 * or a plain URL string for features not yet backed by the File module.
 * Handles lazy loading, a skeleton while loading, and a graceful fallback on
 * missing/broken images with accessible alt text.
 */
export function AppImage(props: AppImageProps) {
  const {
    image,
    alt,
    preferThumbnail = false,
    fallbackSrc = DEFAULT_FALLBACK,
    priority = false,
    sizes,
    className = "",
    imgClassName = "",
  } = props;

  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  const resolvedSrc = resolveSrc(image, preferThumbnail);
  const src = status === "error" || !resolvedSrc ? fallbackSrc : resolvedSrc;
  const resolvedAlt = resolveAlt(image, alt);
  const isLoading = status === "loading";

  const imgClasses = `object-cover transition-opacity duration-300 ${
    isLoading ? "opacity-0" : "opacity-100"
  } ${imgClassName}`;

  const handleLoad = () => setStatus("loaded");
  const handleError = () => setStatus("error");

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading ? (
        <div className="absolute inset-0 animate-pulse bg-border/50" aria-hidden />
      ) : null}
      {props.fill ? (
        <Image
          src={src}
          alt={resolvedAlt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={imgClasses}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          src={src}
          alt={resolvedAlt}
          width={props.width}
          height={props.height}
          sizes={sizes}
          priority={priority}
          className={imgClasses}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}
