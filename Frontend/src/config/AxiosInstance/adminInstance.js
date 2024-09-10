import axios from "axios";
import { Base_URL } from "../credentials";

const adminAxiosInstance = axios.create({
   baseURL: `${Base_URL}/admin`,
   withCredentials: true
});

export default adminAxiosInstance;