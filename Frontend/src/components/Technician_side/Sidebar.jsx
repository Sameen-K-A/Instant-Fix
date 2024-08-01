import React from "react";
import { Account, Booking, Home, Send, Wallet, AvailabilityDot } from "../../../public/svgs/Icons";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../../config/credentials";
import profile from "../../../public/images/userDefaultProfile.png";

const AdminSidebar = ({ openSideBar, setOpenSideBar }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(sessionStorage.getItem("userDetails"));
  const handleCloseSidebar = (e) => {
    if (e.target.className === "backdrop") {
      setOpenSideBar(false);
    }
  };

  return (
    <div className={`sidebar-container ${openSideBar && 'open'}`} onClick={handleCloseSidebar}>
      <div className="backdrop"></div>
      <nav className={`sidebar ${openSideBar && 'open'}`}>
        <>
          <header>
            <div className="image-text">
              <span className="image">
                <img src={userData?.profileIMG ? `${Base_URL}/${userData?.profileIMG}` : profile} alt="img" />
              </span>
              <div className="text logo-text">
                <span className="name">{userData?.name}</span>
                <div className="d-flex justify-content-start align-items-center">
                  <AvailabilityDot color={"#00e6a1"} />
                  <span className="availability">Available</span>
                </div>

              </div>
            </div>
          </header>
          <div className="menu-bar">
            <div className="menu">
              <ul className="menu-links">
                <li className="nav-link" onClick={() => navigate("/technician")}>
                  <Home />
                  <span className="text nav-text">Home</span>
                </li>
                <li className="nav-link">
                  <Send />
                  <span className="text nav-text">Booking requests</span>
                </li>
                <li className="nav-link">
                  <Booking />
                  <span className="text nav-text">Bookings & History</span>
                </li>
                <li className="nav-link">
                  <Wallet />
                  <span className="text nav-text">Wallet</span>
                </li>
                <li className="nav-link" onClick={() => navigate("/")}>
                  <Account />
                  <span className="text nav-text">User console</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      </nav>
    </div>
  );
};

export default AdminSidebar;