import React from 'react';
import { PowerBtn } from "../../../public/svgs/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import confirmAlert from '../Common/SweetAlert/confirmAlert';
import { GiQuickSlash } from "react-icons/gi";
import adminAxiosInstance from "../../Config/AxiosInstance/adminInstance";
import { toast } from 'sonner';
import { useAdminAuthContext } from '../../Contexts/AdminAuthContext';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAdminIsLogged } = useAdminAuthContext();

  const handleLogout = () => {
    confirmAlert("Logout?")
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await adminAxiosInstance.get("/logout");
            setAdminIsLogged(false);
            localStorage.removeItem("adminIsLogged");
            navigate("/admin", { state: { message: "Logout successfully" } });
          } catch (error) {
            toast.error("Something wrong please try agian later.");
          }
        }
      });
  };

  return (
    <div className='p-4'>
      <nav className="navbar navbar-expand-md card py-2">
        <div className="container-fluid">
          <p className="navbar-brand mb-0 cursor-pointer" onClick={() => navigate("/admin/dashboard")}><GiQuickSlash style={{ transform: 'rotate(-180deg)' }} className="text-primary" size={30} /><span className=" text-bold text-primary" style={{ marginLeft: "-15px" }}>Instant Fix</span></p>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 d-flex align-items-center justify-content-center">
              <li className="nav-item d-flex align-items-center">
                <a className={`nav-link cursor-pointer ${location.pathname === '/admin/dashboard' && 'active'}`} onClick={() => navigate(`/admin/dashboard`)}>Dashboard</a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a className={`nav-link cursor-pointer ${location.pathname === '/admin/users' && 'active'}`} onClick={() => navigate(`/admin/users`)}>Users</a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a className={`nav-link cursor-pointer ${location.pathname === '/admin/technicians' && 'active'}`} onClick={() => navigate(`/admin/technicians`)}>Technicians</a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a className={`nav-link cursor-pointer ${location.pathname === '/admin/bookings' && 'active'}`} onClick={() => navigate(`/admin/bookings`)}>Bookings</a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a className="nav-link" onClick={() => handleLogout()}>  <button className="Btn d-flex align-items-center justify-content-start border-0 position-relative cursor-pointer">
                  <div className="sign w-100 d-flex justify-content-center"><PowerBtn /></div><span className="nav-link logout-text">Logout</span></button>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavbar;