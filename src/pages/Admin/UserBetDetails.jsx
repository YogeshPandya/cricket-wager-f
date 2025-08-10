import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import {
  getUserBets,
  fetchRechargeHistory,
  fetchUserWithdrawals,getAllMatches
} from '../../services/service';

export default function UserBetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bets, setBets] = useState([]);
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [matches, setMatches] = useState([])

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch bets
        const betData = await getUserBets(id);
        setBets(Array.isArray(betData) ? betData : []);
        if (betData?.length > 0 && betData[0].username) {
          setUserName(betData[0].username);
        }

        // ✅ Fetch recharge history
        const rechargeData = await fetchRechargeHistory(id);
        setRechargeHistory(Array.isArray(rechargeData) ? rechargeData : []);

        // ✅ Fetch withdrawal history (same logic as WithdrawRecords)
        const withdrawalRes = await fetchUserWithdrawals(id);
        console.log('Withdraw API Response:', withdrawalRes);

        const withdrawals = withdrawalRes?.data?.withdrawals;
        if (Array.isArray(withdrawals)) {
          const formatted = withdrawals.map((item, index) => ({
            id: index + 1,
            amount: item.amount,
            status: item.status,
            createTime: new Date(item.createdAt).toLocaleString(),
            finishTime:
              item.status !== 'Pending'
                ? new Date(item.updatedAt || item.createdAt).toLocaleString()
                : null,
          }));
          setWithdrawalHistory(formatted);
        } else {
          setWithdrawalHistory([]);
        }

        const matchesData = await getAllMatches();
        setMatches(Array.isArray(matchesData) ? matchesData : []);

      } catch (err) {
        console.error('Error loading user details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  
   // ✅ Helper to get match name by ID
  const getMatchNameById = (matchId) => {
    const match = matches.find((m) => m._id === matchId);
    return match ? `${match.teamA} vs ${match.teamB}` : matchId;
  };

  // ✅ Helper function to get status display (exactly like MyMatch)
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

  // ✅ Helper function to normalize bet status (handles both formats)
  const getBetStatus = (bet) => {
    // Handle both 'result' and 'betstatus' fields
    const status = bet.betstatus || bet.result;
    if (!status) return 'pending';
    
    // Normalize different status formats
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus === 'won' || normalizedStatus === 'win') return 'won';
    if (normalizedStatus === 'lost' || normalizedStatus === 'loss') return 'lost';
    return 'pending';
  };

  // ✅ Helper function to get expected return (like MyMatch)
  const getExpectedReturn = (bet) => {
    return bet.expectedReturn || bet.winAmount || 0;
  };

  // ✅ Improved Calculations (exactly like MyMatch)
  const totalBet = bets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalWin = bets.reduce((sum, b) => {
    if (getBetStatus(b) === 'won') {
      return sum + getExpectedReturn(b);
    }
    return sum;
  }, 0);
  const totalLoss = bets.reduce((sum, b) => {
    if (getBetStatus(b) === 'lost') {
      return sum + (b.amount || 0);
    }
    return sum;
  }, 0);
  
  // Net profit/loss calculation (total won - total lost)
  const netResult = totalWin - totalLoss;
  
  // Count winning and losing bets
  const winningBets = bets.filter(b => getBetStatus(b) === 'won').length;
  const losingBets = bets.filter(b => getBetStatus(b) === 'lost').length;

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-500">Loading user details...</p>
      </AdminLayout>
    );
  }

  if (!bets.length && !rechargeHistory.length && !withdrawalHistory.length) {
    return (
      <AdminLayout>
        <button onClick={() => navigate(-1)} className="text-yellow-500 mb-4 font-medium">
          ← Back
        </button>
        <p className="text-red-500">No records found for this user.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="text-yellow-500 mb-4 font-medium">
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4 text-green-700">
        {userName ? `${userName}'s Account Summary` : 'User Account Summary'}
      </h1>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-blue-700 font-semibold text-sm">Total Bets</h3>
          <p className="text-2xl font-bold text-blue-800">₹{totalBet}</p>
          <p className="text-xs text-blue-600">{bets.length} bets placed</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-green-700 font-semibold text-sm">Total Won</h3>
          <p className="text-2xl font-bold text-green-800">₹{totalWin}</p>
          <p className="text-xs text-green-600">{winningBets} winning bets</p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-red-700 font-semibold text-sm">Total Lost</h3>
          <p className="text-2xl font-bold text-red-800">₹{totalLoss}</p>
          <p className="text-xs text-red-600">{losingBets} losing bets</p>
        </div>
        
        <div className={`p-4 rounded-lg border ${netResult > 0 ? 'bg-green-50 border-green-200' : netResult < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`font-semibold text-sm ${netResult > 0 ? 'text-green-700' : netResult < 0 ? 'text-red-700' : 'text-gray-700'}`}>Net Result</h3>
          <p className={`text-2xl font-bold ${netResult > 0 ? 'text-green-800' : netResult < 0 ? 'text-red-800' : 'text-gray-800'}`}>
            {netResult > 0 ? '+' : ''}₹{netResult}
          </p>
          <p className={`text-xs ${netResult > 0 ? 'text-green-600' : netResult < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {netResult > 0 ? 'Profit' : netResult < 0 ? 'Loss' : 'Break Even'}
          </p>
        </div>
      </div>

      {/* Enhanced Bets Table with Question, Option and Result */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Bet History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-green-50 text-green-800 font-semibold">
              <tr>
                <th className="px-3 py-2">Match</th>
                <th className="px-3 py-2">Question</th>
                <th className="px-3 py-2">Option Selected</th>
                <th className="px-3 py-2">Result</th>
                <th className="px-3 py-2">Bet (₹)</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Expected Return (₹)</th>
                <th className="px-3 py-2">Profit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bets.length > 0 ? (
                bets.map((bet, idx) => {
                  const status = getBetStatus(bet);
                  const statusDisplay = getStatusDisplay(status);
                  const expectedReturn = getExpectedReturn(bet);
                  const profit = status === 'won' ? expectedReturn - (bet.amount || 0) : 0;
                  
                  return (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">
                        {getMatchNameById(bet.matchId) || `${bet.teamA} vs ${bet.teamB}` || bet.match}
                      </td>
                      <td className="px-3 py-2 text-gray-600 max-w-xs">
                        {bet.question || 'N/A'}
                      </td>
                      <td className="px-3 py-2 font-medium text-blue-600">
                        {bet.option || 'N/A'}
                      </td>
                      <td className="px-3 py-2 font-medium text-yellow-300">
                        {bet.result || 'Not declared yet'}
                      </td>
                      <td className="px-3 py-2 font-medium">₹{bet.amount || 0}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusDisplay.color} ${statusDisplay.bg}`}>
                          {statusDisplay.text}
                        </span>
                        {/* Show profit for won bets (like MyMatch) */}
                        {status === 'won' && (
                          <span className="text-green-300 text-xs font-bold ml-2">
                            +₹{profit} profit
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 font-medium text-green-600">
                        ₹{expectedReturn}
                      </td>
                      <td className={`px-3 py-2 font-bold ${status === 'won' ? 'text-green-600' : 'text-gray-500'}`}>
                        {status === 'won' ? `+₹${profit}` : '₹0'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-2 text-gray-500 italic text-center">No bets found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recharge History Table */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-700">Recharge History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-blue-50 text-blue-800 font-semibold">
              <tr>
                <th className="px-4 py-2">Amount (₹)</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {rechargeHistory.length > 0 ? (
                rechargeHistory.map((recharge, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">₹{recharge.amount}</td>
                    <td className="px-4 py-2">{recharge.time || new Date(recharge.createdAt).toLocaleString()}</td>
                    <td className={`px-4 py-2 ${recharge.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {recharge.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-gray-500 italic text-center">No recharge history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Withdrawal History Table */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-purple-700">Withdrawal History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-purple-50 text-purple-800 font-semibold">
              <tr>
                <th className="px-4 py-2">Amount (₹)</th>
                <th className="px-4 py-2">Create Time</th>
                <th className="px-4 py-2">Finish Time</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalHistory.length > 0 ? (
                withdrawalHistory.map((w) => (
                  <tr key={w.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">₹{w.amount}</td>
                    <td className="px-4 py-2">{w.createTime}</td>
                    <td className="px-4 py-2">{w.finishTime || '—'}</td>
                    <td className={`px-4 py-2 ${w.status === 'Success' ? 'text-green-600' : w.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {w.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-gray-500 italic text-center">No withdrawal history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Enhanced Summary Footer */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-lg border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Financial Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Bet</p>
            <p className="text-xl font-bold text-blue-600">₹{totalBet}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Won</p>
            <p className="text-xl font-bold text-green-600">₹{totalWin}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Lost</p>
            <p className="text-xl font-bold text-red-500">₹{totalLoss}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Result</p>
            <p className={`text-xl font-bold ${netResult > 0 ? 'text-green-600' : netResult < 0 ? 'text-red-500' : 'text-gray-500'}`}>
              {netResult > 0 ? '+' : ''}₹{netResult}
            </p>
          </div>
        </div>
        
        {/* Final Result Badge */}
        <div className="mt-4 text-center">
          {netResult > 0 ? (
            <span className="inline-block bg-green-600 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg">
              🎉 Total Profit: ₹{netResult}
            </span>
          ) : netResult < 0 ? (
            <span className="inline-block bg-red-600 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg">
              📉 Total Loss: ₹{Math.abs(netResult)}
            </span>
          ) : (
            <span className="inline-block bg-gray-500 text-white px-8 py-3 rounded-full shadow-lg font-bold text-lg">
              ⚖️ Break Even: ₹0
            </span>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}