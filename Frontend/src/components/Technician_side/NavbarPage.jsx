import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Base_URL } from "../../config/credentials";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";
import NotificationCard from "../Common/Notification";
import userAxiosInstance from "../../config/AxiosInstance/userInstance";
import { useUserDetails } from "../../Contexts/UserDetailsContext";

const socket = io(Base_URL);

const TechnicianNavbar = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [bookingDetailsArray, setBookingDetailsArray] = useState([]);
  const {userDetails, setUserDetails} = useUserDetails();
  const userProfile = userDetails?.profileIMG;

  const fetchBookingDetails = async () => {
    try {
      const response = await userAxiosInstance.get("/technician/fetchTechnicianBookingHistory", { params: { technicianUserID: userDetails?.user_id } });
      sessionStorage.setItem("technicianBookings", JSON.stringify(response.data));
      setBookingDetailsArray(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else {
        toast.error("Can't fetch booking history, Please try again later");
      }
    }
  };

  const fetchTechnicianInformation = async () => {
    try {
      const response = await userAxiosInstance.get("/technician/fetchTechnicianInformation", { params: { technicianUserID: userDetails?.user_id } });
      const afterFetching = { ...userDetails, technicianDetails: [{ ...response.data }] };
      setUserDetails(afterFetching);
      sessionStorage.setItem("userDetails", JSON.stringify(afterFetching));
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login", { state: { message: "Authorization failed, please login" } });
      } else {
        toast.error("Can't fetch booking slots information, Please try again later");
      }
    }
  };

  useEffect(() => {
    const bookingData = sessionStorage.getItem("technicianBookings");
    if (bookingData !== null) {
      setBookingDetailsArray(JSON.parse(bookingData));
    } else {
      fetchBookingDetails();
    }
  }, [userDetails?.user_id]);

  useEffect(() => {
    if (userDetails) {
      socket.emit("joinTechnicianNoficationRoom", userDetails?.user_id);
      socket.on("notification_to_technician", (data) => {
        toast(data.message);
        fetchBookingDetails();
        fetchTechnicianInformation();
      });
      return () => {
        socket.off("notification_to_technician");
      };
    }
  }, [userDetails]);

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