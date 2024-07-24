import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserProtecter = ({ children }) => {

  const navigate = useNavigate();
  const userToken = sessionStorage.getItem("userToken");

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  })

  if (userToken) {
    return children;
  }
}

export default UserProtecter;