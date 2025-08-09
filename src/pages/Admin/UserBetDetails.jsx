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

  // ✅ Calculations
  const totalBet = bets.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalWin = bets.reduce((sum, b) => sum + (b.winAmount || 0), 0);
  const totalLoss = bets.filter(b => b.result === 'Loss').reduce((sum, b) => sum + (b.amount || 0), 0);
  const netResult = totalWin - totalBet;

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

      {/* Bets Table */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Bet History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 border">
            <thead className="bg-green-50 text-green-800 font-semibold">
              <tr>
                <th className="px-4 py-2">Match</th>
                <th className="px-4 py-2">Bet (₹)</th>
                <th className="px-4 py-2">Result</th>
                <th className="px-4 py-2">Won (₹)</th>
                <th className="px-4 py-2">Lost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {bets.length > 0 ? (
                bets.map((bet, idx) => (
                  <tr key={idx} className="border-t">
                     <td className="px-4 py-2">{getMatchNameById(bet.matchId) || bet.match}</td>
                    <td className="px-4 py-2">₹{bet.amount}</td>
                    <td className={`px-4 py-2 font-medium ${bet.result === 'Win' ? 'text-green-600' : 'text-red-500'}`}>
                      {bet.result}
                    </td>
                    <td className="px-4 py-2">{bet.result === 'Win' ? `₹${bet.winAmount}` : '-'}</td>
                    <td className="px-4 py-2">{bet.result === 'Loss' ? `₹${bet.amount}` : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-2 text-gray-500 italic">No bets found</td>
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
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2">₹{recharge.amount}</td>
                    <td className="px-4 py-2">{recharge.time || new Date(recharge.createdAt).toLocaleString()}</td>
                    <td className={`px-4 py-2 ${recharge.status === 'Success' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {recharge.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-gray-500 italic">No recharge history</td>
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
                  <tr key={w.id} className="border-t">
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
                  <td colSpan={4} className="px-4 py-2 text-gray-500 italic">No withdrawal history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Summary Footer */}
      <div className="p-4 mt-4 bg-gray-50 flex flex-col sm:flex-row justify-between text-sm gap-2 sm:gap-0 rounded-lg shadow-inner border">
        <span>Total Bet: <b className="text-blue-600">₹{totalBet}</b></span>
        <span>Total Won: <b className="text-green-600">₹{totalWin}</b></span>
        <span>Total Lost: <b className="text-red-500">₹{totalLoss}</b></span>
      </div>

      {/* Net Result */}
      <div className="px-4 pt-4 pb-6">
        {netResult > 0 ? (
          <span className="inline-block bg-green-600 text-white px-6 py-2 rounded-full shadow font-semibold text-sm">
            Result: ₹{netResult} Won
          </span>
        ) : netResult < 0 ? (
          <span className="inline-block bg-red-600 text-white px-6 py-2 rounded-full shadow font-semibold text-sm">
            Result: ₹{Math.abs(netResult)} Lost
          </span>
        ) : (
          <span className="inline-block bg-gray-500 text-white px-6 py-2 rounded-full shadow font-semibold text-sm">
            Result: No Profit No Loss
          </span>
        )}
      </div>
    </AdminLayout>
  );
}
