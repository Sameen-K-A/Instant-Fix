import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';

// User side
import UserLogin from './components/User_side/Login';
import UserRegister from './components/User_side/Register';
import UserOTP from './components/User_side/OTP';
import GuestProtector from './components/Services/GuestUser';
import UserProtecter from './components/Services/UserProtecter';
import UserBookingHistoryTable from './components/User_side/History_booking';
import UserHistoryViewMore from './components/User_side/HistoryViewMore';
import TechniciansListPage from './pages/User/TechniciansListPage';
import UserHomePage from './pages/User/HomePage';
import AccountDetails from './components/User_side/AccountDetails';
import ChatPage from './pages/User/ChatPage';
import TechnicianProfileDetails from './components/User_side/TechnicianProfileDetails';

// Admin side
import AdminProtecter from './components/Services/AdminProtecter';
import NotAdminProtector from './components/Services/NotAdmin';
import AdminLogin from './components/Admin_side/AdminLogin';
import AdminDashboard from './components/Admin_side/AdminDashboard';
import AdminUserList from './components/Admin_side/UserList';
import AdminTechnicianList from './components/Admin_side/TechnicianList';

// Technician side
import TechnicianProtecter from './components/Services/TechnicianProtecter';
import TechnicianHome from './components/Technician_side/TechnicianHome';
import TechnicianRole from './components/Technician_side/TechnicianRole';
import TechnicianBookingHistoryTable from './components/Technician_side/TechnicianBookingHistory';

// common side
import NotFound from './components/Common/404page';

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
          <Route path='/login' element={<GuestProtector><UserLogin /></GuestProtector>} />;
          <Route path='/register' element={<GuestProtector><UserRegister /></GuestProtector>} />;
          <Route path='/otp' element={<GuestProtector><UserOTP /></GuestProtector>} />;
          <Route path='/accountdetails' element={<UserProtecter><AccountDetails /></UserProtecter>} />;
          <Route path='/allTechnicians' element={<UserProtecter><TechniciansListPage /></UserProtecter>} />;
          <Route path='/bookingHistory' element={<UserProtecter><UserBookingHistoryTable /></UserProtecter>} />;
          <Route path='/viewmoreHistory' element={<UserProtecter><UserHistoryViewMore /></UserProtecter>} />;
          <Route path='/chat' element={<UserProtecter><ChatPage /></UserProtecter>} />;
          <Route path='/techniciandetails' element={<UserProtecter><TechnicianProfileDetails /></UserProtecter>} />;

          {/* Admin side */}
          <Route path='/admin' element={<NotAdminProtector><AdminLogin /></NotAdminProtector>} />;
          <Route path='/admin/dashboard' element={<AdminProtecter><AdminDashboard />  </AdminProtecter>} />;
          <Route path='/admin/users' element={<AdminProtecter><AdminUserList /></AdminProtecter>} />;
          <Route path='/admin/technicians' element={<AdminProtecter><AdminTechnicianList /></AdminProtecter>} />;

          {/* Technician side */}
          <Route path='/technician' element={<TechnicianProtecter><TechnicianHome /></TechnicianProtecter>} />;
          <Route path='/technician/joinTechnician' element={<UserProtecter><TechnicianRole /></UserProtecter>} />;
          <Route path='/technician/accountdetails' element={<TechnicianProtecter><AccountDetails /></TechnicianProtecter>} />;
          <Route path='/technician/chat' element={<UserProtecter><ChatPage /></UserProtecter>} />;
          <Route path='/technician/technicianBookingHistory' element={<UserProtecter><TechnicianBookingHistoryTable /></UserProtecter>} />;

          {/* common */}
          <Route path='*' element={<NotFound />} />;

        </Routes>
      </BrowserRouter>
      <Toaster richColors expand={false} position="bottom-right" closeButton="true" toastOptions={{ style: { padding: '18px', borderRadius: '8px' } }} />
    </>
  )
}

export default App