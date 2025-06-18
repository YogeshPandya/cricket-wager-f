import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/User/Login';
import UserSignup from './pages/User/Signup';
import ForgotPassword from './pages/User/ForgotPassword';
import AdminLogin from './pages/Admin/Login';
import HomePage from './pages/User/HomePage';
import MyMatch from './pages/User/MyMatch';
import AccountPage from './pages/User/AccountPage';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
