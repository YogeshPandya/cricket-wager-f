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
import RechargeRecords from './pages/User/RechargeRecords';
import WithdrawalRecords from './pages/User/WithdrawalRecords';
import LinkBankAccount from './pages/User/LinkBankAccount';
import UserInfo from './pages/User/UserInfo';
import ResetPassword from './pages/User/ResetPassword';
import Feedback from './pages/User/Feedback';
import Rules from './pages/User/Rules';
import Help from './pages/User/Help';
import About from './pages/User/About';
import Recharge from './pages/User/Recharge';
import Withdraw from './pages/User/Withdraw';
import MatchDetails from './pages/User/MatchDetails';
import UserBetDetails from './pages/Admin/UserBetDetails';
import UserDetails from './pages/Admin/UserDetails';
import ResetPasswordLogin from './pages/User/ResetPasswordLogin';




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
        <Route path="/recharge-records" element={<RechargeRecords />} />
        <Route path="/withdrawal-records" element={<WithdrawalRecords />} />
        <Route path="/link-bank" element={<LinkBankAccount />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/withdraw" element={<Withdraw />} />
         <Route path="/match-details" element={<MatchDetails />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/match-setup" element={<MatchSetup />} />
        <Route path="/admin/match-control" element={<MatchControl />} />
        <Route path="/admin/payment" element={<Payment />} />
        <Route path="/admin/user-bets/:id" element={<UserBetDetails />} />
        <Route path="/admin/user-details" element={<UserDetails />} />
         <Route path="/reset-password-login" element={<ResetPasswordLogin />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
