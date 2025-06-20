// src/pages/User/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleReset = () => {
    if (!mobile || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    alert('Password reset successfully!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-4 font-medium"
      >
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Mobile Number</label>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleReset}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
