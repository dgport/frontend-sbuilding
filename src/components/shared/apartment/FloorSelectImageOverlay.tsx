"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useFloorStore } from "@/zustand/floorStore";
import "swiper/css";
import "swiper/css/free-mode";

interface FloorSelectImageOverlayProps {
  floorRangeStart: number | undefined;
  floorRangeEnd: number | undefined;
  buildingId: string;
  floorPlanId: string;
  disabled?: boolean;
}

export const FloorSelectImageOverlay = React.memo(
  ({
    floorRangeStart,
    floorRangeEnd,
    buildingId,
    floorPlanId,
    disabled = false,
  }: FloorSelectImageOverlayProps) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [centerFloor, setCenterFloor] = useState(1);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInitializedRef = useRef(false);
    const lastNavigatedFloorRef = useRef(1);
    const isNavigatingRef = useRef(false);

    const {
      currentFloor,
      isTransitioning,
      setCurrentFloor,
      setBuildingContext,
    } = useFloorStore();

    const [swiperStyle, setSwiperStyle] = useState({
      height: "60px",
      cursor: disabled ? "default" : "grab",
      opacity: disabled || isTransitioning ? 0.7 : 1,
    });

    const availableFloors = React.useMemo(() => {
      if (
        typeof floorRangeStart !== "number" ||
        typeof floorRangeEnd !== "number" ||
        floorRangeStart > floorRangeEnd
      ) {
        return [];
      }
      return Array.from(
        { length: floorRangeEnd - floorRangeStart + 1 },
        (_, i) => floorRangeStart + i
      );
    }, [floorRangeStart, floorRangeEnd]);

    // Set building context when component mounts or building/plan changes
    useEffect(() => {
      if (buildingId && floorPlanId) {
        setBuildingContext(buildingId, floorPlanId);
      }
    }, [buildingId, floorPlanId, setBuildingContext]);

    const findCenterFloor = useCallback(() => {
      if (!swiperRef.current || availableFloors.length === 0)
        return currentFloor;

      const swiper = swiperRef.current;
      const activeIndex = Math.round(
        swiper.progress * (availableFloors.length - 1)
      );
      const clampedIndex = Math.max(
        0,
        Math.min(activeIndex, availableFloors.length - 1)
      );

      return availableFloors[clampedIndex];
    }, [availableFloors, currentFloor]);

    const handleSlideChange = useCallback(() => {
      if (!swiperRef.current || disabled || isNavigatingRef.current) return;

      const newCenterFloor = findCenterFloor();
      if (newCenterFloor === undefined) return;

      setCenterFloor(newCenterFloor);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (
        newCenterFloor !== currentFloor &&
        newCenterFloor !== lastNavigatedFloorRef.current
      ) {
        timeoutRef.current = setTimeout(() => {
          isNavigatingRef.current = true;
          lastNavigatedFloorRef.current = newCenterFloor;
          setCurrentFloor(newCenterFloor);
        }, 500);
      }
    }, [findCenterFloor, currentFloor, setCurrentFloor, disabled]);

    const scrollToFloor = useCallback(
      (floor: number, animate = true) => {
        if (!swiperRef.current || availableFloors.length === 0) return;

        const floorIndex = availableFloors.indexOf(floor);
        if (floorIndex === -1) return;

        const progress = floorIndex / (availableFloors.length - 1);
        const validProgress = isNaN(progress) ? 0 : progress;

        swiperRef.current.setProgress(validProgress, animate ? 500 : 0);
      },
      [availableFloors]
    );

    // Initialize swiper position based on current floor from store
    useEffect(() => {
      if (
        swiperRef.current &&
        availableFloors.length > 0 &&
        !isInitializedRef.current
      ) {
        const timer = setTimeout(() => {
          scrollToFloor(currentFloor, false);
          setCenterFloor(currentFloor);
          isInitializedRef.current = true;
          lastNavigatedFloorRef.current = currentFloor;
        }, 100);

        return () => clearTimeout(timer);
      }

      // Update swiper when floor changes from external source (not from swiper interaction)
      if (
        isInitializedRef.current &&
        currentFloor !== lastNavigatedFloorRef.current &&
        !isNavigatingRef.current
      ) {
        scrollToFloor(currentFloor, true);
        setCenterFloor(currentFloor);
        lastNavigatedFloorRef.current = currentFloor;
      }

      // Reset navigation flag when floor matches
      if (currentFloor === lastNavigatedFloorRef.current) {
        isNavigatingRef.current = false;
      }
    }, [currentFloor, scrollToFloor, availableFloors]);

    useEffect(() => {
      setSwiperStyle({
        height: "60px",
        cursor: disabled ? "default" : "grab",
        opacity: disabled || isTransitioning ? 0.7 : 1,
      });
    }, [disabled, isTransitioning]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    if (availableFloors.length === 0) {
      return null;
    }

    return (
      <div
        style={{
          width: "300px",
          height: "60px",
          margin: "0 auto",
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <Swiper
          modules={[FreeMode, Mousewheel]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            if (!isInitializedRef.current) {
              setCenterFloor(currentFloor);
            }
          }}
          onSlideChange={handleSlideChange}
          onProgress={handleSlideChange}
          spaceBetween={10}
          slidesPerView={5}
          centeredSlides={true}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.5,
            momentumVelocityRatio: 0.5,
          }}
          mousewheel={{
            enabled: true,
            sensitivity: 1,
          }}
          grabCursor={!disabled}
          allowTouchMove={!disabled}
          style={swiperStyle}
        >
          {availableFloors.map((floor) => (
            <SwiperSlide key={floor}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60px",
                  fontSize: floor === centerFloor ? "24px" : "16px",
                  fontWeight: floor === centerFloor ? "bold" : "normal",
                  color: "white",
                  transition: "all 0.3s ease",
                  userSelect: "none",
                  transform: floor === centerFloor ? "scale(1.3)" : "scale(1)",
                  zIndex: floor === centerFloor ? 10 : 1,
                  position: "relative",
                }}
              >
                {floor}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these specific props change
    return (
      prevProps.floorRangeStart === nextProps.floorRangeStart &&
      prevProps.floorRangeEnd === nextProps.floorRangeEnd &&
      prevProps.buildingId === nextProps.buildingId &&
      prevProps.floorPlanId === nextProps.floorPlanId &&
      prevProps.disabled === nextProps.disabled
    );
  }
);

FloorSelectImageOverlay.displayName = "FloorSelectImageOverlay";
