import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestProtector = ({ children }) => {
  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("userToken");

  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, []);

  if (!userToken) {
    return children;
  }

};

export default GuestProtector;
