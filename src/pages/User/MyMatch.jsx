import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function MyMatch() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'upcoming':
        return <p className="text-gray-200">No upcoming matches.</p>;
      case 'live':
        return <p className="text-gray-200">No live matches at the moment.</p>;
      case 'completed':
        return <p className="text-gray-200">No completed matches yet.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-28">
       <h1 className="text-4xl font-extrabold drop-shadow-md tracking-wide">
  <span className="text-green-200">Cricket</span>{' '}
  <span className="text-yellow-300">Wager</span>
</h1>


        <h3 className="text-xl font-semibold text-yellow-300 mb-4 text-center">
          My Matches
        </h3>

        {/* Tab Navigation */}
        <div className="flex justify-around mb-4">
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === 'upcoming'
                ? 'bg-yellow-400 text-black'
                : 'bg-white bg-opacity-10 text-white'
            }`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === 'live'
                ? 'bg-yellow-400 text-black'
                : 'bg-white bg-opacity-10 text-white'
            }`}
            onClick={() => setActiveTab('live')}
          >
            Live
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium ${
              activeTab === 'completed'
                ? 'bg-yellow-400 text-black'
                : 'bg-white bg-opacity-10 text-white'
            }`}
            onClick={() => setActiveTab('completed')}
          >
            Complete
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow text-center min-h-[100px]">
          {renderContent()}
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
