import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, Booking, Calendar, Chat, Home, Leave, PowerBtn, Settings, Wallet } from '../../../public/svgs/Icons';
import confirmAlert from "../Common/SweetAlert/confirmAlert";
import AlertRedDot from "../Common/AlertRedDot";
import { useUserDetails } from '../../Contexts/UserDetailsContext';
import userAxiosInstance from "../../Config/userInstance";
import {useUserAuthContext} from "../../Contexts/UserAuthContext";
import '../../../public/css/techniciansidebar.css';

const TechnicianSidebar = () => {
  const [showMore, setShowMore] = useState(false);
  const { userDetails, setUserDetails } = useUserDetails();
  const { setIsLogged } = useUserAuthContext();
  const navigate = useNavigate();

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
    <div className={`technicianSidebar-container ${showMore ? 'expanded' : ''}`}>
      <div className="techniciansidebar card p-2 mb-3 border-1 me-3">
        <ul className="nav-links">
          <li className="nav-link" onClick={() => setShowMore(!showMore)}>
            <div className="icon d-flex blur shadow-blur"><Settings />{(userDetails?.addressDetails === null && userDetails?.isTechnician === true && showMore === false) && <AlertRedDot />}</div>
            <div className="tooltip">More</div>
          </li>

          {showMore && (
            <div className="more-options  blur shadow-blur">
              <li className="nav-link" onClick={() => navigate("/technician")}>
                <div className="icon"><Home /></div>
                <div className="tooltip">Home</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/accountdetails")}>
                <div className="icon d-flex"><Account />{(userDetails?.addressDetails === null && userDetails?.isTechnician === true && showMore === true) && <AlertRedDot />}</div>
                <div className="tooltip">Account details</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/chat")}>
                <div className="icon"><Chat /></div>
                <div className="tooltip">Chats</div>
              </li>
              <li className="nav-link" onClick={() => navigate("/technician/slotAllocation")}>
                <div className="icon"><Calendar /></div>
                <div className="tooltip">Allocate slots</div>
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
                <div className="icon"><PowerBtn color={"#341919"} /></div>
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