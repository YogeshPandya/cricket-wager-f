import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function WithdrawRecords() {
  const navigate = useNavigate();

  // Sample withdrawal records (dynamic data)
  const withdrawRecords = [
    {
      amount: 300,
      createTime: '2025-06-18, 10:45 AM',
      status: 'Success',
      finishTime: '2025-06-18, 10:50 AM',
    },
    {
      amount: 500,
      createTime: '2025-06-17, 09:30 AM',
      status: 'Pending',
      finishTime: '—',
    },
    {
      amount: 400,
      createTime: '2025-06-16, 03:00 PM',
      status: 'Failed',
      finishTime: '2025-06-16, 03:10 PM',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'text-green-400';
      case 'Pending':
        return 'text-yellow-300';
      case 'Failed':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
     <button onClick={() => navigate('/account')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Withdrawal Records</h1>

      <div className="space-y-4">
        {withdrawRecords.map((record, index) => (
          <div key={index} className="bg-white bg-opacity-10 p-4 rounded-xl shadow">
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Withdraw Amount:</span>
              <span className="font-bold text-yellow-300">₹{record.amount}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Create Time:</span>
              <span className="text-sm">{record.createTime}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Finish Time:</span>
              <span className="text-sm">{record.finishTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Status:</span>
              <span className={`text-sm font-semibold ${getStatusColor(record.status)}`}>
                {record.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
