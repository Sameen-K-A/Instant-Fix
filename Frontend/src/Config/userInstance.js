import axios from "axios";

const userAxiosInstance = axios.create({
   baseURL: import.meta.env.VITE_BASE_URL,
   withCredentials: true,
});

export default userAxiosInstance;