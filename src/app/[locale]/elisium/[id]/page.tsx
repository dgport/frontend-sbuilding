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

const FLOORS = Array.from({ length: 22 }, (_, i) => i + 2);

export default function FloorPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [apartmentData, setApartmentData] = useState<any[]>([]);
  const [paths] = useState<string[]>(pathsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(
    null
  );

  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState<number>(3);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    params.then((resolvedParams) => {
      const floorId = Number.parseInt(resolvedParams.id);
      setPropertyId(resolvedParams.id);
      setCurrentFloor(floorId);
    });
  }, [params]);

  useEffect(() => {
    if (!propertyId) return;

    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call YOUR backend endpoint
        const response = await fetch(
          `http://localhost:3001/api/property/${propertyId}`
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

        console.log("Filtered apartments:", apartments);

        setApartmentData(apartments);
      } catch (err) {
        console.error("Error fetching apartments:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [propertyId]);

  const handleFloorChange = (floor: number) => {
    setCurrentFloor(floor);
    router.push(`/elisium/${floor}`);
  };

  const getStatusConfig = (status: string) => {
    if (status === "1") {
      return {
        color: "#16a34a",
        text: "AVAILABLE",
        gradient: "freeGradient",
        hoverGradient: "freeHoverGradient",
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
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    });
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPosition(null);
  };

  const statusConfigs = useMemo(
    () => apartmentData.map((apt) => getStatusConfig(apt.property_status)),
    [apartmentData]
  );

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading floor plan...</p>
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
    <div className="w-full overflow-y-hidden h-screen flex flex-col xl:flex-row  xl:justify-center xl:items-center xl:gap-6 xl:px-6 pt-20 xl:pt-24 overflow-hidden">
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
      <ApartmentTooltip
        apartment={hoveredIndex !== null ? apartmentData[hoveredIndex] : null}
        statusConfig={
          hoveredIndex !== null ? statusConfigs[hoveredIndex] : null
        }
        position={tooltipPosition}
      />
      <div className="relative flex-1 w-full h-full flex items-center justify-start xl:justify-center xl:p-0 mb-5 sm:mb-10 xl:mb-0 overflow-x-auto overflow-y-hidden xl:overflow-hidden">
        <div className="relative w-full h-full min-w-[1100px]  xl:min-w-7xl flex items-center justify-center">
          <Image
            src="/images/elisium/Gegma.png"
            alt="Building"
            className="w-full h-full object-contain"
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
            onApartmentClick={setSelectedApartment}
            pathRefs={pathRefs}
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
