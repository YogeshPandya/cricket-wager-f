import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { fetchPayments, updatePaymentStatus, updateWithdrawStatus } from '../../services/service';

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [activeTab, setActiveTab] = useState('Recharge');

  // Fetch Recharge payments
  useEffect(() => {
    fetchPayments().then((res) => {
      if (res.status && res.data) {
        const recharges = (res.data.requests || []).map((r) => ({
          ...r,
          type: 'Recharge',
        }));
        setPayments(recharges);
      }
    });
  }, []);

  // Fetch Withdrawal requests
// ✅ Corrected useEffect for Withdrawal requests
useEffect(() => {
  fetch('http://localhost:5000/user/admin/withdrawals')
    .then(res => res.json())
    .then(res => {
      const withdrawals = res?.data?.data?.data || [];
      setWithdrawals(withdrawals);
    })
    .catch(err => {
      console.error(err);
      setWithdrawals([]);
    });
}, []);








  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
      case 'approved':
        return 'text-green-600';
      case 'Pending':
      case 'pending':
        return 'text-yellow-600';
      case 'Failed':
      case 'Rejected':
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Recharge handlers
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

  // Withdraw handlers
  const handleWithdrawApprove = async (username, createdAt) => {
    try {
      const res = await updateWithdrawStatus(username, createdAt, 'approved');
      if (res.status) {
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.username === username && w.createdAt === createdAt 
              ? { ...w, status: 'approved' } 
              : w
          )
        );
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
    }
  };

  const handleWithdrawReject = async (username, createdAt) => {
    try {
      const res = await updateWithdrawStatus(username, createdAt, 'rejected');
      if (res.status) {
        setWithdrawals((prev) =>
          prev.map((w) =>
            w.username === username && w.createdAt === createdAt 
              ? { ...w, status: 'rejected' } 
              : w
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
    }
  };

  // Get filtered data based on active tab
  const getFilteredData = () => {
    if (activeTab === 'Recharge') {
      return payments;
    } else if (activeTab === 'Withdraw') {
      return withdrawals;
    }
    return [];
  };

  const filteredData = getFilteredData();

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
      {filteredData.length === 0 ? (
        <p className="text-gray-500 italic">No {activeTab.toLowerCase()} records found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-[800px] w-full text-sm text-left text-gray-700 bg-white border rounded-xl overflow-hidden shadow">
            <thead className="bg-green-50 text-green-800 text-sm uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                {activeTab === 'Recharge' && <th className="px-4 py-3">UTR</th>}
                {activeTab === 'Withdraw' && <th className="px-4 py-3">UPI ID</th>}
                {activeTab === 'Withdraw' && <th className="px-4 py-3">Holder Name</th>}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id || `${item.username}-${item.createdAt}`} className="border-t hover:bg-gray-50">

                  <td className="px-4 py-2 break-words">
                    {item.username || item.user?.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2">₹{item.amount}</td>
                  
                  {/* Recharge specific columns */}
                  {activeTab === 'Recharge' && (
                    <td className="px-4 py-2">{item.utr || '-'}</td>
                  )}
                  
                  {/* Withdraw specific columns */}
                  {activeTab === 'Withdraw' && (
                    <>
                      <td className="px-4 py-2">{item.upiId || '-'}</td>
                      <td className="px-4 py-2">{item.holderName || '-'}</td>
                    </>
                  )}
                  
                  <td className={`px-4 py-2 font-semibold ${getStatusColor(item.status)}`}>
                    {item.status}
                  </td>
                  <td className="px-4 py-2 break-words">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                    
                    {/* Recharge Actions */}
                    {activeTab === 'Recharge' && item.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(item.username, item.utr)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.username, item.utr)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {/* Withdraw Actions */}
                    {activeTab === 'Withdraw' && (item.status === 'pending' || item.status === 'Pending') && (
                      <>
                        <button
                          onClick={() => handleWithdrawApprove(item.username, item.createdAt)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleWithdrawReject(item.username, item.createdAt)}
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