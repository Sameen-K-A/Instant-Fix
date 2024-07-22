import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User side
import UserLogin from './components/User_side/Login';
import UserRegister from './components/User_side/Register';
import UserProfile from './components/User_side/Profile';
import UserAddress from './components/User_side/Address';
import UserBookingHistoryTable from './components/User_side/History_booking';
import UserHistoryViewMore from './components/User_side/HistoryViewMore';
import TechniciansListPage from './pages/User/TechniciansListPage';

import "../public/css/index.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* User side */}
          <Route path='/login' element={<UserLogin />} />;
          <Route path='/register' element={<UserRegister />} />;
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