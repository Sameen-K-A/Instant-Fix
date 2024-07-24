import React from 'react';
import Boxes from './DashboardBoxes';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminDashboard = () => {
  return (
    <>
      <AdminSidebar />
      <main className="main-content position-relative max-height-vh-100 h-100 mt-1 border-radius-lg">
      <AdminNavbar />
        <div className="container-fluid py-4">
          <div className="row mt-2">
            <div className="col-lg-5 mb-lg-0 mb-4">
              <Boxes mainContent={"Today's Money"} price={"$53,000"} percentage={"+55%"} />
              <Boxes mainContent={"Today's Users"} price={"2,300"} percentage={"+3%"} />
              <Boxes mainContent={"New Clients"} price={"+3,462"} percentage={"+2%"} />
              <Boxes mainContent={"Sales"} price={"$103,430"} percentage={"+5%"} />
            </div>
            <div className="col-lg-7">
              <div className="card h-100 p-3">

              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-7 mb-lg-0 mb-4">
              <div className="card">
                <div className="card-body p-3">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="d-flex flex-column h-100">
                        <h5 className="font-weight-bolder">Soft UI Dashboard</h5>
                        <p className="mb-5">From colors, cards, typography to complex elements, you will find the full documentation.</p>
                        <p className="text-body text-sm font-weight-bold mt-auto">Read More</p>
                      </div>
                    </div>
                    <div className="col-lg-5 ms-auto text-center mt-5 mt-lg-0">
                      <div className="bg-gradient-primary border-radius-lg h-100">
                        <div className="position-relative d-flex align-items-center justify-content-center h-100">

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card h-100 p-3">

              </div>
            </div>
          </div>
        </div>
        {/* <AdminUserDetails /> */}
      </main>
    </>
  );
};

export default AdminDashboard;