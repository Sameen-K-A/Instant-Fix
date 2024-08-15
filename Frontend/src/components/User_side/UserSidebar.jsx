import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../public/css/sidebar.css';
import { AboutUS, Account, Booking, Chat, CloseSideBarIcon, Contact, Home, Logout, OpenSideBarIcon, Worker } from '../../../public/svgs/Icons';
import confirmAlert from "../Common/SweetAlert/confirmAlert";

const UserSideBar = ({ userData }) => {
  const [isSidebarClosed, setIsSidebarClosed] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  const handleLogout = () => {
    confirmAlert("Do you want to logout?")
      .then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userDetails");
          navigate("/");
        }
      });
  };

  return (
    userData && (
      <>
        <div className="sidebar-container">
          <div className={`sidebar ${isSidebarClosed && 'close'}`}>
            <div className="expand-btn" onClick={toggleSidebar}>
              {isSidebarClosed ? <OpenSideBarIcon /> : <CloseSideBarIcon />}
            </div>
            <div className="menu-bar">
              <div className="menu">
                <ul className={`nav-links ${!isSidebarClosed && 'p-2'}`}>
                  <li className="nav-link mb-2" onClick={() => navigate("/")} title={isSidebarClosed && "Home"}>
                    <div className="icon"><Home /></div>
                    <span className="text">Home</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/accountdetails")} title={isSidebarClosed && "Account details"}>
                    <div className="icon"><Account /></div>
                    <span className="text">Account details</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/chat")} title={isSidebarClosed && "Chats"}>
                    <div className="icon"><Chat /></div>
                    <span className="text">Chats</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/bookingHistory")} title={isSidebarClosed && "Bookings & History"}>
                    <div className="icon"><Booking /></div>
                    <span className="text">Bookings & History</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/contact")} title={isSidebarClosed && "Contact"}>
                    <div className="icon"><Contact /></div>
                    <span className="text">Contact</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/aboutus")} title={isSidebarClosed && "About us"}>
                    <div className="icon"><AboutUS /></div>
                    <span className="text">About us</span>
                  </li>
                  <li className="nav-link mb-2" onClick={() => navigate("/technician")} title={isSidebarClosed && "Technician console"}>
                    <div className="icon"><Worker /></div>
                    <span className="text">Technician console</span>
                  </li>
                  <li className="nav-link" onClick={handleLogout} title={isSidebarClosed && "Logout"}>
                    <div className="icon"><Logout /></div>
                    <span className="text">Logout</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default UserSideBar;