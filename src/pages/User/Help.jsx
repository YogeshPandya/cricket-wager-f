import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Help() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [user, setUser] = useState({ username: '', email: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = (e) => {
    if (!subject || !message) {
      e.preventDefault();
      setError('Please enter both subject and message.');
      return;
    }

    toast.success('Your query has been submitted! We will get back to you within 24 hours.');
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-gray-900 text-white p-4">
      {/* Toast Container */}
      <ToastContainer position="top-center" autoClose={4000} />

      {/* Back Button */}
      <button
        onClick={() => navigate('/account')}
        className="text-yellow-300 mb-6 font-semibold text-lg hover:underline"
      >
        ← Back
      </button>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
      <p className="text-sm text-yellow-200 mb-6">
  Once you submit your help request, our team will review it and respond within 24 hours. You will receive a reply on your registered email.
</p>

      {/* Help Form */}
      <form
        action="https://formsubmit.co/shubhamtiwari24092001@gmail.com"
        method="POST"
        onSubmit={handleSubmit}
      >
        {/* Hidden Fields to include user info */}
        <input type="hidden" name="username" value={user.username} />
        <input type="hidden" name="email" value={user.email} />

        {/* Subject Field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Subject</label>
          <input
            type="text"
            name="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter your subject"
            className="w-full px-4 py-2 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Message Field */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Message</label>
          <textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Describe your issue or question here..."
            className="w-full px-4 py-2 rounded-xl text-black font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          ></textarea>
        </div>

        {/* Error Display */}
        {error && <p className="text-red-400 text-sm font-medium mb-3">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitted}
          className={`w-full ${
            submitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300'
          } text-black font-bold py-3 rounded-xl text-lg shadow transition`}
        >
          {submitted ? 'Message Sent' : 'Submit'}
        </button>

        {/* FormSubmit Settings */}
        <input type="hidden" name="_subject" value="New Help Request" />
        <input type="hidden" name="_template" value="box" />
        <input type="hidden" name="_captcha" value="false" />
      </form>

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
