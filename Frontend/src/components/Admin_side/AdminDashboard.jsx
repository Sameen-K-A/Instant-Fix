import React from 'react';
import Boxes from './AdminDashboardBoxes';
import AdminNavbar from './AdminNavbar';
import Reveal from "../../../public/Animation/Animated";
import BookingChart from './Home/Chart';
import BookingsMap from './Home/BookingsMap';
import PieChartComponent from './Home/PieChart';

const AdminDashboard = () => {
  return (
    <>
      <AdminNavbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Reveal>
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-lg-5 mb-lg-0">
                <Boxes mainContent={"Today's Money"} price={"$53,000"} percentage={"+55%"} />
                <Boxes mainContent={"Today's Users"} price={"2,300"} percentage={"+3%"} />
                <Boxes mainContent={"New Clients"} price={"+3,462"} percentage={"+2%"} />
                <Boxes mainContent={"Sales"} price={"$103,430"} percentage={"+5%"} />
              </div>
              <BookingChart />
            </div>
            <div className="row mt-4">
              <BookingsMap />
              <PieChartComponent />
            </div>
          </div>
        </Reveal>
      </main >
    </>
  );
};

export default AdminDashboard;