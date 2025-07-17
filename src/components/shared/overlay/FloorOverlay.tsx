"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

    // Hint animation - show hint occasionally
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

    // Don't render if scaling values are invalid
    if (scaleX <= 0 || scaleY <= 0) {
      return null;
    }

    return (
      <>
        {/* Base layer – stronger edge, soft inner glow */}
        <div
          style={{ clipPath }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-100/10 to-slate-200/10 border border-white/60 shadow-inner"
        />

        {/* Interactive overlay – thicker borders & shimmer */}
        <div
          style={{ clipPath }}
          className={`
            absolute top-0 left-0 w-full h-full
            transition-all duration-300 ease-out cursor-pointer
            ${
              isHovered
                ? "bg-blue-500/80 border-2 border-white shadow-2xl shadow-blue-400/60"
                : showHint
                ? "bg-blue-300/30 border-2 border-white/90 shimmer-hint"
                : "bg-blue-200/20 border border-white/60 hover:bg-blue-400/60 hover:border-white/90 hover:border-[1.5px]"
            }
          `}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        />

        {/* Floor number badge - only shown when hovered */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ clipPath }}
              className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white/95 text-blue-700 font-bold text-lg px-3 py-1.5 rounded-full shadow-xl border border-blue-200 flex items-center justify-center min-w-[40px] min-h-[40px]">
                {flatNumber}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom animation styles */}
        <style jsx global>{`
          @keyframes shimmer-hint {
            0% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5),
                inset 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            50% {
              box-shadow: 0 0 0 12px rgba(59, 130, 246, 0),
                inset 0 0 0 3px rgba(255, 255, 255, 0.8);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0),
                inset 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
          }
          .shimmer-hint {
            animation: shimmer-hint 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
        `}</style>
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
