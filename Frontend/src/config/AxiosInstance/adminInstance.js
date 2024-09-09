import axios from "axios";
import { Base_URL } from "../credentials";

const adminAxiosInstance = axios.create({
   baseURL: `${Base_URL}/admin`,
   withCredentials: true
});

adminAxiosInstance.interceptors.request.use(
   (config) => {
      const accessToken = sessionStorage.getItem("adminToken");
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return config;
   },
   (error) => {
      throw error;
   }
);

export default adminAxiosInstance;