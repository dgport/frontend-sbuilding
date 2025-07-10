"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { floorPlansAPI } from "@/routes/floorPlans";
import { useApartmentPaths } from "@/hooks/UseApartmentsPaths";
import { FloorSelector } from "@/components/shared/floorInfo/FloorSelect";
import { useFloorStore } from "@/zustand/floorStore";
import { FloorPlanImage } from "@/components/shared/extra/FloorPlanImage";
import { PhotoGallery } from "@/components/shared/extra/PhotoGallery";
import { ArrowLeft } from "lucide-react";
import {
  STATUS_MAX_SIZE,
  STATUS_ORIGINAL_DIMENSIONS,
} from "@/constants/statusFloorSizes";
import Loader from "@/components/shared/loader/Loader";

interface ParamIds {
  buildingId: string;
  floorPlanId: string;
}

interface ApartmentImage {
  src: string;
  apartmentNumber: number;
  apartmentId: number;
  area?: number;
  status?: string;
}

const MemoizedFloorSelector = React.memo(FloorSelector);

export default function FloorPlanPage() {
  const [hoveredApartment, setHoveredApartment] = useState<number | null>(null);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const [selectedApartmentImages, setSelectedApartmentImages] = useState<
    ApartmentImage[]
  >([]);

  const params = useParams();
  const router = useRouter();
  const apartmentsDataCache = useRef<Map<string, any>>(new Map());

  const {
    currentFloor,
    buildingId: storeBuildingId,
    floorPlanId: storeFloorPlanId,
    setBuildingContext,
  } = useFloorStore();

  const parseIds = useCallback((): ParamIds => {
    const idArray = Array.isArray(params.id) ? params.id : [params.id];
    return {
      buildingId: idArray[0] || "",
      floorPlanId: idArray[1] || "",
    };
  }, [params.id]);

  const { buildingId, floorPlanId } = parseIds();

  useEffect(() => {
    if (
      buildingId &&
      floorPlanId &&
      (buildingId !== storeBuildingId || floorPlanId !== storeFloorPlanId)
    ) {
      setBuildingContext(buildingId, floorPlanId);
    }
  }, [
    buildingId,
    floorPlanId,
    storeBuildingId,
    storeFloorPlanId,
    setBuildingContext,
  ]);

  const hasValidIds = Boolean(buildingId && floorPlanId);

  const { data: floorPlans = [], isLoading: floorPlansLoading } = useQuery<
    any[]
  >({
    queryKey: ["floorPlanList", buildingId],
    queryFn: async () => {
      if (!buildingId) return [];
      return await floorPlansAPI.getList(buildingId);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: Boolean(buildingId),
  });

  const selectedFloorPlan = useMemo(() => {
    if (!floorPlans?.length || !floorPlanId) return null;
    return (
      floorPlans.find((plan) => plan.id.toString() === floorPlanId) || null
    );
  }, [floorPlans, floorPlanId]);

  const originalDimensions = useMemo(() => STATUS_ORIGINAL_DIMENSIONS, []);
  const maxDimensions = useMemo(() => STATUS_MAX_SIZE, []);

  const { data: apartmentsData } = useQuery({
    queryKey: ["apartments", buildingId, floorPlanId, currentFloor],
    queryFn: async () => {
      if (!hasValidIds || !currentFloor) return null;

      const cacheKey = `${buildingId}-${floorPlanId}-${currentFloor}`;

      if (apartmentsDataCache.current.has(cacheKey)) {
        return apartmentsDataCache.current.get(cacheKey);
      }

      const data = await floorPlansAPI.getApartments(
        buildingId,
        floorPlanId,
        currentFloor.toString()
      );

      apartmentsDataCache.current.set(cacheKey, data);
      return data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: hasValidIds && Boolean(currentFloor),
    select: (data) => data || { apartments: [] },
  });

  const { isMobile, apartmentAreas } = useApartmentPaths(apartmentsData);

  const handleApartmentClick = useCallback(
    (flatId: number, flatNumber: number) => {
      const apartmentInfo = apartmentsData?.apartments?.[0]?.apartments?.[0];
      if (!apartmentInfo) {
        console.warn("No apartment info found for the current floor plan.");
        return;
      }

      const apartmentData = apartmentInfo.apartments?.find(
        (apartment: any) => Number(apartment.flat_number) === flatNumber
      );

      if (apartmentData?.images?.length > 0) {
        const baseURL =
          process.env.NEXT_PUBLIC_IMAGE_URL ||
          (typeof window !== "undefined" ? window.location.origin : "");

        const apartmentImages = apartmentData.images.map((image: string) => ({
          src: `${baseURL}${image}`,
          apartmentNumber: flatNumber,
          apartmentId: flatId,
          area: apartmentData.square_meters
            ? Number.parseFloat(apartmentData.square_meters)
            : undefined,
          status: apartmentData.status,
        }));

        setSelectedApartmentImages(apartmentImages);
        setIsPhotoViewOpen(true);

        setTimeout(() => {
          const firstPhotoElement = document.querySelector(
            `[data-apartment-trigger="${flatId}"]`
          ) as HTMLElement;
          firstPhotoElement?.click();
        }, 100);
      } else {
        alert(`No images available for Apartment #${flatNumber}`);
      }
    },
    [apartmentsData]
  );

  const handlePhotoGalleryClose = useCallback(() => {
    setIsPhotoViewOpen(false);
    setSelectedApartmentImages([]);
  }, []);

  if (floorPlansLoading && !floorPlans.length) {
    return <Loader />;
  }

  return (
    <>
      <main
        className={`fixed inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 overflow-y-auto ${
          isMobile ? "" : ""
        }`}
      >
        <div className="flex items-center justify-between w-full px-4 py-6">
          <button
            onClick={() => router.back()}
            className="bg-white/10 backdrop-blur-sm cursor-pointer hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 shadow-lg border border-white/20"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 flex justify-center">
            <MemoizedFloorSelector
              buildingId={buildingId}
              floorPlanId={floorPlanId}
              floorRangeStart={selectedFloorPlan?.floor_range_start}
              floorRangeEnd={selectedFloorPlan?.floor_range_end}
            />
          </div>
          <div className="w-[52px]"></div>
        </div>
        <div className="flex-1 ">
          <FloorPlanImage
            selectedFloorPlan={selectedFloorPlan}
            floorPlanId={floorPlanId}
            originalDimensions={originalDimensions}
            maxDimensions={maxDimensions}
            isMobile={isMobile}
            apartmentAreas={apartmentAreas}
            hoveredApartment={hoveredApartment}
            setHoveredApartment={setHoveredApartment}
            handleApartmentClick={handleApartmentClick}
            currentFloor={currentFloor}
          />
        </div>
      </main>

      <PhotoGallery
        images={selectedApartmentImages}
        isOpen={isPhotoViewOpen}
        onClose={handlePhotoGalleryClose}
        buildingId={buildingId}
        floorNumber={currentFloor}
      />
    </>
  );
}
