// store/floorStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FloorState {
  currentFloor: number;
  buildingId: string | null;
  floorPlanId: string | null;
  isTransitioning: boolean;
  setCurrentFloor: (floor: number) => void;
  setBuildingContext: (buildingId: string, floorPlanId: string) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  resetFloorState: () => void;
}

export const useFloorStore = create<FloorState>()(
  devtools(
    (set, get) => ({
      currentFloor: 2,
      buildingId: null,
      floorPlanId: null,
      isTransitioning: false,
      
      setCurrentFloor: (floor: number) => {
        const currentState = get();
        if (currentState.currentFloor !== floor) {
          set(
            {
              currentFloor: floor,
              isTransitioning: true,
            },
            false,
            'setCurrentFloor'
          );
          
          // Reset transitioning state after a short delay
          setTimeout(() => {
            set(
              { isTransitioning: false },
              false,
              'resetTransitioning'
            );
          }, 300);
        }
      },
      
      setBuildingContext: (buildingId: string, floorPlanId: string) => {
        const currentState = get();
        if (currentState.buildingId !== buildingId || currentState.floorPlanId !== floorPlanId) {
          set(
            {
              buildingId,
              floorPlanId,
              currentFloor: 2, // Reset to floor 1 when changing building/plan
              isTransitioning: false,
            },
            false,
            'setBuildingContext'
          );
        }
      },
      
      setIsTransitioning: (transitioning: boolean) => {
        set(
          { isTransitioning: transitioning },
          false,
          'setIsTransitioning'
        );
      },
      
      resetFloorState: () => {
        set(
          {
            currentFloor: 1,
            buildingId: null,
            floorPlanId: null,
            isTransitioning: false,
          },
          false,
          'resetFloorState'
        );
      },
    }),
    {
      name: 'floor-store',
    }
  )
);