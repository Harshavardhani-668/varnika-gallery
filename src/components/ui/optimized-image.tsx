import { ImgHTMLAttributes, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  skeletonClassName?: string;
  optimizeWidth?: number;
  optimizeHeight?: number;
  quality?: number;
  eager?: boolean;
}

function optimizeImageUrl(
  src: string | undefined,
  optimizeWidth?: number,
  optimizeHeight?: number,
  quality: number = 72
) {
  if (!src) return src;

  if (!src.includes("images.unsplash.com")) {
    return src;
  }

  try {
    const url = new URL(src);
    if (!url.searchParams.has("auto")) url.searchParams.set("auto", "format");
    if (!url.searchParams.has("q")) url.searchParams.set("q", String(quality));
    if (!url.searchParams.has("fm")) url.searchParams.set("fm", "webp");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "crop");
    if (optimizeWidth && !url.searchParams.has("w")) {
      url.searchParams.set("w", String(optimizeWidth));
    }
    if (optimizeHeight && !url.searchParams.has("h")) {
      url.searchParams.set("h", String(optimizeHeight));
    }
    return url.toString();
  } catch {
    return src;
  }
}

const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  optimizeWidth,
  optimizeHeight,
  quality = 72,
  eager = false,
  onLoad,
  onError,
  ...rest
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = useMemo(
    () => optimizeImageUrl(src, optimizeWidth, optimizeHeight, quality),
    [src, optimizeWidth, optimizeHeight, quality]
  );

  return (
    <div className={cn("relative", containerClassName)}>
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 animate-pulse rounded-inherit bg-muted/70",
            skeletonClassName
          )}
        />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "low"}
        decoding="async"
        className={cn(
          "transition-opacity duration-300",
          isLoaded || hasError ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setHasError(true);
          onError?.(event);
        }}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;