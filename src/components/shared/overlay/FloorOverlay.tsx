"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";

interface Coordinate {
  x: number;
  y: number;
}

interface FloorOverlayProps {
  flatId: number;
  flatNumber: number;
  coords: Coordinate[];
  hoveredApartment: number | null;
  setHoveredApartment: (id: number | null) => void;
  handleFloorClick?: (flatId: number, flatNumber: number) => void;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
}

const getClipPathPolygon = (
  coords: Coordinate[],
  scaleX: number,
  scaleY: number,
  offsetX: number,
  offsetY: number
) => {
  return `polygon(${coords
    .map(({ x, y }) => `${x * scaleX + offsetX}px ${y * scaleY + offsetY}px`)
    .join(", ")})`;
};

export const FloorOverlay: React.FC<FloorOverlayProps> = React.memo(
  ({
    flatId,
    flatNumber,
    coords,
    hoveredApartment,
    setHoveredApartment,
    handleFloorClick = () => alert(`Apartment #${flatNumber} clicked`),
    scaleX,
    scaleY,
    offsetX,
    offsetY,
  }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const isHovered = hoveredApartment === flatId;

    // Create clip path with proper scaling
    const clipPath = useMemo(
      () => getClipPathPolygon(coords, scaleX, scaleY, offsetX, offsetY),
      [coords, scaleX, scaleY, offsetX, offsetY]
    );

    // Mobile detection
    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768 || "ontouchstart" in window);
      };

      checkMobile();

      let timeoutId: NodeJS.Timeout;
      const debouncedResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkMobile, 150);
      };

      window.addEventListener("resize", debouncedResize);
      return () => {
        window.removeEventListener("resize", debouncedResize);
        clearTimeout(timeoutId);
      };
    }, []);

    // Hint animation
    useEffect(() => {
      const hintInterval = setInterval(() => {
        setShowHint(true);
        setTimeout(() => setShowHint(false), 1200);
      }, 4000);

      return () => clearInterval(hintInterval);
    }, []);

    const handleMouseEnter = useCallback(() => {
      if (!isMobile) setHoveredApartment(flatId);
    }, [isMobile, setHoveredApartment, flatId]);

    const handleMouseLeave = useCallback(() => {
      if (!isMobile) setHoveredApartment(null);
    }, [isMobile, setHoveredApartment]);

    const handleClick = useCallback(() => {
      if (isMobile) {
        setHoveredApartment(isHovered ? null : flatId);
      }
      handleFloorClick(flatId, flatNumber);
    }, [
      isMobile,
      isHovered,
      flatId,
      flatNumber,
      setHoveredApartment,
      handleFloorClick,
    ]);

    const getOverlayClasses = useMemo(() => {
      let classes = `absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out cursor-pointer`;

      if (isMobile) {
        if (isHovered) {
          classes += ` bg-blue-600/85 border-2 border-white shadow-2xl shadow-blue-500/50`;
        } else if (showHint) {
          classes += ` bg-blue-400/30 border-2 border-white animate-pulse-glow`;
        } else {
          classes += ` bg-blue-300/25 border border-white/70 hover:bg-blue-500/70 hover:border-white hover:border-2 hover:shadow-lg`;
        }
      } else {
        if (isHovered) {
          classes += ` bg-blue-700/90 border-2 border-white shadow-xl shadow-blue-500/50`;
        } else if (showHint) {
          classes += ` bg-blue-400/25 border-2 border-white animate-pulse-glow`;
        } else {
          classes += ` bg-blue-200/20 border border-white/60 hover:bg-blue-700/90 hover:border-white hover:border-2 hover:shadow-xl hover:shadow-blue-500/50`;
        }
      }
      return classes;
    }, [isMobile, isHovered, showHint]);

    const getBaseClasses = useMemo(() => {
      return `absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-100/15 to-slate-200/15 border border-white/40`;
    }, []);

    // Don't render if scaling values are invalid
    if (scaleX <= 0 || scaleY <= 0) {
      return null;
    }

    return (
      <>
        <style jsx>{`
          @keyframes pulse-glow {
            0% {
              border-color: rgba(255, 255, 255, 0.6);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
            50% {
              border-color: rgba(255, 255, 255, 1);
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
            }
            100% {
              border-color: rgba(255, 255, 255, 0.6);
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
            }
          }
          .animate-pulse-glow {
            animation: pulse-glow 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>

        <div style={{ clipPath }} className={getBaseClasses} />
        <div
          style={{ clipPath }}
          className={getOverlayClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />

        {isHovered && (
          <div
            style={{ clipPath }}
            className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/95 text-blue-900 font-semibold text-sm px-2 py-1 rounded shadow-lg border border-blue-200">
              #{flatNumber}
            </div>
          </div>
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.flatId === nextProps.flatId &&
      prevProps.flatNumber === nextProps.flatNumber &&
      prevProps.hoveredApartment === nextProps.hoveredApartment &&
      prevProps.scaleX === nextProps.scaleX &&
      prevProps.scaleY === nextProps.scaleY &&
      prevProps.offsetX === nextProps.offsetX &&
      prevProps.offsetY === nextProps.offsetY &&
      JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
    );
  }
);

FloorOverlay.displayName = "FloorOverlay";
