import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Bell, Chat } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";
import NotificationCard from "./Notification";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import notificationAudio from "/public/Audio/notificationAudio.wav";
import { GiQuickSlash } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";

const socket = io(import.meta.env.VITE_BASE_URL);

const TechnicianNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLogged } = useUserAuthContext();

  useEffect(() => {
    if (userDetails) {
      socket.emit("joinTechnicianNoficationRoom", userDetails?.user_id);
      socket.emit("chatNotificationRoom", userDetails.user_id);
      socket.on("notification_to_technician", (data) => {
        const audio = new Audio(notificationAudio);
        audio.play();
        toast(data.message);
      });
      return () => {
        socket.off("notification_to_technician");
      };
    }
  }, []);

  useEffect(() => {
    socket.on(`AdminBlockMessage${userDetails?.user_id}`, (message) => {
      setIsLogged(false);
      navigate("/login", { state: { message: message?.message } });
    });
    socket.on("newChatNotification", (message) => {
      if (location.pathname !== "/technician/chat") {
        const audio = new Audio(notificationAudio);
        audio.play();
        toast(
          <div className="gap-2 d-flex justify-content-center align-items-center">
            <Chat /><span>{message}</span>
          </div>
        );
      };
    });
    return () => {
      socket.off("newChatNotification");
    };
  }, []);

  return (
    <>
      <nav className="navbar navbar-light bg-light" style={{ zIndex: "9999" }}>
        <div className="container-fluid">
          <p className="navbar-brand mb-0 cursor-pointer" onClick={() => navigate("/technician")}><GiQuickSlash style={{ transform: 'rotate(-180deg)' }} className="text-primary" size={30} /><span className=" text-bold text-primary" style={{ marginLeft: "-15px" }}>Instant Fix</span></p>
          <div className="d-flex align-items-center my-2">
            <div className="position-relative me-2">
              <p className="font-weight-bold text-dark text-sm mb-0 me-3  cursor-pointer" onClick={() => setShowNotification(true)}>
                <Bell />
                {userDetails?.technicianDetails[0]?.notifications.length > 0 && (
                  <span className="notification-count">{userDetails?.technicianDetails[0]?.notifications.length}</span>
                )}
              </p>
            </div>
            <div className="circle">
              <img src={`${userDetails?.profileIMG}`} width={"30px"} alt="img" />
            </div>
          </div>
        </div>
      </nav>
      <TechnicianSideBar />
      {showNotification && (
        <>
          <div className="modal-backdrop" onClick={() => setShowNotification(false)}></div>
          <div className="position-relative" style={{ zIndex: 2000 }}>
            <NotificationCard />
          </div>
        </>
      )}
    </>
  );
};

export default TechnicianNavbar;