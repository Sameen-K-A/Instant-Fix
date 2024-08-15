import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, Booking, Chat, CloseSideBarIcon, Home, Logout, OpenSideBarIcon, Wallet } from '../../../public/svgs/Icons';
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import '../../../public/css/sidebar.css';

const TechnicianSidebar = () => {
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
    <div className="sidebar-container">
      <div className={`sidebar ${isSidebarClosed && 'close'}`}>
        <div className="expand-btn" onClick={toggleSidebar}>
          {isSidebarClosed ? <OpenSideBarIcon /> : <CloseSideBarIcon />}
        </div>
        <div className="menu-bar">
          <div className="menu">
            <ul className={`nav-links ${!isSidebarClosed && 'p-2'}`}>
              <li className="nav-link mb-2" onClick={() => navigate("/technician")} title={isSidebarClosed && "Home"}>
                <div className="icon"><Home /></div>
                <span className="text">Home</span>
              </li>
              <li className="nav-link mb-2" onClick={() => navigate("/technician/accountdetails")} title={isSidebarClosed && "Account details"}>
                <div className="icon"><Account /></div>
                <span className="text">Account details</span>
              </li>
              <li className="nav-link mb-2" onClick={() => navigate("/technician/chat")} title={isSidebarClosed && "Chats"}>
                <div className="icon"><Chat /></div>
                <span className="text">Chats</span>
              </li>
              <li className="nav-link mb-2" onClick={() => navigate("/technician/technicianBookingHistory")} title={isSidebarClosed && "Bookings & History"}>
                <div className="icon"><Booking /></div>
                <span className="text">Bookings & History</span>
              </li>
              <li className="nav-link mb-2" onClick={() => navigate("/technician/wallet")} title={isSidebarClosed && "About us"}>
                <div className="icon"><Wallet /></div>
                <span className="text">Wallet</span>
              </li>
              <li className="nav-link mb-2" onClick={() => navigate("/")} title={isSidebarClosed && "Technician console"}>
                <div className="icon"><Account /></div>
                <span className="text">User console</span>
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
  )
};

export default TechnicianSidebar;