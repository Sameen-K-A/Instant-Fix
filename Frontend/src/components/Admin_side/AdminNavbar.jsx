import AdminSidebar from "../Technician_side/Sidebar";
import { useState } from "react";

const AdminNavbar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  return (
    <>
      <div className="card shadow border-radius-xs">
        <div className="card-body py-4 d-flex justify-content-end  px-4">
          <div className="rounded-circle bg-secondary cursor-pointer" style={{ width: '30px', height: '30px' }} />
        </div>
      </div>
      {openSideBar && <AdminSidebar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />}
    </>
  );
};

export default AdminNavbar;