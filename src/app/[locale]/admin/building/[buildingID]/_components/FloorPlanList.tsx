"use client";

import { useState } from "react";
import {
  AlertCircle,
  Building,
  Eye,
  FolderOpen,
  Home,
  ImageOff,
  Loader2,
  Trash2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FloorPlan } from "@/types/floorPlan";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { floorPlansAPI } from "@/routes/floorPlans";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";

const FloorPlanList = () => {
  const params = useParams();
  const buildingId = params.buildingID as string;
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState("");

  const { data: floorPlans = [], isLoading } = useQuery({
    queryKey: ["floorPlanList", buildingId],
    queryFn: async () => {
      try {
        const data = await floorPlansAPI.getList(buildingId);
        return data;
      } catch (err) {
        console.error("Error fetching floor plans:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await floorPlansAPI.deletePlan(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["floorPlanList"],
      });

      handleCloseDialog();
    },
    onError: (err) => {
      console.error("Error deleting floor plan:", err);
    },
  });

  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setPasswordInput("");
    setPasswordError("");
    setIsDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === "Adminuser111") {
      if (planToDelete) {
        deleteMutation.mutate(planToDelete);
      }
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPlanToDelete(null);
    setPasswordInput("");
    setPasswordError("");
  };

  return (
    <section className="w-full  ">
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-gray-500 font-medium">Loading floor plans...</p>
          </div>
        </div>
      ) : floorPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <FolderOpen className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center mb-2 text-lg font-medium">
            No floor plans found
          </p>
          <p className="text-gray-400 text-center max-w-md">
            Add new floor plans to see them displayed here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {floorPlans.map((plan: FloorPlan) => (
              <Card
                key={plan.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-200 border border-gray-200 rounded-xl group"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {plan.desktop_image ? (
                    <Image
                      width={600}
                      height={600}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${plan.desktop_image}`}
                      alt={`Floor plan ${plan.name}`}
                      className="object-cover w-full h-full  transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                      <ImageOff className="w-12 h-12 mr-2 opacity-40" />
                      <span className="font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/90 text-red-500 hover:bg-white hover:text-red-600 rounded-full h-8 w-8 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteClick(plan.id.toString())}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5">
                  <h3 className="font-semibold text-lg mb-4 line-clamp-1 text-gray-800">
                    {plan.name}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-3 mb-5">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2 text-indigo-400" />
                      <p>
                        <span className="text-gray-500">Floors:</span>{" "}
                        {plan.floor_range_start} - {plan.floor_range_end}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-2 text-indigo-400" />
                      <p>
                        <span className="text-gray-500">Units per floor:</span>{" "}
                        {plan.apartments_per_floor}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/building/${buildingId}/${plan.id}`}
                    className="block w-full"
                  >
                    <Button className="w-full bg-indigo-500 hover:bg-indigo-600 transition-colors">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-600">
              Please enter admin password to delete this floor plan. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {passwordError && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{passwordError}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4">
            <label
              htmlFor="password"
              className="text-sm font-medium mb-2 block text-gray-700"
            >
              Admin Password
            </label>
            <Input
              id="password"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter password"
              className="mt-1"
              autoFocus
            />
          </div>

          <DialogFooter className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handlePasswordSubmit}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FloorPlanList;
