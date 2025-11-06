"use client";

import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FloorSelector } from "./_components/FloorSelector";
import { ApartmentModal } from "./_components/ApartmentModal";
import { ApartmentTooltip } from "./_components/ApartmentTooltip";
import { FloorPlanSvg } from "./_components/FloorPlansvg";
import Image from "next/image";
import pathsData from "@/app/[locale]/elisium/_components/paths.json";
import pathsFloor2Data from "@/app/[locale]/elisium/_components/paths-floor2.json";
import { useTranslations } from "next-intl";

const FLOORS = Array.from({ length: 22 }, (_, i) => i + 2);

export default function FloorPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [allFloorsData, setAllFloorsData] = useState<Record<number, any[]>>({});
  const [paths, setPaths] = useState<string[]>(pathsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);

  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState<number>(3);

  // Get current floor's apartment data
  const apartmentData = useMemo(() => {
    return allFloorsData[currentFloor] || [];
  }, [allFloorsData, currentFloor]);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const router = useRouter();

  // Get floor plan image and paths based on current floor
  const floorPlanImage = useMemo(() => {
    return currentFloor === 2
      ? "/images/elisium/Gegma2.avif"
      : "/images/elisium/Gegma.avif";
  }, [currentFloor]);

  // Update paths when floor changes with smooth transition
  useEffect(() => {
    const newPaths = currentFloor === 2 ? pathsFloor2Data : pathsData;

    // Add a small delay for smooth transition effect
    const timer = setTimeout(() => {
      setPaths(newPaths);
    }, 150);

    return () => clearTimeout(timer);
  }, [currentFloor]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    params.then((resolvedParams) => {
      const floorId = Number.parseInt(resolvedParams.id);
      setCurrentFloor(floorId);

      // Don't set propertyId if we already have it
      if (!propertyId) {
        setPropertyId(resolvedParams.id);
      }
    });
  }, [params, propertyId]);

  useEffect(() => {
    if (!propertyId) return;

    // Check if we already have data for the current floor
    if (allFloorsData[currentFloor]) {
      setLoading(false);
      return;
    }

    const fetchFloorData = async () => {
      try {
        // Only show loading on first load
        if (Object.keys(allFloorsData).length === 0) {
          setLoading(true);
        }
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property/${currentFloor}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch property data: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load property data");
        }

        let apartments = result.data.apartments || [];

        apartments = apartments.filter(
          (item: any) =>
            item &&
            typeof item === "object" &&
            !Array.isArray(item) &&
            item.id &&
            item.name
        );

        // Update the state with new floor data
        setAllFloorsData((prev) => ({
          ...prev,
          [currentFloor]: apartments,
        }));
      } catch (err) {
        console.error("Error fetching apartments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchFloorData();
  }, [propertyId, currentFloor]);

  const handleFloorChange = (floor: number) => {
    // Just update the floor state, don't navigate
    setCurrentFloor(floor);
    // Update URL without reloading
    window.history.pushState({}, "", `/elisium/${floor}`);
  };

  const getStatusConfig = (status: string | number) => {
    const statusStr = String(status);

    if (statusStr === "1") {
      return {
        color: "#16a34a",
        text: "AVAILABLE",
        gradient: "freeGradient",
        hoverGradient: "freeHoverGradient",
      };
    } else if (statusStr === "2") {
      return {
        color: "#ef4444",
        text: "SOLD",
        gradient: "soldGradient",
        hoverGradient: "soldHoverGradient",
      };
    } else {
      return {
        color: "#ef4444",
        text: "SOLD",
        gradient: "soldGradient",
        hoverGradient: "soldHoverGradient",
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    // Only show tooltip on desktop and only for available apartments
    const apartment = apartmentData[index];
    const isSold = apartment && String(apartment.is_enabled) === "2";

    if (!isMobile && !isSold) {
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    // Only clear hover state on desktop
    if (!isMobile) {
      setHoveredIndex(null);
      setTooltipPosition(null);
    }
  };

  const handleApartmentClick = (index: number) => {
    // Check if apartment is sold (status 2)
    const apartment = apartmentData[index];
    const isSold = apartment && String(apartment.is_enabled) === "2";

    // If apartment is sold, don't open the modal
    if (isSold) {
      return;
    }

    // On mobile, go straight to modal
    // On desktop, also open modal (after showing tooltip)
    setSelectedApartment(index);

    // Clear hover state when modal opens
    if (!isMobile) {
      setHoveredIndex(null);
      setTooltipPosition(null);
    }
  };

  const t = useTranslations("elysium");
  const statusConfigs = useMemo(
    () => apartmentData.map((apt) => getStatusConfig(apt.is_enabled)),
    [apartmentData]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-y-hidden h-screen flex flex-col xl:flex-row xl:justify-center xl:items-center xl:gap-6 xl:px-6 pt-20 xl:pt-24 overflow-hidden">
      <FloorSelector
        floors={FLOORS}
        currentFloor={currentFloor}
        onFloorChange={handleFloorChange}
        isMobile={true}
      />
      <ApartmentModal
        apartment={
          selectedApartment !== null ? apartmentData[selectedApartment] : null
        }
        statusConfig={
          selectedApartment !== null ? statusConfigs[selectedApartment] : null
        }
        onClose={() => setSelectedApartment(null)}
      />
      {/* Only show tooltip on desktop */}
      {!isMobile && (
        <ApartmentTooltip
          apartment={hoveredIndex !== null ? apartmentData[hoveredIndex] : null}
          statusConfig={
            hoveredIndex !== null ? statusConfigs[hoveredIndex] : null
          }
          position={tooltipPosition}
        />
      )}
      <div className="relative flex-1 w-full h-full flex items-center justify-start xl:justify-center xl:p-0 mb-5 sm:mb-10 xl:mb-0 overflow-x-auto overflow-y-hidden xl:overflow-hidden">
        <div className="relative w-full h-full min-w-[1100px] xl:min-w-7xl flex items-center justify-center">
          {/* Default floor plan - always visible */}
          <Image
            src="/images/elisium/Gegma.avif"
            alt="Building"
            className="w-full h-full object-contain absolute inset-0"
            style={{
              opacity: currentFloor === 2 ? 0 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            width={1200}
            height={800}
          />

          {/* Floor 2 plan - fades in/out */}
          <Image
            src="/images/elisium/Gegma2.avif"
            alt="Building Floor 2"
            className="w-full h-full object-contain absolute inset-0"
            style={{
              opacity: currentFloor === 2 ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
            width={1200}
            height={800}
          />

          <FloorPlanSvg
            paths={paths}
            apartmentData={apartmentData}
            statusConfigs={statusConfigs}
            hoveredIndex={hoveredIndex}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onApartmentClick={handleApartmentClick}
            pathRefs={pathRefs}
            isMobile={isMobile}
            floorPlanImage={floorPlanImage}
          />
        </div>
      </div>
      <FloorSelector
        floors={FLOORS}
        currentFloor={currentFloor}
        onFloorChange={handleFloorChange}
        isMobile={false}
      />
    </div>
  );
}
