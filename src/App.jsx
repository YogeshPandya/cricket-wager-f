import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLogin from './pages/User/Login';
import UserSignup from './pages/User/Signup';
import ForgotPassword from './pages/User/ForgotPassword';
import AdminLogin from './pages/Admin/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
