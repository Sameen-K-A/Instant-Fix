import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import defaultProfile from "../../../public/Images/userDefaultProfile.png";
import UserSideBar from "./UserSidebar";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { GiQuickSlash } from "react-icons/gi";
import notificationAudio from "../../../public/Audio/notificationAudio.wav";
import io from "socket.io-client";
import { toast } from "sonner";
import { Chat } from "../../../public/svgs/Icons";

const socket = io(import.meta.env.VITE_BASE_URL);

const UserNavbar = () => {
  const navigate = useNavigate();
  const { userDetails } = useUserDetails();
  const [imageLoaded, setImageLoaded] = useState(false);
  const userProfile = userDetails?.profileIMG;
  const location = useLocation();

  useEffect(() => {
    if (userDetails) {
      socket.emit("chatNotificationRoom", userDetails.user_id);
    }
  }, []);

  useEffect(() => {
    socket.on("newChatNotification", (message) => {
      if (location.pathname !== "/chat") {
        const audio = new Audio(notificationAudio);
        audio.play();
        toast(
          <div className="gap-2 d-flex justify-content-center align-items-center">
            <Chat /><span>{message}</span>
          </div>
        );
      }
    });
    return () => {
      socket.off("newChatNotification");
    };
  }, []);

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