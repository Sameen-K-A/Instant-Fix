import axios from "axios";
import { Base_URL } from "../credentials";

const userAxiosInstance = axios.create({
   baseURL: Base_URL,
});

userAxiosInstance.interceptors.request.use(
   (config) => {
      const accessToken = sessionStorage.getItem("userToken");
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      return config;
   },
   (error) => {
      throw error;
   }
);

export default userAxiosInstance;