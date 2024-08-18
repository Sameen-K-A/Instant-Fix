import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Base_URL } from "../../config/credentials";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";
import NotificationCard from "../Common/Notification";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";

const socket = io(Base_URL);

const TechnicianNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);

  const userData = JSON.parse(sessionStorage.getItem("userDetails"));
  const userProfile = userData?.profileIMG;

  const fetchBookingDetails = async () => {
    try {
      const response = await userAxiosInstance.get("/technician/fetchTechnicianBookingHistory", {
        params: {
          technicianUserID: userData?.user_id,
        },
      });
      sessionStorage.setItem("technicianBookings", JSON.stringify(response.data));
      setBookingDetailsArray(response.data);
    } catch (error) {
      toast.error("Can't fetch booking history, Please try again later");
    }
  };

  useEffect(() => {
    const bookingData = sessionStorage.getItem("technicianBookings");
    if (bookingData !== null) {
      setBookingDetailsArray(JSON.parse(bookingData));
    } else {
      fetchBookingDetails();
    }
  }, []);

  useEffect(() => {
    socket.emit("joinTechnicianNoficationRoom", userData?.user_id);
    socket.on("notification_to_technician", (data) => {
      toast(data.message);
      fetchBookingDetails();
    });
    return () => {
      socket.off("notification_to_technician");
    };
  }, [userData?.user_id]);

  const handleBackdropClick = () => {
    setShowNotification(false);
  };

  return (
    <>
      <nav className="navbar navbar-light bg-light" style={{ zIndex: "9999" }}>
        <div className="container-fluid">
          <p className="navbar-brand mb-0">Logo</p>
          <div className="d-flex align-items-center my-2">
            <p className="font-weight-bold text-dark text-sm mb-0 me-3 bell-icon cursor-pointer" onClick={() => setShowNotification(!showNotification)}><Bell /></p>
            <div className="circle">
              <img src={`${Base_URL}/${userProfile}`} width={"30px"} alt="img" />
            </div>
          </div>
        </div>
      </nav>
      <TechnicianSideBar />
      {showNotification && (
        <>
          <div className="modal-backdrop" onClick={handleBackdropClick}></div>
          <div className="position-relative" style={{ zIndex: 2000 }}>
            <NotificationCard bookingDetailsArray={bookingDetailsArray} />
          </div>
        </>
      )}
    </>
  );
};

export default TechnicianNavbar;