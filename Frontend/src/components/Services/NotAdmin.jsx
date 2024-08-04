import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotAdminProtector = ({ children }) => {
   const navigate = useNavigate();
   const adminToken = sessionStorage.getItem("adminToken");

   useEffect(() => {
      if (adminToken) {
         navigate("/admin/dashboard");
      }
   }, []);

   if (!adminToken) {
      return children;
   }

};

export default NotAdminProtector;
