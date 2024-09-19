import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const UserProtecter = ({ children }) => {
  const { isLogged } = useUserAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login", {
        state: { message: "Authorization failed, please login" },
        replace: true
      });
    }
  }, []);

  if (isLogged) {
    return children;
  }
};

export default UserProtecter;