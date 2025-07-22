import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apartmentsAPI } from "@/routes/apartments";
import type { Apartment } from "@/types/apartmentList";

interface UpdateApartmentStatusProps {
  apartment: Apartment;
  isOpen: boolean;
  onClose: () => void;
  buildingId: string;
  floorId: string;
}

const APARTMENT_STATUSES = ["available", "sold", "reserved"];

const UpdateApartmentStatus = ({
  apartment,
  isOpen,
  onClose,
  buildingId,
  floorId,
}: UpdateApartmentStatusProps) => {
  const [status, setStatus] = useState<string>(apartment.status || "available");
  const sqmPrice = apartment.sqm_price || 0;
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: (data: {
      status: string;
      floor_plan_id: string | number;
      flat_number: string | number;
      sqm_price?: number;
    }) => apartmentsAPI.updateApartmentStatus(data),
    onSuccess: () => {
      setSuccessMessage("Apartment updated successfully!");
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["apartments", buildingId, floorId],
        });
        onClose();
      }, 200);
    },
    onError: (error: any) => {
      setUpdateError(
        error.message || "An error occurred while updating the apartment."
      );
    },
  });

  const handleUpdate = () => {
    setUpdateError(null);

    if (isNaN(sqmPrice) || sqmPrice < 0) {
      setUpdateError("Square meter price must be a valid non-negative number");
      return;
    }

    updateStatusMutation.mutate({
      status,
      floor_plan_id: String(floorId),
      flat_number: String(apartment.flat_number),
      sqm_price: Number(sqmPrice),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Apartment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {updateError && <div className="text-red-500">{updateError}</div>}
          {successMessage && (
            <div className="text-green-500">{successMessage}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="apartmentStatus" className="text-sm font-medium">
              Apartment Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value)}
              disabled={updateStatusMutation.isPending}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {APARTMENT_STATUSES.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {statusOption.charAt(0).toUpperCase() +
                      statusOption.slice(1).replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={updateStatusMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateApartmentStatus;
