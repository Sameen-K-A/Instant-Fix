import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../../../public/images/userDefaultProfile.png";
import UserSideBar from "./UserSidebar";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { GiQuickSlash } from "react-icons/gi";

const UserNavbar = () => {
  const navigate = useNavigate();
  const { userDetails } = useUserDetails();
  const [imageLoaded, setImageLoaded] = useState(false);
  const userProfile = userDetails?.profileIMG;

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <p className="navbar-brand mb-0 cursor-pointer" onClick={() => navigate("/")}><GiQuickSlash style={{ transform: 'rotate(-180deg)' }} className="text-primary" size={30} /><span className=" text-bold text-primary" style={{ marginLeft: "-15px" }}>Instant Fix</span></p>
          <div className="d-flex align-items-center my-2">
            <p className="font-weight-bold text-dark text-sm mb-0 me-3 cursor-pointer bg-gradient-primary px-3 py-1 rounded-3 text-white" onClick={() => { navigate("/allTechnicians") }}>Book Technicians</p>
            {!userDetails && (
              <p className="text-dark text-sm mb-0 me-3 cursor-pointer" onClick={() => { navigate("/login") }}>Login</p>
            )}
            <div className="circle">
              {!imageLoaded && (
                <div className="border-radius-lg skeleton-loader" />
              )}
              <img src={userProfile ? `${userProfile}` : defaultProfile} width={"30px"} height={"30px"} alt="img" style={{ display: imageLoaded ? 'block' : 'none' }} onLoad={() => setImageLoaded(true)} />
            </div>
          </div>
        </div>
      </nav>
      <UserSideBar />
    </>
  );
}

export default UserNavbar; 