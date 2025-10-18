"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFloorStore } from "@/zustand/floorStore";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MOBILE_FLOOR_PATHS = {
  1: "m 3920.4543,2801.5263 -2.8044,-117.7819 -773.9952,11.2174 -524.4099,-72.9126 H 2450.985 l 2.8043,95.3472 176.6729,-2.8043 510.3881,98.1515 z",
  2: "m 3917.6499,2686.5488 v -123.3906 l -762.7779,5.6087 -544.0402,-39.2606 -639.3873,-8.413 v 103.7602 l 639.3873,-8.413 535.6272,72.9126 z",
  3: "m 1971.0635,2185.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  4: "m 1971.0635,2070.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  5: "m 1971.0635,1955.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  6: "m 1971.0635,1840.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  7: "m 1971.0635,1725.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  8: "m 1971.0635,1610.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  9: "m 1971.0635,1495.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  10: "m 1971.0635,1380.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  11: "m 1971.0635,1265.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  12: "m 1971.0635,1150.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  13: "m 1971.0635,1035.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  14: "m 1971.0635,920.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  15: "m 1971.0635,805.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  16: "m 1971.0635,690.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  17: "m 1971.0635,575.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  18: "m 1971.0635,460.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  19: "m 1971.0635,345.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  20: "m 1971.0635,230.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  21: "m 1971.0635,115.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  22: "m 1971.0635,0.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
};

const FLOOR_PATHS = {
  1: "m 3920.4543,2801.5263 -2.8044,-117.7819 -773.9952,11.2174 -524.4099,-72.9126 H 2450.985 l 2.8043,95.3472 176.6729,-2.8043 510.3881,98.1515 z",
  2: "m 3917.6499,2686.5488 v -123.3906 l -762.7779,5.6087 -544.0402,-39.2606 -639.3873,-8.413 v 103.7602 l 639.3873,-8.413 535.6272,72.9126 z",
  3: "m 1971.0635,2185.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  4: "m 1971.0635,2070.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  5: "m 1971.0635,1955.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  6: "m 1971.0635,1840.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  7: "m 1971.0635,1725.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  8: "m 1971.0635,1610.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  9: "m 1971.0635,1495.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  10: "m 1971.0635,1380.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  11: "m 1971.0635,1265.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  12: "m 1971.0635,1150.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  13: "m 1971.0635,1035.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  14: "m 1971.0635,920.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  15: "m 1971.0635,805.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  16: "m 1971.0635,690.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  17: "m 1971.0635,575.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  18: "m 1971.0635,460.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  19: "m 1971.0635,345.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  20: "m 1971.0635,230.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  21: "m 1971.0635,115.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
  22: "m 1971.0635,0.2468 -7.9319,-75.3526 634.5476,3.966 531.4336,-27.7615 777.3208,3.9659 -3.9659,118.9777 -749.5594,11.8978 -547.2973,-11.8978 h -594.8883 z",
};

const SVG_VIEWBOX = {
  desktop: { width: 6000, height: 3375 },
  mobile: { width: 2827, height: 3375 },
};

export default function SelectFloor() {
  const t = useTranslations("elysium");
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setBuildingContext, setCurrentFloor } = useFloorStore();

  const availableFloors = useMemo(
    () => Object.keys(FLOOR_PATHS).map(Number),
    []
  );

  const handleSelectFloor = useCallback(() => {
    setIsLoading(true);
    setBuildingContext("3", "6");
    setCurrentFloor(selectedFloor);
    setTimeout(() => router.push("#"), 300);
  }, [selectedFloor, router, setBuildingContext, setCurrentFloor]);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-4 md:px-8 relative lg:px-40 py-10 min-h-screen font-geo2 tracking-widest">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
            shapeRendering="geometricPrecision"
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Desktop SVG with Absolute Floor Buttons */}
        <div className="relative hidden md:block bg-white/90 rounded-xl shadow-xl overflow-hidden max-h-[600px]">
          <svg
            shapeRendering="geometricPrecision"
            viewBox={`0 0 ${SVG_VIEWBOX.desktop.width} ${SVG_VIEWBOX.desktop.height}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
              </linearGradient>

              <linearGradient id="selectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
              </linearGradient>

              <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <style>{`
  .floor-path {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    vector-effect: non-scaling-stroke;
    outline: none;
    shape-rendering: geometricPrecision;
  }

  .floor-path:hover {
    filter: drop-shadow(0 6px 12px rgba(59, 130, 246, 0.4));
  }

  /* Unselected state - subtle outline */
  .floor-unselected {
    fill: rgba(148, 163, 184, 0.08);
    stroke: rgba(148, 163, 184, 0.4);
    stroke-width: 1.5;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  /* Hovered state - vibrant gradient fill */
  .floor-hovered {
    fill: url(#hoverGradient);
    stroke: #3b82f6;
    stroke-width: 2.5;
    stroke-linejoin: round;
    stroke-linecap: round;
    animation: pulse-glow 1.5s ease-in-out infinite;
  }

  /* Selected state - bold with gradient */
  .floor-selected {
    fill: url(#selectedGradient);
    stroke: #1d4ed8;
    stroke-width: 3;
    stroke-linejoin: round;
    stroke-linecap: round;
    filter: drop-shadow(0 4px 10px rgba(29, 78, 216, 0.5));
  }

  @keyframes pulse-glow {
    0%, 100% {
      filter: drop-shadow(0 6px 12px rgba(59, 130, 246, 0.4));
    }
    50% {
      filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.6));
    }
  }
`}</style>

            <image
              id="building-bg-desktop"
              href="/images/elisium/DesktopImage.avif"
              width={SVG_VIEWBOX.desktop.width}
              height={SVG_VIEWBOX.desktop.height}
            />
            {Object.entries(FLOOR_PATHS).map(([floorNum, path]) => {
              const floor = Number(floorNum);
              const isSelected = floor === selectedFloor;
              const isHovered = floor === hoveredFloor;

              return (
                <path
                  key={floor}
                  d={path}
                  vectorEffect="non-scaling-stroke"
                  tabIndex={-1}
                  className={`floor-path ${
                    isSelected
                      ? "floor-selected"
                      : isHovered
                      ? "floor-hovered"
                      : "floor-unselected"
                  }`}
                  onMouseEnter={() => setHoveredFloor(floor)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => setSelectedFloor(floor)}
                />
              );
            })}
          </svg>

          <div className="absolute top-4 right-4 flex flex-col gap-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 max-h-[calc(100%-2rem)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1.5">
              {availableFloors.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`w-10 h-10 rounded-md text-xs font-bold transition-all ${
                    selectedFloor === floor
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                >
                  {floor}
                </button>
              ))}
            </div>

            <button
              onClick={handleSelectFloor}
              disabled={isLoading}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {isLoading ? t("loading") : t("select")}
            </button>
          </div>
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {/* Mobile Building Image with SVG Paths */}
          <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden">
            <svg
              shapeRendering="geometricPrecision"
              viewBox={`0 0 ${SVG_VIEWBOX.mobile.width} ${SVG_VIEWBOX.mobile.height}`}
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient
                  id="hoverGradientMobile"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient
                  id="selectedGradientMobile"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.7" />
                </linearGradient>
              </defs>
              <style>{`
  .floor-path-mobile {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    vector-effect: non-scaling-stroke;
    outline: none;
    shape-rendering: geometricPrecision;
  }

  .floor-unselected-mobile {
    fill: rgba(148, 163, 184, 0.08);
    stroke: rgba(148, 163, 184, 0.4);
    stroke-width: 1.5;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  .floor-selected-mobile {
    fill: url(#selectedGradientMobile);
    stroke: #1d4ed8;
    stroke-width: 3;
    stroke-linejoin: round;
    stroke-linecap: round;
    filter: drop-shadow(0 4px 10px rgba(29, 78, 216, 0.5));
  }
`}</style>

              <image
                id="building-bg-mobile"
                href="/images/elisium/MobileImage.avif"
                width={SVG_VIEWBOX.mobile.width}
                height={SVG_VIEWBOX.mobile.height}
              />
              {Object.entries(MOBILE_FLOOR_PATHS).map(([floorNum, path]) => {
                const floor = Number(floorNum);
                const isSelected = floor === selectedFloor;

                return (
                  <path
                    key={floor}
                    d={path}
                    vectorEffect="non-scaling-stroke"
                    tabIndex={-1}
                    className={`floor-path-mobile ${
                      isSelected
                        ? "floor-selected-mobile"
                        : "floor-unselected-mobile"
                    }`}
                    onClick={() => setSelectedFloor(floor)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Mobile Carousel Controls */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => scrollCarousel("left")}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>

              <div
                ref={carouselRef}
                className="flex-1 overflow-x-auto scrollbar-hide"
              >
                <div className="flex gap-2 px-1">
                  {availableFloors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg text-sm font-bold transition-all ${
                        selectedFloor === floor
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            <button
              onClick={handleSelectFloor}
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:cursor-not-allowed"
            >
              {isLoading ? t("loading") : t("selectFloor")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
