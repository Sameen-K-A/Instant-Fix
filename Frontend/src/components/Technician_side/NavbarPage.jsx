import React, { useEffect, useState } from "react";
import TechnicianSideBar from "./Sidebar"
import { Base_URL } from "../../config/credentials";
import profile from "../../../public/images/userDefaultProfile.png";
import "../../../public/css/user_home.css";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";

const socket = io(Base_URL);

const TechnicianNavbar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem("userDetails"));
  const userProfile = userData?.profileIMG;

  useEffect(() => {
    socket.emit("joinTechnicianNoficationRoom", (userData?.user_id));
    socket.on("newJobRequest", (data) => {
      toast.info(data.message);
    })
    return () => {
      socket.off("newJobRequest");
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-light bg-light" style={{ zIndex: "4" }}>
        <div className="container-fluid">
          <p className="navbar-brand mb-0">Logo</p>
          <div className="d-flex align-items-center my-2">
            <p className="font-weight-bold text-dark text-sm mb-0 me-3"><Bell /></p>
            <div className="circle" onClick={() => setOpenSideBar(true)}>
              <img src={userProfile ? `${Base_URL}/${userProfile}` : profile} width={"30px"} alt="img" />
            </div>
          </div>
        </div>
      </nav>
      {openSideBar && <TechnicianSideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />}
    </>
  );
}

export default TechnicianNavbar;