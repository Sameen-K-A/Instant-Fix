import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';

// User side
import UserLogin from './components/User_side/Login';
import UserRegister from './components/User_side/Register';
import UserForgotPassword from './components/User_side/ForgotPassword';
import UserOTP from './components/User_side/OTP';
import UserProtecter from './components/Services/UserProtecter';
import UserProfile from './components/User_side/Profile';
import UserAddress from './components/User_side/Address';
import UserBookingHistoryTable from './components/User_side/History_booking';
import UserHistoryViewMore from './components/User_side/HistoryViewMore';
import TechniciansListPage from './pages/User/TechniciansListPage';
import UserHomePage from './pages/User/HomePage';

// Admin side
import AdminLogin from './components/Admin_side/AdminLogin';
import AdminProtecter from './components/Services/AdminProtecter';
import AdminDashboard from './components/Admin_side/AdminDashboard';
import AdminUserList from './components/Admin_side/UserList';
import AdminTechnicianList from './components/Admin_side/TechnicianList';

// Technician side
import TechnicianProtecter from './components/Services/TechnicianProtecter';
import TechnicianHome from './components/Technician_side/TechnicianHome';
import TechnicianRole from './components/Technician_side/TechnicianRole';

// Style css and others
import "../public/css/index.css";
import "../public/css/user_home.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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
          <Route path='/forgotpassword' element={<UserForgotPassword />} />;
          <Route path='/profile' element={<UserProtecter><UserProfile /></UserProtecter>} />;
          <Route path='/address' element={<UserProtecter><UserAddress /></UserProtecter>} />;
          <Route path='/allTechnicians' element={<UserProtecter><TechniciansListPage /></UserProtecter>} />;
          <Route path='/bookingHistory' element={<UserProtecter><UserBookingHistoryTable /></UserProtecter>} />;
          <Route path='/viewmoreHistory' element={<UserProtecter><UserHistoryViewMore /></UserProtecter>} />;

          {/* Admin side */}
          <Route path='/admin' element={<AdminLogin />} />;
          <Route path='/admin/dashboard' element={<AdminProtecter><AdminDashboard />  </AdminProtecter>} />;
          <Route path='/admin/users' element={<AdminProtecter><AdminUserList /></AdminProtecter>} />;
          <Route path='/admin/technicians' element={<AdminProtecter><AdminTechnicianList /></AdminProtecter>} />;

          {/* Technician side */}
          <Route path='/technician' element={<TechnicianProtecter><TechnicianHome /></TechnicianProtecter>} />;
          <Route path='/technician/joinTechnician' element={<TechnicianRole />} />;

        </Routes>
      </BrowserRouter>
      <Toaster richColors expand={false} position="bottom-right" toastOptions={{ style: { padding: '18px', borderRadius: '8px' } }} />
    </>
  )
}

export default App