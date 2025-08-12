import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserBets } from '../../services/service';
import socket from '../../socket';

export default function MyMatch() {
  const location = useLocation();
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserBets = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

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

    const handleBetPlaced = () => fetchUserBets();
    const handleQuestionUpdated = ({ question }) => {
      if (question.result) fetchUserBets();
    };

    socket.on('questionUpdated', handleQuestionUpdated);
    window.addEventListener("betPlaced", handleBetPlaced);
    
    return () => {
      socket.off('questionUpdated', handleQuestionUpdated);
      window.removeEventListener("betPlaced", handleBetPlaced);
    };
  }, []);

  const navItems = [
    { label: 'Home', icon: <SportsCricketIcon />, path: '/home' },
    { label: 'My Match', icon: <SportsEsportsIcon />, path: '/my-match' },
    { label: 'Account', icon: <AccountCircleIcon />, path: '/account' },
  ];

  const getStatusDisplay = (status) => {
    switch (status.toLowerCase()) {
      case 'won':
        return { 
          text: 'WON', 
          color: 'text-green-400', 
          bg: 'bg-green-400 bg-opacity-20',
          icon: '🏆',
          glow: 'shadow-lg shadow-green-400/30'
        };
      case 'lost':
        return { 
          text: 'LOST', 
          color: 'text-red-400', 
          bg: 'bg-red-400 bg-opacity-20',
          icon: '❌',
          glow: 'shadow-lg shadow-red-400/20'
        };
      case 'pending':
        return { 
          text: 'PENDING', 
          color: 'text-yellow-400', 
          bg: 'bg-yellow-400 bg-opacity-20',
          icon: '⏳',
          glow: 'shadow-lg shadow-yellow-400/20'
        };
      default:
        return { 
          text: status.toUpperCase(), 
          color: 'text-gray-400', 
          bg: 'bg-gray-400 bg-opacity-20',
          icon: 'ℹ️',
          glow: ''
        };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white relative">
      {/* Floating animated elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white bg-opacity-5"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28 relative z-10">
        {/* Header with animated gradient */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-wide mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-200 via-yellow-300 to-yellow-500 animate-text">
              Cricket Wager
            </span>
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-300 to-green-300 mx-auto rounded-full"></div>
        </div>

        <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center relative">
          <span className="relative inline-block">
            My Predictions
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-300 animate-pulse"></span>
          </span>
        </h3>

        {/* Stats Summary Cards */}
        {userBets.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white bg-opacity-10 p-3 rounded-xl border border-green-300 border-opacity-30 text-center">
              <div className="text-xs text-gray-300">Total Bets</div>
              <div className="text-xl font-bold text-yellow-300">{userBets.length}</div>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-xl border border-green-300 border-opacity-30 text-center">
              <div className="text-xs text-gray-300">Won</div>
              <div className="text-xl font-bold text-green-300">
                {userBets.filter(b => b.betstatus?.toLowerCase() === 'won').length}
              </div>
            </div>
            <div className="bg-white bg-opacity-10 p-3 rounded-xl border border-green-300 border-opacity-30 text-center">
              <div className="text-xs text-gray-300">Pending</div>
              <div className="text-xl font-bold text-yellow-300">
                {userBets.filter(b => b.betstatus?.toLowerCase() === 'pending').length}
              </div>
            </div>
          </div>
        )}

        {/* Bets List */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white border-opacity-10 min-h-[100px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
                <SportsCricketIcon 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-300"
                  style={{ fontSize: '1.5rem' }}
                />
              </div>
              <p className="text-yellow-300 text-sm font-medium">Loading your predictions...</p>
            </div>
          ) : userBets.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block p-4 mb-3 rounded-full bg-white bg-opacity-10">
                <SportsEsportsIcon className="text-yellow-300" fontSize="large" />
              </div>
              <p className="text-gray-300 text-lg font-medium">No predictions yet</p>
              <p className="text-gray-400 text-sm mt-1">Place your first bet to see it here</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {[...userBets].reverse().map((bet, index) => {
                const statusDisplay = getStatusDisplay(bet.betstatus);
                const isWon = bet.betstatus?.toLowerCase() === 'won';
                
                return (
                  <li 
                    key={index} 
                    className={`bg-gradient-to-br ${isWon ? 'from-green-900/30 to-green-800/20' : 'from-gray-900/30 to-gray-800/20'} p-4 rounded-lg shadow-md border ${isWon ? 'border-green-400/30' : 'border-white/10'} hover:shadow-lg transition-all duration-200 ${statusDisplay.glow}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-lg font-bold text-yellow-300 mb-1">
                          {bet.teamA} <span className="text-white font-normal">vs</span> {bet.teamB}
                        </div>
                        <div className="text-xs text-gray-300">{bet.date} • {bet.time}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center ${statusDisplay.color} ${statusDisplay.bg}`}>
                        {statusDisplay.icon} <span className="ml-1">{statusDisplay.text}</span>
                      </span>
                    </div>

                    <div className="text-sm text-gray-200 space-y-2 mt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Question:</span>
                        <span className="text-yellow-300">{bet.question}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Your Prediction:</span>
                        <span className="text-yellow-300">{bet.option}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Rate:</span>
                        <span className="text-green-300">{bet.ratio}x</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10">
                        <div className="bg-black bg-opacity-30 p-2 rounded text-center">
                          <div className="text-xs text-gray-300">Bet Amount</div>
                          <div className="text-yellow-300 font-bold">₹{bet.amount}</div>
                        </div>
                        <div className="bg-black bg-opacity-30 p-2 rounded text-center">
                          <div className="text-xs text-gray-300">{isWon ? 'Won' : 'Potential'}</div>
                          <div className={`${isWon ? 'text-green-300' : 'text-yellow-300'} font-bold`}>₹{bet.expectedReturn}</div>
                        </div>
                      </div>
                      
                      {bet.result && (
                        <div className="mt-2 pt-2 border-t border-white/10 text-center">
                          <span className="text-xs text-gray-300">Result: </span>
                          <span className="text-yellow-300 font-medium">{bet.result}</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Footer (unchanged as requested) */}
      <footer className="fixed bottom-0 left-0 w-full bg-white bg-opacity-10 backdrop-blur-md text-white py-2 px-4 flex justify-around border-t border-white border-opacity-20 z-20">
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

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes animate-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}