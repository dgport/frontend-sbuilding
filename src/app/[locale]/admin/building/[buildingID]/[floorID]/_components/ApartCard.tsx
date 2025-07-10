import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, PencilIcon, Tag, Loader } from "lucide-react";
import type { Apartment } from "@/types/apartmentList";
import UpdateApartmentStatus from "./ApartStatusUpdate";
import Image from "next/image";

interface ApartmentCardProps {
  apartment: Apartment;
  onUpdate: () => void;
  buildingId: string;
  floorId: string;
}

const ApartmentCard = ({
  apartment,
  onUpdate,
  buildingId,
  floorId,
}: ApartmentCardProps) => {
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-red-100 text-red-800";
      case "reserved":
        return "bg-blue-100 text-blue-800";
      case "under_construction":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  

  const handleUpdateClick = () => {
    setIsStatusDialogOpen(true);
  };

  const handleStatusDialogClose = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsStatusDialogOpen(false);
      setIsUpdating(false);
    }, 500);
  };

  const handleManageClick = () => {
    setIsUpdating(true);
    onUpdate();
    setTimeout(() => {
      setIsUpdating(false);
    }, 500);
  };

  return (
    <div className="p-4 border rounded shadow relative">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold"># {apartment.flat_number}</h4>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            apartment.status
          )}`}
        >
          {apartment.status?.charAt(0).toUpperCase() +
            apartment.status?.slice(1).replace("_", " ")}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateClick}
            disabled={isUpdating}
            className="h-7 px-2 flex items-center"
          >
            {isUpdating ? (
              <Loader className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <PencilIcon className="w-3.5 h-3.5 mr-1" />
            )}
            <span className="text-xs">
              {isUpdating ? "Updating..." : "Update"}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7"
            onClick={handleManageClick}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Settings className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>
      {apartment.images &&
        Array.isArray(apartment.images) &&
        apartment.images.length > 0 && (
          <div className="grid grid-cols-2  gap-2 mb-3">
            {apartment.images.map((imagePath, index) => (
              <Image
                width={600}
                height={600}
                key={index}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${imagePath}`}
                alt={`Apartment ${apartment.flat_number} - Image ${index + 1}`}
                className="w-full h-40 object-cover rounded"
              />
            ))}
          </div>
        )}
      <div className="grid grid-cols-1 gap-1 mb-3 justify-center">
        <p className="flex items-center gap-1">
          <Tag className="h-3.5 w-3.5 mr-2 text-indigo-400" />
          <span className="font-semibold">Square Meters: </span>
          <span> {apartment.square_meters} m²</span>
        </p>
      </div>
      <UpdateApartmentStatus
        apartment={apartment}
        isOpen={isStatusDialogOpen}
        onClose={handleStatusDialogClose}
        buildingId={buildingId}
        floorId={floorId}
      />
    </div>
  );
};

export default ApartmentCard;
