"use client";

import { useTranslations } from "next-intl";
import { type FC, useState, useEffect, useMemo } from "react";

interface Coordinate {
  x: number;
  y: number;
}

interface ApartmentAreaProps {
  flatId: number;
  flatNumber: number;
  status: string;
  coords: Coordinate[];
  hoveredApartment: number | null;
  setHoveredApartment: (id: number | null) => void;
  onApartmentClick?: (flatId: number, flatNumber: number) => void;
  scaleFactorX?: number;
  scaleFactorY?: number;
  animationDelay?: number;
}

const getClipPathPolygon = (
  coords: Coordinate[],
  scaleFactorX = 1,
  scaleFactorY = 1
) => {
  if (!coords || coords.length < 3) return "none";

  return `polygon(${coords
    .map(({ x, y }) => `${x * scaleFactorX}px ${y * scaleFactorY}px`)
    .join(", ")})`;
};

const calculateCenter = (
  coords: Coordinate[],
  scaleFactorX = 1,
  scaleFactorY = 1
): { x: number; y: number } => {
  if (!coords || coords.length < 3) return { x: 0, y: 0 };

  const sum = coords.reduce(
    (acc, coord) => ({
      x: acc.x + coord.x * scaleFactorX,
      y: acc.y + coord.y * scaleFactorY,
    }),
    { x: 0, y: 0 }
  );

  return {
    x: sum.x / coords.length,
    y: sum.y / coords.length,
  };
};

export const ApartmentOverlay: FC<ApartmentAreaProps> = ({
  flatId,
  flatNumber,
  status,
  coords,
  hoveredApartment,
  setHoveredApartment,
  onApartmentClick = () => {},
  scaleFactorX = 1,
  scaleFactorY = 1,
  animationDelay = 0,
}) => {
  const t = useTranslations("main");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay, flatId]);

  const getStatusStyles = () => {
    const isHovered = hoveredApartment === flatId;

    switch (status?.toLowerCase()) {
      case "free":
      case "available":
        return {
          background: isHovered ? "bg-green-600/70" : "bg-green-500/40",
          textColor: "text-green-800",
          badgeColor: "bg-green-100 text-green-800 border-green-300",
          borderColor: "border-green-400",
        };
      case "reserved":
        return {
          background: isHovered ? "bg-yellow-600/70" : "bg-yellow-500/40",
          textColor: "text-yellow-800",
          badgeColor: "bg-yellow-100 text-yellow-800 border-yellow-300",
          borderColor: "border-yellow-400",
        };
      case "sold":
        return {
          background: isHovered ? "bg-red-600/70" : "bg-red-500/40",
          textColor: "text-red-800",
          badgeColor: "bg-red-100 text-red-800 border-red-300",
          borderColor: "border-red-400",
        };
      default:
        return {
          background: isHovered ? "bg-gray-600/70" : "bg-gray-500/40",
          textColor: "text-gray-800",
          badgeColor: "bg-gray-100 text-gray-800 border-gray-300",
          borderColor: "border-gray-400",
        };
    }
  };

  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case "free":
      case "available":
        return "✓";
      case "reserved":
        return "⏳";
      case "sold":
        return "✕";
      default:
        return "?";
    }
  };

  const overlayClasses = useMemo(() => {
    const styles = getStatusStyles();
    const isHovered = hoveredApartment === flatId;

    let classes = `
      ${styles.background}
      border-2 ${isHovered ? "border-white" : styles.borderColor}
      transition-all duration-300 ease-out
      transform-gpu
      ${isHovered ? "shadow-lg scale-105" : ""}
    `;

    if (isVisible) {
      classes += ` animate-apartment-appear`;
    } else {
      classes += ` opacity-0 scale-90 translate-y-2`;
    }

    return classes;
  }, [hoveredApartment, flatId, isVisible, status]);

  if (!coords || coords.length < 3) {
    return null;
  }

  const center = calculateCenter(coords, scaleFactorX, scaleFactorY);
  const styles = getStatusStyles();
  const isHovered = hoveredApartment === flatId;

  return (
    <>
      <style jsx>{`
        @keyframes apartment-appear {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(8px);
          }
          60% {
            opacity: 0.8;
            transform: scale(1.02) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes badge-bounce {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8) translateY(10px);
          }
          60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.05) translateY(-2px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) translateY(0);
          }
        }

        .animate-apartment-appear {
          animation: apartment-appear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }

        .animate-badge-bounce {
          animation: badge-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          clipPath: getClipPathPolygon(coords, scaleFactorX, scaleFactorY),
          pointerEvents: "auto",
          cursor: "pointer",
          animationDelay: `${animationDelay}ms`,
        }}
        className={overlayClasses}
        onMouseEnter={() => setHoveredApartment(flatId)}
        onMouseLeave={() => setHoveredApartment(null)}
        onClick={() => onApartmentClick(flatId, flatNumber)}
      />

      <div
        style={{
          position: "absolute",
          left: `${center.x}px`,
          top: `${center.y}px`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 20,
          animationDelay: `${animationDelay + 200}ms`,
        }}
        className={`flex flex-col items-center gap-1 ${
          isVisible ? "animate-badge-bounce" : "opacity-0 scale-75"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg border border-gray-200 transition-all duration-300">
          <span className="font-semibold text-sm text-gray-800">
            #{flatNumber}
          </span>
        </div>

        <div
          className={`
            ${styles.badgeColor}
            px-2 py-1 rounded-full text-xs font-medium
            border shadow-sm backdrop-blur-sm
            flex items-center gap-1 transition-all duration-300
          `}
        >
          <span className="md:block hidden ">{getStatusIcon()}</span>
        </div>
      </div>
      {isHovered && (
        <div
          style={{
            position: "absolute",
            left: `${center.x}px`,
            top: `${center.y - 80}px`,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            zIndex: 30,
          }}
          className="bg-slate-800/95 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-600 text-sm font-medium animate-tooltip-appear backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="font-semibold text-base mb-1">
              {t("apartment")} #{flatNumber}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-lg">{getStatusIcon()}</span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800/95"></div>
        </div>
      )}

      <style jsx>{`
        @keyframes tooltip-appear {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(10px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        .animate-tooltip-appear {
          animation: tooltip-appear 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
};
