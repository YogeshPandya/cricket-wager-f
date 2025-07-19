// src/pages/User/Feedback.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [user, setUser] = useState({ username: '', email: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (stored) setUser(stored);
  }, []);

  const handleSubmit = (e) => {
    if (!message || rating === 0) {
      e.preventDefault();
      setError('Please provide a message and rating.');
      return;
    }

    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-6 font-semibold text-lg hover:underline"
      >
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Submit Feedback</h1>

      {/* FormSubmit Form */}
      <form
        action="https://formsubmit.co/shubhamtiwari24092001@gmail.com"
        method="POST"
        onSubmit={handleSubmit}
      >
        {/* Hidden user info */}
        <input type="hidden" name="username" value={user.username} />
        <input type="hidden" name="email" value={user.email} />
        <input type="hidden" name="rating" value={rating} />

        {/* Message */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Your Message</label>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your feedback here..."
            className="w-full px-4 py-2 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Star Rating */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Rate Us</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
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
          type="submit"
          disabled={submitted}
          className={`w-full ${
            submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
          } text-black font-bold py-3 rounded-xl text-lg shadow transition`}
        >
          {submitted ? 'Submitted' : 'Submit Feedback'}
        </button>

        {/* FormSubmit config */}
        <input type="hidden" name="_subject" value="New User Feedback" />
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_template" value="box" />
      </form>
    </div>
  );
}
