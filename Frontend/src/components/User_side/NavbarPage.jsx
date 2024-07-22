import React, { useState } from "react";
import UserSideBar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import "../../../public/css/user_home.css";

const UserNavbar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-light bg-light ">
        <div className="container-fluid">
          <p className="navbar-brand mb-0">Logo</p>
          <div className="d-flex align-items-center my-2">
            <p className="font-weight-bold text-dark text-sm mb-0 me-3" style={{ cursor: "pointer" }} onClick={() => { navigate("/allTechnicians") }}>Technicians</p>
            <div className="circle" onClick={() => setOpenSideBar(true)} />
          </div>
        </div>
      </nav>
      {openSideBar && <UserSideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />}
    </>
  );
}

export default UserNavbar;
