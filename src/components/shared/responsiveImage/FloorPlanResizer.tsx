"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import Image from "next/image";

interface ImageDimensions {
  width: number;
  height: number;
}

interface ResponsiveDimensions {
  desktop: ImageDimensions;
  mobile: ImageDimensions;
}

interface ImagePosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

type RenderFunction = (props: {
  scaleFactorX: number;
  scaleFactorY: number;
}) => React.ReactNode;

interface ImageResizerProps {
  imageSrc: string;
  altText: string;
  originalDimensions: ResponsiveDimensions;
  maxDimensions: ResponsiveDimensions;
  isMobile: boolean;
  priority?: boolean;
  children?: ReactNode | RenderFunction;
  onImagePositionChange?: (position: ImagePosition) => void;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageResizer({
  imageSrc,
  altText,
  originalDimensions,
  maxDimensions,
  isMobile,
  priority = false,
  children,
  onImagePositionChange,
  onLoad,
  onError,
}: ImageResizerProps) {
  const [imagePosition, setImagePosition] = useState<ImagePosition>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const overlayContainerRef = useRef<HTMLDivElement>(null);

  const calculateOptimalDimensions = useCallback(() => {
    if (!containerRef.current || !imageContainerRef.current)
      return { width: 0, height: 0 };

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const maxWidth = isMobile
      ? maxDimensions.mobile.width
      : maxDimensions.desktop.width;
    const maxHeight = isMobile
      ? maxDimensions.mobile.height
      : maxDimensions.desktop.height;

    const aspectRatio = maxWidth / maxHeight;

    if (isMobile) {
      const width = containerWidth;
      const height = width / aspectRatio;
      return { width, height };
    }

    let width = containerWidth;
    let height = width / aspectRatio;

    if (height > containerHeight) {
      height = containerHeight;
      width = height * aspectRatio;
    }

    width = Math.min(width, maxWidth);
    height = Math.min(height, maxHeight);

    return { width, height };
  }, [isMobile, maxDimensions]);

  const updateImageMetrics = useCallback(() => {
    if (imageRef.current && containerRef.current && imageContainerRef.current) {
      const { width, height } = calculateOptimalDimensions();
      imageContainerRef.current.style.width = `${width}px`;
      imageContainerRef.current.style.height = `${height}px`;

      const rect = imageRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const top = rect.top - containerRect.top;
      const left = rect.left - containerRect.left;

      const newPosition = {
        top,
        left,
        width: rect.width,
        height: rect.height,
      };

      setImagePosition(newPosition);

      if (onImagePositionChange) {
        onImagePositionChange(newPosition);
      }
    }
  }, [calculateOptimalDimensions, onImagePositionChange]);

  const handleImageLoad = useCallback(() => {
    updateImageMetrics();
    if (onLoad) {
      onLoad();
    }
  }, [updateImageMetrics, onLoad]);

  const handleImageError = useCallback(() => {
    if (onError) {
      onError();
    }
  }, [onError]);

  useEffect(() => {
    const timer = setTimeout(updateImageMetrics, 100);
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timer);
      setTimeout(updateImageMetrics, 100);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (imageRef.current) {
      resizeObserver.observe(imageRef.current);
    }

    if (imageContainerRef.current) {
      resizeObserver.observe(imageContainerRef.current);
    }

    window.addEventListener("resize", updateImageMetrics);

    return () => {
      clearTimeout(timer);

      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      if (imageRef.current) {
        resizeObserver.unobserve(imageRef.current);
      }
      if (imageContainerRef.current) {
        resizeObserver.unobserve(imageContainerRef.current);
      }

      window.removeEventListener("resize", updateImageMetrics);
      resizeObserver.disconnect();
    };
  }, [isMobile, updateImageMetrics]);

  useEffect(() => {
    const timer = setTimeout(updateImageMetrics, 100);
    return () => clearTimeout(timer);
  }, [imageSrc, updateImageMetrics]);

  const baseWidth = isMobile
    ? originalDimensions.mobile.width
    : originalDimensions.desktop.width;
  const baseHeight = isMobile
    ? originalDimensions.mobile.height
    : originalDimensions.desktop.height;

  const scaleFactorX = imagePosition.width / baseWidth;
  const scaleFactorY = imagePosition.height / baseHeight;

  return (
    <div ref={containerRef} className="relative w-full pb-5">
      <div
        className="relative  
          flex justify-center items-center"
      >
        <div
          ref={imageContainerRef}
          className="relative overflow-y-hidden overflow-x-hidden"
          style={{
            width: isMobile
              ? maxDimensions.mobile.width
              : maxDimensions.desktop.width,
            height: isMobile
              ? maxDimensions.mobile.height
              : maxDimensions.desktop.height,
            maxWidth: "100%",
            maxHeight: isMobile ? "none" : "100%",
          }}
        >
          <Image
            ref={imageRef as any}
            src={imageSrc || "/placeholder.svg"}
            alt={altText}
            fill
            priority={priority}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="md:rounded-lg"
          />

          <div
            ref={overlayContainerRef}
            className="absolute"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {typeof children === "function"
              ? (children as RenderFunction)({ scaleFactorX, scaleFactorY })
              : children}
          </div>
        </div>
      </div>
    </div>
  );
}