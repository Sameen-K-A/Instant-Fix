import axios from "axios";
import { Base_URL } from "../credentials";

const userAxiosInstance = axios.create({
   baseURL: Base_URL,
   withCredentials: true,
});

export default userAxiosInstance;