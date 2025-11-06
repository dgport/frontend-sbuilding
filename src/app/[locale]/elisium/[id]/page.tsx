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
  // Store ALL apartments data grouped by floor
  const [allFloorsData, setAllFloorsData] = useState<Record<number, any[]>>({});
  const [paths, setPaths] = useState<string[]>(pathsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [currentFloor, setCurrentFloor] = useState<number>(3);

  // Get current floor's apartment data with safety check
  const apartmentData = useMemo(() => {
    const floorData = allFloorsData[currentFloor] || [];

    // Ensure we have the right number of apartments for the paths
    const expectedCount =
      currentFloor === 2 ? pathsFloor2Data.length : pathsData.length;

    if (floorData.length !== expectedCount) {
      console.warn(
        `Apartment count mismatch: Expected ${expectedCount}, got ${floorData.length} for floor ${currentFloor}`
      );
    }

    return floorData;
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

  // Use image path as key to force re-render when image changes
  const renderKey = useMemo(() => {
    return currentFloor === 2 ? "floor2-image" : "default-image";
  }, [currentFloor]);

  // Update paths when floor changes
  useEffect(() => {
    const newPaths = currentFloor === 2 ? pathsFloor2Data : pathsData;
    setPaths(newPaths);
  }, [currentFloor]);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set initial floor from params
  useEffect(() => {
    params.then((resolvedParams) => {
      const floorId = Number.parseInt(resolvedParams.id);
      setCurrentFloor(floorId);
    });
  }, [params]);

  // Fetch ALL apartments data ONCE on mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/property`
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

        // Log the first apartment to see its structure
        console.log("Sample apartment data:", apartments[0]);

        // Group apartments by floor
        const groupedByFloor: Record<number, any[]> = {};

        apartments.forEach((apt: any) => {
          // Try different possible floor property names
          const floor =
            apt.floor || apt.floor_number || apt.level || apt.floor_id;

          // If floor property doesn't exist, try to extract from apartment name
          // For example: "301" -> floor 3, "1205" -> floor 12
          let floorNum = floor;
          if (!floorNum && apt.name) {
            const match = apt.name.match(/^(\d{1,2})/);
            if (match) {
              floorNum = parseInt(match[1]);
            }
          }

          if (floorNum) {
            if (!groupedByFloor[floorNum]) {
              groupedByFloor[floorNum] = [];
            }
            groupedByFloor[floorNum].push(apt);
          }
        });

        // Sort apartments within each floor
        Object.keys(groupedByFloor).forEach((floorKey) => {
          groupedByFloor[Number(floorKey)].sort((a: any, b: any) => {
            const numA = parseInt(a.name?.replace(/[^\d]/g, "") || "0", 10);
            const numB = parseInt(b.name?.replace(/[^\d]/g, "") || "0", 10);
            return numA - numB;
          });
        });

        console.log("Grouped apartments by floor:", groupedByFloor);

        // Store ALL grouped apartments
        setAllFloorsData(groupedByFloor);
      } catch (err) {
        console.error("Error fetching apartments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []); // Only run once on mount

  const handleFloorChange = (floor: number) => {
    const currentImage = currentFloor === 2 ? "gegma2" : "gegma";
    const newImage = floor === 2 ? "gegma2" : "gegma";

    // If image is changing, reload the page
    if (currentImage !== newImage) {
      window.location.href = `/elisium/${floor}`;
    } else {
      // Same image, just update state
      setCurrentFloor(floor);
      window.history.pushState({}, "", `/elisium/${floor}`);
    }
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
    if (!isMobile) {
      setHoveredIndex(null);
      setTooltipPosition(null);
    }
  };

  const handleApartmentClick = (index: number) => {
    const apartment = apartmentData[index];
    const isSold = apartment && String(apartment.is_enabled) === "2";

    if (isSold) {
      return;
    }

    setSelectedApartment(index);

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
            key={renderKey}
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
