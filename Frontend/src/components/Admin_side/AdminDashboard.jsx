import React, { useEffect, useState } from 'react';
import Boxes from './AdminDashboardBoxes';
import AdminNavbar from './AdminNavbar';
import Reveal from "../../../public/Animation/Animated";
import BookingChart from './Home/Chart';
import BookingsMap from './Home/BookingsMap';
import PieChartComponent from './Home/PieChart';
import adminAxiosInstance from '../../Config/adminInstance';
import { toast } from 'sonner';
import { GiPieChart } from 'react-icons/gi';
import { HiUsers } from "react-icons/hi2"
import { RiDatabase2Fill } from "react-icons/ri";
import { FaToolbox } from "react-icons/fa";

const AdminDashboard = () => {

  const [categories, setCategories] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [technicianCount, setTechnicianCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await adminAxiosInstance.get('/getCategories');
        setCategories(response.data?.categories);
        setUserCount(response.data?.userCount);
        setTechnicianCount(response.data?.technicianCount);
        setBookingCount(response.data?.bookingCount);
      } catch (error) {
        toast.error('Something went wrong, please try again later.');
      };
    })();
  }, []);

  return (
    <>
      <AdminNavbar />
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg">
        <Reveal>
          <div className="container-fluid py-4">
            <div className="row">
              <div className="col-lg-5 mb-lg-0">
                <Boxes mainContent={"Total users"} price={userCount} SvgIcon={<HiUsers color='white' size={22} />} />
                <Boxes mainContent={"Total Technicians"} price={technicianCount} SvgIcon={<FaToolbox color='white' size={20} />} />
                <Boxes mainContent={"Total Bookings"} price={bookingCount} SvgIcon={<RiDatabase2Fill color='white' size={25} />} />
                <Boxes mainContent={"Total categories"} price={categories.length} SvgIcon={<GiPieChart color='white' size={22} />} />
              </div>
              <BookingChart />
            </div>
            <div className="row mt-4">
              <BookingsMap />
              <PieChartComponent categories={categories} />
            </div>
          </div>
        </Reveal>
      </main >
    </>
  );
};

export default AdminDashboard;