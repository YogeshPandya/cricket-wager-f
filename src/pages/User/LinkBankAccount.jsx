import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LinkBankAccount() {
  const navigate = useNavigate();

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [holderName, setHolderName] = useState('');
  const [error, setError] = useState('');

  const banks = [
    'State Bank of India',
    'HDFC Bank',
    'ICICI Bank',
    'Axis Bank',
    'Punjab National Bank',
    'Bank of Baroda',
    'Kotak Mahindra Bank',
    'Yes Bank',
    'Union Bank of India',
    'IDFC First Bank',
    'Canara Bank',
    'IndusInd Bank',
  ];

  const handleSubmit = () => {
    if (!bankName || !accountNumber || !ifsc || !holderName) {
      setError('All fields are required');
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      setError('Invalid IFSC code format');
      return;
    }

    if (accountNumber.length < 9 || accountNumber.length > 18) {
      setError('Bank account number must be between 9 and 18 digits');
      return;
    }

    setError('');
    alert('Bank account linked successfully!');
    // Proceed with backend API integration
    navigate('/account');
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

      <h1 className="text-2xl font-bold mb-6">Link Bank Account</h1>

      <div className="space-y-4">
        {/* Bank Dropdown */}
        <div>
          <label className="block mb-1 text-sm font-medium">Select Bank</label>
          <select
            value={bankName}
            onChange={(e) => {
              setBankName(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">-- Select Bank --</option>
            {banks.map((bank, idx) => (
              <option key={idx} value={bank}>
                {bank}
              </option>
            ))}
          </select>
        </div>

        {/* Account Number */}
        <div>
          <label className="block mb-1 text-sm font-medium">Bank Account Number</label>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => {
              setAccountNumber(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter account number"
          />
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block mb-1 text-sm font-medium">IFSC Code</label>
          <input
            type="text"
            value={ifsc}
            onChange={(e) => {
              setIfsc(e.target.value.toUpperCase());
              setError('');
            }}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="e.g. SBIN0000123"
          />
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">Cardholder Name</label>
          <input
            type="text"
            value={holderName}
            onChange={(e) => {
              setHolderName(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Enter your name"
          />
        </div>

        {/* Error */}
        {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition"
        >
          Link Bank Account
        </button>
      </div>
    </div>
  );
}
