import { axiosInstance } from "@/utils/axiosInstance";

export const buildingsAPI = {
    post: async (submitData: object) => {
      const response = await axiosInstance.post(`/add_building`, submitData);
      return response.data;
    },
    get: async () => {
        const response = await axiosInstance.get(`/buildings`);
          
      return response.data;
    },
    getById: async (id: string,) => {
      const response = await axiosInstance.get(`/building/${id}`);
      return response.data;
    },
    
    delete: async (id: string) => {
        const response = await axiosInstance.delete(`/delete_building/${id}`);
        return response.data;
      },

    
  };



 