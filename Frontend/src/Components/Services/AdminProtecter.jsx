import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuthContext } from "../../Contexts/AdminAuthContext";

const AdminProtecter = ({ children }) => {

  const navigate = useNavigate();
  const { adminIsLogged } = useAdminAuthContext();

  useEffect(() => {
    if (!adminIsLogged) {
      navigate("/admin", {
        state: { message: "Authorization failed please login" },
        replace: true
      });
    }
  })

  if (adminIsLogged) {
    return children;
  }
}

export default AdminProtecter;