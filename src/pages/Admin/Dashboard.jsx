import React, { useEffect, useState, useCallback } from 'react';
import AdminLayout from './components/AdminLayout';
import { fetchAllUsers, getAllMatches, getUserBets } from '../../services/service'; // Add getUserBets
import socket from '../../socket';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [recentBets, setRecentBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
 

  // ✅ Helper to get match name by ID
  const getMatchNameById = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    return match ? `${match.teamA} vs ${match.teamB}` : matchId;
  };

  // ✅ Normalize status like in UserBetDetails
  const getBetStatus = (bet) => {
    const status = bet.betstatus || bet.result;
    if (!status) return 'pending';
    const s = status.toLowerCase();
    if (s === 'won' || s === 'win') return 'won';
    if (s === 'lost' || s === 'loss') return 'lost';
    return 'pending';
  };

  // ✅ Same expected return logic
  const getExpectedReturn = (bet) => {
    return bet.expectedReturn || bet.winAmount || 0;
  };

  // ✅ Helper function to get status display
  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case 'won':
        return { text: 'WON', color: 'text-green-400', bg: 'bg-green-400 bg-opacity-20' };
      case 'lost':
        return { text: 'LOST', color: 'text-red-400', bg: 'bg-red-400 bg-opacity-20' };
      case 'pending':
        return { text: 'PENDING', color: 'text-yellow-400', bg: 'bg-yellow-400 bg-opacity-20' };
      default:
        return { text: status?.toUpperCase() || 'PENDING', color: 'text-gray-400', bg: 'bg-gray-400 bg-opacity-20' };
    }
  };

  // ✅ NEW: Enhanced fetch data function with separate bet fetching
  const fetchData = useCallback(async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      
      const [usersData, matchesData] = await Promise.all([
        fetchAllUsers(),
        getAllMatches()
      ]);
      
      console.log('👥 Users data:', usersData);
      console.log('⚽ Matches data:', matchesData);
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setMatches(Array.isArray(matchesData) ? matchesData : []);
      
      // ✅ NEW: Fetch all user bets separately if not included in users
      const allBetsWithUser = [];
      
      if (Array.isArray(usersData) && usersData.length > 0) {
        // Try to get bets from users data first
        for (const user of usersData) {
          let userBets = [];
          
          // Check if bets are already included in user data
          if (user.bets && Array.isArray(user.bets) && user.bets.length > 0) {
            userBets = user.bets;
            console.log(`✅ Found ${userBets.length} bets for user ${user.username} in user data`);
          } else {
            // If not, fetch separately using getUserBets
            try {
              const betsData = await getUserBets(user._id || user.id);
              userBets = Array.isArray(betsData) ? betsData : [];
              console.log(`📥 Fetched ${userBets.length} bets separately for user ${user.username}`);
            } catch (error) {
              console.log(`❌ Could not fetch bets for user ${user.username}:`, error);
              userBets = [];
            }
          }
          
          // Add user info to each bet
          userBets.forEach(bet => {
            allBetsWithUser.push({
              ...bet,
              username: user.username || user.name || 'Unknown User',
              userId: user._id || user.id,
              userEmail: user.email,
              betTime: bet.createdAt || bet.time || new Date().toISOString()
            });
          });
        }
      }
      
      console.log(`📊 Total bets found: ${allBetsWithUser.length}`);
      
      // Filter only pending bets and sort by time (most recent first)
      const pendingBets = allBetsWithUser.filter(bet => getBetStatus(bet) === 'pending');
      const sortedBets = pendingBets.sort((a, b) => 
        new Date(b.betTime) - new Date(a.betTime)
      ).slice(0, 50); // Show last 50 pending bets
      
      setRecentBets(sortedBets);
      setLastUpdate(new Date());
      
      console.log(`✅ Dashboard updated with ${sortedBets.length} pending bets`);
      
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleBetPlaced = (data) => {
      // Immediately update for real-time effect
      fetchData();
    };

    const handleQuestionUpdated = ({ question }) => {
      if (question.result) {
        // Immediately refresh to remove completed bets from pending list
        fetchData();
      }
    };

    // Listen to socket events
    socket.on('betPlaced', handleBetPlaced);
    socket.on('questionUpdated', handleQuestionUpdated);
    
    // Also listen to window events (in case socket fails)
    const handleWindowBetPlaced = () => {
      fetchData();
    };
    
    window.addEventListener("betPlaced", handleWindowBetPlaced);
    
    return () => {
      socket.off('betPlaced', handleBetPlaced);
      socket.off('questionUpdated', handleQuestionUpdated);
      window.removeEventListener("betPlaced", handleWindowBetPlaced);
    };
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000); // Refresh every 30 seconds for real-time pending bets

    return () => clearInterval(interval);
  }, [fetchData]);

  // ✅ Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchData();
  };

  // ✅ Calculate totals from pending bets only
  const allBets = [];
  users.forEach(user => {
    if (user.bets && Array.isArray(user.bets)) {
      allBets.push(...user.bets);
    }
  });
  
  const totalUsers = users.length;
  const pendingBets = recentBets.length; // This is pending bets count
  
  // Calculate total bet amount from pending bets only
  const totalBetAmount = recentBets.reduce((sum, b) => sum + (b.amount || 0), 0);
  
  // Calculate total expected return from pending bets only
  const totalExpectedReturn = recentBets.reduce((sum, b) => {
    return sum + getExpectedReturn(b);
  }, 0);

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header with Refresh */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Live Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                🔄 Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Pending Bets</h2>
          <p className="text-2xl font-bold text-yellow-600">{pendingBets}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Pending Bet Amount</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalBetAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Pending Expected Return</h2>
          <p className="text-2xl font-bold text-green-700">₹{totalExpectedReturn}</p>
        </div>
      </div>

      {/* Recent Bets Section */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              🟡 Pending Bets ({recentBets.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-yellow-600 font-medium">Live Updates</span>
            </div>
          </div>
        </div>

        {recentBets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700 font-semibold">
                <tr>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Match</th>
                  <th className="px-4 py-3 text-left">Question</th>
                  <th className="px-4 py-3 text-left">Option</th>
                  <th className="px-4 py-3 text-left">Bet Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Expected Return</th>
                  <th className="px-4 py-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentBets.map((bet, idx) => {
                  const status = getBetStatus(bet);
                  const statusDisplay = getStatusDisplay(status);
                  const expectedReturn = getExpectedReturn(bet);

                  return (
                    <tr 
                      key={`${bet.userId}-${bet._id || idx}`} 
                      className={`border-t hover:bg-gray-50 transition-colors ${idx < 5 ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-blue-600">
                            {bet.username}
                          </span>
                          {bet.userEmail && (
                            <span className="text-xs text-gray-500">
                              {bet.userEmail}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 font-medium">
                        {getMatchNameById(bet.matchId) || `${bet.teamA} vs ${bet.teamB}` || bet.match || 'N/A'}
                      </td>
                      
                      <td className="px-4 py-3 text-gray-600 max-w-xs">
                        <div className="truncate" title={bet.question}>
                          {bet.question || 'N/A'}
                        </div>
                      </td>
                      
                      <td className="px-4 py-3 font-medium text-purple-600">
                        {bet.option || 'N/A'}
                      </td>
                      
                      <td className="px-4 py-3 font-bold text-blue-600">
                        ₹{bet.amount || 0}
                      </td>
                      
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusDisplay.color} ${statusDisplay.bg}`}>
                          {statusDisplay.text}
                        </span>
                      </td>
                      
                      <td className="px-4 py-3 font-medium text-green-600">
                        ₹{expectedReturn}
                      </td>
                      
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(bet.betTime).toLocaleTimeString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Bets</h3>
            <p className="text-gray-500">
              {users.length === 0 ? 'No users found' : 'All bets have been completed or no bets placed yet'}
            </p>
            <button 
              onClick={handleRefresh}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              🔄 Refresh Data
            </button>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          🟡 Live pending bets • Auto-refresh every 30 seconds
        </p>
      </div>
    </AdminLayout>
  );
}