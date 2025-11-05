import type React from "react";
import { SvgDefinitions } from "./SvgDefinitions";
import { ApartmentPath } from "./ApartmentPath";

interface ApartmentData {
  name: string;
  property_status: string;
  size: string | number;
  balcony: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
  sale_price: string | number;
}

interface StatusConfig {
  color: string;
  text: string;
  gradient: string;
  hoverGradient: string;
}

interface FloorPlanSvgProps {
  paths: string[];
  apartmentData: ApartmentData[];
  statusConfigs: StatusConfig[];
  hoveredIndex: number | null;
  onMouseMove: (e: React.MouseEvent, index: number) => void;
  onMouseLeave: () => void;
  onApartmentClick: (index: number) => void;
  pathRefs: React.MutableRefObject<(SVGPathElement | null)[]>;
  isMobile: boolean; // Add this
  floorPlanImage: string;
}

export function FloorPlanSvg({
  paths,
  apartmentData,
  statusConfigs,
  hoveredIndex,
  onMouseMove,
  onMouseLeave,
  onApartmentClick,
  pathRefs,
  isMobile,
  floorPlanImage, // Add this prop
}: FloorPlanSvgProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1280 800"
      preserveAspectRatio="xMidYMid meet"
      style={{ contain: "layout paint" }}
    >
      <SvgDefinitions floorPlanImage={floorPlanImage} />

      {paths.map((pathData, i) => {
        const apt = apartmentData[i];
        if (!apt) return null;

        return (
          <ApartmentPath
            key={i}
            pathData={pathData}
            apartment={apt}
            statusConfig={statusConfigs[i]}
            isHovered={hoveredIndex === i}
            onMouseMove={(e) => onMouseMove(e, i)}
            onMouseLeave={onMouseLeave}
            onClick={() => onApartmentClick(i)}
            onPathRef={(el) => {
              pathRefs.current[i] = el;
            }}
            isMobile={isMobile}
          />
        );
      })}
    </svg>
  );
}
