import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Base_URL } from "../../config/credentials";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";
import NotificationCard from "./Notification";
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import notificationAudio from "/public/Audio/notificationAudio.wav"

const socket = io(Base_URL);

const TechnicianNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { userDetails } = useUserDetails();
  const userProfile = userDetails?.profileIMG;

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
          <p className="navbar-brand mb-0">Logo</p>
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
              <img src={`${Base_URL}/${userProfile}`} width={"30px"} alt="img" />
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