"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFloorStore } from "@/zustand/floorStore";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DESKTOP_FLOOR_PATHS,
  SVG_VIEWBOX,
} from "@/constants/ElisisiumSelectFloor";
import { Button } from "@/components/ui/button";

const FLOORS = Object.keys(DESKTOP_FLOOR_PATHS).map(Number);

export default function SelectFloor() {
  const t = useTranslations("elysium");
  const [selectedFloor, setSelectedFloor] = useState(3);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setBuildingContext, setCurrentFloor } = useFloorStore();

  const handleSelectFloor = useCallback(() => {
    setIsLoading(true);
    setBuildingContext("3", "6");
    setCurrentFloor(selectedFloor);
    router.push(`/elisium/${selectedFloor}`);
  }, [selectedFloor, router, setBuildingContext, setCurrentFloor]);

  const scrollCarousel = useCallback((direction: "left" | "right") => {
    carouselRef.current?.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  }, []);

  const handlePathClick = useCallback(
    (floor: number) => {
      setSelectedFloor(floor);
      setIsLoading(true);
      setBuildingContext("3", "6");
      setCurrentFloor(floor);
      router.push(`/elisium/${floor}`);
    },
    [router, setBuildingContext, setCurrentFloor]
  );

  const displayFloor = useMemo(
    () => (hoveredFloor !== null ? hoveredFloor : selectedFloor),
    [hoveredFloor, selectedFloor]
  );

  return (
    <section className="w-full  pt-16 md:pt-20  h-auto md:min-h-screen font-geo2 tracking-widest relative">
      <div className="relative z-10 md:min-h-screen ">
        <div className="relative  hidden md:block bg-white/90 shadow-xl overflow-hidden h-screen">
          {displayFloor && (
            <div className="absolute top-4 left-4 z-20 bg-linear-to-br from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg shadow-xl font-bold text-3xl border border-white/20">
              {displayFloor}
            </div>
          )}

          <svg
            viewBox={`0 0 ${SVG_VIEWBOX.desktop.width} ${SVG_VIEWBOX.desktop.height}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
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
                fill: transparent;
                stroke: transparent;
                stroke-width: 0;
                opacity: 0;
              }
              .floor-path:hover, .floor-path.selected {
                fill: url(#hoverGradient);
                stroke: #ffffff;
                stroke-width: 2.5;
                opacity: 1;
                filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6));
              }
            `}</style>

            <image
              href="/images/elisium/DesktopImage.avif"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
            />
            {Object.entries(DESKTOP_FLOOR_PATHS).map(([floorNum, path]) => {
              const floor = Number(floorNum);
              return (
                <path
                  key={floor}
                  d={path}
                  className={`floor-path ${
                    floor === selectedFloor ? "selected" : ""
                  }`}
                  onMouseEnter={() => setHoveredFloor(floor)}
                  onMouseLeave={() => setHoveredFloor(null)}
                  onClick={() => handlePathClick(floor)}
                />
              );
            })}
          </svg>

          <div className="absolute  top-4 right-4 bg-white/80 backdrop-blur-xl rounded-xl shadow-2xl border border-white/30 p-3">
            <div className="grid grid-cols-2 overflow-x-hidden gap-2 overflow-y-auto max-h-[calc(100vh-12rem)] scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
              {FLOORS.map((floor) => (
                <Button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`w-11 h-11 rounded-lg text-sm font-bold transition-all ${
                    selectedFloor === floor
                      ? "bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105 border-2 border-white/30"
                      : "bg-white text-gray-800 hover:bg-blue-50 hover:scale-105 border-2 border-gray-300/50"
                  }`}
                >
                  {floor}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleSelectFloor}
              disabled={isLoading}
              className="w-full mt-3 cursor-pointer py-2.5 bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 disabled:cursor-not-allowed"
            >
              {isLoading ? t("loading") : t("select")}
            </Button>
          </div>
        </div>

        <div className="md:hidden relative h-[70vh] overflow-hidden">
          {displayFloor && (
            <div className="absolute top-3 left-3 z-20 bg-linear-to-br from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-xl font-bold text-2xl border border-white/20">
              {displayFloor}
            </div>
          )}

          <svg
            viewBox={`0 0 ${SVG_VIEWBOX.desktop.width} ${SVG_VIEWBOX.desktop.height}`}
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
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
              href="/images/elisium/DesktopImage.avif"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
            />
            {Object.entries(DESKTOP_FLOOR_PATHS).map(([floorNum, path]) => {
              const floor = Number(floorNum);
              return (
                <path
                  key={floor}
                  d={path}
                  className={`floor-path-mobile ${
                    floor === selectedFloor ? "selected" : ""
                  }`}
                  onTouchStart={() => setHoveredFloor(floor)}
                  onTouchEnd={() => setHoveredFloor(null)}
                  onClick={() => setSelectedFloor(floor)}
                />
              );
            })}
          </svg>

          {/* Mobile controls */}
          <div className="absolute bottom-1 z-50 left-4 right-4   space-y-3">
            <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-xl p-1 border border-white/30">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => scrollCarousel("left")}
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-white hover:bg-blue-50 rounded-lg transition-all shadow-md active:scale-95 border border-gray-200"
                >
                  <ChevronLeft className="w-3 h-3 text-gray-700" />
                </Button>

                <div
                  ref={carouselRef}
                  className="flex-1 overflow-x-auto scrollbar-hide"
                >
                  <div className="flex gap-2">
                    {FLOORS.map((floor) => (
                      <Button
                        key={floor}
                        onClick={() => setSelectedFloor(floor)}
                        className={`shrink-0 w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                          selectedFloor === floor
                            ? "bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg scale-105 border-2 border-white/30"
                            : "bg-white text-gray-800 hover:bg-blue-50 border-2 border-gray-300/50"
                        }`}
                      >
                        {floor}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => scrollCarousel("right")}
                  className="shrink-0 w-9 h-9 flex items-center justify-center bg-white hover:bg-blue-50 rounded-lg transition-all shadow-md active:scale-95 border border-gray-200"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </Button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl shadow-xl flex justify-center w-full rounded-xl   ">
              <Button
                onClick={handleSelectFloor}
                disabled={isLoading}
                className="w-full cursor-pointer py-3   bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95 disabled:cursor-not-allowed"
              >
                {isLoading ? t("loading") : t("select")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-blue-300::-webkit-scrollbar-thumb {
          background-color: rgb(147, 197, 253);
          border-radius: 3px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
      `}</style>
    </section>
  );
}
