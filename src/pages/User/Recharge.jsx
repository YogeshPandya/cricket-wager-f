import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import UPI app logos
import gpayLogo from '../../assets/gpay.png';
import phonepeLogo from '../../assets/phonepe.png';
import paytmLogo from '../../assets/paytm.png';
import upiLogo from '../../assets/upi.png';

export default function Recharge() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [utr, setUtr] = useState('');
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupError, setPopupError] = useState('');

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
    setPopupError('');
    setShowPopup(true);
    setCountdown(600); // reset countdown on every open
  };

  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (showPopup && countdown === 0) {
      alert('❌ Time expired! Please start the recharge again.');
      setShowPopup(false);
      setAmount('');
      setUtr('');
    }
  }, [countdown, showPopup]);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secRemain = sec % 60;
    return `${min.toString().padStart(2, '0')}:${secRemain.toString().padStart(2, '0')}`;
  };

  const handlePopupSubmit = () => {
    if (!utr.trim()) {
      setPopupError('❌ Please enter the UTR number');
      return;
    }

    setIsSubmitting(true);
    setPopupError('');

    setTimeout(() => {
      alert(`✅ Recharge of ₹${amount} submitted.\nPlease wait 5–10 minutes for processing.`);
      setIsSubmitting(false);
      setShowPopup(false);
      setCountdown(600);
      setAmount('');
      setUtr('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      <button onClick={() => navigate('/account')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-6">Recharge</h1>

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
        {error && <p className="text-red-500 mt-2 text-sm font-semibold">{error}</p>}
      </div>

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

      <button
        onClick={handleRecharge}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition mb-6"
      >
        Recharge Now
      </button>

      <div className="bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white">
        <h2 className="text-yellow-300 font-bold mb-2">Recharge Rules:</h2>
        <ul className="list-disc ml-4 space-y-1">
          <li>Minimum recharge amount is ₹100.</li>
          <li>Recharge is non-refundable once processed.</li>
          <li>Ensure your UPI/bank details are correct before proceeding.</li>
          <li>Recharge amount will reflect in your wallet instantly or within a few minutes.</li>
        </ul>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black p-4 rounded-2xl w-full max-w-md max-h-screen overflow-hidden shadow-xl relative">
            <button
              onClick={() => {
                setShowPopup(false);
                setCountdown(600);
              }}
              className="absolute top-2 right-4 text-xl font-bold text-red-500 hover:text-red-700"
            >
              ×
            </button>

            <h2 className="text-xl font-bold text-green-600 mb-2 text-center">Complete Your Recharge</h2>
            <p className="text-sm mb-4 text-center">
              Scan the QR code below and complete the payment of <strong>₹{amount}</strong>. Enter the UTR number below after payment.
            </p>

            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=example@upi&pn=CricketWager"
              alt="QR Code"
              className="mx-auto mb-4 rounded border border-green-600"
            />

            <div className="mb-3">
              <label className="block mb-1 text-sm font-medium">Enter UTR Number</label>
              <input
                type="text"
                value={utr}
                onChange={(e) => {
                  setUtr(e.target.value);
                  setPopupError('');
                }}
                placeholder="e.g. 1234567890"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* UPI App Logos */}
            <div className="text-sm text-gray-700 mb-2 font-medium text-center">Use any UPI app like:</div>
            <div className="flex justify-center gap-4 mb-4">
              <img src={gpayLogo} alt="GPay" className="h-8" />
              <img src={phonepeLogo} alt="PhonePe" className="h-8" />
              <img src={paytmLogo} alt="Paytm" className="h-8" />
              <img src={upiLogo} alt="UPI" className="h-8" />
            </div>

            {/* Error or Status Message */}
            {popupError && (
              <p className="text-red-600 text-sm text-center font-semibold mb-2">{popupError}</p>
            )}

            <p className="text-center text-sm text-gray-700 font-semibold mb-2">
              ⏱ Time remaining: <span className="text-black">{formatTime(countdown)}</span>
            </p>

            {isSubmitting && (
              <p className="text-green-600 text-sm text-center font-semibold animate-pulse mb-2">
                ✅ Please wait 5–10 minutes for processing...
              </p>
            )}

            <button
              onClick={handlePopupSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl mb-2 transition"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
