import React from 'react';

const AdminSidebar = () => {
  return (
    <aside className="sidenav shadow g-sidenav-pinned navbar-vertical navbar-expand-xs border-radius-xl my-3 fixed-start ms-3  bg-white">
      <div className="sidenav-header">
        <a className="navbar-brand m-0">
          <h4 className="ms-1 font-weight-bold">Quick Fix</h4>
        </a>
      </div>
      <hr className="horizontal dark mt-0" />
      <div className="navbar-collapse" id="sidenav-collapse-main">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link active">
              <div className="icon  icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* <DashboardIconSVG /> */}
              </div>
              <span className="nav-link-text ms-1">Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link ">
              <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                {/* <DashboardIconSVG /> */}
              </div>
              <span className="nav-link-text ms-1">Users</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="sidenav-footer mx-3 ">

      </div>
    </aside>
  );
};

export default AdminSidebar;