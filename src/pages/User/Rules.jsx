// src/pages/User/Rules.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Rules() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button onClick={() => navigate('/account')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Rules and Conditions</h1>

      {/* Rules Content */}
      <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white">
        <h2 className="text-yellow-300 font-bold mb-2">Important Guidelines:</h2>
        <ul className="list-disc ml-4 space-y-1">
          <li className="pl-1 leading-relaxed">
            Users must be 18 years or older to participate.
          </li>
          <li className="pl-1 leading-relaxed">
            All transactions including recharge and withdrawal are final and non-refundable.
          </li>
          <li className="pl-1 leading-relaxed">
            Betting or prediction outcomes are based on live match data and may vary slightly due to delays.
          </li>
          <li className="pl-1 leading-relaxed">
            Make sure your bank/UPI details are correct to avoid failed transactions.
          </li>
          <li className="pl-1 leading-relaxed">
            Users are responsible for maintaining the confidentiality of their account details.
          </li>
          <li className="pl-1 leading-relaxed">
            Violation of terms can result in account suspension or permanent ban.
          </li>
        </ul>
      </div>
    </div>
  );
}
