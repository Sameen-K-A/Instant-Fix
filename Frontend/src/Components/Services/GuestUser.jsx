import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const GuestProtector = ({ children }) => {
  const navigate = useNavigate();
  const { isLogged } = useUserAuthContext();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, []);

  if (!isLogged) {
    return children;
  }

};

export default GuestProtector;