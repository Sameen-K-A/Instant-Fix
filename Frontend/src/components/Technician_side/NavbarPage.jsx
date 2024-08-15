import React, { useEffect } from "react";
import TechnicianSideBar from "./TechnicianSidebar";
import { Base_URL } from "../../config/credentials";
import { Bell } from "../../../public/svgs/Icons";
import io from "socket.io-client";
import { toast } from "sonner";

const socket = io(Base_URL);

const TechnicianNavbar = () => {
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
      <nav className="navbar navbar-light bg-light" style={{ zIndex: "9999" }}>
        <div className="container-fluid">
          <p className="navbar-brand mb-0">Logo</p>
          <div className="d-flex align-items-center my-2">
            <p className="font-weight-bold text-dark text-sm mb-0 me-3"><Bell /></p>
            <div className="circle">
              <img src={`${Base_URL}/${userProfile}`} width={"30px"} alt="img" />
            </div>
          </div>
        </div>
      </nav>
      <TechnicianSideBar />
    </>
  );
}

export default TechnicianNavbar;