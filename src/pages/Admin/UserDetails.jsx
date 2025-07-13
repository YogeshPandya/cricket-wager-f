import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import { fetchAllUsers } from '../../services/service'; // ✅ API import

export default function UserDetails() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from backend
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchAllUsers();
        console.log('✅ Users fetched:', data.length);
        setUsers(data); // ✅ Set API data to state
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  // ✅ Search logic
  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber?.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4 text-green-700">All User Details</h1>

      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-6">
          {filteredUsers.map((user) => {
            const totalRecharge = user.rechargeHistory?.reduce((sum, r) => sum + r.amount, 0) || 0;
            const totalWithdrawn = user.withdrawalHistory?.reduce((sum, w) => sum + w.amount, 0) || 0;
            const totalBet = user.bets?.reduce((sum, b) => sum + b.amount, 0) || 0;
            const totalWin = user.bets?.reduce((sum, b) => sum + b.winAmount, 0) || 0;
            const withdrawableAmount = totalRecharge - totalBet + totalWin - totalWithdrawn;
            const formattedDate = new Date(user.registrationDate).toLocaleString();

            return (
              <div key={user._id} className="bg-white border rounded-xl shadow-md p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h2 className="text-xl font-semibold text-blue-800">{user.name}</h2>
                  <button
                    onClick={() => navigate(`/admin/user-bets/${user._id}`)}
                    className="text-sm text-yellow-500 underline hover:text-yellow-600 mt-2 sm:mt-0"
                  >
                    View Bet Details →
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-700 mb-6">
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Phone:</strong> {user.phoneNumber}</div>
                  <div><strong>Registered On:</strong> {formattedDate}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-600 font-medium mb-1">Total Recharge</h3>
                    <p className="text-2xl font-bold text-blue-600">₹{totalRecharge}</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-600 font-medium mb-1">Withdrawable Amount</h3>
                    <p className="text-2xl font-bold text-purple-600">
                      ₹{withdrawableAmount >= 0 ? withdrawableAmount : 0}
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                    <h3 className="text-gray-600 font-medium mb-1">Withdrawn Amount</h3>
                    <p className="text-2xl font-bold text-green-600">₹{totalWithdrawn}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
