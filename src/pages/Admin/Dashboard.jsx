import React, { useEffect, useState } from 'react';
import AdminLayout from './components/AdminLayout';
import { fetchAllUsers } from '../../services/service';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

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

  const totalUsers = users.length;

  const allBets = users.flatMap(user => user.bets || []);

  const totalBets = allBets.length;

  const totalAmount = allBets.reduce((sum, b) => sum + (b.amount || 0), 0);

  const totalWinAmount = allBets.reduce((sum, b) => {
    if (getBetStatus(b) === 'won') {
      return sum + getExpectedReturn(b);
    }
    return sum;
  }, 0);

  const totalLossAmount = allBets.reduce((sum, b) => {
    if (getBetStatus(b) === 'lost') {
      return sum + (b.amount || 0);
    }
    return sum;
  }, 0);

  const netResult = totalWinAmount - totalLossAmount;

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-500">Loading dashboard data...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Bets</h2>
          <p className="text-2xl font-bold text-yellow-600">{totalBets}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Bet Amount</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Won</h2>
          <p className="text-2xl font-bold text-green-700">₹{totalWinAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Lost</h2>
          <p className="text-2xl font-bold text-red-500">₹{totalLossAmount}</p>
        </div>
        <div className={`p-4 rounded-xl shadow text-center border ${netResult > 0 ? 'bg-green-50' : netResult < 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
          <h2 className={`text-lg font-medium ${netResult > 0 ? 'text-green-700' : netResult < 0 ? 'text-red-700' : 'text-gray-700'}`}>
            Net Result
          </h2>
          <p className={`text-2xl font-bold ${netResult > 0 ? 'text-green-800' : netResult < 0 ? 'text-red-800' : 'text-gray-800'}`}>
            {netResult > 0 ? '+' : ''}₹{netResult}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
