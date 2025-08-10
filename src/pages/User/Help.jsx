import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Help() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [user, setUser] = useState({ username: '', email: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject || !message) {
      setError('Please enter both subject and message.');
      return;
    }

    setError('');
    setSubmitted(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/shubhamtiwari24092001@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          subject,
          message,
          _subject: 'New Help Request',
          _template: 'box',
          _captcha: 'false',
        }),
      });

      if (response.ok) {
        setSuccessMsg('🙏 Thank you for your patience. Our team will get back to you as soon as possible.');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || 'Something went wrong.');
        setSubmitted(false);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
      setSubmitted(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Help & Support</h1>
     <p className="text-sm bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-100 px-4 py-3 rounded-lg mb-6 shadow-md">
  Once you submit your help request, our support team will carefully review it and get back to you within <span className="font-semibold text-yellow-300">24 hours</span>.  
  <br />Please check your <span className="italic text-yellow-200">registered email</span> for our response.
</p>


      {/* Help Form */}
      <form onSubmit={handleSubmit}>
        {/* Hidden Fields */}
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

        {/* ✅ Success Message Below Button */}
        {successMsg && (
          <p className="text-green-300 mt-4 text-center text-sm font-semibold">{successMsg}</p>
        )}
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
