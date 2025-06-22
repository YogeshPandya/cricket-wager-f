// src/components/AdminLayout.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import PaymentsIcon from '@mui/icons-material/Payments';
import LogoutIcon from '@mui/icons-material/Logout';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Match Setup', path: '/admin/match-setup', icon: <SportsCricketIcon /> },
  { label: 'Match Control', path: '/admin/match-control', icon: <SettingsRemoteIcon /> },
  { label: 'Payment', path: '/admin/payment', icon: <PaymentsIcon /> },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: remove token or session
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen">
        <aside className="w-64 bg-green-800 text-white flex flex-col p-4 justify-between">
          <div>
            <h2 className="text-2xl font-bold text-yellow-300 mb-6">Admin Panel</h2>
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-green-700 transition ${
                    location.pathname === item.path ? 'bg-green-700 text-yellow-300' : ''
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-4 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            <LogoutIcon /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Mobile View */}
      <div className="flex-1 md:hidden p-4 pb-24">{children}</div>

      {/* Mobile Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-800 text-white flex md:hidden justify-around items-center py-2 border-t border-green-700 z-50">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center text-xs ${
              location.pathname === item.path ? 'text-yellow-300' : 'text-white'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center text-xs text-white"
        >
          <LogoutIcon />
          <span className="text-[10px] mt-0.5">Logout</span>
        </button>
      </footer>
    </div>
  );
}
