import { useEffect, useRef, useState } from "react";

/**
 * Keeps the maximum set of available floors ever seen.
 * Only expands, never shrinks.
 */
export function useStableFloors(availableFloors: number[]): number[] {
  const initialFloorsRef = useRef<number[]>([]);
  const [floors, setFloors] = useState<number[]>([]);

  useEffect(() => {
    if (availableFloors.length === 0) return;
    // On first load, set initial
    if (initialFloorsRef.current.length === 0) {
      initialFloorsRef.current = [...availableFloors];
      setFloors([...availableFloors]);
    }
    // If new data is larger, expand
    else if (availableFloors.length > initialFloorsRef.current.length) {
      initialFloorsRef.current = [...availableFloors];
      setFloors([...availableFloors]);
    }
    // Otherwise, ignore smaller arrays (do not shrink)
  }, [availableFloors]);

  return floors.length > 0 ? floors : availableFloors;
}
