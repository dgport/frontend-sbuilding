import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ApartmentData {
  name: string;
  property_status: string;
}

interface StatusConfig {
  color: string;
  text: string;
  gradient: string;
  hoverGradient: string;
}

interface ApartmentPathProps {
  pathData: string;
  apartment: ApartmentData;
  statusConfig: StatusConfig;
  isHovered: boolean;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onPathRef: (el: SVGPathElement | null) => void;
}

export function ApartmentPath({
  pathData,
  apartment,
  statusConfig,
  isHovered,
  onMouseMove,
  onMouseLeave,
  onClick,
  onPathRef,
}: ApartmentPathProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [center, setCenter] = useState({ x: 640, y: 400 });

  useEffect(() => {
    if (pathRef.current) {
      try {
        const bbox = pathRef.current.getBBox();
        setCenter({
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2,
        });
      } catch {
        console.warn("Could not get bbox for path");
      }
    }
  }, [pathData]);

  const handleRef = (el: SVGPathElement | null) => {
    pathRef.current = el;
    onPathRef(el);
  };

  const fillGradient = isHovered
    ? `url(#${statusConfig.hoverGradient})`
    : `url(#${statusConfig.gradient})`;

  return (
    <g
      style={{
        zIndex: isHovered ? 99999 : 1,
        position: "relative",
      }}
    >
      {/* Shadow placeholder that stays in place */}
      <path
        d={pathData}
        fill="rgba(0, 0, 0, 0.2)"
        stroke="rgba(0, 0, 0, 0.25)"
        strokeWidth="2"
        className="pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <g
        style={{
          transform: isHovered ? "translateY(-32px)" : "translateY(0)",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          willChange: isHovered ? "transform" : "auto",
        }}
        filter={isHovered ? "url(#liftShadow)" : "none"}
      >
        {/* Clipped background image that moves with the apartment */}
        <path
          d={pathData}
          fill="url(#bgImage)"
          className="pointer-events-none"
          opacity="1"
        />

        {/* White border layer */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth={isHovered ? "6" : "4"}
          className="transition-all duration-300 pointer-events-none"
        />

        {/* Colored overlay layer */}
        <path
          ref={handleRef}
          d={pathData}
          fill={fillGradient}
          stroke={statusConfig.color}
          strokeWidth={isHovered ? "4" : "2"}
          className="transition-all duration-300 cursor-pointer"
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onClick={onClick}
          style={{
            pointerEvents: "all",
            filter: isHovered ? "url(#glow)" : "none",
          }}
        />

        {/* Apartment number circle and label */}
        <g className="pointer-events-none" style={{ isolation: "isolate" }}>
          <circle
            cx={center.x}
            cy={center.y}
            r="24"
            fill="white"
            stroke={statusConfig.color}
            strokeWidth={isHovered ? "4" : "3"}
            opacity="1"
            className="transition-all duration-300"
            style={{
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
            }}
          />

          <text
            x={center.x}
            y={center.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-bold select-none transition-all duration-300"
            fill={statusConfig.color}
            fontSize={isHovered ? "20" : "18"}
            style={{
              paintOrder: "stroke fill",
              stroke: "white",
              strokeWidth: "3px",
              strokeLinejoin: "round",
            }}
          >
            {apartment.name}
          </text>

          <circle
            cx={center.x + 20}
            cy={center.y - 20}
            r="5"
            fill={statusConfig.color}
            stroke="white"
            strokeWidth="2.5"
            className="transition-all duration-300"
            style={{
              transform: isHovered ? "scale(1.4)" : "scale(1)",
              transformOrigin: `${center.x + 20}px ${center.y - 20}px`,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        </g>
      </g>
    </g>
  );
}
