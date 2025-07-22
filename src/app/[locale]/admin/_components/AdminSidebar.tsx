"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Plus, Building, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { buildingsAPI } from "@/routes/building";
import { useState, KeyboardEvent, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BuildingsPage() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [buildingName, setBuildingName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [pendingAction, setPendingAction] = useState<"add" | "delete" | null>(
    null
  );
  const [pendingBuildingId, setPendingBuildingId] = useState<string | null>(
    null
  );

  const { data: buildings = [], isLoading } = useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const response = await buildingsAPI.get();
      return response.data;
    },
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const prefetchBuildings = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["buildings"],
      queryFn: async () => {
        const response = await buildingsAPI.get();
        return response.data;
      },
      staleTime: 30 * 1000,
    });
  }, [queryClient]);

  const verifyAdminPassword = (password: string) => {
    return password === "Adminuser111";
  };

  const addBuildingMutation = useMutation({
    mutationFn: async () => {
      if (!buildingName.trim()) {
        throw new Error("Building name cannot be empty");
      }
      const response = await buildingsAPI.post({ name: buildingName });
      return response.data;
    },
    onSuccess: (newBuilding) => {
      queryClient.setQueryData(["buildings"], (oldData: any[] = []) => {
        return [...oldData, newBuilding];
      });

      queryClient.invalidateQueries({ queryKey: ["buildings"] });

      toast.success("Building added successfully");
      setShowPasswordDialog(false);
      setBuildingName("");
      setAdminPassword("");
      setPasswordError("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to add building"
      );
    },
  });

  const deleteBuildingMutation = useMutation({
    mutationFn: async (buildingId: string) => {
      await buildingsAPI.delete(buildingId);
      return buildingId;
    },
    onSuccess: (deletedBuildingId) => {
      queryClient.setQueryData(["buildings"], (oldData: any[] = []) => {
        return oldData.filter((building) => building.id !== deletedBuildingId);
      });

      queryClient.invalidateQueries({ queryKey: ["buildings"] });

      toast.success("Building deleted successfully");
      setShowPasswordDialog(false);
      setAdminPassword("");
      setPasswordError("");
    },
    onError: (error) => {
      toast.error("Failed to delete building");
    },
  });

  const handleAddBuilding = () => {
    setShowPasswordDialog(true);
    setPendingAction("add");
    setPasswordError("");
    setAdminPassword("");
  };

  const handleDeleteBuilding = (buildingId: string) => {
    setShowPasswordDialog(true);
    setPendingAction("delete");
    setPendingBuildingId(buildingId);
    setPasswordError("");
    setAdminPassword("");
  };

  const handlePasswordConfirmation = () => {
    if (!verifyAdminPassword(adminPassword)) {
      setPasswordError("Incorrect admin password. Please try again.");
      return;
    }

    if (pendingAction === "add") {
      addBuildingMutation.mutate();
    } else if (pendingAction === "delete" && pendingBuildingId) {
      deleteBuildingMutation.mutate(pendingBuildingId);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePasswordConfirmation();
    }
  };

  const handleMouseEnter = () => {
    prefetchBuildings();
  };

  const isActiveBuilding = (building: any) => {
    return pathname?.includes(`/admin/building/${building.id}`);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setPasswordError("");
      setAdminPassword("");
      if (pendingAction === "add") {
        setBuildingName("");
      }
    }
    setShowPasswordDialog(open);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-64">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-[90vh]   mt-24" onMouseEnter={handleMouseEnter}>
      <div className="w-64 bg-gray-100 border-r p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Buildings</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAddBuilding}
            className="hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-grow">
          {buildings.length === 0 ? (
            <p className="text-center text-gray-500">No buildings</p>
          ) : (
            <div className="space-y-2">
              {buildings.map((building: any) => (
                <div key={building.id}>
                  <div
                    className={`flex justify-between items-center p-3 rounded cursor-pointer ${
                      isActiveBuilding(building)
                        ? "bg-blue-100"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    <Link
                      href={`/admin/building/${building.id}`}
                      className="w-full"
                    >
                      <div className="flex items-center space-x-2">
                        <Building className="h-5 w-5 text-gray-500" />
                        <span>{building.name}</span>
                      </div>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteBuildingMutation.isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBuilding(building.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="border-t border-gray-300 my-2"></div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto pb-4">
          <Button onClick={logout} variant="outline" className="w-full">
            Log out
          </Button>
        </div>
      </div>
      <Dialog open={showPasswordDialog} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "add"
                ? "Add New Building"
                : "Delete Building Confirmation"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {passwordError && (
              <Alert variant="destructive">
                <AlertDescription>{passwordError}</AlertDescription>
              </Alert>
            )}
            {pendingAction === "add" && (
              <Input
                placeholder="Enter Building Name"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
              />
            )}
            <Input
              type="password"
              placeholder="Enter Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button
              onClick={handlePasswordConfirmation}
              disabled={
                !adminPassword.trim() ||
                (pendingAction === "add" && !buildingName.trim())
              }
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
