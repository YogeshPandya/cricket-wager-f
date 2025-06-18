// src/pages/SignupPage.jsx
import React from 'react';
import cricketLogo from '../../assets/cricket-logo.png'; // Make sure path is correct

export default function SignupPage() {
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
          Create your account
        </h3>

        <form className="space-y-4 text-left">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            placeholder="Referral Code (Optional)"
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white border border-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 hover:from-green-600 hover:to-yellow-500 font-bold text-black transition"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-yellow-300 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
