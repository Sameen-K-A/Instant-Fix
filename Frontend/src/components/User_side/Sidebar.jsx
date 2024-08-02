import React from "react";
import { AboutUS, Account, Booking, Contact, Home, Logout, Worker } from "../../../public/svgs/Icons";
import { useNavigate } from "react-router-dom";
import { Base_URL } from "../../config/credentials";
import profile from "../../../public/images/userDefaultProfile.png";
import confirmAlert from "../Common/SweetAlert/confirmAlert";

const UserSideBar = ({ openSideBar, setOpenSideBar, userData }) => {
  const userAccessToken = sessionStorage.getItem("userToken");
  const navigate = useNavigate();
  const handleCloseSidebar = (e) => {
    if (e.target.className === "backdrop") {
      setOpenSideBar(false);
    }
  };

  const handleLogout = () => {
    confirmAlert("Do you want to logout? ")
      .then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("userToken");
          sessionStorage.removeItem("userDetails");
          sessionStorage.removeItem("techniciansList");
          sessionStorage.removeItem("AddressList");
          navigate("/");
        };
      });
  };

  return (
    <div className={`sidebar-container ${openSideBar && 'open'}`} onClick={handleCloseSidebar}>
      <div className="backdrop"></div>
      <nav className={`sidebar ${openSideBar && 'open'}`}>
        {userAccessToken ? (
          <>
            <header>
              <div className="image-text">
                <span className="image">
                  <img src={userData?.profileIMG ? `${Base_URL}/${userData?.profileIMG}` : profile} alt="img" />
                </span>
                <div className="text logo-text">
                  <span className="name">{userData?.name}</span>
                </div>
              </div>
            </header>
            <div className="menu-bar">
              <div className="menu">
                <ul className="menu-links">
                  <li className="nav-link" onClick={() => navigate("/")}>
                    <Home />
                    <span className="text nav-text">Home</span>
                  </li>
                  <li className="nav-link" onClick={() => navigate("/accountdetails")}>
                    <Account />
                    <span className="text nav-text">Account details</span>
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
                  <li className="nav-link" onClick={() => navigate("/technician")}>
                    <Worker />
                    <span className="text nav-text">Technician console</span>
                  </li>
                  <li className="bottom-content" onClick={() => { handleLogout() }}>
                    <Logout />
                    <span className="text nav-text">Logout</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex flex-column justify-content-center align-items-center min-vh-100">
            <h5 className="text-center">Please login</h5>
            <p className="text-center mt-2 text-sm">
              Sign in to access your account and enjoy all the features. If you don't have an account,
              you can easily create one.
            </p>
            <div className="d-flex justify-content-center mt-3 w-100">
              <button className="btn bg-gradient-primary w-60" onClick={() => navigate("/login")}>Login</button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default UserSideBar;