import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User side
import UserLogin from './components/User_side/Login';
import UserRegister from './components/User_side/Register';
import UserOTP from './components/User_side/OTP';
import UserProfile from './components/User_side/Profile';
import UserAddress from './components/User_side/Address';
import UserBookingHistoryTable from './components/User_side/History_booking';
import UserHistoryViewMore from './components/User_side/HistoryViewMore';
import TechniciansListPage from './pages/User/TechniciansListPage';
import UserHomePage from './pages/User/HomePage';

import "../public/css/index.css";
import "../public/css/user_home.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* User side */}
          <Route path='/' element={<UserHomePage />} />;
          <Route path='/login' element={<UserLogin />} />;
          <Route path='/register' element={<UserRegister />} />;
          <Route path='/otp' element={<UserOTP />} />;
          <Route path='/profile' element={<UserProfile />} />;
          <Route path='/address' element={<UserAddress />} />;
          <Route path='/allTechnicians' element={<TechniciansListPage />} />;
          <Route path='/bookingHistory' element={<UserBookingHistoryTable />} />;
          <Route path='/viewmoreHistory' element={<UserHistoryViewMore />} />;

          {/* Admin side */}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App