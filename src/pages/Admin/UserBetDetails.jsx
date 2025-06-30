import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function UserBetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = users.find(u => u.id === parseInt(id));

  if (!user) {
    return (
      <AdminLayout>
        <p className="text-red-500">User not found.</p>
      </AdminLayout>
    );
  }

  // Total Calculations
  const totalBet = user.bets.reduce((sum, b) => sum + b.amount, 0);
  const totalWin = user.bets.reduce((sum, b) => sum + b.winAmount, 0);
  const totalLoss = user.bets
    .filter(b => b.result === 'Loss')
    .reduce((sum, b) => sum + b.amount, 0);
  const netResult = totalWin - totalBet;

  return (
    <AdminLayout>
      <button onClick={() => navigate(-1)} className="text-yellow-500 mb-4 font-medium">
        ← Back
      </button>

      <h1 className="text-xl font-bold mb-4 text-green-700">{user.name}'s Bet Details</h1>

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
            {user.bets.map((bet, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{bet.match}</td>
                <td className="px-4 py-2">₹{bet.amount}</td>
                <td className={`px-4 py-2 font-medium ${bet.result === 'Win' ? 'text-green-600' : 'text-red-500'}`}>
                  {bet.result}
                </td>
                <td className="px-4 py-2">{bet.result === 'Win' ? `₹${bet.winAmount}` : '-'}</td>
                <td className="px-4 py-2">{bet.result === 'Loss' ? `₹${bet.amount}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
