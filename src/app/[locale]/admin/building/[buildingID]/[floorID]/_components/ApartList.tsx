"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Pagination from "@/components/shared/pagination/Pagination";
import GenerateApartments from "./GenerateApartments";
import type { Apartment } from "@/types/apartmentList";
import { useApartments } from "./UseApartments";
import EmptyState from "./EmptyState";
import UpdateApartmentDialog from "./ApartUpdate";
import ApartmentCard from "./ApartCard";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";

interface ApartmentsListProps {
  buildingId: string;
  floorId: string;
}

const ApartmentsList = ({ buildingId, floorId }: ApartmentsListProps) => {
  const [page, setPage] = useState(1);
  const limit = 15;
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] =
    useState<boolean>(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useApartments(
    buildingId,
    floorId,
    page,
    limit
  );

  const apartments = data?.apartments || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const isNoApartmentsError =
    error instanceof AxiosError &&
    error.response?.data?.error === "NO_APARTMENTS_FOUND";

  const hasNoApartments =
    !isLoading && (apartments.length === 0 || isNoApartmentsError);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const openUpdateDialog = (apartment: Apartment) => {
    setSelectedApartment(apartment);
    setIsDialogOpen(true);
  };

  const closeUpdateDialog = () => {
    setIsDialogOpen(false);
    setSelectedApartment(null);
  };

  const openGenerateDialog = () => {
    setIsGenerateDialogOpen(true);
  };

  const handleUpdateSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["apartments", buildingId, floorId],
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full px-10 py-5 pb-16">
      {error && !isNoApartmentsError ? (
        <div className="text-red-500 my-4">
          {typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Error fetching apartments."}
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center my-8">Loading apartments...</div>
      ) : (
        <>
          {hasNoApartments ? (
            <EmptyState onGenerate={openGenerateDialog} />
          ) : (
            <>
              {apartments.map((floorPlan) => (
                <div key={floorPlan.floor_plan_id} className="mb-8">
                  {floorPlan.apartments.map((floor) => (
                    <div key={floor.floor} className="mb-6">
                      <Button className=" bg-indigo-400 cursor-none mb-4">
                        Floor {floor.floor}
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {floor.apartments.map((apartment) => (
                          <ApartmentCard
                            key={apartment.flat_id}
                            apartment={apartment}
                            onUpdate={() => openUpdateDialog(apartment)}
                            buildingId={buildingId}
                            floorId={floorId}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </>
      )}

      {selectedApartment && (
        <UpdateApartmentDialog
          apartment={selectedApartment}
          isOpen={isDialogOpen}
          onClose={closeUpdateDialog}
          floorId={floorId}
          onSuccess={handleUpdateSuccess}
        />
      )}
      <Dialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Apartments</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <GenerateApartments
              buildingId={buildingId}
              floorPlanId={floorId}
              floorPlanName={`Floor Plan ${floorId}`}
              onSuccess={() => {
                setIsGenerateDialogOpen(false);
                queryClient.invalidateQueries({
                  queryKey: ["apartments", buildingId, floorId],
                });
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApartmentsList;
