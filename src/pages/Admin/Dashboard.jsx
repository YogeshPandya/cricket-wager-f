import React from 'react';
import AdminLayout from './components/AdminLayout';

const users = [
  {
    id: 1,
    name: 'Yogesh Pandya',
    email: 'yogesh@example.com',
    bets: [
      { match: 'India vs Australia', amount: 500, result: 'Win', winAmount: 900 },
      { match: 'England vs Pakistan', amount: 300, result: 'Loss', winAmount: 0 }
    ]
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    bets: [
      { match: 'India vs Australia', amount: 1000, result: 'Loss', winAmount: 0 }
    ]
  }
];

export default function Dashboard() {
  const totalUsers = users.length;
  const totalBets = users.flatMap(u => u.bets).length;
  const totalAmount = users.flatMap(u => u.bets).reduce((sum, b) => sum + b.amount, 0);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6 text-green-700">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
      </div>

      {/* User-wise Bets Table */}
      <div className="space-y-10">
        {users.map((user, index) => {
          const totalBet = user.bets.reduce((sum, b) => sum + b.amount, 0);
          const totalWin = user.bets.reduce((sum, b) => sum + b.winAmount, 0);
          const totalLoss = user.bets
            .filter(b => b.result === 'Loss')
            .reduce((sum, b) => sum + b.amount, 0);
          const netResult = totalWin - totalBet;

          return (
            <div key={user.id} className="bg-white rounded-xl shadow-md border border-gray-200">
              <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between gap-2">
                <div className="font-semibold text-gray-800">
                  #{index + 1}. {user.name}{' '}
                  <span className="text-sm text-gray-500">({user.email})</span>
                </div>
                <div className="text-sm text-gray-600">
                  Total Bets: <b>{user.bets.length}</b>
                </div>
              </div>

              {/* Bet Table */}
            <div className="overflow-x-auto w-full">
  <table className="w-full text-sm text-left text-gray-700">

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
              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between text-sm gap-2 sm:gap-0">
                <span>Total Bet: <b className="text-blue-600">₹{totalBet}</b></span>
                <span>Total Won: <b className="text-green-600">₹{totalWin}</b></span>
                <span>Total Lost: <b className="text-red-500">₹{totalLoss}</b></span>
              </div>

              {/* Final Result Summary */}
              <div className="px-4 pb-4">
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
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
