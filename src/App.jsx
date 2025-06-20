import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/User/Login';
import UserSignup from './pages/User/Signup';
import ForgotPassword from './pages/User/ForgotPassword';
import AdminLogin from './pages/Admin/Login';
import HomePage from './pages/User/HomePage';
import MyMatch from './pages/User/MyMatch';
import AccountPage from './pages/User/AccountPage';
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
