import React from "react";
import { AboutUS, Account, Address, Booking, Contact, Home, Logout, Worker } from "../../../public/svgs/Icons";
import { useNavigate } from "react-router-dom";

const UserSideBar = ({ openSideBar, setOpenSideBar }) => {

  const navigate = useNavigate();
  const handleCloseSidebar = (e) => {
    if (e.target.className === "backdrop") {
      setOpenSideBar(false);
    }
  };

  return (
    <div className={`sidebar-container ${openSideBar && 'open'}`} onClick={handleCloseSidebar}>
      <div className="backdrop"></div>
      <nav className={`sidebar ${openSideBar && 'open'}`}>
        <header>
          <div className="image-text">
            <span className="image">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOH2aZnIHWjMQj2lQUOWIL2f4Hljgab0ecZQ&s" alt="" />
            </span>
            <div className="text logo-text">
              <span className="name">Sameen K A</span>
            </div>
          </div>
        </header>
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              <li className="nav-link">
                <Home />
                <span className="text nav-text">Home</span>
              </li>
              <li className="nav-link" onClick={() => navigate("/profile")}>
                <Account />
                <span className="text nav-text">Account</span>
              </li>
              <li className="nav-link" onClick={() => navigate("/address")}>
                <Address />
                <span className="text nav-text">Address settings</span>
              </li>
              <li className="nav-link" onClick={() => navigate("/bookingHistory")}>
                <Booking />
                <span className="text nav-text">Bookings & History</span>
              </li>
              <li className="nav-link">
                <Contact />
                <span className="text nav-text">Contact</span>
              </li>
              <li className="nav-link">
                <AboutUS />
                <span className="text nav-text">About us</span>
              </li>
              <li className="nav-link">
                <Worker />
                <span className="text nav-text">Technician console</span>
              </li>
            </ul>
          </div>
          <>
            <li className="bottom-content">
              <Logout />
              <span className="text nav-text">Logout</span>
            </li>
          </>
        </div>
      </nav>
    </div>
  );
};

export default UserSideBar;