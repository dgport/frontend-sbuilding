
export interface FloorPlan {
    id: number;
    name: string;
    building_id: number;
    floor_range_start: number;
    floor_range_end: number;
    starting_apartment_number: number;
    apartments_per_floor: number;
    desktop_paths: Record<string, string>;
    mobile_paths: Record<string, string>;
    desktop_image: string;
    mobile_image: string;
  }