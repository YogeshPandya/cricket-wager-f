import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('Recharge');

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        user: 'Rahul Sharma',
        type: 'Recharge',
        amount: 500,
        status: 'Success',
        time: '2025-06-21 10:45 AM',
      },
      {
        id: 2,
        user: 'Neha Verma',
        type: 'Withdraw',
        amount: 300,
        status: 'Pending',
        time: '2025-06-22 02:15 PM',
      },
      {
        id: 3,
        user: 'Amit Singh',
        type: 'Recharge',
        amount: 1000,
        status: 'Pending',
        time: '2025-06-23 09:30 AM',
      },
      {
        id: 4,
        user: 'Priya Gupta',
        type: 'Withdraw',
        amount: 800,
        status: 'Success',
        time: '2025-06-24 11:00 AM',
      },
    ];
    setPayments(dummyData);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return 'text-green-600';
      case 'Pending':
        return 'text-yellow-600';
      case 'Failed':
      case 'Rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleApprove = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Success' } : p))
    );
  };

  const handleReject = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'Failed' } : p))
    );
  };

  const filteredPayments = payments.filter((p) => p.type === activeTab);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-green-700">Payment Transactions</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {['Recharge', 'Withdraw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      {filteredPayments.length === 0 ? (
        <p className="text-gray-500 italic">No {activeTab.toLowerCase()} records found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm text-left text-gray-700 bg-white border rounded-xl overflow-hidden shadow">
            <thead className="bg-green-50 text-green-800 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 break-words">{payment.user}</td>
                  <td className="px-4 py-2">₹{payment.amount}</td>
                  <td className={`px-4 py-2 font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </td>
                  <td className="px-4 py-2 break-words">{payment.time}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                    {payment.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(payment.id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(payment.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
