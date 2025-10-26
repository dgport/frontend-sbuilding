"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFloorStore } from "@/zustand/floorStore";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DESKTOP_FLOOR_PATHS,
  MOBILE_FLOOR_PATHS,
  SVG_VIEWBOX,
} from "@/constants/ElisisiumSelectFloor";

const FLOORS = Object.keys(DESKTOP_FLOOR_PATHS).map(Number);

export default function SelectFloor() {
  const t = useTranslations("elysium");
  const [selectedFloor, setSelectedFloor] = useState(3);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setBuildingContext, setCurrentFloor } = useFloorStore();

  const handleSelectFloor = () => {
    setIsLoading(true);
    setBuildingContext("3", "6");
    setCurrentFloor(selectedFloor);
    router.push(`/elisium/${selectedFloor}`);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  return (
    <section className="px-4 md:px-8 lg:px-36 py-10 min-h-screen font-geo2 tracking-widest relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
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
        <div className="relative hidden md:block bg-white/90 rounded-xl shadow-xl overflow-hidden max-h-[600px]">
          {/* Floor number indicator - top left */}
          {(hoveredFloor !== null || selectedFloor) && (
            <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl font-bold text-3xl animate-fadeIn">
              {hoveredFloor !== null ? hoveredFloor : selectedFloor}
            </div>
          )}

          <svg
            viewBox={`0 0 ${SVG_VIEWBOX.desktop.width} ${SVG_VIEWBOX.desktop.height}`}
            className="w-full h-auto"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="hoverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <style>{`
              .floor-path {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                vector-effect: non-scaling-stroke;
                pointer-events: all;
              }
              .floor-path {
                fill: transparent;
                stroke: transparent;
                stroke-width: 0;
                opacity: 0;
              }
              .floor-path:hover {
                fill: url(#hoverGradient) !important;
                stroke: #ffffff !important;
                stroke-width: 2.5 !important;
                opacity: 1 !important;
                filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
                animation: pulse-border 1.2s ease-in-out infinite;
              }
              .floor-path.selected {
                fill: url(#hoverGradient) !important;
                stroke: #ffffff !important;
                stroke-width: 2.5 !important;
                opacity: 1 !important;
                filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
                animation: pulse-border 1.2s ease-in-out infinite;
              }
              @keyframes pulse-border {
                0%, 100% { 
                  stroke-width: 2.5;
                  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
                }
                50% { 
                  stroke-width: 3;
                  filter: drop-shadow(0 0 16px rgba(255, 255, 255, 1)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.8));
                }
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.8);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }
              .animate-fadeIn {
                animation: fadeIn 0.2s ease-out;
              }
            `}</style>

            <image
              href="/images/elisium/DesktopImage.avif"
              width={SVG_VIEWBOX.desktop.width}
              height={SVG_VIEWBOX.desktop.height}
            />
            {Object.entries(DESKTOP_FLOOR_PATHS).map(([floorNum, path]) => {
              const floor = Number(floorNum);
              const isSelected = floor === selectedFloor;

              const handlePathClick = () => {
                setSelectedFloor(floor);
                setIsLoading(true);
                setBuildingContext("3", "6");
                setCurrentFloor(floor);
                router.push(`/elisium/${floor}`);
              };

              return (
                <path
                  key={floor}
                  d={path}
                  className={`floor-path ${isSelected ? "selected" : ""}`}
                  onMouseEnter={() => setHoveredFloor(floor)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={handlePathClick}
                />
              );
            })}
          </svg>

          {/* Desktop floor buttons panel with gradient blur overlay */}
          <div className="absolute overflow-y-hidden top-4 right-4 flex flex-col gap-3 rounded-lg shadow-xl p-3 max-h-[calc(100%-2rem)]  bg-gradient-to-br from-white/70 via-blue-50/60 to-white/70 backdrop-blur-md border border-white/30">
            <div className="grid grid-cols-2 gap-1.5">
              {FLOORS.map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`w-10 h-10 rounded-md text-xs font-bold transition-all backdrop-blur-sm ${
                    selectedFloor === floor
                      ? "bg-blue-600 text-white shadow-lg scale-105"
                      : "bg-white/80 text-gray-800 hover:bg-blue-50/90 hover:scale-105 border-2 border-gray-300/50"
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

        {/* Mobile view */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="bg-white/90 rounded-xl shadow-lg overflow-hidden relative">
            {/* Floor number indicator for mobile */}
            {(hoveredFloor !== null || selectedFloor) && (
              <div className="absolute top-3 left-3 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl font-bold text-2xl animate-fadeIn">
                {hoveredFloor !== null ? hoveredFloor : selectedFloor}
              </div>
            )}

            <svg
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
                  <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
                </linearGradient>
              </defs>
              <style>{`
                .floor-path-mobile {
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  cursor: pointer;
                  vector-effect: non-scaling-stroke;
                  fill: transparent;
                  stroke: transparent;
                  stroke-width: 0;
                  opacity: 0;
                  pointer-events: all;
                }
                .floor-path-mobile:active, .floor-path-mobile.selected {
                  fill: url(#hoverGradientMobile);
                  stroke: #ffffff;
                  stroke-width: 4;
                  opacity: 1;
                  filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9));
                }
              `}</style>

              <image
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
                    className={`floor-path-mobile ${
                      isSelected ? "selected" : ""
                    }`}
                    onTouchStart={() => setHoveredFloor(floor)}
                    onTouchEnd={() => setHoveredFloor(null)}
                    onClick={() => setSelectedFloor(floor)}
                  />
                );
              })}
            </svg>
          </div>

          {/* Mobile floor buttons with smaller sizes */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>

              <div
                ref={carouselRef}
                className="flex-1 overflow-x-auto scrollbar-hide"
              >
                <div className="flex gap-1.5 px-1">
                  {FLOORS.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`flex-shrink-0 w-11 h-11 rounded-lg text-xs font-bold transition-all ${
                        selectedFloor === floor
                          ? "bg-blue-600 text-white shadow-lg scale-105"
                          : "bg-white text-gray-800 hover:bg-blue-50 border-2 border-gray-300"
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => scrollCarousel("right")}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            <button
              onClick={handleSelectFloor}
              disabled={isLoading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:cursor-not-allowed"
            >
              {isLoading ? t("loading") : t("selectFloor")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
