"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { apartmentsAPI } from "@/routes/apartments";
import type { Apartment } from "@/types/apartmentList";

interface UpdateApartmentDialogProps {
  apartment: Apartment;
  isOpen: boolean;
  onClose: () => void;
  floorId: string;
  onSuccess: () => void;
}

const UpdateApartmentDialog = ({
  apartment,
  isOpen,
  onClose,
  floorId,
  onSuccess,
}: UpdateApartmentDialogProps) => {
  const [squareMeters, setSquareMeters] = useState<string>("");
  const [mobilePaths, setMobilePaths] = useState<string>("");
  const [desktopPaths, setDesktopPaths] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset form values when dialog opens or apartment changes
  useEffect(() => {
    if (isOpen && apartment) {
      setSquareMeters(apartment.square_meters.toString());
      setMobilePaths(apartment.mobile_paths || "");
      setDesktopPaths(apartment.desktop_paths || "");
      setImageFiles(null);
      setUpdateError(null);
      setSuccessMessage(null);
    }
  }, [isOpen, apartment]);

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      apartmentsAPI.updateSharedProperties(formData),
    onSuccess: () => {
      setSuccessMessage("Apartment updated successfully!");
      onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Error response:", error.response?.data);
      setUpdateError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred while updating the apartment."
      );
    },
  });

  const handleClose = () => {
    if (!updateMutation.isPending) {
      // Reset form state when closing
      setSquareMeters("");
      setMobilePaths("");
      setDesktopPaths("");
      setImageFiles(null);
      setUpdateError(null);
      setSuccessMessage(null);
      onClose();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files);
    }
  };

  const handleUpdate = async () => {
    if (apartment.flat_id === undefined) {
      console.error("Missing critical apartment data:", apartment);
      setUpdateError("Missing apartment data. Please try again.");
      return;
    }

    if (!squareMeters) {
      setUpdateError("Square meters is required.");
      return;
    }

    setUpdateError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("floor_plan_id", floorId.toString());
    formData.append("flat_id", apartment.flat_id.toString());
    formData.append("square_meters", squareMeters);
    formData.append("mobile_paths", mobilePaths);
    formData.append("desktop_paths", desktopPaths);

    if (imageFiles) {
      for (let i = 0; i < imageFiles.length; i++) {
        formData.append("images", imageFiles[i]);
      }
    }

    updateMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Apartment #{apartment.flat_number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {updateError && <div className="text-red-500">{updateError}</div>}
          {successMessage && (
            <div className="text-green-500">{successMessage}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="squareMeters">Square Meters</label>
            <Input
              id="squareMeters"
              type="number"
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mobilePaths">Mobile Paths</label>
            <Input
              id="mobilePaths"
              type="text"
              value={mobilePaths}
              onChange={(e) => setMobilePaths(e.target.value)}
              disabled={updateMutation.isPending}
              placeholder="Enter mobile paths"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="desktopPaths">Desktop Paths</label>
            <Input
              id="desktopPaths"
              type="text"
              value={desktopPaths}
              onChange={(e) => setDesktopPaths(e.target.value)}
              disabled={updateMutation.isPending}
              placeholder="Enter desktop paths"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="images">Images</label>
            <div className="flex items-center gap-2">
              <Input
                id="images"
                type="file"
                multiple
                onChange={handleImageChange}
                disabled={updateMutation.isPending}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("images")?.click()}
                disabled={updateMutation.isPending}
              >
                <Camera className="mr-2 h-4 w-4" />
                Select Images
              </Button>
              {imageFiles && <span>{imageFiles.length} files selected</span>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateApartmentDialog;
