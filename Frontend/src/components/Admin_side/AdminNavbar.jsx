import React from 'react';
import { PowerBtn } from "../../../public/svgs/Icons";
import { useNavigate, useLocation } from "react-router-dom";
import confirmAlert from '../Common/SweetAlert/confirmAlert';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    confirmAlert("Logout?")
      .then((result) => {
        if (result.isConfirmed) {
          sessionStorage.removeItem("adminToken");
          navigate("/admin", { state: { message: "Logout successfully" } });
        }
      });
  };

  return (
    <div className='p-4'>
      <nav className="navbar navbar-expand-md card py-2">
        <div className="container-fluid">
          <a className="navbar-brand">Logo</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto gap-3 d-flex align-items-center justify-content-center">
              <li className="nav-item d-flex align-items-center">
                <a
                  className={`nav-link cursor-pointer ${location.pathname === '/admin/dashboard' && 'active'}`}
                  onClick={() => navigate(`/admin/dashboard`)}
                >
                  Dashboard
                </a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a
                  className={`nav-link cursor-pointer ${location.pathname === '/admin/users' && 'active'}`}
                  onClick={() => navigate(`/admin/users`)}
                >
                  Users
                </a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a
                  className={`nav-link cursor-pointer ${location.pathname === '/admin/technicians' && 'active'}`}
                  onClick={() => navigate(`/admin/technicians`)}
                >
                  Technicians
                </a>
              </li>
              <li className="nav-item d-flex align-items-center">
                <a className="nav-link" onClick={() => handleLogout()}>
                  <button className="Btn d-flex align-items-center justify-content-start border-0 position-relative cursor-pointer">
                    <div className="sign w-100 d-flex justify-content-center">
                      <PowerBtn />
                    </div>
                    <span className="nav-link logout-text">Logout</span>
                  </button>
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