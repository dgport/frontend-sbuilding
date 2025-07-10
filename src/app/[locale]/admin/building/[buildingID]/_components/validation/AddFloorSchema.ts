import { z } from "zod";

export const floorPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  floor_range_start: z.string().min(1, "Floor range start is required"),
  floor_range_end: z.string().min(1, "Floor range end is required"),
  starting_apartment_number: z.string().min(1, "Starting apartment number is required"),
  apartments_per_floor: z.string().min(1, "Apartments per floor is required"),
});

export const defaultFloorPlanValues = {
  name: "",
  floor_range_start: "",
  floor_range_end: "",
  starting_apartment_number: "",
  apartments_per_floor: "",
};

export type FloorPlanFormValues = z.infer<typeof floorPlanSchema>;