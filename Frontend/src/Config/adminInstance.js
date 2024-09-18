import axios from "axios";

const adminAxiosInstance = axios.create({
   baseURL: `${import.meta.env.VITE_BASE_URL}/admin`,
   withCredentials: true
});

export default adminAxiosInstance;