// src/pages/User/Withdraw.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export default function Withdraw() {
  const navigate = useNavigate();

  const [isBankLinked] = useState(false); // Simulated bank status
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const balance = 850; // Simulated balance

  useEffect(() => {
    if (!isBankLinked) {
      setShowModal(true);
    }
  }, [isBankLinked]);

  const handleWithdraw = () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (balance < 200) {
      setError('Insufficient balance to withdraw. Minimum required: ₹200');
      return;
    }

    if (numericAmount < 200) {
      setError('Minimum withdrawal amount is ₹200');
      return;
    }

    if (numericAmount > balance) {
      setError('You cannot withdraw more than your available balance');
      return;
    }

    setError('');
    alert(`Withdrawal of ₹${amount} requested.`);
  };

  const handleLinkBank = () => {
    navigate('/link-bank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button onClick={() => navigate('/account')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-2">Withdraw</h1>

      {/* Show Current Balance */}
      <p className="mb-6 text-yellow-300 font-medium">
        Available Balance: ₹{balance.toFixed(2)}
      </p>

      {/* Input Field */}
      <div className="mb-3">
        <label className="block mb-2 text-sm font-medium">Enter Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError('');
          }}
          placeholder="e.g. 500"
          className="w-full px-4 py-2 rounded-xl text-black text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        {error && <p className="text-red-400 mt-1 text-sm font-semibold">{error}</p>}
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition"
      >
        Withdraw Now
      </button>

      {/* Rules */}
      <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white mt-6">
        <h2 className="text-yellow-300 font-bold mb-2">Withdraw Rules:</h2>
        <ul className="list-disc ml-4 space-y-1 leading-relaxed">
          <li>Minimum withdrawal amount is ₹200.</li>
          <li>Withdrawals may take up to 24 hours to process.</li>
          <li>Ensure your bank account is correctly linked before proceeding.</li>
        </ul>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 px-4">
          <div className="bg-white text-black p-6 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200 relative">
            <h2 className="text-xl font-bold mb-2 text-center text-red-600">⚠️ Bank Account Not Linked</h2>
            <p className="text-sm mb-4 text-center text-gray-700">
              You need to link your bank account before withdrawing funds.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => navigate('/account')}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkBank}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-semibold"
              >
                Link Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
