
import { axiosInstance } from "@/utils/axiosInstance";
import { ApartmentsResponse } from "@/types/apartmentList";

export const apartmentsAPI = {
  getList: async (buildingId: string, floorId: string, page = 1, limit = 20) => {
    const response = await axiosInstance.get<ApartmentsResponse>(
      `/apartments/${buildingId}/${floorId}?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  
  updateSharedProperties: async (formData: FormData) => {
    const response = await axiosInstance.put("/update_shared_properties", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  generateApartments: async (data: {
    building_id: number | string;
    name: string;
    floor_plan_id: number | string;
  }) => {
    const response = await axiosInstance.post("/add_apartments", data);
    return response.data;
  },
  updateApartmentStatus: async (data: {
    status: string;
    floor_plan_id: string | number;
    flat_number: string | number;
    sqm_price?: number;
  }) => {
 
    const requestData = {
      ...data,
      floor_plan_id: String(data.floor_plan_id),
      flat_number: String(data.flat_number),
    };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/update_apartment_status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update apartment');
    }
    
    return response.json();
  }

  
};