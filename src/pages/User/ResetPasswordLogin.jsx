import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async () => {
    if (!username || !accessToken || !newPassword) {
      setError('Please fill in all fields.');
      setSuccess('');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/user/reset-login-password', {
        username,
        accessToken,
        newPassword,
      });

      setSuccess(res.data.message || 'Password reset successful.');
      setError('');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      setError(msg);
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* X Button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/forgot-password')}
          className="text-white text-2xl font-bold hover:text-red-400"
        >
          ×
        </button>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6 mt-2">Reset Login Password</h1>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Access Token</label>
          <input
            type="text"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Enter access token"
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

        {/* Error or Success Message */}
        {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
        {success && <p className="text-green-300 text-sm font-medium">{success}</p>}

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
