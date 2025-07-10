"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { floorPlansAPI } from "@/routes/floorPlans";
import {
  defaultFloorPlanValues,
  FloorPlanFormValues,
  floorPlanSchema,
} from "./validation/AddFloorSchema";

const AddFloorPlan = ({ onSuccess }: { onSuccess: () => void }) => {
  const params = useParams();
  const buildingID = params.buildingID as string;
  const queryClient = useQueryClient();
  const [formValues, setFormValues] = useState<FloorPlanFormValues>({
    ...defaultFloorPlanValues,
  });
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof FloorPlanFormValues, string>>
  >({});

  const [desktopImage, setDesktopImage] = useState<File | null>(null);
  const [mobileImage, setMobileImage] = useState<File | null>(null);

  const addFloorPlanMutation = useMutation({
    mutationFn: floorPlansAPI.addPlan,
    onSuccess: () => {
      toast.success("Floor plan created successfully");
      queryClient.invalidateQueries({
        queryKey: ["floorPlanList"],
      });
      resetForm();
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating floor plan:", error);
      toast.error("Failed to create floor plan");
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof FloorPlanFormValues]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const resetForm = () => {
    setFormValues({ ...defaultFloorPlanValues });
    setFormErrors({});
    setDesktopImage(null);
    setMobileImage(null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "desktop" | "mobile"
  ) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "desktop") {
        setDesktopImage(e.target.files[0]);
      } else {
        setMobileImage(e.target.files[0]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = floorPlanSchema.safeParse(formValues);

    if (!validationResult.success) {
      const formattedErrors: Partial<
        Record<keyof FloorPlanFormValues, string>
      > = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof FloorPlanFormValues;
        formattedErrors[path] = err.message;
      });

      setFormErrors(formattedErrors);
      return;
    }

    if (!desktopImage || !mobileImage) {
      toast.error("Both desktop and mobile images are required");
      return;
    }

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("building_id", buildingID);
    formData.append("desktop_image", desktopImage);
    formData.append("mobile_image", mobileImage);
    addFloorPlanMutation.mutate(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Floor Plan</CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Building ID
              </label>
              <input
                type="text"
                value={buildingID}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Floor Plan Name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor Range Start
              </label>
              <input
                type="number"
                name="floor_range_start"
                value={formValues.floor_range_start}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {formErrors.floor_range_start && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.floor_range_start}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Floor Range End
              </label>
              <input
                type="number"
                name="floor_range_end"
                value={formValues.floor_range_end}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {formErrors.floor_range_end && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.floor_range_end}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Starting Apartment Number
              </label>
              <input
                type="number"
                name="starting_apartment_number"
                value={formValues.starting_apartment_number}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {formErrors.starting_apartment_number && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.starting_apartment_number}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apartments per Floor
              </label>
              <input
                type="number"
                name="apartments_per_floor"
                value={formValues.apartments_per_floor}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {formErrors.apartments_per_floor && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.apartments_per_floor}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Desktop Image
              </label>
              <input
                type="file"
                name="desktop_image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "desktop")}
                className="mt-1 block w-full"
              />
              {!desktopImage && (
                <p className="text-red-500 text-sm mt-1">
                  Desktop image is required
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile Image
              </label>
              <input
                type="file"
                name="mobile_image"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "mobile")}
                className="mt-1 block w-full"
              />
              {!mobileImage && (
                <p className="text-red-500 text-sm mt-1">
                  Mobile image is required
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addFloorPlanMutation.isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
            >
              {addFloorPlanMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Floor Plan"
              )}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddFloorPlan;
