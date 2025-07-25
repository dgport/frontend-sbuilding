"use client";

import { useState, useEffect } from "react";

interface Coordinate {
  x: number;
  y: number;
}

interface ApartmentArea {
  flatId: number;
  flatNumber: number;
  status: string;
  coords: Coordinate[];
}

interface ApartmentData {
  apartments?: Array<{
    apartments: Array<{
      apartments: Array<{
        flat_id: number;
        flat_number: number;
        status: string;
        mobile_paths?: string;
        desktop_paths?: string;
        [key: string]: any;
      }>;
    }>;
  }>;
}

export function useApartmentPaths(apartmentsData: ApartmentData | undefined) {
  const [isMobile, setIsMobile] = useState(false);
  const [apartmentAreas, setApartmentAreas] = useState<ApartmentArea[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!apartmentsData || !apartmentsData.apartments?.length) {
      setApartmentAreas([]);
      return;
    }

    const parsedAreas: ApartmentArea[] = [];
    const pathType = isMobile ? "mobile_paths" : "desktop_paths";

    apartmentsData.apartments.forEach((floorPlan) => {
      floorPlan.apartments.forEach((floorGroup) => {
        floorGroup.apartments.forEach((apartment) => {
          if (apartment[pathType]) {
            try {
              const pathString = apartment[pathType].trim();

              const coordValues = pathString
                .split(",")
                .map((val) => val.trim())
                .filter(Boolean)
                .map(Number);

              if (coordValues.some(isNaN)) {
                console.error(
                  `Invalid coordinate values in ${pathType} for apartment ${apartment.flat_id}`
                );
                return;
              }

              const coords: Coordinate[] = [];

              for (let i = 0; i < coordValues.length; i += 2) {
                if (i + 1 < coordValues.length) {
                  coords.push({
                    x: coordValues[i],
                    y: coordValues[i + 1],
                  });
                }
              }

              if (coords.length >= 3) {
                parsedAreas.push({
                  flatId: apartment.flat_id,
                  flatNumber: apartment.flat_number,
                  status: apartment.status,
                  coords: coords,
                });
              } else {
                console.warn(
                  `Not enough coordinates for apartment ${apartment.flat_id}, found ${coords.length} points`
                );
              }
            } catch (error) {
              console.error(
                `Error parsing ${pathType} for apartment ${apartment.flat_id}:`,
                error
              );
            }
          }
        });
      });
    });

    setApartmentAreas(parsedAreas);
  }, [apartmentsData, isMobile]);

  return { isMobile, apartmentAreas };
}
