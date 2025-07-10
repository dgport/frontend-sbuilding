"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DesktopImage from "@/root/public/images/status/StatusLarge.png";
import Image from "next/image";
import { useMediaQuery } from "@/use-media-query";
import { FloorOverlay } from "@/components/shared/overlay/FloorOverlay";
import { useRouter } from "next/navigation";
import { Building, Package, Home, ArrowUp, Calendar } from "lucide-react";
import { desktopAreas } from "@/constants/coordinants/statusFloorCoord";
import background from "@/root/public/images/bg-body.jpg";
import { useFloorStore } from "@/zustand/floorStore";
import Loader from "@/components/shared/loader/Loader";
import { useTranslations } from "next-intl";

const ORIGINAL_IMAGE_WIDTH = 1505;
const MOBILE_IMAGE_WIDTH = 1505;

const MemoizedFloorOverlay = React.memo(
  FloorOverlay,
  (prevProps, nextProps) => {
    return (
      prevProps.flatId === nextProps.flatId &&
      prevProps.hoveredApartment === nextProps.hoveredApartment &&
      prevProps.scaleFactor === nextProps.scaleFactor &&
      JSON.stringify(prevProps.coords) === JSON.stringify(nextProps.coords)
    );
  }
);
MemoizedFloorOverlay.displayName = "MemoizedFloorOverlay";

const BuildingStats = React.memo(() => {
  const t = useTranslations("status");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
          <div className="flex items-center mb-2">
            <Home className="h-5 w-5 mr-2 text-white" />
            <span className="text-sm text-white/80">{t("apartmentArea")}</span>
          </div>
          <div className=" text-2xl text-white">{t("areaRange")}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
          <div className="flex items-center mb-2">
            <ArrowUp className="h-5 w-5 mr-2 text-white" />
            <span className="text-sm text-white/80">{t("elevators")}</span>
          </div>
          <div className=" text-2xl text-white">{t("elevatorsCount")}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
          <div className="flex items-center mb-2">
            <Building className="h-5 w-5 mr-2 text-white" />
            <span className="text-sm text-white/80">{t("entrances")}</span>
          </div>
          <div className=" text-2xl text-white">{t("entrancesCount")}</div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 mr-2 text-white" />
            <span className="text-sm text-white/80">{t("completion")}</span>
          </div>
          <div className=" text-2xl text-white">{t("completionDate")}</div>
        </div>
        <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
          <div className="flex items-center mb-2">
            <Package className="h-5 w-5 mr-2 text-white" />
            <span className="text-md text-white/80">{t("materials")}</span>
          </div>
          <div className="text-white space-y-1">
            <div className="text-sm">• {t("gasBlock")}</div>
            <div className="text-sm">• {t("alucobond")}</div>
            <div className="text-sm">• {t("otisElevators")}</div>
          </div>
        </div>
      </div>
    </div>
  );
});
BuildingStats.displayName = "BuildingStats";

export default function StatusSelectFloor() {
  const t = useTranslations("status");
  const [hoveredApartment, setHoveredApartment] = useState<number | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const { setBuildingContext, setCurrentFloor } = useFloorStore();

  const updateScaleFactor = useCallback(() => {
    if (imageRef.current) {
      const currentImageWidth = imageRef.current.clientWidth;
      const baseWidth = isMobile ? MOBILE_IMAGE_WIDTH : ORIGINAL_IMAGE_WIDTH;
      setScaleFactor(currentImageWidth / baseWidth);
    }
  }, [isMobile]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScaleFactor, 100);
    };

    const resizeObserver = new ResizeObserver(debouncedUpdate);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", debouncedUpdate);

    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [updateScaleFactor]);

  const handleFloorClick = useCallback(
    (floorId: number) => {
      const buildingId = 3;
      const floorPlanId = 6;

      setIsLoading(true);

      setBuildingContext(buildingId.toString(), floorPlanId.toString());
      setCurrentFloor(floorId);

      setTimeout(() => {
        router.push(`/aisi-status/${buildingId}/${floorPlanId}`);
      }, 300);
    },
    [router, setBuildingContext, setCurrentFloor]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    updateScaleFactor();

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  }, [updateScaleFactor]);

  const stableSetHoveredApartment = useCallback((id: number | null) => {
    setHoveredApartment(id);
  }, []);

  const currentAreas = useMemo(() => desktopAreas, []);

  return (
    <section
      style={{ backgroundImage: `url(${background.src})` }}
      className="px-4 md:px-8 lg:px-16 py-10 bg-white min-h-screen font-geo2 tracking-widest"
    >
      <div className="container2">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl  font-semibold text-gray-900 mb-4">
            {t("selectFloor")}
          </h1>
        </div>
        <div className="flex flex-col xl:flex-row gap-8">
          <div ref={containerRef} className="relative w-full xl:w-2/3">
            <div className="relative w-full bg-gray-50 rounded-lg border-3 border-slate-500 overflow-hidden">
              {isLoading && <Loader />}

              <Image
                ref={imageRef}
                src={DesktopImage || "/placeholder.svg"}
                alt="Floor plan image"
                className={`w-full transition-opacity duration-300 ${
                  isLoading ? "opacity-60" : ""
                }`}
                priority
                onLoad={handleImageLoad}
              />

              {imageLoaded &&
                !isLoading &&
                currentAreas.map((area) => (
                  <MemoizedFloorOverlay
                    key={area.id}
                    flatId={area.id}
                    flatNumber={area.id}
                    coords={area.coords}
                    hoveredApartment={hoveredApartment}
                    setHoveredApartment={stableSetHoveredApartment}
                    handleFloorClick={() => handleFloorClick(area.id)}
                    scaleFactor={scaleFactor}
                  />
                ))}

              {hoveredApartment && imageLoaded && !isLoading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white  text-6xl md:text-8xl opacity-70 pointer-events-none z-20 drop-shadow-lg">
                  {hoveredApartment}
                </div>
              )}
            </div>
          </div>

          <div className="w-full xl:w-1/3">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 h-full hover:border-white/25 transition-all duration-700 ease-out">
              <h2 className="text-2xl  text-white mb-4 flex items-center">
                <Building className="mr-3 h-6 w-6 text-white" />
                {t("buildingOverview")}
              </h2>
              <BuildingStats />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}