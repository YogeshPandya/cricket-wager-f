import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserWithdrawals } from '../../services/service';

export default function WithdrawRecords() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const response = await fetchUserWithdrawals();
        console.log('Withdraw API Response:', response);

        const withdrawals = response.data.withdrawals; // ✅ fixed

        if (!Array.isArray(withdrawals)) {
          console.error('Invalid withdrawals format:', withdrawals);
          setRecords([]);
          return;
        }

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

        setRecords(formatted);
      } catch (error) {
        console.error('Failed to fetch withdrawals:', error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    loadWithdrawals();
  }, []);

  const statusColor = {
    Success: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-6 font-semibold text-lg hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Withdrawal Records</h1>

      {loading ? (
        <p className="text-center mt-12 text-gray-200">Loading...</p>
      ) : records.length === 0 ? (
        <p className="text-center mt-12 text-gray-200">No withdrawal records found.</p>
      ) : (
        <div className="space-y-4">
          {records.map((r) => (
            <div
              key={r.id}
              className="bg-white bg-opacity-10 p-4 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold">₹{r.amount}</span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[r.status]}`}
                >
                  {r.status}
                </span>
              </div>

              <div className="text-sm text-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-white w-28">Create Time:</span>
                  <span>{r.createTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-white w-28">Finish Time:</span>
                  <span>{r.finishTime || '—'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
