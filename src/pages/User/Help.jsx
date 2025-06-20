// src/pages/User/Help.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (query.trim().length === 0) return;
    alert('Your query has been submitted. Our team will contact you shortly.');
    setSubmitted(true);
    setQuery('');
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

      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>

      {/* Message Box */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">Describe your issue or question</label>
        <textarea
          rows="6"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write your issue here..."
          className="w-full px-4 py-2 rounded-xl text-black text-base font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitted}
        className={`w-full ${
          submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
        } text-black font-bold py-3 rounded-xl text-lg shadow transition`}
      >
        {submitted ? 'Submitted' : 'Submit Query'}
      </button>

      {/* FAQ Section */}
      <div className="mt-8 bg-white bg-opacity-10 p-4 rounded-xl text-sm text-white">
        <h2 className="text-yellow-300 font-bold mb-2">Frequently Asked Questions:</h2>
        <ul className="list-disc ml-4 space-y-2">
          <li className="pl-1 leading-relaxed">
            <strong>Q: How do I recharge?</strong><br />
            A: Go to the Recharge section, enter an amount and confirm.
          </li>
          <li className="pl-1 leading-relaxed">
            <strong>Q: What if my withdrawal fails?</strong><br />
            A: Make sure your bank details are correct. Contact support if needed.
          </li>
          <li className="pl-1 leading-relaxed">
            <strong>Q: Can I change my registered number or email?</strong><br />
            A: Yes, go to the User Information section under Account.
          </li>
        </ul>
      </div>
    </div>
  );
}
