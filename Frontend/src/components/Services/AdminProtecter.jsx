import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminProtecter = ({ children }) => {

  const navigate = useNavigate();
  const adminToken = sessionStorage.getItem("adminToken");

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin", {
        state: { message: "Authorization failed please login" },
        replace: true
      });
    }
  })

  if (adminToken) {
    return children;
  }
}

export default AdminProtecter;