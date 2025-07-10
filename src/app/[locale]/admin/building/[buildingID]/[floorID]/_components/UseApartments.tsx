import { useQuery } from "@tanstack/react-query";
import { apartmentsAPI } from "@/routes/apartments";

export const useApartments = (
  buildingId: string,
  floorId: string,
  page: number,
  limit: number
) => {
  return useQuery({
    queryKey: ["apartments", buildingId, floorId, page, limit],
    queryFn: async () => {
      if (!buildingId || !floorId)
        return {
          apartments: [],
          pagination: {
            total: 0,
            page: 1,
            limit,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      try {
        return await apartmentsAPI.getList(buildingId, floorId, page, limit);
      } catch (error: any) {
        if (error.response?.data?.error === "NO_APARTMENTS_FOUND") {
          return {
            apartments: [],
            pagination: {
              total: 0,
              page: 1,
              limit,
              totalPages: 1,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    enabled: !!buildingId && !!floorId,
  });
};
