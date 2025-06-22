import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/User/Login';
import UserSignup from './pages/User/Signup';
import ForgotPassword from './pages/User/ForgotPassword';
import AdminLogin from './pages/Admin/AdminLogin';
import HomePage from './pages/User/HomePage';
import MyMatch from './pages/User/MyMatch';
import AccountPage from './pages/User/AccountPage';
import Dashboard from './pages/Admin/Dashboard';
import MatchSetup from './pages/Admin/MatchSetup';
import MatchControl from './pages/Admin/MatchControl';
import Payment from './pages/Admin/Payment';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
         <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-match" element={<MyMatch />} />
        <Route path="/account" element={<AccountPage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/match-setup" element={<MatchSetup />} />
        <Route path="/admin/match-control" element={<MatchControl />} />
        <Route path="/admin/payment" element={<Payment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
