import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import UserProvider from './Contexts/UserDetailsContext';

// User side
import UserLogin from './components/User_side/Login';
import UserRegister from './Components/User_side/Register';
import UserOTP from './Components/User_side/OTP';
import GuestProtector from './Components/Services/GuestUser';
import UserProtecter from './components/services/UserProtecter';
import UserBookingHistoryTable from './Components/User_side/History_booking';
import UserHistoryViewMore from './components/User_side/HistoryViewMore';
import TechniciansListPage from './pages/User/TechniciansListPage';
import UserHomePage from './Pages/User/HomePage';
import AccountDetails from './components/User_side/AccountDetails';
import ChatPage from './pages/User/ChatPage';
import TechnicianProfileDetails from './Components/User_side/TechnicianProfileDetails';
import UserAuthProvider from './Contexts/UserAuthContext';

// Admin side
import AdminProtecter from './Components/Services/AdminProtecter';
import NotAdminProtector from './Components/Services/NotAdmin';
import AdminLogin from './Components/Admin_side/AdminLogin';
import AdminDashboard from './Components/Admin_side/AdminDashboard';
import AdminUserList from "./Components/Admin_side/AdminUserList";
import AdminTechnicianList from './Components/Admin_side/AdminTechnicianList';
import AdminBookingHistoryTable from './Components/Admin_side/AdminBookingList';
import AdminViewMoreBookingDetails from './Components/Admin_side/AdminViewMoreBookingDetails';
import AdminAuthProvider from './Contexts/AdminAuthContext';

// Technician side
import TechnicianProtecter from './Components/Services/TechnicianProtecter';
import TechnicianHome from './Components/Technician_side/TechnicianHome';
import TechnicianRole from './components/Technician_side/TechnicianRole';
import TechnicianBookingHistoryTable from './Components/Technician_side/TechnicianBookingHistory';
import TechnicianViewMoreBooking from './components/Technician_side/TechnicianViewMoreBooking';
import TechnicianSlotAllocation from './components/Technician_side/TechnicianSlotAllocation';
import TechnicianWalletPage from './components/Technician_side/TechnicianWallet';

// common side
import NotFound from './Components/Common/Page404';
import AppErrorBoundary from './Error/ErrorBounday';

// Style css and others
import "../public/Css/index.css";
import "../public/Css/user_home.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <AdminAuthProvider>
      <UserAuthProvider>
        <UserProvider>
          <BrowserRouter>
            <AppErrorBoundary>
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
                <Route path='/admin/bookings' element={<AdminProtecter><AdminBookingHistoryTable /></AdminProtecter>} />;
                <Route path='/admin/viewmoreBookingDetails' element={<AdminProtecter><AdminViewMoreBookingDetails /></AdminProtecter>} />;

                {/* Technician side */}
                <Route path='/technician' element={<TechnicianProtecter><TechnicianHome /></TechnicianProtecter>} />;
                <Route path='/technician/joinTechnician' element={<UserProtecter><TechnicianRole /></UserProtecter>} />;
                <Route path='/technician/accountdetails' element={<TechnicianProtecter><AccountDetails /></TechnicianProtecter>} />;
                <Route path='/technician/chat' element={<TechnicianProtecter><ChatPage /></TechnicianProtecter>} />;
                <Route path='/technician/technicianBookingHistory' element={<TechnicianProtecter><TechnicianBookingHistoryTable /></TechnicianProtecter>} />;
                <Route path='/technician/technicianBookingViewmore' element={<TechnicianProtecter><TechnicianViewMoreBooking /></TechnicianProtecter>} />;
                <Route path='/technician/slotAllocation' element={<TechnicianProtecter><TechnicianSlotAllocation /></TechnicianProtecter>} />;
                <Route path='/technician/wallet' element={<TechnicianProtecter><TechnicianWalletPage /></TechnicianProtecter>} />;

                {/* common */}
                <Route path='*' element={<NotFound />} />;

              </Routes>
            </AppErrorBoundary>
          </BrowserRouter>
          <Toaster richColors expand={false} position="bottom-right" closeButton="true" toastOptions={{ style: { padding: '18px', borderRadius: '8px' } }} />
        </UserProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  );
};

export default App;