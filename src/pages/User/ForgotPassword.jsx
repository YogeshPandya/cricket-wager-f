// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cricketLogo from '../../assets/cricket-logo.png';
import { forgotPassword } from '../../services/service'; // ✅ Imported from service

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await forgotPassword({ identifier }); // ✅ using service function

      if (res.data.status) {
        alert(`Reset Token: ${res.data.data.resetToken}`);
        localStorage.setItem('reset_identifier', identifier);
        localStorage.setItem('reset_token', res.data.data.resetToken);
        navigate('/reset-password-login');
      } else {
        setError('Failed to generate reset token.');
      }
    } catch (err) {
      console.error(err);
      setError('User not found or server error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">
        <img
          src={cricketLogo}
          alt="Cricket Logo"
          className="w-32 h-32 mx-auto mb-4"
        />

        <h2 className="text-3xl font-bold mb-2">
          <span className="text-green-400">Cricket</span>{' '}
          <span className="text-yellow-400">Wager</span>
        </h2>

        <h3 className="text-xl font-semibold text-yellow-300 mb-6">
          Reset your password
        </h3>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white text-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300">
          Remember your password?{' '}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
