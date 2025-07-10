"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DesktopImage from "@/root/public/images/goderdzi/FloorSelectDesktop.jpg";
import MobileImage from "@/root/public/images/goderdzi/FloorSelectMobile.jpg";
import Image from "next/image";
import { useMediaQuery } from "@/use-media-query";
import { FloorOverlay } from "@/components/shared/overlay/FloorOverlay";
import { useRouter } from "next/navigation";
import {
  Building,
  Layers,
  Home,
  Calendar,
  Waves,
  Dumbbell,
} from "lucide-react";
import {
  desktopAreas,
  mobileAreas,
} from "@/constants/coordinants/goderdziFloorCoord";
import background from "@/root/public/images/bg-body.jpg";
import { useFloorStore } from "@/zustand/floorStore";
import Loader from "@/components/shared/loader/Loader";
import { useTranslations } from "next-intl";

const ORIGINAL_IMAGE_WIDTH = 1920;
const MOBILE_IMAGE_WIDTH = 1457;

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

export default function GoderdziSelectFloor() {
  const t = useTranslations("goderdzi");
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
      const buildingId = 1;
      const floorPlanId = 1;

      setIsLoading(true);

      setBuildingContext(buildingId.toString(), floorPlanId.toString());
      setCurrentFloor(floorId);

      setTimeout(() => {
        router.push(`/aisi-goderdzi/${buildingId}/${floorPlanId}`);
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

  const currentImage = useMemo(
    () => (isMobile ? MobileImage : DesktopImage),
    [isMobile]
  );
  const currentAreas = useMemo(
    () => (isMobile ? mobileAreas : desktopAreas),
    [isMobile]
  );

  return (
    <section
      style={{ backgroundImage: `url(${background.src})` }}
      className="px-4 md:px-8 lg:px-16 py-10 bg-white min-h-[600px] font-geo2 tracking-widest"
    >
      <div className="container2">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("selectFloor")}
          </h1>
        </div>
        <div className="flex flex-col xl:flex-row gap-8">
          <div ref={containerRef} className="relative w-full xl:w-2/3">
            <div className="relative w-full bg-gray-50 rounded-lg border-3 border-slate-500 overflow-hidden">
              {isLoading && <Loader />}

              <Image
                ref={imageRef}
                src={currentImage || "/placeholder.svg"}
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
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-6xl md:text-8xl opacity-70 pointer-events-none z-20 drop-shadow-lg">
                  {hoveredApartment}
                </div>
              )}
            </div>
          </div>

          <div className="w-full xl:w-1/3">
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 h-full hover:border-white/25 transition-all duration-700 ease-out">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Building className="mr-3 h-6 w-6 text-white" />
                {t("buildingOverview")}
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
                    <div className="flex items-center mb-2">
                      <Layers className="h-5 w-5 mr-2 text-white" />
                      <span className="text-md text-white/80">
                        {t("totalFloors")}
                      </span>
                    </div>
                    <div className="font-bold text-2xl text-white">4</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
                    <div className="flex items-center mb-2">
                      <Home className="h-5 w-5 mr-2 text-white" />
                      <span className="text-md text-white/80">
                        {t("totalUnits")}
                      </span>
                    </div>
                    <div className="font-bold text-2xl text-white">36</div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300 hover:scale-[1.02] transform-gpu">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 mr-2 text-white" />
                      <span className="text-md text-white/80">
                        {t("completion")}
                      </span>
                    </div>
                    <div className="font-bold text-2xl text-white">2027</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 backdrop-blur-2xl border-2 border-white/10 p-4 rounded-2xl hover:border-white/25 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Waves className="h-5 w-5 mr-2 text-blue-400" />
                    {t("amenities")}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-md text-white/80">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                      {t("pool")}
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                      {t("sauna")}
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                      {t("billiards")}
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-blue-400 rounded-full mr-2"></div>
                      <Dumbbell className="h-3 w-3 mr-1" />
                      {t("gym")}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 backdrop-blur-2xl border-2 border-emerald-400/20 p-4 rounded-2xl hover:border-emerald-400/40 transition-all duration-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-md text-white/80">
                        {t("minSize")}
                      </span>
                      <span className="text-white font-semibold">39 m²</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-md text-white/80">
                        {t("pricePerSqm")}
                      </span>
                      <span className="text-emerald-400 font-bold">
                        $1,500+
                      </span>
                    </div>
                    <div className="text-sm text-white/60 mt-2">
                      {t("fullRenovation")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}