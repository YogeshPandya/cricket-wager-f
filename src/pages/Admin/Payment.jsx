import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { fetchPayments, updatePaymentStatus } from '../../services/service';

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('Recharge');

  useEffect(() => {
    fetchPayments().then((res) => {
      console.log('API Response:', res); // for debugging
      if (res.status && res.data) {
        // ✅ Fix: Use 'requests' instead of 'recharges'
        const recharges = (res.data.requests || []).map((r) => ({
          ...r,
          type: 'Recharge',
        }));

        // You can load withdrawals from another API if needed
        const withdrawals = [];

        setPayments([...recharges, ...withdrawals]);
      }
    });
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

  const handleApprove = async (username, utr) => {
  const res = await updatePaymentStatus(username, utr, 'Success');
  if (res.status) {
    setPayments((prev) =>
      prev.map((p) =>
        p.username === username && p.utr === utr ? { ...p, status: 'Success' } : p
      )
    );
  }
};

const handleReject = async (username, utr) => {
  const res = await updatePaymentStatus(username, utr, 'Failed');
  if (res.status) {
    setPayments((prev) =>
      prev.map((p) =>
        p.username === username && p.utr === utr ? { ...p, status: 'Failed' } : p
      )
    );
  }
};


  const filteredPayments = payments.filter((p) => p.type === activeTab);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-green-700">Payment Transactions</h1>

      {/* Tabs (Only Recharge for now) */}
      <div className="flex gap-4 mb-6">
        {['Recharge'].map((tab) => (
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
          <table className="min-w-[800px] w-full text-sm text-left text-gray-700 bg-white border rounded-xl overflow-hidden shadow">
            <thead className="bg-green-50 text-green-800 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">UTR</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 break-words">
                    {payment.username || payment.user?.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2">₹{payment.amount}</td>
                  <td className="px-4 py-2">{payment.utr || '-'}</td>
                  <td className={`px-4 py-2 font-semibold ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </td>
                  <td className="px-4 py-2 break-words">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                  {payment.status === 'Pending' && (
  <>
    <button
      onClick={() => handleApprove(payment.username, payment.utr)}
      className="text-green-600 hover:underline text-sm"
    >
      Approve
    </button>
    <button
      onClick={() => handleReject(payment.username, payment.utr)}
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
