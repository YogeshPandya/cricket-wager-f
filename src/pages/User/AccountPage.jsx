// src/pages/AccountPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import FeedbackIcon from '@mui/icons-material/Feedback';
import GavelIcon from '@mui/icons-material/Gavel';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import LockResetIcon from '@mui/icons-material/LockReset';
import { getUserDetails } from '../../services/service';

export default function AccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  const accountOptions = [
    { label: 'Recharge Records', icon: <ReceiptIcon />, path: '/recharge-records' },
    { label: 'Withdrawal Records', icon: <ReceiptIcon />, path: '/withdrawal-records' },
    { label: 'User Information', icon: <PersonIcon />, path: '/user-info' },
    { label: 'Reset Password', icon: <LockResetIcon />, path: '/reset-password' },
    { label: 'My Feedback', icon: <FeedbackIcon />, path: '/feedback' },
    { label: 'Rules and Conditions', icon: <GavelIcon />, path: '/rules' },
    { label: 'Help', icon: <HelpOutlineIcon />, path: '/help' },
    { label: 'About Us', icon: <InfoIcon />, path: '/about' },
    { label: 'Logout', icon: <LogoutIcon />, path: '/login', logout: true },
  ];

  const handleLogout = (label) => {
    if (label === 'Logout') {
      localStorage.removeItem('access_token');
      navigate('/login');
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetails();
        if (res.status) {
          setUser({
            ...res.data.user,
            profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              res.data.user.username
            )}&background=random`,
          });
        } else {
          localStorage.removeItem('access_token');
          navigate('/login');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) return <div className="text-center text-white mt-10">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-400 to-gray-900 text-white font-sans">
      <div className="flex-1 p-4 pb-28 overflow-y-auto">
        <div className="relative bg-white bg-opacity-10 p-4 rounded-xl mb-6 shadow flex items-center gap-4">
          <img
            src={user.profilePic}
            alt="User"
            className="w-20 h-20 rounded-full border-2 border-yellow-300"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-yellow-300">{user.username}</h2>
            <p className="text-base text-white flex items-center mt-1">
              <AccountBalanceWalletIcon className="mr-1" />
              Balance: ₹{user.balance?.toFixed(2) ?? '0.00'}
            </p>
            <p className="text-base text-yellow-200 mt-1 font-medium">
              Withdrawable: ₹{user.balance >= 200 ? user.balance.toFixed(2) : '0.00'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            to="/recharge"
            className="bg-yellow-400 text-black font-semibold p-3 rounded-xl text-center shadow hover:bg-yellow-300 transition"
          >
            Recharge
          </Link>
          <Link
            to="/withdraw"
            className="bg-green-500 text-black font-semibold p-3 rounded-xl text-center shadow hover:bg-green-400 transition"
          >
            Withdraw
          </Link>
        </div>

        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow space-y-3">
          {accountOptions.map((opt) => (
            <Link
              key={opt.label}
              to={opt.path}
              onClick={() => handleLogout(opt.label)}
              className={`flex items-center gap-3 p-3 text-base ${
                opt.logout ? 'text-red-300 hover:text-red-500' : 'hover:text-yellow-300'
              } transition`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ Updated Footer to match HomePage */}
      <footer className="fixed bottom-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md text-white py-2 px-4 flex justify-around border-t border-white/20">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center text-xs font-semibold transition-colors duration-200 ${
              location.pathname === item.path ? 'text-yellow-300' : 'text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </footer>
    </div>
  );
}
