import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserBets } from '../../services/service';

export default function MyMatch() {
  const location = useLocation();
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserBets = async () => {
    const userId = localStorage.getItem('userId');
    console.log("🔍 UserId from localStorage:", userId);
    
    if (!userId) {
      console.warn("No userId found in localStorage");
      return;
    }

    setLoading(true);

    try {
      const bets = await getUserBets(userId);
      
      
      setUserBets(bets || []);
    } catch (error) {
      console.error("Error fetching user bets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBets();

    const handleBetPlaced = () => {
      fetchUserBets();
    };

    window.addEventListener("betPlaced", handleBetPlaced);
    return () => {
      window.removeEventListener("betPlaced", handleBetPlaced);
    };
  }, []);

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

        <h2 className="text-lg font-semibold text-left text-white mb-2">All Predictions</h2>

        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow min-h-[100px]">
          {loading ? (
            <p className="text-yellow-300">Loading your bets...</p>
          ) : userBets.length === 0 ? (
            <p className="text-gray-200">You have not made any predictions yet.</p>
          ) : (
            <ul className="space-y-4">
              {userBets.map((bet, index) => (
                <li key={index} className="bg-white bg-opacity-10 p-3 rounded-lg shadow">
                  <div className="text-lg font-bold mb-1">
                    {bet.teamA} vs {bet.teamB}
                  </div>
                  <div className="text-sm text-gray-200">
                    <p><strong>Date:</strong> {bet.date} | <strong>Time:</strong> {bet.time}</p>
                    <p><strong>League:</strong> {bet.league}</p>
                    <p><strong>Question:</strong> {bet.question}</p>
                    <p><strong>Option:</strong> {bet.option}</p>
                    <p><strong>Ratio:</strong> {bet.ratio}</p>
                    <p><strong>Amount:</strong> ₹{bet.amount}</p>
                    <p><strong>Expected Return:</strong> ₹{bet.expectedReturn}</p>
                    <p><strong>Status:</strong> {bet.betstatus}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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