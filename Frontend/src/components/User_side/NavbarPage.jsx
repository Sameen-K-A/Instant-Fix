import React, { useState } from "react";
import UserSideBar from "./Sidebar";
import "../../../public/css/user_home.css";

const UserNavbar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <p className="navbar-brand">Logo</p>
          <div className="d-flex">
            <div className="circle" onClick={() => setOpenSideBar(true)}></div>
          </div>
        </div>
      </nav>
      {openSideBar && <UserSideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />}

    </>
  );
}

export default UserNavbar;