import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, Booking, Chat, Home, Leave, PowerBtn, Settings, Wallet } from '../../../public/svgs/Icons';
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import '../../../public/css/techniciansidebar.css';

const TechnicianSidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    confirmAlert("Do you want to logout?")
      .then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userDetails");
          sessionStorage.removeItem("technicianBookings");
          navigate("/");
        }
      });
  };

  return (
    <div className={`technicianSidebar-container ${showMore ? 'expanded' : ''}`}>
      <div className="techniciansidebar card p-2 mb-3 border-1 me-3">
        <ul className="nav-links">
          <li className="nav-link" onClick={() => setShowMore(!showMore)}>
            <div className="icon"><Settings /></div>
            <div className="tooltip">More</div>
          </li>

          {showMore && (
            <div className="more-options">
              <li className="nav-link" onClick={() => navigate("/technician")}>
                <div className="icon"><Home /></div>
                <div className="tooltip">Home</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/accountdetails")}>
                <div className="icon"><Account /></div>
                <div className="tooltip">Account details</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/chat")}>
                <div className="icon"><Chat /></div>
                <div className="tooltip">Chats</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/technicianBookingHistory")}>
                <div className="icon"><Booking /></div>
                <div className="tooltip">Bookings & History</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/wallet")}>
                <div className="icon"><Wallet /></div>
                <div className="tooltip">Wallet</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/")}>
                <div className="icon"><Leave /></div>
                <div className="tooltip">Leave from console</div>
              </li>
              <li className="nav-link" onClick={handleLogout}>
                <div className="icon"><PowerBtn color={"#22C55E"} /></div>
                <div className="tooltip">Logout</div>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TechnicianSidebar;