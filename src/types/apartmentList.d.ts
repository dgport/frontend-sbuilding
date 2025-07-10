interface Apartment {
  id?: number;
  floor_plan_id: number;
  flat_id: number;
  flat_number: number;
  status: string;
  square_meters: number;
  images?: string[];
  floor: number;
  building_id: number;
  name: string;
  mobile_paths: string;
  desktop_paths: string
  sqm_price: number;
}

interface Floor {
  floor: number;
  apartments: Apartment[];
}

export interface FloorPlan {
  floor_plan_id: number;
  name: string;
  apartments: Floor[];
}

export interface ApartmentsResponse {
  status: string;
  message: string;
  pagination: PaginationMetadata;
  apartments: FloorPlan[];
}

export interface ApartmentsListProps {
  buildingId: string;
  floorId: string;
}