import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MatchDetails() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [amount, setAmount] = useState('');

  const teamAChance = Math.min(10, Math.max(1, Math.floor(amount / 200) + 5));
  const teamBChance = 10 - teamAChance;

  const questions = [
    {
      id: 1,
      question: 'Who will win the match?',
      options: ['India', 'Australia'],
    },
    {
      id: 2,
      question: 'What will be the total score of Team A?',
      options: ['Below 150', '150-180', '180-210', 'Above 210'],
    },
    {
      id: 3,
      question: 'Will the match have a century?',
      options: ['Yes', 'No'],
    },
    {
      id: 4,
      question: 'Who will hit most sixes?',
      options: ['India', 'Australia'],
    },
  ];

  const handleOptionClick = (question, option) => {
    setSelectedOption(option);
    setQuestionText(question);
    setAmount('');
    setShowPopup(true);
  };

  const handleConfirm = () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    alert(`You selected "${selectedOption}" for "${questionText}" with ₹${amount}`);
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4 relative">
      {/* Back Button */}
      <button onClick={() => navigate('/home')} className="text-yellow-300 mb-4 font-medium">
        ← Back
      </button>

      {/* Match Title */}
     {/* Match Title Centered with Line */}
<div className="text-center mb-6">
  <h1 className="text-2xl font-extrabold text-white tracking-wide">India vs Australia</h1>
  <div className="w-20 h-1 bg-yellow-400 mx-auto mt-2 rounded-full" />
</div>


      {/* Winning Probability Section */}
      <div className="flex justify-between items-center bg-white bg-opacity-10 p-5 rounded-2xl mb-6 shadow-md">
        <div className="text-center">
          <p className="text-yellow-300 text-2xl font-bold">{teamAChance}/10</p>
          <p className="text-sm font-medium mt-1">India</p>
        </div>
        <p className="text-yellow-400 text-base font-semibold">Who will win the match?</p>
        <div className="text-center">
          <p className="text-yellow-300 text-2xl font-bold">{teamBChance}/10</p>
          <p className="text-sm font-medium mt-1">Australia</p>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white bg-opacity-10 p-5 rounded-2xl shadow">
            <h3 className="text-yellow-300 text-lg font-semibold mb-3">{q.question}</h3>
            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(q.question, opt)}
                  className="bg-white bg-opacity-20 hover:bg-yellow-400 hover:text-black text-white font-semibold py-3 rounded-xl transition shadow"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 px-4">
          <div className="bg-gradient-to-br from-green-500 to-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Confirm Your Bet</h2>
            <p className="mb-2 text-sm">Question: <span className="font-semibold">{questionText}</span></p>
            <p className="mb-4 text-sm">Selected Option: <span className="font-semibold">{selectedOption}</span></p>

            <label className="block mb-2 text-sm font-medium">Enter Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-black font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter amount"
              min={1}
            />

            {amount > 0 && (
              <p className="text-green-300 font-bold mt-4 mb-2">
                You will get ₹{amount * 2}
              </p>
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
