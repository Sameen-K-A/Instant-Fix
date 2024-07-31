import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtecter = ({ children }) => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!userToken) {
      navigate("/login", {
        state: { message: "Authorization failed, please login" },
        replace: true
      });
    }
  }, []);

  if (userToken) {
    return children;
  }
};

export default UserProtecter;