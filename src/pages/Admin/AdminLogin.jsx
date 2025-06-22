// src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import cricketLogo from '../../assets/cricket-logo.png'; // adjust path if needed

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform admin login logic here

    // On success
    console.log("Admin Login", { email, password });
    navigate("/admin/dashboard");
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
          <span className="text-green-400">Admin</span>{' '}
          <span className="text-yellow-400">Panel</span>
        </h2>

        <h3 className="text-xl font-semibold text-yellow-300 mb-6">
          Login to admin account
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Admin Login
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300">
          Not an admin?{' '}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Go to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
