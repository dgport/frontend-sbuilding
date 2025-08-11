"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import DesktopImage from "@/root/public/images/elisium/DesktopImage.avif";
import MobileImage from "@/root/public/images/elisium/MobileImage.jpg";
import Image from "next/image";
import { useMediaQuery } from "@/use-media-query";

import { useRouter } from "next/navigation";
import { useFloorStore } from "@/zustand/floorStore";
import Loader from "@/components/shared/loader/Loader";
import { useTranslations } from "next-intl";
import { getCoordinateAreas } from "@/constants/coordinants/statusFloorCoord";
import { FloorPlanImageOverlay } from "@/components/shared/apartment/FloorPlanImageOverlay";

const DESKTOP_ORIGINAL_W = 6000;
const DESKTOP_ORIGINAL_H = 3375;
const MOBILE_ORIGINAL_W = 2827;
const MOBILE_ORIGINAL_H = 3375;

const MemoizedFloorOverlay = React.memo(
  FloorPlanImageOverlay,
  (prev, next) =>
    prev.flatId === next.flatId &&
    prev.hoveredApartment === next.hoveredApartment &&
    prev.scaleX === next.scaleX &&
    prev.scaleY === next.scaleY &&
    prev.offsetX === next.offsetX &&
    prev.offsetY === next.offsetY &&
    JSON.stringify(prev.coords) === JSON.stringify(next.coords)
);
MemoizedFloorOverlay.displayName = "MemoizedFloorOverlay";

export default function SelectFloor() {
  const t = useTranslations("elysium");
  const [hoveredApartment, setHoveredApartment] = useState<number | null>(null);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { setBuildingContext, setCurrentFloor } = useFloorStore();

  const currentImageDimensions = useMemo(() => {
    if (isMobile) {
      return {
        width: MOBILE_ORIGINAL_W,
        height: MOBILE_ORIGINAL_H,
        aspectRatio: MOBILE_ORIGINAL_W / MOBILE_ORIGINAL_H,
      };
    }
    return {
      width: DESKTOP_ORIGINAL_W,
      height: DESKTOP_ORIGINAL_H,
      aspectRatio: DESKTOP_ORIGINAL_W / DESKTOP_ORIGINAL_H,
    };
  }, [isMobile]);

  const updateMetrics = useCallback(() => {
    const img = imageRef.current;
    const container = containerRef.current;
    if (!img || !container || !imageLoaded) return;

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      const { width: originalW, height: originalH } = currentImageDimensions;

      if (isMobile) {
        const containerAspectRatio = containerRect.width / containerRect.height;
        const imageAspectRatio = originalW / originalH;

        let scaleX, scaleY, offsetX, offsetY;

        if (imageAspectRatio > containerAspectRatio) {
          scaleY = containerRect.height / originalH;
          scaleX = scaleY;

          const renderedWidth = originalW * scaleX;
          offsetX = (containerRect.width - renderedWidth) / 2;
          offsetY = 0;
        } else {
          scaleX = containerRect.width / originalW;
          scaleY = scaleX;

          const renderedHeight = originalH * scaleY;
          offsetX = 0;
          offsetY = (containerRect.height - renderedHeight) / 2;
        }

        setScaleX(scaleX);
        setScaleY(scaleY);
        setOffsetX(offsetX);
        setOffsetY(offsetY);
      } else {
        const renderedWidth = imgRect.width;
        const renderedHeight = imgRect.height;

        const offsetX = imgRect.left - containerRect.left;
        const offsetY = imgRect.top - containerRect.top;

        const scaleX = renderedWidth / originalW;
        const scaleY = renderedHeight / originalH;

        setScaleX(scaleX);
        setScaleY(scaleY);
        setOffsetX(offsetX);
        setOffsetY(offsetY);
      }
    });
  }, [isMobile, currentImageDimensions, imageLoaded]);

  useEffect(() => {
    if (!imageLoaded) return;

    const timer = setTimeout(() => {
      updateMetrics();
    }, 100);

    return () => clearTimeout(timer);
  }, [imageLoaded, updateMetrics]);

  useEffect(() => {
    if (!imageLoaded) return;

    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateMetrics, 100);
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [imageLoaded, updateMetrics]);

  useEffect(() => {
    setImageLoaded(false);
    setScaleX(1);
    setScaleY(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [isMobile]);

  const handleFloorClick = useCallback(
    (floorId: number) => {
      setIsLoading(true);
      setBuildingContext("3", "6");
      setCurrentFloor(floorId);
      setTimeout(() => router.push("#"), 300);
    },
    [router, setBuildingContext, setCurrentFloor]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setIsLoading(false);
  }, []);

  const currentAreas = useMemo(() => getCoordinateAreas(isMobile), [isMobile]);
  const imageSource = isMobile ? MobileImage : DesktopImage;

  return (
    <section className="px-4 md:px-8 relative lg:px-40 py-10 min-h-screen font-geo2 tracking-widest">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="absolute inset-0 opacity-5">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="construction-grid"
                x="0"
                y="0"
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
                <rect
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#1e40af"
                  strokeWidth="0.3"
                />
                <circle cx="10" cy="10" r="2" fill="#1e40af" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#construction-grid)" />
          </svg>
        </div>
      </div>
      <div className="container2 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            {t("selectFloor")}
          </h1>
        </div>

        <div ref={containerRef} className="relative w-full">
          <div className="relative w-full bg-white/80 backdrop-blur-sm rounded-lg border-3 border-slate-500 overflow-hidden shadow-lg">
            {isLoading && <Loader />}

            <Image
              ref={imageRef}
              src={imageSource}
              alt="Floor plan"
              className={`w-full transition-opacity duration-300 ${
                isLoading ? "opacity-60" : ""
              }`}
              priority
              quality={100}
              sizes="(max-width: 768px) 100vw, 100vw"
              style={{
                objectFit: isMobile ? "cover" : "contain",
                objectPosition: "center",
                maxWidth: "100%",
                height: isMobile ? "70vh" : "auto",
                minHeight: isMobile ? "70vh" : "auto",
              }}
              onLoad={handleImageLoad}
            />

            {imageLoaded &&
              !isLoading &&
              scaleX > 0 &&
              scaleY > 0 &&
              currentAreas.map((area) => (
                <MemoizedFloorOverlay
                  key={area.id}
                  flatId={area.id}
                  flatNumber={area.id}
                  coords={area.coords}
                  hoveredApartment={hoveredApartment}
                  setHoveredApartment={setHoveredApartment}
                  handleFloorClick={() => handleFloorClick(area.id)}
                  scaleX={scaleX}
                  scaleY={scaleY}
                  offsetX={offsetX}
                  offsetY={offsetY}
                />
              ))}
            {hoveredApartment && imageLoaded && !isLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-6xl md:text-8xl opacity-70 pointer-events-none z-20 drop-shadow-lg">
                {hoveredApartment}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
