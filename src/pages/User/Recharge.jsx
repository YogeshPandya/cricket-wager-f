// src/pages/User/Recharge.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Recharge() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const presetAmounts = [100, 500, 1000, 3000, 5000, 10000];

  const handlePresetClick = (value) => {
    setAmount(value.toString());
    setError('');
  };

  const handleRecharge = () => {
    const numericAmount = Number(amount);

    if (!amount || isNaN(numericAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount < 100) {
      setError('Minimum amount is ₹100');
      return;
    }

    setError('');
    alert(`Recharge of ₹${amount} initiated.`);
    // Add recharge logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
     <button onClick={() => navigate('/account')} className="text-yellow-300 mb-4 font-medium">
  ← Back
</button>


      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Recharge</h1>

      {/* Input Field */}
      <div className="mb-4">
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
        {error && (
          <p className="text-red-500 mt-2 text-sm font-semibold">{error}</p>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {presetAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => handlePresetClick(amt)}
            className="bg-white bg-opacity-20 hover:bg-yellow-400 hover:text-black text-white font-semibold py-2 rounded-xl transition"
          >
            ₹{amt}
          </button>
        ))}
      </div>

      {/* Recharge Button */}
      <button
        onClick={handleRecharge}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition mb-6"
      >
        Recharge Now
      </button>

      {/* Rules Description */}
     {/* Rules Description */}
{/* Rules Description */}
<div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white">
  <h2 className="text-yellow-300 font-bold mb-2">Recharge Rules:</h2>
  <ul className="list-disc ml-4 space-y-1">
    <li className="pl-1 leading-relaxed">
      Minimum recharge amount is ₹100.
    </li>
    <li className="pl-1 leading-relaxed">
      Recharge is non-refundable once processed.
    </li>
    <li className="pl-1 leading-relaxed">
      Ensure your UPI/bank details are correct before proceeding.
    </li>
    <li className="pl-1 leading-relaxed">
      Recharge amount will reflect in your wallet instantly or within a few minutes.
    </li>
  </ul>
</div>


    </div>
  );
}
