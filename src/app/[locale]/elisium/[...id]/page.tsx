"use client";

import { useState, useEffect, useRef } from "react";

// Apartment data
const apartmentData = [
  {
    id: "18",
    name: "#26",
    size: "34.50",
    sale_price: "1250",
    floor: "3",
    status: 1, // 1 = free (green), 2 = sold (red)
    balcony: "8.5",
    bathrooms: 1,
    bedrooms: 1,
  },
  {
    id: "19",
    name: "#27",
    size: "33.90",
    sale_price: "1250",
    floor: "3",
    status: 2, // 1 = free (green), 2 = sold (red), 3 = reserved (orange)
    balcony: "7.8",
    bathrooms: 1,
    bedrooms: 1,
  },
  {
    id: "20",
    name: "#28",
    size: "35.20",
    sale_price: "1250",
    floor: "3",
    status: 3, // 1 = free (green), 2 = sold (red), 3 = reserved (orange)
    balcony: "9.2",
    bathrooms: 1,
    bedrooms: 2,
  },
  {
    id: "21",
    name: "#29",
    size: "36.00",
    sale_price: "1250",
    floor: "3",
    status: 1, // 1 = free (green), 2 = sold (red), 3 = reserved (orange)
    balcony: "10.0",
    bathrooms: 2,
    bedrooms: 2,
  },
];

// Paths for apartments
const paths = [
  "M 10.340776,502.93772 8.4606345,383.54877 118.44888,382.6087 l 0.94007,-22.5617 71.44536,2.82022 0.94007,185.19388 -60.16451,0.94008 -1.88014,-47.00353 z",
  "M 194.59459,548.0611 l -2.82021,-185.19388 h 58.28437 l 0.94007,186.13396 z",
  "M 254.75911,546.18096 251.9389,360.047 l 58.28437,2.82022 0.94007,184.25381 z",
  "M 315.86369,548.0611 l -3.76028,-186.13396 57.3443,0.94008 0.94007,182.37367 z",
];

// Helper function to calculate path center
function getPathCenter(pathString: string) {
  const commands = pathString.match(/[ML]\s*[\d.,\s-]+/g);
  if (!commands) return { x: 0, y: 0 };

  const points = commands.map((cmd) => {
    const coords = cmd.match(/-?[\d.]+/g);
    return {
      x: Number.parseFloat(coords![0]),
      y: Number.parseFloat(coords![1]),
    };
  });

  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);

  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

export default function FloorPlanPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      className={`w-full mx-auto ${
        isMobile
          ? "h-screen overflow-x-auto overflow-y-hidden pt-20"
          : "h-screen flex justify-center items-center p-4 pt-24"
      }`}
    >
      {/* Modal */}
      {selectedApartment !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApartment(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const apt = apartmentData[selectedApartment];
              const isFree = apt.status === 1;
              const isSold = apt.status === 2;
              const isReserved = apt.status === 3;
              const statusColor = isFree
                ? "#10b981"
                : isSold
                ? "#ef4444"
                : "#f59e0b";
              const statusText = isFree
                ? "AVAILABLE"
                : isSold
                ? "SOLD"
                : "RESERVED";

              return (
                <>
                  {/* Image Section - Takes more space on desktop, top on mobile */}
                  <div className="w-full md:w-2/3 bg-gray-100 flex items-center justify-center p-2 md:p-6 h-96 md:h-auto">
                    <img
                      src={`/images/apartments/apt-${apt.id}.jpg`}
                      alt={`Apartment ${apt.name}`}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/images/elisium/Gegma.png";
                      }}
                    />
                  </div>

                  {/* Info Section - Takes less space on desktop, bottom on mobile */}
                  <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <div
                      className="rounded-xl p-3 mb-4"
                      style={{ backgroundColor: statusColor }}
                    >
                      <h2 className="text-xl font-bold text-white text-center">
                        Apartment {apt.name}
                      </h2>
                      <p className="text-white text-center text-xs mt-1 opacity-90">
                        Floor {apt.floor}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center mb-4">
                      <span
                        className="px-3 py-1 rounded-full text-white font-bold text-xs"
                        style={{ backgroundColor: statusColor }}
                      >
                        {statusText}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-3 flex-1">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600 text-sm font-semibold">
                          Total Area
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: statusColor }}
                        >
                          {apt.size} m²
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600 text-sm font-semibold">
                          Balcony
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: statusColor }}
                        >
                          {apt.balcony} m²
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600 text-sm font-semibold">
                          Bedrooms
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: statusColor }}
                        >
                          {apt.bedrooms}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600 text-sm font-semibold">
                          Bathrooms
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: statusColor }}
                        >
                          {apt.bathrooms}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600 text-sm font-semibold">
                          Price per m²
                        </span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: statusColor }}
                        >
                          ${apt.sale_price}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 text-sm font-semibold">
                          Total Price
                        </span>
                        <span
                          className="text-xl font-bold"
                          style={{ color: statusColor }}
                        >
                          $
                          {(
                            Number.parseFloat(apt.size) *
                            Number.parseFloat(apt.sale_price)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedApartment(null)}
                      className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        className={`relative ${
          isMobile
            ? "w-[1280px] h-[calc(100vh-5rem)]"
            : "w-full h-full max-w-7xl max-h-full flex items-center justify-center"
        }`}
      >
        {/* Background image */}
        <img
          src="/images/elisium/Gegma.png"
          alt="Building"
          className={`${
            isMobile
              ? "w-full h-full object-contain"
              : "max-w-full max-h-full w-auto h-auto object-contain"
          }`}
        />

        {/* SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1280 800"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Free apartment gradients (green) */}
            <linearGradient id="freeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="freeHoverGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>
            {/* Sold apartment gradients (red) */}
            <linearGradient id="soldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="soldHoverGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.8" />
            </linearGradient>
            {/* Reserved apartment gradients (orange) */}
            <linearGradient
              id="reservedGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="reservedHoverGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
            </linearGradient>
            <filter
              id="dropShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="0" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.3" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {paths.map((pathData, i) => {
            const apt = apartmentData[i];
            if (!apt) return null;

            const center = getPathCenter(pathData);
            const isHovered = hoveredIndex === i;
            const isFree = apt.status === 1;
            const isSold = apt.status === 2;
            const isReserved = apt.status === 3;

            // Determine colors based on status
            let fillGradient, strokeColor, textColor, labelBgColor;

            if (isFree) {
              fillGradient = isHovered
                ? "url(#freeHoverGradient)"
                : "url(#freeGradient)";
              strokeColor = "#10b981";
              textColor = "#059669";
              labelBgColor = "#10b981";
            } else if (isSold) {
              fillGradient = isHovered
                ? "url(#soldHoverGradient)"
                : "url(#soldGradient)";
              strokeColor = "#ef4444";
              textColor = "#dc2626";
              labelBgColor = "#ef4444";
            } else {
              fillGradient = isHovered
                ? "url(#reservedHoverGradient)"
                : "url(#reservedGradient)";
              strokeColor = "#f59e0b";
              textColor = "#d97706";
              labelBgColor = "#f59e0b";
            }

            return (
              <g key={i}>
                {/* Apartment path */}
                <path
                  d={pathData}
                  fill={fillGradient}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => setSelectedApartment(i)}
                  style={{ pointerEvents: "all" }}
                />

                <g className="pointer-events-none" filter="url(#dropShadow)">
                  <rect
                    x={center.x - 45}
                    y={center.y - 28}
                    width="90"
                    height="56"
                    rx="10"
                    fill="white"
                    stroke={strokeColor}
                    strokeWidth="2"
                    opacity="0.95"
                  />

                  {/* Apartment name */}
                  <text
                    x={center.x}
                    y={center.y - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold select-none"
                    fill={textColor}
                    fontSize="20"
                  >
                    {apt.name}
                  </text>

                  <text
                    x={center.x}
                    y={center.y + 12}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold select-none"
                    fill="#6b7280"
                    fontSize="16"
                  >
                    {apt.size} m²
                  </text>

                  {/* Status indicator dot */}
                  <circle
                    cx={center.x + 35}
                    cy={center.y - 18}
                    r="5"
                    fill={labelBgColor}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
