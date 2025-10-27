import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface FloorSelectorProps {
  floors: number[];
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  isMobile?: boolean;
}

export function FloorSelector({
  floors,
  currentFloor,
  onFloorChange,
  isMobile = false,
}: FloorSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const scrollToDirection = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="md:hidden bottom-0 left-0 right-0 z-20 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200/70 py-5 px-3 sm:p-4">
          <div className="flex items-center gap-3 sm:gap-3">
            <button
              onClick={() => scrollToDirection("left")}
              className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            >
              <div className="floor-buttons-container flex gap-1.5 sm:gap-2 px-1">
                {floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => onFloorChange(floor)}
                    className={`flex-shrink-0 min-w-10 min-h-10  my-2 sm:min-w-[50px] sm:h-11 px-2.5 rounded-lg text-base sm:text-lg font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                      currentFloor === floor
                        ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white scale-105 shadow-blue-400/50 ring-2 ring-blue-400"
                        : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 hover:from-blue-50 hover:to-blue-100 border-2 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => scrollToDirection("right")}
              className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex flex-col bg-gradient-to-br from-white/95 via-blue-50/80 to-white/95 backdrop-blur-xl border-2 border-white/50 rounded-2xl shadow-2xl h-full max-h-[calc(100vh-8rem)] min-w-[180px] lg:min-w-[200px]">
      <h3 className="text-center font-bold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base uppercase tracking-wider pt-4 px-2">
        Select Floor
      </h3>
      <div className="flex-1 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent px-4 lg:px-5 pb-4">
        <div className="grid grid-cols-2 gap-2 lg:gap-2.5">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => onFloorChange(floor)}
              className={`min-w-[16px] cursor-pointer h-8 lg:min-w-[28px] lg:h-11 rounded-xl text-base lg:text-lg font-bold transition-all backdrop-blur-sm shadow-lg hover:shadow-xl active:scale-95 ${
                currentFloor === floor
                  ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white scale-105 shadow-blue-400/50 ring-2 ring-blue-400 ring-offset-2"
                  : "bg-gradient-to-br from-white to-gray-50 text-gray-800 hover:from-blue-50 hover:to-blue-100 hover:scale-105 border-2 border-gray-300/70 hover:border-blue-400"
              }`}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
