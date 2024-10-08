import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AboutUS, Account, Booking, Chat, CloseSideBarIcon, Contact, Home, OpenSideBarIcon, PowerBtn, Worker } from '../../../public/svgs/Icons';
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import AlertRedDot from '../Common/AlertRedDot';
import { useUserDetails } from "../../Contexts/UserDetailsContext";
import { useUserAuthContext } from "../../Contexts/UserAuthContext";
import { toast } from 'sonner';
import userAxiosInstance from "../../Config/userInstance";
import '../../../public/Css/sidebar.css';

const UserSideBar = () => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(true);
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useUserDetails();
  const { setIsLogged } = useUserAuthContext();

  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  const handleLogout = () => {
    confirmAlert("Do you want to logout?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await userAxiosInstance.get("/logout");
            localStorage.removeItem("userDetails");
            localStorage.removeItem("userIsLogged");
            setUserDetails(null);
            setIsLogged(false);
            navigate("/");
          } catch (error) {
            toast.error("Something wrong please try again later");
          };
        };
      });
  };

  return (
    userDetails && (
      <div className="sidebar-container">
        <div className={`sidebar ${isSidebarClosed && 'close'} blur shadow-blur`}>
          <div className="expand-btn blur" onClick={toggleSidebar}>
            {isSidebarClosed ? <OpenSideBarIcon /> : <CloseSideBarIcon />}
          </div>
          <div className="menu-bar">
            <div className="menu">
              <ul className={`nav-links ${!isSidebarClosed && 'p-2'}`}>
                <li className="nav-link mb-2" onClick={() => navigate("/")} title={isSidebarClosed ? "Home" : undefined}>
                  <div className="icon"><Home /></div>
                  <span className="text">Home</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/accountdetails")} title={isSidebarClosed ? "Account details" : undefined}>
                  <div className="icon"><Account /></div>
                  <span className="text">Account details</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/chat")} title={isSidebarClosed ? "Chats" : undefined}>
                  <div className="icon"><Chat /></div>
                  <span className="text">Chats</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/bookingHistory")} title={isSidebarClosed ? "Bookings & History" : undefined}>
                  <div className="icon"><Booking /></div>
                  <span className="text">Bookings & History</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/contact")} title={isSidebarClosed ? "Contact" : undefined}>
                  <div className="icon"><Contact /></div>
                  <span className="text">Contact</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/aboutus")} title={isSidebarClosed ? "About us" : undefined}>
                  <div className="icon"><AboutUS /></div>
                  <span className="text">About us</span>
                </li>
                <li className="nav-link mb-2" onClick={() => navigate("/technician")} title={isSidebarClosed ? "Technician console" : undefined}>
                  <div className="icon"><Worker />{(userDetails?.addressDetails === null && userDetails?.isTechnician === true) && <AlertRedDot />}</div>
                  <span className="text">Technician console</span>
                </li>
                <li className="nav-link" onClick={handleLogout} title={isSidebarClosed ? "Logout" : undefined}>
                  <div className="icon"><PowerBtn color={"#341919"} /></div>
                  <span className="text">Logout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default UserSideBar;