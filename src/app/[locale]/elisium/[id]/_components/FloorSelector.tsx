import type React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

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
  if (isMobile) {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-gray-200/70 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                const prevFloor =
                  currentFloor > floors[0] ? currentFloor - 1 : currentFloor;
                if (prevFloor !== currentFloor) onFloorChange(prevFloor);
              }}
              disabled={currentFloor <= floors[0]}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
            </button>

            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 sm:gap-2.5 px-1">
                {floors.map((floor) => (
                  <button
                    key={floor}
                    onClick={() => onFloorChange(floor)}
                    className={`flex-shrink-0 min-w-[48px] h-12 sm:min-w-[56px] sm:h-14 px-3 rounded-xl text-base sm:text-lg font-bold transition-all shadow-lg hover:shadow-xl active:scale-95 ${
                      currentFloor === floor
                        ? "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white scale-105 shadow-blue-400/50 ring-2 ring-blue-400"
                        : "bg-gradient-to-br from-white to-gray-50 text-gray-800 hover:from-blue-50 hover:to-blue-100 border-2 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                const nextFloor =
                  currentFloor < floors[floors.length - 1]
                    ? currentFloor + 1
                    : currentFloor;
                if (nextFloor !== currentFloor) onFloorChange(nextFloor);
              }}
              disabled={currentFloor >= floors[floors.length - 1]}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 disabled:from-gray-50 disabled:to-gray-100 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
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
