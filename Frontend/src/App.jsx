import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import UserProvider from './Contexts/UserDetailsContext';
import { GoogleOAuthProvider } from "@react-oauth/google";

// User side
import UserLogin from './components/user_side/Login';
import UserRegister from './components/user_side/Register';
import UserOTP from './components/user_side/OTP';
import GuestProtector from './components/services/GuestUser';
import UserProtecter from './components/services/UserProtecter';
import UserBookingHistoryTable from './components/user_side/History_booking';
import UserHistoryViewMore from './components/user_side/HistoryViewMore';
import TechniciansListPage from './pages/user/TechniciansListPage';
import UserHomePage from './pages/user/HomePage';
import AccountDetails from './components/user_side/AccountDetails';
import ChatPage from './pages/user/ChatPage';
import TechnicianProfileDetails from './components/user_side/TechnicianProfileDetails';
import UserAuthProvider from './Contexts/UserAuthContext';

// Admin side
import AdminProtecter from './components/services/AdminProtecter';
import NotAdminProtector from './components/services/NotAdmin';
import AdminLogin from './components/admin_side/AdminLogin';
import AdminDashboard from './components/admin_side/AdminDashboard';
import AdminUserList from "./components/admin_side/AdminUserList";
import AdminTechnicianList from './components/admin_side/AdminTechnicianList';
import AdminBookingHistoryTable from './components/admin_side/AdminBookingList';
import AdminViewMoreBookingDetails from './components/admin_side/AdminViewMoreBookingDetails';
import AdminAuthProvider from './Contexts/AdminAuthContext';

// Technician side
import TechnicianProtecter from './components/services/TechnicianProtecter';
import TechnicianHome from './components/technician_side/TechnicianHome';
import TechnicianRole from './components/technician_side/TechnicianRole';
import TechnicianBookingHistoryTable from './components/technician_side/TechnicianBookingHistory';
import TechnicianViewMoreBooking from './components/technician_side/TechnicianViewMoreBooking';
import TechnicianSlotAllocation from './components/technician_side/TechnicianSlotAllocation';
import TechnicianWalletPage from './components/technician_side/TechnicianWallet';

// common side
import NotFound from './components/common/Page404';
import AppErrorBoundary from './error/ErrorBounday';

// Style css and others
import "../public/Css/index.css";
import "../public/Css/user_home.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <GoogleOAuthProvider clientId={googleClientID}>
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
    </GoogleOAuthProvider>
  );
};

export default App;