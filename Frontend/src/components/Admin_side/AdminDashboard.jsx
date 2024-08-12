import React from 'react';
import Boxes from './DashboardBoxes';
import AdminNavbar from './AdminNavbar';

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-lg-5 mb-lg-0">
              <Boxes mainContent={"Today's Money"} price={"$53,000"} percentage={"+55%"} />
              <Boxes mainContent={"Today's Users"} price={"2,300"} percentage={"+3%"} />
              <Boxes mainContent={"New Clients"} price={"+3,462"} percentage={"+2%"} />
              <Boxes mainContent={"Sales"} price={"$103,430"} percentage={"+5%"} />
            </div>
            <div className="col-lg-7">
              <div className="card min-height-300 p-3">

              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-7">
              <div className="card min-height-300 p-3">

              </div>
            </div>
            <div className="col-lg-5">
              <div className="card min-height-300 p-3">

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;