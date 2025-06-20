import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function RechargeRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Simulated data
    setRecords([
      {
        id: 1,
        amount: 500,
        createTime: '2025-06-14, 10:20 AM',
        finishTime: '2025-06-14, 10:22 AM',
        status: 'Success',
      },
      {
        id: 2,
        amount: 1000,
        createTime: '2025-06-13, 02:05 PM',
        finishTime: null,
        status: 'Pending',
      },
      {
        id: 3,
        amount: 300,
        createTime: '2025-06-12, 09:12 AM',
        finishTime: '2025-06-12, 09:15 AM',
        status: 'Failed',
      },
    ]);
  }, []);

  const statusColor = {
    Success: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button onClick={() => navigate('/account')} className="text-yellow-300 mb-4 font-medium">
  ← Back
</button>

      <h1 className="text-2xl font-bold mb-4">Recharge Records</h1>

      {records.length === 0 ? (
        <p className="text-center mt-12 text-gray-200">No recharge records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div key={r.id} className="bg-white bg-opacity-10 p-4 rounded-xl shadow-md">
              {/* Amount and Status */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">₹{r.amount}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[r.status]}`}>
                  {r.status}
                </span>
              </div>

              {/* Timestamps */}
              <div className="text-sm text-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white w-28">Create Time:</span>
                  <span>{r.createTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white w-28">Finish Time:</span>
                  <span>{r.finishTime ? r.finishTime : '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
