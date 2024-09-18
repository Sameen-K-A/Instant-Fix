import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";
import NotificationCard from "./Notification";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import notificationAudio from "/public/Audio/notificationAudio.wav";
import { GiQuickSlash } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_BASE_URL);

const TechnicianNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { userDetails } = useUserDetails();
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      socket.emit("joinTechnicianNoficationRoom", userDetails?.user_id);
      socket.on("notification_to_technician", (data) => {
        const audio = new Audio(notificationAudio);
        audio.play();
        toast(data.message);
      });
      return () => {
        socket.off("notification_to_technician");
      };
    }
  }, [userDetails]);

  return (
    <>
      <nav className="navbar navbar-light bg-light" style={{ zIndex: "9999" }}>
        <div className="container-fluid">
        <p className="navbar-brand mb-0 cursor-pointer" onClick={() => navigate("/technician")}><GiQuickSlash style={{ transform: 'rotate(-180deg)' }} className="text-primary" size={30} /><span className=" text-bold text-primary" style={{marginLeft:"-15px"}}>Instant Fix</span></p>
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