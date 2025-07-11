// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ import axios
import cricketLogo from '../../assets/cricket-logo.png'; // adjust path if needed

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username.trim() || !password.trim()) {
    setError('Username and Password are required.');
    return;
  }

  setError('');

  try {
    const res = await axios.post('http://localhost:5000/user/login', {
      username,
      password,
    });

    if (res.data.status) {
      // ✅ Save token in localStorage
      localStorage.setItem('access_token', res.data.data.access_token);

      // ✅ Optionally save user info too
      localStorage.setItem('user', JSON.stringify(res.data.data.user));

      alert('Login successful!');
      navigate('/home'); // Redirect to your home/dashboard
    } else {
      setError('Login failed: ' + res.data.message);
    }
  } catch (err) {
    console.error(err);
    setError('Login failed. Check console for more info.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">

        {/* Logo */}
        <img
          src={cricketLogo}
          alt="Cricket Logo"
          className="w-32 h-32 mx-auto mb-4"
        />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-green-400">Cricket</span>{' '}
          <span className="text-yellow-400">Wager</span>
        </h2>

        <h3 className="text-xl font-semibold text-yellow-300 mb-6">
          Login to your account
        </h3>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-400 text-sm font-medium">{error}</div>
          )}

          <div className="text-right text-sm">
            <Link to="/forgot-password" className="text-yellow-200 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Login
          </button>
        </form>

        {/* Bottom Links */}
        <div className="text-center mt-6 text-sm text-gray-300 space-y-1">
          <div>
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-300 hover:underline">
              Sign up
            </Link>
          </div>
          <div>
            <Link to="/admin/login" className="text-yellow-300 hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
