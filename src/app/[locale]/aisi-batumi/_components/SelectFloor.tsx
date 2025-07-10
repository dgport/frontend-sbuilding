"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useMediaQuery } from "@/use-media-query";
import { useRouter } from "next/navigation";
import { Building, Layers, Home, Calendar, ArrowLeft } from "lucide-react";
import SitePlanImage from "@/root/public/images/batumi/SelectBuilding.png";
import MobileSitePlan from "@/root/public/images/batumi/SelectBuilding.png";
import { buildings } from "@/constants/coordinants/buildingFloorCoord";
import { FloorOverlay } from "@/components/shared/overlay/FloorOverlay";
import { useTranslations } from "next-intl";
import background from "@/root/public/images/bg-body.jpg";
import { useFloorStore } from "@/zustand/floorStore";
import Loader from "@/components/shared/loader/Loader";

const ORIGINAL_IMAGE_WIDTH = 768;
const MOBILE_IMAGE_WIDTH = 768;

export default function SelectFloor() {
  const t = useTranslations("batumi");
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [floorPlan, setSelectedFloorplan] = useState<string | null>(null);
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

 
  const { setBuildingContext, resetFloorState, setCurrentFloor } =
    useFloorStore();

  useEffect(() => {
    const updateScaleFactor = () => {
      if (imageRef.current) {
        const currentImageWidth = imageRef.current.clientWidth;
        const baseWidth = isMobile ? MOBILE_IMAGE_WIDTH : ORIGINAL_IMAGE_WIDTH;
        setScaleFactor(currentImageWidth / baseWidth);
      }
    };

    const timer = setTimeout(updateScaleFactor, 100);
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timer);
      setTimeout(updateScaleFactor, 100);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateScaleFactor);

    return () => {
      clearTimeout(timer);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScaleFactor);
    };
  }, [isMobile]);

  useEffect(() => {
    const preloadImages = () => {
      buildings.forEach((building) => {
        if (building.image) {
          const img = new window.Image();
          img.src =
            typeof building.image === "string"
              ? building.image
              : building.image.src;
        }
      });
    };
    const timer = setTimeout(preloadImages, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBuildingClick = (
    buildingId: string,
    floorPlan: string,
    buildingIndex: string
  ) => {
    setIsLoading(true);
    setImageLoaded(false);
    setSelectedBuilding(buildingId);
    setHoveredFloor(null);
    setSelectedFloorplan(floorPlan);
    setBuildingId(buildingIndex);
    setBuildingContext(buildingIndex, floorPlan);
  };

  const handleFloorClick = (floorId: string) => {
    if (buildingId) {
      setIsLoading(true);
      setCurrentFloor(parseInt(floorId));

      setTimeout(() => {
        router.push(`/aisi-batumi/${buildingId}/${floorPlan}`);
      }, 300);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
    if (imageRef.current) {
      const baseWidth = isMobile ? MOBILE_IMAGE_WIDTH : ORIGINAL_IMAGE_WIDTH;
      setScaleFactor(imageRef.current.clientWidth / baseWidth);
    }
  };

  const handleBackClick = () => {
    setIsLoading(true);
    setImageLoaded(false);
    resetFloorState();
    setTimeout(() => {
      setSelectedBuilding(null);
      setHoveredFloor(null);
      setSelectedFloorplan(null);
      setBuildingId(null);
    }, 100);
  };

  const getCurrentImage = () => {
    if (selectedBuilding) {
      const building = buildings.find((b) => b.id === selectedBuilding);
      return building?.image || SitePlanImage;
    }
    return isMobile ? MobileSitePlan : SitePlanImage;
  };

  const getCurrentFloors = () => {
    if (selectedBuilding) {
      const building = buildings.find((b) => b.id === selectedBuilding);
      return building ? building.floors : [];
    }
    return [];
  };

  const renderRightPanel = () => {
    const isBlockASelected = selectedBuilding === "1";
    const isBlockBSelected = selectedBuilding === "2";
    const hasSelection = selectedBuilding !== null;

    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
          <Building className="mr-3 h-6 w-6 text-white" />
          {t("selectBuilding")}
        </h2>
        <div
          className={`space-y-6 transition-all duration-700 ease-out ${
            hasSelection && !isBlockASelected
              ? "opacity-30 scale-95 blur-[1px] pointer-events-none"
              : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
              <Layers className="mr-2 h-5 w-5 text-white" />
              {t("aBlock")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockASelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Layers className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">
                  {t("totalFloors")}
                </span>
              </div>
              <div className="font-bold text-2xl text-white">27</div>
            </div>
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockASelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Home className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">{t("totalUnits")}</span>
              </div>
              <div className="font-bold text-2xl text-white">475</div>
            </div>
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockASelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">{t("completion")}</span>
              </div>
              <div className="font-bold text-2xl text-white">2030</div>
            </div>
          </div>
        </div>
        <div
          className={`space-y-6 transition-all duration-700 ease-out ${
            hasSelection && !isBlockBSelected
              ? "opacity-30 scale-95 blur-[1px] pointer-events-none"
              : "opacity-100 scale-100 blur-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg text-white mb-4 flex items-center">
              <Layers className="mr-2 h-5 w-5 text-white" />
              {t("bBlock")}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockBSelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Layers className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">
                  {t("totalFloors")}
                </span>
              </div>
              <div className="font-bold text-2xl text-white">15</div>
            </div>
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockBSelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Home className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">{t("totalUnits")}</span>
              </div>
              <div className="font-bold text-2xl text-white">98</div>
            </div>
            <div
              className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 p-4 rounded-2xl transition-all duration-300 transform-gpu ${
                hasSelection && !isBlockBSelected
                  ? "border-white/5"
                  : "border-white/10 hover:border-white/25 hover:scale-[1.02]"
              }`}
            >
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 mr-2 text-white" />
                <span className="text-sm text-white/80">{t("completion")}</span>
              </div>
              <div className="font-bold text-2xl text-white">2028</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      style={{ backgroundImage: `url(${background.src})` }}
      className="px-4 md:px-8 lg:px-16 py-10  min-h-screen relative"
    >
      <div className="container2 relative z-10">
        <div className="flex flex-col xl:flex-row gap-8">
          <div ref={containerRef} className="relative w-full xl:w-1/2 ">
            <div className="relative w-full bg-gray-50/90 backdrop-blur-sm rounded-lg border-3 border-slate-500 overflow-hidden">
              <Image
                ref={imageRef}
                src={getCurrentImage() || "/placeholder.svg"}
                alt="Building plan image"
                className={`w-full transition-opacity duration-300 ${
                  isLoading ? "opacity-60" : ""
                }`}
                priority
                onLoad={handleImageLoad}
              />
              {isLoading && <Loader />}
              {!selectedBuilding &&
                !isLoading &&
                imageLoaded &&
                buildings.map((building) => (
                  <FloorOverlay
                    key={building.id}
                    flatId={Number.parseInt(building.id)}
                    flatNumber={Number.parseInt(building.id)}
                    coords={building.coords}
                    hoveredApartment={
                      hoveredBuilding ? Number.parseInt(hoveredBuilding) : null
                    }
                    setHoveredApartment={(id) =>
                      setHoveredBuilding(id?.toString() || null)
                    }
                    handleFloorClick={() =>
                      handleBuildingClick(
                        building.id,
                        building.floorPlan,
                        building.buidlingId
                      )
                    }
                    scaleFactor={scaleFactor}
                  />
                ))}
              {selectedBuilding &&
                !isLoading &&
                imageLoaded &&
                getCurrentFloors().map((floor) => (
                  <FloorOverlay
                    key={floor.id}
                    flatId={Number.parseInt(floor.id)}
                    flatNumber={Number.parseInt(floor.id)}
                    coords={floor.coords}
                    hoveredApartment={
                      hoveredFloor ? Number.parseInt(hoveredFloor) : null
                    }
                    setHoveredApartment={(id) =>
                      setHoveredFloor(id?.toString() || null)
                    }
                    handleFloorClick={() => handleFloorClick(floor.id)}
                    scaleFactor={scaleFactor}
                  />
                ))}
              {!selectedBuilding &&
                hoveredBuilding &&
                !isLoading &&
                imageLoaded && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-lg border border-gray-200 pointer-events-none">
                    <h3 className="text-xl font-bold text-indigo-600">
                      {t("building")} {hoveredBuilding === "1" ? "A" : "B"}
                    </h3>
                  </div>
                )}

              {selectedBuilding &&
                hoveredFloor &&
                !isLoading &&
                imageLoaded && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-6xl md:text-8xl opacity-70 pointer-events-none z-20">
                    {hoveredFloor}
                  </div>
                )}
              {selectedBuilding && !isLoading && imageLoaded && (
                <button
                  className="absolute cursor-pointer top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                  onClick={handleBackClick}
                >
                  <ArrowLeft size={16} />
                  {t("back")}
                </button>
              )}
            </div>
          </div>
          <div className="w-full xl:w-1/2">
            <div className=" bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 h-full hover:border-white/25 transition-all duration-700 ease-out">
              {renderRightPanel()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}