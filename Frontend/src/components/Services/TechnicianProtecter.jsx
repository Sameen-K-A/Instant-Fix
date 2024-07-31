import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TechnicianProtecter = ({ children }) => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("userToken");
  const userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

  useEffect(() => {
    if (!userToken) {
      navigate("/login", {
        state: { message: "Authorization failed please login" },
        replace: true
      });
      return;
    }
    if (!userDetails?.isTechnician) {
      navigate("/technician/joinTechnician", {
        state: { message: "Please fulfill your details." },
        replace: true
      });
      return;
    }
  }, []);

  if (userToken && userDetails?.isTechnician) {
    return children;
  }
};

export default TechnicianProtecter;
