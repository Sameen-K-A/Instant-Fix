import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../../Contexts/AdminAuthContext";

const NotAdminProtector = ({ children }) => {
   const navigate = useNavigate();
   const { adminIsLogged } = useAdminAuthContext();

   useEffect(() => {
      if (adminIsLogged) {
         navigate("/admin/dashboard");
      }
   }, []);

   if (!adminIsLogged) {
      return children;
   }

};

export default NotAdminProtector;
