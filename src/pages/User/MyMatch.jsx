import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getUserBets } from '../../services/service';
import socket from '../../socket'; // Import socket

export default function MyMatch() {
  const location = useLocation();
  const [userBets, setUserBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [winNotifications, setWinNotifications] = useState([]); // ✅ Added

  // ✅ Win notification functions
  const showWinNotification = (winInfo) => {
    const notification = {
      id: Date.now(),
      ...winInfo,
    };
    
    setWinNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setWinNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setWinNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ✅ Enhanced fetchUserBets with win detection
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
      
      // ✅ Check for new wins (compare with previous bets)
      if (userBets.length > 0) {
        const newWins = bets.filter(bet => {
          const previousBet = userBets.find(prev => 
            prev.matchId === bet.matchId && 
            prev.question === bet.question && 
            prev.option === bet.option
          );
          return previousBet && 
                 previousBet.betstatus === 'pending' && 
                 bet.betstatus === 'won';
        });

        // Show win notifications
        newWins.forEach(bet => {
          const profit = bet.expectedReturn - bet.amount;
          showWinNotification({
            teamA: bet.teamA,
            teamB: bet.teamB,
            question: bet.question,
            option: bet.option,
            expectedReturn: bet.expectedReturn,
            profit: profit,
          });
        });
      }

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

    // Listen for question updates (when result is set)
    const handleQuestionUpdated = ({ matchId, question }) => {
      console.log('🔔 Question result updated:', { matchId, question });
      
      // If a result was set, refresh user bets to get updated statuses
      if (question.result) {
        fetchUserBets();
      }
    };

    // Add socket listener
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

  // Function to get status color and text
  const getStatusDisplay = (status) => {
    switch (status.toLowerCase()) {
      case 'won':
        return { text: 'WON', color: 'text-green-400', bg: 'bg-green-400 bg-opacity-20' };
      case 'lost':
        return { text: 'LOST', color: 'text-red-400', bg: 'bg-red-400 bg-opacity-20' };
      case 'pending':
        return { text: 'PENDING', color: 'text-yellow-400', bg: 'bg-yellow-400 bg-opacity-20' };
      default:
        return { text: status.toUpperCase(), color: 'text-gray-400', bg: 'bg-gray-400 bg-opacity-20' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white relative">
      {/* ✅ Win Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {winNotifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-green-500 bg-opacity-95 backdrop-blur-md text-white p-4 rounded-lg shadow-lg border-l-4 border-yellow-400 animate-pulse max-w-sm"
          >
            <button
              onClick={() => removeNotification(notification.id)}
              className="float-right text-white hover:text-gray-200 text-xl"
            >
              ×
            </button>
            <div className="pr-6">
              <h4 className="font-bold text-lg flex items-center">
                🎉 Congratulations! You Won!
              </h4>
              <p className="text-sm mt-1">
                <strong>{notification.teamA} vs {notification.teamB}</strong>
              </p>
              <p className="text-sm">
                <strong>Your Pick:</strong> {notification.option}
              </p>
              <div className="mt-2 p-2 bg-white bg-opacity-20 rounded">
                <p className="text-sm font-bold">
                  💰 Won: ₹{notification.expectedReturn}
                </p>
                <p className="text-xs">
                  Added ₹{notification.expectedReturn} to balance
                </p>
                <p className="text-xs">
                  Added ₹{notification.profit} to withdrawable
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-28">
        <h1 className="text-4xl font-extrabold drop-shadow-md tracking-wide">
          <span className="text-green-200">Cricket</span>{' '}
          <span className="text-yellow-300">Wager</span>
        </h1>

        <h3 className="text-xl font-semibold text-yellow-300 mb-4 text-center">
          My Matches
        </h3>

        <h2 className="text-2xl font-extrabold text-left text-yellow-300 mb-4 drop-shadow-md border-b border-yellow-300 pb-1">
          All Predictions
        </h2>

        <div className="bg-white bg-opacity-10 p-4 rounded-xl shadow min-h-[100px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-300"></div>
              <p className="text-yellow-300 ml-3">Loading your bets...</p>
            </div>
          ) : userBets.length === 0 ? (
            <p className="text-gray-200 text-center py-8">You have not made any predictions yet.</p>
          ) : (
            <ul className="space-y-4">
              {[...userBets].reverse().map((bet, index) => {
                const statusDisplay = getStatusDisplay(bet.betstatus);
                
                return (
                  <li key={index} className="bg-white bg-opacity-10 p-3 rounded-lg shadow hover:bg-opacity-15 transition-all duration-200">
                    <div className="text-xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-yellow-300 to-pink-400 drop-shadow-lg">
                      {bet.teamA} <span className="text-white">vs</span> {bet.teamB}
                    </div>

                    <div className="text-sm text-gray-200 space-y-1">
                      <p><strong>Date:</strong> {bet.date} | <strong>Time:</strong> {bet.time}</p>
                      <p><strong>League:</strong> {bet.league}</p>
                      <p><strong>Question:</strong> {bet.question}</p>
                      <p><strong>Option:</strong> {bet.option}</p>
                      <p><strong>Ratio:</strong> {bet.ratio}</p>
                      <p><strong>Amount:</strong> ₹{bet.amount}</p>
                      <p><strong>Expected Return:</strong> ₹{bet.expectedReturn}</p>
                      
                      {/* ✅ Enhanced Status Display */}
                      <div className="flex items-center gap-2 mt-2">
                        <strong>Status:</strong>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusDisplay.color} ${statusDisplay.bg}`}>
                          {statusDisplay.text}
                        </span>
                        
                        {/* ✅ Show profit for won bets */}
                        {bet.betstatus === 'won' && (
                          <span className="text-green-300 text-xs font-bold ml-2">
                            +₹{bet.expectedReturn - bet.amount} profit
                          </span>
                        )}
                      </div>
                      
                      {/* Show result if available */}
                      {bet.result && (
                        <p><strong>Result:</strong> <span className="text-yellow-300">{bet.result}</span></p>
                      )}
                    </div>
                  </li>
                );
              })}
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