import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MyMatch() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white">
      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <h1 className="text-4xl font-extrabold drop-shadow-md tracking-wide">
          <span className="text-green-200">Cricket</span>{' '}
          <span className="text-yellow-300">Wager</span>
        </h1>

        <h3 className="text-xl font-semibold text-yellow-300 mb-4 text-center">
          My Matches
        </h3>

        {/* All Predictions Section */}
        <h2 className="text-lg font-semibold text-left text-white mb-2">All Predictions</h2>
        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow min-h-[100px]">
          <p className="text-gray-200">You have not made any predictions yet.</p>
        </div>
      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md text-white py-2 px-4 flex justify-around border-t border-white border-opacity-20">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center text-xs ${
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
