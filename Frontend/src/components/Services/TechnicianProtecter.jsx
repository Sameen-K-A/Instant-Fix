import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";
import { useUserDetails } from "../../Contexts/UserDetailsContext";

const TechnicianProtecter = ({ children }) => {
  const { isLogged } = useUserAuthContext();
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
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

  if (isLogged && userDetails?.isTechnician) {
    return children;
  };
};

export default TechnicianProtecter;
