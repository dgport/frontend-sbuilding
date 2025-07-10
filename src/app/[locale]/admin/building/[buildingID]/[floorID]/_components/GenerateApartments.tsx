"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apartmentsAPI } from "@/routes/apartments";

interface GenerateApartmentsProps {
  buildingId: string;
  floorPlanId: string;
  floorPlanName: string;
  onSuccess?: () => void;
}

const GenerateApartments = ({
  buildingId,
  floorPlanId,
  floorPlanName,
  onSuccess,
}: GenerateApartmentsProps) => {
  const [name, setName] = useState<string>(floorPlanName || "");
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (data: {
      building_id: string;
      name: string;
      floor_plan_id: string;
    }) => apartmentsAPI.generateApartments(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["apartments", buildingId, floorPlanId],
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error: any) => {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "An error occurred while generating apartments."
      );
      console.error("Error generating apartments:", error);
    },
  });

  const handleGenerate = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setError(null);
    generateMutation.mutate({
      building_id: buildingId,
      name: name,
      floor_plan_id: floorPlanId,
    });
  };

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {generateMutation.isSuccess && (
        <div className="text-green-500">Apartments generated successfully!</div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Apartments Name
        </label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter apartments name"
          disabled={generateMutation.isPending}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={generateMutation.isPending || !name.trim()}
        className="w-full"
      >
        {generateMutation.isPending ? "Generating..." : "Generate Apartments"}
      </Button>
    </div>
  );
};

export default GenerateApartments;
