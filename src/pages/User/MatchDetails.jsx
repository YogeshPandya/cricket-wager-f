import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchDetails() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [amount, setAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedRatio, setSelectedRatio] = useState(null);

  const indiaRatio = 5;
  const australiaRatio = 5;
  const isMatchOver = indiaRatio === 0 || indiaRatio === 10 || australiaRatio === 0 || australiaRatio === 10;

  const questions = [
    { id: 1, question: 'Who will win the match?', options: ['India', 'Australia'] },
    { id: 2, question: 'What will be the total score of Team A?', options: ['Below 150', '150-180', '180-210', 'Above 210'] },
    { id: 3, question: 'Will the match have a century?', options: ['Yes', 'No'] },
    { id: 4, question: 'Who will hit most sixes?', options: ['India', 'Australia'] },
  ];

  const handleOptionClick = (question, option,ratio) => {
    setSelectedOption(option);
    setQuestionText(question);
    setAmount('');
    setErrorMsg('');
      setSelectedRatio(ratio);
    setShowPopup(true);
  };

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) < 10) {
      setErrorMsg('Minimum bet amount is ₹10');
      return;
    }
    alert(`You selected "${selectedOption}" for "${questionText}" with ₹${amount}`);
    setShowPopup(false);
  };

  const getCommissionByRatio = (ratio) => {
    if (ratio === 1) return 0.18;
    if (ratio === 2) return 0.15;
    if (ratio === 3) return 0.12;
    if (ratio === 4) return 0.10;
    if (ratio === 5) return 0.08;
    if (ratio === 6) return 0.06;
    if (ratio === 7) return 0.05;
    if (ratio === 8) return 0.04;
    if (ratio === 9) return 0.03;
    return 0;
  };

  const calculatePayout = () => {
    const amt = parseFloat(amount);
    if (questionText === 'Who will win the match?') {
      const ratio = selectedOption === 'India' ? indiaRatio : australiaRatio;
      const rawMultiplier = 10 / ratio;
      const commission = getCommissionByRatio(ratio);
      const finalMultiplier = rawMultiplier * (1 - commission);
      const payout = amt * finalMultiplier;
      return `You will get ₹${Math.round(payout)} (${finalMultiplier.toFixed(2)}x return)`;
    } else {
      const payout = amt * 2; // Fixed 2x return
      const finalPayout = payout * 0.9; // 10% commission
      return `You will get ₹${Math.round(finalPayout)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-black text-white p-4 relative font-sans">
      <button onClick={() => navigate('/home')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide text-yellow-400 drop-shadow">India vs Australia</h1>
        <p className="text-gray-300 text-sm mt-1">Live Match - Place Your Predictions Now!</p>
        <div className="w-24 h-1 bg-yellow-400 mx-auto mt-3 rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white bg-opacity-10 p-6 rounded-2xl mb-8 shadow-lg border border-yellow-400">
        <div className="flex flex-row justify-between items-center w-full sm:gap-10 text-center">
          <div className="flex-1">
            <p className="text-yellow-300 text-xl font-bold">India</p>
            <p className="text-white text-lg">{indiaRatio}/10</p>
          </div>
          <div className="flex-1">
            <p className="text-yellow-300 text-xl font-bold">Australia</p>
            <p className="text-white text-lg">{australiaRatio}/10</p>
          </div>
        </div>
      </div>

      {isMatchOver ? (
        <div className="bg-white bg-opacity-10 border border-red-400 p-6 rounded-2xl text-center text-red-300 font-semibold text-lg shadow-md">
          This match has ended. Stay tuned for results and exciting upcoming matches!
        </div>
      ) : (
        <div className="space-y-6">
      {questions.map((q) => {
  const numOptions = q.options.length;
  const ratios = numOptions === 2 ? [5, 5]
                : numOptions === 3 ? [4, 3, 3]
                : numOptions === 4 ? [3, 4, 2, 1]
                : Array(numOptions).fill(Math.floor(10 / numOptions));

  return (
    <div key={q.id} className="bg-white bg-opacity-10 p-6 rounded-2xl shadow-md border border-white/20">
      <h3 className="text-yellow-300 text-lg font-semibold mb-4">{q.question}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionClick(q.question, opt, ratios[idx])}
            className="bg-white bg-opacity-20 hover:bg-yellow-400 hover:text-black text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-md flex justify-between items-center px-4"
          >
            <span>{opt}</span>
            <span className="ml-3 inline-block bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full shadow-md">
  {ratios[idx]}
</span>

          </button>
        ))}
      </div>
    </div>
  );
})}

        </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <div className="bg-gradient-to-br from-green-700 to-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Confirm Your Bet</h2>
            <p className="mb-2 text-sm">Question: <span className="font-semibold">{questionText}</span></p>
            <p className="mb-4 text-sm">Selected Option: <span className="font-semibold">{selectedOption}</span></p>
            <p className="mb-2 text-sm">
  Rate: <span className="font-semibold text-yellow-400">{selectedRatio}</span>
</p>

            <label className="block mb-2 text-sm font-medium">Enter Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter amount"
              min={10}
            />

            {errorMsg && <p className="text-red-400 text-sm mt-2">{errorMsg}</p>}

            {amount >= 10 && (
              <p className="text-green-300 font-bold mt-4 mb-2">{calculatePayout()}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-40 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
