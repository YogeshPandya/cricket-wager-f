import React from 'react';
import AdminLayout from './components/AdminLayout';

const users = [
  {
    id: 1,
    name: 'Yogesh Pandya',
    bets: [
      { match: 'India vs Australia', amount: 500, result: 'Win', winAmount: 900 },
      { match: 'England vs Pakistan', amount: 300, result: 'Loss', winAmount: 0 }
    ]
  },
  {
    id: 2,
    name: 'Jane Doe',
    bets: [
      { match: 'India vs Australia', amount: 1000, result: 'Loss', winAmount: 0 }
    ]
  }
];

export default function Dashboard() {
  const totalUsers = users.length;
  const totalBets = users.flatMap(u => u.bets).length;
  const totalAmount = users.flatMap(u => u.bets).reduce((sum, b) => sum + b.amount, 0);
  const totalWinAmount = users.flatMap(u => u.bets).reduce((sum, b) => sum + b.winAmount, 0);
  const totalLossAmount = users
    .flatMap(u => u.bets)
    .filter(b => b.result === 'Loss')
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Users</h2>
          <p className="text-2xl font-bold text-green-600">{totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Bets</h2>
          <p className="text-2xl font-bold text-yellow-600">{totalBets}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Amount</h2>
          <p className="text-2xl font-bold text-blue-600">₹{totalAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Win Amount</h2>
          <p className="text-2xl font-bold text-green-700">₹{totalWinAmount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border">
          <h2 className="text-lg font-medium text-gray-600">Total Loss Amount</h2>
          <p className="text-2xl font-bold text-red-500">₹{totalLossAmount}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
