import { axiosInstance } from "@/utils/axiosInstance";
import Cookies from "js-cookie";

export const floorPlansAPI = {
  getList: async (id: string) => {
    const response = await axiosInstance.get(`/floor_plans/${id}`);
    return response.data;
  },

  deletePlan: async (id: string) => {
    const response = await axiosInstance.delete(`/delete_plan/${id}`);
    return response.data;
  },

  addPlan: async (formData: FormData) => {
    const token = Cookies.get("token");
    const response = await axiosInstance.post(`/add_floor_plan`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    return response.data;
  },

  getApartments: async (
    buildingId: string,
    floorPlanId?: string,
    floor?: string,
    page: number = 1,
    limit: number = 20
  ) => {
    let url = `/apartments/${buildingId}`;
    if (floorPlanId) {
      url += `/${floorPlanId}`;
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (floor !== undefined) {
      params.append("floor", floor.toString());
    }

    url += `?${params.toString()}`;

    const response = await axiosInstance.get(url);
    return response.data;
  },
};
