// src/pages/User/Feedback.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!message || rating === 0) {
      setError('Please provide a message and rating.');
      return;
    }

    setError('');
    alert(`Feedback submitted with rating ${rating} stars.`);
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button onClick={() => navigate('/account')} className="text-yellow-300 mb-6 font-semibold text-lg hover:underline">
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Submit Feedback</h1>

      {/* Feedback Message */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Your Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your feedback here..."
          className="w-full px-4 py-2 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium">Rate Us</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className={`text-2xl transition ${
                (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-400'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-400 text-sm font-medium mb-3">{error}</p>}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded-xl text-lg shadow transition"
      >
        Submit Feedback
      </button>
    </div>
  );
}
