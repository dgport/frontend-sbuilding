"use client";

import { useState, useEffect, useRef } from "react";

export default function FloorPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [apartmentData, setApartmentData] = useState<any[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Unwrap params Promise
  useEffect(() => {
    params.then((resolvedParams) => {
      setPropertyId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!propertyId) return;

    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://sbuilding.bo.ge/api/property/${propertyId}`
        );

        if (!response.ok) throw new Error("Backend offline");

        const data = await response.json();
        setApartmentData(data.apartments || data);
        setPaths(data.paths || []);
      } catch {
        console.warn("Backend unreachable, loading local data...");
        const localData = await import(
          "@/app/[locale]/elisium/_components/apartments.json"
        );
        const pathsData = await import(
          "@/app/[locale]/elisium/_components/paths.json"
        );
        setApartmentData(localData.default);
        setPaths(pathsData.default);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [propertyId]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getStatusConfig = (status: string) => {
    // status 1 = Available, 2 = Reserved, 3 = Sold
    if (status === "1") {
      return {
        color: "#10b981",
        text: "AVAILABLE",
        gradient: "freeGradient",
        hoverGradient: "freeHoverGradient",
      };
    } else if (status === "2") {
      return {
        color: "#f59e0b",
        text: "RESERVED",
        gradient: "reservedGradient",
        hoverGradient: "reservedHoverGradient",
      };
    } else {
      return {
        color: "#ef4444",
        text: "SOLD",
        gradient: "soldGradient",
        hoverGradient: "soldHoverGradient",
      };
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading floor plan...</p>
        </div>
      </div>
    );
  }

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
              const statusConfig = getStatusConfig(apt.property_status);

              return (
                <>
                  {/* Image Section */}
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

                  {/* Info Section */}
                  <div className="w-full md:w-1/3 p-6 flex flex-col overflow-y-auto">
                    {/* Header */}
                    <div
                      className="rounded-xl p-3 mb-4"
                      style={{ backgroundColor: statusConfig.color }}
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
                        style={{ backgroundColor: statusConfig.color }}
                      >
                        {statusConfig.text}
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
                          style={{ color: statusConfig.color }}
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
                          style={{ color: statusConfig.color }}
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
                          style={{ color: statusConfig.color }}
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
                          style={{ color: statusConfig.color }}
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
                          style={{ color: statusConfig.color }}
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
                          style={{ color: statusConfig.color }}
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
            {/* Available (green) */}
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

            {/* Reserved (orange) */}
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

            {/* Sold (red) */}
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

            const pathElement = pathRefs.current[i];
            let center = { x: 640, y: 400 };

            if (pathElement) {
              try {
                const bbox = pathElement.getBBox();
                center = {
                  x: bbox.x + bbox.width / 2,
                  y: bbox.y + bbox.height / 2,
                };
              } catch {
                console.warn(`Could not get bbox for path ${i}`);
              }
            }

            const isHovered = hoveredIndex === i;
            const statusConfig = getStatusConfig(apt.property_status);
            const fillGradient = isHovered
              ? `url(#${statusConfig.hoverGradient})`
              : `url(#${statusConfig.gradient})`;

            return (
              <g key={i}>
                <path
                  ref={(el) => {
                    pathRefs.current[i] = el;
                  }}
                  d={pathData}
                  fill={fillGradient}
                  stroke={statusConfig.color}
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
                    stroke={statusConfig.color}
                    strokeWidth="2"
                    opacity="0.95"
                  />

                  <text
                    x={center.x}
                    y={center.y - 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold select-none"
                    fill={statusConfig.color}
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

                  <circle
                    cx={center.x + 35}
                    cy={center.y - 18}
                    r="5"
                    fill={statusConfig.color}
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
