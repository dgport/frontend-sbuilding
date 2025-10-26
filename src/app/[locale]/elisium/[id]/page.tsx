"use client";

import type React from "react";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FloorSelector } from "./_components/FloorSelector";
import { ApartmentModal } from "./_components/ApartmentModal";
import { ApartmentTooltip } from "./_components/ApartmentTooltip";
import { FloorPlanSvg } from "./_components/FloorPlansvg";
import Image from "next/image";

const FLOORS = Array.from({ length: 22 }, (_, i) => i + 2);

export default function FloorPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [apartmentData, setApartmentData] = useState<any[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
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
        const response = await fetch(
          `https://sbuilding.bo.ge/api/property/${propertyId}`
        );

        if (!response.ok) throw new Error("Backend offline");

        const data = await response.json();
        const apartments = data.apartments || data;

        apartments.sort((a: any, b: any) => {
          const numA = Number.parseInt(a.name.replace(/[^\d]/g, ""), 10);
          const numB = Number.parseInt(b.name.replace(/[^\d]/g, ""), 10);
          return numA - numB;
        });

        setApartmentData(apartments);
        setPaths(data.paths || []);
      } catch {
        console.warn("Backend unreachable, loading local data...");
        const localData = await import(
          "@/app/[locale]/elisium/_components/apartments.json"
        );
        const pathsData = await import(
          "@/app/[locale]/elisium/_components/paths.json"
        );

        const sortedLocalData = localData.default.sort((a: any, b: any) => {
          const numA = Number.parseInt(a.name.replace(/[^\d]/g, ""), 10);
          const numB = Number.parseInt(b.name.replace(/[^\d]/g, ""), 10);
          return numA - numB;
        });

        setApartmentData(sortedLocalData);
        setPaths(pathsData.default);
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

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-6 lg:p-6 pt-20 lg:pt-24 overflow-hidden">
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
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-4 lg:p-0 overflow-hidden mb-16 sm:mb-20 lg:mb-0">
        <div className="relative w-full h-full flex items-center justify-center">
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
