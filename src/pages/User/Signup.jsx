// src/pages/SignupPage.jsx
import React, { useState } from 'react';
import cricketLogo from '../../assets/cricket-logo.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    phoneNumber: '',
    referralCode: '',
  });

  // ✅ Better change handler using name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        referralCode: formData.referralCode || '',
        name: formData.username,
        email: `${formData.username}@example.com`,
      };

      const res = await axios.post('http://localhost:5000/user/signup', payload);

      if (res.data.status) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert('Signup failed: ' + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Signup failed. Please check console.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-gray-900 text-white px-4">
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-2xl shadow-xl text-center">

        {/* Logo */}
        <img src={cricketLogo} alt="Cricket Logo" className="w-32 h-32 mx-auto mb-4" />

        {/* Title */}
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-green-400">Cricket</span>{' '}
          <span className="text-yellow-400">Wager</span>
        </h2>

        <h3 className="text-xl font-semibold text-yellow-300 mb-6">
          Create your account
        </h3>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            name="referralCode"
            placeholder="Referral Code (Optional)"
            value={formData.referralCode}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Sign Up
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center mt-6 text-sm text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
